import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
        Cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        Success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return (
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.Pending}`}>
            {status}
        </span>
    );
}

export default function Index({ transactions }: any) {
    return (
        <DashboardLayout>
            <Head title="Transaction Monitor" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transaction Monitor</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full list of all ticket transactions from all your events.</p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3">Transaction ID</th>
                                <th className="px-5 py-3">Buyer</th>
                                <th className="px-5 py-3">Event Name</th>
                                <th className="px-5 py-3 text-right">Payment Amount</th>
                                <th className="px-5 py-3 text-center">Status</th>
                                <th className="px-5 py-3 text-right">Method</th>
                                <th className="px-5 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx: any) => (
                                <tr key={tx.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-300">{tx.id}</td>
                                    <td className="py-4 px-6 text-slate-900 dark:text-white font-medium">{tx.buyer_name}</td>
                                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">{tx.event_name}</td>
                                    <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white">{formatCurrency(tx.total_amount)}</td>
                                    <td className="py-4 px-6 text-center"><StatusBadge status={tx.payment_status} /></td>
                                    <td className="py-4 px-6 text-right text-slate-400 dark:text-slate-400 text-xs font-semibold">{tx.payment_method || 'N/A'}</td>
                                    <td className="py-4 px-6 text-right text-slate-500 dark:text-slate-500 text-xs">{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
