<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpPasswordResetMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OtpPasswordResetController extends Controller
{
    /**
     * Display the OTP entry form.
     */
    public function show(Request $request)
    {
        $email = $request->session()->get('otp_password_email');

        if (!$email) {
            return redirect()->route('password.request');
        }

        return view('auth.otp-password', [
            'email' => $email,
        ]);
    }

    /**
     * Verify the OTP for password reset.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => ['required', 'string', 'size:6', 'regex:/^\d{6}$/'],
        ], [
            'code.required' => 'Please enter the OTP code.',
            'code.size'     => 'The OTP must be exactly 6 digits.',
            'code.regex'    => 'The OTP must contain only numbers.',
        ]);

        $email = $request->email;
        $user = User::where('email', $email)->first();

        if (!$user) {
            return back()->withErrors(['code' => 'Invalid request.']);
        }

        $otp = OtpCode::where('user_id', $user->id)
            ->where('code', $request->code)
            ->where('type', 'password_reset')
            ->whereNull('used_at')
            ->latest()
            ->first();

        if (!$otp) {
            return back()->withErrors(['code' => 'The provided code is invalid.']);
        }

        if ($otp->expires_at->isPast()) {
            $otp->markAsUsed();
            return back()->withErrors(['code' => 'The provided code has expired.']);
        }

        $otp->markAsUsed();
        
        // Store verification flag in session
        $request->session()->put('otp_password_verified', true);
        $request->session()->put('otp_password_email', $email);

        sleep(2);

        return redirect()->route('password.reset', ['token' => 'otp-verified', 'email' => $email]);
    }

    /**
     * Resend the password reset OTP.
     */
    public function resend(Request $request): RedirectResponse
    {
        $email = $request->session()->get('otp_password_email');

        if (! $email) {
            return redirect()->route('password.request');
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return redirect()->route('password.request');
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

        sleep(2);

        return back()->with('status', 'A new code has been sent to your email.');
    }
}
