import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Bell, Send } from 'lucide-react';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ team: '', title: '', message: '', type: 'info' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Notifications
            try {
                const { data } = await api.get('/admin/notifications');
                setNotifications(data.data || data); // Handle both array and object wrapper
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }

            // Fetch Teams
            try {
                const { data } = await api.get('/admin/teams?limit=100'); // Increase limit to get all teams
                setTeams(data.data || data || []);
            } catch (error) {
                console.error('Failed to fetch teams:', error);
            }
        } catch (error) {
            console.error('General fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (payload.team === '') payload.team = null; // Global
        try {
            await api.post('/admin/notifications', payload);
            fetchData();
            setFormData({ team: '', title: '', message: '', type: 'info' });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-white mb-6">Notification History</h1>
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="divide-y divide-gray-700">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No notifications sent</div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif._id} className="p-4 hover:bg-gray-700/30 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-white font-bold">{notif.title}</h3>
                                        <span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{notif.message}</p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-0.5 rounded uppercase ${notif.type === 'alert' ? 'bg-red-500/20 text-red-400' : notif.type === 'update' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{notif.type}</span>
                                        <span className="text-xs text-gray-500">{notif.team ? `To: Team ID ${notif.team}` : 'To: Everyone'}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 sticky top-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Send className="mr-2 w-5 h-5" /> Send Notification</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-gray-400 text-sm mb-1">Recipient</label>
                            <select className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none" value={formData.team} onChange={e => setFormData({ ...formData, team: e.target.value })}>
                                <option value="">All Teams (Global)</option>
                                {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-400 text-sm mb-1">Type</label>
                            <select className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="info">Info</option>
                                <option value="alert">Alert</option>
                                <option value="update">Update</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-400 text-sm mb-1">Title</label>
                            <input type="text" className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1">Message</label>
                            <textarea className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none h-24" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors font-medium">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
