<x-guest-layout>
    <div style="position: relative; z-index: 2;">
        {{-- ═══ Heading ═══ --}}
        <div style="text-align: center; margin-bottom: 2rem;">
            <h1 class="heading-font" style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.25;">
                Forgot password?
            </h1>
            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5;">
                No worries. Enter your email and we'll send you a 6-digit OTP code to reset your password.
            </p>
        </div>

        {{-- ═══ Session Status ═══ --}}
        @if (session('status'))
            <div style="margin-bottom: 1.25rem; padding: 0.7rem 1rem; border-radius: 0.85rem; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); color: #4ade80; font-size: 0.82rem; text-align: center;">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('password.email') }}" style="display: flex; flex-direction: column; gap: 1.35rem;">
            @csrf

            {{-- ═══ Email ═══ --}}
            <div class="fp-field-group" style="display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="email" class="fp-label" style="font-size: 0.78rem; font-weight: 600; color: #94a3b8; margin-left: 0.25rem; letter-spacing: 0.02em; transition: color 0.3s;">
                    Email Address
                </label>
                <div style="position: relative;">
                    <div class="fp-input-icon" style="position: absolute; inset-block: 0; left: 0; padding-left: 0.9rem; display: flex; align-items: center; pointer-events: none; color: #475569; transition: color 0.3s;">
                        <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                        </svg>
                    </div>
                    <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="email"
                           class="fp-input @error('email') fp-input-error @enderror"
                           placeholder="you@example.com">
                </div>
                @error('email')
                    <p style="font-size: 0.78rem; color: #f87171; margin-left: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                        <svg style="width: 13px; height: 13px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                        {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- ═══ Submit Button ═══ --}}
            <button type="submit" class="fp-submit-btn">
                <span class="fp-btn-content">
                    Send OTP Code
                    <svg style="width: 17px; height: 17px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </span>
                <div class="fp-btn-shimmer"></div>
            </button>

            {{-- ═══ Divider ═══ --}}
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.15rem 0;">
                <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);"></div>
                <span style="color: #475569; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">or</span>
                <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);"></div>
            </div>

            {{-- ═══ Back to Login ═══ --}}
            <a href="{{ route('login') }}" class="fp-back-btn">
                <svg class="fp-back-arrow" style="width: 15px; height: 15px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span>Back to Sign In</span>
            </a>
        </form>
    </div>

    {{-- ═══ Scoped Styles ═══ --}}
    <style>
        .fp-input {
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
        .fp-input::placeholder { color: #334155; }
        .fp-input:focus {
            background: rgba(255,255,255,0.06);
            border-color: rgba(124, 58, 237, 0.4);
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08), 0 0 25px rgba(124, 58, 237, 0.06);
        }
        .fp-input-error {
            border-color: rgba(248, 113, 113, 0.4) !important;
        }
        .fp-input-error:focus {
            box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.08), 0 0 25px rgba(248, 113, 113, 0.04) !important;
        }

        .fp-field-group:focus-within .fp-label { color: #a78bfa !important; }
        .fp-field-group:focus-within .fp-input-icon { color: #a78bfa !important; }

        .fp-submit-btn {
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
            animation: fp-gradient-shift 5s ease infinite;
            cursor: pointer;
            overflow: hidden;
            box-shadow: 0 6px 30px rgba(124, 58, 237, 0.3), 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            margin-top: 0.15rem;
        }
        @keyframes fp-gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .fp-submit-btn:hover {
            box-shadow: 0 10px 45px rgba(124, 58, 237, 0.4), 0 4px 15px rgba(0,0,0,0.3);
            transform: translateY(-2px);
        }
        .fp-submit-btn:active {
            transform: scale(0.97) translateY(0);
        }
        .fp-btn-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .fp-btn-shimmer {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
            z-index: 1;
            transition: left 0.6s ease;
        }
        .fp-submit-btn:hover .fp-btn-shimmer {
            left: 100%;
        }

        .fp-back-btn {
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
        .fp-back-btn:hover {
            background: rgba(124, 58, 237, 0.08);
            border-color: rgba(124, 58, 237, 0.2);
            color: #c4b5fd;
        }
        .fp-back-arrow { transition: transform 0.3s ease; }
        .fp-back-btn:hover .fp-back-arrow { transform: translateX(-4px); }
    </style>
</x-guest-layout>
