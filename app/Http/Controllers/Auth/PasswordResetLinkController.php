<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpPasswordResetMail;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): View
    {
        return view('auth.forgot-password');
    }

    /**
     * Generate an OTP and email it to the user (replaces link-based reset).
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Find user silently (don't reveal if email exists for security)
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $otp = OtpCode::generateFor($user, 'password_reset');
            Mail::to($user->email)->send(new OtpPasswordResetMail($user, $otp));
        }

        // Store the email in session to retrieve on OTP page
        $request->session()->put('otp_reset_email', $request->email);

        // Always redirect to OTP page (hides whether email exists)
        return redirect()->route('otp.password.show')
            ->with('status', 'otp-sent');
    }
}
