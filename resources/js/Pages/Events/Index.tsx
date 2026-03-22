import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Event {
    id: string;
    title: string;
    description: string;
    banner_image: string;
    event_date: string;
    location: string;
    status: string;
    category?: { name: string };
    organizer?: { name: string };
}

interface Meta {
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    events: {
        data: Event[];
        links: Meta['links'];
        current_page: number;
        last_page: number;
    };
    categories: { id: number; name: string }[];
    filters: {
        search?: string;
        category?: string;
        location?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function Index({ events, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [location, setLocation] = useState(filters.location || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('events.index'), {
            search,
            category,
            location,
            date_from: dateFrom,
            date_to: dateTo
        }, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setLocation('');
        setDateFrom('');
        setDateTo('');
        router.get(route('events.index'));
    };

    return (
        <DashboardLayout>
            <Head title="Discover Events" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Discover Events</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explore and book tickets for the best events in town.</p>
            </div>

            {/* Search & Filter Section */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-6 mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Search Events</label>
                        <div className="relative">
                            <TextInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or description..."
                                className="w-full pl-10"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-950 dark:text-white focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 text-sm py-2.5"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Location</label>
                        <TextInput
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or venue..."
                            className="w-full"
                        />
                    </div>

                    <div className="flex gap-2">
                        <PrimaryButton type="submit" className="flex-1 justify-center py-2.5">
                            Search
                        </PrimaryButton>
                        <SecondaryButton type="button" onClick={clearFilters} title="Clear Filters" className="px-3">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </SecondaryButton>
                    </div>
                </form>
            </div>

            {/* Events Grid */}
            {events.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {events.data.map((event) => (
                            <div key={event.id} className="group relative bg-white dark:bg-navy-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10">
                                {/* Banner Image */}
                                <div className="aspect-[16/9] w-full overflow-hidden relative">
                                    <img 
                                        src={event.banner_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'} 
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-navy-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 border border-white/20">
                                            {event.category?.name || 'Event'}
                                        </span>
                                    </div>
                                    {/* Date Overlay */}
                                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md rounded-xl p-2 px-3 border border-white/20 flex flex-col items-center">
                                        <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-tighter">
                                            {new Date(event.event_date).toLocaleDateString('id-ID', { month: 'short' })}
                                        </span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                            {new Date(event.event_date).toLocaleDateString('id-ID', { day: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{event.title}</h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Starts {new Date(event.event_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting from</span>
                                            <span className="text-lg font-black text-primary-600 dark:text-primary-400">Free</span>
                                        </div>
                                        <Link 
                                            href={`/events/${event.id}`}
                                            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-bold transition-all duration-200 hover:bg-primary-600 hover:text-white"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {events.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center gap-2 bg-white dark:bg-navy-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                                {events.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                            link.active 
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-20 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No events found</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">We couldn't find any events matching your current filters. Try adjusting your search criteria.</p>
                    <SecondaryButton onClick={clearFilters} className="mt-8">
                        Reset All Filters
                    </SecondaryButton>
                </div>
            )}
        </DashboardLayout>
    );
}

// Global route function helper (assuming ziggy-js is used, which is standard for Inertia)
declare function route(name: string, params?: any): string;
