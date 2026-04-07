import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    promotion: {
        id: number;
        code: string;
        discount_type: 'fixed' | 'percentage';
        discount_amount: number;
        max_discount_amount: number | null;
        min_spending: number | null;
        quota: number;
        start_date: string;
        end_date: string;
        event: string;
        event_id: string | number;
        terms_and_conditions: string | null;
        created_at: string;
        status: string;
    }
}

export default function PromotionShow({ promotion }: Props) {
    const formatCurrency = (val: number | null) => {
        if (val === null) return '—';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            router.delete(route('admin.promotions.destroy', { id }));
        }
    };

    return (
        <DashboardLayout>
            <Head title={`Promo Code: ${promotion.code}`} />

            {/* Header / Breadcrumb */}
            <div className="mb-8">
                <Link
                    href={route('admin.promotions.index')}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4 group"
                >
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Promotions
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{promotion.code}</h1>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${promotion.status === 'Active'
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20'
                                }`}>
                                {promotion.status}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Created on {promotion.created_at} &bull; Applied to event <Link href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">{promotion.event}</Link>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleDelete(promotion.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/20 bg-white dark:bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Promo
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Details Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01M21 21H3V3h18v18z" />
                            </svg>
                            General Configuration
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Discount Type</div>
                                <div className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize bg-slate-100 dark:bg-white/5 inline-block px-2 py-0.5 rounded-lg whitespace-nowrap">{promotion.discount_type}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Discount Value</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">
                                    {promotion.discount_type === 'fixed'
                                        ? formatCurrency(promotion.discount_amount)
                                        : `${promotion.discount_amount}%`}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Maximum Discount</div>
                                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {promotion.discount_type === 'percentage'
                                        ? (promotion.max_discount_amount ? formatCurrency(promotion.max_discount_amount) : 'Unlimited')
                                        : 'N/A (Fixed Mode)'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Min. Spending</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    {promotion.min_spending ? formatCurrency(promotion.min_spending) : 'None'}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Total Quota</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    {promotion.quota}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Redemptions</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    0 / {promotion.quota}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Promotional Graphics</h2>
                        <div className="aspect-[21/9] rounded-xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">No promotional banner uploaded</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Validity Period */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm overflow-hidden relative">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Validity Period
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                                <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Starts</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{promotion.start_date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
                                <div className="p-2 rounded-lg bg-red-500 text-white shadow-sm shadow-red-500/20">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Expires</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{promotion.end_date}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions Section */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Terms & Conditions
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {promotion.terms_and_conditions ? (
                                <p className="whitespace-pre-wrap">{promotion.terms_and_conditions}</p>
                            ) : (
                                <div className="space-y-4 opacity-75">
                                    <p>• This promotional code is valid for single-use transactions and applies strictly to the specified event associated with this code.</p>
                                    <p>• Discounts are applied only to the ticket face value and exclude any applicable transaction fees or tax surcharges.</p>
                                    <p>• The code must be redeemed within the designated validity period and is subject to total quota availability.</p>
                                    <p>• EventHive reserves the right to void or modify promotional offers in cases of suspected fraudulent activity or technical misuse.</p>
                                    <div className="mt-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/10 text-[11px] italic text-primary-600 dark:text-primary-400">
                                        Note: You can update these terms by editing this promotion from the main table.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
