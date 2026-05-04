import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

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

export default function CheckIn({ history, stats, events, filters }: any) {
    const { flash, errors: pageErrors } = usePage().props as any;
    const { data, setData, post, processing, reset, errors } = useForm({ code: '' });
    const [result, setResult] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    // Scanner Control States
    const [isScanning, setIsScanning] = useState(false);
    const [scanMode, setScanMode] = useState<'camera' | 'file'>('camera');
    const [scannerLoaded, setScannerLoaded] = useState(false);
    const qrRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLocked, setIsLocked] = useState(false);
    const lastScanRef = useRef<{ code: string; time: number } | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Verification Modal State
    const [pendingTicket, setPendingTicket] = useState<any>(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

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

    const handleScanSuccess = async (text: string) => {
        const now = Date.now();

        // Prevent overlapping requests or scanning while modal is up
        if (isLocked || processing || showVerifyModal || isVerifying) return;

        // Prevent immediate re-scan of the SAME code (3s cooldown)
        if (lastScanRef.current?.code === text && now - lastScanRef.current.time < 3000) {
            return;
        }

        setIsLocked(true);
        lastScanRef.current = { code: text, time: now };
        
        setData('code', text);
        setResult(null);
        setIsVerifying(true);

        try {
            const response = await axios.post(route('organizer.check-in.verify'), { code: text });
            setPendingTicket(response.data.ticket);
            setShowVerifyModal(true);
        } catch (err: any) {
            setResult({ 
                type: 'error', 
                text: err.response?.data?.error || "This ticket could not be verified. Please check the code." 
            });
            reset('code');
        } finally {
            setIsVerifying(false);
            // Small delay to prevent accidental multi-scan after error
            setTimeout(() => setIsLocked(false), 800);
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.code || processing || isVerifying) return;
        handleScanSuccess(data.code);
    };

    const confirmCheckIn = () => {
        if (!pendingTicket || processing) return;

        router.post(route('organizer.check-in.store'), { code: pendingTicket.id }, {
            preserveState: true,
            onStart: () => setIsVerifying(true),
            onFinish: () => setIsVerifying(false),
            onSuccess: () => {
                setShowVerifyModal(false);
                setPendingTicket(null);
                reset('code');
            },
            onError: () => {
                setShowVerifyModal(false);
                setPendingTicket(null);
            }
        });
    };
    // Close filter popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        // Remove empty filters
        if (!value) delete newFilters[key];
        
        router.get(route('organizer.check-in.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleResetFilters = () => {
        router.get(route('organizer.check-in.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
        setShowFilters(false);
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, filters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
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

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gate Management</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time ticket validation system for all your events.</p>
                    </div>
                </div>
                
                <div className="hidden md:flex gap-4">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 shadow-sm">
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
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 h-fit min-h-[600px] flex flex-col shadow-sm dark:shadow-2xl relative">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none mb-1">Scan History</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Activity</span>
                            </div>
                        </div>
                        
                        <div className="relative" ref={filterRef}>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    showFilters || Object.keys(filters).length > 0
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                                    : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                                }`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                <span>Filters</span>
                            </button>

                            {/* Advanced Filters Popup */}
                            {showFilters && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-navy-800 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Advanced Filters</h4>
                                    </div>
                                    
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Filter Event</label>
                                            <select 
                                                value={filters.event_id || ''} 
                                                onChange={(e) => handleFilterChange('event_id', e.target.value)}
                                                className="w-full text-xs font-bold bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl px-3 py-2.5 focus:ring-primary-500"
                                            >
                                                <option value="">All Events</option>
                                                {events.map((ev: any) => (
                                                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ticket Status</label>
                                            <select 
                                                value={filters.status || ''} 
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className="w-full text-xs font-bold bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl px-3 py-2.5 focus:ring-primary-500"
                                            >
                                                <option value="">All Statuses</option>
                                                <option value="Valid">Valid</option>
                                                <option value="Already Checked-In">Checked-In</option>
                                                <option value="Expired">Expired</option>
                                                <option value="Invalid">Invalid</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                        <button 
                                            onClick={handleResetFilters}
                                            className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            onClick={() => setShowFilters(false)}
                                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar mb-6">
                        {history.data.map((log: any) => (
                            <div key={log.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1 relative group transition-all hover:border-primary-500/30">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">{log.time}</span>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${
                                        log.result === 'Valid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    }`}>
                                        {log.result === 'Already Checked-In' ? 'ALREADY SCANNED' : log.result}
                                    </span>
                                </div>
                                <h5 className="text-slate-900 dark:text-white text-sm font-bold truncate pr-4">{log.event_name}</h5>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{log.ticket_type} • …{String(log.ticket_id).slice(-8)}</p>
                            </div>
                        ))}
                        {history.data.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">No matching logs</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                        <button 
                            onClick={() => handlePageChange(history.prev_page_url)}
                            disabled={!history.prev_page_url}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 disabled:opacity-30 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        
                        <div className="flex items-center gap-1.5 px-4 h-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                            <span className="text-[10px] font-black text-slate-900 dark:text-white">{history.current_page}</span>
                            <span className="text-[10px] font-black text-slate-400">/</span>
                            <span className="text-[10px] font-black text-slate-400">{history.last_page}</span>
                        </div>

                        <button 
                            onClick={() => handlePageChange(history.next_page_url)}
                            disabled={!history.next_page_url}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 disabled:opacity-30 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <Transition appear show={showVerifyModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowVerifyModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-navy-900 p-8 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-white/10 ring-1 ring-black/5">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 flex-shrink-0">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                                Ticket Verification
                                            </Dialog.Title>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review Information</p>
                                        </div>
                                    </div>

                                    {pendingTicket && (
                                        <div className="space-y-6">
                                            {/* Attendee Info Card */}
                                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                                                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-black">
                                                        {pendingTicket.attendee.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-none">{pendingTicket.attendee.name}</h4>
                                                        <p className="text-[11px] text-slate-400 font-medium mt-1">{pendingTicket.attendee.email}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket Type</p>
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{pendingTicket.type}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                                            pendingTicket.status === 'Valid' ? 'text-emerald-500' : 'text-red-500'
                                                        }`}>
                                                            {pendingTicket.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Event Summary */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-1.5 bg-primary-500 rounded-full" />
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Event Name</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{pendingTicket.event}</p>
                                                </div>
                                            </div>

                                            {pendingTicket.status !== 'Valid' && (
                                                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Warning: This ticket is marked as {pendingTicket.status.toLowerCase()}.</p>
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowVerifyModal(false)}
                                                    className="flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={pendingTicket.status !== 'Valid' || processing}
                                                    onClick={confirmCheckIn}
                                                    className="flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-primary-500/20"
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </DashboardLayout>
    );
}
