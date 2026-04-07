import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function ResultBadge({ type, text }: { type: 'success' | 'error', text: string }) {
    return (
        <div className={`p-4 rounded-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
            </div>
            <div>
                <h4 className="font-black uppercase text-xs tracking-widest mb-0.5">{type === 'success' ? 'Akses Diberikan' : 'Akses Ditolak'}</h4>
                <p className="text-sm font-medium opacity-90">{text}</p>
            </div>
        </div>
    );
}

export default function CheckIn({ history, stats }: any) {
    const { flash, errors: pageErrors } = usePage().props as any;
    const { data, setData, post, processing, reset, errors } = useForm({ code: '' });
    const [result, setResult] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setResult({ type: 'success', text: flash.success });
            reset('code');
        } else if (flash?.error || pageErrors?.code) {
            setResult({ type: 'error', text: flash?.error || pageErrors?.code });
        }
    }, [flash, pageErrors]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
        scanner.render((text) => {
            if (!processing) {
                setData('code', text);
                document.getElementById('checkin-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }, () => {});
        return () => {
            scanner.clear().catch(() => {});
        };
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.code || processing) return;
        post(route('organizer.check-in.store'), {
            preserveState: true,
            onSuccess: () => reset('code'),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Gate Check-In" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Gate Management</h1>
                <p className="text-slate-400 text-sm mt-1">Sistem validasi tiket real-time untuk seluruh event Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scanner Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-navy-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 pb-4">
                            <h3 className="text-lg font-bold text-white mb-1">Scanner Validasi</h3>
                            <p className="text-xs text-slate-500 font-medium">Scan QR Code atau input ID tiket secara manual.</p>
                        </div>
                        
                        <div className="px-8 pb-8 space-y-6">
                            <div className="aspect-square max-w-sm mx-auto bg-black/40 rounded-2xl border-4 border-dashed border-white/10 overflow-hidden relative group">
                                <div id="qr-reader" className="w-full h-full scale-110" />
                                <div className="absolute inset-0 border-2 border-primary-500/50 rounded-2xl pointer-events-none animate-pulse" />
                            </div>

                            {result && <ResultBadge type={result.type} text={result.text} />}

                            <form id="checkin-form" onSubmit={submit} className="flex gap-3">
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    className="flex-1 bg-white/5 border-white/10 rounded-xl text-white font-mono uppercase tracking-widest py-4 px-6 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="INPUT KODE TIKET..."
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-black px-8 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                                >
                                    {processing ? '...' : 'VALIDASI'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-navy-900 border border-white/5 p-6 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Check-in Progress</p>
                            <div className="flex items-end justify-between mb-2">
                                <h4 className="text-2xl font-black text-white">{stats.checked_in} <span className="text-slate-500 text-sm italic">/ {stats.total_sold}</span></h4>
                                <span className="text-primary-400 font-bold text-sm">{Math.round((stats.checked_in / (stats.total_sold || 1)) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.checked_in / (stats.total_sold || 1)) * 100}%` }} />
                            </div>
                        </div>
                        <div className="bg-navy-900 border border-white/5 p-6 rounded-2xl flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Gate</p>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-white font-bold">ONLINE & ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Sidebar */}
                <div className="bg-navy-900 border border-white/5 rounded-3xl p-6 h-fit max-h-[800px] flex flex-col shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-1">Scan History</h3>
                    <p className="text-xs text-slate-500 font-medium mb-6">Aktivitas gate terbaru hari ini.</p>
                    
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {history.map((log: any) => (
                            <div key={log.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-mono text-slate-500">{log.time}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                        log.result === 'Valid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                        {log.result}
                                    </span>
                                </div>
                                <h5 className="text-white text-sm font-bold truncate">{log.event_name}</h5>
                                <p className="text-[10px] text-slate-400 font-medium">{log.ticket_type} • ID: {log.ticket_id}</p>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-sm">Belum ada aktivitas scan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
