import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="gradient-bg flex min-h-screen flex-col items-center justify-center p-6 selection:bg-primary-500/30">
            {/* Ambient Background Glows */}
            <div className="glow bg-primary-500 w-[400px] h-[400px] -top-20 -left-20" />
            <div className="glow bg-secondary-500 w-[300px] h-[300px] -bottom-20 -right-20" />
            
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="group flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
                    <div className="relative h-12 w-12 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/40">
                        <span className="text-2xl font-black text-white">E</span>
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-white">
                        EVENT<span className="gradient-text">HIVE</span>
                    </span>
                </Link>
            </div>

            <div className="auth-card">
                {/* Subtle top light effect */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
                
                {children}
            </div>
            
            <p className="mt-8 text-sm text-slate-500 text-center">
                &copy; {new Date().getFullYear()} EventHive. Premium Event Platform.
            </p>
        </div>
    );
}
