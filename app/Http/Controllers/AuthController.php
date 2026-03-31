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
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'login'    => ['required', 'string'],
            'password' => ['required'],
        ]);

        $loginValue = $request->input('login');
        $fieldType  = filter_var($loginValue, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (Auth::attempt([$fieldType => $loginValue, 'password' => $request->password], $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            
            if (in_array($user->role, ['Root', 'Admin'])) {
                $defaultRoute = route('admin.dashboard');
            } elseif ($user->role === 'Organizer') {
                $defaultRoute = route('organizer.dashboard');
            } else {
                $defaultRoute = route('events.index');
            }

            return redirect()->intended($defaultRoute);
        }

        return back()->withErrors([
            'login' => 'Email/username atau password salah.',
        ])->onlyInput('login');
    }


    public function showRegister()
    {
        return view('auth.register');
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
            'password' => $request->password,
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
