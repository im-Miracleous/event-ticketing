import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

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

            <div className="mb-8 p-1">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back <span className="inline-block animate-bounce">👋</span></h1>
                <p className="text-slate-400 text-sm font-medium">
                    Sign in to your premium event experience.
                </p>
            </div>

            {/* Status message (e.g. after password reset) */}
            {status && (
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-600">
                    {status}
                </div>
            )}

            {/* Login error */}
            {errors.login && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {errors.login}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email or Username */}
                <div>
                    <label htmlFor="login" className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                        Email or Username
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </span>
                        <input
                            id="login"
                            type="text"
                            name="login"
                            value={data.login}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm"
                            autoComplete="username"
                            autoFocus
                            placeholder="you@example.com"
                            onChange={(e) => setData('login', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* Remember me */}
                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked as any)}
                            className="w-4 h-4 rounded text-primary-500 border-white/10 bg-white/5 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="ms-2.5 text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                            Keep me signed in
                        </span>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn-primary w-full py-3.5 text-base"
                    disabled={processing}
                >
                    Sign In
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-navy-950 text-slate-500">New here?</span>
                    </div>
                </div>

                {/* Register link */}
                <Link
                    href={route('register')}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-white/5 bg-white/5 text-slate-300 font-bold text-sm hover:border-primary-500 hover:text-white transition-all duration-200"
                >
                    Create Account
                </Link>
            </form>
        </GuestLayout>
    );
}
