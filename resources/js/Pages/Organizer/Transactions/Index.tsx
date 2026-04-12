import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Calendar, CreditCard, Download, Clock, CheckCircle2, XCircle, AlertCircle, Wallet, Landmark } from 'lucide-react';

const STATUS_OPTIONS = [
    { label: 'Success', value: 'Success' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Failed', value: 'Failed' },
    { label: 'Cancelled', value: 'Cancelled' },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { style: string; icon: React.ReactNode }> = {
        Success: { 
            style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            icon: <CheckCircle2 size={10} className="mr-1" />
        },
        Paid: { 
            style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            icon: <CheckCircle2 size={10} className="mr-1" />
        },
        Pending: { 
            style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
            icon: <Clock size={10} className="mr-1" />
        },
        Failed: { 
            style: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
            icon: <XCircle size={10} className="mr-1" />
        },
        Cancelled: { 
            style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
            icon: <AlertCircle size={10} className="mr-1" />
        },
    };

    const current = config[status] || config.Pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${current.style}`}>
            {current.icon}
            {status}
        </span>
    );
}

export default function Index({ transactions, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');

    const buildParams = (overrides = {}) => {
        const params: any = {
            search: search || undefined,
            status: filterStatus || undefined,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            per_page: transactions.per_page,
            ...overrides,
        };
        Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('organizer.transactions.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.transactions.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('organizer.transactions.index'), buildParams({ page }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(route('organizer.transactions.index'), buildParams({ per_page: perPage, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterStatus, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.transactions.index'), buildParams({ page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get(route('organizer.transactions.index'), buildParams({
            status: undefined, date_from: undefined, date_to: undefined, page: undefined,
        }), { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <DashboardLayout>
            <Head title="Transaction Monitor" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0 transition-transform hover:rotate-0 duration-300">
                        <CreditCard className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">Transaction Monitor</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Full list of ticket transactions from all your events.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={route('organizer.export-sales')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-slate-700 dark:text-white transition-all shadow-sm hover:bg-slate-50 group"
                    >
                        <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                        Export Data
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search transactions…"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                            />
                        </div>

                        <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                            <FilterField label="Transaction Status">
                                <FilterSelect
                                    value={filterStatus}
                                    onChange={setFilterStatus}
                                    options={STATUS_OPTIONS}
                                    placeholder="All Status"
                                />
                            </FilterField>
                            <FilterField label="Date Range">
                                <FilterDateRange
                                    from={filterDateFrom}
                                    to={filterDateTo}
                                    onFromChange={setFilterDateFrom}
                                    onToChange={setFilterDateTo}
                                />
                            </FilterField>
                        </AdvancedFilter>
                    </div>
                </div>

                {/* Transactions Table Container */}
                <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                    <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[420px]">
                        <table className="w-full text-sm border-collapse">
                            <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                                <tr className="text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                    <SortableHeader label="Transaction ID" column="id" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                    <SortableHeader label="Buyer" column="buyer" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                    <th className="px-6 py-5">Event</th>
                                    <SortableHeader label="Amount" column="amount" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 text-right border-none" />
                                    <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 text-center border-none" />
                                    <th className="px-6 py-5">Method</th>
                                    <SortableHeader label="Date" column="date" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 text-right whitespace-nowrap border-none" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                                {transactions.data.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                                        <td className="py-4 px-6">
                                            <Tooltip content={tx.id}>
                                                <span className="inline-flex px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono text-[10px] rounded-lg border border-slate-200 dark:border-white/10 tracking-wider">
                                                    {tx.id.substring(0, 10)}…
                                                </span>
                                            </Tooltip>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-slate-900 dark:text-white capitalize text-sm">{tx.buyer_name}</div>
                                            <div className="text-xs text-slate-400 font-medium lowercase truncate max-w-[150px]">{tx.buyer_email}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] text-xs">{tx.event_name}</div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(tx.total_amount)}</td>
                                        <td className="py-4 px-6 text-center"><StatusBadge status={tx.payment_status} /></td>
                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {tx.payment_method?.toLowerCase().includes('transfer') ? (
                                                    <Landmark size={12} className="text-primary-500/70" />
                                                ) : tx.payment_method?.toLowerCase().includes('wallet') || tx.payment_method?.toLowerCase().includes('qris') || tx.payment_method?.toLowerCase().includes('ovo') ? (
                                                    <Wallet size={12} className="text-primary-500/70" />
                                                ) : (
                                                    <CreditCard size={12} className="text-primary-500/70" />
                                                )}
                                                {tx.payment_method}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5 items-end">
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs font-mono">
                                                    <Calendar className="w-3.5 h-3.5 text-primary-500/60" />
                                                    {new Date(tx.date).toLocaleDateString('en-GB', { 
                                                        day: '2-digit', 
                                                        month: 'short', 
                                                        year: 'numeric' 
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                                                    {new Date(tx.date).toLocaleTimeString('en-GB', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        timeZoneName: 'short'
                                                    })}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                                                    <CreditCard className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Transactions Found</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">No transaction activity matches your current filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with Common Pagination */}
                    <Pagination
                        currentPage={transactions.current_page}
                        totalItems={transactions.total}
                        perPage={transactions.per_page}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
