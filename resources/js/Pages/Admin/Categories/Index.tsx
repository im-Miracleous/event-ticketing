import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

/* ─── Mock Data ─────────────────────────────────────────────────────── */

const initialCategories = [
    { id: 1, name: 'Technology', slug: 'technology', events: 34, color: 'from-blue-500 to-cyan-400' },
    { id: 2, name: 'Music',      slug: 'music',      events: 21, color: 'from-violet-500 to-purple-400' },
    { id: 3, name: 'Sports',     slug: 'sports',     events: 18, color: 'from-emerald-500 to-green-400' },
    { id: 4, name: 'Arts',       slug: 'arts',       events: 12, color: 'from-pink-500 to-rose-400' },
    { id: 5, name: 'Business',   slug: 'business',   events: 28, color: 'from-amber-500 to-orange-400' },
    { id: 6, name: 'Education',  slug: 'education',  events: 15, color: 'from-teal-500 to-cyan-400' },
    { id: 7, name: 'Food',       slug: 'food',       events: 9,  color: 'from-red-500 to-orange-400' },
    { id: 8, name: 'Charity',    slug: 'charity',    events: 7,  color: 'from-indigo-500 to-blue-400' },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AdminCategories() {
    const [categories] = useState(initialCategories);
    const [showModal, setShowModal] = useState(false);

    return (
        <DashboardLayout>
            <Head title="Event Categories" />

            {/* Page heading */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Event Categories</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage the global list of categories available to organizers.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm shadow-primary-500/25"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="group relative rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 overflow-hidden">
                        {/* Gradient accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color}`} />

                        <div className="flex items-start justify-between mb-3 pt-1">
                            <div>
                                <h3 className="text-base font-semibold text-slate-800 dark:text-white">{cat.name}</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">/{cat.slug}</p>
                            </div>
                            {/* Action dots */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <button className="p-1 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors" title="Edit">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                                <button className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{cat.events} events</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal for "Add Category" */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 m-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Category</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Workshop"
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Slug</label>
                                <input
                                    type="text"
                                    placeholder="e.g. workshop"
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/20 transition"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-primary-500/25">
                                Create Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
