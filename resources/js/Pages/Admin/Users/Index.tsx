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
}

const roleFilters = ['All', 'Root', 'Admin', 'Organizer', 'User'];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminUsers({ users, filters }: Props) {
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

    const handleStatusUpdate = (userId: string, status: string) => {
        router.patch(route('admin.users.updateStatus', { id: userId }), { status }, {
            preserveState: true,
        });
    };
    
    const handleDelete = (userId: string) => {
        if(confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.users.destroy', { id: userId }), { preserveState: true });
        }
    }

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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        View and manage all accounts registered on the platform.
                    </p>
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
                            {visibleUsers.map((user) => (
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
                                            <span className={`h-2 w-2 rounded-full ${
                                                user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Suspended' ? 'bg-amber-500' : 'bg-red-500'
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
                                                
                                                {user.role !== 'Root' && (
                                                    <>
                                                        <button 
                                                            className="block w-full px-4 py-2 text-left text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                            onClick={() => handleStatusUpdate(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
                                                        >
                                                            {user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                                                        </button>
                                                        
                                                        {user.status !== 'Banned' && (
                                                            <button 
                                                                className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                                onClick={() => handleStatusUpdate(user.id, 'Banned')}
                                                            >
                                                                Ban User
                                                            </button>
                                                        )}

                                                        <button 
                                                            className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-semibold"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            Delete User
                                                        </button>
                                                    </>
                                                )}
                                            </Dropdown.Content>
                                        </Dropdown>
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
            
            {/* Create Modal */}
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
                                className="mt-1 block w-full border-slate-300 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
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

            {/* Edit Modal */}
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
                                className="mt-1 block w-full border-slate-300 dark:border-navy-600 dark:bg-navy-700 dark:text-slate-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
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
        </DashboardLayout>
    );
}
