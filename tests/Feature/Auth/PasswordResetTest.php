<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Mail\OtpPasswordResetMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_otp_can_be_requested(): void
    {
        Mail::fake();

        $user = User::factory()->create();

        $response = $this->post('/forgot-password', ['email' => $user->email]);

        Mail::assertSent(OtpPasswordResetMail::class);
        $response->assertRedirect(route('otp.password'));
    }

    public function test_reset_password_screen_can_be_rendered_after_otp_verified(): void
    {
        $user = User::factory()->create();

        $response = $this->withSession([
            'otp_password_verified' => true,
            'otp_password_email' => $user->email,
        ])->get('/reset-password/otp-verified');

        $response->assertStatus(200);
    }

    public function test_password_can_be_reset_with_verified_session(): void
    {
        $user = User::factory()->create();

        $response = $this->withSession([
            'otp_password_verified' => true,
            'otp_password_email' => $user->email,
        ])->post('/reset-password', [
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('login'));
        
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('new-password', $user->fresh()->password));
    }
}
