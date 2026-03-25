import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-xl border border-slate-300 dark:border-white/10 bg-navy-900 dark:bg-navy-900/5 px-5 py-2.5 text-sm font-semibold text-slate-300 dark:text-slate-300 shadow-sm transition-all duration-200 hover:bg-navy-800 dark:hover:bg-navy-900/10 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy-950 active:scale-[0.97] ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
