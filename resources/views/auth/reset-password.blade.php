<x-guest-layout>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">New Password 🔒</h1>
        <p class="text-gray-500 text-sm">Create a strong password to secure your account. Codes verified!</p>
    </div>

    <form method="POST" action="{{ route('password.store') }}" class="space-y-5">
        @csrf

        <!-- Email Address (Read-only as it comes from session) -->
        <div>
            <label for="email" class="input-label text-gray-400">Email Address</label>
            <div class="relative opacity-60">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </span>
                <input id="email" type="email" name="email" value="{{ $email }}" required readonly
                       class="input-field pl-10 bg-gray-100 cursor-not-allowed border-gray-200">
            </div>
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="input-label">New Password</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </span>
                <input id="password" type="password" name="password" required autofocus autocomplete="new-password"
                       class="input-field pl-10 @error('password') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="Enter new password">
            </div>
            @error('password')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Confirm Password -->
        <div>
            <label for="password_confirmation" class="input-label">Confirm Password</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                </span>
                <input id="password_confirmation" type="password" name="password_confirmation" required autocomplete="new-password"
                       class="input-field pl-10"
                       placeholder="Confirm your new password">
            </div>
        </div>

        <button type="submit" class="btn-primary w-full py-3.5 text-base">
            Reset Password
        </button>
    </form>
</x-guest-layout>
