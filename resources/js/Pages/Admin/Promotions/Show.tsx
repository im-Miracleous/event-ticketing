import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

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
        event_id: string | number | null;
        terms_and_conditions: string | null;
        created_at: string;
        status: string;
        used_count: number;
        banner_url: string | null;
    }
}

export default function PromotionShow({ promotion }: Props) {
    const [isEditingTerms, setIsEditingTerms] = useState(false);
    const { data, setData, patch, processing, reset } = useForm({
        terms_and_conditions: promotion.terms_and_conditions || '',
    });

    const formatCurrency = (val: number | null) => {
        if (val === null) return '—';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            router.delete(route('admin.promotions.destroy', { id }));
        }
    };

    const handleUpdateTerms = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.promotions.updateTerms', promotion.id), {
            onSuccess: () => setIsEditingTerms(false),
        });
    };

    const isGlobal = !promotion.event_id || promotion.event === 'All Events';
    const usagePercentage = Math.min((promotion.used_count / promotion.quota) * 100, 100);

    return (
        <DashboardLayout>
            <Head title={`Promo Code: ${promotion.code}`} />

            {/* Breadcrumb / Back Navigation */}
            <div className="mb-8">
                <Link
                    href={route('admin.promotions.index')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all mb-6 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:border-violet-200 dark:group-hover:border-violet-800 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </div>
                    Back to Promotions
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{promotion.code}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                promotion.status === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/30'
                            }`}>
                                {promotion.status}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Created <span className="text-slate-900 dark:text-white font-bold">{promotion.created_at}</span></p>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-900/10 px-4 py-2 rounded-2xl border border-violet-100 dark:border-violet-800/20">
                                <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Availability: {isGlobal ? (
                                        <span className="font-bold text-violet-600 dark:text-violet-400">
                                            Platform Wide (All Events)
                                        </span>
                                    ) : (
                                        <>
                                            Exclusive to <Link href={route('admin.events.show', promotion.event_id!)} className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
                                                {promotion.event}
                                            </Link>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={route('admin.promotions.index', { edit: promotion.id })}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-violet-200 dark:hover:border-violet-800 hover:text-violet-600 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit Details
                        </Link>
                        <button
                            onClick={() => handleDelete(promotion.id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-50 dark:bg-red-500/10 px-6 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Panel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Terms & Conditions Editor */}
                    <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                Terms & Conditions
                            </h2>
                            {!isEditingTerms ? (
                                <button 
                                    onClick={() => setIsEditingTerms(true)}
                                    className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                    Edit Terms
                                </button>
                            ) : null}
                        </div>

                        {isEditingTerms ? (
                            <form onSubmit={handleUpdateTerms} className="space-y-4">
                                <textarea
                                    value={data.terms_and_conditions}
                                    onChange={e => setData('terms_and_conditions', e.target.value)}
                                    className="w-full h-48 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 rounded-3xl p-6 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all no-scrollbar"
                                    placeholder="Enter terms and conditions (one per line recommended)..."
                                />
                                <div className="flex gap-3 justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsEditingTerms(false); reset(); }}
                                        className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-2xl bg-violet-600 text-white text-sm font-bold shadow-lg shadow-violet-500/30 hover:bg-violet-700 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 min-h-[150px]">
                                {promotion.terms_and_conditions ? (
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line font-medium italic">
                                        {promotion.terms_and_conditions}
                                    </p>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center h-full py-10">
                                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest">No custom terms applied</p>
                                        <button 
                                            onClick={() => setIsEditingTerms(true)}
                                            className="px-6 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
                                        >
                                            Add Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* General Stats Card */}
                    <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/30">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h11.25" />
                                    </svg>
                                </div>
                                Configuration Details
                            </h2>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Quota Usage</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{promotion.used_count} / {promotion.quota}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-10 group">
                            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-white/5">
                                <div 
                                    className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(79,70,229,0.4)] animate-shimmer"
                                    style={{ width: `${usagePercentage}%`, backgroundSize: '200% 100%' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center sm:text-left">
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-violet-200 dark:hover:border-violet-800 transition-all">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Benefit</p>
                                <p className="text-2xl font-bold text-violet-600">
                                    {promotion.discount_type === 'fixed' ? formatCurrency(promotion.discount_amount) : `${promotion.discount_amount}% OFF`}
                                </p>
                                <p className="text-xs font-bold text-slate-500 mt-1 capitalize">{promotion.discount_type} discount</p>
                            </div>
                            
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max Cap</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {promotion.discount_type === 'percentage' 
                                        ? (promotion.max_discount_amount ? formatCurrency(promotion.max_discount_amount) : '∞')
                                        : 'N/A'
                                    }
                                </p>
                                <p className="text-xs font-bold text-slate-500 mt-1">Maximum discount</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-all">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Min. Order</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    {promotion.min_spending ? formatCurrency(promotion.min_spending) : 'Rp0'}
                                </p>
                                <p className="text-xs font-bold text-slate-500 mt-1">Required spending</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 p-8 shadow-xl shadow-slate-200/30 dark:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                                Promotional Graphics
                            </h2>
                        </div>
                        
                        {promotion.banner_url ? (
                            <div className="rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 shadow-lg shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-[1.01] duration-500">
                                <img src={promotion.banner_url} alt="Promo Banner" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="group relative aspect-[21/9] rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden flex flex-col items-center justify-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No banner associated with this promo</p>
                                <span className="mt-2 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Recommended: 1200 x 500 px</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Period Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5 p-8 shadow-xl shadow-slate-200/30 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/10 transition-all" />
                        
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                             Validity Period
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/60 uppercase tracking-widest">Starts On</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{promotion.start_date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-500">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-rose-600/70 dark:text-rose-500/60 uppercase tracking-widest">Expires On</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{promotion.end_date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 dark:text-slate-500">Promotion ID</span>
                                <span className="font-mono text-slate-600 dark:text-slate-400">#PRM-{promotion.id.toString().padStart(4, '0')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5 p-8 shadow-xl shadow-slate-200/30 dark:shadow-none">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Terms & Conditions</h3>
                        
                        <div className="space-y-4 text-slate-600 dark:text-slate-400">
                            {promotion.terms_and_conditions ? (
                                <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{promotion.terms_and_conditions}</p>
                            ) : (
                                <>
                                    <div className="flex gap-3">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5"></span>
                                        <p className="text-xs font-medium leading-relaxed">Single-use redemption per unique transaction.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5"></span>
                                        <p className="text-xs font-medium leading-relaxed">Applies strictly to face value of tickets.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5"></span>
                                        <p className="text-xs font-medium leading-relaxed">Not valid with other current event offers.</p>
                                    </div>
                                    
                                    <Link 
                                        href={route('admin.promotions.index')}
                                        className="mt-4 block p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[10px] font-bold text-slate-500 italic hover:text-violet-600 transition-colors"
                                    >
                                        Tip: Customize these rules by editing the promotion from the master list.
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 5s infinite linear;
                }
            `}</style>
        </DashboardLayout>
    );
}
