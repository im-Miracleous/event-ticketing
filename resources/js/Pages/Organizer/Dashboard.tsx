import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/useTheme';
import {
    Calendar,
    Ticket,
    DollarSign,
    Users,
    TrendingUp,
    BarChart3,
    Settings2,
    Download,
    ChevronDown,
    Banknote
} from 'lucide-react';

export default function Dashboard({ auth, stats, charts, period }: any) {
    const { isDark } = useTheme();
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    };

    const handlePeriodChange = (newPeriod: string) => {
        router.get(route('organizer.dashboard'), { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <DashboardLayout>
            <Head title="Organizer Dashboard" />

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 rotate-3 flex-shrink-0 transition-transform hover:rotate-0 duration-300">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organizer Dashboard</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Summary of your event performance and ticket sales.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href={route('organizer.export-sales')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-sm font-bold transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Export Report (.xlsx)
                    </a>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Active Events', value: stats.totalActiveEvents, icon: Calendar, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10', border: 'hover:border-violet-500/30' },
                    { label: 'Total Tickets Sold', value: stats.totalTicketsSold.toLocaleString('id-ID'), icon: Ticket, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30' },
                    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: Banknote, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30' },
                    { label: 'Unique Attendees', value: stats.uniqueAttendees.toLocaleString('id-ID'), icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/30' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all group ${stat.border}`}>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h2>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Transaction Over Time */}
                <div className="col-span-1 lg:col-span-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Sales & Revenue</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Daily revenue distribution based on period</p>
                        </div>

                        <div className="flex items-center p-1 bg-slate-100 dark:bg-white/5 rounded-xl self-start">
                            {['7days', '30days', '1year'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePeriodChange(p)}
                                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${(period === p || (!period && p === '7days'))
                                            ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {p === '7days' ? '7D' : p === '30days' ? '30D' : '1Y'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        {charts.transactionGraph && charts.transactionGraph.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart key={period || '7days'} data={charts.transactionGraph} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff05' : '#e2e8f0'} vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke={isDark ? '#64748b' : '#94a3b8'}
                                        tick={{ fontSize: 10, fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke={isDark ? '#64748b' : '#94a3b8'}
                                        tick={{ fontSize: 10, fontWeight: 600 }}
                                        tickFormatter={(val) => `Rp${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000) + 'k'}`}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            borderColor: isDark ? '#1e293b' : '#e2e8f0',
                                            borderRadius: '1rem',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                            border: 'none',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        labelStyle={{ fontSize: '12px', fontWeight: '800', marginBottom: '4px', color: isDark ? '#f8fafc' : '#0f172a' }}
                                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8b5cf6"
                                        strokeWidth={4}
                                        dot={false}
                                        activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                                        animationDuration={1500}
                                        isAnimationActive={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium italic">No transactions found for the selected period.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Event Performance */}
                <div className="col-span-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Top Events</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Performance by revenue</p>
                        </div>
                        <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        {charts.eventPerformance && charts.eventPerformance.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.eventPerformance} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff05' : '#e2e8f0'} horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        stroke={isDark ? '#94a3b8' : '#64748b'}
                                        width={100}
                                        tick={{ fontSize: 10, fontWeight: 700 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                            borderColor: 'none',
                                            borderRadius: '1rem',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                            border: 'none'
                                        }}
                                        cursor={{ fill: isDark ? '#ffffff05' : '#f8fafc' }}
                                        formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <Settings2 className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium italic">No event data available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Link to Events */}
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 blur-[100px] pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] pointer-events-none" />

                <div className="relative z-10 w-full lg:w-2/3 text-center lg:text-left mb-6 lg:mb-0">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Event Management</h2>
                    <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-lg">
                        Monitor every event's operations in detail, validate tickets, and manage your promotions efficiently.
                    </p>
                </div>

                <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                    <Link
                        href={route('organizer.events.index')}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-black py-3 px-8 rounded-xl flex items-center justify-center space-x-3 transition-all shadow-lg shadow-primary-500/20 active:scale-95 group/btn"
                    >
                        <span className="text-sm">Open Events Menu</span>
                        <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
