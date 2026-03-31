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

            <style>{`
                body { background-color: #030014 !important; min-height: 100vh; overflow-x: hidden; font-family: 'Inter', sans-serif; color: #fff; }
                h1, h2, h3, .heading-font { font-family: 'Plus Jakarta Sans', sans-serif; }

                .fp-ambient-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
                .fp-orb { position: absolute; border-radius: 50%; filter: blur(100px); will-change: transform; }
                .fp-orb-1 { width: 600px; height: 600px; background: rgba(124, 58, 237, 0.15); top: -15%; left: -10%; animation: fp-orbit-1 25s ease-in-out infinite; }
                .fp-orb-2 { width: 500px; height: 500px; background: rgba(236, 72, 153, 0.10); bottom: -10%; right: -10%; animation: fp-orbit-2 30s ease-in-out infinite; }
                .fp-orb-3 { width: 350px; height: 350px; background: rgba(59, 130, 246, 0.08); top: 30%; right: 20%; animation: fp-orbit-3 22s ease-in-out infinite; }

                @keyframes fp-orbit-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(80px, 40px) scale(1.1); } 50% { transform: translate(-30px, 80px) scale(0.9); } 75% { transform: translate(60px, -20px) scale(1.05); } }
                @keyframes fp-orbit-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(-60px, -50px) scale(1.05); } 50% { transform: translate(40px, -80px) scale(0.95); } 75% { transform: translate(-30px, 30px) scale(1.1); } }
                @keyframes fp-orbit-3 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(-50px, 30px); } 66% { transform: translate(30px, -40px); } }

                .fp-grid { position: fixed; inset: 0; z-index: 1; background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px); background-size: 64px 64px; mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 70%); }
                .fp-noise { position: fixed; inset: 0; z-index: 2; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); pointer-events: none; }

                .fp-back-btn { position: fixed; top: 1.75rem; left: 2rem; z-index: 50; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 9999px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: #94a3b8; font-size: 0.82rem; font-weight: 500; text-decoration: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
                .fp-back-btn:hover { background: rgba(124, 58, 237, 0.12); border-color: rgba(124, 58, 237, 0.3); color: #c4b5fd; transform: translateX(-4px); box-shadow: 0 0 25px rgba(124, 58, 237, 0.15); }
                .fp-back-btn:hover svg { transform: translateX(-3px); }
                .fp-back-btn svg { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

                .fp-logo-wrapper { position: relative; }
                .fp-logo-wrapper::after { content: ''; position: absolute; inset: -15px; border-radius: 50%; background: radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%); z-index: -1; animation: fp-logo-pulse 4s ease-in-out infinite alternate; }
                @keyframes fp-logo-pulse { 0% { opacity: 0.5; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1.15); } }
                .fp-logo-icon { width: 72px; height: 72px; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #7C3AED 0%, #a855f7 50%, #EC4899 100%); box-shadow: 0 0 40px rgba(124, 58, 237, 0.4), 0 0 80px rgba(124, 58, 237, 0.15), inset 0 1px 1px rgba(255,255,255,0.2); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }

                .fp-glass-card { background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 1.75rem; padding: 2.5rem; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03) inset, 0 1px 0 rgba(255, 255, 255, 0.05) inset; position: relative; overflow: hidden; }
                .fp-glass-card::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), rgba(236, 72, 153, 0.5), transparent); }
                .fp-glass-card::after { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 200px; height: 150px; background: radial-gradient(ellipse, rgba(124, 58, 237, 0.06), transparent 70%); pointer-events: none; }

                .fp-input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.6rem; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07); border-radius: 0.9rem; color: #fff; font-size: 0.88rem; font-family: 'Inter', sans-serif; outline: none; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-sizing: border-box; }
                .fp-input::placeholder { color: #334155; }
                .fp-input:focus { background: rgba(255,255,255,0.06); border-color: rgba(124, 58, 237, 0.4); box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08), 0 0 25px rgba(124, 58, 237, 0.06); }
                .fp-input-error { border-color: rgba(248, 113, 113, 0.4) !important; }

                .fp-field-group:focus-within .fp-label { color: #a78bfa !important; }
                .fp-field-group:focus-within .fp-input-icon { color: #a78bfa !important; }

                .fp-submit-btn { position: relative; width: 100%; padding: 0.9rem 1.5rem; border: none; border-radius: 0.9rem; color: #fff; font-weight: 700; font-size: 0.92rem; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; background: linear-gradient(135deg, #7C3AED 0%, #a855f7 50%, #EC4899 100%); background-size: 200% 200%; animation: fp-gradient-shift 5s ease infinite; cursor: pointer; overflow: hidden; box-shadow: 0 6px 30px rgba(124, 58, 237, 0.3), 0 2px 10px rgba(0,0,0,0.2); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fp-gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                .fp-submit-btn:hover { box-shadow: 0 10px 45px rgba(124, 58, 237, 0.4), 0 4px 15px rgba(0,0,0,0.3); transform: translateY(-2px); }
                .fp-submit-btn:active { transform: scale(0.97) translateY(0); }
                .fp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
                .fp-btn-content { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .fp-btn-shimmer { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%); z-index: 1; transition: left 0.6s ease; }
                .fp-submit-btn:hover .fp-btn-shimmer { left: 100%; }

                .fp-secondary-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.85rem 1.5rem; border-radius: 0.9rem; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: #94a3b8; font-weight: 600; font-size: 0.88rem; text-decoration: none; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(8px); }
                .fp-secondary-btn:hover { background: rgba(124, 58, 237, 0.08); border-color: rgba(124, 58, 237, 0.2); color: #c4b5fd; }
                .fp-secondary-btn:hover .fp-arrow { transform: translateX(-4px); }
                .fp-arrow { transition: transform 0.3s ease; }

                @keyframes fp-fade-in-up { from { opacity: 0; transform: translateY(30px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
                @keyframes fp-fade-in-down { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
                .fp-stagger-0 { animation: fp-fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.05s; opacity: 0; }
                .fp-stagger-1 { animation: fp-fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.15s; opacity: 0; }
                .fp-stagger-2 { animation: fp-fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s; opacity: 0; }
                .fp-stagger-3 { animation: fp-fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.45s; opacity: 0; }
            `}</style>

            {/* Background layers */}
            <div className="fp-ambient-bg">
                <div className="fp-orb fp-orb-1" />
                <div className="fp-orb fp-orb-2" />
                <div className="fp-orb fp-orb-3" />
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
