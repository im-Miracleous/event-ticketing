import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import Dropdown from '@/Components/Dropdown';

export default function OrganizerLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* Very Left Black Strip - Optional depending on Goers design */}
            <div className="w-16 bg-gray-900 flex-shrink-0 flex flex-col items-center py-4 space-y-4 shadow-xl z-20 relative">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">G</div>
                <div className="w-8 h-8 rounded hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 sticky top-0">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-gray-900 leading-none">GOERS</span>
                            <span className="text-[10px] font-bold tracking-widest text-gray-500">EXPERIENCE MANAGER</span>
                        </Link>
                        
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-500 uppercase">Home</Link>
                            <Link href={route('organizer.dashboard')} className="text-sm font-semibold text-blue-500 border-b-2 border-blue-500 py-5 uppercase">Event</Link>
                            <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-500 uppercase">Venue</Link>
                            <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-500 uppercase">Layanan</Link>
                            <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-500 uppercase">Penagihan</Link>
                            <Link href="#" className="text-sm font-semibold text-gray-500 hover:text-blue-500 uppercase">Organisasi</Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <div className="border-l border-gray-200 h-6 mx-2"></div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-start leading-none hidden sm:block">
                                        <span className="text-sm font-bold text-gray-700">{user.name}</span>
                                        <span className="text-[10px] text-gray-500">Organizer</span>
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Sign Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* Sidebar Area */}
                    <div className={`w-72 bg-white border-r border-gray-200 overflow-y-auto ${sidebarOpen ? 'block' : 'hidden'} md:block shadow-sm z-0`}>
                        <div className="p-6 pb-2">
                            <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center shadow-inner border border-blue-100">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-.504-.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg text-center leading-tight">Contoh Event</h3>
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">DRAF</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-500 border border-blue-200 rounded text-xs font-bold flex items-center"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> Pro</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-bold text-gray-700">
                                    <span>Ceklis Contoh Event</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>

                            <nav className="space-y-1">
                                <div>
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-sm font-bold text-gray-800 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            Atur Event
                                        </div>
                                        <svg className="w-4 h-4 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="mt-1 space-y-1">
                                        <Link href={route('organizer.dashboard')} className="w-full flex items-center px-12 py-3 bg-blue-500 text-white rounded-lg text-sm font-bold shadow-sm">
                                            Informasi Event
                                        </Link>
                                        <Link href="#" className="w-full flex items-center px-12 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-lg text-sm font-medium transition-colors">
                                            Tiket Event
                                        </Link>
                                        <Link href="#" className="w-full flex items-center px-12 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-lg text-sm font-medium transition-colors">
                                            Formulir Pemesanan
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white overflow-y-auto">
                        {header && (
                            <div className="px-8 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center border-l-4 border-blue-500 pl-3 leading-none">
                                    {header}
                                </h1>
                            </div>
                        )}
                        <main className="p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
