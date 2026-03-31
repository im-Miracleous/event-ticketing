import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';

interface Category { id: number; name: string; }
interface TicketType { id: number; name: string; price: number; available_stock: number; }
interface EventItem {
    id: string;
    title: string;
    description: string;
    banner_image: string | null;
    event_date: string;
    location: string;
    format: 'Online' | 'Offline';
    category: Category | null;
    ticket_types: TicketType[];
}
interface WishlistEntry {
    id: number;
    event: EventItem;
    saved_at: string;
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function SavedEventCard({ entry, onUnsave }: { entry: WishlistEntry; onUnsave: () => void }) {
    const event = entry.event;
    if (!event) return null;

    const minPrice = event.ticket_types?.length > 0
        ? Math.min(...event.ticket_types.map(t => Number(t.price)))
        : 0;

    const isSoldOut = event.ticket_types?.every(t => t.available_stock === 0) ?? false;

    return (
        <div className="group bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500">
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-56 h-48 sm:h-auto overflow-hidden shrink-0">
                    <img
                        src={event.banner_image ?? 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {event.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white">
                            {event.category.name}
                        </span>
                    )}
                    {isSoldOut && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">
                            Sold Out
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors mb-2 line-clamp-2">
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                                {formatDate(event.event_date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                {event.location}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mulai dari</span>
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                {minPrice > 0 ? formatCurrency(minPrice) : 'GRATIS'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onUnsave}
                                className="p-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Hapus dari simpan"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                </svg>
                            </button>
                            {!isSoldOut && (
                                <Link
                                    href={`/events/${event.id}/checkout`}
                                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-violet-500/30"
                                >
                                    Beli Tiket
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SavedEvents({ wishlists }: { wishlists: WishlistEntry[] }) {
    const handleUnsave = (eventId: string) => {
        router.post('/saved-events/toggle', { event_id: eventId }, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title="Saved Events – EventHive" />

            <div className="max-w-4xl mx-auto py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <svg className="w-7 h-7 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                            Event Tersimpan
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Daftar event yang sudah kamu simpan untuk nanti.</p>
                    </div>
                    <Link
                        href="/events"
                        className="text-sm font-bold text-violet-600 hover:text-violet-500 transition-colors"
                    >
                        + Cari Event Baru
                    </Link>
                </div>

                {wishlists.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Belum ada event tersimpan</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
                            Simpan event favoritmu agar mudah ditemukan nanti!
                        </p>
                        <Link
                            href="/events"
                            className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-black shadow-lg shadow-violet-500/30 hover:bg-violet-500 transition-colors"
                        >
                            Jelajahi Event
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wishlists.map(entry => (
                            <SavedEventCard
                                key={entry.id}
                                entry={entry}
                                onUnsave={() => handleUnsave(String(entry.event?.id))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
