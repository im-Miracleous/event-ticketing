<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpVerificationMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    /**
     * Display the OTP entry form.
     */
    public function show(Request $request)
    {
        $pending = $request->session()->get('pending_registration');
        if (!$pending) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/OtpVerify', [
            'email' => $pending['email'],
            'status' => session('status'),
        ]);
    }

    /**
     * Verify the submitted OTP code.
     */
    public function verify(Request $request): RedirectResponse
    {
        $pending = $request->session()->get('pending_registration');
        if (!$pending) {
            return redirect()->route('register');
        }

        $request->validate([
            'code' => ['required', 'string', 'size:6', 'regex:/^\d{6}$/'],
        ], [
            'code.required' => 'Please enter the OTP code.',
            'code.size'     => 'The OTP must be exactly 6 digits.',
            'code.regex'    => 'The OTP must contain only numbers.',
        ]);

        $email = $pending['email'];

        $otp = OtpCode::where('email', $email)
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

        // Mark OTP as used
        $otp->markAsUsed();

        // Create the user now that email is verified
        $user = User::create([
            'name' => $pending['name'],
            'username' => $pending['username'],
            'email' => $pending['email'],
            'password' => $pending['password'],
        ]);

        $user->markEmailAsVerified();
        event(new Registered($user));

        // Clear session and log in
        $request->session()->forget('pending_registration');
        
        Auth::login($user);
        $request->session()->regenerate();

        sleep(1);

        return redirect()->intended(route('dashboard', absolute: false))
            ->with('status', 'Account created and verified successfully.');
    }

    /**
     * Resend a fresh OTP code.
     */
    public function resend(Request $request): RedirectResponse
    {
        $pending = $request->session()->get('pending_registration');
        if (!$pending) {
            return redirect()->route('register');
        }

        $email = $pending['email'];

        // Throttle: max 1 resend per 60 seconds
        $recent = OtpCode::where('email', $email)
            ->where('type', 'email_verification')
            ->where('created_at', '>=', now()->subSeconds(60))
            ->exists();

        if ($recent) {
            return back()->withErrors(['code' => 'Please wait 60 seconds before requesting a new code.']);
        }

        $otp = OtpCode::generateFor($email, 'email_verification');
        Mail::to($email)->send(new OtpVerificationMail(null, $otp, $pending['name']));

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
