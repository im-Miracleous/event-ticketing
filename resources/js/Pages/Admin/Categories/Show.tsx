import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import { Head, router, Link } from '@inertiajs/react';
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

interface CategoryData {
    id: number;
    name: string;
    description: string | null;
}

interface Props {
    category: CategoryData;
    events: PaginatedEvents;
    filters: {
        status?: string;
        search?: string;
        per_page?: number;
    };
}

const statusFilters = ['All', 'Active', 'Draft', 'Completed', 'Cancelled', 'Deactivated'];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function CategoryShow({ category, events, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const activeFilter = filters.status || 'All';

    const handleFilterChange = (filter: string) => {
        router.get(route('admin.categories.show', { id: category.id }), {
            status: filter === 'All' ? undefined : filter,
            search: search || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.categories.show', { id: category.id }), {
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: value || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.categories.show', { id: category.id }), {
            page,
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: search || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.categories.show', { id: category.id }), {
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: search || undefined,
            per_page: value,
        }, { preserveState: true, replace: true });
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20';
            case 'Draft':       return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            case 'Cancelled':   return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            case 'Completed':   return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20';
            case 'Deactivated': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            default:            return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title={`${category.name} — Events`} />

            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href={route('admin.categories.index')} className="text-slate-400 hover:text-primary-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <span className="text-slate-400">/</span>
                <Link href={route('admin.categories.index')} className="text-slate-500 hover:text-primary-500">Categories</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-800 dark:text-white font-medium">{category.name}</span>
            </nav>

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{category.name}</h1>
                {category.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{category.description}</p>
                )}
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                    {events.total} event{events.total !== 1 ? 's' : ''} in this category
                </p>
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
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex-wrap">
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

            {/* Table wrapper - Overflow allowed for dropdowns to show */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <div className="min-w-full rounded-2xl">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3.5">Event</th>
                                <th className="px-5 py-3.5">Organizer</th>
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
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.date}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.tickets}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <Link
                                            href={route('admin.events.show', event.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {events.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No events found in this category.
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
