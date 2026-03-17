import { ReactNode } from 'react';

interface Props {
    type?: 'success' | 'error' | 'info';
    message?: ReactNode;
    className?: string;
}

export default function Alert({ type = 'error', message, className = '' }: Props) {
    if (!message) return null;

    const styles = {
        success: 'text-secondary-400 bg-secondary-500/10 border-secondary-500/20',
        error: 'text-red-400 bg-red-500/10 border-red-500/20',
        info: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    };

    return (
        <div className={`mb-6 text-sm font-medium text-center py-3 px-4 rounded-xl border animate-fade-in ${styles[type]} ${className}`}>
            {message}
        </div>
    );
}
