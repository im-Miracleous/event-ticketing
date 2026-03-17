<x-guest-layout>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password 🔐</h1>
        <p class="text-gray-500 text-sm">Enter the security code sent to <span class="font-semibold text-gray-900">{{ str_replace(substr($email, 1, strpos($email, '@') - 2), '***', $email) }}</span> to reset your password.</p>
    </div>

    @if (session('status') === 'otp-sent')
        <div class="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Security code has been re-sent.
        </div>
    @endif

    <form method="POST" action="{{ route('otp.password.verify') }}" id="otp-form" class="space-y-6">
        @csrf

        <!-- OTP Input Group -->
        <div>
            <div class="flex items-center justify-between mb-4">
                <label class="input-label mb-0">6-Digit Security Code</label>
                <span id="countdown" class="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">10:00</span>
            </div>
            
            <div class="flex gap-2 sm:gap-3">
                @foreach(range(1, 6) as $i)
                    <input type="text" 
                           maxlength="1" 
                           data-index="{{ $i }}"
                           class="otp-digit-input w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50 uppercase"
                           oninput="handleInput(this)"
                           onkeydown="handleKeyDown(event, this)"
                           onpaste="handlePaste(event)">
                @endforeach
            </div>
            <input type="hidden" name="code" id="full-code">
            
            @error('code')
                <p class="mt-2 text-xs text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <button type="submit" class="btn-primary w-full py-3.5 text-base bg-red-600 hover:bg-red-700 focus:ring-red-500">
            Verify Code
        </button>
    </form>

    <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
        <p class="text-sm text-gray-500">Didn't receive the email?</p>
        
        <form method="POST" action="{{ route('otp.password.resend') }}" id="resend-form">
            @csrf
            <button type="submit" 
                    id="resend-btn"
                    class="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled>
                Resend Code <span id="resend-timer">(60s)</span>
            </button>
        </form>
        
        <a href="{{ route('password.request') }}" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Try a different email address
        </a>
    </div>

    <script>
        const inputs = document.querySelectorAll('.otp-digit-input');
        const fullCodeInput = document.getElementById('full-code');
        const form = document.getElementById('otp-form');

        function handleInput(input) {
            const index = parseInt(input.dataset.index);
            input.value = input.value.replace(/[^0-9]/g, '');

            if (input.value && index < 6) {
                inputs[index].focus();
            }
            updateFullCode();
        }

        function handleKeyDown(e, input) {
            const index = parseInt(input.dataset.index);

            if (e.key === 'Backspace' && !input.value && index > 1) {
                inputs[index - 2].focus();
            }
        }

        function handlePaste(e) {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
            
            pasteData.split('').forEach((char, i) => {
                if (i < 6) {
                    inputs[i].value = char;
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
                alert('Please enter all 6 digits of the security code.');
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
