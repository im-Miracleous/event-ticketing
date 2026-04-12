import { useState } from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    perPageOptions?: number[];
}

export default function Pagination({
    currentPage,
    totalItems,
    perPage,
    onPageChange,
    onPerPageChange,
    perPageOptions = [5, 10, 25, 50],
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);

    /** Build the visible page numbers with ellipsis */
    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-white/5">
            {/* Left: Per-page selector + info */}
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">Rows per page:</span>
                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                        className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900/5 pl-2 pr-8 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition cursor-pointer"
                    >
                        {perPageOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">{opt}</option>
                        ))}
                    </select>
                </div>
                <span className="hidden sm:inline text-xs">
                    Showing {startItem}–{endItem} of {totalItems}
                </span>
            </div>

            {/* Right: Page buttons */}
            <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400 dark:text-slate-500">…</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[28px] h-7 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                currentPage === page
                                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
