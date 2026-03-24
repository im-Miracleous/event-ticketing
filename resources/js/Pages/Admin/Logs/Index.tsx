import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const logs = [
    { id: 1,  type: 'ticket_scan',  description: 'Ticket #TKT-0412 scanned successfully',                         user: 'Staff Gate A',      ip: '192.168.1.42',   timestamp: 'Mar 24, 2026 07:45:12' },
    { id: 2,  type: 'ticket_scan',  description: 'Ticket #TKT-0398 — duplicate scan blocked',                     user: 'Staff Gate B',      ip: '192.168.1.43',   timestamp: 'Mar 24, 2026 07:42:01' },
    { id: 3,  type: 'login_fail',   description: 'Failed login attempt for admin@eventhive.com',                   user: 'Unknown',           ip: '103.47.132.210', timestamp: 'Mar 24, 2026 06:38:55' },
    { id: 4,  type: 'login_fail',   description: 'Failed login attempt for admin@eventhive.com',                   user: 'Unknown',           ip: '103.47.132.210', timestamp: 'Mar 24, 2026 06:38:32' },
    { id: 5,  type: 'login_fail',   description: 'Failed login attempt for admin@eventhive.com',                   user: 'Unknown',           ip: '103.47.132.210', timestamp: 'Mar 24, 2026 06:38:10' },
    { id: 6,  type: 'system',       description: 'Rate limiter triggered — IP 103.47.132.210 blocked for 15 min',  user: 'System',            ip: '—',              timestamp: 'Mar 24, 2026 06:38:56' },
    { id: 7,  type: 'ticket_scan',  description: 'Ticket #TKT-0350 scanned successfully',                         user: 'Staff Gate C',      ip: '192.168.1.44',   timestamp: 'Mar 23, 2026 18:22:09' },
    { id: 8,  type: 'system',       description: 'Scheduled backup completed — 142MB',                             user: 'System',            ip: '—',              timestamp: 'Mar 23, 2026 03:00:00' },
    { id: 9,  type: 'ticket_scan',  description: 'Ticket #TKT-0299 — invalid ticket rejected',                    user: 'Staff Gate A',      ip: '192.168.1.42',   timestamp: 'Mar 22, 2026 19:11:37' },
    { id: 10, type: 'login_fail',   description: 'Failed login for sarah@example.com — wrong password',            user: 'Sarah Johnson',     ip: '202.134.5.12',   timestamp: 'Mar 22, 2026 14:05:22' },
    { id: 11, type: 'ticket_scan',  description: 'Ticket #TKT-0275 scanned successfully',                         user: 'Staff Gate A',      ip: '192.168.1.42',   timestamp: 'Mar 22, 2026 10:05:44' },
    { id: 12, type: 'system',       description: 'App settings updated by root@eventhive.com',                     user: 'Super Admin',       ip: '10.0.0.1',       timestamp: 'Mar 21, 2026 22:30:00' },
    { id: 13, type: 'ticket_scan',  description: 'Ticket #TKT-0260 scanned successfully',                         user: 'Staff Gate B',      ip: '192.168.1.43',   timestamp: 'Mar 21, 2026 18:15:30' },
    { id: 14, type: 'login_fail',   description: 'Failed login for unknown_user@test.com — account not found',    user: 'Unknown',           ip: '45.76.200.11',   timestamp: 'Mar 21, 2026 12:02:18' },
    { id: 15, type: 'system',       description: 'Database maintenance completed — tables optimized',               user: 'System',            ip: '—',              timestamp: 'Mar 21, 2026 03:00:00' },
];

const typeFilters = ['All', 'ticket_scan', 'login_fail', 'system'];
const typeLabels: Record<string, string> = { All: 'All', ticket_scan: 'Ticket Scans', login_fail: 'Failed Logins', system: 'System' };

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminLogs() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const filteredLogs = logs.filter((l) => activeFilter === 'All' || l.type === activeFilter);
    const totalItems = filteredLogs.length;
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        setCurrentPage(1);
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
                        {typeLabels[filter]}
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
                            {paginatedLogs.map((log) => (
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
                            {paginatedLogs.length === 0 && (
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
                    currentPage={currentPage}
                    totalItems={totalItems}
                    perPage={perPage}
                    onPageChange={setCurrentPage}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </DashboardLayout>
    );
}
