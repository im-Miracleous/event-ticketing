<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrudTest extends TestCase
{
    use RefreshDatabase;

    private function getAdminAndActingAs()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        return $this->actingAs($admin);
    }

    /**
     * User CRUD Tests
     */
    public function test_admin_can_create_user(): void
    {
        $admin = User::create([
            'name' => 'Root Admin',
            'username' => 'root',
            'email' => 'root@example.com',
            'password' => bcrypt('password'),
            'role' => 'Root',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->post('/admin/users', [
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
        $admin = User::factory()->create(['role' => 'Root']);
        $user = User::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($admin)->put("/admin/users/{$user->id}", [
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
        $admin = User::factory()->create(['role' => 'Root']);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->delete("/admin/users/{$user->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /**
     * Category CRUD Tests
     */
    public function test_admin_can_create_category(): void
    {
        $this->getAdminAndActingAs();

        $response = $this->post('/admin/categories', [
            'name' => 'Music',
            'description' => 'Music events',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('event_category', ['name' => 'Music']);
    }

    public function test_admin_can_update_category(): void
    {
        $this->getAdminAndActingAs();
        $category = EventCategory::create(['name' => 'Sport', 'description' => 'Sport events']);

        $response = $this->put("/admin/categories/{$category->id}", [
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
        $user = User::factory()->create(['role' => 'Organizer']);
        $organizer = Organizer::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test Org',
            'description' => 'Test Organizer Description',
            'bank_account' => '1234567890',
            'user_id' => $user->id,
        ]);
        $category = EventCategory::create(['name' => 'Gen', 'description' => 'desc']);

        $response = $this->actingAs($user)->post('/organizer/events', [
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
