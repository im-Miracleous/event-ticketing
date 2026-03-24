import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import React, { FormEvent } from 'react';

export default function CreateEvent() {
    const { data, setData, post, processing, errors } = useForm({
        id: crypto.randomUUID(), // Quick mockup UUID
        title: '',
        description: '',
        banner_image: null as File | null,
        event_date: '',
        total_quota: '',
        start_time: '',
        end_time: '',
        location: '',
        event_category_id: '1', // mock default
        organizer_id: '1', // mock default
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('organizer.events.store'));
    };

    return (
        <DashboardLayout>
            <Head title="Create Event" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Event</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add a new event to your catalog.</p>
            </div>
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden mt-6">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center space-x-4">
                    <Link href={route('organizer.dashboard')} className="text-gray-400 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Event Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Write your event name..."
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Description</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows={4}
                            placeholder="Write your event description..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Event Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.event_date}
                                onChange={(e) => setData('event_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Max Attendees</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="1000"
                                value={data.total_quota}
                                onChange={(e) => setData('total_quota', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Start Time</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">End Time</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="block text-sm font-bold text-gray-700">Event Location</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                            placeholder="Ex: Maranatha Christian University"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="block text-sm font-bold text-gray-700">Banner Image</label>
                        <input
                            type="file"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                            onChange={(e) => setData('banner_image', e.target.files ? e.target.files[0] : null)}
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                        <Link href={route('organizer.dashboard')} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center transition-colors shadow-m shadow-primary-500/20"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
