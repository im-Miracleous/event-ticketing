<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class PromotionSeeder extends Seeder
{
    /**
     * Seed promotion codes.
     */
    public function run(): void
    {
        $events = Event::all();

        if ($events->count() === 0) return;

        // Clear existing promotions to ensure fresh mix of fixed/percentage types
        Schema::disableForeignKeyConstraints();
        Promotion::truncate();
        Schema::enableForeignKeyConstraints();

        /**
         * [
         *   Code, 
         *   Amount (fixed/%), 
         *   Type (fixed/percentage), 
         *   Max Discount (null for fixed, decimal for percentage), 
         *   Min Spending, 
         *   Quota, 
         *   End Date
         * ]
         */
        $promoCodes = [
            ['WELCOME2026', 15,     'percentage', 50000,  0,      500,  'Apr 30, 2026'],
            ['SUMMERFEST',  20,     'percentage', 100000, 250000, 1000, 'Jun 30, 2026'],
            ['FLASH50K',    50000,  'fixed',      null,   150000, 50,   'Mar 25, 2026'],
            ['EARLYBIRD',   10,     'percentage', 25000,  0,      200,  'May 15, 2026'],
            ['RAMADAN2026', 30,     'percentage', 75000,  100000, 250,  'Apr 20, 2026'],
            ['VIP25K',      25000,  'fixed',      null,   500000, 100,  'Apr 01, 2026'],
            ['STUDENT15',   15,     'percentage', null,   0,      500,  'Dec 31, 2026'],
            ['NEWYEAR27',   25,     'percentage', 150000, 300000, 300,  'Jan 15, 2027'],
            ['LAUNCH2026',  50,     'percentage', 200000, 400000, 100,  'Feb 28, 2026'],
            ['LOYALCUST',   150000, 'fixed',      null,   1000000,20,   'Aug 31, 2026'],
        ];

        foreach ($promoCodes as $idx => $p) {
            if (Promotion::where('code', $p[0])->exists()) continue;

            Promotion::create([
                'code'                => $p[0],
                'discount_amount'     => $p[1],
                'discount_type'       => $p[2],
                'max_discount_amount' => $p[3],
                'min_spending'        => $p[4],
                'quota'               => $p[5],
                'start_date'          => now()->subDays(rand(10, 60)),
                'end_date'            => Carbon::parse($p[6]),
                'event_id'            => $events[$idx % $events->count()]->id,
            ]);
        }
    }
}
