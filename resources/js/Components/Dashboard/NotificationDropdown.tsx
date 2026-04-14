import React, { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import axios from 'axios';

interface DatabaseNotification {
    id: string;
    data: {
        title: string;
        message: string;
        type?: string;
    };
    created_at: string;
    read_at: string | null;
}

export default function NotificationDropdown({ user }: { user: any }) {
    const [notifications, setNotifications] = useState<DatabaseNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/notifications');
            setNotifications(res.data.notifications.data);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Listen for real-time notifications
        if (window.Echo && user?.id) {
            const channel = window.Echo.private(`App.Models.User.${user.id}`);
            channel.notification((notification: any) => {
                // Prepend the new notification to the list
                setNotifications((prev) => [
                    {
                        id: notification.id,
                        data: {
                            title: notification.title,
                            message: notification.message,
                            type: notification.type,
                        },
                        created_at: new Date().toISOString(),
                        read_at: null,
                    },
                    ...prev,
                ]);
                setUnreadCount((prev) => prev + 1);
            });

            return () => {
                window.Echo.leave(`App.Models.User.${user.id}`);
            };
        }
    }, [user?.id]);

    const markAsRead = async (id: string) => {
        try {
            const res = await axios.post(`/notifications/${id}/mark-read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
            );
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await axios.post('/notifications/mark-all-read');
            setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900/5 hover:text-slate-900 dark:hover:text-white transition">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-navy-950" />
                    )}
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content contentClasses="py-0 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-xl mt-2 w-80 overflow-hidden flex flex-col max-h-96">
                <div className="p-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-navy-950/50">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-3 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-navy-900/50 transition-colors cursor-pointer ${notif.read_at ? 'opacity-60' : 'bg-primary-50/30 dark:bg-primary-900/10'}`}
                                onClick={() => !notif.read_at && markAsRead(notif.id)}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{notif.data.title}</span>
                                    {!notif.read_at && (
                                        <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0 mt-1" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{notif.data.message}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-navy-950/50 text-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{unreadCount} unread messages</span>
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
}
