<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $loginType = filter_var($this->input('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = \App\Models\User::where($loginType, $this->input('login'))->first();

        // Check if account exists
        if (! $user) {
            throw ValidationException::withMessages([
                'login' => 'This account is not registered yet.',
            ]);
        }

        // Check account status
        if (in_array($user->status, ['Suspended', 'Banned'])) {
            throw ValidationException::withMessages([
                'login' => 'Your account has been ' . strtolower($user->status) . '. Please contact support.',
            ]);
        }

        $this->ensureIsNotRateLimited();

        if (! Auth::attempt([$loginType => $this->input('login'), 'password' => $this->input('password')], $this->boolean('remember'))) {
            $lockoutCounterKey = 'total_lockouts:' . $this->throttleKey();
            $totalLockouts = (int) \Illuminate\Support\Facades\Cache::get($lockoutCounterKey, 0);
            
            // First 5 attempts (Cycle 1): 1 min lockout. Next 5 attempts (Cycle 2): 5 min lockout.
            $decay = ($totalLockouts >= 1) ? 300 : 60;
            RateLimiter::hit($this->throttleKey(), $decay);

            if (RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
                $incidentKey = 'lockout_incident:' . $this->throttleKey();
                
                if (!\Illuminate\Support\Facades\Cache::has($incidentKey)) {
                    \Illuminate\Support\Facades\Cache::put($incidentKey, true, $decay + 5); 
                    
                    $totalLockouts = \Illuminate\Support\Facades\Cache::increment($lockoutCounterKey);
                    
                    // 24-hour TTL (Time-To-Live)
                    if ($totalLockouts === 1) {
                         \Illuminate\Support\Facades\Cache::put($lockoutCounterKey, 1, 86400); 
                    }

                    if ($totalLockouts >= 3 && $user && $user->role !== 'Root') {
                        $user->update(['status' => 'Suspended']);
                        throw ValidationException::withMessages([
                            'login' => 'Your account has been suspended due to a high number of failed login attempts. Please reach out to Support for assistance.',
                        ]);
                    }
                }
            }

            throw ValidationException::withMessages([
                'login' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        \Illuminate\Support\Facades\Cache::forget('total_lockouts:' . $this->throttleKey());
        \Illuminate\Support\Facades\Cache::forget('lockout_incident:' . $this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());
        $minutes = ceil($seconds / 60);

        throw ValidationException::withMessages([
            'login' => "Too many attempts. Account is temporarily locked. Please try again in {$minutes} " . Str::plural('minute', $minutes) . ".",
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('login')).'|'.$this->ip());
    }
}
