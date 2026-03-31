<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1 ─── Default Admin & Organizer accounts (from .env)
            UserSeeder::class,

            // 2 ─── App settings
            AppSettingSeeder::class,

            // 3 ─── Event categories
            EventCategorySeeder::class,

            // 4 ─── Regular users (30 users with various roles)
            RegularUserSeeder::class,

            // 5 ─── Organizer profiles (linked to Organizer-role users)
            OrganizerSeeder::class,

            // 6 ─── Events (18 events across categories)
            EventSeeder::class,

            // 7 ─── Ticket types (Regular / VIP / VVIP per event)
            TicketTypeSeeder::class,

            // 8 ─── Transactions (payments, transactions, details)
            TransactionSeeder::class,

            // 9 ─── Promotions (12 promo codes)
            PromotionSeeder::class,

            // 10 ── Tickets & validation logs
            TicketAndValidationSeeder::class,
        ]);
    }
}
