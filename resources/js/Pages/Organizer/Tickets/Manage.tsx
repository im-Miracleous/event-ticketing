import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import React, { FormEvent } from 'react';

export default function ManageTickets({ event, ticketTypes }: { event: any, ticketTypes: any[] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: 'Regular', // or VIP
        price: '',
        quota: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('organizer.events.tickets.store', event.id), {
            onSuccess: () => reset('price', 'quota'),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Tiket Event" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Tickets: {event.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage ticket types for this event.</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6 mt-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Link href={route('organizer.dashboard')} className="text-gray-400 hover:text-blue-500 flex items-center text-sm font-bold">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Kembali ke Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Ticket Form */}
                    <div className="bg-navy-900 border border-white/10 shadow-sm rounded-xl overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-white/5 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Tambah Jenis Tiket</h2>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300">Jenis Tiket</label>
                                <select 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="VIP">VIP</option>
                                    <option value="VVIP">VVIP</option>
                                    <option value="Early Bird">Early Bird</option>
                                </select>
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300">Harga (Rp)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Contoh: 150000"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-300">Kuota / Jumlah Tiket</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Contoh: 100"
                                    value={data.quota}
                                    onChange={(e) => setData('quota', e.target.value)}
                                />
                                {errors.quota && <div className="text-red-500 text-xs mt-1">{errors.quota}</div>}
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full py-2.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
                                >
                                    SIMPAN TIKET
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Ticket List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-navy-900 border border-white/10 shadow-sm rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-800">Daftar Tiket</h2>
                                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{ticketTypes.length} Jenis</span>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {ticketTypes.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        Belum ada tiket yang ditambahkan. Silakan tambah tiket baru.
                                    </div>
                                ) : (
                                    ticketTypes.map((ticket) => (
                                        <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="font-bold text-gray-800 text-lg">{ticket.name}</h3>
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Tersedia: {ticket.available_stock}</span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">Kuota Total: {ticket.quota}</p>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Harga</p>
                                                    <p className="font-bold text-blue-600 text-lg">
                                                        Rp {new Intl.NumberFormat('id-ID').format(
                                                            typeof ticket.price === 'number'
                                                                ? ticket.price
                                                                : Number(ticket.price ?? 0)
                                                        )}
                                                    </p>
                                                </div>
                                                <Link 
                                                    href={route('organizer.events.tickets.destroy', { event: event.id, ticket: ticket.id })} 
                                                    method="delete" 
                                                    as="button"
                                                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
