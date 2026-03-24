import OrganizerLayout from '@/Layouts/OrganizerLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import React, { FormEvent } from 'react';

// Using loosely typing for brevity, normally define a strict interface
interface EventProps {
    id: string;
    title: string;
    description: string;
    event_date: string;
    total_quota: number;
    start_time: string;
    end_time: string;
    location: string;
}

export default function EditEvent({ event }: { event: EventProps }) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        description: event.description || '',
        banner_image: null as File | null,
        event_date: event.event_date ? event.event_date.split(' ')[0] : '', // simple date format
        total_quota: event.total_quota?.toString() || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        location: event.location || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // Inertia 'put' request to update
        put(route('organizer.events.update', event.id));
    };

    return (
        <OrganizerLayout header={`EDIT EVENT: ${event.title}`}>
            <Head title="Edit Event" />

            <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden mt-6">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center space-x-4">
                    <Link href={route('organizer.dashboard')} className="text-gray-400 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h2 className="text-xl font-bold text-gray-800">UBAH INFORMASI EVENT</h2>
                </div>

                <form onSubmit={submit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Nama Event</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Deskripsi Event</label>
                        <textarea 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Tanggal Event</label>
                            <input 
                                type="date" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.event_date}
                                onChange={(e) => setData('event_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Kuota Total</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.total_quota}
                                onChange={(e) => setData('total_quota', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Waktu Mulai</label>
                            <input 
                                type="datetime-local" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Waktu Selesai</label>
                            <input 
                                type="datetime-local" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="block text-sm font-bold text-gray-700">Lokasi Event</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2 pt-4">
                        <label className="block text-sm font-bold text-gray-700">Banner Image Baru (Opsional)</label>
                        <input 
                            type="file" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                            onChange={(e) => setData('banner_image', e.target.files ? e.target.files[0] : null)}
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                        <Link href={route('organizer.dashboard')} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Batal
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center transition-colors shadow-sm shadow-blue-500/20"
                        >
                            SIMPAN PERUBAHAN
                        </button>
                    </div>
                </form>
            </div>
        </OrganizerLayout>
    );
}
