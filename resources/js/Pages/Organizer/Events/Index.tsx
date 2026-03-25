import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, events }: any) {
    return (
        <DashboardLayout>
            <Head title="My Events | Organizer" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Events</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola dan pantau seluruh event yang Anda buat.</p>
            </div>

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Secondary Topbar specifically for Dasboard events list (per design) */}
                <div className="flex items-center space-x-6 border-b border-white/10 pb-2">
                    <button className="px-4 py-2 text-sm font-bold text-primary-500 border-b-2 border-primary-500">ALL EVENTS</button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors">DRAFT</button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors">NOW SHOWING</button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors">ENDED</button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 p-6 bg-navy-900 border border-white/5 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <span className="text-white font-bold px-4 py-2 bg-white/5 rounded-xl border border-white/10">Catatan: Pembuatan event baru hanya dapat dilakukan oleh Admin.</span>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search for an event..."
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-md text-sm font-medium"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                    {events && events.length > 0 ? (
                        events.map((event: any) => (
                            <div key={event.id} className="bg-navy-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm hover:border-primary-500/30 transition-all group flex flex-col">
                                <div className="h-40 bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                                    {event.banner_image ? (
                                        <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <svg className="w-16 h-16 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    )}
                                    <div className="absolute top-3 left-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-xs font-bold rounded-lg shadow-sm backdrop-blur-sm">
                                        {event.status || 'DRAFT'}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-primary-400 transition-colors line-clamp-1">{event.title}</h3>

                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-start text-sm text-slate-400 font-medium">
                                            <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-start text-sm text-slate-400 font-medium">
                                            <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
                                        <div className="flex items-center text-sm">
                                            <span className="font-bold text-white mr-2">0</span>
                                            <span className="text-slate-500 font-medium text-xs">Tickets Sold (Max: {event.total_quota})</span>
                                        </div>
                                    </div>

                                    {/* Edit button removed - Admin only */}
                                    <div className="mt-4 flex space-x-2">
                                        
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center mt-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No Events Found</h3>
                            <p className="text-slate-400 text-sm max-w-sm mb-6">Looks like you haven't created any events yet, or none match your search criteria.</p>
                            <Link href={route('organizer.dashboard')} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-6 rounded-xl transition-colors backdrop-blur-md border border-white/5 shadow-sm text-sm">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
