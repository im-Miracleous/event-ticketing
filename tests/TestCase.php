<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Create and act as a Root user.
     */
    protected function actingAsRoot(): self
    {
        $user = \App\Models\User::factory()->create(['role' => 'Root']);
        return $this->actingAs($user);
    }

    /**
     * Create and act as an Admin user.
     */
    protected function actingAsAdmin(): self
    {
        $user = \App\Models\User::factory()->create(['role' => 'Admin']);
        return $this->actingAs($user);
    }

    /**
     * Create and act as an Organizer.
     */
    protected function actingAsOrganizer(): self
    {
        $user = \App\Models\User::factory()->create(['role' => 'Organizer']);
        
        // Ensure an organizer record exists for this user if needed by logic
        \App\Models\Organizer::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test Organizer',
            'description' => 'Test Desc',
            'bank_account' => '12345678',
            'user_id' => $user->id,
        ]);

        return $this->actingAs($user);
    }

    /**
     * Create and act as a standard User.
     */
    protected function actingAsUser(): self
    {
        $user = \App\Models\User::factory()->create(['role' => 'User']);
        return $this->actingAs($user);
    }
}
