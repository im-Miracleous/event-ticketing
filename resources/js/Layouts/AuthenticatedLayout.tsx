import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-navy-950 text-slate-200 selection:bg-primary-500/30">
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-navy-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                        <span className="text-lg font-black text-white">E</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tighter text-white hidden sm:block">
                                        EVENT<span className="gradient-text">HIVE</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold leading-4 text-slate-300 transition duration-150 ease-in-out hover:bg-white/10 hover:text-white hover:border-white/20 focus:outline-none"
                                            >
                                                <div className="h-6 w-6 rounded-full bg-primary-600/20 flex items-center justify-center mr-2 ring-1 ring-primary-500/30">
                                                    <span className="text-[10px] font-bold text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                {user.name}

                                                <svg className="-me-0.5 ms-2 h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-navy-900 border border-white/10 shadow-2xl rounded-xl mt-2 overflow-hidden">
                                        <Dropdown.Link href={route('profile.edit')} className="text-slate-300 hover:bg-white/5 transition-colors">
                                            Profile Settings
                                        </Dropdown.Link>
                                        <div className="h-px bg-white/5 mx-2 my-1" />
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-400 hover:bg-red-500/10 transition-colors">
                                            Sign Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 transition duration-150 ease-in-out hover:bg-white/5 hover:text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-navy-900 border-t border-white/5'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-white/5 pb-1 pt-4">
                        <div className="px-4 flex items-center mb-4">
                            <div className="h-10 w-10 rounded-full bg-primary-600/20 flex items-center justify-center mr-3 ring-1 ring-primary-500/30">
                                <span className="text-sm font-bold text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <div className="text-base font-bold text-white leading-tight">{user.name}</div>
                                <div className="text-sm font-medium text-slate-400 leading-tight">{user.email}</div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-400 active:bg-red-500/10 active:text-red-400">
                                Sign Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-navy-900/50 border-b border-white/5 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
