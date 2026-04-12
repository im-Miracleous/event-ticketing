import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import { Head, router } from '@inertiajs/react';
import { Users, Search, Filter, Calendar, Clock, Archive } from 'lucide-react';

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
        per_page?: number;
    };
}

const statusOptions = [
    { label: 'Issued', value: 'Issued' },
    { label: 'Scanned', value: 'Scanned' },
    { label: 'Cancelled', value: 'Cancelled' },
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
            per_page: attendees.per_page,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('organizer.attendees.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.attendees.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('organizer.attendees.index'), buildParams({ page }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(route('organizer.attendees.index'), buildParams({ per_page: perPage, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterEventId, filterStatus, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.attendees.index'), buildParams({ page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterEventId('');
        setFilterStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get(route('organizer.attendees.index'), buildParams({
            event_id: undefined, status: undefined, date_from: undefined, date_to: undefined, page: undefined,
        }), { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <DashboardLayout>
            <Head title="Attendee Management" />

            <div className="flex flex-col md:flex-row md:items-center justify-between xl:mb-8 mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">Attendee Management</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor the list of attendees who have purchased tickets for your events.</p>
                    </div>
                </div>
            </div>

            {/* Toolbar: Search + AdvancedFilter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
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

            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[420px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="bg-slate-50 dark:bg-navy-950/50 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Ticket ID</th>
                                <SortableHeader label="Attendee" column="attendee_name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-left border-none" />
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Buyer (Account)</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Event & Type</th>
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-left border-none" />
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-left">Scan Time</th>
                                <SortableHeader label="Purchase Date" column="issued_at" currentSort={sort} currentDirection={direction} onSort={handleSort} className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right border-none" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {attendees.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        No attendees found matching these criteria.
                                    </td>
                                </tr>
                            ) : (
                                attendees.data.map((ticket: any) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 font-medium">
                                            <span className="inline-flex px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold rounded-lg tracking-wider border border-primary-500/20 text-xs uppercase shadow-sm">
                                                {ticket.qr_code}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-bold text-sm">{ticket.attendee_name}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">{ticket.attendee_email}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-xs">
                                            {ticket.buyer_name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-medium text-xs">{ticket.event_name}</p>
                                            <p className="text-sm font-bold text-primary-500">{ticket.ticket_type}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            {ticket.status === 'Scanned' ? (
                                                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold rounded-lg text-xs tracking-wider border border-emerald-500/20">
                                                    SCANNED
                                                </span>
                                            ) : ticket.status === 'Issued' ? (
                                                <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 font-bold rounded-lg text-xs tracking-wider border border-blue-500/20">
                                                    ISSUED
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-slate-500/10 text-slate-400 font-bold rounded-lg text-xs tracking-wider border border-slate-500/20">
                                                    {ticket.status ? ticket.status.toUpperCase() : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            {ticket.validated_at ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs font-mono">
                                                        <Calendar className="w-3.5 h-3.5 text-primary-500/60" />
                                                        {new Date(ticket.validated_at).toLocaleDateString('en-US', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                                                        {new Date(ticket.validated_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                            timeZoneName: 'short'
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 dark:text-white/10 font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            {ticket.issued_at ? (
                                                <div className="flex flex-col gap-1.5 items-end">
                                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-xs font-mono">
                                                        <Calendar className="w-3.5 h-3.5 text-primary-500/60" />
                                                        {new Date(ticket.issued_at).toLocaleDateString('en-US', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                                                        {new Date(ticket.issued_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                            timeZoneName: 'short'
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 dark:text-white/10 font-bold">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Standardized Pagination Controls */}
                <Pagination
                    currentPage={attendees.current_page}
                    totalItems={attendees.total}
                    perPage={attendees.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </DashboardLayout>
    );
}
