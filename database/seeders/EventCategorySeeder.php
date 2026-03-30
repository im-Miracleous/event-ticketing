<?php

namespace Database\Seeders;

use App\Models\EventCategory;
use Illuminate\Database\Seeder;

class EventCategorySeeder extends Seeder
{
    /**
     * Seed the event categories.
     */
    public function run(): void
    {
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

        foreach ($categoryNames as $name => $description) {
            EventCategory::firstOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }
    }
}
