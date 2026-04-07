import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, router, Link } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

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
        sort?: string;
        direction?: 'asc' | 'desc';
        date_from?: string;
        date_to?: string;
        category?: string;
    };
    categories: string[];
}

const statusFilters = ['All', 'Active', 'Draft', 'Completed', 'Cancelled'];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminEvents({ events, filters, categories }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const activeFilter = filters.status || 'All';

    // Sort state (from server)
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');
    const [filterCategory, setFilterCategory] = useState(filters.category || '');

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: 'deactivate' | 'complete' | 'cancel' | null;
        eventId: string | null;
        eventName: string | null;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        eventId: null,
        eventName: null,
    });

    /* ── Helpers to build params ──────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            status: activeFilter === 'All' ? undefined : activeFilter,
            search: search || undefined,
            per_page: events.per_page,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            category: filterCategory || undefined,
            ...overrides,
        };
        // Clean undefined
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    /* ── Handlers ─────────────────────────────────────────────────── */

    const handleFilterChange = (filter: string) => {
        router.get(route('admin.events.index'), buildParams({
            status: filter === 'All' ? undefined : filter,
            page: undefined, // reset page
        }), { preserveState: true, replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.events.index'), buildParams({
            search: value || undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('admin.events.index'), buildParams({
            sort: column,
            direction: dir,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.events.index'), buildParams({ page }), {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.events.index'), buildParams({
            per_page: value,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    /* ── Advanced filter actions ──────────────────────────────────── */

    const activeAdvancedFilterCount = [filterDateFrom, filterDateTo, filterCategory].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('admin.events.index'), buildParams({ page: undefined }), {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterCategory('');
        router.get(route('admin.events.index'), buildParams({
            date_from: undefined,
            date_to: undefined,
            category: undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    /* ── Modal helpers ────────────────────────────────────────────── */

    const openDeactivateModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Deactivate Event',
            message: `Are you sure you want to deactivate "${eventName}"? The event will be moved to the Archive and will no longer be visible in the All Events page.`,
            action: 'deactivate',
            eventId,
            eventName,
        });
    };

    const openCompleteModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Mark as Completed',
            message: `Are you sure you want to mark "${eventName}" as completed?`,
            action: 'complete',
            eventId,
            eventName,
        });
    };

    const openCancelModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Cancel Event',
            message: `Are you sure you want to cancel "${eventName}"? The event will be moved to the Archive.`,
            action: 'cancel',
            eventId,
            eventName,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({
            ...prev,
            isOpen: false,
        }));
    };

    const handleConfirmAction = () => {
        if (!confirmModal.action || !confirmModal.eventId) return;

        const statusMap: Record<string, string> = {
            deactivate: 'Deactivated',
            complete: 'Completed',
            cancel: 'Cancelled',
        };

        router.patch(route('admin.events.updateStatus', { event: confirmModal.eventId }), {
            status: statusMap[confirmModal.action],
        }, {
            onSuccess: () => closeConfirmModal(),
            onError: (errors) => {
                console.error('Failed to update status:', errors);
                closeConfirmModal();
            },
        });
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
            <Head title="All Events" />

            {/* Page heading */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Events</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage every event across all organizers on the platform.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.events.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/25"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Event
                    </Link>
                    <Link
                        href={route('admin.events.archive')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Archive
                    </Link>
                </div>
            </div>

            {/* Toolbar: Search + Filter Pills + Advanced Filter */}
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

                {/* Advanced Filter */}
                <AdvancedFilter
                    activeCount={activeAdvancedFilterCount}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                >
                    <FilterField label="Event Date Range">
                        <FilterDateRange
                            from={filterDateFrom}
                            to={filterDateTo}
                            onFromChange={setFilterDateFrom}
                            onToChange={setFilterDateTo}
                        />
                    </FilterField>
                    <FilterField label="Category">
                        <FilterSelect
                            value={filterCategory}
                            onChange={setFilterCategory}
                            options={categories.map((c) => ({ label: c, value: c }))}
                            placeholder="All Categories"
                        />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Table wrapper */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="min-w-full rounded-2xl overflow-auto custom-scrollbar max-h-[calc(100vh-28rem)] sm:max-h-[calc(100vh-24rem)]">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="Event" column="name" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Organizer" column="organizer" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Category" column="category" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Date" column="date" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Tickets" column="tickets" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {events.data.map((event, rowIndex) => {
                                const totalRows = events.data.length;
                                const isNearBottom = totalRows <= 2 || rowIndex >= totalRows - 2;

                                return (
                                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                        <Tooltip content={event.name}>
                                            <div className="truncate max-w-[180px]">{event.name}</div>
                                        </Tooltip>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                                        <Tooltip content={event.organizer}>
                                            <div className="truncate max-w-[150px]">{event.organizer}</div>
                                        </Tooltip>
                                    </td>
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
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="6" r="2" />
                                                        <circle cx="12" cy="12" r="2" />
                                                        <circle cx="12" cy="18" r="2" />
                                                    </svg>
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className={`absolute right-0 z-50 w-48 origin-top-right rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-lg focus:outline-none ${isNearBottom ? 'bottom-full mb-2' : 'mt-2'}`}>
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    href={route('admin.events.show', event.id)}
                                                                    className={`${
                                                                        active ? 'bg-slate-50 dark:bg-white/5' : ''
                                                                    } flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300`}
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    View Details
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        {event.status === 'Active' && (
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => openCompleteModal(event.id, event.name)}
                                                                        className={`${
                                                                            active ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                                                                        } flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 w-full`}
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Mark as Completed
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        )}
                                                        {['Active', 'Draft'].includes(event.status) && (
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => openCancelModal(event.id, event.name)}
                                                                        className={`${
                                                                            active ? 'bg-red-50 dark:bg-red-500/10' : ''
                                                                        } flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 w-full`}
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                        Cancel Event
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        )}
                                                        {['Active', 'Draft'].includes(event.status) && (
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => openDeactivateModal(event.id, event.name)}
                                                                        className={`${
                                                                            active ? 'bg-amber-50 dark:bg-amber-500/10' : ''
                                                                        } flex items-center gap-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 w-full`}
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                        </svg>
                                                                        Deactivate
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        )}
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </td>
                                </tr>
                            );
                            })}
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

            {/* Confirmation Modal */}
            <Modal show={confirmModal.isOpen} onClose={closeConfirmModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${
                            confirmModal.action === 'complete' ? 'bg-blue-100 dark:bg-blue-500/20' :
                            confirmModal.action === 'deactivate' ? 'bg-amber-100 dark:bg-amber-500/20' :
                            'bg-red-100 dark:bg-red-500/20'
                        }`}>
                            {confirmModal.action === 'complete' && (
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {confirmModal.action === 'deactivate' && (
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            )}
                            {confirmModal.action === 'cancel' && (
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{confirmModal.title}</h2>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-6">{confirmModal.message}</p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={closeConfirmModal}>Cancel</SecondaryButton>
                        <button
                            onClick={handleConfirmAction}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
                                confirmModal.action === 'complete' ? 'bg-blue-600 hover:bg-blue-500' :
                                confirmModal.action === 'deactivate' ? 'bg-amber-600 hover:bg-amber-500' :
                                'bg-red-600 hover:bg-red-500'
                            }`}
                        >
                            {confirmModal.action === 'complete' ? 'Mark as Completed' :
                             confirmModal.action === 'deactivate' ? 'Deactivate Event' :
                             'Cancel Event'}
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
