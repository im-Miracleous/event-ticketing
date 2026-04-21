import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Module-level variables to persist state across Inertia navigations
let cachedReachable: boolean | null = null;
let cachedProcessStatus: any = null;

export default function TunnelStatusIndicator() {
    const { tunnel_status: initialStatus } = usePage().props as any;
    const [status, setStatus] = useState<any>(cachedProcessStatus || initialStatus);
    const [isChecking, setIsChecking] = useState(false);
    const [isReachable, setIsReachable] = useState<boolean | null>(cachedReachable);

    useEffect(() => {
        if (!status || !status.is_ngrok) return;

        const checkTunnel = async () => {
            setIsChecking(true);

            try {
                // 1. Check Backend Status (Live without refresh)
                const response = await fetch('/_dev/tunnel-status');
                if (response.ok) {
                    const newStatus = await response.json();
                    setStatus(newStatus);
                    cachedProcessStatus = newStatus;
                }

                // 2. Check Frontend Reachability (Image probe)
                if (status.is_matching) {
                    setIsReachable(true);
                    cachedReachable = true;
                } else {
                    await new Promise((resolve, reject) => {
                        const img = new Image();
                        const timeoutId = setTimeout(() => reject(new Error('Timeout')), 3000);
                        img.onload = () => { clearTimeout(timeoutId); resolve(true); };
                        img.onerror = () => { clearTimeout(timeoutId); reject(new Error('Load Error')); };
                        img.src = `${status.configured_url}/favicon.ico?cb=${Date.now()}`;
                    });
                    setIsReachable(true);
                    cachedReachable = true;
                }
            } catch (error) {
                setIsReachable(false);
                cachedReachable = false;
            } finally {
                setIsChecking(false);
            }
        };

        checkTunnel();
        const interval = setInterval(checkTunnel, 5000); // Poll every 5 seconds for live updates
        return () => clearInterval(interval);
    }, [status?.configured_url, status?.is_matching]);

    // Only show in development and if it's an ngrok project
    if (!status || !status.is_ngrok) return null;

    const isProcessRunning = status.process_running;
    const isOnline = isReachable === true;
    const isMatching = status.is_matching;
    
    const isBlocked = isMatching && isReachable === false && isProcessRunning;
    const isReady = !isMatching && isProcessRunning; 
    const isOffline = !isProcessRunning;

    return (
        <div 
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-300 ${
                isMatching && isOnline 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                    : (isReady 
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/5' 
                        : (isBlocked 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse'
                            : (isOffline 
                                ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
                                : 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400')))
            }`}
            title={
                isMatching && isOnline ? 'You are on the live tunnel' : 
                (isReady ? `Tunnel is RUNNING at ${status.configured_url}. Webhooks will work.` : 
                (isBlocked ? 'Tunnel is blocked by warning page. Click to bypass.' : 
                'Tunnel is OFFLINE'))
            }
        >
            <div className={`relative flex h-2 w-2`}>
                {isChecking && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isMatching && isOnline ? 'bg-emerald-500' : (isReady ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : (isBlocked ? 'bg-amber-500' : (isOffline ? 'bg-red-500' : 'bg-slate-400 animate-pulse')))
                }`}></span>
            </div>
            
            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
                {isMatching && isOnline ? 'Tunnel Live' : (isReady ? 'Tunnel Ready' : (isBlocked ? 'Action Req.' : (isOffline ? 'Tunnel Off' : 'Checking')))}
            </span>

            {((!isMatching && isProcessRunning) || isBlocked) && (
                <a 
                    href={status.configured_url}
                    target="_blank"
                    className={`ml-1 p-1 rounded transition-colors ${isBlocked ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-600' : 'bg-blue-500/20 hover:bg-blue-500/40 text-blue-600'}`}
                    title={isBlocked ? 'Click to bypass ngrok warning' : 'Visit Tunnel URL'}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </a>
            )}
        </div>
    );
}
