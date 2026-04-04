import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    icon?: string;
}

interface TicketType {
    id: number;
    name: string;
    price: string | number;
    available_stock: number;
}

interface EventItem {
    id: string;
    title: string;
    description: string;
    banner_image: string | null;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    format: 'Online' | 'Offline';
    status: string;
    category: Category | null;
    ticket_types: TicketType[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedEvents {
    data: EventItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: PaginationLink[];
}

interface Props {
    events: PaginatedEvents;
    query?: string;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    }).toUpperCase();
}

const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);

const PinIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

function EventCard({ event }: { event: EventItem }) {
    const minPrice = event.ticket_types?.length > 0 
        ? Math.min(...event.ticket_types.map(t => Number(t.price))) 
        : 0;
    
    const fallbackImg = `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop`;
    
    const isSoldOut = event.ticket_types?.every(t => t.available_stock === 0) ?? false;
    const isEarlyBird = event.id.includes('early');

    return (
        <div className="group relative bg-white dark:bg-slate-900/40 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={event.banner_image ?? fallbackImg}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {event.category && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white shadow-lg">
                            {event.category.name}
                        </span>
                    )}
                    {isSoldOut ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">Sold Out</span>
                    ) : isEarlyBird ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white">Early Bird</span>
                    ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white">New</span>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white">
                        <CalendarIcon />
                        <span className="text-xs font-bold">{formatDate(event.event_date)}</span>
                    </div>
                    {event.format === 'Online' && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/80 backdrop-blur-md text-[10px] font-bold text-white uppercase">Online</span>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="flex-1 font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                        {event.title}
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-6">
                    <PinIcon />
                    <span className="truncate">{event.location}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price starts from</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                            {minPrice > 0 ? formatCurrency(minPrice) : 'FREE'}
                        </span>
                    </div>
                    <Link
                        href={`/events/${event.id}`}
                        className="p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-violet-600 dark:hover:bg-violet-400 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SearchIndex({ events, query }: Props) {
    const [searchQuery, setSearchQuery] = useState(query || '');

    const handleSearch = () => {
        router.get('/search', { q: searchQuery }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <Head title={`Search Results for "${query}" - EventHive`} />

            {/* Header section with search bar */}
            <section className="bg-slate-950 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 mb-12 border-b border-white/5 relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-8 tracking-tight">
                        Search Results
                    </h1>
                    
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute inset-0 bg-violet-500/20 rounded-[2rem] blur-2xl group-hover:bg-violet-500/30 transition-all duration-500" />
                        <div className="relative flex items-center bg-white dark:bg-slate-900 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 rounded-[2rem] shadow-2xl">
                            <div className="flex-1 flex items-center px-4">
                                <svg className="w-6 h-6 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search for events..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-500 py-3 text-lg font-medium"
                                />
                            </div>
                            <button 
                                onClick={handleSearch}
                                className="bg-slate-900 dark:bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-[1.5rem] font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto py-4">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {events.total > 0 ? (
                            <>Found <span className="text-violet-600">{events.total}</span> events matching "{query}"</>
                        ) : (
                            <>No events found for "{query}"</>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {events.data.length > 0 ? (
                        events.data.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No matching events could be found</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Try trying tweaking your keywords or browsing the full catalog.</p>
                            <Link href="/events" className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/30 inline-block">
                                Browse Catalog
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination / Load More */}
                {events.current_page < events.last_page && (
                    <div className="mt-16 flex justify-center">
                        <button 
                            onClick={() => router.visit(events.links[events.current_page + 1].url || '', { preserveState: true })}
                            className="px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-[1.5rem] font-black hover:border-violet-500 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                        >
                            Load More Results
                        </button>
                    </div>
                )}
            </div>

        </DashboardLayout>
    );
}
