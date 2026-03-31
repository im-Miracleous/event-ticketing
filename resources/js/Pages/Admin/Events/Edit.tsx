import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import React, { FormEvent } from 'react';

// Using loosely typing for brevity
interface EventProps {
    id: string;
    title: string;
    description: string;
    event_date: string;
    total_quota: number;
    start_time: string;
    end_time: string;
    location: string;
    format: string;
    event_category_id: number;
    organizer_id: number;
}

export default function EditEvent({ event, categories, organizers }: { event: EventProps, categories: any[], organizers: any[] }) {
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
        event_category_id: event.event_category_id || '',
        organizer_id: event.organizer_id || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // Inertia 'put' request to update
        put(route('admin.events.update', event.id));
    };

    return (
        <DashboardLayout>
            <Head title="Edit Event" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Event: {event.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update event information.</p>
            </div>
            
            {(errors as any).error && (
                <div className="max-w-4xl mx-auto mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl flex items-center">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-medium text-sm">{(errors as any).error}</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm rounded-xl overflow-hidden mt-6">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center space-x-4">
                    <Link href={route('admin.events.index')} className="text-slate-400 hover:text-primary-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Details</h2>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Assign Organizer</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm appearance-none"
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

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Event Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm"
                            placeholder="Write your event name..."
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm"
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm appearance-none"
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm appearance-none"
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:filter-[invert(1)]"
                                value={data.event_date}
                                onChange={(e) => setData('event_date', e.target.value)}
                            />
                            {errors.event_date && <div className="text-red-500 text-xs mt-1">{errors.event_date}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Max Attendees</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm"
                                placeholder="1000"
                                value={data.total_quota}
                                onChange={(e) => setData('total_quota', e.target.value)}
                            />
                            {errors.total_quota && <div className="text-red-500 text-xs mt-1">{errors.total_quota}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:filter-[invert(1)]"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                            {errors.start_time && <div className="text-red-500 text-xs mt-1">{errors.start_time}</div>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">End Time</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:filter-[invert(1)]"
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
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm"
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
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-500/20 file:text-primary-400 hover:file:bg-primary-500/30"
                            onChange={(e) => setData('banner_image', e.target.files ? e.target.files[0] : null)}
                        />
                        {errors.banner_image && <div className="text-red-500 text-xs mt-1">{errors.banner_image}</div>}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end space-x-4">
                        <Link href={route('admin.events.index')} className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all backdrop-blur-sm">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl flex items-center transition-all shadow-lg shadow-primary-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

        </DashboardLayout>
    );
}
