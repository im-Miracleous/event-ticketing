import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }: any) {
    return (
        <DashboardLayout>
            <Head title="Organizer Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizer Dashboard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sistem menampilkan ringkasan performa event Anda saat ini.</p>
            </div>

            {/* Top Stat Cards (Like Screenshot 1) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Event Aktif */}
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-primary-500/30 transition-all cursor-pointer">
                    <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Total Event Aktif</p>
                        <h2 className="text-3xl font-black text-white">12</h2>
                    </div>
                    <div className="w-12 h-12 bg-primary-900/50 rounded-xl flex items-center justify-center text-primary-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                </div>
                
                {/* Total Tiket Terjual */}
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-blue-500/30 transition-all cursor-pointer">
                    <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Total Tiket Terjual</p>
                        <h2 className="text-3xl font-black text-white">1,500</h2>
                        <p className="text-xs text-emerald-400 mt-2 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> +12.5% bulan lalu</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                    </div>
                </div>

                {/* Total Pendapatan */}
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Total Pendapatan</p>
                        <h2 className="text-3xl font-black text-white">Rp 182.500.000</h2>
                        <p className="text-xs text-emerald-400 mt-2 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> +8.2% bulan lalu</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>

                {/* Peserta Baru */}
                <div className="bg-navy-900 border border-white/5 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-purple-500/30 transition-all cursor-pointer">
                    <div>
                        <p className="text-sm font-medium text-slate-400 mb-1">Peserta Baru</p>
                        <h2 className="text-3xl font-black text-white">420</h2>
                        <p className="text-xs text-emerald-400 mt-2 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> +24% bulan lalu</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center text-purple-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Link to Events */}
            <div className="bg-navy-900 border border-white/5 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-2xl font-bold text-white mb-2">Pantau Performa Penjualan</h2>
                    <p className="text-slate-400">Pusat kontrol untuk melihat statistik data penjualan, mengekspor laporan, dan grafik transaksi dari event-event Anda.</p>
                </div>
                <div className="relative z-10 w-full md:w-auto mt-6 md:mt-0 flex flex-col sm:flex-row gap-4">
                    <Link
                        href={route('organizer.events.index')}
                        className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-primary-500/25"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span>Lihat Data Penjualan</span>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
