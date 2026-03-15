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
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/otp-verify');

        $response->assertStatus(200);
    }

    public function test_email_can_be_verified_with_otp(): void
    {
        $user = User::factory()->unverified()->create();
        $otp = OtpCode::generateFor($user, 'email_verification');

        $response = $this->actingAs($user)->post('/otp-verify', [
            'code' => $otp->code,
        ]);

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_email_is_not_verified_with_invalid_otp(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->post('/otp-verify', [
            'code' => '000000',
        ]);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $response->assertSessionHasErrors('code');
    }
}
