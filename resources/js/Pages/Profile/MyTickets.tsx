import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Attendee { name: string; email: string; }
interface Ticket { id: string; qr_code: string; ticket_status: string; validated_at: string | null; attendee: Attendee | null; }
interface TicketType { id: number; name: string; price: number; }
interface TransactionDetail { id: number; quantity: number; subtotal: number; ticket_type: TicketType; tickets: Ticket[]; }
interface Payment { payment_method: string; payment_status: string; }
interface Event { id: string; title: string; banner_image: string | null; event_date: string; start_time: string; location: string; }
interface Transaction {
    id: string;
    total_amount: number;
    transaction_status: string;
    created_at: string;
    expires_at: string | null;
    event: Event;
    payment: Payment | null;
    details: TransactionDetail[];
    tab: 'upcoming' | 'used' | 'expired' | 'other';
}

const TABS = [
    { key: 'all',      label: 'Semua' },
    { key: 'upcoming', label: 'Akan Datang' },
    { key: 'used',     label: 'Sudah Digunakan' },
    { key: 'expired',  label: 'Selesai / Kadaluarsa' },
    { key: 'other',    label: 'Lainnya' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}
function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateTime(d: string) {
    return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_BADGE: Record<string, string> = {
    Pending:   'bg-amber-100 text-amber-700',
    Success:   'bg-emerald-100 text-emerald-700',
    Failed:    'bg-red-100 text-red-600',
    Cancelled: 'bg-slate-100 text-slate-500',
};

const TAB_COLOR: Record<string, string> = {
    upcoming: 'bg-violet-100 text-violet-700',
    used:     'bg-blue-100 text-blue-700',
    expired:  'bg-slate-100 text-slate-500',
    other:    'bg-amber-100 text-amber-700',
};

// ─── QR Code Component using Google Charts API ────────────────────────────────
function QRCode({ value, size = 120 }: { value: string; size?: number }) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    return (
        <img
            src={url}
            alt="QR Code"
            width={size}
            height={size}
            className="rounded-xl"
        />
    );
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────
function TicketCard({ transaction }: { transaction: Transaction }) {
    const [expanded, setExpanded] = useState(false);
    const allTickets = transaction.details.flatMap(d =>
        d.tickets.map(t => ({ ...t, ticketType: d.ticket_type }))
    );

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const event = transaction.event;
        const ticketsHtml = allTickets.map((t, i) => `
            <div style="page-break-inside:avoid;border:2px solid #7c3aed;border-radius:16px;padding:20px;margin-bottom:20px;display:flex;align-items:center;gap:20px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(t.qr_code)}" width="120" height="120" />
                <div>
                    <p style="font-weight:900;font-size:18px;color:#1e1b4b;margin:0 0 4px">${t.ticketType.name}</p>
                    <p style="color:#6b7280;margin:0 0 2px">Penonton: ${t.attendee?.name ?? '–'}</p>
                    <p style="color:#6b7280;margin:0 0 2px">Email: ${t.attendee?.email ?? '–'}</p>
                    <p style="font-family:monospace;font-size:11px;color:#9ca3af;margin:0">ID: ${t.id}</p>
                </div>
            </div>
        `).join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>E-Ticket – ${event.title}</title>
                <style>
                    * { box-sizing: border-box; }
                    body { font-family: -apple-system, sans-serif; padding: 40px; color: #111; }
                    h1 { font-size: 24px; font-weight: 900; color: #7c3aed; margin: 0 0 4px; }
                    .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
                    .divider { border: none; border-top: 2px dashed #e5e7eb; margin: 20px 0; }
                    .footer { text-align: center; color: #9ca3af; font-size: 11px; margin-top: 30px; }
                </style>
            </head>
            <body>
                <h1>${event.title}</h1>
                <p class="meta">📅 ${formatDate(event.event_date)} &nbsp;|&nbsp; 📍 ${event.location}</p>
                <p class="meta">Order ID: <strong>${transaction.id}</strong> &nbsp;|&nbsp; Total: <strong>${formatCurrency(Number(transaction.total_amount))}</strong></p>
                <hr class="divider" />
                ${ticketsHtml}
                <p class="footer">Dicetak melalui EventHive – Tunjukkan QR Code ini saat masuk venue.</p>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const tabLabel: Record<string, string> = {
        upcoming: 'Akan Datang',
        used:     'Sudah Digunakan',
        expired:  'Selesai',
        other:    transaction.transaction_status,
    };

    return (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden transition-shadow hover:shadow-xl hover:shadow-violet-500/10">
            {/* Card Header */}
            <div className="flex items-start gap-4 p-6 pb-5">
                <img
                    src={transaction.event?.banner_image ?? ''}
                    alt={transaction.event?.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-black text-slate-900 dark:text-white line-clamp-1 text-base">{transaction.event?.title}</h3>
                        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${TAB_COLOR[transaction.tab] ?? 'bg-slate-100 text-slate-500'}`}>
                            {tabLabel[transaction.tab]}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">📅 {formatDate(transaction.event?.event_date)}</p>
                    <p className="text-xs text-slate-500 mb-2">📍 {transaction.event?.location}</p>

                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${STATUS_BADGE[transaction.transaction_status] ?? 'bg-slate-100 text-slate-500'}`}>
                            {transaction.transaction_status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{transaction.id}</span>
                    </div>
                </div>
            </div>

            {/* Summary Row */}
            <div className="px-6 pb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="text-sm text-slate-500">
                    {transaction.details.reduce((s, d) => s + d.quantity, 0)} tiket &nbsp;·&nbsp;
                    <span className="font-black text-violet-600">{formatCurrency(Number(transaction.total_amount))}</span>
                </div>
                <div className="flex items-center gap-2">
                    {transaction.transaction_status === 'Success' && (
                        <button
                            onClick={handlePrint}
                            title="Download / Cetak E-Ticket"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-violet-600 border border-violet-300 dark:border-violet-700 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            PDF
                        </button>
                    )}
                    <button
                        onClick={() => setExpanded(p => !p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        {expanded ? 'Tutup' : 'Lihat Tiket'}
                        <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                </div>
            </div>

            {/* Expandable Tickets */}
            {expanded && (
                <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900/20">
                    {transaction.transaction_status !== 'Success' ? (
                        <div className="text-center py-8 text-slate-400 text-sm font-medium">
                            {transaction.transaction_status === 'Pending' ? '⏳ Menunggu pembayaran' : `Tiket tidak tersedia – transaksi ${transaction.transaction_status}`}
                        </div>
                    ) : allTickets.map((ticket, i) => (
                        <div key={ticket.id} className="flex items-center gap-5 p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                            {/* QR Code */}
                            <div className="shrink-0">
                                <QRCode value={ticket.qr_code} size={100} />
                            </div>

                            {/* Ticket Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-black text-slate-900 dark:text-white text-sm">{ticket.ticketType.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        ticket.ticket_status === 'Active' ? 'bg-emerald-100 text-emerald-700'
                                        : ticket.validated_at ? 'bg-blue-100 text-blue-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {ticket.validated_at ? 'Sudah Digunakan' : ticket.ticket_status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-0.5">
                                    <span className="font-bold">Penonton:</span> {ticket.attendee?.name ?? '–'}
                                </p>
                                <p className="text-xs text-slate-500 mb-1">{ticket.attendee?.email ?? '–'}</p>
                                {ticket.validated_at && (
                                    <p className="text-[10px] text-blue-500 font-semibold">✓ Check-in: {formatDateTime(ticket.validated_at)}</p>
                                )}
                                <p className="font-mono text-[10px] text-slate-300 mt-1 truncate">{ticket.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyTickets({ transactions }: { transactions: Transaction[] }) {
    const [activeTab, setActiveTab] = useState<TabKey>('all');

    const filtered = activeTab === 'all' ? transactions : transactions.filter(t => t.tab === activeTab);

    const counts = TABS.reduce((acc, t) => {
        acc[t.key] = t.key === 'all' ? transactions.length : transactions.filter(tx => tx.tab === t.key).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <DashboardLayout>
            <Head title="Tiket Saya – EventHive" />

            <div className="max-w-4xl mx-auto py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Tiket Saya</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola semua tiket event yang sudah kamu beli.</p>
                    </div>
                    <Link href="/events" className="text-sm font-bold text-violet-600 hover:text-violet-500 transition-colors">
                        + Cari Event Baru
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                                activeTab === tab.key
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-400'
                            }`}
                        >
                            {tab.label}
                            {counts[tab.key] > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}>{counts[tab.key]}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tickets List */}
                {filtered.length === 0 ? (
                    <div className="py-24 text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Belum ada tiket</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Kamu belum punya tiket di kategori ini. Yuk cari event seru!</p>
                        <Link href="/events" className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-black shadow-lg shadow-violet-500/30 hover:bg-violet-500 transition-colors">
                            Jelajahi Event
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(trx => (
                            <TicketCard key={trx.id} transaction={trx} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
