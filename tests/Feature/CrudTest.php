<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use Tests\TestCase;

class CrudTest extends TestCase
{
    /**
     * User CRUD Tests
     */
    public function test_admin_can_create_user(): void
    {
        $response = $this->actingAsRoot()->post('/admin/users', [
            'name' => 'New User',
            'username' => 'newuser',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'role' => 'User',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
    }

    public function test_admin_can_update_user(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAsRoot()->put("/admin/users/{$user->id}", [
            'name' => 'Updated Name',
            'username' => 'updateduser',
            'email' => $user->email,
            'role' => 'Organizer',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name', 'role' => 'Organizer']);
    }

    public function test_admin_can_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsRoot()->delete("/admin/users/{$user->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /**
     * Category CRUD Tests
     */
    public function test_admin_can_create_category(): void
    {
        $response = $this->actingAsAdmin()->post('/admin/categories', [
            'name' => 'Music',
            'description' => 'Music events',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('event_category', ['name' => 'Music']);
    }

    public function test_admin_can_update_category(): void
    {
        $category = EventCategory::create(['name' => 'Sport', 'description' => 'Sport events']);

        $response = $this->actingAsAdmin()->put("/admin/categories/{$category->id}", [
            'name' => 'Digital Sports',
            'description' => 'Updated description',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('event_category', ['id' => $category->id, 'name' => 'Digital Sports']);
    }

    /**
     * Event CRUD Tests
     */
    public function test_organizer_can_create_event(): void
    {
        $category = EventCategory::create(['name' => 'Gen', 'description' => 'desc']);

        $response = $this->actingAsOrganizer()->post('/organizer/events', [
            'title' => 'Sample Event',
            'description' => 'Event Description',
            'event_date' => now()->addDays(7)->format('Y-m-d'),
            'start_time' => now()->addDays(7)->setTime(10, 0)->toDateTimeString(),
            'end_time' => now()->addDays(7)->setTime(12, 0)->toDateTimeString(),
            'location' => 'Jakarta',
            'format' => 'Offline', // EventController says format must be Online or Offline
            'total_quota' => 100,
            'event_category_id' => $category->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('events', ['title' => 'Sample Event']);
    }
}
