import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import { Head, router } from '@inertiajs/react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Props {
    attendees: {
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
        status?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        date_from?: string;
        date_to?: string;
    };
}

const statusOptions = [
    { label: 'Valid / Checked-In', value: 'valid' },
    { label: 'Issued', value: 'issued' },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AttendeesIndex({ attendees, events, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterEventId, setFilterEventId] = useState(filters.event_id || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');

    const eventOptions = events.map((e) => ({ label: e.title, value: e.id }));

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            event_id: filterEventId || undefined,
            search: search || undefined,
            status: filterStatus || undefined,
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
        router.get(route('organizer.attendees.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.attendees.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterEventId, filterStatus, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.attendees.index'), buildParams({ page: undefined }), { preserveState: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterEventId('');
        setFilterStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get(route('organizer.attendees.index'), buildParams({
            event_id: undefined, status: undefined, date_from: undefined, date_to: undefined, page: undefined,
        }), { preserveState: true, replace: true });
    };

    return (
        <DashboardLayout>
            <Head title="Attendee Management" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendee Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Monitor the list of attendees who have purchased tickets for your events.
                    </p>
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
                         placeholder="Search attendee or ticket…"
                         value={search}
                         onChange={(e) => handleSearchChange(e.target.value)}
                         className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>
                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Filter Event">
                        <FilterSelect value={filterEventId} onChange={setFilterEventId} options={eventOptions} placeholder="All Events" />
                    </FilterField>
                    <FilterField label="Ticket Status">
                        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} placeholder="All Status" />
                    </FilterField>
                    <FilterField label="Purchase Date">
                        <FilterDateRange from={filterDateFrom} to={filterDateTo} onFromChange={setFilterDateFrom} onToChange={setFilterDateTo} />
                    </FilterField>
                </AdvancedFilter>
            </div>

            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-950/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Ticket ID</th>
                                <SortableHeader label="Attendee" column="attendee_name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider" />
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Buyer (Account)</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Event & Type</th>
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider" />
                                <SortableHeader label="Purchase Date" column="issued_at" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {attendees.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        No attendees found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                attendees.data.map((ticket: any) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono text-xs rounded-md border border-slate-200 dark:border-white/10">
                                                {ticket.id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-bold">{ticket.attendee_name}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{ticket.attendee_email}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-sm">
                                            {ticket.buyer_name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-medium">{ticket.event_name}</p>
                                            <p className="text-sm font-bold text-primary-500">{ticket.ticket_type}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            {ticket.status === 'valid' ? (
                                                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-500 font-bold rounded-lg text-xs tracking-wider border border-emerald-500/20">
                                                    VALID / CHECKED-IN
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 font-bold rounded-lg text-xs tracking-wider border border-blue-500/20">
                                                    ISSUED
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm font-medium text-right">
                                            {new Date(ticket.issued_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {attendees.links && attendees.links.length > 3 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-navy-900/50">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-400">
                                    Showing <span className="font-bold text-slate-900 dark:text-white">{attendees.data.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{attendees.total}</span> attendees.
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {attendees.links.map((link: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url, buildParams())}
                                            disabled={!link.url}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                link.active
                                                    ? 'z-10 bg-primary-600 border-primary-500 text-white'
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
