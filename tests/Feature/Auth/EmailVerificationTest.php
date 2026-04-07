<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\OtpCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_otp_verification_screen_can_be_rendered(): void
    {
        $this->post('/register', [
            'name' => 'Test',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response = $this->get('/otp-verify');
        $response->assertStatus(200);
    }

    public function test_email_can_be_verified_with_otp(): void
    {
        $email = 'test@example.com';
        $otp = OtpCode::generateFor($email, 'email_verification');

        $response = $this->withSession([
            'pending_registration' => [
                'name' => 'Test Name',
                'username' => 'testuser',
                'email' => $email,
                'password' => 'passwordhash',
            ]
        ])->post('/otp-verify', [
            'code' => $otp->code,
        ]);

        $user = User::where('email', $email)->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasVerifiedEmail());
        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('events.index', absolute: false));
    }

    public function test_email_is_not_verified_with_invalid_otp(): void
    {
        $email = 'test@example.com';

        $response = $this->withSession([
            'pending_registration' => [
                'name' => 'Test Name',
                'username' => 'testuser',
                'email' => $email,
                'password' => 'passwordhash',
            ]
        ])->post('/otp-verify', [
            'code' => '000000',
        ]);

        $user = User::where('email', $email)->first();
        $this->assertNull($user);
        $response->assertSessionHasErrors('code');
    }
}
