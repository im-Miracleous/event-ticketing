<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TransactionDetail;
use App\Models\ValidationLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TicketAndValidationSeeder extends Seeder
{
    /**
     * Seed tickets and validation logs.
     */
    public function run(): void
    {
        $tickets = Ticket::all();

        if ($tickets->isEmpty()) {
            // Create some sample tickets from transaction details
            $details = TransactionDetail::with('ticketType')->limit(20)->get();
            foreach ($details as $detail) {
                for ($q = 0; $q < min($detail->quantity, 2); $q++) {
                    $ticketStatus = fake()->randomElement(['Issued', 'Scanned', 'Cancelled']);
                    $ticket = Ticket::create([
                        'id'                    => Str::uuid()->toString(),
                        'qr_code'               => 'QR-' . Str::upper(Str::random(8)),
                        'ticket_status'         => $ticketStatus,
                        'issued_at'             => now()->subDays(rand(1, 30)),
                        'validated_at'          => $ticketStatus === 'Scanned' ? now()->subDays(rand(0, 5)) : null,
                        'transaction_detail_id' => $detail->id,
                        'ticket_type_id'        => $detail->ticket_type_id,
                    ]);

                    // Add attendee for each ticket
                    $user = $detail->transaction->user;
                    \App\Models\Attendee::create([
                        'name'            => $user->name ?? fake()->name(),
                        'email'           => $user->email ?? fake()->safeEmail(),
                        'phone_number'    => fake()->phoneNumber(),
                        'identity_number' => fake()->numerify('################'),
                        'ticket_id'       => $ticket->id,
                    ]);

                    // Add validation log for used tickets
                    if ($ticketStatus === 'Scanned') {
                        ValidationLog::create([
                            'validation_time' => $ticket->validated_at,
                            'result'          => 'Valid',
                            'ticket_id'       => $ticket->id,
                        ]);
                    }
                }
            }
        }

        // Add some extra validation logs
        $existingTickets = Ticket::limit(5)->get();
        foreach ($existingTickets as $ticket) {
            ValidationLog::firstOrCreate(
                ['ticket_id' => $ticket->id, 'result' => fake()->randomElement(['Valid', 'Invalid', 'Expired', 'Already Scanned'])],
                ['validation_time' => now()->subHours(rand(1, 72))]
            );
        }
    }
}
