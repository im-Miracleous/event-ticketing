import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, router, Link } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';

interface EventItem {
    id: string;
    name: string;
    organizer: string;
    category: string;
    date: string;
    tickets: string;
    status: string;
    deactivated_at: string;
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
        search?: string;
        per_page?: number;
    };
    isRoot: boolean;
}

export default function ArchiveEvents({ events, filters, isRoot }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: 'restore' | 'delete' | null;
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

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.events.archive'), {
            search: value || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.events.archive'), {
            page,
            search: search || undefined,
            per_page: events.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.events.archive'), {
            search: search || undefined,
            per_page: value,
        }, { preserveState: true, replace: true });
    };

    const openRestoreModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Restore Event',
            message: `Are you sure you want to restore "${eventName}"? The event will become active again and visible in the All Events page.`,
            action: 'restore',
            eventId,
            eventName,
        });
    };

    const openDeleteModal = (eventId: string, eventName: string) => {
        setConfirmModal({
            isOpen: true,
            title: isRoot ? 'Permanently Delete Event' : 'Delete Event',
            message: isRoot 
                ? `Are you sure you want to permanently delete "${eventName}"? This action cannot be undone and all associated data will be lost forever.`
                : `Are you sure you want to delete "${eventName}"? This action cannot be undone.`,
            action: 'delete',
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
        if (confirmModal.action === 'restore' && confirmModal.eventId) {
            router.patch(route('admin.events.restore', { event: confirmModal.eventId }), {}, {
                onSuccess: () => closeConfirmModal(),
            });
        } else if (confirmModal.action === 'delete' && confirmModal.eventId) {
            if (isRoot) {
                router.delete(route('admin.events.forceDelete', { event: confirmModal.eventId }), {
                    onSuccess: () => closeConfirmModal(),
                });
            } else {
                router.delete(route('admin.events.destroy', { event: confirmModal.eventId }), {
                    onSuccess: () => closeConfirmModal(),
                });
            }
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Deactivated': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            default:            return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title="Archive - Deactivated Events" />

            {/* Page heading */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Archive</h1>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20">
                            Deactivated
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage deactivated events. Restore them to active or permanently delete.
                    </p>
                </div>
                <Link
                    href={route('admin.events.index')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                </Link>
            </div>

            {/* Toolbar: Search */}
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
            </div>

            {/* Table wrapper - Overflow allowed for dropdowns to show */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <div className="min-w-full rounded-2xl">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3.5">Event</th>
                                <th className="px-5 py-3.5">Organizer</th>
                                <th className="px-5 py-3.5">Category</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5">Tickets</th>
                                <th className="px-5 py-3.5">Deactivated</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {events.data.map((event, rowIndex) => {
                                const totalRows = events.data.length;
                                // If 2 or fewer rows, or if we're at the very bottom of a larger list, render upward
                                const isNearBottom = totalRows <= 2 || rowIndex >= totalRows - 2;

                                return (
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
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{event.deactivated_at}</span>
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
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => openRestoreModal(event.id, event.name)}
                                                                    className={`${
                                                                        active ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''
                                                                    } flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 w-full`}
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                    </svg>
                                                                    Restore
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => openDeleteModal(event.id, event.name)}
                                                                    className={`${
                                                                        active ? 'bg-red-50 dark:bg-red-500/10' : ''
                                                                    } flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 w-full`}
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    {isRoot ? 'Permanent Delete' : 'Delete'}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
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
                                        No deactivated events found.
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
                        <div className={`p-2 rounded-full ${confirmModal.action === 'restore' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                            {confirmModal.action === 'restore' ? (
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{confirmModal.title}</h2>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-6">{confirmModal.message}</p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={closeConfirmModal}>Cancel</SecondaryButton>
                        {confirmModal.action === 'restore' ? (
                            <button
                                onClick={handleConfirmAction}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
                            >
                                Restore Event
                            </button>
                        ) : (
                            <DangerButton onClick={handleConfirmAction}>
                                {isRoot ? 'Permanent Delete' : 'Delete'}
                            </DangerButton>
                        )}
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
