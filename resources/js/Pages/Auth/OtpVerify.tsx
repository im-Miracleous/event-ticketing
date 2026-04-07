import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import Alert from '@/Components/Alert';

export default function OtpVerify({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({
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

        // Auto-focus next input
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
        post(route('otp.verify'));
    };

    const resend: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify.resend'));
        setCountdown(60);
        setCanResend(false);
    };

    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 4)) + c)
        : '';

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="text-center mb-10">
                {/* Animated envelope icon */}
                <div className="relative inline-flex h-20 w-20 items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 animate-pulse" />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">VERIFY EMAIL</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    We've sent a 6-digit verification code to <br />
                    <span className="text-slate-900 dark:text-white font-semibold">{email}</span>
                </p>
            </div>

            <Alert type="error" message={errors.code} />

            <form onSubmit={submit} className="space-y-8">
                {/* Digit Inputs */}
                <div>
                    <label htmlFor="code" className="input-label text-center block w-full mb-4">
                        Verification Code
                    </label>
                    <input
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="input-field text-center text-4xl tracking-[0.75em] font-black placeholder:text-slate-200 dark:placeholder:text-white/5 py-6"
                        placeholder="000000"
                        maxLength={6}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                        required
                        autoFocus
                    />
                </div>

                <div className="space-y-4">
                    <button
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-sm uppercase tracking-widest
                            hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/30
                            transition-all duration-300 shadow-xl shadow-primary-600/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
                            flex items-center justify-center gap-2"
                        disabled={processing || digits.some(d => !d)}
                    >
                        <span>Verify Account</span>
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
                            <>Didn't receive the magic code? <span className="text-primary-400 font-bold">Resend</span></>
                        ) : (
                            <>Resend available in <span className="text-white font-bold">{countdown}s</span></>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
