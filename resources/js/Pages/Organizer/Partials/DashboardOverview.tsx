import React from 'react';
import { 
    CalendarCheck, 
    Ticket, 
    DollarSign, 
    Users, 
    TrendingUp, 
    DownloadCloud, 
    PlusCircle 
} from 'lucide-react';

// Kamus Lokal
// - formatCurrency: Fungsi untuk memformat angka menjadi mata uang IDR
// - MetricCard: Komponen kecil untuk menampilkan kotak statistik
// - onViewChange: Callback prop untuk mengubah tampilan aktif (misal ke 'create-event')

export default function DashboardOverview({ onViewChange }: { onViewChange: (view: string) => void }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Organizer Dashboard</h1>
                    <p className="text-slate-500 mt-1">Sistem menampilkan ringkasan performa event Anda saat ini.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-navy-800 transition-all shadow-sm">
                        <DownloadCloud className="w-4 h-4" /> Export Report
                    </button>
                    <button 
                        onClick={() => onViewChange('create-event')}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
                    >
                        <PlusCircle className="w-4 h-4" /> Create New Event
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Event Aktif</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">12</h3>
                        </div>
                        <div className="p-3 bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-xl">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Tiket Terjual</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">1,500</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Ticket className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" /> +12.5% <span className="text-slate-400 ml-1 font-normal">bulan lalu</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Pendapatan</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(182500000)}</h3>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" /> +8.2% <span className="text-slate-400 ml-1 font-normal">bulan lalu</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Peserta Baru</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">420</h3>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" /> +24% <span className="text-slate-400 ml-1 font-normal">bulan lalu</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
