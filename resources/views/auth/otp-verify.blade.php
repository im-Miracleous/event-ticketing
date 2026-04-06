<x-guest-layout>
    <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/30 mb-5">
            <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight mb-2">Check your email</h1>
        <p class="text-slate-400 text-sm leading-relaxed">
            We've sent a 6-digit verification code to<br>
            <span class="text-primary-400 font-semibold">{{ str_replace(substr($email, 1, strpos($email, '@') - 2), '***', $email) }}</span>
        </p>
    </div>

    @if (session('status') === 'otp-sent')
        <div class="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-2">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            A fresh verification code has been sent to your email.
        </div>
    @endif

    <form method="POST" action="{{ route('otp.verify.submit') }}" id="otp-form" class="space-y-8">
        @csrf

        <!-- OTP Input Group -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Code</label>
                <span id="countdown" class="text-xs font-bold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-3 py-1 rounded-lg">10:00</span>
            </div>
            
            <div class="flex gap-3 justify-center">
                @foreach(range(1, 6) as $i)
                    <input type="text" 
                           inputmode="numeric"
                           maxlength="1" 
                           data-index="{{ $i }}"
                           class="otp-digit-input"
                           oninput="handleInput(this)"
                           onkeydown="handleKeyDown(event, this)"
                           onpaste="handlePaste(event)"
                           onfocus="this.select()"
                           @if($i === 1) autofocus @endif>
                @endforeach
            </div>
            <input type="hidden" name="code" id="full-code">
            
            @error('code')
                <div class="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                    <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p class="text-red-400 text-sm">{{ $message }}</p>
                </div>
            @enderror
        </div>

        <button type="submit" class="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify Account
        </button>
    </form>

    <div class="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
        <p class="text-sm text-slate-500">Didn't receive a code?</p>
        
        <form method="POST" action="{{ route('otp.verify.resend') }}" id="resend-form">
            @csrf
            <button type="submit" 
                    id="resend-btn"
                    class="text-sm font-bold text-primary-400 hover:text-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors underline underline-offset-4"
                    disabled>
                Resend Code <span id="resend-timer">(60s)</span>
            </button>
        </form>
    </div>

    <style>
        .otp-digit-input {
            width: 52px;
            height: 60px;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 900;
            border-radius: 16px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            outline: none;
            transition: all 0.2s ease;
            caret-color: #a78bfa;
        }
        .otp-digit-input:focus {
            border-color: #8b5cf6;
            background: rgba(139, 92, 246, 0.1);
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15), 0 8px 25px rgba(139, 92, 246, 0.2);
            transform: translateY(-2px);
        }
        .otp-digit-input.filled {
            border-color: #8b5cf6;
            background: rgba(139, 92, 246, 0.08);
        }
    </style>

    <script>
        const inputs = document.querySelectorAll('.otp-digit-input');
        const fullCodeInput = document.getElementById('full-code');
        const form = document.getElementById('otp-form');

        function handleInput(input) {
            const index = parseInt(input.dataset.index);
            input.value = input.value.replace(/[^0-9]/g, '');

            // Toggle filled class
            input.classList.toggle('filled', input.value !== '');

            if (input.value && index < 6) {
                inputs[index].focus();
            }
            updateFullCode();
        }

        function handleKeyDown(e, input) {
            const index = parseInt(input.dataset.index);

            if (e.key === 'Backspace' && !input.value && index > 1) {
                inputs[index - 2].focus();
                inputs[index - 2].classList.remove('filled');
            }
        }

        function handlePaste(e) {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
            
            pasteData.split('').forEach((char, i) => {
                if (i < 6) {
                    inputs[i].value = char;
                    inputs[i].classList.add('filled');
                }
            });
            
            if (pasteData.length > 0) {
                inputs[Math.min(pasteData.length, 5)].focus();
            }
            updateFullCode();
        }

        function updateFullCode() {
            let code = '';
            inputs.forEach(input => code += input.value);
            fullCodeInput.value = code;
        }

        form.addEventListener('submit', (e) => {
            updateFullCode();
            if (fullCodeInput.value.length !== 6) {
                e.preventDefault();
                alert('Please enter all 6 digits of the verification code.');
            }
        });

        // OTP Expiry Countdown (10 minutes)
        let expirySeconds = 600;
        const countdownEl = document.getElementById('countdown');
        
        const expiryInterval = setInterval(() => {
            expirySeconds--;
            const mins = Math.floor(expirySeconds / 60);
            const secs = expirySeconds % 60;
            countdownEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            if (expirySeconds <= 0) {
                clearInterval(expiryInterval);
                countdownEl.textContent = "Expired";
                countdownEl.className = "text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg";
            }
        }, 1000);

        // Resend Cooldown (60 seconds)
        let resendSeconds = 60;
        const resendBtn = document.getElementById('resend-btn');
        const resendTimerEl = document.getElementById('resend-timer');

        const resendInterval = setInterval(() => {
            resendSeconds--;
            resendTimerEl.textContent = `(${resendSeconds}s)`;
            
            if (resendSeconds <= 0) {
                clearInterval(resendInterval);
                resendBtn.disabled = false;
                resendTimerEl.textContent = "";
            }
        }, 1000);
    </script>
</x-guest-layout>
