<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpPasswordResetMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;

class OtpPasswordResetController extends Controller
{
    /**
     * Show the OTP entry form for password reset.
     */
    public function show(Request $request): RedirectResponse|View
    {
        // Require email in session (from PasswordResetLinkController)
        if (! $request->session()->has('otp_reset_email')) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Please enter your email address first.']);
        }

        return view('auth.otp-password', [
            'email' => $request->session()->get('otp_reset_email'),
        ]);
    }

    /**
     * Verify the OTP for password reset.
     * On success, store verified email in session and redirect to reset form.
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

        $email = $request->session()->get('otp_reset_email');

        if (! $email) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Session expired. Please start again.']);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'No account found with that email.']);
        }

        $otp = OtpCode::where('user_id', $user->id)
            ->where('type', 'password_reset')
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

        $otp->markAsUsed();

        // Store verified flag in session → allow access to reset form
        $request->session()->put('otp_password_verified', $email);
        $request->session()->forget('otp_reset_email');

        return redirect()->route('password.reset', ['token' => 'otp-verified'])
            ->with('email', $email);
    }

    /**
     * Resend OTP for password reset.
     */
    public function resend(Request $request): RedirectResponse
    {
        $email = $request->session()->get('otp_reset_email');

        if (! $email) {
            return redirect()->route('password.request');
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'No account found with that email.']);
        }

        // Throttle: 60 seconds
        $recent = OtpCode::where('user_id', $user->id)
            ->where('type', 'password_reset')
            ->where('created_at', '>=', now()->subSeconds(60))
            ->exists();

        if ($recent) {
            return back()->withErrors(['code' => 'Please wait 60 seconds before requesting a new code.']);
        }

        $otp = OtpCode::generateFor($user, 'password_reset');
        Mail::to($user->email)->send(new OtpPasswordResetMail($user, $otp));

        return back()->with('status', 'otp-sent');
    }
}
