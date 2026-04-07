<x-guest-layout>
@section('title', 'Verify OTP')

<div class="glass-card p-10 animate-slide-up relative overflow-hidden group">
    <!-- Subtle hover glow effect -->
    <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-600/5 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-primary-600/10"></div>

    <div class="text-center mb-10 relative z-10">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600/10 mb-6 ring-1 ring-primary-500/20 backdrop-blur-sm relative">
            <div class="absolute inset-0 bg-primary-500/10 rounded-2xl blur-lg animate-pulse"></div>
            <svg class="h-8 w-8 text-primary-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>
        <h1 class="text-3xl font-black text-white mb-3 tracking-tight tracking-tighter">CHECK YOUR EMAIL 📧</h1>
        <p class="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-widest font-bold">
            We've sent a 6-digit verification code to<br/>
            <span class="text-primary-300 font-black mt-1 inline-block">{{ str_replace(substr($email, 1, strpos($email, '@') - 2), '***', $email) }}</span>
        </p>
    </div>

    @if (session('status') === 'otp-sent')
        <div class="mb-8 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-3 animate-slide-up">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Fresh code delivered to your inbox.</span>
        </div>
    @endif

    <form method="POST" action="{{ route('otp.verify.submit') }}" id="otp-form" class="space-y-8 relative z-10">
        @csrf

        <!-- OTP Input Group -->
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 leading-none">Verification Code</label>
                <div id="countdown-container" class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 ring-1 ring-white/5">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]"></span>
                    <span id="countdown" class="text-[10px] font-black text-primary-300 font-mono tracking-tighter uppercase leading-none">10:00</span>
                </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 justify-center">
                @foreach(range(1, 6) as $i)
                    <input type="text" 
                           maxlength="1" 
                           inputmode="numeric"
                           data-index="{{ $i }}"
                           style="width:50px; height:58px; flex-shrink:0;"
                           class="otp-digit-input text-center text-2xl font-black rounded-xl border border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all duration-300 bg-white/5 text-white placeholder-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md"
                           oninput="handleInput(this)"
                           onkeydown="handleKeyDown(event, this)"
                           onpaste="handlePaste(event)"
                           autocomplete="one-time-code"
                           required>
                @endforeach
            </div>
            <input type="hidden" name="code" id="full-code">
            
            @error('code')
                <div class="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 animate-shake">
                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-xs font-semibold text-red-400">{{ $message }}</p>
                </div>
            @enderror
        </div>

        <button type="submit" class="btn-primary w-full py-4 text-base font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 group relative overflow-hidden transition-all duration-500 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-95">
            <span class="relative z-10">Verify Account</span>
            <svg class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <!-- Reflective shimmer animation -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
        </button>
    </form>

    <div class="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-6 relative z-10">
        <p class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Didn't receive the magic code?</p>
        
        <form method="POST" action="{{ route('otp.verify.resend') }}" id="resend-form">
            @csrf
            <button type="submit" 
                    id="resend-btn"
                    class="group flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black text-primary-400 hover:text-white hover:bg-primary-600/20 border border-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em]"
                    disabled>
                <svg class="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Resend Code <span id="resend-timer" class="font-mono tracking-tighter">(60s)</span></span>
            </button>
        </form>
        
        <a href="{{ route('register') }}" class="text-[10px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-[0.3em] transition-colors flex items-center gap-2 group">
            <svg class="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M15 19l-7-7 7-7" />
            </svg>
            Back to registration
        </a>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const inputs = document.querySelectorAll('.otp-digit-input');
        const fullCodeInput = document.getElementById('full-code');
        const form = document.getElementById('otp-form');

        // Focus first input
        inputs[0].focus();

        window.handleInput = (input) => {
            const index = parseInt(input.dataset.index);
            input.value = input.value.replace(/[^0-9]/g, '');

            if (input.value && index < 6) {
                inputs[index].focus();
            }
            updateFullCode();
        };

        window.handleKeyDown = (e, input) => {
            const index = parseInt(input.dataset.index);

            if (e.key === 'Backspace' && !input.value && index > 1) {
                inputs[index - 2].focus();
            }
            
            if (e.key === 'ArrowLeft' && index > 1) {
                inputs[index - 2].focus();
            }
            
            if (e.key === 'ArrowRight' && index < 6) {
                inputs[index].focus();
            }
        };

        window.handlePaste = (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
            
            pasteData.split('').forEach((char, i) => {
                if (i < 6) {
                    inputs[i].value = char;
                }
            });
            
            if (pasteData.length > 0) {
                const nextIndex = Math.min(pasteData.length, 5);
                inputs[nextIndex].focus();
            }
            updateFullCode();
        };

        function updateFullCode() {
            let code = '';
            inputs.forEach(input => code += input.value);
            fullCodeInput.value = code;
        }

        form.addEventListener('submit', (e) => {
            updateFullCode();
            if (fullCodeInput.value.length !== 6) {
                e.preventDefault();
                // Add shake effect to inputs if incomplete
                inputs.forEach(input => {
                    if (!input.value) {
                        input.classList.add('border-red-500/50', 'bg-red-500/5');
                        setTimeout(() => input.classList.remove('border-red-500/50', 'bg-red-500/5'), 1000);
                    }
                });
            }
        });

        // OTP Expiry Countdown (10 minutes)
        let expirySeconds = 600;
        const countdownEl = document.getElementById('countdown');
        const countdownContainer = document.getElementById('countdown-container');
        
        const expiryInterval = setInterval(() => {
            expirySeconds--;
            const mins = Math.floor(expirySeconds / 60);
            const secs = expirySeconds % 60;
            countdownEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            if (expirySeconds <= 60) { // Last minute warning
                countdownEl.classList.add('text-secondary-400');
                countdownContainer.classList.add('border-secondary-500/30');
            }
            
            if (expirySeconds <= 0) {
                clearInterval(expiryInterval);
                countdownEl.textContent = "Expired";
                countdownContainer.className = "flex items-center gap-2 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20";
                countdownEl.className = "text-xs font-bold text-red-500 font-mono";
                document.querySelector('#countdown-container span:first-child').className = "w-1.5 h-1.5 rounded-full bg-red-500";
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
    });
</script>
</x-guest-layout>
