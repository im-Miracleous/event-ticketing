import React, { useState, Fragment } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import { Head, router } from '@inertiajs/react';
import { Wallet, Search, ArrowUpRight, CheckCircle, Clock, Calendar } from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Props {
    ledger: {
        data: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    events: { id: string; title: string }[];
    filters: {
        event_id?: string;
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        date_from?: string;
        date_to?: string;
        per_page?: number;
    };
    summary: {
        totalEarnings: number;
        totalTransactions: number;
    };
}

/* ─── Component ─────────────────────────────────────────────────────── */

export default function EarningsIndex({ ledger, events, filters, summary }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterEventId, setFilterEventId] = useState(filters.event_id || '');
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');

    const eventOptions = events.map((e) => ({ label: e.title, value: e.id }));

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    };

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            event_id: filterEventId || undefined,
            search: search || undefined,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            per_page: ledger.per_page,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('organizer.earnings.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.earnings.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('organizer.earnings.index'), buildParams({ page }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(route('organizer.earnings.index'), buildParams({ per_page: perPage, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterEventId, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.earnings.index'), buildParams({ page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterEventId('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get(route('organizer.earnings.index'), buildParams({
            event_id: undefined, date_from: undefined, date_to: undefined, page: undefined,
        }), { preserveState: true, replace: true });
    };

    return (
        <DashboardLayout>
            <Head title="Earnings Report" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 rotate-3 flex-shrink-0">
                        <Wallet className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earnings Report</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed auditing of your ticket sales revenue.</p>
                    </div>
                </div>
            </div>

            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="group relative bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg shadow-emerald-900/20 text-white overflow-hidden transition-all hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-16 h-16 rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-emerald-100 font-bold text-[10px] uppercase tracking-widest mb-2 text-left">
                            <ArrowUpRight className="w-3 h-3" />
                            Total Revenue
                        </div>
                        <h2 className="text-3xl font-black mb-1">{formatCurrency(summary?.totalEarnings || 0)}</h2>
                        <p className="text-xs text-emerald-200 font-medium">Based on selected filters</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/5 group">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-2 text-left">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Success Transactions
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{(summary?.totalTransactions || 0).toLocaleString('en-US')}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Verified sales data</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform">
                        <Search className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Toolbar: Search + Advanced Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search records (Buyer, Trx, Event)…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-11 pr-4 py-3 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                    />
                </div>

                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Target Event">
                        <FilterSelect value={filterEventId} onChange={setFilterEventId} options={eventOptions} placeholder="All Events" />
                    </FilterField>
                    <FilterField label="Date Range">
                        <FilterDateRange from={filterDateFrom} to={filterDateTo} onFromChange={setFilterDateFrom} onToChange={setFilterDateTo} />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Ledger Table */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="min-w-full rounded-2x overflow-x-auto overflow-y-auto custom-scrollbar max-h-[420px]">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                <th className="px-6 py-5">TRX ID</th>
                                <SortableHeader label="Buyer & Contact" column="buyer_name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <SortableHeader label="Event Details" column="event_name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <th className="px-6 py-5">Payment</th>
                                <SortableHeader label="Date & Time" column="date" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <SortableHeader label="Amount" column="total_amount" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none text-right" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {ledger.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                                                <Wallet className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Transactions Found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">The ledger is empty for the current search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                ledger.data.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-6 py-4">
                                            <Tooltip content={tx.id}>
                                                <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono text-[10px] rounded-lg border border-slate-200 dark:border-white/10">
                                                    {tx.id.substring(0, 8)}…
                                                </span>
                                            </Tooltip>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-white font-bold text-sm">{tx.buyer_name}</span>
                                                <span className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate max-w-[150px]">{tx.buyer_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-700 dark:text-slate-300 font-bold text-xs block truncate max-w-[200px]">
                                                {tx.event_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-black bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                                                {tx.payment_method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs">
                                                    <Calendar className="w-3.5 h-3.5 text-primary-500/60" />
                                                    {tx.date ? new Date(tx.date).toLocaleDateString('en-US', { 
                                                        day: '2-digit', 
                                                        month: 'short', 
                                                        year: 'numeric' 
                                                    }) : '—'}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                                                    {tx.date ? new Date(tx.date).toLocaleTimeString('en-US', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit', 
                                                        second: '2-digit',
                                                        timeZoneName: 'short'
                                                    }) : '—'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-slate-900 dark:text-white font-bold text-lg">
                                                {formatCurrency(tx.total_amount)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={ledger.current_page}
                    totalItems={ledger.total}
                    perPage={ledger.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </DashboardLayout>
    );
}
