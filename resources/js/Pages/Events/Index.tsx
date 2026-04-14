import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface Category {
    id: number;
    name: string;
    icon?: string;
}

interface Organizer {
    id: string;
    name: string;
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
    organizer: Organizer | null;
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

interface Filters {
    search?: string;
    category?: string | number;
    location?: string;
    format?: string;
    price_min?: string | number;
    price_max?: string | number;
    time?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    page?: number;
}

interface Props {
    events: PaginatedEvents;
    trendingEvents: EventItem[];
    categories: Category[];
    filters: Filters;
    savedEventIds: (string | number)[];
}

const SORT_OPTIONS = [
    { value: 'date_asc', label: 'Nearest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price_asc', label: 'Lowest Price' },
    { value: 'price_desc', label: 'Highest Price' },
];

const CATEGORY_ICONS: Record<string, JSX.Element> = {
    'Music': <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
    'Tech': <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    'Sport': <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    'Education': <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    'Default': <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
};

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
    });
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

// ─── Event Card Component ──────────────────────────────────────────────────
function EventCard({ event, isSaved, onToggleSave }: { event: EventItem; isSaved: boolean; onToggleSave: () => void }) {
    const minPrice = event.ticket_types?.length > 0
        ? Math.min(...event.ticket_types.map(t => Number(t.price)))
        : null;

    const fallbackImg = `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop`;

    const isSoldOut = event.ticket_types?.every(t => t.available_stock === 0) ?? false;

    return (
        <Link href={`/events/${event.id}`} className="group relative bg-white dark:bg-slate-900/40 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={event.banner_image ?? fallbackImg}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {event.category && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white shadow-lg">
                            {event.category.name}
                        </span>
                    )}
                    {isSoldOut && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">Sold Out</span>
                    )}
                </div>

                {/* Save/Bookmark Button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(); }}
                    className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${isSaved
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40'
                            : 'bg-black/30 text-white/80 hover:bg-violet-600 hover:text-white'
                        }`}
                    title={isSaved ? 'Remove from saved' : 'Save event'}
                >
                    <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </button>

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

            {/* Content Section */}
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
                            {minPrice !== null ? (minPrice > 0 ? formatCurrency(minPrice) : 'FREE') : 'N/A'}
                        </span>
                    </div>
                    <div
                        className="p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-violet-600 dark:hover:bg-violet-400 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── Main Catalog Page ──────────────────────────────────────────────────────
