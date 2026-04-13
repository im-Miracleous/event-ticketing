import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

/* ─── Type Definitions ─────────────────────────────────────── */
interface Category { id: number; name: string; }
interface Organizer { id: string; name: string; description?: string; logo?: string; }
interface TicketType { id: number; name: string; price: number; available_stock: number; }
interface FaqItem { question: string; answer: string; }

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
    total_quota: number;
    faq: FaqItem[] | null;
    rules_policies: string | null;
    contact_info: string | null;
    category: Category | null;
    organizer: Organizer | null;
    ticket_types: TicketType[];
}

interface Props {
    event: EventItem;
    recommendedEvents: EventItem[];
    savedEventIds: (string | number)[];
}

/* ─── Helpers ──────────────────────────────────────────────── */
function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}
function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function formatTime(d: string) {
    return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/* ─── Icon Components ──────────────────────────────────────── */
const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);
const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const PinIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
const UserGroupIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
);
const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);
const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </svg>
);

/* ─── FAQ Accordion Item ───────────────────────────────────── */
function FaqAccordion({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <span className="font-bold text-slate-900 dark:text-white pr-4">{item.question}</span>
                <ChevronDownIcon className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.answer}</p>
            </div>
        </div>
    );
}

/* ─── Recommended Event Card ───────────────────────────────── */
function RecommendedCard({ event }: { event: EventItem }) {
    const minPrice = event.ticket_types?.length > 0
        ? Math.min(...event.ticket_types.map(t => Number(t.price)))
        : 0;
    const fallbackImg = `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop`;

    return (
        <Link
            href={`/events/${event.id}`}
            className="group flex-shrink-0 w-[260px] bg-white dark:bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
        >
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={event.banner_image ?? fallbackImg}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {event.category && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-600 text-white">
                        {event.category.name}
                    </span>
                )}
            </div>
            <div className="p-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {event.title}
                </h4>
                {event.organizer && (
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg>
                        {event.organizer.name}
                    </p>
                )}
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                    <span>{new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Starts from</span>
                    <p className="text-sm font-black text-violet-600">
                        {minPrice > 0 ? formatCurrency(minPrice) : 'FREE'}
                    </p>
                </div>
            </div>
        </Link>
    );
}

