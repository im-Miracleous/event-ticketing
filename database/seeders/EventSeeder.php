<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    /**
     * Seed events.
     */
    public function run(): void
    {
        $categories = EventCategory::all()->keyBy('name');
        $organizers = Organizer::all();

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

        foreach ($eventDefinitions as $idx => $def) {
            $date = Carbon::parse($def[2]);
            Event::firstOrCreate(
                ['title' => $def[0]],
                [
                    'id'                => Str::uuid()->toString(),
                    'description'       => fake()->paragraphs(3, true),
                    'banner_image'      => 'https://picsum.photos/seed/' . Str::slug($def[0]) . '/800/400',
                    'event_date'        => $date,
                    'total_quota'       => $def[3],
                    'start_time'        => $date->copy()->setHour(9),
                    'end_time'          => $date->copy()->setHour(17),
                    'location'          => fake()->city() . ', Indonesia',
                    'event_category_id' => $categories[$def[1]]->id,
                    'organizer_id'      => $organizers[$idx % $organizers->count()]->id,
                    'status'            => $def[4],
                    'faq'               => [
                        ['question' => 'What should I bring to the event?', 'answer' => 'Please bring your valid ID and the e-ticket (QR code) that was sent to your email after purchase.'],
                        ['question' => 'Can I get a refund if I cannot attend?', 'answer' => 'Refunds are available up to 7 days before the event date. After that, tickets are non-refundable but can be transferred to another person.'],
                        ['question' => 'Is there an age restriction?', 'answer' => 'This event is open to all ages. However, attendees under 17 must be accompanied by a guardian.'],
                        ['question' => 'Where can I park my vehicle?', 'answer' => 'The venue provides paid parking on-site. We recommend using public transportation or ride-hailing services for convenience.'],
                    ],
                    'rules_policies'    => "1. All attendees must present a valid ticket (QR code) and a matching ID at the entrance.\n2. No weapons, illegal substances, or hazardous materials are allowed inside the venue.\n3. The organizer reserves the right to refuse entry or remove any attendee who violates the event rules.\n4. Photography and videography for personal use are allowed. Commercial recording requires prior written permission.\n5. The organizer is not responsible for any lost or stolen personal belongings.\n6. By attending this event, you consent to being photographed or recorded for promotional purposes.\n7. In case of event cancellation due to force majeure, tickets will be refunded within 14 business days.",
                    'contact_info'      => "Email: support@eventhive.id\nPhone: +62 21 5555 1234\nWhatsApp: +62 812 3456 7890\nWebsite: https://eventhive.id",
                ]
            );
        }
    }
}
