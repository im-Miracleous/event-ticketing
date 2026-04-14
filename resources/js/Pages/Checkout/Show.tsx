import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState, useMemo, useEffect } from 'react';

/* ─── Type Definitions ─────────────────────────────────────── */
interface TicketType {
    id: number;
    name: string;
    price: number;
    available_stock: number;
}

interface Promotion {
    id: number;
    code: string;
    discount_amount: number;
    discount_type: 'percentage' | 'fixed';
    max_discount_amount: number | null;
    min_spending: number;
    quota: number;
    start_date: string | null;
    end_date: string | null;
}

interface Event {
    id: string;
    title: string;
    banner_image: string | null;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    format: string;
    rules_policies: string | null;
    ticket_types: TicketType[];
    promotions: Promotion[];
}

interface CartItem {
    ticket_type_id: number;
    ticket_type: TicketType;
    quantity: number;
}

interface Attendee {
    name: string;
    email: string;
    phone_number: string;
}

interface Props {
    event: Event;
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

/* ─── Step Indicators ──────────────────────────────────────── */
const STEPS = [
    { key: 'select', label: 'Select Tickets', icon: '🎟️' },
    { key: 'checkout', label: 'Check Out', icon: '📋' },
    { key: 'payment', label: 'Payment', icon: '💳' },
] as const;

type StepKey = typeof STEPS[number]['key'];

function StepIndicator({ currentStep }: { currentStep: StepKey }) {
    const currentIdx = STEPS.findIndex(s => s.key === currentStep);
    return (
        <div className="flex items-center gap-2 sm:gap-3 mb-10">
            {STEPS.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                        i < currentIdx
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : i === currentIdx
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                        {i < currentIdx ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm font-bold hidden sm:block ${
                        i === currentIdx ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}>{s.label}</span>
                    {i < STEPS.length - 1 && (
                        <div className={`w-8 h-0.5 hidden sm:block transition-colors ${
                            i < currentIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─── Terms & Conditions Modal ─────────────────────────────── */
function TermsModal({
    isOpen,
    onClose,
    onAccept,
    rulesText,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    rulesText: string | null;
}) {
    const [agreed, setAgreed] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl shadow-black/30 animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                        Terms & Conditions
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Please read the event rules carefully before proceeding.</p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
                        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                            {rulesText || 'By purchasing a ticket, you agree to the event organizer\'s terms and conditions. All sales are final unless otherwise stated by the organizer. Attendees must present a valid ticket (QR code) at the venue entrance.'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                                className="sr-only peer"
                            />
                            <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 peer-checked:border-violet-600 peer-checked:bg-violet-600 transition-all flex items-center justify-center">
                                {agreed && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-violet-600 transition-colors">
                            I have read and agree to the <span className="font-bold text-violet-600">Terms & Conditions</span>
                        </span>
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:border-slate-300 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onAccept}
                            disabled={!agreed}
                            className="flex-[2] py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-black transition-all shadow-lg shadow-violet-500/30 disabled:shadow-none active:scale-[0.98]"
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Checkout Component ──────────────────────────────── */
export default function CheckoutShow({ event }: Props) {
    const user = (usePage().props as any).auth?.user;

    // State Machine
    const [step, setStep] = useState<StepKey>('select');
    const [showTermsModal, setShowTermsModal] = useState(false);

    // Cart
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartErrors, setCartErrors] = useState<Record<string, string>>({});

    // Checkout form (buyer info)
    const [buyerInfo, setBuyerInfo] = useState({
        firstName: user?.name?.split(' ')[0] ?? '',
        lastName: user?.name?.split(' ').slice(1).join(' ') ?? '',
        email: user?.email ?? '',
        phone: '',
    });
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);

    // Promotions
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
    const [promoMessage, setPromoMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Payment
    const [submitting, setSubmitting] = useState(false);
    const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});

    // Computed
    const totalTickets = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((s, c) => s + c.ticket_type.price * c.quantity, 0), [cart]);
    
    const discount = useMemo(() => {
        if (!appliedPromo) return 0;
        if (totalPrice < appliedPromo.min_spending) return 0;
        
        let d = 0;
        if (appliedPromo.discount_type === 'percentage') {
            d = totalPrice * (appliedPromo.discount_amount / 100);
            if (appliedPromo.max_discount_amount) {
                d = Math.min(d, appliedPromo.max_discount_amount);
            }
        } else {
            d = appliedPromo.discount_amount;
        }
        return Math.min(d, totalPrice); // Can't discount more than total
    }, [appliedPromo, totalPrice]);
    
    const finalPrice = totalPrice - discount;

    // Watch for price changes that might invalidate promo
    useEffect(() => {
        if (appliedPromo && totalPrice < appliedPromo.min_spending) {
            setAppliedPromo(null);
            setPromoMessage({ type: 'error', text: 'Promo removed: Minimum spending is no longer met.' });
        }
        if (totalPrice === 0 && appliedPromo) {
             setAppliedPromo(null);
        }
    }, [totalPrice, appliedPromo]);

    /* ─── Cart Actions ─── */
    const updateQty = (ticketType: TicketType, delta: number) => {
        setCartErrors({});
        setCart(prev => {
            const existing = prev.find(c => c.ticket_type_id === ticketType.id);
            const newQty = (existing?.quantity ?? 0) + delta;

            if (newQty <= 0) return prev.filter(c => c.ticket_type_id !== ticketType.id);
            if (newQty > Math.min(ticketType.available_stock, 10)) {
                setCartErrors({ [ticketType.id]: `Maximum: ${Math.min(ticketType.available_stock, 10)} tickets` });
                return prev;
            }

            if (existing) return prev.map(c => c.ticket_type_id === ticketType.id ? { ...c, quantity: newQty } : c);
            return [...prev, { ticket_type_id: ticketType.id, ticket_type: ticketType, quantity: newQty }];
        });
    };

    const getQty = (id: number) => cart.find(c => c.ticket_type_id === id)?.quantity ?? 0;

    /* ─── Step Transitions ─── */
    const handleBuyTickets = () => {
        if (totalTickets === 0) return;
        setShowTermsModal(true);
    };

    const handleTermsAccepted = () => {
        setShowTermsModal(false);
        // Initialize attendees from current user data
        setAttendees(
            Array.from({ length: totalTickets }, () => ({
                name: user?.name ?? '',
                email: user?.email ?? '',
                phone_number: '',
            }))
        );
        setStep('checkout');
    };

    const handleCheckoutContinue = () => {
        if (!privacyAgreed) return;
        setStep('payment');
    };

    const handleBackToSelect = () => {
        setStep('select');
    };

    const handleBackToCheckout = () => {
        setStep('checkout');
    };

    /* ─── Attendee Update ─── */
    const updateAttendee = (idx: number, field: keyof Attendee, value: string) => {
        setAttendees(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
    };

    const handleApplyPromo = () => {
        setPromoMessage(null);
        if (!promoInput.trim()) return;

        const promo = event.promotions?.find(p => p.code.toLowerCase() === promoInput.trim().toLowerCase());
        
        if (!promo) {
            setPromoMessage({ type: 'error', text: 'Kode promo tidak ditemukan.' });
            return;
        }
        if (promo.quota <= 0) {
            setPromoMessage({ type: 'error', text: 'Kuota promo sudah habis.' });
            return;
        }
        if (totalPrice < promo.min_spending) {
            setPromoMessage({ type: 'error', text: `Minimal belanja ${formatCurrency(promo.min_spending)} diperlukan.` });
            return;
        }

        const now = new Date();
        if (promo.start_date && new Date(promo.start_date) > now) {
            setPromoMessage({ type: 'error', text: 'Promo belum aktif.' });
            return;
        }
        if (promo.end_date && new Date(promo.end_date) < now) {
            setPromoMessage({ type: 'error', text: 'Promo sudah kadaluarsa.' });
            return;
        }

        setAppliedPromo(promo);
        setPromoMessage({ type: 'success', text: 'Promo berhasil digunakan!' });
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoMessage(null);
    };

    /* ─── Submit Order ─── */
    const submitOrder = () => {
        setSubmitting(true);
        setSubmitErrors({});
        router.post('/checkout', {
            event_id: event.id,
            items: cart.map(c => ({ ticket_type_id: c.ticket_type_id, quantity: c.quantity })),
            attendees: attendees as any,
            promotion_id: appliedPromo?.id,
        }, {
            onError: (errs: any) => {
                setSubmitErrors(errs);
                setSubmitting(false);
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={`Checkout – ${event.title}`} />

            <div className="max-w-6xl mx-auto py-6">
                {/* Back to Event */}
                <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-8 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to event details
                </Link>

                {/* Step Indicator */}
                <StepIndicator currentStep={step} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ─── Main Panel ─── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ══════════ STEP 1: SELECT TICKETS ══════════ */}
                        {step === 'select' && (
                            <>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Select Your Tickets</h2>
                                {event.ticket_types.length === 0 ? (
                                    <p className="text-slate-500">No ticket types available for this event yet.</p>
                                ) : event.ticket_types.map(tt => (
                                    <div key={tt.id} className={`p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                                        getQty(tt.id) > 0
                                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
                                    }`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white">{tt.name}</h3>
                                                <p className="text-2xl font-black text-violet-600 mt-1">{formatCurrency(tt.price)}</p>
                                                <p className={`text-xs mt-2 font-semibold ${tt.available_stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {tt.available_stock === 0 ? '🔴 Sold Out' : `${tt.available_stock} tickets available`}
                                                </p>
                                            </div>
                                            {tt.available_stock > 0 ? (
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateQty(tt, -1)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 font-black text-slate-700 dark:text-white hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors text-lg">−</button>
                                                    <span className="w-6 text-center text-lg font-black text-slate-900 dark:text-white tabular-nums">{getQty(tt.id)}</span>
                                                    <button onClick={() => updateQty(tt, 1)} className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 font-black text-white transition-colors text-lg shadow-lg shadow-violet-500/30">+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => router.post('/waiting-list', { event_id: event.id, ticket_type_id: tt.id }, { preserveScroll: true })}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold text-amber-600 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                                >
                                                    📋 Join Waiting List
                                                </button>
                                            )}
                                        </div>
                                        {cartErrors[tt.id] && (
                                            <p className="mt-2 text-xs text-red-500 font-bold">{cartErrors[tt.id]}</p>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ══════════ STEP 2: CHECK OUT (Buyer + Attendees) ══════════ */}
                        {step === 'checkout' && (
                            <>
                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={handleBackToSelect} className="text-sm text-violet-600 font-bold hover:underline flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                        Change Tickets
                                    </button>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Check Out</h2>
                                </div>

                                {/* Buyer Information */}
                                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 space-y-5">
                                    <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg>
                                        Buyer Information
                                    </h3>
                                    <p className="text-sm text-slate-500 -mt-3">Your personal information has been pre-filled from your account.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">First Name</label>
                                            <input
                                                type="text"
                                                value={buyerInfo.firstName}
                                                onChange={e => setBuyerInfo(p => ({ ...p, firstName: e.target.value }))}
                                                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Last Name</label>
                                            <input
                                                type="text"
                                                value={buyerInfo.lastName}
                                                onChange={e => setBuyerInfo(p => ({ ...p, lastName: e.target.value }))}
                                                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={buyerInfo.email}
                                            onChange={e => setBuyerInfo(p => ({ ...p, email: e.target.value }))}
                                            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={buyerInfo.phone}
                                            onChange={e => setBuyerInfo(p => ({ ...p, phone: e.target.value }))}
                                            placeholder="+62 812 3456 7890"
                                            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Attendee Information */}
                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
                                        Attendee Details
                                    </h3>
                                    <p className="text-sm text-slate-500 -mt-2">Please provide details for each ticket holder.</p>

                                    {attendees.map((att, idx) => {
                                        let ticketLabel = '';
                                        let count = 0;
                                        for (const c of cart) {
                                            if (idx < count + c.quantity) {
                                                ticketLabel = `${c.ticket_type.name}`;
                                                break;
                                            }
                                            count += c.quantity;
                                        }
                                        return (
                                            <div key={idx} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
                                                <h4 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center text-xs font-black">{idx + 1}</span>
                                                    Attendee #{idx + 1} – {ticketLabel}
                                                </h4>
                                                <input
                                                    type="text"
                                                    value={att.name}
                                                    onChange={e => updateAttendee(idx, 'name', e.target.value)}
                                                    placeholder="Full name"
                                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                                                />
                                                <input
                                                    type="email"
                                                    value={att.email}
                                                    onChange={e => updateAttendee(idx, 'email', e.target.value)}
                                                    placeholder="Email address"
                                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Privacy Agreement */}
                                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={privacyAgreed}
                                                onChange={() => setPrivacyAgreed(!privacyAgreed)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 peer-checked:border-violet-600 peer-checked:bg-violet-600 transition-all flex items-center justify-center">
                                                {privacyAgreed && (
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            I agree with <span className="font-bold text-violet-600">EventHive Terms and Conditions</span> and <span className="font-bold text-violet-600">Privacy Policy</span>. I understand that my personal information will be processed in accordance with the privacy policy.
                                        </span>
                                    </label>
                                </div>
                            </>
                        )}

                        {/* ══════════ STEP 3: PAYMENT SUMMARY ══════════ */}
                        {step === 'payment' && (
                            <>
                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={handleBackToCheckout} className="text-sm text-violet-600 font-bold hover:underline flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                        Back to Check Out
                                    </button>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Payment</h2>
                                </div>

                                {/* Order Review */}
                                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 space-y-6">
                                    <h3 className="font-black text-slate-900 dark:text-white">Order Review</h3>

                                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-5 space-y-3">
                                        <div className="flex items-center gap-4">
                                            {event.banner_image && (
                                                <img src={event.banner_image} alt={event.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                            )}
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{event.title}</p>
                                                <p className="text-xs text-slate-500">{formatDate(event.event_date)} · {event.location}</p>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                                            {cart.map(c => (
                                                <div key={c.ticket_type_id} className="flex justify-between text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">{c.ticket_type.name} × {c.quantity}</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(c.ticket_type.price * c.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between font-black pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-900 dark:text-white">Total</span>
                                            <span className="text-violet-600 text-lg">{formatCurrency(finalPrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buyer Summary */}
                                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 space-y-4">
                                    <h3 className="font-black text-slate-900 dark:text-white">Buyer Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Name</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{buyerInfo.firstName} {buyerInfo.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Email</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{buyerInfo.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Phone</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{buyerInfo.phone || '—'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Notice */}
                                <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border border-violet-200 dark:border-violet-800 rounded-[2rem] p-6 text-center space-y-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-800/40">
                                        <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white mb-1">Secure Payment via DOKU</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            You will be redirected to DOKU's secure payment gateway to select your preferred payment method and complete the transaction.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                                            Encrypted & Secure
                                        </span>
                                        <span>•</span>
                                        <span>Virtual Account</span>
                                        <span>•</span>
                                        <span>E-Wallet</span>
                                        <span>•</span>
                                        <span>Credit Card</span>
                                    </div>
                                </div>

                                {submitErrors.message && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 text-sm font-semibold">
                                        {submitErrors.message}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ─── Order Summary Sidebar ─── */}
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
                                    <p className="text-sm text-slate-400">No tickets selected yet.</p>
                                ) : cart.map(c => (
                                    <div key={c.ticket_type_id} className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">{c.ticket_type.name} × {c.quantity}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(c.ticket_type.price * c.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code Input (Only if total Price > 0) */}
                            {totalPrice > 0 && (
                                <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Promo Code</label>
                                    {!appliedPromo ? (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={promoInput} 
                                                onChange={e => setPromoInput(e.target.value)} 
                                                placeholder="Enter code..." 
                                                className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none uppercase"
                                            />
                                            <button onClick={handleApplyPromo} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors">Apply</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-emerald-600 font-black">✓</span>
                                                <span className="font-bold text-slate-900 dark:text-white">{appliedPromo.code}</span>
                                            </div>
                                            <button onClick={handleRemovePromo} className="text-xs text-red-500 hover:text-red-700 font-bold">Remove</button>
                                        </div>
                                    )}
                                    {promoMessage && (
                                        <p className={`mt-2 text-xs font-bold ${promoMessage.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {promoMessage.text}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2 py-4 border-t border-slate-100 dark:border-slate-800 mb-6">
                                <div className="flex justify-between font-bold text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between font-bold text-sm text-emerald-600">
                                        <span>Discount ({appliedPromo?.code})</span>
                                        <span>-{formatCurrency(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-black text-slate-900 dark:text-white text-lg pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span>Total</span>
                                    <span className="text-violet-600">{formatCurrency(finalPrice)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {step === 'select' && (
                                <button
                                    onClick={handleBuyTickets}
                                    disabled={totalTickets === 0}
                                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-2xl font-black transition-all shadow-lg shadow-violet-500/30 disabled:shadow-none active:scale-[0.98]"
                                >
                                    Buy Tickets ({totalTickets})
                                </button>
                            )}
                            {step === 'checkout' && (
                                <button
                                    onClick={handleCheckoutContinue}
                                    disabled={!privacyAgreed || attendees.some(a => !a.name || !a.email)}
                                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-2xl font-black transition-all shadow-lg shadow-violet-500/30 disabled:shadow-none active:scale-[0.98]"
                                >
                                    Continue to Payment →
                                </button>
                            )}
                            {step === 'payment' && (
                                <button
                                    onClick={submitOrder}
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 text-white rounded-2xl font-black transition-all shadow-lg shadow-violet-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" /></svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>Proceed to Payment 🔒</>
                                    )}
                                </button>
                            )}

                            <p className="text-[10px] text-slate-400 text-center mt-3">
                                After ordering, you have <strong>60 minutes</strong> to complete the payment.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Terms & Conditions Modal */}
            <TermsModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                onAccept={handleTermsAccepted}
                rulesText={event.rules_policies}
            />
        </DashboardLayout>
    );
}
