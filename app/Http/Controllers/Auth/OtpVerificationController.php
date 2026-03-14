<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpVerificationMail;
use App\Models\OtpCode;
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
    public function show(Request $request): Response
    {
        return Inertia::render('Auth/OtpVerify', [
            'email' => $request->user()->email,
        ]);
    }

    /**
     * Verify the OTP code.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $otp = OtpCode::where('user_id', $request->user()->id)
            ->where('code', $request->code)
            ->where('type', 'email_verification')
            ->first();

        if (!$otp || !$otp->isValid()) {
            return back()->withErrors(['code' => 'The provided code is invalid or has expired.']);
        }

        $otp->markAsUsed();
        $request->user()->markEmailAsVerified();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Resend the OTP code.
     */
    public function resend(Request $request)
    {
        $user = $request->user();
        
        // Simple throttle check
        $lastOtp = OtpCode::where('user_id', $user->id)
            ->where('type', 'email_verification')
            ->latest()
            ->first();

        if ($lastOtp && $lastOtp->created_at->addMinute()->isFuture()) {
            return back()->withErrors(['resend' => 'Please wait 60 seconds before requesting a new code.']);
        }

        $otp = OtpCode::generateFor($user, 'email_verification');
        Mail::to($user->email)->send(new OtpVerificationMail($user, $otp));

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
