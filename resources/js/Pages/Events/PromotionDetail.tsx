import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

interface Props {
    promotion: {
        id: number;
        code: string;
        discount_type: 'fixed' | 'percentage';
        discount_amount: number;
        max_discount_amount: number | null;
        min_spending: number | null;
        start_date: string;
        end_date: string;
        terms_and_conditions: string | null;
        banner_url: string | null;
        event_title: string;
    }
}

export default function PromotionDetailPublic({ promotion }: Props) {
    const formatCurrency = (val: number | null) => {
        if (val === null) return '—';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(promotion.code);
        alert('Promo code copied to clipboard!');
    };

    return (
        <DashboardLayout>
            <Head title={`Promotion: ${promotion.code}`} />

            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href={route('events.index')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors mb-10 group"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </div>
                    Back to Discover
                </Link>

                <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="relative aspect-[21/9] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        {promotion.banner_url ? (
                            <img src={promotion.banner_url} alt={promotion.code} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-20 h-20 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1}><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" /></svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                                Exclusive Offer: <span className="text-violet-400 font-mono">{promotion.code}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-10">
                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-violet-600 rounded-full" />
                                        Offer Details
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
                                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Benefit</p>
                                            <p className="text-2xl font-bold text-violet-600">
                                                {promotion.discount_type === 'fixed' ? formatCurrency(promotion.discount_amount) : `${promotion.discount_amount}% OFF`}
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Minimum Spending</p>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                {promotion.min_spending ? formatCurrency(promotion.min_spending) : 'Rp 0'}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-violet-600 rounded-full" />
                                        How to claim your discount?
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 p-6 rounded-3xl bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800/30">
                                            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-lg shadow-violet-500/30">1</div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Copy the Promo Code</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Click the copy button below to save the code to your clipboard.</p>
                                                <div className="mt-4 flex items-center gap-3">
                                                    <span className="px-5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-violet-600 text-lg">{promotion.code}</span>
                                                    <button onClick={handleCopy} className="p-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800/10">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex-shrink-0 flex items-center justify-center font-bold text-xl">2</div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Apply During Checkout</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Select your favorite events, go to the checkout page, and paste the code into the promotion field.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-violet-600 rounded-full" />
                                        Terms & Conditions
                                    </h2>
                                    <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        {promotion.terms_and_conditions ? (
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line font-medium italic">
                                                {promotion.terms_and_conditions}
                                            </p>
                                        ) : (
                                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-2 shrink-0"></span> Valid only for tickets in the specified category.</li>
                                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-2 shrink-0"></span> Single use per transaction.</li>
                                                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-2 shrink-0"></span> Cannot be combined with other offers.</li>
                                            </ul>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <div className="p-8 rounded-[2.5rem] bg-violet-600 text-white shadow-2xl shadow-violet-500/40 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-6">Promotion Period</p>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Starts From</p>
                                                <p className="text-xl font-bold">{promotion.start_date}</p>
                                            </div>
                                            <div className="pt-6 border-t border-white/10">
                                                <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Ends At</p>
                                                <p className="text-xl font-bold">{promotion.end_date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Applicable For</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white capitalize">{promotion.event_title}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
