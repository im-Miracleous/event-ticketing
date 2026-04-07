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
        <>
            <Head title="Recover Account" />

            <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 mb-6 ring-1 ring-primary-500/20">
                    <svg className="h-7 w-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter uppercase">FORGOT PASSWORD</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-6" />
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    No worries! Enter the email address associated with your account and we'll send you an OTP.
                </p>
            </div>
            <div className="fp-grid" />
            <div className="fp-noise" />

            {/* Back to home */}
            <a href="/" className="fp-back-btn fp-stagger-0">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
            </a>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-14 sm:px-10">
                {/* Logo */}
                <a href="/" className="fp-stagger-1 flex flex-col items-center gap-5 mb-12 group cursor-pointer" style={{ textDecoration: 'none' }}>
                    <div className="fp-logo-wrapper">
                        <div className="fp-logo-icon">
                            <svg style={{ width: 34, height: 34, color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                            </svg>
                        </div>
                    </div>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                        Event<span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hive</span>
                    </span>
                </a>

                {/* Glassmorphism card */}
                <div className="fp-stagger-2 fp-glass-card w-full" style={{ maxWidth: 440 }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* Heading */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h1 className="heading-font" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                                Forgot password?
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
                                No worries. Enter your email and we'll send you a 6-digit OTP code to reset your password.
                            </p>
                        </div>

                        {/* Status message */}
                        {status && (
                            <div style={{ marginBottom: '1.25rem', padding: '0.7rem 1rem', borderRadius: '0.85rem', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#4ade80', fontSize: '0.82rem', textAlign: 'center' }}>
                                {status}
                            </div>
                        )}

                        {/* Error message */}
                        {errors.email && (
                            <div style={{ marginBottom: '1.25rem', padding: '0.7rem 1rem', borderRadius: '0.85rem', background: 'rgba(248, 113, 113, 0.08)', border: '1px solid rgba(248, 113, 113, 0.2)', color: '#f87171', fontSize: '0.82rem', textAlign: 'center' }}>
                                {errors.email}
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                            {/* Email field */}
                            <div className="fp-field-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label htmlFor="email" className="fp-label" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginLeft: '0.25rem', letterSpacing: '0.02em', transition: 'color 0.3s' }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div className="fp-input-icon" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '0.9rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: '#475569', transition: 'color 0.3s' }}>
                                        <svg style={{ width: 17, height: 17 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={`fp-input ${errors.email ? 'fp-input-error' : ''}`}
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Submit button */}
                            <button type="submit" className="fp-submit-btn" disabled={processing}>
                                <span className="fp-btn-content">
                                    Send OTP Code
                                    <svg style={{ width: 17, height: 17 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="fp-btn-shimmer" />
                            </button>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.15rem 0' }}>
                                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
                                <span style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
                                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />
                            </div>

                            {/* Back to login */}
                            <Link href={route('login')} className="fp-secondary-btn">
                                <svg className="fp-arrow" style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Sign In</span>
                            </Link>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="fp-stagger-3" style={{ marginTop: '4rem', textAlign: 'center', color: 'rgba(100, 116, 139, 0.4)', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.02em' }}>
                    <p>&copy; {new Date().getFullYear()} EventHive. Make every moment count.</p>
                </div>
            </div>
        </>
    );
}
