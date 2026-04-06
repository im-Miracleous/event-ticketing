import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import StatisticsCard from '@/Components/Dashboard/StatisticsCard';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface StatItem {
    title: string;
    value: string;
}

interface TransactionItem {
    id: string;
    user: string;
    event: string;
    amount: string;
    fee: string;
    date: string;
    status: string;
}

interface PaginatedTransactions {
    data: TransactionItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface MonthlyRevenueItem {
    month: string;
    sales: string;
    fee: string;
}

interface Props {
    financeStats: StatItem[];
    recentTransactions: PaginatedTransactions;
    monthlyRevenue: MonthlyRevenueItem[];
    filters: {
        search?: string;
        status?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        date_from?: string;
        date_to?: string;
        per_page?: number;
    };
}

const statusOptions = [
    { label: 'Success', value: 'Success' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Failed', value: 'Failed' },
];

/* ─── Icons ─────────────────────────────────────────────────────────── */

const financeIcons = [
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
    ),
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
    ),
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminFinance({ financeStats, recentTransactions, monthlyRevenue, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            search: search || undefined,
            status: filterStatus || undefined,
            per_page: recentTransactions.per_page,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.finance.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('admin.finance.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.finance.index'), buildParams({ page }), { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.finance.index'), buildParams({ per_page: value, page: undefined }), { preserveState: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterDateFrom, filterDateTo, filterStatus].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('admin.finance.index'), buildParams({ page: undefined }), { preserveState: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterStatus('');
        router.get(route('admin.finance.index'), buildParams({
            status: undefined,
            date_from: undefined,
            date_to: undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    return (
        <DashboardLayout>
            <Head title="Financial Overview" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Track platform revenue, organizer payouts, and transaction history.
                </p>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {financeStats.map((stat, idx) => (
                    <StatisticsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={financeIcons[idx] || financeIcons[0]}
                    />
                ))}
            </div>

            {/* Two columns: Monthly Revenue + Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Monthly Revenue Breakdown */}
                <div className="lg:col-span-1 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none h-fit">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Monthly Revenue</h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {monthlyRevenue.map((row) => (
                            <div key={row.month} className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{row.month} 2026</span>
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{row.sales}</p>
                                    <p className="text-xs text-emerald-500 dark:text-emerald-400">Fee: {row.fee}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Transactions</h2>
                    </div>

                    {/* Toolbar: Search + AdvancedFilter */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <div className="relative w-full sm:w-64">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search transactions…"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
                        </div>
                        <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                            <FilterField label="Transaction Date">
                                <FilterDateRange from={filterDateFrom} to={filterDateTo} onFromChange={setFilterDateFrom} onToChange={setFilterDateTo} />
                            </FilterField>
                            <FilterField label="Status">
                                <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} placeholder="All Statuses" />
                            </FilterField>
                        </AdvancedFilter>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                    <th className="px-5 py-3">ID</th>
                                    <SortableHeader label="User" column="user" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                    <SortableHeader label="Event" column="event" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                    <SortableHeader label="Amount" column="amount" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                    <th className="px-5 py-3">Fee</th>
                                    <SortableHeader label="Date" column="date" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                    <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {recentTransactions.data.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{typeof txn.id === 'string' ? txn.id.substring(0, 8) : txn.id}…</td>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{txn.user}</td>
                                        <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{txn.event}</td>
                                        <td className="px-5 py-3 font-medium text-slate-800 dark:text-white whitespace-nowrap">{txn.amount}</td>
                                        <td className="px-5 py-3 text-emerald-500 dark:text-emerald-400 whitespace-nowrap">{txn.fee}</td>
                                        <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">{txn.date}</td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                txn.status === 'Success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20' :
                                                txn.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20' :
                                                'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20'
                                            }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentTransactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={recentTransactions.current_page}
                        totalItems={recentTransactions.total}
                        perPage={recentTransactions.per_page}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
