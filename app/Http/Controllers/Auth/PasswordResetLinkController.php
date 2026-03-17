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
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Generate an OTP and email it to the user (replaces link-based reset).
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $otp = OtpCode::generateFor($user, 'password_reset');
            Mail::to($user->email)->send(new OtpPasswordResetMail($user, $otp));
            
            // Store the email in session to retrieve on OTP page
            $request->session()->put('otp_password_email', $request->email);
        } else {
            // Even if user not found, we still redirect to show entry page to avoid email discovery
            $request->session()->put('otp_password_email', $request->email);
        }

        return redirect()->route('otp.password');
    }
}
