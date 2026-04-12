import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
    ArrowLeft, 
    Edit3, 
    Users, 
    DollarSign, 
    CheckCircle, 
    TrendingUp,
    Clock,
    Package,
    XCircle,
    CheckCircle2
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Swal from 'sweetalert2';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export default function Show({ event, stats, ticketBreakdown, attendees, recentTransactions }: any) {
    const { isDark } = useTheme();

    const handleUpdateStatus = (newStatus: string) => {
        const actionText = newStatus === 'Completed' ? 'Selesaikan' : 'Batalkan';
        const confirmButtonColor = newStatus === 'Completed' ? '#10b981' : '#ef4444';

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Event yang sudah di-${newStatus.toLowerCase()} tidak dapat dikembalikan statusnya.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: '#64748b',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(route('organizer.events.updateStatus', event.id), {
                    status: newStatus
                }, {
                    onSuccess: () => {
                        Swal.fire(
                            'Berhasil!',
                            `Status event telah diperbarui menjadi ${newStatus}.`,
                            'success'
                        );
                    }
                });
            }
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Event Details - ${event.title}`} />

            <div className="space-y-6">
                {/* Header with Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link 
                            href="/organizer/events" 
                            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to My Events
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{event.title}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                event.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                event.status === 'Draft' ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20' :
                                event.status === 'Completed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                                'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {event.status === 'Active' && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus('Completed')}
                                    className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all active:scale-95"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark as Completed
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('Cancelled')}
                                    className="inline-flex items-center px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all active:scale-95"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Event
                                </button>
                            </>
                        )}
                        <Link 
                            href={`/organizer/events/${event.id}/edit`} 
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm transition-all active:scale-95"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Event
                        </Link>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: DollarSign, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
                        { label: 'Tickets Sold', value: `${stats.sold} / ${stats.quota}`, icon: Package, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Attendance Rate', value: `${stats.sold > 0 ? Math.round((stats.checkedIn / stats.sold) * 100) : 0}%`, icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Check-ins', value: stats.checkedIn, icon: CheckCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-primary-500/30 transition-all">
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</h2>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ticket Sales Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ticket Sales Breakdown</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sales distribution across different ticket tiers</p>
                            </div>
                            <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-violet-600 dark:text-violet-400">
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ticketBreakdown} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff05" : "#e2e8f0"} vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#64748b" 
                                        tick={{ fontSize: 11, fontWeight: 500 }} 
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        stroke="#64748b" 
                                        tick={{ fontSize: 11, fontWeight: 500 }} 
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                                            borderColor: isDark ? '#1e293b' : '#e2e8f0', 
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px'
                                        }} 
                                        cursor={{ fill: isDark ? '#ffffff05' : '#f8fafc' }}
                                    />
                                    <Bar dataKey="sold" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Capacity Distribution */}
                    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Capacity Allocation</h3>
                        <div className="h-56 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={ticketBreakdown} 
                                        dataKey="sold" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={80} 
                                        innerRadius={60} 
                                        paddingAngle={5} 
                                        strokeWidth={0}
                                    >
                                        {ticketBreakdown.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                                            borderColor: isDark ? '#1e293b' : '#e2e8f0', 
                                            borderRadius: '0.75rem',
                                            fontSize: '12px'
                                        }} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.sold}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sold</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {ticketBreakdown.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{Math.round((item.sold / (stats.sold || 1)) * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Registered Attendees */}
                    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Attendees</h3>
                            <Link href="/organizer/attendees" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-wider">View All</Link>
                        </div>
                        <div className="overflow-x-auto -mx-6">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-50 dark:border-white/5">
                                        <th className="text-left pb-3 px-6 uppercase font-black tracking-widest text-[9px]">Attendee</th>
                                        <th className="text-left pb-3 px-3 uppercase font-black tracking-widest text-[9px]">Type</th>
                                        <th className="text-right pb-3 px-6 uppercase font-black tracking-widest text-[9px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                    {attendees.slice(0, 5).map((attendee: any) => (
                                        <tr key={attendee.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-6">
                                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{attendee.name}</div>
                                                <div className="text-[10px] text-slate-500">{attendee.email}</div>
                                            </td>
                                            <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-400">{attendee.ticket_type}</td>
                                            <td className="py-3 px-6 text-right">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                                                    attendee.status === 'Used' 
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {attendee.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {attendees.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-10 text-center text-slate-500 italic">No attendees registered yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                            <Link href="/organizer/transactions" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-wider">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {recentTransactions.map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{tx.buyer_name}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{tx.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(tx.amount)}</div>
                                        <div className={`text-[9px] font-black uppercase tracking-wider ${
                                            tx.status === 'Success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                        }`}>
                                            {tx.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <div className="py-10 text-center text-slate-500 italic">No transactions found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
