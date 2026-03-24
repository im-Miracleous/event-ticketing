<?php

namespace App\Jobs;

use App\Models\Transaction;
use App\Models\TicketType;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CancelExpiredBooking implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public string $transactionId) {}

    public function handle(): void
    {
        DB::transaction(function () {
            $transaction = Transaction::with('details.ticketType')
                ->lockForUpdate()
                ->find($this->transactionId);

            // Only cancel if still pending and expired
            if (!$transaction || $transaction->transaction_status !== 'Pending') {
                return;
            }

            if ($transaction->expires_at && now()->lessThan($transaction->expires_at)) {
                return; // Not expired yet
            }

            // Restore stock for each ticket type
            foreach ($transaction->details as $detail) {
                if ($detail->ticketType) {
                    $detail->ticketType->increment('available_stock', $detail->quantity);
                }
            }

            // Cancel transaction and payment
            $transaction->update(['transaction_status' => 'Cancelled']);
            if ($transaction->payment) {
                $transaction->payment->update(['payment_status' => 'Cancelled']);
            }

            Log::info("Transaction {$this->transactionId} expired and was cancelled.");
        });
    }
}