/* ─── Main Event Detail Page ───────────────────────────────── */
export default function EventShow({ event, recommendedEvents, savedEventIds = [] }: Props) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'rules' | 'faq' | 'contact'>('description');
    const [savedIds, setSavedIds] = useState<(string | number)[]>(savedEventIds);

    const isSaved = savedIds.includes(event.id);
    const toggleSave = () => {
        setSavedIds(prev => prev.includes(event.id) ? prev.filter(id => id !== event.id) : [...prev, event.id]);
        router.post('/saved-events/toggle', { event_id: event.id }, { preserveScroll: true, preserveState: true });
    };

    const minPrice = event.ticket_types?.length > 0
        ? Math.min(...event.ticket_types.map(t => Number(t.price)))
        : 0;
    const isSoldOut = event.ticket_types?.every(t => t.available_stock === 0) ?? false;
    const fallbackImg = `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop`;

    const tabs = [
        { key: 'description' as const, label: 'Description' },
        { key: 'rules' as const, label: 'Rules & Policy' },
        { key: 'faq' as const, label: 'FAQ' },
        { key: 'contact' as const, label: 'Contact' },
    ];

    return (
        <DashboardLayout>
            <Head title={`${event.title} – EventHive`} />

            {/* ── HERO BANNER ── */}
            <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
                <div className="relative h-[340px] sm:h-[420px] overflow-hidden">
                    <img
                        src={event.banner_image ?? fallbackImg}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

                    {/* Back Button */}
                    <Link
                        href="/events"
                        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/30 backdrop-blur-xl text-white text-sm font-bold hover:bg-black/50 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </Link>

                    {/* Top Right Actions */}
                    <div className="absolute top-6 right-6 flex items-center gap-3">
                        <button
                            onClick={toggleSave}
                            className={`p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${isSaved
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40'
                                : 'bg-black/30 text-white hover:bg-violet-600'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Save event'}
                        >
                            <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="p-3 rounded-2xl bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all"
                            title="Share event"
                        >
                            <ShareIcon />
                        </button>
                    </div>

                    {/* Bottom Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {event.category && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white shadow-lg">
                                        {event.category.name}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${event.format === 'Online' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                    {event.format}
                                </span>
                                {isSoldOut && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white shadow-lg">
                                        Sold Out
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2 max-w-3xl">
                                {event.title}
                            </h1>
                            {event.organizer && (
                                <p className="text-slate-300 font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg>
                                    Organized by <span className="text-white font-bold">{event.organizer.name}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Event Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Event Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 min-w-0">
                                <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 shrink-0">
                                    <CalendarIcon />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 min-w-0">
                                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 shrink-0">
                                    <ClockIcon />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{formatTime(event.start_time)} – {formatTime(event.end_time)}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 min-w-0">
                                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
                                    <PinIcon />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={event.location}>{event.location}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 min-w-0">
                                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 shrink-0">
                                    <UserGroupIcon />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacity</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{event.total_quota.toLocaleString()} pax</p>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden">
                            <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-bold whitespace-nowrap transition-all relative ${
                                            activeTab === tab.key
                                                ? 'text-violet-600'
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.key && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 sm:p-8">
                                {/* Description Tab */}
                                {activeTab === 'description' && (
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">About This Event</h3>
                                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                            {event.description}
                                        </div>
                                    </div>
                                )}

                                {/* Rules & Policy Tab */}
                                {activeTab === 'rules' && (
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Rules & Policy</h3>
                                        {event.rules_policies ? (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
                                                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                                                    {event.rules_policies}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic">No rules and policies have been posted for this event yet.</p>
                                        )}
                                    </div>
                                )}

                                {/* FAQ Tab */}
                                {activeTab === 'faq' && (
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                                        {event.faq && event.faq.length > 0 ? (
                                            <div className="space-y-3">
                                                {event.faq.map((item, idx) => (
                                                    <FaqAccordion
                                                        key={idx}
                                                        item={item}
                                                        isOpen={openFaq === idx}
                                                        onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic">No FAQ available for this event yet.</p>
                                        )}
                                    </div>
                                )}

                                {/* Contact Tab */}
                                {activeTab === 'contact' && (
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Contact Information</h3>
                                        {event.contact_info ? (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
                                                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                                                    {event.contact_info}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic">No contact information has been provided for this event.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Ticket Sidebar */}
                    <aside>
                        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sticky top-6 space-y-6">
                            {/* Price Overview */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Price starts from</p>
                                <p className="text-3xl font-black text-violet-600">
                                    {minPrice > 0 ? formatCurrency(minPrice) : 'FREE'}
                                </p>
                            </div>

                            {/* Ticket Types Preview */}
                            <div className="space-y-3">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Available Tickets</p>
                                {event.ticket_types.length > 0 ? event.ticket_types.map(tt => (
                                    <div key={tt.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{tt.name}</p>
                                            <p className="text-xs text-violet-600 font-bold">{formatCurrency(tt.price)}</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase ${tt.available_stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {tt.available_stock > 0 ? `${tt.available_stock} left` : 'Sold Out'}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-400 italic">No tickets available yet.</p>
                                )}
                            </div>

                            {/* Date & Time Summary */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <CalendarIcon />
                                    <span className="text-slate-600 dark:text-slate-400">{formatDate(event.event_date)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <ClockIcon />
                                    <span className="text-slate-600 dark:text-slate-400">{formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm min-w-0">
                                    <div className="shrink-0">
                                        <PinIcon />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400 truncate" title={event.location}>{event.location}</span>
                                </div>
                            </div>

                            {/* Buy Tickets Button */}
                            {!isSoldOut ? (
                                <Link
                                    href={`/events/${event.id}/checkout`}
                                    className="block w-full py-4 bg-violet-600 hover:bg-violet-500 text-white text-center rounded-2xl font-black shadow-lg shadow-violet-500/30 transition-all active:scale-[0.98]"
                                >
                                    Buy Tickets →
                                </Link>
                            ) : (
                                <button disabled className="w-full py-4 bg-slate-200 dark:bg-slate-800 text-slate-400 text-center rounded-2xl font-black cursor-not-allowed">
                                    Sold Out
                                </button>
                            )}

                            <p className="text-[10px] text-slate-400 text-center">
                                Secure checkout powered by <span className="font-bold">EventHive</span>
                            </p>
                        </div>
                    </aside>
                </div>

                {/* ── RECOMMENDED EVENTS ── */}
                {recommendedEvents.length > 0 && (
                    <section className="mt-16 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <span className="w-1.5 h-7 bg-violet-600 rounded-full" />
                                You Might Also Like
                            </h2>
                            <Link href="/events" className="text-sm font-bold text-violet-600 hover:underline">
                                View All →
                            </Link>
                        </div>
                        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4">
                            {recommendedEvents.map(rec => (
                                <RecommendedCard key={rec.id} event={rec} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
}
