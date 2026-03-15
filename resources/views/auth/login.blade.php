<x-guest-layout>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
        <p class="text-gray-500 text-sm">Sign in to your account to continue your journey.</p>
    </div>

    <!-- Session Status -->
    @if (session('status'))
        <div class="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ route('login') }}" class="space-y-5">
        @csrf

        <!-- Email Address -->
        <div>
            <label for="email" class="input-label">Email Address</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </span>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username"
                       class="input-field pl-10 @error('email') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="you@example.com">
            </div>
            @error('email')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password -->
        <div>
            <div class="flex items-center justify-between mb-1.5">
                <label for="password" class="input-label mb-0">Password</label>
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                        Forgot password?
                    </a>
                @endif
            </div>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </span>
                <input id="password" type="password" name="password" required autocomplete="current-password"
                       class="input-field pl-10 @error('password') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="Enter your password">
                <button type="button" onclick="togglePassword('password', this)"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="eye-open w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg class="eye-closed w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                </button>
            </div>
            @error('password')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Remember Me -->
        <div class="flex items-center">
            <input id="remember_me" type="checkbox" name="remember"
                   class="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer">
            <label for="remember_me" class="ml-2.5 text-sm text-gray-600 cursor-pointer select-none">
                Remember me for 30 days
            </label>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn-primary w-full py-3.5 text-base">
            Sign In to EventHive
        </button>

        <!-- Divider -->
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs">
                <span class="px-3 bg-white text-gray-400">Don't have an account?</span>
            </div>
        </div>

        <!-- Register link -->
        <a href="{{ route('register') }}"
           class="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm
                  hover:border-primary-500 hover:text-primary-600 transition-all duration-200">
            Create a free account
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
        </a>
    </form>

    <script>
        function togglePassword(id, btn) {
            const input = document.getElementById(id);
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.querySelector('.eye-open').classList.toggle('hidden', isPassword);
            btn.querySelector('.eye-closed').classList.toggle('hidden', !isPassword);
        }
    </script>
</x-guest-layout>
