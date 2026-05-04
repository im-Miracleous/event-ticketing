import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';


interface Attendee {
    name: string;
    email: string;
    phone_number: string;
    identity_number: string;
}

interface TicketType {
    name: string;
    price: number;
}

interface Event {
    title: string;
    banner_image: string | null;
    event_date: string;
    start_time: string;
    location: string;
}

interface Transaction {
    id: string;
    transaction_status: string;
    created_at: string;
    event: Event;
    payment: {
        payment_method: string;
        payment_status: string;
    } | null;
}

interface TransactionDetail {
    transaction: Transaction;
}

interface Ticket {
    id: string;
    qr_code: string;
    ticket_status: string;
    issued_at: string;
    validated_at: string | null;
    attendee: Attendee | null;
    ticket_type: TicketType;
    detail: TransactionDetail;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(n: number | string) {
    const amount = typeof n === 'number' ? n : parseFloat(String(n));
    return 'IDR ' + new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatIssuedDate(d: string) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Deduce timezone abbreviation dynamically
    const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(date)
        .find(p => p.type === 'timeZoneName')?.value ?? '';

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${tzAbbr}`;
}

// Ticket status color mapping
const TICKET_STATUS_BADGE: Record<string, string> = {
    Pending:       'bg-amber-100 text-amber-700',
    Valid:         'bg-emerald-100 text-emerald-700',
    'Checked-In':  'bg-blue-100 text-blue-700',
    Expired:       'bg-orange-100 text-orange-700',
    Failed:        'bg-red-100 text-red-600',
};

// Payment status color mapping
const PAYMENT_STATUS_BADGE: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Success: 'bg-emerald-100 text-emerald-700',
    Failed:  'bg-red-100 text-red-600',
};

// ─── QR Code Component ───────────────────────────────────────────────────────
function QRCodeDisplay({ ticket }: { ticket: Ticket }) {
    const displayStatus = ticket.validated_at ? 'Checked-In' : ticket.ticket_status;
    const size = 220;

    // Pending or Failed → show locked placeholder (no QR generated at all)
    if (displayStatus === 'Pending' || displayStatus === 'Failed') {
        return (
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-center justify-center" style={{ width: size + 32, height: size + 32 }}>
                <div className="text-center space-y-3 z-10 px-4">
                    <div className={`w-12 h-12 ${displayStatus === 'Failed' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'} rounded-2xl flex items-center justify-center ${displayStatus === 'Failed' ? 'text-red-600' : 'text-amber-600'} mx-auto shadow-sm`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">QR Code Locked</p>
                    <p className={`text-[9px] ${displayStatus === 'Failed' ? 'text-red-600' : 'text-amber-600'} font-bold leading-tight`}>
                        {displayStatus === 'Failed' ? 'Payment failed. This ticket is not valid.' : 'Complete payment to activate this ticket.'}
                    </p>
                </div>
                <div className="absolute inset-4 bg-slate-200/50 dark:bg-slate-700/50 blur-xl rounded-full" />
            </div>
        );
    }

