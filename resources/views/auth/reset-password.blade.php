<x-guest-layout>
    <div style="position: relative; z-index: 2;">
        {{-- ═══ Heading ═══ --}}
        <div style="text-align: center; margin-bottom: 2rem;">
            <h1 class="heading-font" style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.25;">
                Create new password
            </h1>
            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5;">
                Your identity has been verified. Set a strong new password for your account.
            </p>
        </div>

        <form method="POST" action="{{ route('password.store') }}" style="display: flex; flex-direction: column; gap: 1.35rem;">
            @csrf

            {{-- ═══ Email (read-only) ═══ --}}
            <div class="rp-field-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="email" class="rp-label" style="font-size: 0.78rem; font-weight: 600; color: #64748b; margin-left: 0.25rem; letter-spacing: 0.02em;">
                    Email Address
                </label>
                <div style="position: relative; opacity: 0.55;">
                    <div style="position: absolute; inset-block: 0; left: 0; padding-left: 0.9rem; display: flex; align-items: center; pointer-events: none; color: #475569;">
                        <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                        </svg>
                    </div>
                    <input id="email" type="email" name="email" value="{{ $email }}" required readonly
                           class="rp-input" style="cursor: not-allowed;">
                </div>
            </div>

            {{-- ═══ New Password ═══ --}}
            <div class="rp-field-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="password" class="rp-label" style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; margin-left: 0.25rem; letter-spacing: 0.02em; transition: color 0.3s;">
                    New Password
                </label>
                <div style="position: relative;">
                    <div class="rp-input-icon" style="position: absolute; inset-block: 0; left: 0; padding-left: 0.9rem; display: flex; align-items: center; pointer-events: none; color: #475569; transition: color 0.3s;">
                        <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <input id="password" type="password" name="password" required autofocus autocomplete="new-password"
                           class="rp-input @error('password') rp-input-error @enderror"
                           placeholder="Enter new password">
                    <button type="button" onclick="togglePassword('password', this)"
                            class="rp-toggle-pw" style="position: absolute; inset-block: 0; right: 0; padding-right: 0.9rem; display: flex; align-items: center; background: none; border: none; color: #475569; cursor: pointer; transition: color 0.3s;">
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

            {{-- ═══ Confirm Password ═══ --}}
            <div class="rp-field-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="password_confirmation" class="rp-label" style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; margin-left: 0.25rem; letter-spacing: 0.02em; transition: color 0.3s;">
                    Confirm Password
                </label>
                <div style="position: relative;">
                    <div class="rp-input-icon" style="position: absolute; inset-block: 0; left: 0; padding-left: 0.9rem; display: flex; align-items: center; pointer-events: none; color: #475569; transition: color 0.3s;">
                        <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <input id="password_confirmation" type="password" name="password_confirmation" required autocomplete="new-password"
                           class="rp-input"
                           placeholder="Confirm your new password">
                    <button type="button" onclick="togglePassword('password_confirmation', this)"
                            class="rp-toggle-pw" style="position: absolute; inset-block: 0; right: 0; padding-right: 0.9rem; display: flex; align-items: center; background: none; border: none; color: #475569; cursor: pointer; transition: color 0.3s;">
                        <svg class="eye-open" style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <svg class="eye-closed" style="width: 17px; height: 17px; display: none;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                    </button>
                </div>
                @error('password_confirmation')
                    <p style="font-size: 0.78rem; color: #f87171; margin-left: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                        <svg style="width: 13px; height: 13px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- ═══ Submit Button ═══ --}}
            <button type="submit" class="rp-submit-btn">
                <span class="rp-btn-content">
                    Reset Password
                    <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </span>
                <div class="rp-btn-shimmer"></div>
            </button>
        </form>
    </div>

    {{-- ═══ Scoped Styles ═══ --}}
    <style>
        .rp-input {
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
        .rp-input::placeholder { color: #334155; }
        .rp-input:focus {
            background: rgba(255,255,255,0.06);
            border-color: rgba(124, 58, 237, 0.4);
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08), 0 0 25px rgba(124, 58, 237, 0.06);
        }
        .rp-input-error { border-color: rgba(248, 113, 113, 0.4) !important; }
        .rp-input-error:focus { box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.08), 0 0 25px rgba(248, 113, 113, 0.04) !important; }

        .rp-field-group:focus-within .rp-label { color: #a78bfa !important; }
        .rp-field-group:focus-within .rp-input-icon { color: #a78bfa !important; }

        .rp-toggle-pw:hover { color: #a78bfa !important; }

        .rp-submit-btn {
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
            animation: rp-gradient-shift 5s ease infinite;
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 6px 30px rgba(124, 58, 237, 0.3), 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            margin-top: 0.15rem;
        }
        @keyframes rp-gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .rp-submit-btn:hover {
            box-shadow: 0 10px 45px rgba(124, 58, 237, 0.4), 0 4px 15px rgba(0,0,0,0.3);
            transform: translateY(-2px);
        }
        .rp-submit-btn:active { transform: scale(0.97) translateY(0); }
        .rp-btn-content {
            position: relative; z-index: 2;
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .rp-btn-shimmer {
            position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
            z-index: 1; transition: left 0.6s ease;
        }
        .rp-submit-btn:hover .rp-btn-shimmer { left: 100%; }
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
