import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface EventCategory {
    id: number;
    name: string;
}

interface Organizer {
    id: number;
    name: string;
}

interface TicketType {
    id: string;
    name: string;
    price: number;
    quota: number;
    available_stock: number;
    description: string;
}

interface Promotion {
    id: string;
    code: string;
    discount: number;
    type: string;
    valid_until: string;
    status: string;
}

interface EventData {
    id: string;
    title: string;
    description: string;
    banner_image: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    format: string;
    total_quota: number;
    status: string;
    created_at: string;
    category: EventCategory;
    organizer: Organizer;
    organizer_id: number;
    ticket_types: TicketType[];
    promotions: Promotion[];
}

interface Props {
    event: EventData;
    canEdit: boolean;
    isRoot: boolean;
}

export default function ShowEvent({ event, canEdit, isRoot }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: 'restore' | 'deactivate' | 'complete' | 'cancel' | null;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: null,
    });

    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        description: event.description || '',
        banner_image: null as File | null,
        event_date: event.event_date ? event.event_date.split(' ')[0] : '',
        total_quota: event.total_quota?.toString() || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        location: event.location || '',
        format: event.format || 'Offline',
        event_category_id: event.category?.id || '',
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setData({
            title: event.title || '',
            description: event.description || '',
            banner_image: null,
            event_date: event.event_date ? event.event_date.split(' ')[0] : '',
            total_quota: event.total_quota?.toString() || '',
            start_time: event.start_time || '',
            end_time: event.end_time || '',
            location: event.location || '',
            format: event.format || 'Offline',
            event_category_id: event.category?.id || '',
        });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(route('admin.events.update', event.id), {
            onSuccess: () => setIsEditing(false),
        });
    };

    const openRestoreModal = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Restore Event',
            message: `Are you sure you want to restore "${event.title}"? The event will become active again and visible in the All Events page.`,
            action: 'restore',
        });
    };

    const openDeactivateModal = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Deactivate Event',
            message: `Are you sure you want to deactivate "${event.title}"? The event will be suspended and moved to the Archive.`,
            action: 'deactivate',
        });
    };

    const openCompleteModal = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Mark as Completed',
            message: `Are you sure you want to mark "${event.title}" as completed? This indicates the event has concluded.`,
            action: 'complete',
        });
    };

    const openCancelModal = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Cancel Event',
            message: `Are you sure you want to cancel "${event.title}"? This action will cancel the event and it will be moved to the Archive.`,
            action: 'cancel',
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({
            ...prev,
            isOpen: false,
        }));
    };

    const handleConfirmAction = () => {
        const statusMap: Record<string, string> = {
            restore: 'Active',
            deactivate: 'Deactivated',
            complete: 'Completed',
            cancel: 'Cancelled',
        };

        if (confirmModal.action === 'restore') {
            router.patch(route('admin.events.restore', { id: event.id }), {}, {
                onSuccess: () => closeConfirmModal(),
            });
        } else if (confirmModal.action && statusMap[confirmModal.action]) {
            router.patch(route('admin.events.updateStatus', { event: event.id }), {
                status: statusMap[confirmModal.action],
            }, {
                onSuccess: () => closeConfirmModal(),
                onError: (errors) => {
                    console.error('Failed to update status:', errors);
                    closeConfirmModal();
                },
            });
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20';
            case 'Draft':       return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            case 'Cancelled':   return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            case 'Deactivated': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            case 'Completed':   return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20';
            default:            return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title={event.title} />

            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href={route('admin.events.index')} className="text-slate-400 hover:text-primary-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <span className="text-slate-400">/</span>
                <Link href={route('admin.events.index')} className="text-slate-500 hover:text-primary-500">Events</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-800 dark:text-white font-medium truncate max-w-[200px]">{event.title}</span>
            </nav>

            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {event.banner_image && (
                        <img 
                            src={event.banner_image} 
                            alt={event.title}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                        />
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{event.title}</h1>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(event.status)}`}>
                                {event.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Event ID: <code className="text-xs bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{event.id}</code>
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* Restore button for deactivated events */}
                    {event.status === 'Deactivated' && canEdit && (
                        <button
                            onClick={openRestoreModal}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Restore
                        </button>
                    )}

                    {/* Edit button */}
                    {canEdit && !['Deactivated', 'Cancelled', 'Completed'].includes(event.status) && !isEditing && (
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    )}

                    {/* Mark as Completed */}
                    {canEdit && event.status === 'Active' && !isEditing && (
                        <button
                            onClick={openCompleteModal}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Mark as Completed
                        </button>
                    )}

                    {/* Cancel Event */}
                    {canEdit && ['Active', 'Draft'].includes(event.status) && !isEditing && (
                        <button
                            onClick={openCancelModal}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Event
                        </button>
                    )}

                    {/* Deactivate / Suspend (Admin/Root only) */}
                    {canEdit && ['Active', 'Draft'].includes(event.status) && !isEditing && (
                        <button
                            onClick={openDeactivateModal}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Deactivate
                        </button>
                    )}

                    {/* Edit mode buttons */}
                    {isEditing && (
                        <>
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="edit-form"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Edit Form or View Mode */}
            {isEditing ? (
                <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm rounded-xl overflow-hidden">
                    <form id="edit-form" onSubmit={submit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                            <textarea
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Format</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                    value={data.format}
                                    onChange={(e) => setData('format', e.target.value)}
                                >
                                    <option value="Offline">Offline Event</option>
                                    <option value="Online">Online Event</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Category</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                    value={data.event_category_id}
                                    onChange={(e) => setData('event_category_id', e.target.value)}
                                >
                                    {event.category && (
                                        <option value={event.category.id}>{event.category.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Max Attendees</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                    value={data.total_quota}
                                    onChange={(e) => setData('total_quota', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Event Location {data.format === 'Online' && '(Link URL/Platform)'}
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Banner Image</label>
                            <input
                                type="file"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-500/20 file:text-primary-400"
                                onChange={(e) => setData('banner_image', e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Event Details</h2>
                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{event.description}</p>
                        </div>

                        {/* Ticket Types */}
                        {event.ticket_types && event.ticket_types.length > 0 && (
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ticket Types</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                                <th className="pb-3">Name</th>
                                                <th className="pb-3">Price</th>
                                                <th className="pb-3">Quota</th>
                                                <th className="pb-3">Available</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {event.ticket_types.map((ticket) => (
                                                <tr key={ticket.id}>
                                                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{ticket.name}</td>
                                                    <td className="py-3 text-slate-500 dark:text-slate-400">
                                                        {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
                                                    </td>
                                                    <td className="py-3 text-slate-500 dark:text-slate-400">{ticket.quota}</td>
                                                    <td className="py-3 text-slate-500 dark:text-slate-400">{ticket.available_stock}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Promotions */}
                        {event.promotions && event.promotions.length > 0 && (
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Promotions</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                                <th className="pb-3">Code</th>
                                                <th className="pb-3">Discount</th>
                                                <th className="pb-3">Valid Until</th>
                                                <th className="pb-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {event.promotions.map((promo) => (
                                                <tr key={promo.id}>
                                                    <td className="py-3">
                                                        <code className="text-xs bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                                                            {promo.code}
                                                        </code>
                                                    </td>
                                                    <td className="py-3 text-slate-500 dark:text-slate-400">
                                                        {promo.type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`}
                                                    </td>
                                                    <td className="py-3 text-slate-500 dark:text-slate-400">{promo.valid_until}</td>
                                                    <td className="py-3">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                            promo.status === 'Active' 
                                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                                                        }`}>
                                                            {promo.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{event.event_date}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        {event.start_time} - {event.end_time}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{event.location}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Format</label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{event.format}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{event.category?.name || '—'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quota</label>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{event.total_quota}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Organizer</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {event.organizer?.name?.charAt(0) || '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{event.organizer?.name || '—'}</p>
                                    <p className="text-xs text-slate-500">Organizer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Info</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Event ID</label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        <code className="text-xs bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded break-all">{event.id}</code>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Created At</label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{event.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal show={confirmModal.isOpen} onClose={closeConfirmModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${
                            confirmModal.action === 'restore' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                            confirmModal.action === 'complete' ? 'bg-blue-100 dark:bg-blue-500/20' :
                            confirmModal.action === 'deactivate' ? 'bg-amber-100 dark:bg-amber-500/20' :
                            'bg-red-100 dark:bg-red-500/20'
                        }`}>
                            {confirmModal.action === 'restore' && (
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
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
                                confirmModal.action === 'restore' ? 'bg-emerald-600 hover:bg-emerald-500' :
                                confirmModal.action === 'complete' ? 'bg-blue-600 hover:bg-blue-500' :
                                confirmModal.action === 'deactivate' ? 'bg-amber-600 hover:bg-amber-500' :
                                'bg-red-600 hover:bg-red-500'
                            }`}
                        >
                            {confirmModal.action === 'restore' ? 'Restore Event' :
                             confirmModal.action === 'complete' ? 'Mark as Completed' :
                             confirmModal.action === 'deactivate' ? 'Deactivate Event' :
                             'Cancel Event'}
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