    // Checked-In or Expired → hide QR to prevent misuse
    if (displayStatus === 'Checked-In' || displayStatus === 'Expired') {
        const isCheckedIn = displayStatus === 'Checked-In';
        return (
            <div className={`p-4 rounded-3xl border-2 border-dashed relative overflow-hidden flex items-center justify-center ${
                isCheckedIn
                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
            }`} style={{ width: size + 32, height: size + 32 }}>
                <div className="text-center space-y-3 z-10 px-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm ${
                        isCheckedIn
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                    }`}>
                        {isCheckedIn ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        )}
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest leading-tight ${
                        isCheckedIn ? 'text-blue-500' : 'text-orange-500'
                    }`}>
                        {isCheckedIn ? 'Already Used' : 'Ticket Expired'}
                    </p>
                    <p className={`text-[9px] font-bold leading-tight ${
                        isCheckedIn ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                        {isCheckedIn ? 'This ticket has been used for check-in.' : 'This ticket has expired and is no longer valid.'}
                    </p>
                </div>
                <div className={`absolute inset-4 blur-xl rounded-full ${
                    isCheckedIn ? 'bg-blue-200/30 dark:bg-blue-700/20' : 'bg-orange-200/30 dark:bg-orange-700/20'
                }`} />
            </div>
        );
    }

    // Valid → show actual QR code
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(ticket.qr_code)}`;
    return (
        <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-violet-500/10 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <img
                src={url}
                alt="QR Code"
                width={size}
                height={size}
                className="rounded-2xl"
            />
        </div>
    );
}

export default function TicketDetail({ ticket }: { ticket: Ticket }) {
    const transaction = ticket.detail.transaction;
    const displayStatus = ticket.validated_at ? 'Checked-In' : ticket.ticket_status;
    const eventDate = new Date(transaction.event.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedIssued = formatIssuedDate(ticket.issued_at);

    // Print button should only work for Valid tickets
    const canPrint = displayStatus === 'Valid';

    return (
        <DashboardLayout>
            <Head title={`Ticket ${ticket.ticket_type.name} – ${transaction.event.title}`} />

            <div className="max-w-4xl mx-auto py-8">
                {/* Back Link */}
                <Link
                    href="/my-tickets"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors mb-8 group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to My Tickets
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Ticket Pass Aesthetic */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl">
                            {/* Top Accent Bar */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-violet-600 to-indigo-600" />

                            <div className="p-8 sm:p-10">
                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-8">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${TICKET_STATUS_BADGE[displayStatus] ?? 'bg-slate-100 text-slate-500'}`}>
                                        {displayStatus}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">Ticket ID</p>
                                        <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{ticket.id}</p>
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="mb-10">
                                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                                        {transaction.event.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-y-4 gap-x-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formattedDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Time</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    {(transaction.event.start_time.includes(' ') ? transaction.event.start_time.split(' ')[1] : transaction.event.start_time).substring(0, 5)} WIB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendee Divider */}
                                <div className="relative h-px bg-slate-100 dark:bg-slate-800 my-10 flex items-center justify-center">
                                    <div className="absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800" />
                                    <div className="absolute right-0 translate-x-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800" />
                                    <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Attendee Details</span>
                                </div>

                                {/* Attendee Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Ticket Holder Name</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{ticket.attendee?.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Ticket Type</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-black text-violet-600 dark:text-violet-400 tracking-tight">{ticket.ticket_type.name}</p>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <p className="text-xs font-bold text-slate-500">{formatCurrency(ticket.ticket_type.price)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Email</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ticket.attendee?.email || '–'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Identity Number</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono tracking-wider">{ticket.attendee?.identity_number || '–'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Footer / Perforation Aesthetic */}
                            <div className="bg-slate-50 dark:bg-slate-800/20 px-10 py-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{transaction.event.location}</p>
                                </div>
                                <div className="sm:text-right text-center">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Issued At</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formattedIssued}</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Order ID</p>
                                    <Link href={`/my-tickets`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                                        {transaction.id}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Payment Status */}
                                {transaction.payment && (
                                    <div className="text-center sm:text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Payment Status</p>
                                        <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black ${PAYMENT_STATUS_BADGE[transaction.payment.payment_status] ?? 'bg-slate-100 text-slate-500'}`}>
                                            {transaction.payment.payment_status}
                                        </span>
                                    </div>
                                )}
                                <div className="text-center sm:text-right">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Payment Method</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{transaction.payment?.payment_method || '–'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: QR Sidebar */}
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <QRCodeDisplay ticket={ticket} />
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="text-amber-600 mt-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 mb-1">Usage Guide</h4>
                                    <p className="text-xs text-amber-800/70 dark:text-amber-400/70 leading-relaxed">
                                        Show this QR code to the staff at the event entrance. Do not share this QR code with anyone other than the event organizer.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {canPrint ? (
                            <a
                                href={`/my-tickets/${ticket.qr_code}/print`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231a1.125 1.125 0 0 1-1.12-1.227L6.34 18m11.318-4.171a42.41 42.41 0 0 1-11.318 0m11.318 0c1.024-.147 1.9-.86 2.13-1.88L18.735 9c.174-.775-.386-1.503-1.183-1.5h-1.077c-.982 0-1.839-.675-2.071-1.631l-.253-1.042A1.125 1.125 0 0 0 13.048 4H10.95a1.125 1.125 0 0 0-1.103.827l-.253 1.042c-.232.956-1.089 1.631-2.071 1.631H6.446c-.797-.003-1.357.725-1.183 1.5l1.282 5.051c.23 1.02 1.106 1.733 2.13 1.88z" /></svg>
                                Print Ticket
                            </a>
                        ) : (
                            <button
                                disabled
                                className="w-full py-4 rounded-2xl bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-black cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231a1.125 1.125 0 0 1-1.12-1.227L6.34 18m11.318-4.171a42.41 42.41 0 0 1-11.318 0m11.318 0c1.024-.147 1.9-.86 2.13-1.88L18.735 9c.174-.775-.386-1.503-1.183-1.5h-1.077c-.982 0-1.839-.675-2.071-1.631l-.253-1.042A1.125 1.125 0 0 0 13.048 4H10.95a1.125 1.125 0 0 0-1.103.827l-.253 1.042c-.232.956-1.089 1.631-2.071 1.631H6.446c-.797-.003-1.357.725-1.183 1.5l1.282 5.051c.23 1.02 1.106 1.733 2.13 1.88z" /></svg>
                                Print Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
