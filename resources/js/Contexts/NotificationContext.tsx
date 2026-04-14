import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import NotificationComponent from '@/Components/Notification';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationAction {
    id: string;
    type: NotificationType;
    message: string;
    detailUrl?: string | null;
}

interface NotificationContextProps {
    showNotification: (type: NotificationType, message: string, detailUrl?: string | null) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<NotificationAction[]>([]);
    const [visibleNotifications, setVisibleNotifications] = useState<NotificationAction[]>([]);
    const MAX_VISIBLE = 2; // Up to 2 notifications stacked

    const showNotification = useCallback((type: NotificationType, message: string, detailUrl: string | null = null) => {
        const newNotification = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            type,
            message,
            detailUrl,
        };

        setQueue((prevQueue) => [...prevQueue, newNotification]);
    }, []);

    // Process the queue when it or the visible notifications change
    useEffect(() => {
        if (queue.length > 0 && visibleNotifications.length < MAX_VISIBLE) {
            // Get the next notification from the queue
            const [nextNotification, ...remainingQueue] = queue;

            // Move it to visible
            setVisibleNotifications((prev) => [...prev, nextNotification]);
            
            // Remove it from queue
            setQueue(remainingQueue);
        }
    }, [queue, visibleNotifications.length]);

    const handleClose = useCallback((id: string) => {
        setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* Render stacked notifications */}
            <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-4 items-end pointer-events-none">
                {visibleNotifications.map((notif) => (
                    <div key={notif.id} className="pointer-events-auto">
                        <NotificationComponent
                            type={notif.type as any}
                            message={notif.message}
                            detailUrl={notif.detailUrl}
                            onClose={() => handleClose(notif.id)}
                            className="!static !translate-x-0" // override fixed positioning and transform
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
