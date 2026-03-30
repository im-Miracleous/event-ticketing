import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function CheckIn() {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, reset, errors } = useForm({
        code: ''
    });

    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlertMessage({ type: 'success', text: flash.success });
        } else if (errors?.code) {
            setAlertMessage({ type: 'error', text: errors.code });
        }
    }, [flash, errors]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', {
            qrbox: { width: 250, height: 250 },
            fps: 5,
        }, false);

        scanner.render(
            (text: string) => {
                setData('code', text);
            },
            (err: unknown) => {
                // ignore scanning errors
            }
        );

        return () => {
            scanner.clear().catch(console.error);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setAlertMessage(null); // Clear previous messages
        post(route('organizer.check-in.store'), {
            onSuccess: () => reset('code'),
            preserveState: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title="Check-In Peserta" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Event Check-In</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scan or enter ticket codes to validate attendees.</p>
            </div>

            <div className="max-w-xl mx-auto mt-12">
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-xl shadow-blue-500/5 rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 bg-blue-600 dark:bg-blue-600 text-center">
                        <div className="w-16 h-16 bg-navy-900/10 dark:bg-navy-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12V4a2 2 0 012-2h12a2 2 0 012 2v8" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Scan / Input Kode</h2>
                        <p className="text-blue-50 dark:text-blue-100 text-sm mt-1">Masukkan ID Tiket atau Scan Barcode pengunjung</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-navy-950/40 border-b border-slate-100 dark:border-white/5">
                        <div id="qr-reader" className="w-full max-w-sm mx-auto overflow-hidden text-slate-600 dark:text-white"></div>
                    </div>

                    <div className="p-8 pb-10 space-y-6">
                        {alertMessage && (
                            <div className={`p-4 rounded-xl flex items-start space-x-3 mb-6 ${alertMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {alertMessage.type === 'success' ? (
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ) : (
                                    <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                                <div>
                                    <h4 className={`font-bold ${alertMessage.type === 'success' ? 'text-emerald-900' : 'text-red-900'}`}>
                                        {alertMessage.type === 'success' ? 'Akses Diberikan' : 'Akses Ditolak'}
                                    </h4>
                                    <p className="text-sm mt-1">{alertMessage.text}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 dark:text-slate-300 mb-2">Kode Tiket (Booking Code)</label>
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-bold text-center uppercase tracking-widest transition-all text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="XXXX-YYYY-ZZZZ"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center uppercase tracking-wide"
                            >
                                {processing ? 'Memvalidasi...' : 'VALIDASI TIKET'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm font-medium text-slate-500">
                    Sistem validasi Goers Experience Manager
                </div>
            </div>
        </DashboardLayout>
    );
}
