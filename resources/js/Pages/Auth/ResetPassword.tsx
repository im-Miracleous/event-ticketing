import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Alert from '@/Components/Alert';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Set New Password" />

            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter uppercase">NEW PASSWORD</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm">
                    Enter your new secure password for <br />
                    <span className="text-white font-semibold">{email}</span>
                </p>
            </div>

            <Alert 
                type="error" 
                message={Object.keys(errors).length > 0 ? (
                    <div className="space-y-1">
                        {Object.values(errors).map((error, i) => (
                            <p key={i}>{error}</p>
                        ))}
                    </div>
                ) : null} 
            />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="input-label">New Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="input-field"
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="input-label">Confirm New Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="input-field"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                </div>

                <div className="pt-2">
                    <button className="btn-primary w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2">Update Password</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
