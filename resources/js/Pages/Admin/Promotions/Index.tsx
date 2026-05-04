import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useState, Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Modal from '@/Components/Modal';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface PromotionItem {
    id: number;
    code: string;
    type: string;
    value: string;
    usage: string;
    validUntil: string;
    status: string;
    event: string;
    discount_type: 'fixed' | 'percentage';
    discount_amount: number;
    max_discount_amount: number | null;
    min_spending: number | null;
    start_date: string;
    end_date: string;
    event_id: string;
    terms_and_conditions: string | null;
    banner_url: string | null;
}

interface PaginatedPromotions {
    data: PromotionItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface EventItem {
    id: string;
    title: string;
}

interface Props {
    promotions: PaginatedPromotions;
    events: EventItem[];
    filters: {
        per_page?: number;
        search?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
        valid_from?: string;
        valid_to?: string;
    };
}

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminPromotions({ promotions, events, filters }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    // Common useForm
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: '',
        discount_type: 'fixed',
        discount_amount: '',
        max_discount_amount: '',
        min_spending: '',
        quota: '',
        start_date: '',
        end_date: '',
        event_id: '',
        terms_and_conditions: '',
        banner: null as File | string | null,
    });

    // Sort state
    const sort = filters.sort || '';
    const direction = filters.direction || 'desc';

    // Advanced filter local state
    const [filterValidFrom, setFilterValidFrom] = useState(filters.valid_from || '');
    const [filterValidTo, setFilterValidTo] = useState(filters.valid_to || '');

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            search: search || undefined,
            per_page: promotions.per_page,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            valid_from: filterValidFrom || undefined,
            valid_to: filterValidTo || undefined,
            ...overrides,
        };
        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        router.get(route('admin.promotions.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('admin.promotions.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('admin.promotions.index'), buildParams({ page }), { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: number) => {
        router.get(route('admin.promotions.index'), buildParams({ per_page: value, page: undefined }), { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            router.delete(route('admin.promotions.destroy', { id }));
        }
    };

    const openCreate = () => {
        setIsEdit(false);
        setEditingId(null);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEdit = (p: any) => {
        setIsEdit(true);
        setEditingId(p.id);
        setData({
            code: p.code,
            discount_type: p.discount_type,
            discount_amount: p.discount_amount.toString(),
            max_discount_amount: p.max_discount_amount ? p.max_discount_amount.toString() : '',
            min_spending: p.min_spending ? p.min_spending.toString() : '',
            quota: p.usage.split(' / ')[1],
            start_date: p.start_date || '',
            end_date: p.end_date || '',
            event_id: p.event_id || '',
            terms_and_conditions: p.terms_and_conditions || '',
            banner: p.banner_url || null,
        });
        clearErrors();
        setShowModal(true);
    };

    // Auto-open edit modal from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        if (editId) {
            const promoToEdit = promotions.data.find(p => String(p.id) === editId);
            if (promoToEdit) {
                openEdit(promoToEdit);
                // Clear the param without reloading
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [promotions.data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Ensure event_id is properly handled for "All Events"
        // Also ensure we only send the banner if it's a new file (not the existing URL string)
        const submitData: any = {
            ...data,
            event_id: data.event_id === '' ? null : data.event_id,
        };

        if (typeof data.banner === 'string') {
            delete submitData.banner;
        }

        if (isEdit && editingId) {
            // Use POST with _method: put for multipart compatibility in Laravel
            router.post(route('admin.promotions.update', editingId), {
                ...submitData,
                _method: 'put',
            }, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
                forceFormData: true,
            });
        } else {
            router.post(route('admin.promotions.store'), submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
                forceFormData: true,
            });
        }
    };

    const activeAdvancedFilterCount = [filterValidFrom, filterValidTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('admin.promotions.index'), buildParams({ page: undefined }), { preserveState: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterValidFrom('');
        setFilterValidTo('');
        router.get(route('admin.promotions.index'), buildParams({
            valid_from: undefined,
            valid_to: undefined,
            page: undefined,
        }), { preserveState: true, replace: true });
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Active':   return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20';
            case 'Draft':    return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            case 'Expired':  return 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 ring-1 ring-red-500/20';
            case 'Inactive': return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-white/10';
            default:         return '';
        }
    };

    return (
        <DashboardLayout>
            <Head title="Promotions" />

            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Promotions</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage platform-wide discount codes and featured banners.</p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm shadow-primary-500/25"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Promo Code
                </button>
            </div>

            {/* Toolbar: Search + AdvancedFilter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="relative w-full sm:w-80">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search codes or events…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                    />
                </div>
                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Valid Until Date Range">
                        <FilterDateRange from={filterValidFrom} to={filterValidTo} onFromChange={setFilterValidFrom} onToChange={setFilterValidTo} />
                    </FilterField>
                </AdvancedFilter>
            </div>

            {/* Discount Codes Table */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none mb-8 overflow-visible">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Discount Codes</h2>
                </div>
                <div className="min-w-full rounded-2xl overflow-visible">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="Code" column="code" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5">Type</th>
                                <SortableHeader label="Value" column="value" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Usage" column="usage" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Valid Until" column="validUntil" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <SortableHeader label="Status" column="status" currentSort={sort} currentDirection={direction} onSort={handleSort} />
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {promotions.data.map((promo, rowIndex) => {
                                const totalRows = promotions.data.length;
                                const isNearBottom = totalRows <= 2 || rowIndex >= totalRows - 2;
                                return (
                                <tr key={promo.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <Tooltip content={promo.code}>
                                            <span className="font-mono text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-lg truncate max-w-[120px] inline-block">{promo.code}</span>
                                        </Tooltip>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{promo.type}</td>
                                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{promo.value}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{promo.usage}</td>
                                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{promo.validUntil}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(promo.status)}`}>
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="6" r="2" />
                                                        <circle cx="12" cy="12" r="2" />
                                                        <circle cx="12" cy="18" r="2" />
                                                    </svg>
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className={`absolute right-0 z-50 w-36 origin-top-right rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-lg focus:outline-none ${isNearBottom ? 'bottom-full mb-2' : 'mt-2'}`}>
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    href={route('admin.promotions.show', { id: promo.id })}
                                                                    className={`${
                                                                        active ? 'bg-slate-50 dark:bg-white/5' : ''
                                                                    } flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 w-full text-left`}
                                                                >
                                                                    View Detail
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => openEdit(promo)}
                                                                    className={`${
                                                                        active ? 'bg-slate-50 dark:bg-white/5' : ''
                                                                    } flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 w-full text-left`}
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => handleDelete(promo.id)}
                                                                    className={`${
                                                                        active ? 'bg-red-50 dark:bg-red-500/10' : ''
                                                                    } flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 w-full text-left`}
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </td>
                                </tr>
                            )})}
                            {promotions.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No promotions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={promotions.current_page}
                    totalItems={promotions.total}
                    perPage={promotions.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>

            {/* Add/Edit Promo Modal */}
             <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-white/5 shrink-0">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isEdit ? 'Update Promo Code' : 'New Promo Code'}
                        </h2>
                        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 no-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Promo Code</label>
                                <input 
                                    type="text" 
                                    value={data.code} 
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder="e.g. SUMMER2026" 
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition font-mono uppercase" 
                                />
                                {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Event <span className="text-slate-400 font-normal lowercase">(optional — leave blank to apply to all events)</span></label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                        </svg>
                                    </div>
                                    <select 
                                        value={data.event_id} 
                                        onChange={(e) => setData('event_id', e.target.value)}
                                        className="w-full rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 pl-12 pr-10 py-3 text-sm font-bold text-slate-900 dark:text-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">🌐 All Events (Global Promo)</option>
                                        {events.map((ev: any) => (
                                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </div>
                                </div>
                                {errors.event_id && <p className="mt-1 text-xs text-red-500">{errors.event_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Discount Type</label>
                                <select 
                                    value={data.discount_type} 
                                    onChange={(e) => setData('discount_type', e.target.value as any)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                >
                                    <option value="fixed">Fixed Amount (Rp)</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                                {errors.discount_type && <p className="mt-1 text-xs text-red-500">{errors.discount_type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
                                    {data.discount_type === 'percentage' ? 'Percentage Value' : 'Amount Value'}
                                </label>
                                <input 
                                    type="number" 
                                    value={data.discount_amount} 
                                    onChange={(e) => setData('discount_amount', e.target.value)}
                                    placeholder={data.discount_type === 'percentage' ? 'e.g. 15' : 'e.g. 50000'} 
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" 
                                />
                                {errors.discount_amount && <p className="mt-1 text-xs text-red-500">{errors.discount_amount}</p>}
                            </div>

                            {data.discount_type === 'percentage' && (
                                <div>
                                    <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Max Discount amount</label>
                                    <input 
                                        type="number" 
                                        value={data.max_discount_amount}
                                        onChange={(e) => setData('max_discount_amount', e.target.value)}
                                        placeholder="Optional limit" 
                                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" 
                                    />
                                    {errors.max_discount_amount && <p className="mt-1 text-xs text-red-500">{errors.max_discount_amount}</p>}
                                </div>
                            )}

                            <div className={data.discount_type === 'percentage' ? '' : 'md:col-span-1'}>
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Min Spending</label>
                                <input 
                                    type="number" 
                                    value={data.min_spending}
                                    onChange={(e) => setData('min_spending', e.target.value)}
                                    placeholder="Optional min spending" 
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" 
                                />
                                {errors.min_spending && <p className="mt-1 text-xs text-red-500">{errors.min_spending}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Total Quota</label>
                                <input 
                                    type="number" 
                                    value={data.quota}
                                    onChange={(e) => setData('quota', e.target.value)}
                                    placeholder="e.g. 500" 
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" 
                                />
                                {errors.quota && <p className="mt-1 text-xs text-red-500">{errors.quota}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                                <input 
                                    type="date" 
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" 
                                />
                                {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Expiry Date</label>
                                <input 
                                    type="date" 
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition" 
                                />
                                {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Promotional Banner</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-white/10 border-dashed rounded-xl hover:border-primary-500/40 transition-colors group">
                                    <div className="space-y-1 text-center">
                                        {data.banner ? (
                                            <div className="relative inline-block">
                                                <img 
                                                    src={typeof data.banner === 'string' ? data.banner : URL.createObjectURL(data.banner)} 
                                                    className="max-h-48 rounded-lg shadow-lg mb-4" 
                                                    alt="Preview" 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('banner', null)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-primary-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                                    <label className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-bold text-primary-600 hover:text-primary-500">
                                                        <span>Upload a file</span>
                                                        <input 
                                                            type="file" 
                                                            className="sr-only" 
                                                            onChange={(e) => setData('banner', e.target.files?.[0] || null)} 
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-2">PNG, JPG, GIF up to 2MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.banner && <p className="mt-1 text-xs text-red-500 font-bold">{errors.banner}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Terms and Conditions</label>
                                <textarea 
                                    value={data.terms_and_conditions}
                                    onChange={(e) => setData('terms_and_conditions', e.target.value)}
                                    rows={4}
                                    placeholder="Write terms and conditions for this promo code..." 
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition resize-none" 
                                />
                                {errors.terms_and_conditions && <p className="mt-1 text-xs text-red-500">{errors.terms_and_conditions}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                            <button 
                                type="button"
                                onClick={() => setShowModal(false)} 
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold transition-all shadow-xl shadow-violet-500/30 active:scale-95"
                            >
                                {processing ? 'Saving...' : (isEdit ? 'Update Promo Code' : 'Generate Promo Code')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}

