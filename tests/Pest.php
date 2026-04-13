<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * A helper to quickly create an event for testing.
 */
function createEvent(array $attributes = [])
{
    // Ensure we have a category
    if (!isset($attributes['event_category_id'])) {
        $attributes['event_category_id'] = \App\Models\EventCategory::first()->id 
            ?? \App\Models\EventCategory::create(['name' => 'General', 'description' => 'Gen'])->id;
    }

    // Ensure we have an organizer
    if (!isset($attributes['organizer_id'])) {
        $attributes['organizer_id'] = \App\Models\Organizer::first()->id 
            ?? \App\Models\Organizer::create([
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'Default Org',
                'description' => 'A default organizer for tests',
                'bank_account' => '12345678',
                'user_id' => \App\Models\User::factory()->create(['role' => 'Organizer'])->id
            ])->id;
    }

    return \App\Models\Event::create(array_merge([
        'title' => 'Sample Event',
        'description' => 'Event Description',
        'event_date' => now()->addDays(7)->format('Y-m-d'),
        'start_time' => now()->addDays(7)->setTime(10, 0)->toDateTimeString(),
        'end_time' => now()->addDays(7)->setTime(12, 0)->toDateTimeString(),
        'location' => 'Jakarta',
        'format' => 'Offline',
        'total_quota' => 100,
        'status' => 'Published',
    ], $attributes));
}
