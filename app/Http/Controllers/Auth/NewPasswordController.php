<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): View|RedirectResponse
    {
        // Check if OTP was verified for this session
        if (! $request->session()->has('otp_password_verified')) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Please verify your email with OTP first.']);
        }

        return view('auth.reset-password', [
            'email' => $request->session()->get('otp_password_verified'),
            'token' => $request->route('token'),
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
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Verify that the email being reset is the one verified by OTP
        if ($request->email !== $request->session()->get('otp_password_verified')) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Session mismatch. Please verify again.']);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return back()->withErrors(['email' => 'No account found with that email.']);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        event(new PasswordReset($user));

        // Clear the session
        $request->session()->forget('otp_password_verified');

        return redirect()->route('login')->with('status', 'Your password has been reset successfully. Please log in with your new password.');
    }
}
