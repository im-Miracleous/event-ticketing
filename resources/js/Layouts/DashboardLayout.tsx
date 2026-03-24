import Sidebar from '@/Components/Dashboard/Sidebar';
import Header from '@/Components/Dashboard/Header';
import { useTheme } from '@/hooks/useTheme';
import { PropsWithChildren, useState } from 'react';
import type { UserRole } from '@/config/navigation';
import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    // Read role directly from the authenticated user passed by Inertia's HandleInertiaRequests
    const user = usePage().props.auth?.user as any;
    const rawRole: string = user?.role ?? 'user';

    // Map Laravel role names (User/Admin/Organizer/Root) → TypeScript UserRole
    const roleMap: Record<string, UserRole> = {
        Root:      'root',
        Admin:     'admin',
        Organizer: 'organizer',
        User:      'user',
    };
    const activeRole: UserRole = roleMap[rawRole] ?? 'user';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-navy-950 dark:text-slate-200 selection:bg-primary-500/30">
            <Sidebar
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                activeRole={activeRole}
            />

            <div
                className={`flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-64'}`}
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
