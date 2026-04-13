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

function QRCode({ value, size = 200, isLocked = false }: { value: string; size?: number, isLocked?: boolean }) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    
    if (isLocked) {
        return (
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-center justify-center group" style={{ width: size + 32, height: size + 32 }}>
                <div className="text-center space-y-3 z-10 px-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mx-auto shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">QR Code Terkunci</p>
                    <p className="text-[9px] text-amber-600 font-bold leading-tight">Selesaikan pembayaran untuk mengaktifkan tiket</p>
                </div>
                {/* Decorative blurred background blocks */}
                <div className="absolute inset-4 bg-slate-200/50 dark:bg-slate-700/50 blur-xl rounded-full" />
            </div>
        );
    }

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
    const isLocked = transaction.transaction_status !== 'Success';
    const eventDate = new Date(transaction.event.event_date);
    const formattedDate = eventDate.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const formattedIssued = new Date(ticket.issued_at).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <DashboardLayout>
            <Head title={`Tiket ${ticket.ticket_type.name} – ${ticket.detail.transaction.event.title}`} />

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
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                        ticket.validated_at ? 'bg-blue-100 text-blue-700'
                                        : ticket.ticket_status === 'Issued' ? 'bg-emerald-100 text-emerald-700'
                                        : ticket.ticket_status === 'Pending' ? 'bg-amber-100 text-amber-700'
                                        : ticket.ticket_status === 'Expired' ? 'bg-orange-100 text-orange-700'
                                        : ticket.ticket_status === 'Failed' ? 'bg-red-100 text-red-700'
                                        : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {ticket.validated_at ? 'Checked-In' : ticket.ticket_status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">Ticket ID</p>
                                        <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{ticket.id}</p>
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="mb-10">
                                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                                        {ticket.detail.transaction.event.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-y-4 gap-x-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Tanggal</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formattedDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Waktu</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ticket.detail.transaction.event.start_time.substring(0, 5)} WIB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendee Divider */}
                                <div className="relative h-px bg-slate-100 dark:bg-slate-800 my-10 flex items-center justify-center">
                                    <div className="absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800" />
                                    <div className="absolute right-0 translate-x-1/2 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800" />
                                    <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Detail Penonton</span>
                                </div>

                                {/* Attendee Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Nama Pemegang Tiket</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{ticket.attendee?.name || 'BELUM DIISI'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Tipe Tiket</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-black text-violet-600 dark:text-violet-400 uppercase tracking-tight">{ticket.ticket_type.name}</p>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <p className="text-xs font-bold text-slate-500">IDR {ticket.ticket_type.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Email</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ticket.attendee?.email || '–'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">No. Identitas</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono tracking-wider">{ticket.attendee?.identity_number || '–'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Footer / Perforation Aesthetic */}
                            <div className="bg-slate-50 dark:bg-slate-800/20 px-10 py-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Lokasi</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{ticket.detail.transaction.event.location}</p>
                                </div>
                                <div className="sm:text-right text-center">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Diterbitkan Pada</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formattedIssued}</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Order ID</p>
                                    <Link href={`/my-tickets`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                                        {ticket.detail.transaction.id}
                                    </Link>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Metode Bayar</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ticket.detail.transaction.payment?.payment_method || '–'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: QR Sidebar */}
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <QRCode value={ticket.qr_code} size={220} isLocked={isLocked} />
                            {isLocked && (
                                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                                    Ticket not active (Check status)
                                </p>
                            )}
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="text-amber-600 mt-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 mb-1">Panduan Penggunaan</h4>
                                    <p className="text-xs text-amber-800/70 dark:text-amber-400/70 leading-relaxed">
                                        Tunjukkan QR code ini kepada petugas di pintu masuk lokasi acara. Jangan berikan QR code ini kepada siapapun selain penyelenggara event.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => window.print()}
                            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231a1.125 1.125 0 0 1-1.12-1.227L6.34 18m11.318-4.171a42.41 42.41 0 0 1-11.318 0m11.318 0c1.024-.147 1.9-.86 2.13-1.88L18.735 9c.174-.775-.386-1.503-1.183-1.5h-1.077c-.982 0-1.839-.675-2.071-1.631l-.253-1.042A1.125 1.125 0 0 0 13.048 4H10.95a1.125 1.125 0 0 0-1.103.827l-.253 1.042c-.232.956-1.089 1.631-2.071 1.631H6.446c-.797-.003-1.357.725-1.183 1.5l1.282 5.051c.23 1.02 1.106 1.733 2.13 1.88z" /></svg>
                            Print Ticket
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
