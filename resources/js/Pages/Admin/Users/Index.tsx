import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { UserRole } from '@/config/navigation';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface UserItem {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joinedAt: string;
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    filters: {
        role?: string;
        search?: string;
        per_page?: number;
        sort?: string;
        direction?: 'asc' | 'desc';
        registered_from?: string;
        registered_to?: string;
        user_status?: string;
    };
}

const roleFilters = ['All', 'Root', 'Admin', 'Organizer', 'User'];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminUsers({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const activeFilter = filters.role || 'All';

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterRegFrom, setFilterRegFrom] = useState(filters.registered_from || '');
    const [filterRegTo, setFilterRegTo] = useState(filters.registered_to || '');
    const [filterUserStatus, setFilterUserStatus] = useState(filters.user_status || '');

    // Read the mock role from localStorage to hide Root users when viewed as Admin
    const [activeRole, setActiveRole] = useState<UserRole>('admin');
    useEffect(() => {
        const saved = localStorage.getItem('mock_role');
        if (saved === 'root' || saved === 'admin' || saved === 'organizer' || saved === 'user') {
            setActiveRole(saved as UserRole);
        }

        const handleRoleChange = () => {
            const role = localStorage.getItem('mock_role');
            if (role === 'root' || role === 'admin' || role === 'organizer' || role === 'user') {
                setActiveRole(role as UserRole);
            }
        };
        window.addEventListener('storage', handleRoleChange);
        window.addEventListener('mock_role_changed', handleRoleChange);
        return () => {
            window.removeEventListener('storage', handleRoleChange);
            window.removeEventListener('mock_role_changed', handleRoleChange);
        };
    }, []);

    // Also hide Root from the filter chips when not Root
    const visibleRoleFilters = activeRole === 'root' ? roleFilters : roleFilters.filter((f) => f !== 'Root');

    // Filter out Root users client-side when not Root
    const visibleUsers = activeRole === 'root' ? users.data : users.data.filter(u => u.role !== 'Root');

    /* ── Param builder ────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            role: activeFilter === 'All' ? undefined : activeFilter,
            search: search || undefined,
            per_page: users.per_page,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            registered_from: filterRegFrom || undefined,
            registered_to: filterRegTo || undefined,
            user_status: filterUserStatus || undefined,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    /* ── Handlers ─────────────────────────────────────────────────── */

    const handleFilterChange = (filter: string) => {
        router.get(route('admin.users.index'), buildParams({
            role: filter === 'All' ? undefined : filter,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.users.index'), buildParams({
            search: value || undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('admin.users.index'), buildParams({
            sort: column,
            direction: dir,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.users.index'), buildParams({ page }), {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.users.index'), buildParams({
            per_page: value,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const handleStatusUpdate = (userId: string, status: string) => {
        router.patch(route('admin.users.updateStatus', { id: userId }), { status }, {
            preserveState: true,
        });
    };

    /* ── Advanced filter actions ──────────────────────────────────── */

    const activeAdvancedFilterCount = [filterRegFrom, filterRegTo, filterUserStatus].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('admin.users.index'), buildParams({ page: undefined }), {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setFilterRegFrom('');
        setFilterRegTo('');
        setFilterUserStatus('');
        router.get(route('admin.users.index'), buildParams({
            registered_from: undefined,
            registered_to: undefined,
            user_status: undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    /* ── Color helpers ────────────────────────────────────────────── */

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
            case 'Active':    return 'text-emerald-500 dark:text-emerald-400';
            case 'Suspended': return 'text-amber-500 dark:text-amber-400';
            case 'Banned':    return 'text-red-500 dark:text-red-400';
            default:          return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title="User Management" />

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    View and manage all accounts registered on the platform.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>

                {/* Role Filter Pills */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    {visibleRoleFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                                activeFilter === filter
                                    ? 'bg-white dark:bg-primary-600 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Advanced Filter */}
                <AdvancedFilter
                    activeCount={activeAdvancedFilterCount}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                >
                    <FilterField label="Registration Date Range">
                        <FilterDateRange
                            from={filterRegFrom}
                            to={filterRegTo}
                            onFromChange={setFilterRegFrom}
                            onToChange={setFilterRegTo}
                        />
                    </FilterField>
                    <FilterField label="Account Status">
                        <FilterSelect
                            value={filterUserStatus}
                            onChange={setFilterUserStatus}
                            options={[
                                { label: 'Active', value: 'Active' },
                                { label: 'Suspended', value: 'Suspended' },
                                { label: 'Banned', value: 'Banned' },
                            ]}
                            placeholder="All Statuses"
                        />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="User" column="name" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Role" column="role" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Joined" column="joinedAt" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {visibleUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-600/20 flex items-center justify-center ring-1 ring-primary-300 dark:ring-primary-500/30 shrink-0">
                                                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${roleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`h-2 w-2 rounded-full ${
                                                user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Suspended' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                            <span className={`text-sm font-medium ${statusColor(user.status)}`}>{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{user.joinedAt}</td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mr-3">
                                            View
                                        </button>
                                        {user.role !== 'Root' && (
                                            <button
                                                onClick={() => handleStatusUpdate(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
                                                className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                            >
                                                {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {visibleUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={users.current_page}
                    totalItems={users.total}
                    perPage={users.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </DashboardLayout>
    );
}
