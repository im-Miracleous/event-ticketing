import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

// ── Stat Card ──
function StatCard({ title, value, subtitle, icon, color }: { title: string; value: string | number; subtitle?: string; icon: React.ReactNode; color: string }) {
    return (
        <div className={`relative overflow-hidden bg-navy-900 border border-white/5 rounded-2xl p-6 hover:border-${color}-500/30 transition-all group`}>
            <div className={`absolute -top-6 -right-6 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />
            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                    <h2 className="text-2xl font-black text-white">{typeof value === 'number' ? value.toLocaleString('id-ID') : value}</h2>
                    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 bg-${color}-900/50 rounded-xl flex items-center justify-center text-${color}-400 flex-shrink-0`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// ── Status Badge ──
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
        Cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        Success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.Pending}`}>
            {status}
        </span>
    );
}

export default function Dashboard({ stats, eventStatus, ticketTypeSummary, charts, recentTransactions, period }: any) {
    const setPeriod = (p: string) => router.get('/organizer/dashboard', { period: p }, { preserveState: true, replace: true });

    return (
        <DashboardLayout>
            <Head title="Organizer Dashboard" />

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white">Organizer Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-1">Pantau performa event dan penjualan tiket Anda secara real-time.</p>
                </div>
                <div className="flex gap-3">
                    <a href={route('organizer.export-sales')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-sm font-bold transition-colors shadow-lg shadow-emerald-500/25">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Export Excel
                    </a>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Event Aktif" value={stats.totalActiveEvents} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} color="violet" />
                <StatCard title="Tiket Terjual" value={stats.totalTicketsSold} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>} color="blue" />
                <StatCard title="Total Pendapatan" value={formatCurrency(stats.totalRevenue)} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
                <StatCard title="Check-in" value={`${stats.checkedIn} / ${stats.totalTickets}`} subtitle={`${stats.uniqueAttendees} peserta unik`} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="purple" />
            </div>

            {/* ── Event Status Breakdown ── */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Upcoming', value: eventStatus.upcoming, color: 'blue' },
                    { label: 'Ongoing', value: eventStatus.ongoing, color: 'emerald' },
                    { label: 'Completed', value: eventStatus.completed, color: 'slate' },
                ].map(s => (
                    <div key={s.label} className="bg-navy-900 border border-white/5 rounded-2xl p-5 text-center">
                        <div className={`w-3 h-3 rounded-full bg-${s.color}-500 mx-auto mb-3`} />
                        <h3 className="text-3xl font-black text-white">{s.value}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Transaction Graph */}
                <div className="col-span-1 lg:col-span-2 bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Grafik Penjualan</h3>
                        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                            {['daily', 'weekly', 'monthly'].map(p => (
                                <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${period === p ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                                    {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {charts.transactionGraph?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={charts.transactionGraph} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc' }} formatter={(v: any) => [formatCurrency(v), 'Revenue']} />
                                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">Belum ada data transaksi.</div>
                        )}
                    </div>
                </div>

                {/* Ticket Type Breakdown - Donut */}
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Penjualan per Tipe Tiket</h3>
                    <div className="h-56 w-full">
                        {ticketTypeSummary?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={ticketTypeSummary} dataKey="sold" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3} strokeWidth={0}>
                                        {ticketTypeSummary.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem' }} formatter={((v: any, name: any) => [`${v} tiket`, name ?? '']) as any} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Belum ada data tiket.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Event Performance ── */}
            <div className="bg-navy-900 border border-white/5 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-6">Performa Event (Top 5)</h3>
                <div className="h-64 w-full">
                    {charts.eventPerformance?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.eventPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" stroke="#64748b" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" width={120} tick={{ fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem' }} formatter={(v: any) => [formatCurrency(v), 'Revenue']} />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">Belum ada data event.</div>
                    )}
                </div>
            </div>

            {/* ── Recent Transactions Table ── */}
            <div className="bg-navy-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Transaksi Terbaru</h3>
                    <Link href="/organizer/transactions" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">Lihat Semua →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">ID</th>
                                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Pembeli</th>
                                <th className="text-left py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Event</th>
                                <th className="text-right py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Jumlah</th>
                                <th className="text-center py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions?.length > 0 ? recentTransactions.map((tx: any) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-3 px-4 font-mono text-xs text-slate-300">{tx.id}</td>
                                    <td className="py-3 px-4 font-medium text-white">{tx.buyer_name}</td>
                                    <td className="py-3 px-4 text-slate-300 truncate max-w-[200px]">{tx.event_name}</td>
                                    <td className="py-3 px-4 text-right font-bold text-white">{formatCurrency(tx.total_amount)}</td>
                                    <td className="py-3 px-4 text-center"><StatusBadge status={tx.payment_status} /></td>
                                    <td className="py-3 px-4 text-right text-slate-400 text-xs">{tx.date}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="py-8 text-center text-slate-500">Belum ada transaksi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
