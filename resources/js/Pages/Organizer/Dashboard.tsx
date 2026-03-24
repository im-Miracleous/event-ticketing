import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LayoutDashboard, CalendarDays, ScanLine, Settings, Menu, X } from 'lucide-react';

// Subkomponen
import DashboardOverview from './Partials/DashboardOverview';
import EventManagement from './Partials/EventManagement';
import ValidationCheckIn from './Partials/ValidationCheckIn';

// Kamus Lokal
// - ViewType: tipe menu aktif di sidebar
// - activeView: State yang mengatur komponen utama mana yang di-render di area konten utama
// - isMobileMenuOpen: State hamburger menu untuk responsivitas mobile

type ViewType = 'dashboard' | 'events' | 'create-event' | 'check-in' | 'settings';

export default function Dashboard({ auth }: any) {
    const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardOverview onViewChange={(view) => setActiveView(view as ViewType)} />;
            case 'events':
            case 'create-event':
                return <EventManagement />;
            case 'check-in':
                return <ValidationCheckIn />;
            default:
                return <div className="p-8 text-center text-gray-500">Komponen belum tersedia.</div>;
        }
    };

    const NavItem = ({ view, icon: Icon, label }: { view: ViewType | string, icon: any, label: string }) => {
        const isActive = activeView === view || (activeView === 'create-event' && view === 'events');
        return (
            <button 
                onClick={() => { setActiveView(view as ViewType); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} /> {label}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex md:flex-row font-sans overflow-hidden">
            <Head title="Organizer Console | EventHive" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-100 z-50 flex items-center justify-between p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 font-bold text-white flex items-center justify-center text-sm">E</div>
                    <span className="text-lg font-black tracking-tight text-gray-900">EventHive</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`fixed md:w-64 inset-y-0 left-0 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:static ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                <div className="p-6 hidden md:flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 font-black text-white flex items-center justify-center text-lg shadow-inner">E</div>
                    <div>
                        <span className="text-xl font-black tracking-tight text-gray-900 block leading-none">Event<span className="text-indigo-600">Hive</span></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 block">Organizer</span>
                    </div>
                </div>
                
                <div className="flex-[1] px-4 space-y-2 mt-20 md:mt-4 overflow-y-auto">
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
                    <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem view="events" icon={CalendarDays} label="My Events" />
                    <NavItem view="check-in" icon={ScanLine} label="Validation & Check-in" />
                </div>

                <div className="p-4 mt-auto border-t border-gray-50 bg-gray-50/50">
                    <NavItem view="settings" icon={Settings} label="Settings" />
                    <div className="mt-4 px-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Avatar" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{auth?.user?.name || 'Organizer'}</p>
                            <p className="text-xs text-gray-500 truncate">{auth?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay Mobile */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Main Content Area */}
            <main className="flex-[1] overflow-y-auto w-full mt-[72px] md:mt-0 relative h-[calc(100vh-72px)] md:h-screen">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 pb-24">
                    {renderContent()}
                </div>
            </main>

        </div>
    );
}
