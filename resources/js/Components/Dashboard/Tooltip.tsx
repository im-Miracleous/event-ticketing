import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const targetRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (targetRef.current && isVisible) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 8, // Above the target
                left: rect.left + rect.width / 2, // Centered
            });
        }
    };

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible]);

    return (
        <div 
            ref={targetRef}
            className="inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && createPortal(
                <div 
                    className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-full mb-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[11px] font-bold whitespace-pre-wrap shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-100 dark:border-white/10 min-w-[80px] max-w-[320px] backdrop-blur-md"
                    style={{ 
                        top: `${position.top}px`, 
                        left: `${position.left}px` 
                    }}
                >
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-slate-800 drop-shadow-sm" />
                </div>,
                document.body
            )}
        </div>
    );
}
