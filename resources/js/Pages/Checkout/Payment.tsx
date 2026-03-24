import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useEffect } from 'react';

interface TicketType { id: number; name: string; price: number; }
interface TransactionDetail { id: number; quantity: number; subtotal: number; ticket_type: TicketType; }
interface Payment { id: number; payment_method: string; payment_status: string; }
interface Event { id: string; title: string; banner_image: string | null; location: string; }
interface Transaction {
    id: string;
    total_amount: number;
    transaction_status: string;
    expires_at: string;
    event: Event;
    payment: Payment;
    details: TransactionDetail[];
}

const METHODS = ['Transfer', 'E-Wallet', 'Credit Card'];

function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function useCountdown(expiresAt: string) {
    const [seconds, setSeconds] = useState(() => {
        const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
        return Math.max(diff, 0);
    });

    useEffect(() => {
        if (seconds <= 0) return;
        const interval = setInterval(() => setSeconds(s => Math.max(s - 1, 0)), 1000);
        return () => clearInterval(interval);
    }, [seconds]);

    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return { seconds, display: `${mins}:${secs}` };
}

export default function CheckoutPayment({ transaction }: { transaction: Transaction }) {
    const { seconds, display } = useCountdown(transaction.expires_at);
    const [method, setMethod] = useState('Transfer');
    const [submitting, setSubmitting] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isExpired = seconds === 0;
    const urgency = seconds < 120; // under 2 min -> red

    const confirm = () => {
        setSubmitting(true);
        router.post(`/checkout/${transaction.id}/confirm`, { payment_method: method }, {
            onError: (e: any) => { setErrors(e); setSubmitting(false); },
        });
    };

    const cancel = () => {
        setCancelling(true);
        router.post(`/checkout/${transaction.id}/cancel`, {});
    };

    return (
        <DashboardLayout>
            <Head title="Pembayaran – EventHive" />

            <div className="max-w-2xl mx-auto py-10">
                {/* Timer */}
                <div className={`text-center mb-10 py-8 rounded-[2.5rem] ${isExpired ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800' : urgency ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200' : 'bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800'}`}>
                    {isExpired ? (
                        <>
                            <p className="text-4xl font-black text-red-600 mb-2">Waktu Habis!</p>
                            <p className="text-slate-500">Pesanan kamu sudah otomatis dibatalkan.</p>
                        </>
                    ) : (
                        <>
                            <p className={`text-6xl font-black tabular-nums ${urgency ? 'text-red-500' : 'text-violet-600'}`}>{display}</p>
                            <p className="text-slate-500 mt-2 font-medium">Selesaikan pembayaran sebelum waktu habis</p>
                        </>
                    )}
                </div>

                {!isExpired && (
                    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
                        {/* Order Summary */}
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white mb-4">Ringkasan Pesanan</h2>
                            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 space-y-2">
                                <p className="font-bold text-slate-900 dark:text-white">{transaction.event.title}</p>
                                <p className="text-xs text-slate-400">{transaction.event.location}</p>
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                                    {transaction.details.map(d => (
                                        <div key={d.id} className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">{d.ticket_type.name} × {d.quantity}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(Number(d.subtotal))}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-black pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-900 dark:text-white">Total</span>
                                    <span className="text-violet-600">{formatCurrency(Number(transaction.total_amount))}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h2 className="font-black text-slate-900 dark:text-white mb-4">Metode Pembayaran</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {METHODS.map(m => (
                                    <button key={m} onClick={() => setMethod(m)} className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all ${
                                        method === m ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                    }`}>{m}</button>
                                ))}
                            </div>

                            {/* Payment Instructions */}
                            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                {method === 'Transfer' && (
                                    <>
                                        <p className="font-bold text-slate-900 dark:text-white">Transfer ke:</p>
                                        <p>Bank BCA – <strong>1234567890</strong></p>
                                        <p>Atas nama: <strong>EventHive Indonesia</strong></p>
                                        <p className="text-violet-600 font-bold">Nominal: {formatCurrency(Number(transaction.total_amount))}</p>
                                    </>
                                )}
                                {method === 'E-Wallet' && (
                                    <>
                                        <p className="font-bold text-slate-900 dark:text-white">Transfer ke GoPay / OVO:</p>
                                        <p>Nomor: <strong>0812-3456-7890</strong></p>
                                        <p className="text-violet-600 font-bold">Nominal: {formatCurrency(Number(transaction.total_amount))}</p>
                                    </>
                                )}
                                {method === 'Credit Card' && (
                                    <p>Kamu akan diarahkan ke halaman pembayaran kartu kredit.</p>
                                )}
                            </div>
                        </div>

                        {errors.message && (
                            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-red-600 text-sm font-semibold">{errors.message}</div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button onClick={cancel} disabled={cancelling} className="flex-1 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:border-red-300 hover:text-red-500 transition-all">
                                {cancelling ? 'Membatalkan...' : 'Batalkan'}
                            </button>
                            <button onClick={confirm} disabled={submitting} className="flex-[2] py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black shadow-lg shadow-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-60">
                                {submitting ? 'Memproses...' : 'Konfirmasi Pembayaran ✓'}
                            </button>
                        </div>
                        <p className="text-center text-xs text-slate-400">ID Transaksi: <span className="font-mono">{transaction.id}</span></p>
                    </div>
                )}

                {isExpired && (
                    <div className="text-center">
                        <button onClick={() => router.visit('/events')} className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-bold">Kembali ke Katalog</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
