<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
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
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        // For security, if user doesn't exist, we still redirect or show success
        // but here we just process if user exists
        if ($user) {
            $otp = \App\Models\OtpCode::generateFor($user, 'password_reset');
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\OtpPasswordResetMail($user, $otp));
            
            $request->session()->put('otp_password_email', $request->email);
        } else {
            // Even if user not found, we redirect to show entry page to avoid email discovery
            $request->session()->put('otp_password_email', $request->email);
        }

        return redirect()->route('otp.password');
    }
}
