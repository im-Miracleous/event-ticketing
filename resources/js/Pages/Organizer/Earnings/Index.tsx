import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';

export default function EarningsIndex({ auth, ledger, events, filters, summary }: any) {
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            route('organizer.earnings.index'),
            { event_id: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <DashboardLayout>
            <Head title="Laporan Pendapatan" />

            <div className="flex flex-col md:flex-row md:items-center justify-between xl:mb-8 mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transparansi Laporan Pendapatan</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Sistem mencatat setiap transaksi valid dari penjualan tiket Anda secara terperinci.
                    </p>
                </div>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg shadow-emerald-900/20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium mb-1">Total Pendapatan Terkumpul</p>
                        <h2 className="text-4xl font-black mb-2">{formatCurrency(summary.totalEarnings)}</h2>
                        <p className="text-sm text-emerald-200">Berdasarkan filter event aktif.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Transaksi Valid (Sukses)</p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalTransactions.toLocaleString('id-ID')}</h2>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter Event:</label>
                    <select
                        value={filters.event_id || ''}
                        onChange={handleFilterChange}
                        className="rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-emerald-500 focus:ring-emerald-500 min-w-[200px]"
                    >
                        <option value="">Semua Event</option>
                        {events.map((event: any) => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">KODE TRX</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">PEMBELI</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">NAMA EVENT</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">METODE BAYAR</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">WAKTU TRANSAKSI</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white text-right">NOMINAL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {ledger.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada pencatatan transaksi masuk.
                                    </td>
                                </tr>
                            ) : (
                                ledger.data.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-mono text-xs rounded-md border border-slate-200 dark:border-white/10">
                                                {tx.id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-slate-900 dark:text-white font-bold">{tx.buyer_name}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{tx.buyer_email}</p>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                                            {tx.event_name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold rounded-lg text-xs tracking-wider border border-purple-500/20">
                                                {tx.payment_method.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
                                            {new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-4 px-6 text-slate-900 dark:text-white font-bold text-right text-lg">
                                            {formatCurrency(tx.total_amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {ledger.links && ledger.links.length > 3 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-navy-900/50">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">Previous</button>
                            <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">Next</button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-400">
                                    Daftar transaksi <span className="font-bold text-emerald-600 dark:text-emerald-400">{ledger.data.length}</span> dari total <span className="font-bold text-emerald-600 dark:text-emerald-400">{ledger.total}</span> audit masuk.
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {ledger.links.map((link: any, index: number) => {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-emerald-600 border-emerald-500 text-white'
                                                        : 'bg-white dark:bg-navy-800 border-slate-300 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
