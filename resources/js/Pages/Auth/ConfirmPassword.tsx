import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Alert from '@/Components/Alert';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 mb-6 ring-1 ring-primary-500/20">
                    <svg className="h-7 w-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">SECURE AREA</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    This is a secure area of the application. Please confirm your password before continuing.
                </p>
            </div>

            <Alert type="error" message={errors.password} />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="input-field"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                </div>

                <div className="pt-2">
                    <button className="btn-primary w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2 text-white">Confirm Password</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
