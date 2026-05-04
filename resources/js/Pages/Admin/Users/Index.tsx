import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useState, useEffect, FormEventHandler } from 'react';
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
    authUser: {
        id: string;
        role: string;
    };
}

type ActionType = 'suspend' | 'ban' | 'reactivate' | 'delete';

const roleFilters = ['All', 'Root', 'Admin', 'Organizer', 'User'];

/* ─── Action Config ─────────────────────────────────────────────────── */

const actionConfig: Record<ActionType, {
    title: string;
    description: string;
    confirmLabel: string;
    iconColor: string;
    iconBgColor: string;
    buttonColor: string;
    hasReason: boolean;
    icon: JSX.Element;
}> = {
    suspend: {
        title: 'Suspend User',
        description: 'This will temporarily restrict the user\'s access to the platform. They will not be able to log in or purchase tickets while suspended.',
        confirmLabel: 'Suspend User',
        iconColor: 'text-amber-600 dark:text-amber-400',
        iconBgColor: 'bg-amber-100 dark:bg-amber-500/10',
        buttonColor: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        hasReason: true,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
        ),
    },
    ban: {
        title: 'Ban User',
        description: 'This will permanently ban the user from the platform. All their active tickets will be voided and the ticket stock will be restored. This action is irreversible unless manually unbanned by an Admin.',
        confirmLabel: 'Ban User',
        iconColor: 'text-red-600 dark:text-red-400',
        iconBgColor: 'bg-red-100 dark:bg-red-500/10',
        buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        hasReason: true,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
        ),
    },
    reactivate: {
        title: 'Reactivate User',
        description: 'This will restore the user\'s access to the platform.They will be able to log in and use all features normally again.',
        confirmLabel: 'Reactivate',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        iconBgColor: 'bg-emerald-100 dark:bg-emerald-500/10',
        buttonColor: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
        hasReason: false,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
    },
    delete: {
        title: 'Delete User',
        description: 'This will permanently delete the user account and all associated data. All their active tickets will be voided and the ticket stock will be restored. This action cannot be undone.',
        confirmLabel: 'Delete Permanently',
        iconColor: 'text-red-600 dark:text-red-400',
        iconBgColor: 'bg-red-100 dark:bg-red-500/10',
        buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        hasReason: false,
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        ),
    },
};

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminUsers({ users, filters, authUser }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const activeFilter = filters.role || 'All';

    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    const [filterRegFrom, setFilterRegFrom] = useState(filters.registered_from || '');
    const [filterRegTo, setFilterRegTo] = useState(filters.registered_to || '');
    const [filterUserStatus, setFilterUserStatus] = useState(filters.user_status || '');

    const [activeRole, setActiveRole] = useState<UserRole>('admin');

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    // Action confirmation modal state
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionTarget, setActionTarget] = useState<UserItem | null>(null);
    const [actionType, setActionType] = useState<ActionType>('suspend');
    const [actionReason, setActionReason] = useState('');
    const [actionProcessing, setActionProcessing] = useState(false);

    const { data: createData, setData: setCreateData, post: postCreate, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'User',
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        email: '',
        role: 'User',
    });

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

    const visibleRoleFilters = activeRole === 'root' ? roleFilters : roleFilters.filter((f) => f !== 'Root');
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

    /* ── Action Modal Handlers ────────────────────────────────────── */

    const openActionModal = (user: UserItem, type: ActionType) => {
        setActionTarget(user);
        setActionType(type);
        setActionReason('');
        setIsActionModalOpen(true);
    };

    const closeActionModal = () => {
        setIsActionModalOpen(false);
        setActionTarget(null);
        setActionReason('');
        setActionProcessing(false);
    };

    const confirmAction = () => {
        if (!actionTarget) return;
        setActionProcessing(true);

        if (actionType === 'delete') {
            router.delete(route('admin.users.destroy', { id: actionTarget.id }), {
                preserveState: true,
                onSuccess: closeActionModal,
                onError: () => setActionProcessing(false),
            });
        } else {
            const statusMap: Record<string, string> = {
                suspend: 'Suspended',
                ban: 'Banned',
                reactivate: 'Active',
            };

            router.patch(
                route('admin.users.updateStatus', { id: actionTarget.id }),
                {
                    status: statusMap[actionType],
                    reason: actionReason || null,
                },
                {
                    preserveState: true,
                    onSuccess: closeActionModal,
                    onError: () => setActionProcessing(false),
                },
            );
        }
    };

    /**
     * Determines which actions the current user can perform on a target user.
     */
    const getAvailableActions = (user: UserItem): ActionType[] => {
        // No actions on Root users
        if (user.role === 'Root') return [];

        // Cannot act on yourself
        if (user.id === authUser.id) return [];

        // Admins cannot act on other Admins
        if (user.role === 'Admin' && authUser.role !== 'Root') return [];

        const actions: ActionType[] = [];

        if (user.status === 'Active') {
            actions.push('suspend');
            actions.push('ban');
        } else if (user.status === 'Suspended') {
            actions.push('reactivate');
            actions.push('ban');
        } else if (user.status === 'Banned') {
            actions.push('reactivate');
        }

        actions.push('delete');
        return actions;
    };

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

    /* ── Forms ────────────────────────────────────────────── */

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        postCreate(route('admin.users.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
        });
    };

    const openEditModal = (user: UserItem) => {
        setEditingUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setIsEditModalOpen(true);
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingUser) {
            putEdit(route('admin.users.update', { id: editingUser.id }), {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetEdit();
                },
            });
        }
    };

    /* ── Color helpers ────────────────────────────────────────────── */

    const roleColor = (role: string) => {
        switch (role) {
            case 'Root': return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20';
            case 'Admin': return 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20';
            case 'Organizer': return 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20';
            case 'User': return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            default: return '';
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-emerald-500 dark:text-emerald-400';
            case 'Suspended': return 'text-amber-500 dark:text-amber-400';
            case 'Banned': return 'text-red-500 dark:text-red-400';
            default: return '';
        }
    };

    /* ── Action button styling helpers ────────────────────────────── */

    const actionButtonStyle = (type: ActionType) => {
        switch (type) {
            case 'suspend':
                return 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5';
            case 'ban':
                return 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5';
            case 'reactivate':
                return 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/5';
            case 'delete':
                return 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 font-semibold';
            default:
                return '';
        }
    };

    const actionLabel = (type: ActionType) => {
        switch (type) {
            case 'suspend': return 'Suspend User';
            case 'ban': return 'Ban User';
            case 'reactivate': return 'Reactivate User';
            case 'delete': return 'Delete User';
        }
    };

    return (
        <DashboardLayout>
            <Head title="User Management" />

            {/* Page heading */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage all accounts registered on the platform.</p>
                    </div>
                </div>
                <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                    + Create User
                </PrimaryButton>
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
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${activeFilter === filter
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
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <div className="min-w-full rounded-2xl">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="User" column="name" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Role" column="role" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Joined" column="joinedAt" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5 text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {visibleUsers.map((user) => {
                                const availableActions = getAvailableActions(user);

                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5 whitespace-nowrap max-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-600/20 flex items-center justify-center ring-1 ring-primary-300 dark:ring-primary-500/30 shrink-0">
                                                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="min-w-0 flex flex-col items-start overflow-hidden w-full">
                                                    <div className="inline-block max-w-full">
                                                        <Tooltip content={user.name}>
                                                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate block max-w-[160px]">{user.name}</span>
                                                        </Tooltip>
                                                    </div>
                                                    <div className="inline-block max-w-full -mt-0.5">
                                                        <Tooltip content={user.email}>
                                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block max-w-[160px]">{user.email}</span>
                                                        </Tooltip>
                                                    </div>
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
                                                <span className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Suspended' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`} />
                                                <span className={`text-sm font-medium ${statusColor(user.status)}`}>{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{user.joinedAt}</td>
                                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                                        </svg>
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align="right" vertical={users.data.indexOf(user) >= users.data.length - 2 ? "top" : "bottom"} width="48">
                                                    <Dropdown.Link href={route('admin.users.show', { id: user.id })}>
                                                        View Details
                                                    </Dropdown.Link>

                                                    <button
                                                        className="block w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                        onClick={() => openEditModal(user)}
                                                    >
                                                        Edit Details
                                                    </button>

                                                    {availableActions.length > 0 && (
                                                        <>
                                                            <div className="border-t border-slate-100 dark:border-white/5 my-1" />
                                                            {availableActions.map((action) => (
                                                                <button
                                                                    key={action}
                                                                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${actionButtonStyle(action)}`}
                                                                    onClick={() => openActionModal(user, action)}
                                                                >
                                                                    {actionLabel(action)}
                                                                </button>
                                                            ))}
                                                        </>
                                                    )}
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                );
                            })}
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

            {/* ═══════════════ Create Modal ═══════════════ */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <form onSubmit={submitCreate} className="p-6 bg-white dark:bg-navy-800 rounded-xl">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">Create New User</h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="create-name" value="Name" />
                            <TextInput
                                id="create-name"
                                type="text"
                                className="mt-1 block w-full"
                                value={createData.name}
                                onChange={(e: any) => setCreateData('name', e.target.value)}
                                required
                            />
                            <InputError message={createErrors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="create-email" value="Email" />
                            <TextInput
                                id="create-email"
                                type="email"
                                className="mt-1 block w-full"
                                value={createData.email}
                                onChange={(e: any) => setCreateData('email', e.target.value)}
                                required
                            />
                            <InputError message={createErrors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="create-password" value="Password" />
                            <TextInput
                                id="create-password"
                                type="password"
                                className="mt-1 block w-full"
                                value={createData.password}
                                onChange={(e: any) => setCreateData('password', e.target.value)}
                                required
                            />
                            <InputError message={createErrors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="create-role" value="Role" />
                            <select
                                id="create-role"
                                className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                value={createData.role}
                                onChange={(e) => setCreateData('role', e.target.value)}
                            >
                                <option value="User">User</option>
                                <option value="Organizer">Organizer</option>
                                {activeRole === 'root' && <option value="Admin">Admin</option>}
                            </select>
                            <InputError message={createErrors.role} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={createProcessing}>Create User</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* ═══════════════ Edit Modal ═══════════════ */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md">
                <form onSubmit={submitEdit} className="p-6 bg-white dark:bg-navy-800 rounded-xl">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">Edit User Details</h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="edit-name" value="Name" />
                            <TextInput
                                id="edit-name"
                                type="text"
                                className="mt-1 block w-full"
                                value={editData.name}
                                onChange={(e: any) => setEditData('name', e.target.value)}
                                required
                            />
                            <InputError message={editErrors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit-email" value="Email" />
                            <TextInput
                                id="edit-email"
                                type="email"
                                className="mt-1 block w-full"
                                value={editData.email}
                                onChange={(e: any) => setEditData('email', e.target.value)}
                                required
                            />
                            <InputError message={editErrors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit-role" value="Role" />
                            <select
                                id="edit-role"
                                className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                value={editData.role}
                                onChange={(e) => setEditData('role', e.target.value)}
                                disabled={editingUser === null || editingUser.role === 'Root' || activeRole !== 'root' && editData.role === 'Admin'}
                            >
                                <option value="User">User</option>
                                <option value="Organizer">Organizer</option>
                                <option value="Admin">Admin</option>
                                {editingUser?.role === 'Root' && <option value="Root">Root</option>}
                            </select>
                            <InputError message={editErrors.role} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={editProcessing}>Save Changes</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* ═══════════════ Action Confirmation Modal ═══════════════ */}
            <Modal show={isActionModalOpen} onClose={closeActionModal} maxWidth="md">
                {actionTarget && (
                    <div className="p-6 bg-white dark:bg-navy-800 rounded-xl">
                        {/* Header with icon */}
                        <div className="flex items-start gap-4 mb-5">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${actionConfig[actionType].iconBgColor} ${actionConfig[actionType].iconColor}`}>
                                {actionConfig[actionType].icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {actionConfig[actionType].title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    Target: <span className="font-medium text-slate-700 dark:text-slate-300">{actionTarget.name}</span>
                                    <span className="text-slate-400 dark:text-slate-500"> ({actionTarget.email})</span>
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-4 mb-5">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {actionConfig[actionType].description}
                            </p>
                        </div>

                        {/* Reason field (only for suspend/ban) */}
                        {actionConfig[actionType].hasReason && (
                            <div className="mb-5">
                                <InputLabel htmlFor="action-reason" value="Reason (will be shown to the user)" />
                                <textarea
                                    id="action-reason"
                                    rows={3}
                                    className="mt-1.5 block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition resize-none"
                                    placeholder={`Provide a reason for ${actionType === 'suspend' ? 'suspending' : 'banning'} this user...`}
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <SecondaryButton onClick={closeActionModal}>
                                Cancel
                            </SecondaryButton>
                            <button
                                type="button"
                                disabled={actionProcessing}
                                onClick={confirmAction}
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-navy-800 disabled:opacity-50 disabled:cursor-not-allowed ${actionConfig[actionType].buttonColor}`}
                            >
                                {actionProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing…
                                    </>
                                ) : (
                                    actionConfig[actionType].confirmLabel
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
}
