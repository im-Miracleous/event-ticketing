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

        for ($i = 0; $i < 200; $i++) {
            $buyer = $buyerUsers->random();
            $event = $activeEvents->random();
            $ticketType = $event->ticketTypes->random();
            $qty = rand(1, 3);
            $subtotal = $ticketType->price * $qty;
            $txnStatus = fake()->randomElement(['Success', 'Success', 'Success', 'Success', 'Failed', 'Cancelled']);

            // Spread transactions over the last 365 days
            $paymentDate = now()->subDays(rand(0, 365))->subHours(rand(0, 23));

            $payment = Payment::create([
                'payment_method'  => fake()->randomElement(['Transfer', 'E-Wallet', 'Credit Card']),
                'payment_status'  => $txnStatus === 'Success' ? 'Paid' : 'Failed',
                'transaction_time' => $paymentDate,
                'created_at' => $paymentDate,
                'updated_at' => $paymentDate,
            ]);

            $txn = Transaction::create([
                'id'                 => 'TXN-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT) . '-' . $paymentDate->format('ymd'),
                'total_amount'       => $subtotal,
                'transaction_status' => $txnStatus,
                'user_id'            => $buyer->id,
                'payment_id'         => $payment->id,
                'event_id'           => $event->id,
                'promotion_id'       => null,
                'created_at' => $paymentDate,
                'updated_at' => $paymentDate,
            ]);

            $detail = TransactionDetail::create([
                'subtotal'       => $subtotal,
                'quantity'       => $qty,
                'transaction_id' => $txn->id,
                'ticket_type_id' => $ticketType->id,
                'created_at' => $paymentDate,
                'updated_at' => $paymentDate,
            ]);

            // Create tickets and attendees for each quantity
            if ($txnStatus === 'Success') {
                for ($j = 0; $j < $qty; $j++) {
                    $ticketId = \Illuminate\Support\Str::uuid()->toString();
                    \App\Models\Ticket::create([
                        'id' => $ticketId,
                        'qr_code' => 'TKT-' . strtoupper(\Illuminate\Support\Str::random(10)),
                        'ticket_status' => 'Issued', // Matched with migration: Issued, Scanned, Cancelled, Expired
                        'issued_at' => $paymentDate,
                        'transaction_detail_id' => $detail->id,
                        'ticket_type_id' => $ticketType->id,
                        'created_at' => $paymentDate,
                        'updated_at' => $paymentDate,
                    ]);

                    \App\Models\Attendee::create([
                        'name' => fake()->name(),
                        'email' => fake()->safeEmail(),
                        'phone_number' => fake()->phoneNumber(),
                        'identity_number' => fake()->numerify('################'),
                        'ticket_id' => $ticketId,
                        'created_at' => $paymentDate,
                        'updated_at' => $paymentDate,
                    ]);
                }
            }
        }
    }
}
