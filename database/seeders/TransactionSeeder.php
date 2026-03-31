<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Seed payments, transactions, and transaction details.
     */
    public function run(): void
    {
        $activeEvents = Event::where('status', 'Active')->with('ticketTypes')->get();
        $buyerUsers = User::where('role', 'User')->get();

        if ($buyerUsers->count() === 0 || $activeEvents->count() === 0) {
            return;
        }

        for ($i = 0; $i < 60; $i++) {
            $buyer = $buyerUsers->random();
            $event = $activeEvents->random();
            $ticketType = $event->ticketTypes->random();
            $qty = rand(1, 3);
            $subtotal = $ticketType->price * $qty;
            $txnStatus = fake()->randomElement(['Success', 'Success', 'Success', 'Pending', 'Failed']);

            $payment = Payment::create([
                'payment_method'  => fake()->randomElement(['Transfer', 'E-Wallet', 'Credit Card']),
                'payment_status'  => $txnStatus === 'Success' ? 'Paid' : ($txnStatus === 'Pending' ? 'Pending' : 'Failed'),
                'transaction_time' => now()->subDays(rand(0, 60))->subHours(rand(0, 23)),
            ]);

            $txn = Transaction::create([
                'id'                 => 'TXN-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'total_amount'       => $subtotal,
                'transaction_status' => $txnStatus,
                'user_id'            => $buyer->id,
                'payment_id'         => $payment->id,
                'event_id'           => $event->id,
                'promotion_id'       => null,
            ]);

            TransactionDetail::create([
                'subtotal'       => $subtotal,
                'quantity'       => $qty,
                'transaction_id' => $txn->id,
                'ticket_type_id' => $ticketType->id,
            ]);
        }
    }
}
