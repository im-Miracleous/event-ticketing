<?php

namespace App\Http\Controllers;

use App\Jobs\CancelExpiredBooking;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\Payment;
use App\Models\TicketType;
use App\Models\TransactionDetail;
use App\Models\Ticket;
use App\Models\Attendee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page for an event.
     */
    public function show(Event $event)
    {
        $event->load(['category', 'organizer', 'ticketTypes']);

        return Inertia::render('Checkout/Show', [
            'event' => $event,
        ]);
    }

    /**
     * Store a new booking (lock stock, create pending transaction).
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id'         => 'required|string|exists:events,id',
            'items'            => 'required|array|min:1',
            'items.*.ticket_type_id' => 'required|integer|exists:tickets_types,id',
            'items.*.quantity' => 'required|integer|min:1|max:10',
            'attendees'        => 'required|array',
            'attendees.*.name'  => 'required|string|max:100',
            'attendees.*.email' => 'required|email|max:100',
        ]);

        $result = DB::transaction(function () use ($request) {
            $totalAmount = 0;
            $resolvedItems = [];

            // Lock stock and validate quantities
            foreach ($request->items as $item) {
                $ticketType = TicketType::lockForUpdate()->findOrFail($item['ticket_type_id']);

                if ($ticketType->available_stock < $item['quantity']) {
                    abort(422, "Stok untuk tiket \"{$ticketType->name}\" tidak mencukupi. Tersisa: {$ticketType->available_stock}");
                }

                $ticketType->decrement('available_stock', $item['quantity']);

                $subtotal = $ticketType->price * $item['quantity'];
                $totalAmount += $subtotal;

                $resolvedItems[] = [
                    'ticket_type'  => $ticketType,
                    'quantity'     => $item['quantity'],
                    'subtotal'     => $subtotal,
                ];
            }

            // Create payment record
            $payment = Payment::create([
                'payment_method'   => 'Transfer',
                'payment_status'   => 'Pending',
                'transaction_time' => now(),
            ]);

            $expiresAt = now()->addMinutes(15);

            // Create transaction
            $transaction = Transaction::create([
                'id'                 => 'TRX-' . strtoupper(Str::random(12)),
                'total_amount'       => $totalAmount,
                'transaction_status' => 'Pending',
                'user_id'            => Auth::id(),
                'payment_id'         => $payment->id,
                'event_id'           => $request->event_id,
                'expires_at'         => $expiresAt,
            ]);

            $attendeeIdx = 0;

            // Create TransactionDetails, Tickets, and Attendees
            foreach ($resolvedItems as $item) {
                $detail = TransactionDetail::create([
                    'subtotal'       => $item['subtotal'],
                    'quantity'       => $item['quantity'],
                    'transaction_id' => $transaction->id,
                    'ticket_type_id' => $item['ticket_type']->id,
                ]);

                for ($i = 0; $i < $item['quantity']; $i++) {
                    $ticket = Ticket::create([
                        'id'                  => 'TKT-' . strtoupper(Str::random(12)),
                        'qr_code'             => Str::uuid(),
                        'ticket_status'       => 'Pending',
                        'issued_at'           => now(),
                        'transaction_detail_id' => $detail->id,
                        'ticket_type_id'      => $item['ticket_type']->id,
                    ]);

                    $attendeeData = $request->attendees[$attendeeIdx] ?? [
                        'name'  => Auth::user()->name,
                        'email' => Auth::user()->email,
                    ];

                    Attendee::create([
                        'name'      => $attendeeData['name'],
                        'email'     => $attendeeData['email'],
                        'ticket_id' => $ticket->id,
                    ]);

                    $attendeeIdx++;
                }
            }

            // Dispatch auto-cancel job after 15 minutes
            CancelExpiredBooking::dispatch($transaction->id)->delay($expiresAt);

            return $transaction;
        });

        return redirect()->route('checkout.payment', $result->id);
    }

    /**
     * Show the payment page.
     */
    public function payment(string $transactionId)
    {
        $transaction = Transaction::with([
            'event',
            'payment',
            'details.ticketType',
            'details.tickets.attendee',
        ])->where('id', $transactionId)
          ->where('user_id', Auth::id())
          ->firstOrFail();

        if ($transaction->transaction_status !== 'Pending') {
            return redirect()->route('checkout.result', $transactionId);
        }

        return Inertia::render('Checkout/Payment', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Confirm payment by user.
     */
    public function confirmPayment(Request $request, string $transactionId)
    {
        $request->validate([
            'payment_method' => 'required|in:Cash,Transfer,E-Wallet,Credit Card',
        ]);

        $transaction = Transaction::with('payment')
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($transaction->transaction_status !== 'Pending') {
            return back()->withErrors(['message' => 'Transaksi sudah tidak aktif.']);
        }

        if ($transaction->expires_at && now()->isAfter($transaction->expires_at)) {
            return back()->withErrors(['message' => 'Waktu pembayaran telah habis.']);
        }

        DB::transaction(function () use ($transaction, $request) {
            $transaction->update(['transaction_status' => 'Success']);
            $transaction->payment->update([
                'payment_method' => $request->payment_method,
                'payment_status' => 'Paid',
            ]);

            // Mark all tickets as issued
            foreach ($transaction->details as $detail) {
                foreach ($detail->tickets as $ticket) {
                    $ticket->update(['ticket_status' => 'Active']);
                }
            }
        });

        return redirect()->route('checkout.result', $transactionId);
    }

    /**
     * Cancel a pending transaction (user-initiated).
     */
    public function cancel(string $transactionId)
    {
        $transaction = Transaction::with('details.ticketType', 'payment')
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($transaction->transaction_status !== 'Pending') {
            return back()->withErrors(['message' => 'Hanya transaksi Pending yang bisa dibatalkan.']);
        }

        DB::transaction(function () use ($transaction) {
            foreach ($transaction->details as $detail) {
                if ($detail->ticketType) {
                    $detail->ticketType->increment('available_stock', $detail->quantity);
                }
            }
            $transaction->update(['transaction_status' => 'Cancelled']);
            if ($transaction->payment) {
                $transaction->payment->update(['payment_status' => 'Cancelled']);
            }
        });

        return redirect()->route('events.index')->with('success', 'Transaksi berhasil dibatalkan.');
    }

    /**
     * Show booking result page.
     */
    public function result(string $transactionId)
    {
        $transaction = Transaction::with([
            'event',
            'payment',
            'details.ticketType',
            'details.tickets.attendee',
        ])->where('id', $transactionId)
          ->where('user_id', Auth::id())
          ->firstOrFail();

        return Inertia::render('Checkout/Result', [
            'transaction' => $transaction,
        ]);
    }
}
