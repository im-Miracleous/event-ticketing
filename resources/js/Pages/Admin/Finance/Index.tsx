import DashboardLayout from '@/Layouts/DashboardLayout';
import StatisticsCard from '@/Components/Dashboard/StatisticsCard';
import { Head } from '@inertiajs/react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface StatItem {
    title: string;
    value: string;
}

interface TransactionItem {
    id: string;
    user: string;
    event: string;
    amount: string;
    fee: string;
    date: string;
    status: string;
}

interface MonthlyRevenueItem {
    month: string;
    sales: string;
    fee: string;
}

interface Props {
    financeStats: StatItem[];
    recentTransactions: TransactionItem[];
    monthlyRevenue: MonthlyRevenueItem[];
}

/* ─── Icons ─────────────────────────────────────────────────────────── */

const financeIcons = [
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
    ),
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
    ),
    (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminFinance({ financeStats, recentTransactions, monthlyRevenue }: Props) {
    return (
        <DashboardLayout>
            <Head title="Financial Overview" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Track platform revenue, organizer payouts, and transaction history.
                </p>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {financeStats.map((stat, idx) => (
                    <StatisticsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={financeIcons[idx] || financeIcons[0]}
                    />
                ))}
            </div>

            {/* Two columns: Monthly Revenue + Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Monthly Revenue Breakdown */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Monthly Revenue</h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {monthlyRevenue.map((row) => (
                            <div key={row.month} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.month} 2026</span>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{row.sales}</p>
                                    <p className="text-xs text-emerald-500 dark:text-emerald-400">Fee: {row.fee}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
                        <span className="text-xs font-medium text-primary-500 dark:text-primary-400 cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                    <th className="px-5 py-3">ID</th>
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">Event</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Fee</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {recentTransactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{txn.id}</td>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{txn.user}</td>
                                        <td className="px-5 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{txn.event}</td>
                                        <td className="px-5 py-3 font-medium text-slate-800 dark:text-white whitespace-nowrap">{txn.amount}</td>
                                        <td className="px-5 py-3 text-emerald-500 dark:text-emerald-400 whitespace-nowrap">{txn.fee}</td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                txn.status === 'Success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20' :
                                                txn.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20' :
                                                'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20'
                                            }`}>
                                                {txn.status}
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
