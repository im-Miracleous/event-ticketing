<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Database\Seeder;

class TicketTypeSeeder extends Seeder
{
    /**
     * Seed ticket types for each event.
     */
    public function run(): void
    {
        $events = Event::all();

        foreach ($events as $event) {
            if (TicketType::where('event_id', $event->id)->exists()) continue;

            $types = [
                ['Regular',  100000, (int)($event->total_quota * 0.6)],
                ['VIP',      250000, (int)($event->total_quota * 0.3)],
                ['VVIP',     500000, (int)($event->total_quota * 0.1)],
            ];

            foreach ($types as $type) {
                $sold = $event->status === 'Active' ? rand(0, (int)($type[2] * 0.8)) : 0;
                TicketType::create([
                    'name'            => $type[0],
                    'price'           => $type[1],
                    'quota'           => $type[2],
                    'available_stock' => $type[2] - $sold,
                    'event_id'        => $event->id,
                ]);
            }
        }
    }
}
