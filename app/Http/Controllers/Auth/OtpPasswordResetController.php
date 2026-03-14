<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpPasswordResetMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OtpPasswordResetController extends Controller
{
    /**
     * Display the OTP entry form.
     */
    public function show(Request $request): Response
    {
        $email = $request->session()->get('otp_password_email');

        if (!$email) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/OtpPassword', [
            'email' => $email,
        ]);
    }

    /**
     * Verify the OTP code for password reset.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['code' => 'Invalid request.']);
        }

        $otp = OtpCode::where('user_id', $user->id)
            ->where('code', $request->code)
            ->where('type', 'password_reset')
            ->first();

        if (!$otp || !$otp->isValid()) {
            return back()->withErrors(['code' => 'The provided code is invalid or has expired.']);
        }

        $otp->markAsUsed();
        
        // Store verification flag in session
        $request->session()->put('otp_password_verified', true);
        $request->session()->put('otp_password_email', $request->email);

        return redirect()->route('password.reset', ['email' => $request->email]);
    }

    /**
     * Resend the password reset OTP.
     */
    public function resend(Request $request)
    {
        $email = $request->session()->get('otp_password_email');
        if (!$email) return back();

        $user = User::where('email', $email)->first();
        if (!$user) return back();

        $otp = OtpCode::generateFor($user, 'password_reset');
        Mail::to($user->email)->send(new OtpPasswordResetMail($user, $otp));

        return back()->with('status', 'A new code has been sent to your email.');
    }
}
