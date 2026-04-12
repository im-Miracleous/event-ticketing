import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface Category { id: number; name: string; }
interface TicketType { id: number; name: string; price: number; available_stock: number; }
interface EventItem {
    id: string;
    title: string;
    banner_image: string | null;
    event_date: string;
    location: string;
    category: Category | null;
    ticket_types: TicketType[];
}

interface WaitingEntry {
    id: number;
    status: 'Waiting' | 'Confirmed' | 'Cancelled';
    event: EventItem;
    ticket_type: TicketType | null;
    joined_at: string;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

const STATUS_BADGE: Record<string, string> = {
    Waiting:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

function WaitingCard({ entry }: { entry: WaitingEntry }) {
    const event = entry.event;
    if (!event) return null;

    const handleCancel = () => {
        if (confirm('Kamu yakin ingin keluar dari waiting list?')) {
            router.post(`/waiting-list/${entry.id}/cancel`, {}, { preserveScroll: true });
        }
    };

    const isAvailableNow = entry.ticket_type && entry.ticket_type.available_stock > 0;

    return (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500">
            <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto overflow-hidden shrink-0">
                    <img
                        src={event.banner_image ?? 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <h3 className="font-black text-base text-slate-900 dark:text-white line-clamp-1">
                                {event.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                📅 {formatDate(event.event_date)} · 📍 {event.location}
                            </p>
                        </div>
                        <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_BADGE[entry.status] ?? STATUS_BADGE.Cancelled}`}>
                            {entry.status}
                        </span>
                    </div>

                    {entry.ticket_type && (
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Tiket: <span className="font-bold text-slate-900 dark:text-white">{entry.ticket_type.name}</span>
                            </span>
                            <span className="text-sm font-bold text-violet-600">
                                {formatCurrency(Number(entry.ticket_type.price))}
                            </span>
                            {isAvailableNow && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    ✓ Tersedia!
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono">
                            Joined {new Date(entry.joined_at).toLocaleDateString('id-ID')}
                        </span>
                        <div className="flex items-center gap-2">
                            {entry.status === 'Waiting' && (
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-xs font-bold text-red-500 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Keluar
                                </button>
                            )}
                            {isAvailableNow && entry.status === 'Waiting' && (
                                <Link
                                    href={`/events/${event.id}/checkout`}
                                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-xs transition-colors shadow-lg shadow-violet-500/30"
                                >
                                    Beli Sekarang →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WaitingListPage({ entries }: { entries: WaitingEntry[] }) {
    const active = entries.filter(e => e.status === 'Waiting');
    const past = entries.filter(e => e.status !== 'Waiting');

    return (
        <DashboardLayout>
            <Head title="Waiting List – EventHive" />

            <div className="max-w-4xl mx-auto py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                Waiting List
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau ketersediaan tiket yang sedang kamu tunggu.</p>
                        </div>
                    </div>
                    <Link
                        href="/events"
                        className="text-sm font-bold text-violet-600 hover:text-violet-500 transition-colors"
                    >
                        + Cari Event Baru
                    </Link>
                </div>

                {entries.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Belum ada waiting list</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
                            Kalau tiket yang kamu incar sudah habis, kamu bisa bergabung ke waiting list.
                        </p>
                        <Link
                            href="/events"
                            className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-black shadow-lg shadow-violet-500/30 hover:bg-violet-500 transition-colors"
                        >
                            Jelajahi Event
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {active.length > 0 && (
                            <>
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    Sedang Menunggu ({active.length})
                                </h2>
                                <div className="space-y-4">
                                    {active.map(entry => (
                                        <WaitingCard key={entry.id} entry={entry} />
                                    ))}
                                </div>
                            </>
                        )}

                        {past.length > 0 && (
                            <>
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mt-8">
                                    Riwayat ({past.length})
                                </h2>
                                <div className="space-y-4 opacity-60">
                                    {past.map(entry => (
                                        <WaitingCard key={entry.id} entry={entry} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
