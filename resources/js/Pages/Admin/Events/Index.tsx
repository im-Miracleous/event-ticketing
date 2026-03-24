import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface EventItem {
    id: string;
    name: string;
    organizer: string;
    category: string;
    date: string;
    tickets: string;
    status: string;
}

interface PaginatedEvents {
    data: EventItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    events: PaginatedEvents;
    filters: {
        status?: string;
        search?: string;
        per_page?: number;
    };
}

const statusFilters = ['All', 'Active', 'Draft', 'Cancelled'];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminEvents({ events, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const activeFilter = filters.status || 'All';

    const handleFilterChange = (filter: string) => {
        router.get(route('admin.events.index'), {
            status: filter === 'All' ? undefined : filter,
            search: search || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.events.index'), {
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: value || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.events.index'), {
            page,
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: search || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.events.index'), {
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: search || undefined,
            per_page: value,
        }, { preserveState: true, replace: true });
    };

    const handleStatusUpdate = (eventId: string, status: string) => {
        router.patch(route('admin.events.updateStatus', { id: eventId }), { status }, {
            preserveState: true,
        });
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':    return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20';
            case 'Draft':     return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            case 'Cancelled': return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            default:          return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title="All Events" />

            {/* Page heading */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Events</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage every event across all organizers on the platform.
                    </p>
                </div>
            </div>

            {/* Toolbar: Search + Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search events or organizers…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                                activeFilter === filter
                                    ? 'bg-white dark:bg-primary-600 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3.5">Event</th>
                                <th className="px-5 py-3.5">Organizer</th>
                                <th className="px-5 py-3.5">Category</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5">Tickets</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {events.data.map((event) => (
                                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{event.name}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.organizer}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.date}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.tickets}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mr-3">
                                            View
                                        </button>
                                        {event.status === 'Active' ? (
                                            <button
                                                onClick={() => handleStatusUpdate(event.id, 'Suspended')}
                                                className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                            >
                                                Suspend
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusUpdate(event.id, 'Active')}
                                                className="text-xs font-medium text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {events.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No events found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={events.current_page}
                    totalItems={events.total}
                    perPage={events.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </DashboardLayout>
    );
}
