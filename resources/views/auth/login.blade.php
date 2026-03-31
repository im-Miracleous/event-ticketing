<x-guest-layout>
    <div class="text-center mb-10">
        <h1 class="heading-font text-4xl font-extrabold text-white mb-3">Welcome back</h1>
        <p class="text-slate-400 text-base">Sign in to your account to continue your journey.</p>
    </div>

    <!-- Session Status -->
    @if (session('status'))
        <div class="mb-6 px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 text-center">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ route('login') }}" class="space-y-6">
        @csrf

        <!-- Email or Username -->
        <div class="space-y-1.5 group/input">
            <label for="login" class="block text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within/input:text-purple-400">Email or Username</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-purple-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                </div>
                <input id="login" type="text" name="login" value="{{ old('login') }}" required autofocus autocomplete="username"
                       class="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('login') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="you@example.com / username">
            </div>
            @error('login')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password -->
        <div class="space-y-1.5 group/input">
            <div class="flex items-center justify-between ml-1">
                <label for="password" class="block text-sm font-medium text-slate-300 transition-colors group-focus-within/input:text-purple-400">Password</label>
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="text-xs font-semibold text-purple-400 hover:text-pink-400 transition-colors">
                        Forgot password?
                    </a>
                @endif
            </div>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-purple-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <input id="password" type="password" name="password" required autocomplete="current-password"
                       class="w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md @error('password') border-red-500/50 focus:ring-red-500/50 @enderror"
                       placeholder="Enter your password">
                <button type="button" onclick="togglePassword('password', this)"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-purple-400 transition-colors focus:outline-none">
                    <svg class="eye-open w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg class="eye-closed w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                </button>
            </div>
            @error('password')
                <p class="text-sm text-red-400 ml-1">{{ $message }}</p>
            @enderror
        </div>

        <!-- Remember Me -->
        <div class="flex items-center ml-1 pt-1">
            <div class="relative flex items-center">
                <input id="remember_me" type="checkbox" name="remember"
                       class="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0 transition-colors cursor-pointer">
            </div>
            <label for="remember_me" class="ml-3 text-sm text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors">
                Remember me for 30 days
            </label>
        </div>

        <!-- Submit Button -->
        <button type="submit" 
                class="w-full py-4 px-6 rounded-2xl text-white font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#030014] transition-all duration-300 shadow-lg shadow-purple-500/25 active:scale-[0.98] mt-2">
            Sign In to EventHive
        </button>

        <!-- Divider -->
        <div class="relative flex items-center py-3">
            <div class="flex-grow border-t border-white/10"></div>
            <span class="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium">or</span>
            <div class="flex-grow border-t border-white/10"></div>
        </div>

        <!-- Register Link Button -->
        <a href="{{ route('register') }}"
           class="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-slate-300 font-semibold text-base hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 backdrop-blur-md group">
            Create a free account
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
