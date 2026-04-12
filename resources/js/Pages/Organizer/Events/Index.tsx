import React, { useState, Fragment } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, router } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import { MoreVertical, Eye, Edit2, CheckCircle, XCircle, Search, Plus, Archive, Clock, FileText } from 'lucide-react';

const STATUS_TABS = [
    { label: 'All Events', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
];

export default function Index({ events, categories, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const activeTab = filters?.status || 'All';

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterCategory, setFilterCategory] = useState(filters.category_id || '');
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: 'complete' | 'cancel' | null;
        eventId: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: null,
        eventId: '',
    });

    const categoryOptions = categories.map((c: any) => ({ label: c.name, value: c.id }));

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides = {}) => {
        const params: any = {
            status: activeTab === 'All' ? undefined : activeTab,
            search: search || undefined,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            category_id: filterCategory || undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            per_page: events.per_page,
            ...overrides,
        };
        Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleTabChange = (status: string) => {
        router.get(route('organizer.events.index'), buildParams({ status: status === 'All' ? undefined : status, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('organizer.events.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.events.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('organizer.events.index'), buildParams({ page }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(route('organizer.events.index'), buildParams({ per_page: perPage, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterCategory, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.events.index'), buildParams({ page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterCategory('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get(route('organizer.events.index'), buildParams({
            category_id: undefined, date_from: undefined, date_to: undefined, page: undefined,
        }), { preserveState: true, preserveScroll: true, replace: true });
    };

    /* ── Modal helpers ────────────────────────────────────────────── */

    const openCompleteModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Mark as Completed',
            message: `Are you sure you want to mark "${eventName}" as completed?`,
            action: 'complete',
            eventId,
        });
    };

    const openCancelModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Cancel Event',
            message: `Are you sure you want to cancel "${eventName}"?`,
            action: 'cancel',
            eventId,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirmAction = () => {
        const statusMap: Record<string, string> = {
            complete: 'Completed',
            cancel: 'Cancelled',
        };

        if (confirmModal.action && statusMap[confirmModal.action]) {
            router.patch(route('organizer.events.updateStatus', { event: confirmModal.eventId }), {
                status: statusMap[confirmModal.action],
            }, {
                onSuccess: () => closeConfirmModal(),
            });
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active': return { class: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20', icon: CheckCircle };
            case 'Draft': return { class: 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10', icon: FileText };
            case 'Cancelled': return { class: 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20', icon: XCircle };
            case 'Completed': return { class: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20', icon: Archive };
            default: return { class: '', icon: Clock };
        }
    };

    return (
        <DashboardLayout>
            <Head title="My Events" />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <Archive className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">My Events</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your organized events.</p>
                    </div>
                </div>
                <Link
                    href={route('organizer.events.create')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create New Event
                </Link>
            </div>

            {/* Toolbar: Search + Advanced Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search events…"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-11 pr-4 py-3 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tab.value
                                    ? 'bg-white dark:bg-primary-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-transparent'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Category">
                        <FilterSelect
                            value={filterCategory}
                            onChange={setFilterCategory}
                            options={categoryOptions}
                            placeholder="All Categories"
                        />
                    </FilterField>
                    <FilterField label="Event Date Range">
                        <FilterDateRange
                            from={filterDateFrom}
                            to={filterDateTo}
                            onFromChange={setFilterDateFrom}
                            onToChange={setFilterDateTo}
                        />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Table wrapper */}
            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="min-w-full rounded-2xl overflow-x-auto overflow-y-auto custom-scrollbar max-h-[calc(100vh-24rem)]">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="Event" column="name" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <SortableHeader label="Category" column="category" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <SortableHeader label="Date" column="date" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <th className="px-6 py-5">Tickets Sold</th>
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none text-center" />
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {events.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                                                <Archive className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">No Events Found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Try adjusting your search or filters to find what you're looking for.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                events.data.map((event: any, rowIndex: number) => {
                                    const totalRows = events.data.length;
                                    const isNearBottom = totalRows <= 2 || rowIndex >= totalRows - 2;

                                    return (
                                        <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                <Tooltip content={event.name}>
                                                    <div className="truncate max-w-[200px] group-hover:text-primary-600 transition-colors text-sm tracking-wide">{event.name}</div>
                                                </Tooltip>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium text-sm whitespace-nowrap">{event.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 max-w-[80px]">
                                                        <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, (parseInt(event.tickets.split(' / ')[0]) / parseInt(event.tickets.split(' / ')[1])) * 100)}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{event.tickets}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {(() => {
                                                    const statusData = statusColor(event.status);
                                                    const Icon = statusData.icon;
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${statusData.class}`}>
                                                            <Icon className="w-3 h-3" />
                                                            {event.status}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <div>
                                                        <Menu.Button className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                                                            <MoreVertical className="w-5 h-5" />
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
                                                        <Menu.Items className={`absolute right-0 z-50 w-52 origin-top-right rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl focus:outline-none ring-1 ring-black/5 dark:ring-transparent ${isNearBottom ? 'bottom-full mb-2' : 'mt-2'}`}>
                                                            <div className="p-1.5 space-y-1">
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <Link
                                                                            href={route('organizer.events.show', event.id)}
                                                                            className={`${active ? 'bg-slate-50 dark:bg-white/5 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'} flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all tracking-wider`}
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                            View Details
                                                                        </Link>
                                                                    )}
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <Link
                                                                            href={route('organizer.events.edit', event.id)}
                                                                            className={`${active ? 'bg-slate-50 dark:bg-white/5 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'} flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all tracking-wider`}
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                            Edit Event
                                                                        </Link>
                                                                    )}
                                                                </Menu.Item>
                                                                {event.status === 'Active' && (
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                onClick={() => openCompleteModal(event.id, event.name)}
                                                                                className={`${active ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600' : 'text-blue-600/70'} flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider w-full text-left`}
                                                                            >
                                                                                <CheckCircle className="w-4 h-4" />
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
                                                                                className={`${active ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'text-red-600/70'} flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider w-full text-left`}
                                                                            >
                                                                                <XCircle className="w-4 h-4" />
                                                                                Cancel Event
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
                                })
                            )}
                        </tbody>
                    </table>
                </div>

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
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            confirmModal.action === 'complete' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : 'bg-red-100 dark:bg-red-500/20 text-red-600'
                        }`}>
                            {confirmModal.action === 'complete' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{confirmModal.title}</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{confirmModal.message}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={closeConfirmModal} className="rounded-xl border-none ring-1 ring-slate-200 dark:ring-white/10 uppercase text-[11px] font-black tracking-widest px-6">Keep it</SecondaryButton>
                        <button
                            onClick={handleConfirmAction}
                            className={`px-6 py-2.5 text-[11px] font-black tracking-widest uppercase text-white rounded-xl shadow-lg transition-all active:scale-95 ${
                                confirmModal.action === 'complete' ? 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700' : 'bg-red-600 shadow-red-500/20 hover:bg-red-700'
                            }`}
                        >
                            Yes, {confirmModal.action === 'complete' ? 'Complete' : 'Cancel'}
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
