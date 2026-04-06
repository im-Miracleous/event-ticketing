import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export default function Show({ event, stats, ticketBreakdown, attendees, recentTransactions }: any) {
    return (
        <DashboardLayout>
            <Head title={`Detail Event - ${event.title}`} />

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Link href="/organizer/events" className="hover:text-white transition-colors">Events</Link>
                        <span>/</span>
                        <span className="text-slate-300">Detail Event</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">{event.title}</h1>
                </div>
                <div className="flex gap-3">
                    <Link href={`/organizer/events/${event.id}/edit`} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all">Edit Event</Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                    <h2 className="text-2xl font-black text-white">{formatCurrency(stats.revenue)}</h2>
                </div>
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tiket Terjual</p>
                    <h2 className="text-2xl font-black text-white">{stats.sold} / {stats.quota}</h2>
                </div>
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Check-in Rate</p>
                    <h2 className="text-2xl font-black text-white">{stats.checkedIn} <span className="text-sm font-medium text-slate-500">(({Math.round(stats.checkedIn / (stats.sold || 1) * 100)}%))</span></h2>
                </div>
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Sisa Kuota</p>
                    <h2 className="text-2xl font-black text-emerald-400">{stats.quota - stats.sold}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Ticket Breakdown Chart */}
                <div className="col-span-1 lg:col-span-2 bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Penjualan per Tipe Tiket</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ticketBreakdown} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem' }} />
                                <Bar dataKey="sold" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution */}
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Distribusi Tiket</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={ticketBreakdown} dataKey="sold" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={5} strokeWidth={0}>
                                    {ticketBreakdown.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Peserta Terdaftar</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-400 border-b border-white/5">
                                    <th className="text-left py-3 px-4 uppercase text-[10px] font-black">Nama</th>
                                    <th className="text-left py-3 px-4 uppercase text-[10px] font-black">Email</th>
                                    <th className="text-left py-3 px-4 uppercase text-[10px] font-black">Tipe Tiket</th>
                                    <th className="text-center py-3 px-4 uppercase text-[10px] font-black">Status</th>
                                    <th className="text-right py-3 px-4 uppercase text-[10px] font-black">Check-in</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendees.map((attendee: any) => (
                                    <tr key={attendee.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-3 px-4 font-bold text-white">{attendee.name}</td>
                                        <td className="py-3 px-4 text-slate-400">{attendee.email}</td>
                                        <td className="py-3 px-4 font-medium text-blue-400">{attendee.ticket_type}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${attendee.status === 'Used' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {attendee.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-400 text-xs">
                                            {attendee.validated_at || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
