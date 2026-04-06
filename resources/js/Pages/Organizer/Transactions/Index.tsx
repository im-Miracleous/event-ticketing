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
            <Head title="Monitor Transaksi" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Monitor Transaksi</h1>
                <p className="text-sm text-slate-400 mt-1">Daftar lengkap semua transaksi tiket dari seluruh event Anda.</p>
            </div>

            <div className="bg-navy-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/[0.03] text-slate-400 border-b border-white/5">
                                <th className="text-left py-4 px-6 uppercase text-[10px] font-black tracking-widest">ID Transaksi</th>
                                <th className="text-left py-4 px-6 uppercase text-[10px] font-black tracking-widest">Pembeli</th>
                                <th className="text-left py-4 px-6 uppercase text-[10px] font-black tracking-widest">Nama Event</th>
                                <th className="text-right py-4 px-6 uppercase text-[10px] font-black tracking-widest">Jumlah Bayar</th>
                                <th className="text-center py-4 px-6 uppercase text-[10px] font-black tracking-widest">Status</th>
                                <th className="text-right py-4 px-6 uppercase text-[10px] font-black tracking-widest">Metode</th>
                                <th className="text-right py-4 px-6 uppercase text-[10px] font-black tracking-widest">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx: any) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-6 font-mono text-xs text-slate-300">{tx.id}</td>
                                    <td className="py-4 px-6 text-white font-medium">{tx.buyer_name}</td>
                                    <td className="py-4 px-6 text-slate-300 font-medium truncate max-w-[200px]">{tx.event_name}</td>
                                    <td className="py-4 px-6 text-right font-black text-white">{formatCurrency(tx.total_amount)}</td>
                                    <td className="py-4 px-6 text-center"><StatusBadge status={tx.payment_status} /></td>
                                    <td className="py-4 px-6 text-right text-slate-400 text-xs font-semibold">{tx.payment_method || 'N/A'}</td>
                                    <td className="py-4 px-6 text-right text-slate-500 text-xs">{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
