import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';

export default function OtpVerify({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });
    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const updateCode = (newDigits: string[]) => {
        setDigits(newDigits);
        setData('code', newDigits.join(''));
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        updateCode(newDigits);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const newDigits = [...digits];
        pasted.split('').forEach((char, i) => { newDigits[i] = char; });
        updateCode(newDigits);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify.submit'));
    };

    const resend: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify.resend'));
        setCooldown(60);
        timerRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const isComplete = digits.every(d => d !== '');

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            {/* Header */}
            <div className="text-center mb-10">
                {/* Icon */}
                <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600/30 to-primary-900/50 border border-primary-500/30 flex items-center justify-center shadow-2xl shadow-primary-500/20">
                        <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-navy-950 animate-pulse" />
                </div>

                <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                    Cek Email Kamu!
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Kode 6-digit telah dikirim ke<br />
                    <span className="text-primary-400 font-bold">{email}</span>
                </p>
            </div>

            {/* Error */}
            {errors.code && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-red-400 text-sm font-medium">{errors.code}</p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-8">
                {/* OTP Boxes */}
                <div>
                    <label className="block text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                        Masukkan Kode Verifikasi
                    </label>
                    <div className="flex justify-center gap-3">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(index, e.target.value)}
                                onKeyDown={e => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                onFocus={e => e.target.select()}
                                autoFocus={index === 0}
                                className={`
                                    w-12 h-14 text-center text-2xl font-black rounded-2xl
                                    border-2 outline-none transition-all duration-200
                                    bg-white/5 text-white caret-primary-400
                                    ${digit
                                        ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                                        : 'border-white/10 hover:border-white/20'
                                    }
                                    focus:border-primary-400 focus:bg-primary-500/10 focus:shadow-lg focus:shadow-primary-500/20
                                `}
                                style={{ colorScheme: 'dark' }}
                            />
                        ))}
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mt-5">
                        {digits.map((digit, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-300 ${digit ? 'w-6 bg-primary-500' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing || !isComplete}
                    className={`
                        w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest
                        flex items-center justify-center gap-2 transition-all duration-300
                        ${isComplete
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 active:scale-95'
                            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                        }
                    `}
                >
                    {processing ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Memverifikasi...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verifikasi Akun
                        </>
                    )}
                </button>

                {/* Resend */}
                <div className="text-center">
                    <p className="text-slate-500 text-sm mb-2">Tidak menerima kode?</p>
                    {cooldown > 0 ? (
                        <p className="text-slate-400 text-sm font-medium">
                            Kirim ulang dalam <span className="text-primary-400 font-black">{cooldown}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={resend}
                            disabled={processing}
                            className="text-primary-400 hover:text-primary-300 font-bold text-sm transition-colors underline underline-offset-4"
                        >
                            Kirim Ulang Kode
                        </button>
                    )}
                </div>
            </form>
        </GuestLayout>
    );
}
