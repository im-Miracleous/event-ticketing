import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

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

function formatCurrency(n: number | string) {
    const amount = typeof n === 'number' ? n : parseFloat(String(n));
    return 'IDR ' + new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatIssuedDate(d: string) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(date)
        .find(p => p.type === 'timeZoneName')?.value ?? '';
    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${tzAbbr}`;
}

export default function PrintTicket({ ticket }: { ticket: Ticket }) {
    const transaction = ticket.detail.transaction;
    const event = transaction.event;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qr_code)}`;

    // Auto-trigger print dialog after a short delay (allows QR image to load)
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title={`E-Ticket – ${event.title} – ${ticket.ticket_type.name}`} />

            {/* Print-optimized styles */}
            <style>{`
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none !important; }
                    .print-page { page-break-inside: avoid; }
                }
                @page {
                    size: A4;
                    margin: 15mm;
                }
            `}</style>

            <div className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                {/* Top bar – visible only on screen */}
                <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black tracking-tight">EventHive</span>
                        <span className="text-slate-400 text-sm">E-Ticket Print Preview</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.print()}
                            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231a1.125 1.125 0 0 1-1.12-1.227L6.34 18m11.318-4.171a42.41 42.41 0 0 1-11.318 0m11.318 0c1.024-.147 1.9-.86 2.13-1.88L18.735 9c.174-.775-.386-1.503-1.183-1.5h-1.077c-.982 0-1.839-.675-2.071-1.631l-.253-1.042A1.125 1.125 0 0 0 13.048 4H10.95a1.125 1.125 0 0 0-1.103.827l-.253 1.042c-.232.956-1.089 1.631-2.071 1.631H6.446c-.797-.003-1.357.725-1.183 1.5l1.282 5.051c.23 1.02 1.106 1.733 2.13 1.88z" /></svg>
                            Print
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Ticket Content */}
                <div className="print-page max-w-2xl mx-auto py-10 px-6">
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#7c3aed', margin: 0 }}>EventHive</h1>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, fontFamily: 'monospace' }}>E-TICKET</p>
                    </div>

                    <hr style={{ border: 'none', borderTop: '2px solid #7c3aed', marginBottom: '24px' }} />

                    {/* Event Info */}
                    <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e1b4b', margin: '0 0 8px' }}>
                        {event.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                        <span>📅 {formatDate(event.event_date)}</span>
                        <span>🕐 {(event.start_time.includes(' ') ? event.start_time.split(' ')[1] : event.start_time).substring(0, 5)} WIB</span>
                        <span>📍 {event.location}</span>
                    </div>

                    {/* Ticket Card */}
                    <div style={{
                        border: '2px solid #7c3aed',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '24px',
                        marginBottom: '20px',
                        pageBreakInside: 'avoid',
                    }}>
                        {/* QR Code */}
                        <div style={{ flexShrink: 0 }}>
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                width={160}
                                height={160}
                                style={{ borderRadius: '12px' }}
                            />
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '18px', fontWeight: 900, color: '#1e1b4b', margin: '0 0 2px' }}>
                                        {ticket.ticket_type.name}
                                    </p>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#7c3aed', margin: 0 }}>
                                        {formatCurrency(ticket.ticket_type.price)}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    backgroundColor: '#ecfdf5',
                                    color: '#059669',
                                }}>
                                    {ticket.ticket_status}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                                <div>
                                    <p style={{ color: '#9ca3af', margin: '0 0 1px', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Guest</p>
                                    <p style={{ color: '#374151', margin: 0, fontWeight: 600 }}>{ticket.attendee?.name ?? '–'}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#9ca3af', margin: '0 0 1px', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Email</p>
                                    <p style={{ color: '#374151', margin: 0, fontWeight: 600 }}>{ticket.attendee?.email ?? '–'}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#9ca3af', margin: '0 0 1px', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Identity No.</p>
                                    <p style={{ color: '#374151', margin: 0, fontWeight: 600, fontFamily: 'monospace' }}>{ticket.attendee?.identity_number ?? '–'}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#9ca3af', margin: '0 0 1px', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Ticket ID</p>
                                    <p style={{ color: '#374151', margin: 0, fontWeight: 600, fontFamily: 'monospace', fontSize: '10px' }}>{ticket.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Info */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 20px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '12px',
                        marginBottom: '24px',
                    }}>
                        <div>
                            <span style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Order ID</span>
                            <p style={{ color: '#1e1b4b', fontWeight: 700, margin: '2px 0 0', fontFamily: 'monospace' }}>{transaction.id}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Payment</span>
                            <p style={{ color: '#059669', fontWeight: 700, margin: '2px 0 0' }}>{transaction.payment?.payment_status ?? '–'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Issued At</span>
                            <p style={{ color: '#374151', fontWeight: 700, margin: '2px 0 0' }}>{formatIssuedDate(ticket.issued_at)}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center', borderTop: '1px dashed #e5e7eb', paddingTop: '16px' }}>
                        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0 0 4px' }}>
                            Show this QR Code at the venue entrance. Do not share with unauthorized parties.
                        </p>
                        <p style={{ color: '#c4b5fd', fontSize: '10px', fontWeight: 700, margin: 0 }}>
                            Powered by EventHive
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
