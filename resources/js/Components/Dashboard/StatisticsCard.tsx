import { ReactNode } from 'react';

interface StatisticsCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    trend?: string;
    trendUp?: boolean;
}

export default function StatisticsCard({ title, value, icon, trend, trendUp = true }: StatisticsCardProps) {
    return (
        <div className="group relative rounded-2xl bg-white/[0.03] border border-white/5 p-5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-400 ring-1 ring-primary-500/10 group-hover:ring-primary-500/20 transition-all">
                    {icon}
                </div>
            </div>

            {trend && (
                <div className="mt-3 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        <svg className={`w-3.5 h-3.5 ${trendUp ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                        {trend}
                    </span>
                    <span className="text-xs text-slate-500">from last month</span>
                </div>
            )}
        </div>
    );
}
