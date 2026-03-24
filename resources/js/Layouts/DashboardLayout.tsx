import Sidebar from '@/Components/Dashboard/Sidebar';
import Header from '@/Components/Dashboard/Header';
import { useTheme } from '@/hooks/useTheme';
import { PropsWithChildren, useState } from 'react';
import type { UserRole } from '@/config/navigation';

export default function DashboardLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    // Use localStorage for mock state so teammates don't have merge conflicts changing hardcoded values
    const [activeRole, setActiveRole] = useState<UserRole>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mock_role');
            if (saved === 'root' || saved === 'admin' || saved === 'organizer' || saved === 'user') return saved as UserRole;
        }
        return 'admin';
    });

    const handleRoleChange = (role: UserRole) => {
        setActiveRole(role);
        localStorage.setItem('mock_role', role);
        window.dispatchEvent(new Event('mock_role_changed'));
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-navy-950 dark:text-slate-200 selection:bg-primary-500/30">
            <Sidebar
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                activeRole={activeRole}
            />

            <div
                className={`flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-64'
                    }`}
            >
                <Header
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                    onCollapseToggle={() => setSidebarCollapsed((prev) => !prev)}
                    isCollapsed={sidebarCollapsed}
                    isDark={isDark}
                    onThemeToggle={toggleTheme}
                    activeRole={activeRole}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Dev-only role switcher to avoid git conflicts when teammates test different roles */}
            {import.meta.env.DEV && (
                <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl p-2 flex items-center gap-1 backdrop-blur-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 text-slate-500 dark:text-slate-400">Dev Role</span>
                    {(['root', 'admin', 'organizer', 'user'] as UserRole[]).map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                                activeRole === role 
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 ring-1 ring-primary-500/50' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
