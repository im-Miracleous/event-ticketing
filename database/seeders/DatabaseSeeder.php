<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use App\Models\Payment;
use App\Models\Promotion;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use App\Models\ValidationLog;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1 ─── Seed Admin & Organizer from .env ─────────────────
        $this->call([
            UserSeeder::class,
            AppSettingSeeder::class,
        ]);

        // 2 ─── Event Categories ─────────────────────────────────
        $categoryNames = [
            'Technology' => 'Tech conferences, hackathons, and innovation events',
            'Music'      => 'Concerts, festivals, and live music performances',
            'Sports'     => 'Marathons, tournaments, and fitness events',
            'Arts'       => 'Exhibitions, galleries, and creative showcases',
            'Business'   => 'Networking, summits, and entrepreneurship events',
            'Education'  => 'Workshops, bootcamps, and seminars',
            'Food'       => 'Food festivals, culinary workshops, and tastings',
            'Charity'    => 'Fundraisers, galas, and community service events',
        ];

        $categories = [];
        foreach ($categoryNames as $name => $description) {
            $categories[$name] = EventCategory::firstOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }

        // 3 ─── Regular Users ────────────────────────────────────
        $regularUsers = [];
        $userNames = [
            'Sarah Johnson', 'Ahmad Rizky', 'Budi Santoso', 'Citra Dewi',
            'Denny Prasetyo', 'Eka Putri', 'Fajar Nugroho', 'Grace Ling',
            'Hendra Wijaya', 'Indah Permata', 'Joko Susilo', 'Kartini Rahayu',
            'Lukman Hakim', 'Maya Sari', 'Nadia Putri', 'Oscar Tan',
            'Putra Wijaya', 'Rina Susanti', 'Sandi Pratama', 'Tania Hartono',
            'Umar Farid', 'Vera Anggraeni', 'Wahyu Nugroho', 'Xena Dewi',
            'Yoga Saputra', 'Zahra Amelia', 'Bagus Setiawan', 'Dewi Lestari',
            'Fikri Rahman', 'Gita Nirmala',
        ];

        foreach ($userNames as $idx => $name) {
            $slug = Str::slug($name);
            $user = User::firstOrCreate(
                ['email' => "{$slug}@example.com"],
                [
                    'name'              => $name,
                    'username'          => str_replace('-', '.', $slug),
                    'role'              => $idx < 4 ? 'Organizer' : 'User',
                    'status'            => $idx === 7 ? 'Banned' : ($idx === 5 || $idx === 13 ? 'Suspended' : 'Active'),
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now()->subDays(rand(1, 90)),
                ]
            );
            $regularUsers[] = $user;
        }

        // 4 ─── Organizers (link first 4 regular users + default) ─
        $organizerNames = [
            'PT Inovasi Digital', 'SoundWave Events', 'RunID Sports',
            'Kreasi Seni ID', 'Kuliner Nusantara',
        ];

        $organizers = [];
        for ($i = 0; $i < count($organizerNames); $i++) {
            $userId = $i < 4
                ? $regularUsers[$i]->id
                : (User::where('role', 'Organizer')->inRandomOrder()->first()?->id ?? $regularUsers[0]->id);

            $organizers[] = Organizer::firstOrCreate(
                ['name' => $organizerNames[$i]],
                [
                    'description'  => fake()->paragraph(2),
                    'logo'         => null,
                    'bank_account' => fake()->numerify('####-####-####'),
                    'user_id'      => $userId,
                ]
            );
        }

        // 5 ─── Events ───────────────────────────────────────────
        $eventDefinitions = [
            ['Tech Summit 2026',         'Technology', 'Mar 28, 2026', 500,   'Active'],
            ['Music Fiesta Jakarta',     'Music',      'Apr 05, 2026', 2000,  'Active'],
            ['Startup Pitch Night',      'Business',   'Apr 12, 2026', 150,   'Draft'],
            ['Art & Design Expo',        'Arts',       'Apr 20, 2026', 400,   'Active'],
            ['Food Festival Bandung',    'Food',       'May 01, 2026', 1000,  'Draft'],
            ['Marathon Jakarta',         'Sports',     'May 10, 2026', 5000,  'Active'],
            ['Photography Workshop',     'Education',  'May 15, 2026', 50,    'Cancelled'],
            ['Charity Gala Dinner',      'Charity',    'Jun 01, 2026', 200,   'Active'],
            ['Coding Bootcamp Intensive','Education',  'Jun 10, 2026', 60,    'Draft'],
            ['Jazz Night Surabaya',      'Music',      'Jun 15, 2026', 150,   'Active'],
            ['Esports Championship',     'Technology', 'Jun 20, 2026', 1000,  'Active'],
            ['Yoga Retreat Bali',        'Sports',     'Jul 01, 2026', 50,    'Active'],
            ['Stand-Up Comedy Night',    'Arts',       'Jul 05, 2026', 200,   'Draft'],
            ['Batik Exhibition',         'Arts',       'Jul 12, 2026', 300,   'Active'],
            ['Indonesian Coffee Fest',   'Food',       'Jul 20, 2026', 750,   'Active'],
            ['Blockchain Conference',    'Technology', 'Aug 01, 2026', 300,   'Draft'],
            ['Open Mic Acoustic',        'Music',      'Aug 10, 2026', 80,    'Active'],
            ['Cycling Tour Jakarta',     'Sports',     'Aug 15, 2026', 2000,  'Active'],
        ];

        $events = [];
        foreach ($eventDefinitions as $idx => $def) {
            $date = Carbon::parse($def[2]);
            $events[] = Event::firstOrCreate(
                ['title' => $def[0]],
                [
                    'id'                => Str::uuid()->toString(),
                    'description'       => fake()->sentence(10),
                    'banner_image'      => 'https://picsum.photos/seed/' . Str::slug($def[0]) . '/800/400',
                    'event_date'        => $date,
                    'total_quota'       => $def[3],
                    'start_time'        => $date->copy()->setHour(9),
                    'end_time'          => $date->copy()->setHour(17),
                    'location'          => fake()->city() . ', Indonesia',
                    'event_category_id' => $categories[$def[1]]->id,
                    'organizer_id'      => $organizers[$idx % count($organizers)]->id,
                    'status'            => $def[4],
                ]
            );
        }

        // 6 ─── Ticket Types ─────────────────────────────────────
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

        // 7 ─── Payments, Transactions, TransactionDetails ───────
        $activeEvents = Event::where('status', 'Active')->with('ticketTypes')->get();
        $buyerUsers = User::where('role', 'User')->get();

        if ($buyerUsers->count() > 0 && $activeEvents->count() > 0) {
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

        // 8 ─── Promotions ───────────────────────────────────────
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
                'event_id'        => $events[$idx % count($events)]->id,
            ]);
        }

        // 9 ─── Validation Logs ──────────────────────────────────
        $tickets = Ticket::all();
        if ($tickets->isEmpty()) {
            // Create some sample tickets from transaction details
            $details = TransactionDetail::with('ticketType')->limit(20)->get();
            foreach ($details as $detail) {
                for ($q = 0; $q < min($detail->quantity, 2); $q++) {
                    $ticketStatus = fake()->randomElement(['Active', 'Used', 'Cancelled']);
                    $ticket = Ticket::create([
                        'id'                    => Str::uuid()->toString(),
                        'qr_code'               => 'QR-' . Str::upper(Str::random(8)),
                        'ticket_status'         => $ticketStatus,
                        'issued_at'             => now()->subDays(rand(1, 30)),
                        'validated_at'          => $ticketStatus === 'Used' ? now()->subDays(rand(0, 5)) : null,
                        'transaction_detail_id' => $detail->id,
                        'ticket_type_id'        => $detail->ticket_type_id,
                    ]);

                    // Add validation log for used tickets
                    if ($ticketStatus === 'Used') {
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
                ['ticket_id' => $ticket->id, 'result' => fake()->randomElement(['Valid', 'Invalid', 'Expired', 'Already Used'])],
                ['validation_time' => now()->subHours(rand(1, 72))]
            );
        }
    }
}
