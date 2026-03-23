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


        </div>
    );
}
