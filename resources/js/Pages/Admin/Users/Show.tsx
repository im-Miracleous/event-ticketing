import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

interface UserDetailProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
        joinedAt: string;
    };
    events: Array<{
        event_name: string;
        ticket_name: string;
        quantity: number;
        purchased_at: string;
    }>;
}

export default function UserShow({ user, events }: UserDetailProps) {
    const roleColor = (role: string) => {
        switch (role) {
            case 'Root':      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            case 'Admin':     return 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20';
            case 'Organizer': return 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20';
            case 'User':      return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            default:          return '';
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':    return 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500/20';
            case 'Suspended': return 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-500/20';
            case 'Banned':    return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 ring-1 ring-red-500/20';
            default:          return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title={`User Details - ${user.name}`} />

            <div className="mb-6">
                <Link
                    href={route('admin.users.index')}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to User Management
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm overflow-hidden">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-600/20 flex items-center justify-center ring-4 ring-white dark:ring-navy-900 mb-4 shrink-0 shadow-sm">
                                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{user.email}</p>
                            
                            <div className="flex items-center gap-3 mt-6 w-full px-4 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Role</p>
                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${roleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex-1 border-l border-slate-100 dark:border-white/5 pl-3">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Status</p>
                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm mt-6">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Registration Details</h3>
                        <dl className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-white/10 pb-4">
                                <dt className="text-slate-500 dark:text-slate-400">Account ID</dt>
                                <dd className="font-medium text-slate-900 dark:text-slate-200">{user.id.substring(0,8)}...</dd>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-white/10 pb-4">
                                <dt className="text-slate-500 dark:text-slate-400">Joined On</dt>
                                <dd className="font-medium text-slate-900 dark:text-slate-200">{user.joinedAt}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Event/Ticket History Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden h-full">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Events & Tickets</h3>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-white/5 py-1 px-3 rounded-full border border-slate-200 dark:border-white/10">
                                {events.length} Items
                            </span>
                        </div>
                        
                        <div className="p-0">
                            {events.length > 0 ? (
                                <ul className="divide-y divide-slate-100 dark:divide-white/5">
                                    {events.map((ev, index) => (
                                        <li key={index} className="p-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{ev.event_name}</h4>
                                                    <div className="flex items-center gap-2 mt-1 -ml-1">
                                                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-md">
                                                            {ev.ticket_name}
                                                        </span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            Qty: {ev.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                    Purchased: {ev.purchased_at}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-12 text-center flex flex-col items-center text-slate-500 dark:text-slate-400">
                                    <svg className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    <p className="text-sm">No ticket or event history found for this user.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
