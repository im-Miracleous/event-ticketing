import Sidebar from '@/Components/Dashboard/Sidebar';
import Header from '@/Components/Dashboard/Header';
import { PropsWithChildren, useState } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-navy-950 text-slate-200 selection:bg-primary-500/30">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
