import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface LogItem {
    id: number;
    type: string;
    description: string;
    user: string;
    ip: string;
    timestamp: string;
}

interface PaginatedLogs {
    data: LogItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    logs: PaginatedLogs;
    filters: {
        type?: string;
        per_page?: number;
    };
}

const typeFilters = ['All', 'ticket_scan', 'system'];
const typeLabels: Record<string, string> = { All: 'All', ticket_scan: 'Ticket Scans', login_fail: 'Failed Logins', system: 'System' };

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminLogs({ logs, filters }: Props) {
    const activeFilter = filters.type || 'All';

    const handleFilterChange = (filter: string) => {
        router.get(route('admin.validation.index'), {
            type: filter === 'All' ? undefined : filter,
            per_page: logs.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.validation.index'), {
            page,
            type: activeFilter === 'All' ? undefined : activeFilter,
            per_page: logs.per_page,
        }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.validation.index'), {
            type: activeFilter === 'All' ? undefined : activeFilter,
            per_page: value,
        }, { preserveState: true, replace: true });
    };

    const typeColor = (type: string) => {
        switch (type) {
            case 'ticket_scan': return 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20';
            case 'login_fail':  return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            case 'system':      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            default:            return '';
        }
    };

    const typeBadge = (type: string) => {
        switch (type) {
            case 'ticket_scan': return 'Scan';
            case 'login_fail':  return 'Auth';
            case 'system':      return 'System';
            default:            return type;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Validation Logs" />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Validation Logs</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Read-only audit trail of ticket scans, login attempts, and system events.
                </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 mb-6 w-fit">
                {typeFilters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                            activeFilter === filter
                                ? 'bg-white dark:bg-primary-600 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                        }`}
                    >
                        {typeLabels[filter] || filter}
                    </button>
                ))}
            </div>

            {/* Logs Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3.5">Type</th>
                                <th className="px-5 py-3.5">Description</th>
                                <th className="px-5 py-3.5">User / Source</th>
                                <th className="px-5 py-3.5">IP Address</th>
                                <th className="px-5 py-3.5">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${typeColor(log.type)}`}>
                                            {typeBadge(log.type)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 max-w-md truncate">{log.description}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.user}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{log.ip}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">{log.timestamp}</td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No logs found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={logs.current_page}
                    totalItems={logs.total}
                    perPage={logs.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </DashboardLayout>
    );
}
