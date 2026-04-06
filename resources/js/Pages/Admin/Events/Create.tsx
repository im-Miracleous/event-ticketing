import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React, { FormEvent, useState } from 'react';
import { formatCurrency } from '@/utils/currency';

interface TicketTypeRow {
    name: string;
    price: string;
    quota: string;
}

export default function CreateEvent({ categories, organizers }: any) {
    const { currency } = usePage().props as any;
    const isOrganizer = !organizers; // Organizer view doesn't get organizers prop

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        banner_image: null as File | null,
        event_date: '',
        total_quota: '',
        start_time: '',
        end_time: '',
        location: '',
        format: 'Offline',
        event_category_id: categories && categories.length > 0 ? categories[0].id : '',
        organizer_id: organizers && organizers.length > 0 ? organizers[0].id : '',
        ticket_types: [] as TicketTypeRow[],
    });

    const [ticketTypes, setTicketTypes] = useState<TicketTypeRow[]>([]);

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: '', price: '0', quota: '' }]);
    };

    const removeTicketType = (index: number) => {
        setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    };

    const updateTicketType = (index: number, field: keyof TicketTypeRow, value: string) => {
        const updated = [...ticketTypes];
        updated[index] = { ...updated[index], [field]: value };
        setTicketTypes(updated);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        const totalFromTickets = ticketTypes.reduce((sum, tt) => sum + (parseInt(tt.quota) || 0), 0);

        // Sync ticket types into form data and submit
        const ticketData = ticketTypes.filter(tt => tt.name && tt.quota).map(tt => ({
            name: tt.name,
            price: parseFloat(tt.price) || 0,
            quota: parseInt(tt.quota) || 0,
        }));

        // Update form data directly before submitting
        data.ticket_types = ticketData as any;
        if (totalFromTickets > 0) {
            data.total_quota = totalFromTickets.toString();
        }

        const routeName = isOrganizer ? 'organizer.events.store' : 'admin.events.store';
        post(route(routeName));
    };

    const backRoute = isOrganizer ? 'organizer.events.index' : 'admin.events.index';

    return (
        <DashboardLayout>
            <Head title="Create Event" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Event</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isOrganizer ? 'Create a new event for your organization.' : 'Add a new event manually as an Admin.'}
                </p>
            </div>
            
            {(errors as any).error && (
                <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl flex items-center">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-medium text-sm">{(errors as any).error}</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm rounded-xl overflow-hidden mt-6">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center space-x-4">
                    <Link href={route(backRoute)} className="text-slate-400 hover:text-primary-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Details</h2>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    {/* Organizer Selector (Admin only) */}
                    {!isOrganizer && (
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Assign Organizer</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none"
                                value={data.organizer_id}
                                onChange={(e) => setData('organizer_id', e.target.value)}
                            >
                                {organizers && organizers.length > 0 ? (
                                    organizers.map((org: any) => (
                                        <option key={org.id} value={org.id} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                                            {org.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" className="bg-white dark:bg-navy-900 text-slate-400">Loading organizers...</option>
                                )}
                            </select>
                            {errors.organizer_id && <div className="text-red-500 text-xs mt-1">{errors.organizer_id}</div>}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                            placeholder="Write your event name..."
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                            rows={4}
                            placeholder="Write your event description..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Format</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none"
                                value={data.format}
                                onChange={(e) => setData('format', e.target.value)}
                            >
                                <option value="Offline" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Offline Event</option>
                                <option value="Online" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Online Event</option>
                            </select>
                            {errors.format && <div className="text-red-500 text-xs mt-1">{errors.format}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Category</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none"
                                value={data.event_category_id}
                                onChange={(e) => setData('event_category_id', e.target.value)}
                            >
                                {categories && categories.length > 0 ? (
                                    categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                                            {cat.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" className="bg-white dark:bg-navy-900 text-slate-400">Loading categories...</option>
                                )}
                            </select>
                            {errors.event_category_id && <div className="text-red-500 text-xs mt-1">{errors.event_category_id}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:filter-[invert(1)]"
                                value={data.event_date}
                                onChange={(e) => setData('event_date', e.target.value)}
                            />
                            {errors.event_date && <div className="text-red-500 text-xs mt-1">{errors.event_date}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Max Attendees</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                                placeholder={ticketTypes.length > 0 ? 'Auto-calculated from tickets' : '1000'}
                                value={ticketTypes.length > 0 ? ticketTypes.reduce((sum, tt) => sum + (parseInt(tt.quota) || 0), 0) : data.total_quota}
                                onChange={(e) => setData('total_quota', e.target.value)}
                                readOnly={ticketTypes.length > 0}
                            />
                            {ticketTypes.length > 0 && (
                                <p className="text-xs text-slate-400 dark:text-slate-500">Auto-calculated from ticket quotas below.</p>
                            )}
                            {errors.total_quota && <div className="text-red-500 text-xs mt-1">{errors.total_quota}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:filter-[invert(1)]"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                            {errors.start_time && <div className="text-red-500 text-xs mt-1">{errors.start_time}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">End Time</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:filter-[invert(1)]"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                            {errors.end_time && <div className="text-red-500 text-xs mt-1">{errors.end_time}</div>}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Location {data.format === 'Online' && '(Link URL/Platform)'}</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                            placeholder={data.format === 'Online' ? "Ex: Zoom Link / Google Meet" : "Ex: Maranatha Christian University"}
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                        {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Banner Image</label>
                        <input
                            type="file"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-500/20 file:text-primary-400 hover:file:bg-primary-500/30"
                            onChange={(e) => setData('banner_image', e.target.files ? e.target.files[0] : null)}
                        />
                        {errors.banner_image && <div className="text-red-500 text-xs mt-1">{errors.banner_image}</div>}
                    </div>

                    {/* ── Ticket Types ─────────────────────────────────── */}
                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Ticket Types</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Define different tiers for your event tickets.</p>
                            </div>
                            <button
                                type="button"
                                onClick={addTicketType}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Ticket Type
                            </button>
                        </div>

                        {ticketTypes.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                                <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                                </svg>
                                <p className="text-sm text-slate-400 dark:text-slate-500">No ticket types added yet.</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click "Add Ticket Type" to define tiers like Regular, VIP, etc.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ticketTypes.map((tt, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Regular, VIP"
                                                    value={tt.name}
                                                    onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Price ({currency})</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    min={0}
                                                    value={tt.price}
                                                    onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Quota</label>
                                                <input
                                                    type="number"
                                                    placeholder="100"
                                                    min={1}
                                                    value={tt.quota}
                                                    onChange={(e) => updateTicketType(index, 'quota', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeTicketType(index)}
                                            className="mt-5 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end space-x-4">
                        <Link href={route(backRoute)} className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all backdrop-blur-sm">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl flex items-center transition-all shadow-lg shadow-primary-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Create Event
                        </button>
                    </div>
                </form>
            </div>

        </DashboardLayout>
    );
}
