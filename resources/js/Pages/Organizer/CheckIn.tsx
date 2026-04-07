import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function ResultBadge({ type, text }: { type: 'success' | 'error', text: string }) {
    return (
        <div className={`p-4 rounded-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
            : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
        }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                {type === 'success' ? (
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
            </div>
            <div>
                <h4 className="font-black uppercase text-xs tracking-widest mb-0.5">{type === 'success' ? 'Access Granted' : 'Access Denied'}</h4>
                <p className="text-sm font-medium opacity-90">{text}</p>
            </div>
        </div>
    );
}

export default function CheckIn({ history, stats }: any) {
    const { flash, errors: pageErrors } = usePage().props as any;
    const { data, setData, post, processing, reset, errors } = useForm({ code: '' });
    const [result, setResult] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    // Scanner Control States
    const [isScanning, setIsScanning] = useState(false);
    const [scanMode, setScanMode] = useState<'camera' | 'file'>('camera');
    const [scannerLoaded, setScannerLoaded] = useState(false);
    const qrRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (flash?.success) {
            setResult({ type: 'success', text: flash.success });
            reset('code');
            if (qrRef.current && isScanning) {
                // Keep scanning
            }
        } else if (flash?.error || pageErrors?.code) {
            setResult({ type: 'error', text: flash?.error || pageErrors?.code });
        }
    }, [flash, pageErrors]);

    // Initialize/Destroy Scanner instance
    useEffect(() => {
        qrRef.current = new Html5Qrcode("qr-reader");
        setScannerLoaded(true);
        return () => {
            if (qrRef.current?.isScanning) {
                qrRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const toggleCamera = async () => {
        if (!qrRef.current) return;

        if (isScanning) {
            await qrRef.current.stop();
            setIsScanning(false);
        } else {
            setScanMode('camera');
            try {
                await qrRef.current.start(
                    { facingMode: "environment" },
                    { fps: 15, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        handleScanSuccess(decodedText);
                    },
                    () => {}
                );
                setIsScanning(true);
            } catch (err) {
                console.error("Camera access error:", err);
                setResult({ type: 'error', text: "Cannot access camera. Please check permissions." });
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !qrRef.current) return;

        try {
            const decodedText = await qrRef.current.scanFile(file, true);
            handleScanSuccess(decodedText);
        } catch (err) {
            setResult({ type: 'error', text: "No valid QR code found in this image." });
        }
    };

    const handleScanSuccess = (text: string) => {
        setData('code', text);
        // Using a ref or timeout to trigger form submit to avoid state staleness issues in rapid scans
        setTimeout(() => {
            const form = document.getElementById('checkin-form') as HTMLFormElement;
            form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 100);
    };

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

            <style dangerouslySetInnerHTML={{ __html: `
                #qr-reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    border-radius: 2rem !important;
                }
            ` }} />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        Gate Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 ml-1">Real-time ticket validation system for all your events.</p>
                </div>
                
                <div className="hidden md:flex gap-4">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">System Online</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scanner Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl">
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Validation Scanner</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">Use camera or upload a ticket capture.</p>
                            </div>
                            
                            {/* Mode Toggle Switch */}
                            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                                <button 
                                    onClick={() => { if(isScanning) toggleCamera(); setScanMode('camera'); }}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${scanMode === 'camera' ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Camera
                                </button>
                                <button 
                                    onClick={() => { if(isScanning) toggleCamera(); setScanMode('file'); }}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${scanMode === 'file' ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                        
                        <div className="px-8 pb-8 space-y-6">
                            <div className="aspect-square max-w-sm mx-auto bg-slate-50 dark:bg-black/40 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative group transition-all duration-500 hover:border-primary-500/30">
                                
                                {/* Video Surface */}
                                <div id="qr-reader" className={`w-full h-full scale-110 ${scanMode === 'camera' ? 'block' : 'hidden'}`} />
                                
                                {/* File Upload UI */}
                                {scanMode === 'file' && (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex flex-col items-center justify-center p-8 cursor-pointer bg-slate-50 dark:bg-transparent"
                                    >
                                        <div className="w-20 h-20 bg-primary-500/10 rounded-3xl flex items-center justify-center text-primary-500 mb-4 group-hover:scale-110 transition-transform">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-white">Choose or Drop Image</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Formats: JPG, PNG, WEBP</p>
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                )}

                                {/* Camera Start/Stop Overlay */}
                                {scanMode === 'camera' && !isScanning && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in">
                                        <button 
                                            onClick={toggleCamera}
                                            className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl text-primary-600 hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </button>
                                        <p className="mt-6 text-white text-xs font-black uppercase tracking-widest animate-pulse">Start Scanner</p>
                                    </div>
                                )}

                                {/* Stop Button (Floating while scanning) */}
                                {isScanning && (
                                    <button 
                                        onClick={toggleCamera}
                                        className="absolute bottom-6 right-6 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-500 transition-colors z-10"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}

                                <div className="absolute inset-0 border-8 border-primary-500/10 rounded-[2.5rem] pointer-events-none group-hover:border-primary-500/20 transition-all" />
                            </div>

                            {result && <ResultBadge type={result.type} text={result.text} />}

                            <form id="checkin-form" onSubmit={submit} className="flex gap-3">
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono uppercase tracking-widest py-4 px-6 focus:ring-primary-500 focus:border-primary-500 placeholder:text-slate-400"
                                    placeholder="OR ENTER TICKET CODE MANUALLY..."
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-black px-8 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                                >
                                    {processing ? '...' : 'VALIDATE'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Check-in Progress</p>
                            <div className="flex items-end justify-between mb-2">
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stats.checked_in} <span className="text-slate-400 dark:text-slate-500 text-sm italic">/ {stats.total_sold}</span></h4>
                                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">{Math.round((stats.checked_in / (stats.total_sold || 1)) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.checked_in / (stats.total_sold || 1)) * 100}%` }} />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Gate Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-slate-900 dark:text-white font-bold uppercase tracking-tight">Gate Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Sidebar */}
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 h-fit max-h-[800px] flex flex-col shadow-sm dark:shadow-2xl">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Scan History</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">Latest gate activity today.</p>
                    
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {history.map((log: any) => (
                            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{log.time}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                        log.result === 'Valid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    }`}>
                                        {log.result}
                                    </span>
                                </div>
                                <h5 className="text-slate-900 dark:text-white text-sm font-bold truncate">{log.event_name}</h5>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{log.ticket_type} • {log.ticket_id}</p>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-slate-400 dark:text-slate-500 text-sm">No scan activity yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
