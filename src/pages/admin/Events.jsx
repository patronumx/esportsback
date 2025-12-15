import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Plus, Trash2, Calendar, MapPin, Download, List, Grid, Clock, X, Trophy, Users, Video } from 'lucide-react';
import CalendarView from '../../components/CalendarView';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [formData, setFormData] = useState({ team: '', title: '', type: 'scrim', startTime: '', location: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsRes, teamsRes] = await Promise.all([
                api.get('/admin/events'),
                api.get('/admin/teams')
            ]);
            setEvents(eventsRes.data.data || eventsRes.data);
            setTeams(teamsRes.data.data || teamsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/events', formData);
            setShowModal(false);
            fetchData();
            setFormData({ team: '', title: '', type: 'scrim', startTime: '', location: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete event?')) {
            try {
                await api.delete(`/admin/events/${id}`);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'tournament': return <Trophy className="w-5 h-5 text-yellow-400" />;
            case 'media-day': return <Video className="w-5 h-5 text-purple-400" />;
            case 'meeting': return <Users className="w-5 h-5 text-blue-400" />;
            default: return <Calendar className="w-5 h-5 text-emerald-400" />;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                        Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Schedule</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Manage tournaments, scrims, and team activities.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-black/20 p-1 rounded-xl flex border border-white/5 backdrop-blur-sm">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                    <a href="http://localhost:5000/api/admin/export/events" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl flex items-center hover:bg-gray-700 transition-colors border border-white/5">
                        <Download className="mr-2 w-4 h-4" /> CSV
                    </a>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                        <Plus className="mr-2 w-5 h-5" /> Add Event
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 gap-4">
                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-white/5">
                            <Calendar className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">No events scheduled</p>
                        </div>
                    ) : (
                        events.map(event => {
                            const date = new Date(event.startTime);
                            return (
                                <div key={event._id} className="group flex flex-col md:flex-row items-center bg-gray-900/50 hover:bg-gray-800 rounded-2xl border border-white/5 hover:border-blue-500/30 p-4 transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
                                    {/* Date Block */}
                                    <div className="flex flex-col items-center justify-center w-full md:w-24 h-24 bg-black/40 rounded-xl border border-white/5 mb-4 md:mb-0 md:mr-6 group-hover:border-blue-500/20 transition-colors">
                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-3xl font-black text-white">{date.getDate()}</span>
                                        <span className="text-xs text-gray-500">{date.toLocaleString('default', { weekday: 'short' })}</span>
                                    </div>

                                    {/* Event Details */}
                                    <div className="flex-1 text-center md:text-left w-full">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${event.type === 'tournament' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    event.type === 'media-day' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                {event.type}
                                            </span>
                                            <span className="text-gray-500 text-xs flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {event.team?.name || 'All Teams'}</span>
                                            <span className="hidden md:inline">•</span>
                                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.location || 'Online'}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 md:mt-0 md:ml-6">
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="bg-gray-900 rounded-3xl border border-white/5 overflow-hidden p-6">
                    <CalendarView events={events} />
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white">Schedule Event</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Team</label>
                                <select
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.team}
                                    onChange={e => setFormData({ ...formData, team: e.target.value })}
                                    required
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Event Title</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                                    <select
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="scrim">Scrim</option>
                                        <option value="tournament">Tournament</option>
                                        <option value="media-day">Media Day</option>
                                        <option value="meeting">Meeting</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Online, Studio A"
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;
