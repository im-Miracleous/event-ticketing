import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';

interface HeaderProps {
    onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
    const user = usePage().props.auth.user;

    return (
        <header className="sticky top-0 z-30 h-16 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                {/* Left: hamburger + search */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2 w-72 focus-within:border-primary-500/40 transition-colors">
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-0 text-sm text-slate-300 placeholder-slate-500 focus:ring-0 w-full p-0"
                        />
                    </div>
                </div>

                {/* Right: notifications + profile */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-navy-950" />
                    </button>

                    <div className="h-6 w-px bg-white/10" />

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition"
                            >
                                <div className="h-7 w-7 rounded-full bg-primary-600/20 flex items-center justify-center ring-1 ring-primary-500/30">
                                    <span className="text-xs font-bold text-primary-400">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="hidden sm:inline">{user.name}</span>
                                <svg className="h-4 w-4 opacity-50 hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
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
        </header>
    );
}
