<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        if (!$request->session()->get('otp_password_verified')) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->session()->get('otp_password_email'),
            'token' => 'otp-verified', // Dummy token for compatibility
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        $sessionEmail = $request->session()->get('otp_password_email');
        $verified = $request->session()->get('otp_password_verified');

        if (!$verified || $sessionEmail !== $request->email) {
            return redirect()->route('password.request')->withErrors(['email' => 'Session expired or invalid.']);
        }

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'User not found.']);
        }

        $user->forceFill([
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'remember_token' => \Illuminate\Support\Str::random(60),
        ])->save();

        event(new \Illuminate\Auth\Events\PasswordReset($user));

        // Clear session
        $request->session()->forget(['otp_password_verified', 'otp_password_email']);

        return redirect()->route('login')->with('status', 'Your password has been reset!');
    }
}
