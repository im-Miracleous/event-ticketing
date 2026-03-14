<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpVerificationMail;
use App\Models\OtpCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;

class OtpVerificationController extends Controller
{
    /**
     * Show the OTP entry form (for email verification after register).
     */
    public function show(Request $request): RedirectResponse|View
    {
        // If already verified, skip
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return view('auth.otp-verify', [
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
            return back()->withErrors(['code' => 'Invalid OTP code. Please check and try again.']);
        }

        if ($otp->expires_at->isPast()) {
            $otp->markAsUsed();
            return back()->withErrors(['code' => 'This OTP has expired. Please request a new one.']);
        }

        // Mark OTP as used and verify email
        $otp->markAsUsed();
        $user->markEmailAsVerified();

        return redirect()->intended(route('dashboard', absolute: false))
            ->with('status', 'email-verified');
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

        return back()->with('status', 'otp-sent');
    }
}