export default function EventCatalog({ events, trendingEvents, categories, filters, savedEventIds = [] }: Props) {
    const [savedIds, setSavedIds] = useState<(string | number)[]>(savedEventIds);

    const toggleSave = (eventId: string | number) => {
        setSavedIds(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
        router.post('/saved-events/toggle', { event_id: eventId }, { preserveScroll: true, preserveState: true });
    };
    const [search, setSearch] = useState(filters.search ?? '');
    const [activeTab, setActiveTab] = useState(filters.category ?? 'all');

    const [localEvents, setLocalEvents] = useState<PaginatedEvents>(events);
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);
    const [isLoading, setIsLoading] = useState(false);

    const fetchEvents = async (params: Filters) => {
        setIsLoading(true);
        try {
            const cleanParams: any = {};
            Object.keys(params).forEach(key => {
                if (params[key as keyof Filters] !== undefined && params[key as keyof Filters] !== '') {
                    cleanParams[key] = params[key as keyof Filters];
                }
            });
            const res = await axios.get('/events', { params: cleanParams, headers: { 'Accept': 'application/json' } });
            
            // Re-sync local events
            setLocalEvents(res.data);

            const newUrl = new URL(window.location.href);
            newUrl.search = new URLSearchParams(cleanParams).toString();
            window.history.replaceState({}, '', newUrl);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetch = useCallback(
        debounce((params: Filters) => {
            fetchEvents(params);
        }, 500),
        []
    );

    // Skip the very first render since `events` is already passed via props
    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
        } else {
            debouncedFetch(currentFilters);
        }
        return () => debouncedFetch.cancel();
    }, [currentFilters, debouncedFetch]);

    const updateFilter = (newFilters: Partial<Filters>) => {
        setCurrentFilters(prev => ({ ...prev, ...newFilters, page: undefined }));
    };

    return (
        <DashboardLayout>
            <Head title="Discover Events - EventHive" />

            {/* ── HERO SECTION ── */}
            <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-12 py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411177-042180ce672c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950" />
                    <div className="absolute -top-24 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        Don't Miss Out on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Perfect Moment</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
                        Discover thousands of music concerts, workshops, and exclusive seminars tailored just for you.
                    </p>

                    {/* SEARCH BAR */}
                    <div className="relative max-w-3xl mx-auto group">
                        <div className="absolute inset-0 bg-violet-500/20 rounded-[2rem] blur-2xl group-hover:bg-violet-500/30 transition-all duration-500" />
                        <div className="relative flex items-center bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl">
                            <div className="flex-1 flex items-center px-4">
                                <svg className="w-6 h-6 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && router.get('/search', { q: search })}
                                    placeholder="Find your favorite events..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-500 py-3 text-lg font-medium"
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    updateFilter({ search });
                                    router.get('/search', { q: search });
                                }}
                                className="bg-slate-900 dark:bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-[1.5rem] font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TRENDING SECTION (Carousel Style) ── */}
            {trendingEvents?.length > 0 && (
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-violet-600 rounded-full" />
                            Trending Events
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4 overflow-x-auto no-scrollbar">
                        {trendingEvents.slice(0, 2).map(event => (
                            <Link key={event.id} href={`/events/${event.id}`} className="relative h-[300px] rounded-[2.5rem] overflow-hidden group border border-white/10 shadow-lg">
                                <img src={event.banner_image ?? ''} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 text-left">
                                    <span className="inline-block px-3 py-1 bg-violet-600 text-[10px] font-black text-white uppercase rounded-full mb-3 tracking-widest">Featured</span>
                                    <h3 className="text-2xl font-black text-white mb-2 line-clamp-1 group-hover:text-violet-400 transition-colors tracking-tight">{event.title}</h3>
                                    <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                                        <span className="flex items-center gap-1.5"><CalendarIcon /> {formatDate(event.event_date)}</span>
                                        <span className="flex items-center gap-1.5"><PinIcon /> {event.location}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CATEGORY QUICK FILTER ── */}
            <section className="mb-12">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4">
                    <button
                        onClick={() => { setActiveTab('all'); updateFilter({ category: undefined }); }}
                        className={`flex items-center gap-3 px-6 py-4 rounded-3xl font-bold transition-all whitespace-nowrap ${activeTab === 'all'
                                ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/30'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-500'
                            }`}
                    >
                        {CATEGORY_ICONS.Default}
                        All Events
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveTab(cat.id); updateFilter({ category: cat.id }); }}
                            className={`flex items-center gap-3 px-6 py-4 rounded-3xl font-bold transition-all whitespace-nowrap ${String(activeTab) === String(cat.id)
                                    ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/30'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-500'
                                }`}
                        >
                            {CATEGORY_ICONS[cat.name] || CATEGORY_ICONS.Default}
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── MAIN CONTENT AREA (Grid + Filter) ── */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-72 space-y-8">
                    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Filters</h3>
                            <button onClick={() => updateFilter({})} className="text-xs text-violet-500 font-bold hover:underline">Reset</button>
                        </div>

                        {/* Format Filter */}
                        <div className="mb-8">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Event Format</h4>
                            <div className="flex gap-2">
                                {['Online', 'Offline'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => updateFilter({ format: currentFilters.format === f ? undefined : f })}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                                            currentFilters.format === f 
                                            ? 'bg-violet-600 text-white shadow-lg' 
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Quick Filter */}
                        <div className="mb-8 text-left">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">When</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['today', 'tomorrow', 'week'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => updateFilter({ time: currentFilters.time === t ? undefined : t })}
                                        className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                                            currentFilters.time === t 
                                            ? 'bg-violet-600 text-white' 
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                        }`}
                                    >
                                        {t === 'week' ? 'This Week' : t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="text-left">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Price Range</h4>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="5000000"
                                    step="50000"
                                    value={currentFilters.price_max || 5000000}
                                    onChange={e => updateFilter({ price_max: e.target.value })}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                />
                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                    <span>Rp 0</span>
                                    <span>Max {formatCurrency(Number(currentFilters.price_max) || 5000000)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Event Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            <span className="font-black text-slate-900 dark:text-white">{localEvents.total}</span> events matching your vibe
                        </p>
                        <select 
                            value={currentFilters.sort || 'date_asc'}
                            onChange={e => updateFilter({ sort: e.target.value })}
                            className="bg-transparent border-none text-sm font-black text-violet-600 focus:ring-0 cursor-pointer"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>Sort by: {opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {localEvents.data.length > 0 ? (
                            localEvents.data.map(event => (
                                <EventCard key={event.id} event={event} isSaved={savedIds.includes(event.id)} onToggleSave={() => toggleSave(event.id)} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Oops! No match found</h3>
                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">Maybe try searching for something else or reset your filters?</p>
                                <button onClick={() => updateFilter({})} className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/30">Clear All Filters</button>
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {localEvents.current_page < localEvents.last_page && (
                        <div className="mt-16 flex justify-center">
                           <button 
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        const cleanParams: any = { ...currentFilters, page: localEvents.current_page + 1 };
                                        const res = await axios.get('/events', { params: cleanParams, headers: { 'Accept': 'application/json' } });
                                        setLocalEvents(prev => ({
                                            ...res.data,
                                            data: [...prev.data, ...res.data.data]
                                        }));
                                    } catch(e) { console.error(e); } finally { setIsLoading(false); }
                                }}
                                className="px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-[1.5rem] font-black hover:border-violet-500 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                            >
                                {isLoading ? 'Loading...' : 'Load More Events'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
