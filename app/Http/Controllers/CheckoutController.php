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
use App\Mail\BookingPendingMail;
use App\Mail\ETicketMail;
use App\Services\DokuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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

        // Load promotions that apply to this specific event OR all events (global)
        $promotions = \App\Models\Promotion::where(function ($q) use ($event) {
            $q->where('event_id', $event->id)->orWhereNull('event_id');
        })->where('quota', '>', 0)
          ->where('end_date', '>=', now())
          ->get();

        return Inertia::render('Checkout/Show', [
            'event' => $event->setAttribute('promotions', $promotions),
        ]);
    }

    /**
     * Store a new booking (lock stock, create pending transaction, create DOKU payment).
     */
    public function store(Request $request, DokuService $dokuService)
    {
        $request->validate([
            'event_id' => 'required|string|exists:events,id',
            'items' => 'required|array|min:1',
            'items.*.ticket_type_id' => 'required|integer|exists:tickets_types,id',
            'items.*.quantity' => 'required|integer|min:1|max:10',
            'attendees' => 'required|array',
            'attendees.*.name' => 'required|string|max:100',
            'attendees.*.email' => 'required|email|max:100',
            'promotion_id' => 'nullable|integer|exists:promotions,id',
        ]);

        $result = DB::transaction(function () use ($request, $dokuService) {
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
                    'ticket_type' => $ticketType,
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ];
            }

            // Apply promotion if provided
            $discount = 0;
            if ($request->promotion_id) {
                // Accept promos that are event-specific OR global (null event_id)
                $promotion = \App\Models\Promotion::lockForUpdate()
                    ->where('id', $request->promotion_id)
                    ->where(function ($q) use ($request) {
                        $q->where('event_id', $request->event_id)->orWhereNull('event_id');
                    })
                    ->firstOrFail();
                
                if ($promotion->quota <= 0) abort(422, 'Kuota promo sudah habis.');
                if ($totalAmount < $promotion->min_spending) abort(422, 'Tidak mencapai minimum belanja untuk promo ini.');
                if ($promotion->start_date && now()->isBefore($promotion->start_date)) abort(422, 'Promo belum aktif.');
                if ($promotion->end_date && now()->isAfter($promotion->end_date)) abort(422, 'Promo sudah kadaluarsa.');

                if (strtolower($promotion->discount_type) === 'percentage') {
                    $d = $totalAmount * ($promotion->discount_amount / 100);
                    if ($promotion->max_discount_amount) {
                        $d = min($d, $promotion->max_discount_amount);
                    }
                    $discount = $d;
                } else {
                    $discount = $promotion->discount_amount;
                }
                
                $discount = min($discount, $totalAmount);
                $totalAmount -= $discount;
                
                $promotion->decrement('quota');
            }

            $transactionId = 'TRX-' . strtoupper(Str::random(12));
            $expiryMinutes = config('doku.expiry_minutes', 60);
            $expiresAt = now()->addMinutes($expiryMinutes);

            // Attempt to create DOKU payment
            $dokuResponse = null;
            $dokuPaymentUrl = null;
            $dokuVaNumber = null;
            $isDokuEnabled = !empty(config('doku.client_id')) && !empty(config('doku.secret_key'));

            if ($isDokuEnabled && $totalAmount > 0) {
                $user = Auth::user();
                $dokuResponse = $dokuService->createVirtualAccount([
                    'invoice_number' => $transactionId,
                    'amount' => (int) $totalAmount,
                    'customer_id' => (string) $user->id,
                    'customer_name' => $user->name,
                    'customer_email' => $user->email,
                    'item_name' => 'EventHive Ticket',
                ]);

                if ($dokuResponse) {
                    $dokuPaymentUrl = $dokuResponse['response']['payment']['url'] ?? null;
                    $dokuVaNumber = $dokuResponse['response']['payment']['virtual_account_number']
                        ?? $dokuResponse['virtual_account_info']['virtual_account_number']
                        ?? null;
                }
            }

            $isFree = $totalAmount == 0;

            // Create payment record
            $payment = Payment::create([
                'payment_method' => 'Transfer',
                'payment_status' => $isFree ? 'Success' : 'Pending',
                'transaction_time' => now(),
                'doku_invoice_number' => $isDokuEnabled && !$isFree ? $transactionId : null,
                'doku_payment_url' => $dokuPaymentUrl,
                'doku_va_number' => $dokuVaNumber,
                'doku_raw_response' => $dokuResponse,
            ]);

            // Create transaction
            $transaction = Transaction::create([
                'id' => $transactionId,
                'total_amount' => $totalAmount,
                'transaction_status' => $isFree ? 'Success' : 'Pending',
                'user_id' => Auth::id(),
                'payment_id' => $payment->id,
                'event_id' => $request->event_id,
                'promotion_id' => $request->promotion_id,
                'expires_at' => $isFree ? null : $expiresAt,
            ]);

            $attendeeIdx = 0;

            // Create TransactionDetails, Tickets, and Attendees
            foreach ($resolvedItems as $item) {
                $detail = TransactionDetail::create([
                    'subtotal' => $item['subtotal'],
                    'quantity' => $item['quantity'],
                    'transaction_id' => $transaction->id,
                    'ticket_type_id' => $item['ticket_type']->id,
                ]);

                for ($i = 0; $i < $item['quantity']; $i++) {
                    $ticket = Ticket::create([
                        'id' => 'TKT-' . strtoupper(Str::random(12)),
                        'qr_code' => Str::uuid(),
                        'ticket_status' => $isFree ? 'Valid' : 'Pending',
                        'issued_at' => now(),
                        'transaction_detail_id' => $detail->id,
                        'ticket_type_id' => $item['ticket_type']->id,
                    ]);

                    $attendeeData = $request->attendees[$attendeeIdx] ?? [
                        'name' => Auth::user()->name,
                        'email' => Auth::user()->email,
                    ];

                    Attendee::create([
                        'name' => $attendeeData['name'],
                        'email' => $attendeeData['email'],
                        'phone_number' => $attendeeData['phone_number'] ?? '000000000',
                        'identity_number' => $attendeeData['identity_number'] ?? '000000000',
                        'ticket_id' => $ticket->id,
                    ]);

                    $attendeeIdx++;
                }
            }

            if (!$isFree) {
                // Dispatch auto-cancel job for pending transactions
                CancelExpiredBooking::dispatch($transaction->id)->delay($expiresAt);
                
                // Send Booking Pending Email
                $transaction->load('event');
                Mail::to(Auth::user()->email)->send(new BookingPendingMail($transaction));
            } else {
                // Send E-Ticket directly for free tickets
                $transaction->load('event', 'details.ticketType', 'details.tickets.attendee');
                Mail::to(Auth::user()->email)->send(new ETicketMail($transaction));
            }

            return [
                'transaction' => $transaction,
                'doku_payment_url' => $dokuPaymentUrl,
                'is_doku' => $isDokuEnabled && !$isFree,
                'is_free' => $isFree,
            ];
        });

        // If DOKU is enabled and we got a payment URL, redirect to DOKU
        if ($result['is_doku'] && $result['doku_payment_url']) {
            return Inertia::location($result['doku_payment_url']);
        }

        // If it's a completely free transaction, redirect straight to the success result page
        if ($result['is_free']) {
            return redirect()->route('checkout.result', $result['transaction']->id)->with('success', 'Pemesanan tiket gratis berhasil.');
        }

        // Fallback to manual payment page
        return redirect()->route('checkout.payment', $result['transaction']->id);
    }

    /**
     * Show the payment page (manual / fallback when DOKU URL not available).
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

        // If DOKU payment URL exists, redirect there
        if ($transaction->payment && $transaction->payment->doku_payment_url) {
            return Inertia::render('Checkout/Payment', [
                'transaction' => $transaction,
                'dokuPaymentUrl' => $transaction->payment->doku_payment_url,
            ]);
        }

        return Inertia::render('Checkout/Payment', [
            'transaction' => $transaction,
            'dokuPaymentUrl' => null,
        ]);
    }

    /**
     * Confirm payment by user (manual fallback).
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
                'payment_status' => 'Success',
            ]);

            // Mark all tickets as issued
            foreach ($transaction->details as $detail) {
                foreach ($detail->tickets as $ticket) {
                    $ticket->update(['ticket_status' => 'Valid']);
                }
            }

            // Send E-Ticket Email
            Mail::to(Auth::user()->email)->send(new ETicketMail($transaction));
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
            $transaction->update(['transaction_status' => 'Failed']);
            if ($transaction->payment) {
                $transaction->payment->update(['payment_status' => 'Failed']);
            }
        });

        return redirect()->route('checkout.result', $transactionId)->with('success', 'Transaksi berhasil dibatalkan.');
    }

    /**
     * Show booking result page.
     */
    public function result(Request $request, string $transactionId, DokuService $dokuService)
    {
        $transaction = Transaction::with([
            'event',
            'payment',
            'details.ticketType',
            'details.tickets.attendee',
        ])->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // 1. Check for POST data from DOKU (Redirection with results)
        if ($request->isMethod('post')) {
            $data = $request->all();
            $status = strtoupper($data['transaction']['status'] ?? ($data['status'] ?? ''));
            
            if ($status === 'SUCCESS' || $status === 'FAILED' || $status === 'CANCEL' || $status === 'CANCELLED') {
                $this->updateTransactionStatus($transaction, $status, $data);
                return redirect()->route('checkout.result', $transactionId);
            }
        }

        // 2. Check for manual cancellation via GET query parameters
        if ($transaction->transaction_status === 'Pending') {
            $queryParams = [
                strtoupper($request->query('status', '')),
                strtoupper($request->query('res', '')),
                strtoupper($request->query('result', '')),
                $request->query('response_code', '')
            ];

            if (array_intersect($queryParams, ['CANCEL', 'CANCELLED', 'FAILED', '0002', '5001'])) {
                $this->updateTransactionStatus($transaction, 'FAILED');
                return redirect()->route('checkout.result', $transactionId)->with('error', 'Pesanan dibatalkan.');
            }
        }

        // 3. Fallback: Sync status via API if still pending
        if ($transaction->transaction_status === 'Pending' && $transaction->payment && $transaction->payment->doku_invoice_number) {
            // We'll try common status check endpoints
            $dokuStatus = $dokuService->checkPaymentStatus($transaction->payment->doku_invoice_number);
            
            if ($dokuStatus && isset($dokuStatus['transaction']['status'])) {
                $this->updateTransactionStatus($transaction, strtoupper($dokuStatus['transaction']['status']), $dokuStatus);
            }
        }

        return Inertia::render('Checkout/Result', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Helper to update transaction status and restore stock if failed.
     */
    private function updateTransactionStatus($transaction, $status, $rawData = null)
    {
        if ($transaction->transaction_status !== 'Pending') return;

        DB::transaction(function () use ($transaction, $status, $rawData) {
            if ($status === 'SUCCESS') {
                $transaction->update(['transaction_status' => 'Success']);
                if ($transaction->payment) {
                    $transaction->payment->update(['payment_status' => 'Success', 'doku_raw_response' => $rawData]);
                }
                foreach ($transaction->details as $detail) {
                    foreach ($detail->tickets as $ticket) {
                        $ticket->update(['ticket_status' => 'Valid']);
                    }
                }
            } elseif (in_array($status, ['FAILED', 'EXPIRED', 'DENIED', 'CANCEL', 'CANCELLED'])) {
                $transaction->update(['transaction_status' => 'Failed']);
                if ($transaction->payment) {
                    $transaction->payment->update(['payment_status' => 'Failed', 'doku_raw_response' => $rawData]);
                }
                // Restore stock
                foreach ($transaction->details as $detail) {
                    if ($detail->ticketType) {
                        $detail->ticketType->increment('available_stock', $detail->quantity);
                    }
                }
            }
        });
    }


    /**
     * Sync transaction status with DOKU manually.
     */
    public function syncPaymentStatus(string $transactionId)
    {
        $transaction = Transaction::with('payment')
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // If still pending, we might want to check the actual status via API
        // For now, we'll just return to the result page which will trigger a re-render
        return redirect()->route('checkout.result', $transactionId)
            ->with('info', 'Status pembayaran sedang diverifikasi.');
    }
}
