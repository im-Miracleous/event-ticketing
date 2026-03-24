import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Alert from '@/Components/Alert';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            replace: true,
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter">WELCOME BACK</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-4" />
                <p className="text-slate-400 text-sm">Sign in to your premium event experience.</p>
            </div>

            <Alert type="success" message={status} />
            <Alert type="error" message={errors.login} />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="login" className="input-label">Email or Username</label>
                    <input
                        id="login"
                        type="text"
                        name="login"
                        value={data.login}
                        className="input-field"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('login', e.target.value)}
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="input-label mb-0">Password</label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="input-field"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.password}</p>}
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked as any)}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-md border border-white/20 flex items-center justify-center transition-all ${data.remember ? 'bg-primary-600 border-primary-500' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                {data.remember && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="ms-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Keep me signed in</span>
                    </label>
                </div>

                <div className="pt-2">
                    <button className="btn-primary w-full py-4 group" disabled={processing}>
                        <span className="font-black text-sm tracking-widest uppercase mr-2">Sign In</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <p className="mt-10 text-center text-sm text-slate-500">
                        New here? {' '}
                        <Link href={route('register')} className="text-primary-400 font-bold hover:underline transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
