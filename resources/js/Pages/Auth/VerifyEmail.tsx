import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Alert from '@/Components/Alert';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 mb-6 ring-1 ring-primary-500/20">
                    <svg className="h-7 w-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">VERIFY EMAIL</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                </p>
            </div>

            <Alert 
                type="success" 
                message={status === 'verification-link-sent' ? 'A new verification link has been sent to your email address.' : null} 
            />

            <form onSubmit={submit} className="space-y-6">
                <div className="pt-2 flex flex-col space-y-6">
                    <button className="btn-primary w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2 text-white">Resend Email</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        type="button"
                        className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-center font-bold uppercase tracking-widest"
                    >
                        Log Out
                    </Link>



                </div>
            </form>
        </GuestLayout>
    );
}
