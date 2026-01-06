import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Bell, Check } from 'lucide-react';

const TeamNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/team/notifications');
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/team/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Notifications</h1>
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications</p>
                ) : (
                    notifications.map(notif => (
                        <div key={notif._id} className={`p-6 rounded-lg border flex justify-between items-start transition-colors ${notif.isRead ? 'bg-zinc-900 border-zinc-800 opacity-70' : 'bg-zinc-800 border-emerald-500/30'}`}>
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className={`px-2 py-0.5 text-xs rounded uppercase font-bold mr-3 ${notif.type === 'alert' ? 'bg-red-500/20 text-red-400' : notif.type === 'update' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {notif.type}
                                    </span>
                                    <h3 className="text-white font-bold">{notif.title}</h3>
                                    <span className="text-gray-500 text-sm ml-2">• {new Date(notif.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-300">{notif.message}</p>
                            </div>
                            {!notif.isRead && (
                                <button onClick={() => markAsRead(notif._id)} className="text-emerald-400 hover:text-emerald-300 p-2 rounded-full hover:bg-emerald-900/20" title="Mark as read">
                                    <Check className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamNotifications;
