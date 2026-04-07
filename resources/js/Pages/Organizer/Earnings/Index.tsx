import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import { Head, router } from '@inertiajs/react';

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
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('organizer.earnings.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.earnings.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterEventId, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.earnings.index'), buildParams({ page: undefined }), { preserveState: true, replace: true });
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

            <div className="flex flex-col md:flex-row md:items-center justify-between xl:mb-8 mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earnings Report Transparency</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The system records every valid transaction from your ticket sales in detail.</p>
                    </div>
                </div>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg shadow-emerald-900/20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium mb-1">Total Earnings Collected</p>
                        <h2 className="text-4xl font-black mb-2">{formatCurrency(summary.totalEarnings)}</h2>
                        <p className="text-sm text-emerald-200">Based on active event filters.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Valid Transactions (Success)</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalTransactions.toLocaleString('en-US')}</h2>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Toolbar: Search + AdvancedFilter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search transaction, buyer, event…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>
                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Filter Event">
                        <FilterSelect value={filterEventId} onChange={setFilterEventId} options={eventOptions} placeholder="All Events" />
                    </FilterField>
                    <FilterField label="Transaction Date">
                        <FilterDateRange from={filterDateFrom} to={filterDateTo} onFromChange={setFilterDateFrom} onToChange={setFilterDateTo} />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Ledger Table */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-950/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Trx Code</th>
                                <SortableHeader label="Buyer" column="buyer_name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider" />
                                <SortableHeader label="Event Name" column="event_name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider" />
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Payment Method</th>
                                <SortableHeader label="Transaction Time" column="date" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider" />
                                <SortableHeader label="Amount" column="total_amount" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {ledger.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        No incoming transactions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                ledger.data.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono text-xs rounded-md border border-slate-200 dark:border-white/10">
                                                {tx.id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-bold">{tx.buyer_name}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{tx.buyer_email}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                                            {tx.event_name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold rounded-lg text-xs tracking-wider border border-purple-500/20">
                                                {tx.payment_method.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
                                            {new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-4 px-6 text-slate-900 dark:text-white font-bold text-right text-lg">
                                            {formatCurrency(tx.total_amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {ledger.links && ledger.links.length > 3 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-navy-900/50">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-400">
                                    Displaying <span className="font-bold text-emerald-600 dark:text-emerald-400">{ledger.data.length}</span> of total <span className="font-bold text-emerald-600 dark:text-emerald-400">{ledger.total}</span> audit records.
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {ledger.links.map((link: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url, buildParams())}
                                            disabled={!link.url}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                link.active
                                                    ? 'z-10 bg-emerald-600 border-emerald-500 text-white'
                                                    : 'bg-white dark:bg-navy-800 border-slate-300 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
