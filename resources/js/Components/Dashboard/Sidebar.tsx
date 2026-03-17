import { Link, usePage } from '@inertiajs/react';
import { getNavItemsForRole, type UserRole, type NavItem } from '@/config/navigation';

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
    activeRole: UserRole;
}

export default function Sidebar({ isOpen, isCollapsed, onClose, activeRole }: SidebarProps) {
    const currentUrl = usePage().url;
    const navItems = getNavItemsForRole(activeRole);

    const isActive = (item: NavItem) => {
        if (item.routeName === 'dashboard') {
            return currentUrl === '/dashboard';
        }
        return currentUrl.startsWith(item.href);
    };

    /** Label shown above the nav list, derived from the role */
    const roleLabel: Record<UserRole, string> = {
        root: 'Root Administration',
        admin: 'Administration',
        organizer: 'Organizer Panel',
        user: 'My Account',
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-5 h-16 shrink-0 border-b border-slate-200 dark:border-white/5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <span className="text-lg font-black text-white">E</span>
                </div>
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                    EVENT<span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">HIVE</span>
                </span>
            </div>

            {/* Role section label */}
            <div className="px-5 pt-5 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {roleLabel[activeRole]}
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                active
                                    ? 'bg-primary-50 dark:bg-primary-600/15 text-primary-600 dark:text-primary-400 shadow-sm shadow-primary-500/5'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <span className={`transition-colors ${active ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                            {active && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                            )}

                            {/* Root-only badge for admin */}
                            {item.rootOnly && (
                                <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400 ring-1 ring-amber-500/20">
                                    Root
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-slate-200 dark:border-white/5">
                <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">EventHive</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">v1.0.0 — Beta</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-navy-950 border-r border-slate-200 dark:border-white/5 z-40 transition-transform duration-300 ease-in-out ${
                    isCollapsed ? '-translate-x-full' : 'translate-x-0'
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-navy-950 border-r border-slate-200 dark:border-white/5 transform transition-transform duration-300 ease-in-out lg:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
