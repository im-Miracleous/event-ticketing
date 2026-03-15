<x-guest-layout>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create your account ✨</h1>
        <p class="text-gray-500 text-sm">Join 50,000+ event lovers on EventHive. It's free forever.</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <!-- Name -->
        <div>
            <label for="name" class="input-label">Full Name</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                </span>
                <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus autocomplete="name"
                       class="input-field pl-10 @error('name') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="Your full name">
            </div>
            @error('name')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Username -->
        <div>
            <label for="username" class="input-label">Username</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </span>
                <input id="username" type="text" name="username" value="{{ old('username') }}" required
                       class="input-field pl-10 @error('username') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="Unique username">
            </div>
            @error('username')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Email -->
        <div>
            <label for="email" class="input-label">Email Address</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </span>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username"
                       class="input-field pl-10 @error('email') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="you@example.com">
            </div>
            @error('email')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="input-label">Password</label>
            <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </span>
                <input id="password" type="password" name="password" required autocomplete="new-password"
                       class="input-field pl-10 @error('password') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="Min. 8 characters"
                       oninput="checkStrength(this.value)">
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
            <!-- Password strength bar -->
            <div class="mt-2 space-y-1">
                <div class="flex gap-1">
                    <div id="strength-bar-1" class="h-1 flex-1 rounded-full bg-gray-200 transition-colors duration-300"></div>
                    <div id="strength-bar-2" class="h-1 flex-1 rounded-full bg-gray-200 transition-colors duration-300"></div>
                    <div id="strength-bar-3" class="h-1 flex-1 rounded-full bg-gray-200 transition-colors duration-300"></div>
                    <div id="strength-bar-4" class="h-1 flex-1 rounded-full bg-gray-200 transition-colors duration-300"></div>
                </div>
                <p id="strength-text" class="text-xs text-gray-400"></p>
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
                       class="input-field pl-10 @error('password_confirmation') border-red-400 focus:ring-red-400 @enderror"
                       placeholder="Re-enter your password">
            </div>
            @error('password_confirmation')
                <p class="mt-1.5 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <!-- Terms -->
        <div class="flex items-start gap-2.5">
            <input id="terms" type="checkbox" required
                   class="mt-0.5 w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500 cursor-pointer">
            <label for="terms" class="text-sm text-gray-600 cursor-pointer leading-relaxed">
                I agree to EventHive's
                <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</a>
                and
                <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
            </label>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn-primary w-full py-3.5 text-base">
            Create Free Account
        </button>

        <!-- Divider -->
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs">
                <span class="px-3 bg-white text-gray-400">Already have an account?</span>
            </div>
        </div>

        <!-- Login link -->
        <a href="{{ route('login') }}"
           class="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm
                  hover:border-primary-500 hover:text-primary-600 transition-all duration-200">
            Sign in instead
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

        function checkStrength(value) {
            const bars = [1,2,3,4].map(i => document.getElementById(`strength-bar-${i}`));
            const text = document.getElementById('strength-text');

            let score = 0;
            if (value.length >= 8) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value)) score++;

            const configs = [
                { color: 'bg-red-400',    label: 'Weak',      labelColor: 'text-red-500' },
                { color: 'bg-orange-400', label: 'Fair',      labelColor: 'text-orange-500' },
                { color: 'bg-yellow-400', label: 'Good',      labelColor: 'text-yellow-600' },
                { color: 'bg-green-500',  label: 'Strong ✓',  labelColor: 'text-green-600' },
            ];

            bars.forEach((bar, i) => {
                bar.className = `h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? configs[score-1].color : 'bg-gray-200'}`;
            });

            if (value.length > 0 && score > 0) {
                const c = configs[score-1];
                text.textContent = c.label;
                text.className = `text-xs ${c.labelColor}`;
            } else {
                text.textContent = '';
            }
        }
    </script>
</x-guest-layout>
