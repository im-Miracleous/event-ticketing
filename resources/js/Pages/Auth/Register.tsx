import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useCallback } from 'react';

function getStrength(value: string) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
}

const strengthConfigs = [
    { color: 'bg-red-400', label: 'Weak', labelColor: 'text-red-500' },
    { color: 'bg-orange-400', label: 'Fair', labelColor: 'text-orange-500' },
    { color: 'bg-yellow-400', label: 'Good', labelColor: 'text-yellow-600' },
    { color: 'bg-green-500', label: 'Strong ✓', labelColor: 'text-green-600' },
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'User',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const strength = getStrength(data.password);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <div className="mb-8 p-1">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create your account <span className="inline-block animate-bounce">✨</span></h1>
                <p className="text-slate-400 text-sm font-medium">
                    Join 50,000+ event lovers on EventHive. It's free forever.
                </p>
            </div>

            {/* Validation errors */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 space-y-1">
                    {Object.values(errors).map((error, i) => (
                        <p key={i}>{error}</p>
                    ))}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm ${errors.name ? 'border-red-400/50 bg-red-400/5' : 'border-white/10 bg-white/5'}`}
                            autoComplete="name"
                            placeholder="Your full name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                        Username
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </span>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm ${errors.username ? 'border-red-400/50 bg-red-400/5' : 'border-white/10 bg-white/5'}`}
                            placeholder="Unique username"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm ${errors.email ? 'border-red-400/50 bg-red-400/5' : 'border-white/10 bg-white/5'}`}
                            autoComplete="username"
                            placeholder="you@example.com"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                        Password
                    </label>
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
                            className={`w-full rounded-xl border py-3.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm ${errors.password ? 'border-red-400/50 bg-red-400/5' : 'border-white/10 bg-white/5'}`}
                            autoComplete="new-password"
                            placeholder="Min. 8 characters"
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
                    {/* Strength bar */}
                    {data.password.length > 0 && (
                        <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                            i <= strength
                                                ? strengthConfigs[strength - 1].color
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                            {strength > 0 && (
                                <p className={`text-xs ${strengthConfigs[strength - 1].labelColor}`}>
                                    {strengthConfigs[strength - 1].label}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </span>
                        <input
                            id="password_confirmation"
                            type={showConfirm ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none backdrop-blur-sm"
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirm ? (
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
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2.5">
                    <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-0.5 w-4 h-4 rounded text-primary-500 border-white/10 bg-white/5 focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer leading-relaxed group">
                        I agree to EventHive's{' '}
                        <a href="#" className="text-primary-500 hover:text-white font-bold transition-colors underline decoration-primary-500/30 underline-offset-4">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-primary-500 hover:text-white font-bold transition-colors underline decoration-primary-500/30 underline-offset-4">Privacy Policy</a>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn-primary w-full py-3.5 text-base"
                    disabled={processing}
                >
                    Create Free Account
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-navy-950 text-slate-500">Already have an account?</span>
                    </div>
                </div>

                {/* Login link */}
                <Link
                    href={route('login')}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-white/5 bg-white/5 text-slate-300 font-bold text-sm hover:border-primary-500 hover:text-white transition-all duration-200"
                >
                    Sign in instead
                </Link>
            </form>
        </GuestLayout>
    );
}
