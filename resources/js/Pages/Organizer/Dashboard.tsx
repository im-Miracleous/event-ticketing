import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/useTheme';

export default function Dashboard({ auth, stats, charts }: any) {
    const { isDark } = useTheme();
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <DashboardLayout>
            <Head title="Organizer Dashboard" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizer Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Sistem menampilkan ringkasan performa event dan penjualan tiket Anda.
                    </p>
                </div>
                <div className="flex gap-3">
                    <a
                        href={route('organizer.export-sales')}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm shadow-emerald-500/25"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Export Laporan (.xlsx)
                    </a>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Event Aktif */}
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-primary-500/30 transition-all cursor-pointer group">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Event Aktif</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalActiveEvents}</h2>
                    </div>
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                </div>
                
                {/* Total Tiket Terjual */}
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-blue-500/30 transition-all cursor-pointer group">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Tiket Terjual</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalTicketsSold.toLocaleString('id-ID')}</h2>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                    </div>
                </div>

                {/* Total Pendapatan */}
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-emerald-500/30 transition-all cursor-pointer group">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Pendapatan</p>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</h2>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                {/* Peserta Baru */}
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-purple-500/30 transition-all cursor-pointer group">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Peserta Unik</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.uniqueAttendees.toLocaleString('id-ID')}</h2>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Transaction Over Time */}
                <div className="col-span-1 lg:col-span-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Grafik Transaksi Penjualan (30 Hari)</h3>
                    <div className="h-72 w-full">
                        {charts.transactionGraph && charts.transactionGraph.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={charts.transactionGraph} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
                                    <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fontSize: 12}} />
                                    <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} tick={{fontSize: 12}} tickFormatter={(val) => `Rp${val / 1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                                            borderColor: isDark ? '#1e293b' : '#e2e8f0', 
                                            borderRadius: '0.75rem', 
                                            color: isDark ? '#f8fafc' : '#0f172a' 
                                        }}
                                        itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">Belum ada transaksi di 30 hari terakhir.</div>
                        )}
                    </div>
                </div>

                {/* Event Performance */}
                <div className="col-span-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Analisis Performa Event (Top 5)</h3>
                    <div className="h-72 w-full">
                        {charts.eventPerformance && charts.eventPerformance.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.eventPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} horizontal={false} />
                                    <XAxis type="number" stroke={isDark ? '#94a3b8' : '#64748b'} tickFormatter={(val) => `Rp${val / 1000000}M`} />
                                    <YAxis dataKey="name" type="category" stroke={isDark ? '#94a3b8' : '#64748b'} width={100} tick={{fontSize: 11}} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                                            borderColor: isDark ? '#1e293b' : '#e2e8f0', 
                                            borderRadius: '0.75rem', 
                                            color: isDark ? '#f8fafc' : '#0f172a' 
                                        }}
                                        itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">Belum ada data event.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Link to Events */}
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Manajemen Event</h2>
                    <p className="text-slate-500 dark:text-slate-400">Pantau operasional setiap event secara detail, validasi tiket, dan kelola promosi Anda.</p>
                </div>
                <div className="relative z-10 w-full md:w-auto mt-6 md:mt-0 flex flex-col sm:flex-row gap-4">
                    <Link
                        href={route('organizer.events.index')}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span>Buka Menu Events</span>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
