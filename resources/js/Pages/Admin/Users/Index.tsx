import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { UserRole } from '@/config/navigation';

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const allUsers = [
    { id: 1,  name: 'Super Admin',      email: 'root@eventhive.com',       role: 'Root',      status: 'Active',    joinedAt: 'Jan 01, 2025' },
    { id: 2,  name: 'Admin Utama',      email: 'admin@eventhive.com',      role: 'Admin',     status: 'Active',    joinedAt: 'Feb 10, 2025' },
    { id: 3,  name: 'Sarah Johnson',    email: 'sarah@example.com',        role: 'Organizer', status: 'Active',    joinedAt: 'Mar 05, 2026' },
    { id: 4,  name: 'Ahmad Rizky',      email: 'ahmad.rizky@example.com',  role: 'Organizer', status: 'Active',    joinedAt: 'Mar 12, 2026' },
    { id: 5,  name: 'Budi Santoso',     email: 'budi.s@example.com',       role: 'User',      status: 'Active',    joinedAt: 'Mar 18, 2026' },
    { id: 6,  name: 'Citra Dewi',       email: 'citra.dewi@example.com',   role: 'User',      status: 'Suspended', joinedAt: 'Feb 28, 2026' },
    { id: 7,  name: 'Denny Prasetyo',   email: 'denny.p@example.com',      role: 'User',      status: 'Active',    joinedAt: 'Mar 20, 2026' },
    { id: 8,  name: 'Eka Putri',        email: 'eka.putri@example.com',    role: 'User',      status: 'Active',    joinedAt: 'Mar 22, 2026' },
    { id: 9,  name: 'Fajar Nugroho',    email: 'fajar.n@example.com',      role: 'Organizer', status: 'Active',    joinedAt: 'Jan 15, 2026' },
    { id: 10, name: 'Grace Ling',       email: 'grace.ling@example.com',   role: 'User',      status: 'Banned',    joinedAt: 'Dec 01, 2025' },
    { id: 11, name: 'Hendra Wijaya',    email: 'hendra.w@example.com',     role: 'User',      status: 'Active',    joinedAt: 'Jan 20, 2026' },
    { id: 12, name: 'Indah Permata',    email: 'indah.p@example.com',      role: 'Organizer', status: 'Active',    joinedAt: 'Feb 05, 2026' },
    { id: 13, name: 'Joko Susilo',      email: 'joko.s@example.com',       role: 'User',      status: 'Active',    joinedAt: 'Feb 14, 2026' },
    { id: 14, name: 'Kartini Rahayu',   email: 'kartini.r@example.com',    role: 'User',      status: 'Suspended', joinedAt: 'Mar 01, 2026' },
    { id: 15, name: 'Lukman Hakim',     email: 'lukman.h@example.com',     role: 'User',      status: 'Active',    joinedAt: 'Mar 10, 2026' },
];

const roleFilters = ['All', 'Root', 'Admin', 'Organizer', 'User'];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminUsers() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Read the mock role from localStorage to hide Root users when viewed as Admin
    const [activeRole, setActiveRole] = useState<UserRole>('admin');
    useEffect(() => {
        const saved = localStorage.getItem('mock_role');
        if (saved === 'root' || saved === 'admin' || saved === 'organizer' || saved === 'user') {
            setActiveRole(saved as UserRole);
        }

        // Listen to storage changes and our custom event so switching role in the dev widget updates this page immediately
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

    // Filter users: hide Root accounts when logged in as Admin
    const visibleUsers = allUsers.filter((u) => {
        if (activeRole !== 'root' && u.role === 'Root') return false;
        return true;
    });

    // Also hide Root from the filter chips when not Root
    const visibleRoleFilters = activeRole === 'root' ? roleFilters : roleFilters.filter((f) => f !== 'Root');

    const filteredUsers = visibleUsers.filter((u) => {
        const matchesFilter = activeFilter === 'All' || u.role === activeFilter;
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalItems = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        setCurrentPage(1);
    };

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
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <th className="px-5 py-3.5">User</th>
                                <th className="px-5 py-3.5">Role</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5">Joined</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {paginatedUsers.map((user) => (
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
                                            <button className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">
                                                {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {paginatedUsers.length === 0 && (
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
