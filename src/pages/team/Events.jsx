import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Calendar, MapPin, List, Grid, Clock, Trophy, Users, Video, Trash2, Edit2 } from 'lucide-react';
import CalendarView from '../../components/CalendarView';

const TeamEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/team/events');
            setEvents(data.data || data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch events', error);
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await api.delete(`/team/events/${id}`);
            // Optimistic update or refetch
            setEvents(events.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete event', error);
            alert('Failed to delete event');
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

    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: 'scrim', // or tournament
        startDate: '',
        startTime: '',
        totalDays: 1,
        matchesPerDay: 1,
        schedule: []
    });
    const [generatingSchedule, setGeneratingSchedule] = useState(false);

    // Maps List
    const MAPS = ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik', 'Karakin', 'Nusa', 'Rondo'];

    const handleGenerateSchedule = () => {
        setGeneratingSchedule(true);
        const sched = [];
        for (let d = 1; d <= newEvent.totalDays; d++) {
            const matches = [];
            for (let m = 1; m <= newEvent.matchesPerDay; m++) {
                matches.push({
                    matchOrder: m,
                    map: 'Erangel', // Default
                    status: 'Pending'
                });
            }
            sched.push({
                day: d,
                matches: matches
            });
        }
        setNewEvent({ ...newEvent, schedule: sched });
        setGeneratingSchedule(false);
    };

    const handleMapChange = (dayIndex, matchIndex, field, value) => {
        const updatedSchedule = [...newEvent.schedule];
        updatedSchedule[dayIndex].matches[matchIndex][field] = value;
        setNewEvent({ ...newEvent, schedule: updatedSchedule });
    };

    const [editingId, setEditingId] = useState(null);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            // Combine date and time
            const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
            const endTime = new Date(startDateTime.getTime() + (newEvent.totalDays * 24 * 60 * 60 * 1000));

            const payload = {
                ...newEvent,
                startTime: startDateTime,
                endTime: endTime
            };

            if (editingId) {
                await api.put(`/team/events/${editingId}`, payload);
            } else {
                await api.post('/team/events', payload);
            }

            setShowAddModal(false);
            setEditingId(null);
            // Refresh events
            const { data } = await api.get('/team/events');
            setEvents(data.data || data);
        } catch (error) {
            console.error('Failed to save event', error);
            alert('Failed to save event');
        }
    };

    const handleEditEvent = (event) => {
        const startDate = new Date(event.startTime);

        // Parse matchesPerDay from the first day of schedule if available, else default
        const matchesPerDay = event.schedule?.[0]?.matches?.length || 1;
        const totalDays = event.schedule?.length || 1;

        setNewEvent({
            title: event.title,
            type: event.type,
            startDate: startDate.toISOString().split('T')[0],
            startTime: startDate.toTimeString().slice(0, 5),
            totalDays: totalDays,
            matchesPerDay: matchesPerDay,
            schedule: event.schedule || []
        });
        setEditingId(event._id);
        setShowAddModal(true);
    };

    const toggleAddModal = () => {
        if (showAddModal) {
            setShowAddModal(false);
            setEditingId(null);
            setNewEvent({
                title: '',
                type: 'scrim',
                startDate: '',
                startTime: '',
                totalDays: 1,
                matchesPerDay: 1,
                schedule: []
            });
        } else {
            setShowAddModal(true);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-6 relative">
            {/* Add Event Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-10">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative mb-10">
                        <h2 className="text-2xl font-black text-white italic tracking-tight mb-6">Create New Schedule</h2>

                        <form onSubmit={handleCreateEvent} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="e.g. PMCO Finals"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                    <select
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="scrim">Scrims</option>
                                        <option value="tournament">Tournament</option>
                                        <option value="media-day">Media Day</option>
                                        <option value="meeting">Meeting</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEvent.startDate}
                                        onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time (Event Start)</label>
                                    <input
                                        type="time"
                                        required
                                        value={newEvent.startTime}
                                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Days</label>
                                    <input
                                        type="number"
                                        min="1" max="30"
                                        value={newEvent.totalDays}
                                        onChange={(e) => setNewEvent({ ...newEvent, totalDays: parseInt(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Matches Per Day</label>
                                    <input
                                        type="number"
                                        min="1" max="10"
                                        value={newEvent.matchesPerDay}
                                        onChange={(e) => setNewEvent({ ...newEvent, matchesPerDay: parseInt(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGenerateSchedule}
                                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-emerald-400 font-bold rounded-xl transition-colors mb-4"
                            >
                                Generate / Reset Schedule Structure
                            </button>

                            {/* Detailed Schedule Editor */}
                            {newEvent.schedule.length > 0 && (
                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {newEvent.schedule.map((day, dIdx) => (
                                        <div key={dIdx} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <h3 className="text-white font-bold mb-3 flex items-center justify-between">
                                                <span>Day {day.day}</span>
                                                <span className="text-xs font-normal text-gray-400">Set individual match times below</span>
                                            </h3>
                                            <div className="space-y-2">
                                                {day.matches.map((match, mIdx) => (
                                                    <div key={mIdx} className="flex flex-col md:flex-row md:items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
                                                        <span className="text-xs text-gray-500 font-mono w-8 font-bold">#{match.matchOrder}</span>

                                                        {/* Map Selector */}
                                                        <select
                                                            value={match.map}
                                                            onChange={(e) => handleMapChange(dIdx, mIdx, 'map', e.target.value)}
                                                            className="flex-1 bg-transparent text-sm text-white focus:outline-none cursor-pointer border-r border-white/10 mr-2 pr-2"
                                                        >
                                                            {MAPS.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                                                        </select>

                                                        {/* Time Input */}
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3 h-3 text-gray-500" />
                                                            <input
                                                                type="time"
                                                                value={match.time || ''}
                                                                onChange={(e) => handleMapChange(dIdx, mIdx, 'time', e.target.value)}
                                                                className="bg-transparent text-sm text-emerald-400 focus:outline-none w-24"
                                                                placeholder="Time"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-transparent hover:bg-white/5 text-gray-400 font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                                >
                                    Create Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                        Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Schedule</span>
                    </h1>
                    <p className="text-gray-400 text-sm">View your upcoming tournaments, scrims, and activities.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleAddModal}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                    >
                        <Calendar className="w-4 h-4" /> Add Event
                    </button>
                    <div className="bg-black/20 p-1 rounded-xl flex border border-white/5 backdrop-blur-sm">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 gap-4">
                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-white/5">
                            <Calendar className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">No events scheduled</p>
                            <button onClick={toggleAddModal} className="text-emerald-400 hover:text-emerald-300 font-bold text-sm">Create your first event</button>
                        </div>
                    ) : (
                        events.map(event => {
                            const date = new Date(event.startTime);
                            return (
                                <div key={event._id} className="group flex flex-col items-start bg-gray-900/50 hover:bg-gray-800 rounded-2xl border border-white/5 hover:border-emerald-500/30 p-4 transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
                                    <div className="flex w-full items-center mb-4">
                                        {/* Date Block */}
                                        <div className="flex flex-col items-center justify-center w-20 h-20 bg-black/40 rounded-xl border border-white/5 mr-4 group-hover:border-emerald-500/20 transition-colors flex-shrink-0">
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-2xl font-black text-white">{date.getDate()}</span>
                                            <span className="text-[10px] text-gray-500">{date.toLocaleString('default', { weekday: 'short' })}</span>
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-1 text-center md:text-left w-full">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
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
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <List className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event._id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{event.title}</h3>
                                            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.location || 'Online'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Schedule Preview */}
                                    {event.schedule && event.schedule.length > 0 && (
                                        <div className="w-full bg-black/20 rounded-xl p-4 border border-white/5 mt-2">
                                            <div className="block text-xs font-bold text-gray-500 uppercase mb-3 text-left">Schedule Overview</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {event.schedule.map((day, idx) => (
                                                    <div key={idx} className="flex gap-3 items-start">
                                                        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded h-fit whitespace-nowrap">Day {day.day}</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {day.matches.map((match, mIdx) => (
                                                                <div key={mIdx} className="flex flex-col bg-white/5 px-2 py-1 rounded border border-white/5 items-center">
                                                                    <span className="text-xs text-gray-300 font-medium" title={`Match ${match.matchOrder}`}>
                                                                        {match.map}
                                                                    </span>
                                                                    {match.time && (
                                                                        <span className="text-[10px] text-gray-500 mt-0.5">
                                                                            {match.time}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
        </div>
    );
};

export default TeamEvents;
