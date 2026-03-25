import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function PromotionsIndex({ auth, promotions, events }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        event_id: '',
        code: '',
        discount_amount: '',
        quota: '',
        start_date: '',
        end_date: '',
    });

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (promo: any) => {
        setIsEditMode(true);
        setEditId(promo.id);
        setData({
            event_id: promo.event_id,
            code: promo.code,
            discount_amount: promo.discount_amount,
            quota: promo.quota,
            start_date: promo.start_date.split(' ')[0], // Format for date input if datetime
            end_date: promo.end_date.split(' ')[0],
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && editId) {
            put(route('organizer.promotions.update', editId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('organizer.promotions.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (promoId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
            destroy(route('organizer.promotions.destroy', promoId));
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <DashboardLayout>
            <Head title="Manajemen Promo" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Promo</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Kelola kode diskon promosi untuk event Anda.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-primary-500/25"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    <span>Buat Promo Baru</span>
                </button>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-white/5">
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">KODE PROMO</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">NAMA EVENT</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">DISKON</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">KUOTA</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">MASA BERLAKU</th>
                                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {promotions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada kode promo yang dibuat.
                                    </td>
                                </tr>
                            ) : (
                                promotions.map((promo: any) => (
                                    <tr key={promo.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 font-bold rounded-lg tracking-wider border border-primary-500/20">
                                                {promo.code}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                                            {promo.event?.title || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-bold text-emerald-500">
                                            {formatCurrency(promo.discount_amount)}
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                                            {promo.quota}
                                        </td>
                                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-sm">
                                            {promo.start_date.split(' ')[0]} s/d <br/> {promo.end_date.split(' ')[0]}
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-3">
                                            <button 
                                                onClick={() => openEditModal(promo)}
                                                className="text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(promo.id)}
                                                className="text-red-500 hover:text-red-400 font-medium text-sm transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6 bg-white dark:bg-navy-900 rounded-xl">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        {isEditMode ? 'Edit Kode Promo' : 'Buat Kode Promo Baru'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Event</label>
                            <select
                                value={data.event_id}
                                onChange={e => setData('event_id', e.target.value)}
                                className="w-full rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="">-- Pilih Event --</option>
                                {events.map((event: any) => (
                                    <option key={event.id} value={event.id}>{event.title}</option>
                                ))}
                            </select>
                            {errors.event_id && <p className="text-red-500 text-xs mt-1">{errors.event_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kode Promo</label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={e => setData('code', e.target.value.toUpperCase())}
                                placeholder="Contoh: PROMO2026"
                                className="w-full rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500 uppercase"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Potongan Harga (Rp)</label>
                                <input
                                    type="number"
                                    value={data.discount_amount}
                                    onChange={e => setData('discount_amount', e.target.value)}
                                    placeholder="50000"
                                    className="w-full rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                                />
                                {errors.discount_amount && <p className="text-red-500 text-xs mt-1">{errors.discount_amount}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kuota Aktif</label>
                                <input
                                    type="number"
                                    value={data.quota}
                                    onChange={e => setData('quota', e.target.value)}
                                    placeholder="100"
                                    className="w-full rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                                />
                                {errors.quota && <p className="text-red-500 text-xs mt-1">{errors.quota}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                                />
                                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Berakhir</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 dark:border-white/10 dark:bg-navy-800 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                                />
                                {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                {isEditMode ? 'Simpan Perubahan' : 'Buat Promo'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
