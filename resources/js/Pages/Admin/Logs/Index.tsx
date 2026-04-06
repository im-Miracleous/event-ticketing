import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
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
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        date_from?: string;
        date_to?: string;
    };
}

const typeFilters = ['All', 'ticket_scan', 'system'];
const typeLabels: Record<string, string> = { All: 'All', ticket_scan: 'Ticket Scans', system: 'System' };

const typeOptions = [
    { label: 'Ticket Scans', value: 'ticket_scan' },
    { label: 'System', value: 'system' },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminLogs({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const activeTypeFilter = filters.type || 'All';

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');
    const [filterType, setFilterType] = useState(filters.type || '');

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            type: filterType || undefined,
            search: search || undefined,
            per_page: logs.per_page,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.validation.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('admin.validation.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.validation.index'), buildParams({ page }), { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.validation.index'), buildParams({ per_page: value, page: undefined }), { preserveState: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterDateFrom, filterDateTo, filterType].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('admin.validation.index'), buildParams({ page: undefined }), { preserveState: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterDateFrom('');
        setFilterDateTo('');
        setFilterType('');
        router.get(route('admin.validation.index'), buildParams({
            type: undefined,
            date_from: undefined,
            date_to: undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const typeColor = (type: string) => {
        switch (type) {
            case 'ticket_scan': return 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20';
            case 'system':      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            default:            return '';
        }
    };

    const typeBadge = (type: string) => {
        switch (type) {
            case 'ticket_scan': return 'Scan';
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

            {/* Toolbar: Search + AdvancedFilter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search logs…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>
                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Log Date Range">
                        <FilterDateRange from={filterDateFrom} to={filterDateTo} onFromChange={setFilterDateFrom} onToChange={setFilterDateTo} />
                    </FilterField>
                    <FilterField label="Log Type">
                        <FilterSelect value={filterType} onChange={setFilterType} options={typeOptions} placeholder="All Types" />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Logs Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="Type" column="type" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Description" column="description" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5">User / Source</th>
                                <th className="px-5 py-3.5">IP Address</th>
                                <SortableHeader label="Timestamp" column="timestamp" currentSort={sort} currentDirection={direction} onSort={handleSort} />
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
