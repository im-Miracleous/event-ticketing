import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useMemo } from 'react';

interface TicketType {
    id: number;
    name: string;
    price: number;
    available_stock: number;
}

interface Event {
    id: string;
    title: string;
    banner_image: string | null;
    event_date: string;
    start_time: string;
    location: string;
    format: string;
    ticket_types: TicketType[];
}

interface CartItem {
    ticket_type_id: number;
    ticket_type: TicketType;
    quantity: number;
}

interface Attendee {
    name: string;
    email: string;
}

interface Props {
    event: Event;
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CheckoutShow({ event }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [step, setStep] = useState<'select' | 'attendees'>('select');
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const totalTickets = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((s, c) => s + c.ticket_type.price * c.quantity, 0), [cart]);

    const updateQty = (ticketType: TicketType, delta: number) => {
        setErrors({});
        setCart(prev => {
            const existing = prev.find(c => c.ticket_type_id === ticketType.id);
            const newQty = (existing?.quantity ?? 0) + delta;

            if (newQty <= 0) return prev.filter(c => c.ticket_type_id !== ticketType.id);
            if (newQty > ticketType.available_stock) {
                setErrors({ [ticketType.id]: `Stok tersedia: ${ticketType.available_stock}` });
                return prev;
            }

            if (existing) return prev.map(c => c.ticket_type_id === ticketType.id ? { ...c, quantity: newQty } : c);
            return [...prev, { ticket_type_id: ticketType.id, ticket_type: ticketType, quantity: newQty }];
        });
    };

    const getQty = (id: number) => cart.find(c => c.ticket_type_id === id)?.quantity ?? 0;

    const goToAttendees = () => {
        if (totalTickets === 0) return;
        setAttendees(Array.from({ length: totalTickets }, () => ({ name: '', email: '' })));
        setStep('attendees');
    };

    const updateAttendee = (idx: number, field: keyof Attendee, value: string) => {
        setAttendees(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
    };

    const submit = () => {
        setSubmitting(true);
        router.post('/checkout', {
            event_id: event.id,
            items: cart.map(c => ({ ticket_type_id: c.ticket_type_id, quantity: c.quantity })),
            attendees: attendees as any,
        }, {
            onError: (errs: any) => {
                setErrors(errs);
                setSubmitting(false);
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Checkout – ${event.title}`} />

            <div className="max-w-6xl mx-auto py-6">
                {/* Back */}
                <Link href={`/events`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-8 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                    Kembali ke katalog
                </Link>

                {/* Steps indicator */}
                <div className="flex items-center gap-3 mb-10">
                    {['Pilih Tiket', 'Data Penonton', 'Pembayaran'].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors ${
                                (step === 'select' && i === 0) || (step === 'attendees' && i === 1) 
                                ? 'bg-violet-600 text-white' 
                                : i < (step === 'attendees' ? 1 : 0) ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>{i + 1}</div>
                            <span className={`text-sm font-bold hidden sm:block ${
                                (step === 'select' && i === 0) || (step === 'attendees' && i === 1) ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                            }`}>{s}</span>
                            {i < 2 && <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 'select' ? (
                            <>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Pilih Kategori Tiket</h2>
                                {event.ticket_types.length === 0 ? (
                                    <p className="text-slate-500">Belum ada tipe tiket untuk event ini.</p>
                                ) : event.ticket_types.map(tt => (
                                    <div key={tt.id} className={`p-6 rounded-[2rem] border-2 transition-all ${
                                        getQty(tt.id) > 0 ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
                                    }`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white">{tt.name}</h3>
                                                <p className="text-2xl font-black text-violet-600 mt-1">{formatCurrency(tt.price)}</p>
                                                <p className={`text-xs mt-2 font-semibold ${tt.available_stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {tt.available_stock === 0 ? '🔴 Habis' : `${tt.available_stock} tiket tersedia`}
                                                </p>
                                            </div>
                                            {tt.available_stock > 0 && (
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateQty(tt, -1)} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 font-black text-slate-700 dark:text-white hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors">−</button>
                                                    <span className="w-6 text-center text-lg font-black text-slate-900 dark:text-white">{getQty(tt.id)}</span>
                                                    <button onClick={() => updateQty(tt, 1)} className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 font-black text-white transition-colors">+</button>
                                                </div>
                                            )}
                                        </div>
                                        {errors[tt.id] && (
                                            <p className="mt-2 text-xs text-red-500 font-bold">{errors[tt.id]}</p>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={() => setStep('select')} className="text-sm text-violet-600 font-bold hover:underline">← Ubah Tiket</button>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Data Penonton</h2>
                                </div>
                                <p className="text-sm text-slate-500 -mt-4 mb-6">Isi identitas untuk setiap tiket yang dibeli.</p>

                                {errors.message && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold">{errors.message}</div>
                                )}

                                {attendees.map((att, idx) => {
                                    // Figure out which ticket type this slot belongs to
                                    let ticketLabel = '';
                                    let count = 0;
                                    for (const c of cart) {
                                        if (idx < count + c.quantity) {
                                            ticketLabel = `#${idx + 1} – ${c.ticket_type.name}`;
                                            break;
                                        }
                                        count += c.quantity;
                                    }
                                    return (
                                        <div key={idx} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
                                            <h4 className="font-black text-slate-900 dark:text-white text-sm">Penonton {ticketLabel}</h4>
                                            <input
                                                type="text"
                                                value={att.name}
                                                onChange={e => updateAttendee(idx, 'name', e.target.value)}
                                                placeholder="Nama lengkap"
                                                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                            />
                                            <input
                                                type="email"
                                                value={att.email}
                                                onChange={e => updateAttendee(idx, 'email', e.target.value)}
                                                placeholder="Email"
                                                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                                            />
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* Order Summary */}
                    <aside className="space-y-6">
                        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sticky top-6">
                            {/* Event Info */}
                            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                                <img src={event.banner_image ?? ''} alt={event.title} className="w-full h-32 object-cover rounded-2xl mb-4" />
                                <h3 className="font-black text-slate-900 dark:text-white line-clamp-2">{event.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">{formatDate(event.event_date)}</p>
                                <p className="text-xs text-slate-500">{event.location}</p>
                            </div>

                            {/* Cart Summary */}
                            <div className="space-y-2 mb-6">
                                {cart.length === 0 ? (
                                    <p className="text-sm text-slate-400">Belum ada tiket dipilih.</p>
                                ) : cart.map(c => (
                                    <div key={c.ticket_type_id} className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">{c.ticket_type.name} × {c.quantity}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(c.ticket_type.price * c.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between font-black text-slate-900 dark:text-white py-4 border-t border-slate-100 dark:border-slate-800 mb-6">
                                <span>Total</span>
                                <span className="text-violet-600">{formatCurrency(totalPrice)}</span>
                            </div>

                            {step === 'select' ? (
                                <button
                                    onClick={goToAttendees}
                                    disabled={totalTickets === 0}
                                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black transition-all shadow-lg shadow-violet-500/30 active:scale-[0.98]"
                                >
                                    Lanjutkan ({totalTickets} tiket)
                                </button>
                            ) : (
                                <button
                                    onClick={submit}
                                    disabled={submitting || attendees.some(a => !a.name || !a.email)}
                                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black transition-all shadow-lg shadow-violet-500/30 active:scale-[0.98]"
                                >
                                    {submitting ? 'Memproses...' : 'Pesan Sekarang →'}
                                </button>
                            )}

                            <p className="text-[10px] text-slate-400 text-center mt-3">Setelah memesan, kamu punya <strong>15 menit</strong> untuk menyelesaikan pembayaran.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
}
