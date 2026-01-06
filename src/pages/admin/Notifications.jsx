import React, { useState, useEffect } from 'react';
import { Trash2, Send, AlertTriangle, CheckCircle, Info, MessageSquare, Instagram, Clock, Zap, Calendar } from 'lucide-react';
import api from '../../api/client';
import toast from '../../utils/toast';

const AdminNotifications = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('broadcast'); // 'broadcast' | 'history'

    // History State
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({ team: '', title: '', message: '', type: 'info' });
    const [teams, setTeams] = useState([]);
    const [waStatus, setWaStatus] = useState({ status: 'disconnected', qrCode: null });

    useEffect(() => {
        fetchSchedule();
        fetchHistory();

        // Poll WhatsApp Status
        const interval = setInterval(fetchWaStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchWaStatus = async () => {
        try {
            const { data } = await api.get('/admin/whatsapp/status');
            setWaStatus(data);
        } catch (error) {
            console.error('Failed to fetch WA status');
        }
    };

    const fetchSchedule = async () => {
        try {
            const { data } = await api.get('/admin/schedule');
            setSchedule(data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch schedule', error);
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/admin/notifications');
            setNotifications(data.data || data);

            // Fetch Teams for dropdown
            const teamsRes = await api.get('/admin/teams?limit=100');
            setTeams(teamsRes.data.data || teamsRes.data || []);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const getWhatsAppLink = (team, matches) => {
        const phone = team.notificationContact?.whatsapp || team.phoneNumber;
        if (!phone) return '#';

        // Clean phone number
        const cleanPhone = phone.replace(/\D/g, '');

        const matchList = matches.map(m =>
            `- ${new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${m.title} (${m.confirmationStatus})`
        ).join('\n');

        const text = `Hello *${team.name}*, here is your schedule for the next 24 hours:\n\n${matchList}\n\nPlease log in to the dashboard to confirm your attendance.`;

        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    const getInstagramLink = (team) => {
        const handle = team.notificationContact?.instagram || '';
        // Remove @ if present
        const cleanHandle = handle.replace('@', '');
        return cleanHandle ? `https://instagram.com/${cleanHandle}` : '#';
    };

    const handleSendManual = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/notifications', formData);
            fetchHistory();
            setFormData({ team: '', title: '', message: '', type: 'info' });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="flex justify-center p-12 text-white">Loading Broadcast Center...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Notification Center</h1>
                    <p className="text-gray-400">Manage broadcasts and automated alerts</p>
                </div>
                <div className="flex bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('broadcast')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'broadcast' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Broadcast Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Manual & History
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Connect WhatsApp
                    </button>
                </div>
            </div>

            {activeTab === 'broadcast' ? (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Upcoming Schedule Broadcast</h2>
                                <p className="text-gray-400 text-sm">Teams with matches in the next 24 hours. Click to send reminders.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {schedule.length === 0 ? (
                                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-700 border-dashed">
                                    <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500">No matches scheduled for the next 24 hours.</p>
                                </div>
                            ) : (
                                schedule.map((item) => {
                                    const matches = item.matches || [];
                                    const allConfirmed = matches.length > 0 && matches.every(m => m.confirmationStatus === 'Confirmed');
                                    const anyPending = matches.some(m => m.confirmationStatus === 'Pending');

                                    return (
                                        <div key={item.team._id} className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{item.team.name}</h3>
                                                    {allConfirmed ? (
                                                        <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> All Confirmed
                                                        </span>
                                                    ) : (
                                                        <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/20 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" /> Pending Confirmation
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    {matches.map(m => (
                                                        <div key={m._id} className="text-sm text-gray-400 flex items-center gap-2">
                                                            <span className="w-16 text-gray-500 text-xs font-mono">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            <span className={m.confirmationStatus === 'Confirmed' ? 'text-green-400' : 'text-white'}>{m.title}</span>
                                                            {m.confirmationStatus === 'Confirmed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Phone: {item.team.notificationContact?.whatsapp || item.team.phoneNumber || 'N/A'}</span>
                                                    <span>IG: {item.team.notificationContact?.instagram || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                                <a
                                                    href={getWhatsAppLink(item.team, matches)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-lg transition-transform hover:scale-105 shadow-lg shadow-green-900/20"
                                                >
                                                    <MessageSquare className="w-4 h-4" /> Send WhatsApp
                                                </a>
                                                <a
                                                    href={getInstagramLink(item.team)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold rounded-lg transition-transform hover:scale-105 shadow-lg shadow-purple-900/20"
                                                >
                                                    <Instagram className="w-4 h-4" /> Open Profile
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'settings' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* WhatsApp Connection Panel */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                            <MessageSquare className="w-5 h-5 text-green-500" /> WhatsApp Automation
                        </h2>

                        <div className="flex flex-col items-center justify-center p-8 bg-black/20 rounded-xl border border-gray-700/50 min-h-[350px] relative backdrop-blur-sm">
                            {waStatus.status === 'ready' ? (
                                <div className="text-center relative z-10">
                                    <div className="relative inline-block mb-6">
                                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                                                <CheckCircle className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">System Online</h3>
                                    <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                                        Connected to <span className="text-green-400 font-mono font-bold tracking-wider">+92 333...</span><br />
                                        Ready to send automated matches.
                                    </p>

                                    <button
                                        onClick={async () => {
                                            if (!window.confirm('Are you sure you want to disconnect?')) return;
                                            const toastId = toast.loading('Disconnecting...');
                                            try {
                                                await api.post('/admin/whatsapp/logout');
                                                toast.success('Disconnected successfully', { id: toastId });
                                                fetchWaStatus();
                                            } catch (err) {
                                                toast.error('Failed to disconnect', { id: toastId });
                                            }
                                        }}
                                        className="px-6 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all border border-red-500/20 flex items-center gap-2 mx-auto font-semibold"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        Disconnect Session
                                    </button>
                                </div>
                            ) : waStatus.qrCode ? (
                                <div className="text-center relative z-10 animate-in fade-in zoom-in duration-500">
                                    <p className="text-white mb-6 font-bold text-lg">Scan to Connect</p>
                                    <div className="bg-white p-3 rounded-xl inline-block mb-6 shadow-2xl shadow-green-900/20 group">
                                        <img src={waStatus.qrCode} alt="WhatsApp QR" className="w-64 h-64 mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-300" />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-gray-900/50 py-2 px-4 rounded-full border border-gray-700/50 mx-auto w-fit">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                        Waiting for scan...
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="relative w-16 h-16 mx-auto mb-6">
                                        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-400 font-medium tracking-wide">Initializing Secure Client...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scheduler Control */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none"></div>

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                            <Clock className="w-5 h-5 text-blue-500" /> Automation Status
                        </h2>
                        <div className="space-y-6 relative z-10">
                            <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-inner">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg">
                                        <Calendar className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-1">Background Worker</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            System runs a check <span className="text-blue-400 font-bold">every hour</span>.
                                            Automatically sends reminders to teams for matches starting in the next 4 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={async () => {
                                        const toastId = toast.loading('Triggering manual validation...');
                                        try {
                                            await api.post('/admin/notifications/trigger');
                                            toast.success('Validation check completed!', { id: toastId });
                                        } catch (e) {
                                            console.error(e);
                                            toast.error('Failed to trigger check. See console.', { id: toastId });
                                        }
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    <Zap className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
                                    Run Manual Check Now
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-3">
                                    Proceed with caution. This will send real messages to pending teams.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-white mb-4">Notification History</h2>
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
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Send className="mr-2 w-5 h-5" /> Send Manual Notification</h2>
                            <form onSubmit={handleSendManual}>
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
            )}
        </div >
    );
};

export default AdminNotifications;
