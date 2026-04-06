import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface PromotionItem {
    id: number;
    code: string;
    type: string;
    value: string;
    usage: string;
    validUntil: string;
    status: string;
    event: string;
}

interface PaginatedPromotions {
    data: PromotionItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    promotions: PaginatedPromotions;
    filters: {
        per_page?: number;
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        valid_from?: string;
        valid_to?: string;
    };
}

const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Expired', value: 'Expired' },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminPromotions({ promotions, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterValidFrom, setFilterValidFrom] = useState(filters.valid_from || '');
    const [filterValidTo, setFilterValidTo] = useState(filters.valid_to || '');

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            search: search || undefined,
            per_page: promotions.per_page,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            valid_from: filterValidFrom || undefined,
            valid_to: filterValidTo || undefined,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.promotions.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('admin.promotions.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.promotions.index'), buildParams({ page }), { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.promotions.index'), buildParams({ per_page: value, page: undefined }), { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            router.delete(route('admin.promotions.destroy', { id }));
        }
    };

    const activeAdvancedFilterCount = [filterValidFrom, filterValidTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('admin.promotions.index'), buildParams({ page: undefined }), { preserveState: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterValidFrom('');
        setFilterValidTo('');
        router.get(route('admin.promotions.index'), buildParams({
            valid_from: undefined,
            valid_to: undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
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

            {/* Toolbar: Search + AdvancedFilter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search codes or events…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>
                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Valid Until Date Range">
                        <FilterDateRange from={filterValidFrom} to={filterValidTo} onFromChange={setFilterValidFrom} onToChange={setFilterValidTo} />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Discount Codes Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none mb-8">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Discount Codes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="Code" column="code" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5">Type</th>
                                <SortableHeader label="Value" column="value" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Usage" column="usage" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Valid Until" column="validUntil" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {promotions.data.map((promo) => (
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
                                        <button
                                            onClick={() => handleDelete(promo.id)}
                                            className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {promotions.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No promotions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={promotions.current_page}
                    totalItems={promotions.total}
                    perPage={promotions.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
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
