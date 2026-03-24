<?php

namespace Database\Factories;

use App\Models\EventCategory;
use App\Models\Organizer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    protected $model = \App\Models\Event::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('+1 week', '+6 months');
        $endDate = (clone $startDate)->modify('+' . rand(2, 8) . ' hours');
        $quota = fake()->randomElement([50, 100, 150, 200, 300, 400, 500, 750, 1000, 2000, 5000]);

        return [
            'id'                => Str::uuid()->toString(),
            'title'             => fake()->randomElement([
                'Tech Summit', 'Music Fiesta', 'Startup Pitch Night', 'Art & Design Expo',
                'Food Festival', 'Marathon Run', 'Photography Workshop', 'Charity Gala Dinner',
                'Coding Bootcamp', 'Jazz Night', 'Esports Championship', 'Yoga Retreat',
                'Stand-Up Comedy', 'Batik Exhibition', 'Coffee Festival', 'Blockchain Conference',
                'Open Mic Night', 'Cycling Tour',
            ]) . ' ' . fake()->city(),
            'description'       => fake()->sentence(12),
            'banner_image'      => 'https://picsum.photos/seed/' . fake()->word() . '/800/400',
            'event_date'        => $startDate,
            'total_quota'       => $quota,
            'start_time'        => $startDate,
            'end_time'          => $endDate,
            'location'          => fake()->city() . ', Indonesia',
            'event_category_id' => EventCategory::inRandomOrder()->first()?->id ?? 1,
            'organizer_id'      => Organizer::inRandomOrder()->first()?->id ?? 1,
            'status'            => fake()->randomElement(['Active', 'Active', 'Active', 'Draft', 'Cancelled']),
        ];
    }
}
