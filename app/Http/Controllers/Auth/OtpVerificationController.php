<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpVerificationMail;
use App\Models\OtpCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    /**
     * Display the OTP entry form.
     */
    public function show(Request $request): RedirectResponse|Response
    {
        // If already verified, skip
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('Auth/OtpVerify', [
            'email' => $request->user()->email,
        ]);
    }

    /**
     * Verify the submitted OTP code.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6', 'regex:/^\d{6}$/'],
        ], [
            'code.required' => 'Please enter the OTP code.',
            'code.size'     => 'The OTP must be exactly 6 digits.',
            'code.regex'    => 'The OTP must contain only numbers.',
        ]);

        $user = $request->user();

        $otp = OtpCode::where('user_id', $user->id)
            ->where('type', 'email_verification')
            ->where('code', $request->code)
            ->whereNull('used_at')
            ->latest()
            ->first();

        if (! $otp) {
            return back()->withErrors(['code' => 'The provided code is invalid.']);
        }

        if ($otp->expires_at->isPast()) {
            $otp->markAsUsed();
            return back()->withErrors(['code' => 'The provided code has expired.']);
        }

        // Mark OTP as used and verify email
        $otp->markAsUsed();
        $user->markEmailAsVerified();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        sleep(2);

        return redirect()->route('login')
            ->with('status', 'Account verified successfully. Please sign in to continue.');
    }

    /**
     * Resend a fresh OTP code.
     */
    public function resend(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        // Throttle: max 1 resend per 60 seconds
        $recent = OtpCode::where('user_id', $user->id)
            ->where('type', 'email_verification')
            ->where('created_at', '>=', now()->subSeconds(60))
            ->exists();

        if ($recent) {
            return back()->withErrors(['code' => 'Please wait 60 seconds before requesting a new code.']);
        }

        $otp = OtpCode::generateFor($user, 'email_verification');
        Mail::to($user->email)->send(new OtpVerificationMail($user, $otp));

        sleep(2);

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
