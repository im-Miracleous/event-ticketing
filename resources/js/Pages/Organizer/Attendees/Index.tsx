import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';

export default function AttendeesIndex({ auth, attendees, events, filters }: any) {
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            route('organizer.attendees.index'),
            { event_id: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Peserta" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Peserta</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Pantau daftar peserta yang telah membeli tiket untuk event Anda.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter Event:</label>
                    <select
                        value={filters.event_id || ''}
                        onChange={handleFilterChange}
                        className="rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500 min-w-[200px]"
                    >
                        <option value="">Semua Event</option>
                        {events.map((event: any) => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">ID TIKET</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">PESERTA</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">PEMBELI (AKUN)</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">EVENT & TIPE</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">STATUS</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white text-right">TANGGAL BELI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {attendees.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada peserta yang terdaftar pada kriteria ini.
                                    </td>
                                </tr>
                            ) : (
                                attendees.data.map((ticket: any) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono text-xs rounded-md border border-slate-200 dark:border-white/10">
                                                {ticket.id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-bold">{ticket.attendee_name}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{ticket.attendee_email}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-sm">
                                            {ticket.buyer_name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-medium">{ticket.event_name}</p>
                                            <p className="text-sm font-bold text-primary-500">{ticket.ticket_type}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            {ticket.status === 'valid' ? (
                                                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-500 font-bold rounded-lg text-xs tracking-wider border border-emerald-500/20">
                                                    VALID / CHECKED-IN
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 font-bold rounded-lg text-xs tracking-wider border border-blue-500/20">
                                                    ISSUED
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm font-medium text-right">
                                            {new Date(ticket.issued_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {attendees.links && attendees.links.length > 3 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-navy-900/50">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">Previous</button>
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">Next</button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-400">
                                    Daftar peserta <span className="font-bold text-white">{attendees.data.length}</span> dari <span className="font-bold text-white">{attendees.total}</span> data keseluruhan.
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {attendees.links.map((link: any, index: number) => {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-primary-600 border-primary-500 text-white'
                                                        : 'bg-white dark:bg-navy-800 border-slate-300 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
