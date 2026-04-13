<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('reminders:send-event')->dailyAt('09:00');

Artisan::command('app:cancel-expired-bookings', function () {
    $expiredTransactions = \App\Models\Transaction::with('details.ticketType')
        ->where('transaction_status', 'Pending')
        ->where('expires_at', '<', now())
        ->get();

    if ($expiredTransactions->isEmpty()) {
        $this->info("No expired pending transactions found.");
        return;
    }

    foreach ($expiredTransactions as $transaction) {
        \Illuminate\Support\Facades\DB::transaction(function () use ($transaction) {
            foreach ($transaction->details as $detail) {
                if ($detail->ticketType) {
                    $detail->ticketType->increment('available_stock', $detail->quantity);
                }
            }
            $transaction->update(['transaction_status' => 'Failed']);
            if ($transaction->payment) {
                $transaction->payment->update(['payment_status' => 'Failed']);
            }

            // Cancel all associated tickets
            foreach ($transaction->details as $detail) {
                foreach ($detail->tickets as $ticket) {
                    $ticket->update(['ticket_status' => 'Cancelled']);
                }
            }
        });
        $this->info("Transaction {$transaction->id} and its tickets have been cancelled/failed.");
    }
})->purpose('Find and fail all expired pending transactions');

Schedule::command('app:cancel-expired-bookings')->everyMinute();
