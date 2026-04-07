/**
 * SortableHeader – A reusable <th> wrapper that renders sort arrows.
 *
 * Usage:
 *   <SortableHeader
 *       label="Event"
 *       column="name"
 *       currentSort={sort}
 *       currentDirection={direction}
 *       onSort={handleSort}
 *   />
 */

interface SortableHeaderProps {
    /** Display label for the header */
    label: string;
    /** The query-param column name this header maps to */
    column: string;
    /** Which column is currently sorted (from URL / state) */
    currentSort?: string;
    /** Current sort direction */
    currentDirection?: 'asc' | 'desc';
    /** Called when user clicks the header – parent should update URL params */
    onSort: (column: string, direction: 'asc' | 'desc') => void;
    /** Extra classes for the <th> */
    className?: string;
}

export default function SortableHeader({
    label,
    column,
    currentSort,
    currentDirection,
    onSort,
    className = '',
}: SortableHeaderProps) {
    const isActive = currentSort === column;
    const nextDirection: 'asc' | 'desc' =
        isActive && currentDirection === 'asc' ? 'desc' : 'asc';

    return (
        <th
            className={`px-5 py-3.5 cursor-pointer select-none group ${className}`}
            onClick={() => onSort(column, nextDirection)}
        >
            <span className="inline-flex items-center gap-1.5">
                {label}
                <span className="inline-flex flex-col -space-y-0.5">
                    {/* Up arrow (asc) */}
                    <svg
                        className={`w-3 h-3 transition-colors duration-150 ${
                            isActive && currentDirection === 'asc'
                                ? 'text-primary-500 dark:text-primary-400'
                                : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500'
                        }`}
                        viewBox="0 0 10 6"
                        fill="none"
                    >
                        <path
                            d="M1 5L5 1L9 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {/* Down arrow (desc) */}
                    <svg
                        className={`w-3 h-3 transition-colors duration-150 ${
                            isActive && currentDirection === 'desc'
                                ? 'text-primary-500 dark:text-primary-400'
                                : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500'
                        }`}
                        viewBox="0 0 10 6"
                        fill="none"
                    >
                        <path
                            d="M1 1L5 5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </span>
        </th>
    );
}
