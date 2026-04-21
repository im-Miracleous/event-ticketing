import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function TunnelHealthBanner() {
    const { tunnel_status } = usePage().props as any;
    const [isChecking, setIsChecking] = useState(false);
    const [isReachable, setIsReachable] = useState<boolean | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Initial and periodic health check
    useEffect(() => {
        if (!tunnel_status || !tunnel_status.is_ngrok) return;

        const checkTunnel = () => {
            // If we are already on the tunnel, we know it's reachable
            if (tunnel_status.is_matching) {
                setIsReachable(true);
                return;
            }

            setIsChecking(true);
            
            // We use an Image object to probe the tunnel. 
            // If the tunnel is down, ngrok returns an HTML error page (ERR_NGROK_3200).
            // An Image tag will trigger onError if it receives HTML instead of image data.
            const img = new Image();
            
            // Add a cache-buster to ensure we aren't seeing a cached result
            const probeUrl = `${tunnel_status.configured_url}/favicon.ico?cb=${Date.now()}`;
            
            img.onload = () => {
                setIsReachable(true);
                setIsChecking(false);
            };
            
            img.onerror = () => {
                setIsReachable(false);
                setIsChecking(false);
            };
            
            img.src = probeUrl;
        };

        checkTunnel();
        const interval = setInterval(checkTunnel, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [tunnel_status]);

    // Hide the banner if:
    // 1. Not in localized development
    // 2. Not using ngrok
    // 3. User manually dismissed it
    // 4. We are already on the tunnel URL
    // 5. The tunnel is detected as ONLINE (reachable)
    if (!tunnel_status || !tunnel_status.is_ngrok || !isVisible || tunnel_status.is_matching || (isReachable === true)) {
        return null;
    }

    return (
        <div className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-3 text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl sticky top-0 z-[100] border-b border-amber-400 transition-all duration-500 animate-in slide-in-from-top">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                    {isReachable === false ? '❌' : '🔌'}
                </div>
                <div>
                    <p className="leading-tight flex items-center gap-2 text-sm sm:text-base">
                        Tunnel Configuration Mismatch 
                        {isChecking && <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                    </p>
                    <p className="text-[10px] sm:text-xs opacity-90 font-medium font-mono">
                        Config: {tunnel_status.configured_url} | Current: {tunnel_status.current_host}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${isReachable === false ? 'bg-red-500/30' : 'bg-black/20'}`}>
                    <span className="opacity-70">Tunnel:</span>
                    <span className={isReachable === false ? 'text-red-100 animate-pulse' : 'text-white'}>
                        {isReachable === false ? 'OFFLINE' : (isChecking ? 'Checking...' : 'Initializing...')}
                    </span>
                </div>
                
                <a 
                    href={tunnel_status.configured_url} 
                    className="bg-white text-amber-600 px-4 py-1.5 rounded-lg hover:bg-slate-100 transition-all shadow-sm active:scale-95 font-black shrink-0"
                >
                    Switch to Tunnel
                </a>
                
                <button 
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                    title="Dismiss"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
