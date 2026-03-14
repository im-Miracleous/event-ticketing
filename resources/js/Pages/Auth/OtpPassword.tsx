import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function OtpPassword({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email,
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.password'));
    };

    const resend: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.password.resend'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                    <svg className="h-7 w-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">SECURITY CODE</h2>
                <div className="h-1 w-12 bg-red-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Enter the multi-factor authentication code sent to <br />
                    <span className="text-white font-semibold">{email}</span>
                </p>
            </div>

            <form onSubmit={submit} className="space-y-8">
                <div>
                    <label htmlFor="code" className="input-label text-center block w-full mb-4">
                        Security Verification
                    </label>
                    <input
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="input-field text-center text-4xl tracking-[0.75em] font-black placeholder:text-white/5 py-6 border-red-500/20 focus:ring-red-500/40 focus:border-red-500/40"
                        placeholder="000000"
                        maxLength={6}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                        required
                        autoFocus
                    />
                    {errors.code && <p className="mt-3 text-xs text-red-400 text-center font-bold tracking-wide">{errors.code}</p>}
                </div>

                <div className="pt-2 flex flex-col space-y-6">
                    <button className="btn-primary bg-red-600 hover:bg-red-700 shadow-red-500/20 w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2 text-white">Reset Password</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                    
                    <button 
                        type="button"
                        onClick={resend}
                        className="text-sm text-slate-500 hover:text-white transition-colors text-center font-bold uppercase tracking-widest"
                        disabled={processing}
                    >
                        Resend security code
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
