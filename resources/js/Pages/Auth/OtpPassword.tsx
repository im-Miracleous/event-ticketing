import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import Alert from '@/Components/Alert';

export default function OtpPassword({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email,
        code: '',
    });

    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);
        setData('code', newDigits.join(''));

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newDigits = [...digits];
        pasted.split('').forEach((char, i) => {
            newDigits[i] = char;
        });
        setDigits(newDigits);
        setData('code', newDigits.join(''));
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.password'));
    };

    const resend: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.password.resend'));
        setCountdown(60);
        setCanResend(false);
    };

    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 4)) + c)
        : '';

    return (
        <GuestLayout>
            <Head title="Reset Password - Security Code" />

            <div className="text-center mb-10">
                <div className="relative inline-flex h-20 w-20 items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-red-500/10 animate-pulse" />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">SECURITY CODE</h2>
                <div className="h-1 w-12 bg-red-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Enter the multi-factor authentication code sent to <br />
                    <span className="text-slate-900 dark:text-white font-semibold">{maskedEmail}</span>
                </p>
            </div>

            <Alert type="error" message={errors.code} />

            <form onSubmit={submit} className="space-y-8">
                {/* Digit Inputs */}
                <div className="flex justify-between gap-2 sm:gap-4">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={digit}
                            onChange={(e) => handleDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-full h-14 sm:h-16 text-center text-2xl font-black rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all duration-300 shadow-inner"
                            maxLength={1}
                            required={index === 0}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold text-sm uppercase tracking-widest
                            hover:from-amber-400 hover:to-red-500 focus:outline-none focus:ring-4 focus:ring-amber-500/30
                            transition-all duration-300 shadow-xl shadow-red-600/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
                            flex items-center justify-center gap-2"
                        disabled={processing || data.code.length !== 6}
                    >
                        <span>Reset Password</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={resend}
                        className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-center font-bold uppercase tracking-widest"
                        disabled={processing}
                    >
                        {canResend ? (
                            <>Didn't get the code? <span className="text-amber-400 font-bold">Resend</span></>
                        ) : (
                            <>Resend available in <span className="text-white font-bold">{countdown}s</span></>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
