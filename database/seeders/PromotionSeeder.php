<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    /**
     * Seed promotion codes.
     */
    public function run(): void
    {
        $events = Event::all();

        $promoCodes = [
            ['WELCOME2026', 15,     500,  'Apr 30, 2026'],
            ['SUMMERFEST',  20,     1000, 'Jun 30, 2026'],
            ['FLASH50K',    50000,  50,   'Mar 25, 2026'],
            ['EARLYBIRD',   10,     200,  'May 15, 2026'],
            ['BUNDLEDEAL',  100000, 100,  'Jul 01, 2026'],
            ['NEWYEAR27',   25,     300,  'Jan 15, 2027'],
            ['STUDENT15',   15,     500,  'Dec 31, 2026'],
            ['VIP25K',      25000,  100,  'Apr 01, 2026'],
            ['RAMADAN2026', 30,     250,  'Apr 20, 2026'],
            ['GROUPBUY',    75000,  50,   'May 30, 2026'],
            ['LAUNCH2026',  50,     100,  'Feb 28, 2026'],
            ['LOYALCUST',   150000, 20,   'Aug 31, 2026'],
        ];

        foreach ($promoCodes as $idx => $p) {
            if (Promotion::where('code', $p[0])->exists()) continue;

            Promotion::create([
                'code'            => $p[0],
                'discount_amount' => $p[1],
                'quota'           => $p[2],
                'start_date'      => now()->subDays(rand(10, 60)),
                'end_date'        => Carbon::parse($p[3]),
                'event_id'        => $events[$idx % $events->count()]->id,
            ]);
        }
    }
}
