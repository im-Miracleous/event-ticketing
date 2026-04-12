<x-guest-layout>
    <div style="position: relative; z-index: 2;">
        {{-- ═══ Heading ═══ --}}
        <div style="text-align: center; margin-bottom: 2rem;">
            <h1 class="heading-font" style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.25;">
                Welcome back
            </h1>
            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5;">
                Sign in to your account to continue your journey.
            </p>
        </div>

        {{-- ═══ Session Status ═══ --}}
        @if (session('status'))
            <div style="margin-bottom: 1.25rem; padding: 0.7rem 1rem; border-radius: 0.85rem; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); color: #4ade80; font-size: 0.82rem; text-align: center;">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" style="display: flex; flex-direction: column; gap: 1.35rem;">
            @csrf

            {{-- ═══ Email or Username ═══ --}}
            <div class="auth-field-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="login" class="auth-label" style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; margin-left: 0.25rem; letter-spacing: 0.02em; transition: color 0.3s;">
                    Email or Username
                </label>
                <div style="position: relative;">
                    <div class="auth-input-icon" style="position: absolute; inset-block: 0; left: 0; padding-left: 0.9rem; display: flex; align-items: center; pointer-events: none; color: #475569; transition: color 0.3s;">
                        <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                        </svg>
                    </div>
                    <input id="login" type="text" name="login" value="{{ old('login') }}" required autofocus autocomplete="username"
                           class="auth-input @error('login') auth-input-error @enderror"
                           placeholder="you@example.com / username">
                </div>
                @error('login')
                    <p style="font-size: 0.78rem; color: #f87171; margin-left: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                        <svg style="width: 13px; height: 13px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- ═══ Password ═══ --}}
            <div class="auth-field-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin: 0 0.25rem;">
                    <label for="password" class="auth-label" style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.02em; transition: color 0.3s;">
                        Password
                    </label>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="forgot-link" style="font-size: 0.72rem; font-weight: 600; color: #a78bfa; text-decoration: none; transition: all 0.3s;">
                            Forgot password?
                        </a>
                    @endif
                </div>
                <div style="position: relative;">
                    <div class="auth-input-icon" style="position: absolute; inset-block: 0; left: 0; padding-left: 0.9rem; display: flex; align-items: center; pointer-events: none; color: #475569; transition: color 0.3s;">
                        <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <input id="password" type="password" name="password" required autocomplete="current-password"
                           class="auth-input @error('password') auth-input-error @enderror"
                           placeholder="Enter your password">
                    <button type="button" onclick="togglePassword('password', this)"
                            class="toggle-pw-btn" style="position: absolute; inset-block: 0; right: 0; padding-right: 0.9rem; display: flex; align-items: center; background: none; border: none; color: #475569; cursor: pointer; transition: color 0.3s;">
                        <svg class="eye-open" style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <svg class="eye-closed" style="width: 17px; height: 17px; display: none;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                    </button>
                </div>
                @error('password')
                    <p style="font-size: 0.78rem; color: #f87171; margin-left: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                        <svg style="width: 13px; height: 13px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- ═══ Remember Me ═══ --}}
            <div style="display: flex; align-items: center; margin-left: 0.25rem;">
                <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none;">
                    <input id="remember_me" type="checkbox" name="remember"
                           class="auth-checkbox">
                    <span style="font-size: 0.8rem; color: #64748b; transition: color 0.3s;">
                        Remember me for 30 days
                    </span>
                </label>
            </div>

            {{-- ═══ Submit Button ═══ --}}
            <button type="submit" id="login-submit-btn" class="auth-submit-btn">
                <span class="btn-content">
                    Sign In to EventHive
                    <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </span>
                <div class="btn-shimmer"></div>
            </button>

            {{-- ═══ Divider ═══ --}}
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.15rem 0;">
                <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);"></div>
                <span style="color: #475569; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">or</span>
                <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);"></div>
            </div>

            {{-- ═══ Register Link ═══ --}}
            <a href="{{ route('register') }}" id="register-link" class="auth-register-btn">
                <span>Create a free account</span>
                <svg class="register-arrow" style="width: 15px; height: 15px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </form>
    </div>

    {{-- ═══ Scoped Styles ═══ --}}
    <style>
        .auth-input {
            width: 100%;
            padding: 0.85rem 1rem 0.85rem 2.6rem;
            background: rgba(255,255,255,0.035);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 0.9rem;
            color: #fff;
            font-size: 0.88rem;
            font-family: 'Inter', sans-serif;
            outline: none;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .auth-input::placeholder { color: #334155; }
        .auth-input:focus {
            background: rgba(255,255,255,0.06);
            border-color: rgba(124, 58, 237, 0.4);
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08), 0 0 25px rgba(124, 58, 237, 0.06);
        }
        .auth-input-error {
            border-color: rgba(248, 113, 113, 0.4) !important;
        }
        .auth-input-error:focus {
            box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.08), 0 0 25px rgba(248, 113, 113, 0.04) !important;
        }

        /* Focus state: label + icon color change */
        .auth-field-group:focus-within .auth-label { color: #a78bfa !important; }
        .auth-field-group:focus-within .auth-input-icon { color: #a78bfa !important; }

        /* Forgot link */
        .forgot-link:hover { color: #f472b6 !important; }

        /* Toggle password button */
        .toggle-pw-btn:hover { color: #a78bfa !important; }

        /* Checkbox */
        .auth-checkbox {
            width: 16px; height: 16px;
            border-radius: 4px;
            border: 1.5px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.03);
            accent-color: #7C3AED;
            cursor: pointer;
            transition: all 0.3s;
        }

        /* Submit button */
        .auth-submit-btn {
            position: relative;
            width: 100%;
            padding: 0.9rem 1.5rem;
            border: none;
            border-radius: 0.9rem;
            color: #fff;
            font-weight: 700;
            font-size: 0.92rem;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            background: linear-gradient(135deg, #7C3AED 0%, #a855f7 50%, #EC4899 100%);
            background-size: 200% 200%;
            animation: gradient-shift 5s ease infinite;
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 6px 30px rgba(124, 58, 237, 0.3), 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            margin-top: 0.15rem;
        }
        @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .auth-submit-btn:hover {
            box-shadow: 0 10px 45px rgba(124, 58, 237, 0.4), 0 4px 15px rgba(0,0,0,0.3);
            transform: translateY(-2px);
        }
        .auth-submit-btn:active {
            transform: scale(0.97) translateY(0);
        }
        .btn-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-shimmer {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
            z-index: 1;
            transition: left 0.6s ease;
        }
        .auth-submit-btn:hover .btn-shimmer {
            left: 100%;
        }

        /* Register link */
        .auth-register-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.85rem 1.5rem;
            border-radius: 0.9rem;
            border: 1px solid rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.02);
            color: #94a3b8;
            font-weight: 600;
            font-size: 0.88rem;
            text-decoration: none;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(8px);
        }
        .auth-register-btn:hover {
            background: rgba(124, 58, 237, 0.08);
            border-color: rgba(124, 58, 237, 0.2);
            color: #c4b5fd;
        }
        .register-arrow { transition: transform 0.3s ease; }
        .auth-register-btn:hover .register-arrow { transform: translateX(4px); }
    </style>

    <script>
        function togglePassword(id, btn) {
            const input = document.getElementById(id);
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.querySelector('.eye-open').style.display = isPassword ? 'none' : 'block';
            btn.querySelector('.eye-closed').style.display = isPassword ? 'block' : 'none';
        }
    </script>
</x-guest-layout>
