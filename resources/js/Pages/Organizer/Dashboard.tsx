import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Head title="Organizer Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizer Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your events and attendees.</p>
            </div>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Secondary Topbar specifically for Dasboard events list (per design) */}
                <div className="flex items-center space-x-6 border-b border-gray-200">
                    <button className="px-4 py-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600">ALL EVENTS</button>
                    <button className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-800">DRAFT</button>
                    <button className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-800">NOW SHOWING</button>
                    <button className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-800">ENDED</button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('organizer.events.create')}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-full flex items-center space-x-2 transition-colors shadow-md shadow-primary-500/30"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span>Create Event</span>
                        </Link>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search for an event..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                    {/* Placeholder Event Card */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                        <div className="h-40 bg-gray-200 relative flex items-center justify-center">
                            {/* Card Image Placeholder */}
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <div className="absolute top-3 left-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded shadow-sm">
                                DRAFT
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">Contoh Event</h3>

                            <div className="space-y-2 mt-auto">
                                <div className="flex items-start text-sm text-gray-600 font-medium">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Selasa 10 Maret 2026
                                </div>
                                <div className="flex items-start text-sm text-gray-600 font-medium">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span className="truncate">Universitas Kristen Maranatha</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                                <div className="flex items-center text-sm">
                                    <span className="font-bold text-gray-800 mr-2">0</span>
                                    <span className="text-gray-500 font-medium text-xs">Tickets Sold</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="font-bold text-gray-800 mr-2">0</span>
                                    <span className="text-gray-500 font-medium text-xs">Viewers</span>
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <Link href="#" className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </Link>
                                <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
