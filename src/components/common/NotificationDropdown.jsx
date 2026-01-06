import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import api from '../../api/client';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/team/notifications'); // Or generic endpoint if shared
            // If admin, this endpoint might be different. 
            // For now assuming /team/notifications works for logged in user context
            // But wait, admin routes are different.
            // I should check role or use a common endpoint.
            // Let's assume the endpoint is '/notifications' relative to the base URL if I make a common route, 
            // but currently I have '/team/notifications'.
            // I'll try to use a prop or context, or just try both?
            // Actually, I should just use the one I created: /team/notifications.
            // For admin, I didn't create a specific notification endpoint yet.
            // I'll stick to /team/notifications for now and maybe update it to be generic /notifications later.
            // Wait, I only added it to teamRoutes.
            // I should add it to adminRoutes or a common notificationRoutes.
            // For now, I'll use /team/notifications and if it fails (403), handle it?
            // No, that's bad.
            // I'll assume this component is for Team Layout for now.
            // If I use it in Admin, I need to make sure the endpoint exists.

            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/team/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && <span className="text-xs text-emerald-400 font-medium">{unreadCount} new</span>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.isRead ? 'bg-white/[0.02]' : ''}`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <h4 className={`text-sm font-medium mb-1 ${!notification.isRead ? 'text-white' : 'text-gray-400'}`}>
                                                {notification.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                                            <span className="text-[10px] text-gray-600 mt-2 block">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="text-emerald-500 hover:text-emerald-400 p-1 rounded hover:bg-emerald-500/10"
                                                title="Mark as read"
                                            >
                                                <Check className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
