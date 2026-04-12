import React, { useState, Fragment } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Pagination from '@/Components/Dashboard/Pagination';
import SortableHeader from '@/Components/Dashboard/SortableHeader';
import AdvancedFilter, { FilterField, FilterSelect, FilterDateRange } from '@/Components/Dashboard/AdvancedFilter';
import Tooltip from '@/Components/Dashboard/Tooltip';
import Modal from '@/Components/Modal';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import { Tag, Search, Plus, MoreVertical, Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';

export default function PromotionsIndex({ promotions, events, filters }: any) {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Search local state
    const [search, setSearch] = useState(filters?.search || '');
    
    // Sort parameters
    const sort = filters?.sort || '';
    const direction = filters?.direction || 'desc';

    // Advanced filter local state
    const [filterEvent, setFilterEvent] = useState(filters.event_id || '');
    const [filterDateFrom, setFilterDateFrom] = useState(filters.date_from || '');
    const [filterDateTo, setFilterDateTo] = useState(filters.date_to || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        event_id: '',
        code: '',
        discount_amount: '',
        discount_type: 'fixed',
        max_discount_amount: '',
        min_spending: '',
        quota: '',
        start_date: '',
        end_date: '',
    });

    const eventOptions = events.map((e: any) => ({ label: e.title, value: e.id }));

    /* ── Helpers ──────────────────────────────────────────────────── */

    const buildParams = (overrides = {}) => {
        const params: any = {
            search: search || undefined,
            event_id: filterEvent || undefined,
            sort: sort || undefined,
            direction: sort ? direction : undefined,
            date_from: filterDateFrom || undefined,
            date_to: filterDateTo || undefined,
            per_page: promotions.per_page,
            ...overrides,
        };
        Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);
        return params;
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('organizer.promotions.index'), buildParams({ search: value || undefined, page: undefined }), { preserveState: true, replace: true });
    };

    const handleSort = (column: string, dir: 'asc' | 'desc') => {
        router.get(route('organizer.promotions.index'), buildParams({ sort: column, direction: dir, page: undefined }), { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('organizer.promotions.index'), buildParams({ page }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(route('organizer.promotions.index'), buildParams({ per_page: perPage, page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const activeAdvancedFilterCount = [filterEvent, filterDateFrom, filterDateTo].filter(Boolean).length;

    const handleApplyFilters = () => {
        router.get(route('organizer.promotions.index'), buildParams({ page: undefined }), { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleClearFilters = () => {
        setFilterEvent('');
        setFilterDateFrom('');
        setFilterDateTo('');
        router.get(route('organizer.promotions.index'), buildParams({
            event_id: undefined, date_from: undefined, date_to: undefined, page: undefined,
        }), { preserveState: true, preserveScroll: true, replace: true });
    };

    /* ── Form Modal Helpers ─────────────────────────────────────── */

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsFormModalOpen(true);
    };

    const openEditModal = (promo: any) => {
        setIsEditMode(true);
        setEditId(promo.id);
        setData({
            event_id: promo.event_id,
            code: promo.code,
            discount_type: promo.discount_type || 'fixed',
            discount_amount: promo.discount_amount || '',
            max_discount_amount: promo.max_discount_amount || '',
            min_spending: promo.min_spending || '',
            quota: promo.quota,
            start_date: promo.start_date.split(' ')[0],
            end_date: promo.end_date.split(' ')[0],
        });
        clearErrors();
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && editId) {
            put(route('organizer.promotions.update', editId), {
                onSuccess: () => closeFormModal(),
            });
        } else {
            post(route('organizer.promotions.store'), {
                onSuccess: () => closeFormModal(),
            });
        }
    };

    const handleDelete = (promoId: number) => {
        if (confirm('Are you sure you want to delete this promotion code?')) {
            destroy(route('organizer.promotions.destroy', promoId));
        }
    };

    const formatCurrency = (value: number | string) => {
        if (!value) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value));
    };

    const formatDiscount = (promo: any) => {
        if (promo.discount_type === 'percentage') {
            return `${promo.discount_amount}%`;
        }
        return formatCurrency(promo.discount_amount);
    };

    return (
        <DashboardLayout>
            <Head title="Promotion Management" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <Tag className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Promotions</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your event discount codes.</p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create Promo
                </button>
            </div>

            {/* Toolbar: Search + Advanced Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search promo codes…"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-11 pr-4 py-3 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
                    />
                </div>

                <AdvancedFilter activeCount={activeAdvancedFilterCount} onApply={handleApplyFilters} onClear={handleClearFilters}>
                    <FilterField label="Event">
                        <FilterSelect
                            value={filterEvent}
                            onChange={setFilterEvent}
                            options={eventOptions}
                            placeholder="All Events"
                        />
                    </FilterField>
                    <FilterField label="Validity Period">
                        <FilterDateRange
                            from={filterDateFrom}
                            to={filterDateTo}
                            onFromChange={setFilterDateFrom}
                            onToChange={setFilterDateTo}
                        />
                    </FilterField>
                </AdvancedFilter>
            </div>

            <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[calc(100vh-24rem)]">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-[#0f172a] shadow-[0_1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                            <tr className="text-left text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                <SortableHeader label="Promo Code" column="code" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <SortableHeader label="Event" column="event" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <th className="px-6 py-5">Discount</th>
                                <SortableHeader label="Quota" column="quota" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <SortableHeader label="Active Until" column="active" currentSort={sort} currentDirection={direction} onSort={handleSort} className="px-6 py-5 border-none" />
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                            {promotions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                                                <Tag className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">No Promotions Found</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm uppercase">Try adjusting your filters or create a new code.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                promotions.data.map((promo: any, rowIndex: number) => {
                                    const totalRows = promotions.data.length;
                                    const isNearBottom = totalRows <= 2 || rowIndex >= totalRows - 2;

                                    return (
                                        <tr key={promo.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold rounded-lg border border-primary-500/20 text-xs">
                                                    {promo.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold text-[11px] truncate max-w-[200px]">
                                                {promo.event?.title || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-black text-emerald-500 dark:text-emerald-400">
                                                {formatDiscount(promo)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold">
                                                {promo.quota}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-[11px] font-bold">
                                                {promo.end_date.split(' ')[0]}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Menu as="div" className="relative inline-block text-left">
                                                    <Menu.Button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Menu.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className={`absolute right-0 z-50 w-44 origin-top-right rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl focus:outline-none ring-1 ring-black/5 dark:ring-transparent ${isNearBottom ? 'bottom-full mb-2' : 'mt-2'}`}>
                                                            <div className="p-1.5 space-y-1">
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            onClick={() => openEditModal(promo)}
                                                                            className={`${active ? 'bg-slate-50 dark:bg-white/5 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'} flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all tracking-wider w-full`}
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                            Edit Code
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            onClick={() => handleDelete(promo.id)}
                                                                            className={`${active ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'text-red-500/70'} flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider w-full`}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={promotions.current_page}
                    totalItems={promotions.total}
                    perPage={promotions.per_page}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>

            {/* Form Modal */}
            <Modal show={isFormModalOpen} onClose={closeFormModal} maxWidth="md">
                <div className="p-6 bg-white dark:bg-navy-900">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-600">
                            <Tag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {isEditMode ? 'Edit Promotion' : 'New Promotion'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Configure your discount code.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Apply to Event</label>
                                <select
                                    value={data.event_id}
                                    onChange={e => setData('event_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold uppercase"
                                    disabled={isEditMode}
                                >
                                    <option value="">Choose Event</option>
                                    {events.map((event: any) => (
                                        <option key={event.id} value={event.id}>{event.title}</option>
                                    ))}
                                </select>
                                {errors.event_id && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.event_id}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Promo Code</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={e => setData('code', e.target.value.toUpperCase())}
                                    placeholder="E.G. NEWYEAR2026"
                                    className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold uppercase"
                                />
                                {errors.code && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.code}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Type</label>
                                    <select
                                        value={data.discount_type}
                                        onChange={e => setData('discount_type', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold uppercase"
                                    >
                                        <option value="fixed">Fixed (Rp)</option>
                                        <option value="percentage">Percent (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Value</label>
                                    <input
                                        type="number"
                                        value={data.discount_amount}
                                        onChange={e => setData('discount_amount', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Min Spending</label>
                                    <input
                                        type="number"
                                        value={data.min_spending}
                                        onChange={e => setData('min_spending', e.target.value)}
                                        placeholder="0"
                                        className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Active Quota</label>
                                    <input
                                        type="number"
                                        value={data.quota}
                                        onChange={e => setData('quota', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:ring-primary-500/20 focus:border-primary-500 text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Starts On</label>
                                    <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Ends On</label>
                                    <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className="w-full rounded-xl border-slate-200 dark:border-white/10 dark:bg-navy-800 dark:text-white text-sm font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={closeFormModal}
                                className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-primary-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isEditMode ? 'Save Changes' : 'Create Promo'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
