import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import Modal from '@/Components/Modal';

/* ─── Component ─────────────────────────────────────────────────────── */

interface Props {
    settings: Record<string, string | null>;
}

const CURRENCIES = [
    { code: 'IDR', label: 'Indonesian Rupiah (Rp)' },
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' },
    { code: 'SGD', label: 'Singapore Dollar (S$)' },
    { code: 'MYR', label: 'Malaysian Ringgit (RM)' },
    { code: 'JPY', label: 'Japanese Yen (¥)' },
    { code: 'AUD', label: 'Australian Dollar (A$)' },
];

export default function AdminSettings({ settings }: Props) {
    const { data, setData, put, processing } = useForm({
        app_name: settings.app_name || 'EventHive',
        app_tagline: settings.app_tagline || '',
        platform_fee: settings.platform_fee || '20',
        contact_email: settings.contact_email || '',
        currency: settings.currency || 'IDR',
        social_facebook: settings.social_facebook || '',
        social_instagram: settings.social_instagram || '',
        social_twitter: settings.social_twitter || '',
        payment_gateway: settings.payment_gateway || 'Midtrans',
        payment_mode: settings.payment_mode || 'Sandbox',
        payment_api_key: settings.payment_api_key || '',
    });

    // API Key reveal state
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [revealedApiKey, setRevealedApiKey] = useState<string | null>(null);
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        put(route('admin.settings.update'));
    };

    const handleRevealApiKey = () => {
        setShowApiKeyModal(true);
        setPassword('');
        setPasswordError('');
    };

    const handleVerifyPassword = async () => {
        setVerifying(true);
        setPasswordError('');

        try {
            const response = await fetch(route('admin.settings.verifyPassword'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                const result = await response.json();
                setRevealedApiKey(result.api_key);
                setApiKeyVisible(true);
                setShowApiKeyModal(false);
            } else {
                setPasswordError('The password is incorrect.');
            }
        } catch {
            setPasswordError('An error occurred. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleHideApiKey = () => {
        setRevealedApiKey(null);
        setApiKeyVisible(false);
    };

    const inputClass = "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition";
    const selectClass = inputClass;

    return (
        <DashboardLayout>
            <Head title="System Settings" />

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71-.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400 ring-1 ring-amber-500/20">
                                Root Only
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Core application configuration. Changes here affect the entire platform.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
                {/* ── General Settings ────────────────────────────────── */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">General</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* App Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Application Name</label>
                            <input type="text" value={data.app_name} onChange={(e) => setData('app_name', e.target.value)} className={inputClass} />
                        </div>

                        {/* Tagline */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tagline</label>
                            <input type="text" value={data.app_tagline} onChange={(e) => setData('app_tagline', e.target.value)} className={inputClass} />
                        </div>

                        {/* App Logo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Application Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
                                    <span className="text-2xl font-black text-white">E</span>
                                </div>
                                <div>
                                    <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                        Upload New Logo
                                    </button>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">PNG, JPG or SVG. Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        {/* Platform Fee */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Platform Fee (%)</label>
                            <div className="relative w-32">
                                <input type="number" value={data.platform_fee} onChange={(e) => setData('platform_fee', e.target.value)} min={0} max={100} className={`${inputClass} pr-8`} />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Percentage deducted from each transaction as platform revenue.</p>
                        </div>

                        {/* Support Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Support Email</label>
                            <input type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} className={inputClass} />
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                            <select value={data.currency} onChange={(e) => setData('currency', e.target.value)} className={selectClass}>
                                {CURRENCIES.map((c) => (
                                    <option key={c.code} value={c.code} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                                        {c.code} — {c.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Currency used for ticket pricing and financial displays.</p>
                        </div>
                    </div>
                </div>

                {/* ── Social Media ────────────────────────────────────── */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Social Media Links</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Facebook</label>
                            <input type="url" value={data.social_facebook} onChange={(e) => setData('social_facebook', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Instagram</label>
                            <input type="url" value={data.social_instagram} onChange={(e) => setData('social_instagram', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">X (Twitter)</label>
                            <input type="url" value={data.social_twitter} onChange={(e) => setData('social_twitter', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* ── Payment Gateway ────────────────────────────────── */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Payment Gateway</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gateway Provider</label>
                                <select value={data.payment_gateway} onChange={(e) => setData('payment_gateway', e.target.value)} className={selectClass}>
                                    <option value="Midtrans" className="bg-white dark:bg-navy-900">Midtrans</option>
                                    <option value="Xendit" className="bg-white dark:bg-navy-900">Xendit</option>
                                    <option value="Stripe" className="bg-white dark:bg-navy-900">Stripe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mode</label>
                                <select value={data.payment_mode} onChange={(e) => setData('payment_mode', e.target.value)} className={selectClass}>
                                    <option value="Sandbox" className="bg-white dark:bg-navy-900">Sandbox</option>
                                    <option value="Production" className="bg-white dark:bg-navy-900">Production</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">API Key</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type={apiKeyVisible ? 'text' : 'password'}
                                    value={apiKeyVisible && revealedApiKey ? revealedApiKey : data.payment_api_key}
                                    onChange={(e) => setData('payment_api_key', e.target.value)}
                                    className={`flex-1 font-mono ${inputClass}`}
                                    readOnly={apiKeyVisible}
                                />
                                {apiKeyVisible ? (
                                    <button
                                        type="button"
                                        onClick={handleHideApiKey}
                                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shrink-0"
                                    >
                                        Hide
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleRevealApiKey}
                                        className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shrink-0"
                                    >
                                        Show
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-amber-500 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                Sensitive credential — treat with care.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                            processing
                                ? 'bg-primary-400 text-white cursor-wait'
                                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/25'
                        }`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving…
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                </div>
            </form>

            {/* Password Verification Modal */}
            <Modal show={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-500/20">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Verify Identity</h2>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        For security, please re-enter your account password to reveal the API key.
                    </p>
                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                            className={`w-full rounded-xl border ${passwordError ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition`}
                            autoFocus
                        />
                        {passwordError && (
                            <p className="text-xs text-red-500 font-medium">{passwordError}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowApiKeyModal(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleVerifyPassword}
                            disabled={verifying || !password}
                            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {verifying ? 'Verifying…' : 'Reveal API Key'}
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
