import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface Attendee { name: string; email: string; }
interface Ticket { id: string; qr_code: string; ticket_status: string; attendee: Attendee | null; }
interface TicketType { id: number; name: string; price: number; }
interface TransactionDetail { id: number; quantity: number; ticket_type: TicketType; tickets: Ticket[]; }
interface Payment { payment_method: string; payment_status: string; }
interface Event { id: string; title: string; banner_image: string | null; event_date: string; location: string; }
interface Transaction {
    id: string;
    total_amount: number;
    transaction_status: string;
    event: Event;
    payment: Payment;
    details: TransactionDetail[];
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CheckoutResult({ transaction }: { transaction: Transaction }) {
    const isSuccess = transaction.transaction_status === 'Success';
    const isFailed = transaction.transaction_status === 'Failed';
    const isPending = transaction.transaction_status === 'Pending';

    return (
        <DashboardLayout>
            <Head title={`Booking ${isSuccess ? 'Berhasil' : isPending ? 'Menunggu' : 'Dibatalkan'} – EventHive`} />

            <div className="max-w-2xl mx-auto py-10 space-y-8">
                {/* Status Banner */}
                <div className={`text-center py-12 rounded-[2.5rem] ${
                    isSuccess ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800'
                    : isPending ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800'
                    : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                }`}>
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl ${
                        isSuccess ? 'bg-emerald-100 dark:bg-emerald-900/30' : isPending ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                        {isSuccess ? '✓' : isPending ? '⏳' : '✕'}
                    </div>
                    <h1 className={`text-2xl font-black mb-2 ${isSuccess ? 'text-emerald-700' : isPending ? 'text-amber-700' : 'text-red-600'}`}>
                        {isSuccess ? 'Pembayaran Berhasil!' : isPending ? 'Menunggu Pembayaran' : 'Transaksi Dibatalkan'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isSuccess ? 'Tiket kamu sudah siap. Tunjukkan QR code saat masuk event.' 
                         : isPending ? 'Segera selesaikan pembayaran sebelum waktu habis.'
                         : 'Stok tiket telah dikembalikan.'}
                    </p>
                </div>

                {/* Transaction Summary */}
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        {transaction.event.banner_image && (
                            <img src={transaction.event.banner_image} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                        )}
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white text-lg leading-snug">{transaction.event.title}</h2>
                            <p className="text-slate-500 text-sm mt-1">{formatDate(transaction.event.event_date)}</p>
                            <p className="text-slate-400 text-xs">{transaction.event.location}</p>
                        </div>
                    </div>

                    <div className="space-y-2 py-4 border-t border-b border-slate-100 dark:border-slate-800">
                        {transaction.details.map(d => (
                            <div key={d.id} className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">{d.ticket_type.name} × {d.quantity}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(d.ticket_type.price * d.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-black pt-2">
                            <span className="text-slate-900 dark:text-white">Total</span>
                            <span className="text-violet-600">{formatCurrency(Number(transaction.total_amount))}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">ID Transaksi</p>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-xs">{transaction.id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Metode Bayar</p>
                            <p className="font-bold text-slate-900 dark:text-white">{transaction.payment?.payment_method ?? '–'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Status</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-black ${
                                isSuccess ? 'bg-emerald-100 text-emerald-700' : isFailed ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                            }`}>{transaction.transaction_status}</span>
                        </div>
                    </div>
                </div>

                {/* Tickets / QR Codes */}
                {isSuccess && (
                    <div className="space-y-4">
                        <h2 className="font-black text-slate-900 dark:text-white">E-Tickets</h2>
                        {transaction.details.flatMap(d => d.tickets).map((ticket, i) => (
                            <div key={ticket.id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 flex items-center gap-6">
                                {/* Simple QR placeholder visualisation */}
                                <div className="shrink-0">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(ticket.qr_code)}`} 
                                        alt="QR Code" 
                                        className="w-20 h-20 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">Tiket #{i + 1}</p>
                                    <p className="text-xs font-mono text-slate-400 mt-1">{ticket.id}</p>
                                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                        ticket.ticket_status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-600'
                                    }`}>{ticket.ticket_status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 pt-2">
                    <Link href="/events" className="flex-1 text-center py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:border-violet-500 transition-all">
                        Kembali ke Katalog
                    </Link>
                    {isSuccess && (
                        <Link href="/my-tickets" className="flex-1 text-center py-4 rounded-2xl bg-violet-600 text-white font-black shadow-lg shadow-violet-500/30 hover:bg-violet-500 transition-all">
                            Lihat Tiket Saya
                        </Link>
                    )}
                    {isPending && (
                        <>
                        <Link href={`/checkout/${transaction.id}/payment`} className="flex-1 text-center py-4 rounded-2xl bg-violet-600 text-white font-black shadow-lg shadow-violet-500/30 hover:bg-violet-500 transition-all">
                            Lanjutkan Pembayaran
                        </Link>
                        <Link href={`/checkout/${transaction.id}/sync-payment`} className="flex-1 text-center py-4 rounded-2xl border border-violet-600 text-violet-600 font-bold hover:bg-violet-50 transition-all">
                            Refresh Status
                        </Link>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
