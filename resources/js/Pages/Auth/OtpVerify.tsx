import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Alert from '@/Components/Alert';

export default function OtpVerify({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify'));
    };

    const resend: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify.resend'));
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 mb-6 ring-1 ring-primary-500/20">
                    <svg className="h-7 w-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">VERIFY EMAIL</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    We've sent a 6-digit verification code to <br />
                    <span className="text-white font-semibold">{email}</span>
                </p>
            </div>

            <Alert type="error" message={errors.code} />

            <form onSubmit={submit} className="space-y-8">
                <div>
                    <label htmlFor="code" className="input-label text-center block w-full mb-4">
                        Verification Code
                    </label>
                    <input
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="input-field text-center text-4xl tracking-[0.75em] font-black placeholder:text-white/5 py-6"
                        placeholder="000000"
                        maxLength={6}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                        required
                        autoFocus
                    />
                </div>

                <div className="pt-2 flex flex-col space-y-6">
                    <button className="btn-primary w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2 text-white">Verify Account</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    
                    <button 
                        type="button"
                        onClick={resend}
                        className="text-sm text-slate-500 hover:text-white transition-colors text-center font-bold uppercase tracking-widest"
                        disabled={processing}
                    >
                        Didn't receive a code? <span className="text-primary-400 ml-1">Resend</span>
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
