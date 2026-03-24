import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const promotions = [
    { id: 1,  code: 'WELCOME2026',   type: 'Percentage', value: '15%',       usage: '124 / 500',   validUntil: 'Apr 30, 2026', status: 'Active' },
    { id: 2,  code: 'SUMMERFEST',    type: 'Percentage', value: '20%',       usage: '312 / 1,000', validUntil: 'Jun 30, 2026', status: 'Active' },
    { id: 3,  code: 'FLASH50K',      type: 'Fixed',      value: 'Rp50.000',  usage: '50 / 50',     validUntil: 'Mar 25, 2026', status: 'Expired' },
    { id: 4,  code: 'EARLYBIRD',     type: 'Percentage', value: '10%',       usage: '89 / 200',    validUntil: 'May 15, 2026', status: 'Active' },
    { id: 5,  code: 'BUNDLEDEAL',    type: 'Fixed',      value: 'Rp100.000', usage: '0 / 100',     validUntil: 'Jul 01, 2026', status: 'Draft' },
    { id: 6,  code: 'NEWYEAR27',     type: 'Percentage', value: '25%',       usage: '0 / 300',     validUntil: 'Jan 15, 2027', status: 'Draft' },
    { id: 7,  code: 'STUDENT15',     type: 'Percentage', value: '15%',       usage: '200 / 500',   validUntil: 'Dec 31, 2026', status: 'Active' },
    { id: 8,  code: 'VIP25K',        type: 'Fixed',      value: 'Rp25.000',  usage: '30 / 100',    validUntil: 'Apr 01, 2026', status: 'Expired' },
    { id: 9,  code: 'RAMADAN2026',   type: 'Percentage', value: '30%',       usage: '150 / 250',   validUntil: 'Apr 20, 2026', status: 'Active' },
    { id: 10, code: 'GROUPBUY',      type: 'Fixed',      value: 'Rp75.000',  usage: '10 / 50',     validUntil: 'May 30, 2026', status: 'Active' },
    { id: 11, code: 'LAUNCH2026',    type: 'Percentage', value: '50%',       usage: '100 / 100',   validUntil: 'Feb 28, 2026', status: 'Expired' },
    { id: 12, code: 'LOYALCUST',     type: 'Fixed',      value: 'Rp150.000', usage: '5 / 20',      validUntil: 'Aug 31, 2026', status: 'Active' },
];

const banners = [
    { id: 1, title: 'Tech Summit 2026 — Featured',   position: 'Hero',    status: 'Active',   updatedAt: 'Mar 22, 2026' },
    { id: 2, title: 'Music Fiesta Early Bird',        position: 'Sidebar', status: 'Active',   updatedAt: 'Mar 20, 2026' },
    { id: 3, title: 'Spring Sale Banner',             position: 'Hero',    status: 'Inactive', updatedAt: 'Mar 15, 2026' },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminPromotions() {
    const [showModal, setShowModal] = useState(false);
    const [promoPage, setPromoPage] = useState(1);
    const [promoPerPage, setPromoPerPage] = useState(5);

    const totalPromos = promotions.length;
    const paginatedPromos = promotions.slice((promoPage - 1) * promoPerPage, promoPage * promoPerPage);

    const handlePromoPerPageChange = (value: number) => {
        setPromoPerPage(value);
        setPromoPage(1);
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':   return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20';
            case 'Draft':    return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            case 'Expired':  return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            case 'Inactive': return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            default:         return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title="Promotions" />

            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Promotions</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage platform-wide discount codes and featured banners.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm shadow-primary-500/25"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Promo Code
                </button>
            </div>

            {/* Discount Codes Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden mb-8">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Discount Codes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3.5">Code</th>
                                <th className="px-5 py-3.5">Type</th>
                                <th className="px-5 py-3.5">Value</th>
                                <th className="px-5 py-3.5">Usage</th>
                                <th className="px-5 py-3.5">Valid Until</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {paginatedPromos.map((promo) => (
                                <tr key={promo.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="font-mono text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-lg">{promo.code}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{promo.type}</td>
                                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{promo.value}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{promo.usage}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{promo.validUntil}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(promo.status)}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mr-3">Edit</button>
                                        <button className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={promoPage}
                    totalItems={totalPromos}
                    perPage={promoPerPage}
                    onPageChange={setPromoPage}
                    onPerPageChange={handlePromoPerPageChange}
                />
            </div>

            {/* Featured Banners */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Featured Banners</h2>
                    <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Banner
                    </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {banners.map((banner) => (
                        <div key={banner.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-20 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{banner.title}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Position: {banner.position} · Updated {banner.updatedAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(banner.status)}`}>
                                    {banner.status}
                                </span>
                                <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Promo Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 m-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Promo Code</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Promo Code</label>
                                <input type="text" placeholder="e.g. SUMMER2026" className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition font-mono uppercase" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
                                <select className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition">
                                    <option>Percentage</option>
                                    <option>Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Value</label>
                                <input type="text" placeholder="e.g. 15 or 50000" className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Max Usage</label>
                                <input type="number" placeholder="e.g. 500" className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Valid Until</label>
                                <input type="date" className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                            <button className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-primary-500/25">Create Code</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
