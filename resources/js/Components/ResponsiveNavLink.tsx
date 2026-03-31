import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400 focus:border-primary-600 focus:bg-primary-500/20 focus:text-primary-300'
                    : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-navy-900/5 hover:text-slate-200 focus:border-slate-700 focus:bg-navy-900/5 focus:text-slate-200'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
