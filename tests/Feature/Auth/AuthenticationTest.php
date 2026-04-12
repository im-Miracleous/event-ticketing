<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'login' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('events.index', absolute: false));
    }

    public function test_users_can_authenticate_using_username(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'login' => $user->username,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('events.index', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'login' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_user_is_suspended_after_repeated_lockouts(): void
    {
        $user = User::factory()->create([
            'role' => 'User',
            'status' => 'Active'
        ]);

        $throttleKey = \Illuminate\Support\Str::transliterate(\Illuminate\Support\Str::lower($user->email).'|127.0.0.1');

        // Cycle 1 & 2: Fail 5 times per cycle, then clear and forget incident
        for ($cycle = 1; $cycle < 3; $cycle++) {
            for ($i = 0; $i < 5; $i++) {
                $this->post('/login', [
                    'login' => $user->email,
                    'password' => 'wrong-password',
                ]);
            }
            
            $user->refresh();
            $this->assertEquals('Active', $user->status);
            
            // Manually clear rate limit but leave total_lockouts intact
            \Illuminate\Support\Facades\RateLimiter::clear($throttleKey);
            \Illuminate\Support\Facades\Cache::forget('lockout_incident:' . $throttleKey);
        }

        // Cycle 3: The 5th hit here should trigger suspension
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'login' => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        $user->refresh();
        $this->assertEquals('Suspended', $user->status);
    }

    public function test_suspended_user_cannot_login(): void
    {
        $user = User::factory()->create(['status' => 'Suspended']);

        $response = $this->post('/login', [
            'login' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('login');
    }

    public function test_banned_user_cannot_login(): void
    {
        $user = User::factory()->create(['status' => 'Banned']);

        $response = $this->post('/login', [
            'login' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('login');
    }

    public function test_not_registered_account_cannot_login(): void
    {
        $response = $this->post('/login', [
            'login' => 'nonexistent@example.com',
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(['login' => 'This account is not registered yet.']);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
