<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OtpCode;
use App\Mail\OtpVerificationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use App\Http\Requests\Auth\LoginRequest;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function login(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();
        
        $user = Auth::user();
        
        if (in_array($user->role, ['Root', 'Admin'])) {
            $defaultRoute = route('admin.dashboard');
        } elseif ($user->role === 'Organizer') {
            $defaultRoute = route('organizer.dashboard');
        } else {
            $defaultRoute = route('dashboard');
        }

        return redirect()->intended($defaultRoute);
    }


    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:45', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->session()->put('pending_registration', [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'User',
        ]);

        $otp = OtpCode::generateFor($request->email, 'email_verification');
        Mail::to($request->email)->send(new OtpVerificationMail(null, $otp, $request->name));

        return redirect()->route('otp.verify');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

}
