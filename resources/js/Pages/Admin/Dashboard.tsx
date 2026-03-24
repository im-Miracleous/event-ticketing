import DashboardLayout from '@/Layouts/DashboardLayout';
import StatisticsCard from '@/Components/Dashboard/StatisticsCard';
import { Head } from '@inertiajs/react';

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const stats = [
    {
        title: 'Total Users',
        value: '3,842',
        trend: '+5.2%',
        trendUp: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
        ),
    },
    {
        title: 'Active Events',
        value: '124',
        trend: '+12%',
        trendUp: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
        ),
    },
    {
        title: 'Ticket Sales',
        value: 'Rp14.340.000',
        trend: '+41.1%',
        trendUp: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
        ),
    },
    {
        title: 'Platform Revenue',
        value: 'Rp2.868.000',
        trend: '+18.7%',
        trendUp: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
];

const recentActivities = [
    { id: 1, action: 'New user registered',  subject: 'Sarah Johnson',        time: '2 minutes ago',  color: 'bg-emerald-500' },
    { id: 2, action: 'Event created',        subject: 'Tech Summit 2026',     time: '15 minutes ago', color: 'bg-primary-500' },
    { id: 3, action: 'Ticket purchased',     subject: 'Music Fiesta — 2 tickets', time: '32 minutes ago', color: 'bg-amber-500' },
    { id: 4, action: 'Event cancelled',      subject: 'Outdoor Yoga Session', time: '1 hour ago',     color: 'bg-red-500' },
    { id: 5, action: 'Payout processed',     subject: 'Rp1.200.000 to Organizer A', time: '2 hours ago', color: 'bg-violet-500' },
    { id: 6, action: 'New organizer joined', subject: 'PT Kreasi Event',      time: '3 hours ago',    color: 'bg-cyan-500' },
];

const upcomingEvents = [
    { id: 1, name: 'Tech Summit 2026',     date: 'Mar 28, 2026', tickets: '450 / 500', status: 'Published' },
    { id: 2, name: 'Music Fiesta Jakarta', date: 'Apr 05, 2026', tickets: '1,200 / 2,000', status: 'Published' },
    { id: 3, name: 'Startup Pitch Night',  date: 'Apr 12, 2026', tickets: '80 / 150', status: 'Draft' },
    { id: 4, name: 'Art & Design Expo',    date: 'Apr 20, 2026', tickets: '320 / 400', status: 'Published' },
    { id: 5, name: 'Food Festival Bandung',date: 'May 01, 2026', tickets: '0 / 1,000', status: 'Draft' },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminDashboard() {
    return (
        <DashboardLayout>
            <Head title="System Dashboard" />

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    High-level overview of platform health and activity.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <StatisticsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        trendUp={stat.trendUp}
                    />
                ))}
            </div>

            {/* Two-column: Recent Activity + Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Live</span>
                    </div>
                    <ul className="divide-y divide-slate-100 dark:divide-white/5">
                        {recentActivities.map((activity) => (
                            <li key={activity.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                <span className={`h-2 w-2 rounded-full ${activity.color} shrink-0`} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                        <span className="font-medium">{activity.action}</span>
                                        {' — '}
                                        <span className="text-slate-500 dark:text-slate-400">{activity.subject}</span>
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{activity.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Upcoming Events */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming Events</h2>
                        <span className="text-xs font-medium text-primary-500 dark:text-primary-400 cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3">Event</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Tickets</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {upcomingEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{event.name}</td>
                                        <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.date}</td>
                                        <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.tickets}</td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                event.status === 'Published'
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10'
                                            }`}>
                                                {event.status}
                                            </span>
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
