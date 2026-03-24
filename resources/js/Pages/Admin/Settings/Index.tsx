import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const initialSettings = {
    appName: 'EventHive',
    tagline: 'Your Premier Event Ticketing Platform',
    platformFee: '20',
    supportEmail: 'support@eventhive.com',
    socialFacebook: 'https://facebook.com/eventhive',
    socialInstagram: 'https://instagram.com/eventhive',
    socialTwitter: 'https://x.com/eventhive',
    paymentGateway: 'Midtrans',
    paymentApiKey: '••••••••••••ABCD',
    paymentMode: 'Sandbox',
};

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminSettings() {
    const [settings, setSettings] = useState(initialSettings);
    const [saving, setSaving] = useState(false);

    const handleChange = (field: string, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500); // Simulated save
    };

    return (
        <DashboardLayout>
            <Head title="System Settings" />

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400 ring-1 ring-amber-500/20">
                        Root Only
                    </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Core application configuration. Changes here affect the entire platform.
                </p>
            </div>

            <div className="space-y-6 max-w-3xl">
                {/* ── General Settings ────────────────────────────────── */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">General</h2>
                    </div>
                    <div className="p-5 space-y-5">
                        {/* App Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Application Name</label>
                            <input
                                type="text"
                                value={settings.appName}
                                onChange={(e) => handleChange('appName', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
                        </div>

                        {/* Tagline */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tagline</label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => handleChange('tagline', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
                        </div>

                        {/* App Logo */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Application Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
                                    <span className="text-2xl font-black text-white">E</span>
                                </div>
                                <div>
                                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
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
                                <input
                                    type="number"
                                    value={settings.platformFee}
                                    onChange={(e) => handleChange('platformFee', e.target.value)}
                                    min={0}
                                    max={100}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Percentage deducted from each transaction as platform revenue.</p>
                        </div>

                        {/* Support Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Support Email</label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => handleChange('supportEmail', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
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
                            <input
                                type="url"
                                value={settings.socialFacebook}
                                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Instagram</label>
                            <input
                                type="url"
                                value={settings.socialInstagram}
                                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">X (Twitter)</label>
                            <input
                                type="url"
                                value={settings.socialTwitter}
                                onChange={(e) => handleChange('socialTwitter', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
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
                                <select
                                    value={settings.paymentGateway}
                                    onChange={(e) => handleChange('paymentGateway', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                >
                                    <option value="Midtrans">Midtrans</option>
                                    <option value="Xendit">Xendit</option>
                                    <option value="Stripe">Stripe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mode</label>
                                <select
                                    value={settings.paymentMode}
                                    onChange={(e) => handleChange('paymentMode', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                >
                                    <option value="Sandbox">Sandbox</option>
                                    <option value="Production">Production</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">API Key</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="password"
                                    value={settings.paymentApiKey}
                                    onChange={(e) => handleChange('paymentApiKey', e.target.value)}
                                    className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 font-mono focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                />
                                <button className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shrink-0">
                                    Show
                                </button>
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
                        onClick={handleSave}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                            saving
                                ? 'bg-primary-400 text-white cursor-wait'
                                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/25'
                        }`}
                    >
                        {saving ? (
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
            </div>
        </DashboardLayout>
    );
}
