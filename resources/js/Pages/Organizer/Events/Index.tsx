import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

const STATUS_TABS = [
    { label: 'All Events', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
];

interface EventRow {
    id: string;
    name: string;
    category: string;
    date: string;
    tickets: string;
    status: string;
}

export default function Index({ events, filters }: any) {
    const [activeTab, setActiveTab] = useState(filters?.status || 'All');
    const [search, setSearch] = useState(filters?.search || '');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
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

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':    return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20';
            case 'Draft':     return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            case 'Cancelled': return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            case 'Completed': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20';
            default:          return '';
        }
    };

    const handleTabChange = (status: string) => {
        setActiveTab(status);
        router.get(route('organizer.events.index'), { status, search }, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('organizer.events.index'), { status: activeTab, search }, { preserveState: true, replace: true });
    };

    const openCompleteModal = (eventId: string, eventName: string) => {
        setOpenMenuId(null);
        setConfirmModal({
            isOpen: true,
            title: 'Mark as Completed',
            message: `Are you sure you want to mark "${eventName}" as completed?`,
            action: 'complete',
            eventId,
        });
    };

    const openCancelModal = (eventId: string, eventName: string) => {
        setOpenMenuId(null);
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

    const eventRows: EventRow[] = events?.data || [];
    const totalRows = eventRows.length;

    return (
        <DashboardLayout>
            <Head title="My Events | Organizer" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Events</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and monitor all events you've created.</p>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Status Tabs */}
                <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-white/5 pb-0">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            className={`px-4 py-2.5 text-sm font-bold transition-colors relative ${
                                activeTab === tab.value
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.value && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Search + Create */}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <Link
                        href={route('organizer.events.create')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-all shadow-lg shadow-primary-500/25"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Event
                    </Link>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search for an event..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm font-medium"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <div className="min-w-full rounded-2xl">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                    <th className="px-5 py-3">Event Name</th>
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Tickets</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                                {eventRows.length > 0 ? eventRows.map((event, idx) => {
                                    const isNearBottom = totalRows <= 2 || idx >= totalRows - 2;

                                    return (
                                        <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-4">
                                                <Link href={route('organizer.events.show', event.id)} className="font-semibold text-slate-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                                    {event.name}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{event.category}</td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{event.date}</td>
                                            <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{event.tickets}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(event.status)}`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="relative inline-block">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                                                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                        </svg>
                                                    </button>

                                                    {openMenuId === event.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                                            <div className={`absolute right-0 z-50 w-48 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-1 ${isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
                                                                <Link
                                                                    href={route('organizer.events.show', event.id)}
                                                                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                                                >
                                                                    View Details
                                                                </Link>
                                                                {!['Cancelled', 'Completed'].includes(event.status) && (
                                                                    <Link
                                                                        href={route('organizer.events.edit', event.id)}
                                                                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {event.status === 'Active' && (
                                                                    <button
                                                                        onClick={() => openCompleteModal(event.id, event.name)}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                                                    >
                                                                        Mark as Completed
                                                                    </button>
                                                                )}
                                                                {['Active', 'Draft'].includes(event.status) && (
                                                                    <button
                                                                        onClick={() => openCancelModal(event.id, event.name)}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                                    >
                                                                        Cancel Event
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Events Found</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                                                    {activeTab !== 'All' ? `No ${activeTab.toLowerCase()} events found.` : "You haven't created any events yet."}
                                                </p>
                                                <Link href={route('organizer.events.create')} className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-500/25 text-sm">
                                                    Create Your First Event
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {events?.links && events.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {events.links.map((link: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                disabled={!link.url}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                    link.active
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                } disabled:opacity-30 disabled:cursor-not-allowed`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal show={confirmModal.isOpen} onClose={closeConfirmModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${confirmModal.action === 'complete' ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                            {confirmModal.action === 'complete' ? (
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
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
                                confirmModal.action === 'complete' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'
                            }`}
                        >
                            {confirmModal.action === 'complete' ? 'Mark as Completed' : 'Cancel Event'}
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
