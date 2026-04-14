import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react'; // Using Inertia Link for internal routing

interface NotificationProps {
    type?: 'success' | 'error' | 'info' | 'warning';
    message?: string;
    detailUrl?: string | null;
    onClose?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export default function Notification({
    type = 'success',
    message = '',
    detailUrl = null,
    onClose, // Recommended: Callback to let the parent know it should be removed
    className = '',
    style = {},
    ...props
}: NotificationProps) {
    // Slide-in/out animation
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [timerWidth, setTimerWidth] = useState('100%');

    const colors: Record<string, { bg: string, border: string, icon: string, iconName: string, timer: string }> = {
        success: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-l-4 border-emerald-500',
            icon: 'text-emerald-500',
            iconName: 'check_circle',
            timer: 'bg-emerald-500',
        },
        error: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-l-4 border-red-500',
            icon: 'text-red-500',
            iconName: 'error',
            timer: 'bg-red-500',
        },
        info: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-l-4 border-blue-500',
            icon: 'text-blue-500',
            iconName: 'info',
            timer: 'bg-blue-500',
        },
        warning: {
            bg: 'bg-white dark:bg-slate-800',
            border: 'border-l-4 border-amber-500',
            icon: 'text-amber-500',
            iconName: 'warning',
            timer: 'bg-amber-500',
        },
    };

    const theme = colors[type] || colors.success;

    const handleClose = () => {
        // Exit animation
        setIsVisible(false);

        setTimeout(() => {
            setIsMounted(false);
            if (onClose) onClose();
        }, 600);
    };

    useEffect(() => {
        // 1. Entry Animation: Slide Left
        const showTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        // 2. Timer Animation
        const timerAnimTimeout = setTimeout(() => {
            setTimerWidth('0%');
        }, 200);

        // 3. Auto Close Setup
        const autoCloseTimeout = setTimeout(() => {
            handleClose();
        }, 8200);

        // Cleanup
        return () => {
            clearTimeout(showTimeout);
            clearTimeout(timerAnimTimeout);
            clearTimeout(autoCloseTimeout);
        };
    }, []);

    // If the component has finished its exit animation, don't render anything
    if (!isMounted) return null;

    let title = 'Success';
    if (type === 'error') title = 'Fail';
    if (type === 'info') title = 'Info';
    if (type === 'warning') title = 'Warning';

    return (
        <div
            className={`relative flex flex-col w-full min-w-[320px] max-w-sm overflow-hidden transition-all duration-500 ease-out transform shadow-lg rounded-lg ${theme.bg} ${theme.border} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'} ${className}`}
            style={style}
            role="alert"
            {...props}
        >
            <div className="p-4 flex items-start gap-3">
                <span className={`material-symbols-outlined text-2xl ${theme.icon} shrink-0`}>
                    {theme.iconName}
                </span>
                <div className="flex-1 pt-0.5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {message}
                    </p>
                    {detailUrl && (
                        <Link
                            href={detailUrl}
                            className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:underline"
                        >
                            See Details
                        </Link>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close notification"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            {/* Timer Bar */}
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-700">
                <div
                    className={`h-full ${theme.timer}`}
                    style={{
                        width: timerWidth,
                        transition: 'width 8s linear'
                    }}
                />
            </div>
        </div>
    );
}
