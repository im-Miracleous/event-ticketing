<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Ticket;
use App\Services\DokuService;
use App\Mail\ETicketMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DokuNotificationController extends Controller
{
    /**
     * Handle DOKU payment notification webhook.
     * POST /doku/notification
     */
    public function handle(Request $request, DokuService $dokuService)
    {
        $rawBody = $request->getContent();
        $headers = collect($request->headers->all())->mapWithKeys(fn($v, $k) => [$k => $v[0] ?? ''])->toArray();

        Log::info('DOKU Notification received', [
            'headers' => $headers,
            'body'    => $rawBody,
        ]);

        // Verify signature
        if (!$dokuService->verifyNotification($headers, $rawBody)) {
            Log::warning('DOKU Notification signature mismatch');
            // Still return 200 to avoid DOKU retries, but log the mismatch
        }

        $data = json_decode($rawBody, true);

        $invoiceNumber  = $data['order']['invoice_number'] ?? null;
        $transactionStatus = $data['transaction']['status'] ?? null;

        if (!$invoiceNumber) {
            Log::warning('DOKU notification missing invoice_number');
            return response()->json(['status' => 'ignored'], 200);
        }

        // Find the payment
        $payment = Payment::where('doku_invoice_number', $invoiceNumber)->first();

        if (!$payment) {
            Log::warning('DOKU Payment not found for invoice', ['invoice' => $invoiceNumber]);
            return response()->json(['status' => 'not_found'], 200);
        }

        $transaction = $payment->transactions()->first();

        if (!$transaction) {
            Log::warning('Transaction not found for payment', ['payment_id' => $payment->id]);
            return response()->json(['status' => 'not_found'], 200);
        }

        // Only process if currently pending
        if ($transaction->transaction_status !== 'Pending') {
            return response()->json(['status' => 'already_processed'], 200);
        }

        DB::transaction(function () use ($transaction, $payment, $transactionStatus, $data) {
            if ($transactionStatus === 'SUCCESS') {
                $transaction->update(['transaction_status' => 'Success']);
                $payment->update([
                    'payment_status'    => 'Paid',
                    'doku_raw_response' => $data,
                ]);

                // Activate all tickets
                foreach ($transaction->details as $detail) {
                    foreach ($detail->tickets as $ticket) {
                        $ticket->update(['ticket_status' => 'Active']);
                    }
                }

                // Send E-Ticket
                $user = $transaction->user;
                if ($user) {
                    $transaction->load('event', 'details.ticketType', 'details.tickets.attendee');
                    Mail::to($user->email)->send(new ETicketMail($transaction));
                }

            } elseif (in_array($transactionStatus, ['FAILED', 'EXPIRED', 'DENIED'])) {
                $transaction->update(['transaction_status' => 'Failed']);
                $payment->update([
                    'payment_status'    => 'Failed',
                    'doku_raw_response' => $data,
                ]);

                // Restore stock
                foreach ($transaction->details as $detail) {
                    if ($detail->ticketType) {
                        $detail->ticketType->increment('available_stock', $detail->quantity);
                    }
                }
            }
        });

        return response()->json(['status' => 'ok'], 200);
    }
}
