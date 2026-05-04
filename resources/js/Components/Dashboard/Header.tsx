import Dropdown from '@/Components/Dropdown';
import { usePage, Link } from '@inertiajs/react';
import type { UserRole } from '@/config/navigation';
import NotificationDropdown from './NotificationDropdown';
import TunnelStatusIndicator from './TunnelStatusIndicator';

interface HeaderProps {
    onMenuToggle: () => void;
    onCollapseToggle: () => void;
    isCollapsed: boolean;
    isDark: boolean;
    onThemeToggle: () => void;
    activeRole: UserRole;
}

export default function Header({ onMenuToggle, onCollapseToggle, isCollapsed, isDark, onThemeToggle, activeRole }: HeaderProps) {
    const user = usePage().props.auth.user;

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    {/* Mobile hamburger */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900/5 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    {/* Desktop sidebar collapse toggle */}
                    <button
                        onClick={onCollapseToggle}
                        className="hidden lg:inline-flex items-center justify-center rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900/5 hover:text-slate-900 dark:hover:text-white transition"
                        title={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                    >
                        <svg className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                    </button>

                    {/* ─── Role-specific centre content ─── */}

                    {/* User: Search bar */}
                    {activeRole === 'user' && (
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-navy-900/5 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 w-72 focus-within:border-primary-500/40 transition-colors">
                            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="bg-transparent border-0 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 w-full p-0"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Tunnel Reachability (Dev Only) */}
                    <TunnelStatusIndicator />

                    {/* Theme toggle */}
                    <button
                        onClick={onThemeToggle}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900/5 hover:text-slate-900 dark:hover:text-white transition"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                        )}
                    </button>

                    {/* Notifications */}
                    <NotificationDropdown user={user} />

                    <div className="h-6 w-px bg-slate-200 dark:bg-navy-900/50" />

                    {/* Profile dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900/5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900/10 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition"
                            >
                                <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-600/20 flex items-center justify-center ring-1 ring-primary-300 dark:ring-primary-500/30">
                                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="hidden sm:inline">{user.name}</span>
                                <svg className="h-4 w-4 opacity-50 hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content contentClasses="py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-xl mt-2 overflow-hidden">
                            <Dropdown.Link href={route('profile.edit')} className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                Profile Settings
                            </Dropdown.Link>
                            <div className="h-px bg-slate-100 dark:bg-navy-900/5 mx-2 my-1" />
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                                Sign Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
}
