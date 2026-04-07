/**
 * AdvancedFilter – A reusable filter popover for table pages.
 *
 * Renders a "Filters" toggle button that opens a dropdown panel.
 * The parent passes in the actual filter inputs as `children`.
 *
 * Usage:
 *   <AdvancedFilter
 *       activeCount={2}
 *       onApply={handleApply}
 *       onClear={handleClear}
 *   >
 *       <FilterField label="Status" ... />
 *   </AdvancedFilter>
 */

import { Fragment, ReactNode, useState, useRef, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface AdvancedFilterProps {
    /** Number of currently active filters – shows a badge */
    activeCount?: number;
    /** Called when the user clicks "Apply Filters" */
    onApply: () => void;
    /** Called when the user clicks "Clear All" */
    onClear: () => void;
    /** The filter form content */
    children: ReactNode;
}

export default function AdvancedFilter({
    activeCount = 0,
    onApply,
    onClear,
    children,
}: AdvancedFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handler);
        }
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handler);
        }
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen]);

    return (
        <div className="relative">
            {/* Toggle button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
                    isOpen
                        ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-300 dark:border-primary-500/30 text-primary-700 dark:text-primary-300 shadow-sm'
                        : activeCount > 0
                          ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400'
                          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
            >
                {/* Filter icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                Filters
                {activeCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold rounded-full bg-primary-500 text-white">
                        {activeCount}
                    </span>
                )}
                {/* Chevron */}
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {/* Dropdown panel */}
            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-1 scale-95"
            >
                <div
                    ref={panelRef}
                    className="absolute right-0 sm:left-0 top-full mt-2 z-[100] w-[360px] max-w-[calc(100vw-2rem)] origin-top-right sm:origin-top-left"
                >
                    <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-black/60">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5 rounded-t-2xl">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                                Advanced Filters
                            </h3>
                            {activeCount > 0 && (
                                <button
                                    onClick={onClear}
                                    className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Filter fields - removed overflow classes to prevent clipping */}
                        <div className="p-5 space-y-5">
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] rounded-b-2xl">
                            <button
                                onClick={() => {
                                    onClear();
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => {
                                    onApply();
                                    setIsOpen(false);
                                }}
                                className="px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-sm shadow-primary-500/20 transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
}

/* ─── Helper: FilterField ────────────────────────────────────────── */

interface FilterFieldProps {
    label: string;
    children: ReactNode;
}

/** A labelled wrapper for individual filter inputs inside AdvancedFilter. */
export function FilterField({ label, children }: FilterFieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

/* ─── Helper: FilterSelect ───────────────────────────────────────── */

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
}

/** A custom Listbox select for full theme control. */
export function FilterSelect({ value, onChange, options, placeholder = 'All' }: FilterSelectProps) {
    const selected = options.find(opt => opt.value === value);

    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className="relative w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/50 px-3 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition cursor-pointer">
                    <span className="block truncate">{selected ? selected.label : placeholder}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-navy-800 py-1 text-sm shadow-xl ring-1 ring-black/5 focus:outline-none z-[110] border border-slate-200 dark:border-white/10">
                        <Listbox.Option
                            value=""
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 px-4 ${
                                    active ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'
                                }`
                            }
                        >
                            {placeholder}
                        </Listbox.Option>
                        {options.map((opt) => (
                            <Listbox.Option
                                key={opt.value}
                                value={opt.value}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-4 ${
                                        active ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'
                                    }`
                                }
                            >
                                {opt.label}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}

/* ─── Helper: FilterDateRange ────────────────────────────────────── */

interface FilterDateRangeProps {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
}

/** A pair of date inputs for date-range filtering. */
export function FilterDateRange({ from, to, onFromChange, onToChange }: FilterDateRangeProps) {
    const inputClasses = "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/50 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition [color-scheme:light] dark:[color-scheme:dark]";
    
    return (
        <div className="flex items-center gap-2">
            <input
                type="date"
                value={from}
                onChange={(e) => onFromChange(e.target.value)}
                className={inputClasses}
            />
            <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium">to</span>
            <input
                type="date"
                value={to}
                onChange={(e) => onToChange(e.target.value)}
                className={inputClasses}
            />
        </div>
    );
}
