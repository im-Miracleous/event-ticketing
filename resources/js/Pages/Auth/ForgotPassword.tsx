import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recover Account" />

            <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 mb-6 ring-1 ring-primary-500/20">
                    <svg className="h-7 w-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">FORGOT PASSWORD</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    No worries! Enter the email address associated with your account and we'll send you an OTP.
                </p>
            </div>

            {status && <div className="mb-6 text-sm font-medium text-secondary-400 text-center bg-secondary-500/10 py-3 rounded-xl border border-secondary-500/20">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="input-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="input-field"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.email}</p>}
                </div>

                <div className="pt-2">
                    <button className="btn-primary w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2 text-white">Send OTP Code</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <p className="mt-10 text-center text-sm text-slate-500">
                        Remembered it? {' '}
                        <Link href={route('login')} className="text-primary-400 font-bold hover:underline transition-colors">
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
