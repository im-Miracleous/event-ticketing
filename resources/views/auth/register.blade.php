<x-guest-layout>
    <div class="text-center mb-10">
        <h1 class="heading-font text-3xl font-extrabold text-white mb-3">Create your account ✨</h1>
        <p class="text-slate-400 text-sm">Join 50,000+ event lovers on EventHive. It's free forever.</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        @if ($errors->any())
            <div class="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
                <ul class="list-disc list-inside text-sm">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Name -->
        <div class="space-y-1.5 group/input">
            <label for="name" class="block text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within/input:text-pink-400">Full Name</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-pink-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                </div>
                <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus autocomplete="name"
                       class="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('name') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="Your full name">
            </div>
            @error('name')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Username -->
        <div class="space-y-1.5 group/input">
            <label for="username" class="block text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within/input:text-pink-400">Username</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-pink-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </div>
                <input id="username" type="text" name="username" value="{{ old('username') }}" required
                       class="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('username') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="Unique username">
            </div>
            @error('username')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Email -->
        <div class="space-y-1.5 group/input">
            <label for="email" class="block text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within/input:text-pink-400">Email Address</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-pink-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </div>
                <input id="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username"
                       class="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('email') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="you@example.com">
            </div>
            @error('email')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password -->
        <div class="space-y-1.5 group/input">
            <label for="password" class="block text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within/input:text-pink-400">Password</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-pink-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <input id="password" type="password" name="password" required autocomplete="new-password"
                       class="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('password') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="Min. 8 characters"
                       oninput="checkStrength(this.value)">
                <button type="button" onclick="togglePassword('password', this)"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-pink-400 transition-colors focus:outline-none">
                    <svg class="eye-open w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg class="eye-closed w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                </button>
            </div>
            <!-- Password strength bar -->
            <div class="mt-2 space-y-1">
                <div class="flex gap-1">
                    <div id="strength-bar-1" class="h-1 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                    <div id="strength-bar-2" class="h-1 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                    <div id="strength-bar-3" class="h-1 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                    <div id="strength-bar-4" class="h-1 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                </div>
                <p id="strength-text" class="text-xs text-slate-500 min-h-[16px]"></p>
            </div>
            @error('password')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1.5 group/input">
            <label for="password_confirmation" class="block text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within/input:text-pink-400">Confirm Password</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-pink-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                </div>
                <input id="password_confirmation" type="password" name="password_confirmation" required autocomplete="new-password"
                       class="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('password_confirmation') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="Re-enter your password">
            </div>
            @error('password_confirmation')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Terms -->
        <div class="flex items-start gap-3 mt-4 ml-1">
            <div class="relative flex items-center pt-1">
                <input id="terms" type="checkbox" required
                       class="w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500/50 focus:ring-offset-0 transition-colors cursor-pointer">
            </div>
            <label for="terms" class="text-sm text-slate-400 cursor-pointer leading-relaxed hover:text-slate-200 transition-colors">
                I agree to EventHive's
                <a href="#" class="text-pink-400 hover:text-pink-300 font-semibold transition-colors">Terms of Service</a>
                and
                <a href="#" class="text-pink-400 hover:text-pink-300 font-semibold transition-colors">Privacy Policy</a>
            </label>
        </div>

        <!-- Submit Button -->
        <button type="submit" 
                class="w-full mt-6 py-4 px-6 rounded-2xl text-white font-bold text-base bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2 focus:ring-offset-[#030014] transition-all duration-300 shadow-lg shadow-pink-500/25 active:scale-[0.98]">
            Create Free Account
        </button>

        <!-- Divider -->
        <div class="relative flex items-center py-4">
            <div class="flex-grow border-t border-white/10"></div>
            <span class="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium">Already have an account?</span>
            <div class="flex-grow border-t border-white/10"></div>
        </div>

        <!-- Login link -->
        <a href="{{ route('login') }}"
           class="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-slate-300 font-semibold text-base hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 backdrop-blur-md">
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
            const ObjectText = document.getElementById('strength-text');
            if (value.length === 0) {
                [1,2,3,4].forEach(i => document.getElementById(`strength-bar-${i}`).className = 'h-1 flex-1 rounded-full bg-white/10 transition-colors duration-300');
                ObjectText.textContent = '';
                return;
            }

            let score = 0;
            if (value.length >= 8) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value)) score++;

            const configs = [
                { color: 'bg-red-400',    label: 'Weak',      labelColor: 'text-red-400' },
                { color: 'bg-orange-400', label: 'Fair',      labelColor: 'text-orange-400' },
                { color: 'bg-yellow-400', label: 'Good',      labelColor: 'text-yellow-400' },
                { color: 'bg-green-400',  label: 'Strong ✓',  labelColor: 'text-green-400' },
            ];

            const scoreIndex = score === 0 ? 0 : score - 1;
            const config = configs[scoreIndex];

            [1,2,3,4].forEach((i) => {
                const bar = document.getElementById(`strength-bar-${i}`);
                if (i <= score) {
                    bar.className = `h-1 flex-1 rounded-full transition-colors duration-300 ${config.color}`;
                } else {
                    bar.className = 'h-1 flex-1 rounded-full bg-white/10 transition-colors duration-300';
                }
            });

            ObjectText.textContent = config.label;
            ObjectText.className = `text-xs font-medium pt-1 ${config.labelColor}`;
        }
    </script>
</x-guest-layout>
