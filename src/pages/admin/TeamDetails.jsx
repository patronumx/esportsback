import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { Plus, Trash2, User, Edit, X, Save, MessageSquare, Calendar, Phone, Mail, Instagram, Twitter, Facebook, Globe, Send, RefreshCw, TrendingUp } from 'lucide-react';
import FileUploader from '../../components/common/FileUploader';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import CustomSelect from '../../components/common/CustomSelect';
import { showToast } from '../../utils/toast';

const ROLES = ['IGL', 'Assaulter', 'Support', 'Fragger'];
const MAPS = ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik', 'Karakin', 'Nusa', 'Rondo'];

const AdminTeamDetails = () => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);

    // Stats Form
    const [statsForm, setStatsForm] = useState({
        platform: 'Instagram',
        followers: '',
        engagementRate: '',
        reach: '',
        impressions: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Forms
    const [playerForm, setPlayerForm] = useState({
        ign: '', name: '', role: 'IGL', uid: '',
        instagram: '', twitter: '', discord: '',
        avatarUrl: ''
    });

    const [editForm, setEditForm] = useState({ name: '', game: '', region: '', logoUrl: '' });

    const [eventForm, setEventForm] = useState({
        title: '', type: 'scrim',
        totalDays: 2,
        matchesPerDay: 5,
        schedule: []
    });

    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [deletePlayerId, setDeletePlayerId] = useState(null);
    const [sendingBroadcast, setSendingBroadcast] = useState(false);

    useEffect(() => {
        fetchTeamDetails();
    }, [id]);

    const fetchTeamDetails = async () => {
        try {
            const teamRes = await api.get(`/admin/teams/${id}`);
            const playersRes = await api.get(`/admin/teams/${id}/players`);

            setTeam(teamRes.data);
            setEditForm({
                name: teamRes.data.name,
                game: teamRes.data.game,
                region: teamRes.data.region,
                logoUrl: teamRes.data.logoUrl
            });
            setPlayers(playersRes.data.data || []);
            setEvents(teamRes.data.events || []);

        } catch (error) {
            console.error(error);
            showToast.error('Failed to load team details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/admin/teams/${id}`, editForm);
            setTeam(data);
            fetchTeamDetails();
            setShowEditModal(false);
            showToast.success('Team updated');
        } catch (error) {
            console.error(error);
            showToast.error('Update failed');
        }
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...playerForm,
                team: id,
                image: playerForm.avatarUrl,
                socialLinks: {
                    instagram: playerForm.instagram,
                    twitter: playerForm.twitter,
                    discord: playerForm.discord
                }
            };

            await api.post(`/admin/teams/${id}/players`, payload);
            setShowPlayerModal(false);
            fetchTeamDetails();
            setPlayerForm({ ign: '', name: '', role: 'IGL', uid: '', instagram: '', twitter: '', discord: '', avatarUrl: '' });
            showToast.success('Player added');
        } catch (error) {
            console.error(error);
            showToast.error('Failed to add player');
        }
    };

    const handleDeletePlayer = (playerId) => {
        setDeletePlayerId(playerId);
    };

    const confirmDeletePlayer = async () => {
        if (!deletePlayerId) return;
        try {
            await api.delete(`/admin/players/${deletePlayerId}`);
            fetchTeamDetails();
            showToast.success('Player removed');
            setDeletePlayerId(null);
        } catch (error) {
            console.error(error);
            showToast.error('Failed to remove player');
        }
    };

    const handleGenerateSchedule = () => {
        if (!eventForm.totalDays || !eventForm.matchesPerDay) {
            showToast.error('Please specify days and matches count');
            return;
        }

        const sched = [];
        // Generate blank schedule structure
        for (let d = 0; d < eventForm.totalDays; d++) {
            const matches = [];
            for (let m = 1; m <= eventForm.matchesPerDay; m++) {
                matches.push({ matchOrder: m, map: 'Erangel', time: '', status: 'Pending' });
            }
            sched.push({
                day: d + 1,
                date: '', // To be filled by user
                matches
            });
        }
        setEventForm({ ...eventForm, schedule: sched });
    };

    const handleDateChange = (dayIndex, newDate) => {
        const newSched = [...eventForm.schedule];
        newSched[dayIndex].date = newDate;
        setEventForm({ ...eventForm, schedule: newSched });
    };

    const handleMatchChange = (dayIndex, matchIndex, field, value) => {
        const newSched = [...eventForm.schedule];
        newSched[dayIndex].matches[matchIndex][field] = value;
        setEventForm({ ...eventForm, schedule: newSched });
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (eventForm.schedule.length === 0) {
            showToast.error('Please generate a schedule first');
            return;
        }

        // Validate dates are selected
        if (eventForm.schedule.some(d => !d.date)) {
            showToast.error('Please select dates for all days');
            return;
        }

        // Validate times are selected (optional but good practice)
        // For now, let's verify if at least one time matches

        // Derive root startTime for lists sorting -> Day 1 + Match 1 Time OR Day 1 00:00
        const firstDay = eventForm.schedule[0];
        const initialTime = firstDay.matches[0]?.time || '00:00';
        const derivedStartTime = `${firstDay.date}T${initialTime}`;

        try {
            const payload = {
                ...eventForm,
                startTime: derivedStartTime,
                team: id,
            };
            await api.post('/admin/events', payload);
            setShowEventModal(false);
            fetchTeamDetails();
            setEventForm({ title: '', type: 'scrim', totalDays: 2, matchesPerDay: 5, schedule: [] });
            showToast.success('Event Assigned');
        } catch (error) {
            console.error(error);
            showToast.error('Failed to assign event');
        }
    };

    const handleSendBroadcast = async (e) => {
        e.preventDefault();
        setSendingBroadcast(true);
        try {
            await api.post(`/admin/teams/${id}/broadcast`, { message: broadcastMessage });
            setShowBroadcastModal(false);
            setBroadcastMessage('');
            showToast.success('Broadcast sent!');
        } catch (error) {
            console.error(error);
            showToast.error(error.response?.data?.message || 'Failed to send broadcast');
        } finally {
            setSendingBroadcast(false);
        }
    };

    const handleUploadStats = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/teams/${id}/social-stats`, statsForm);
            setShowStatsModal(false);
            setStatsForm({
                platform: 'Instagram',
                followers: '',
                engagementRate: '',
                reach: '',
                impressions: '',
                date: new Date().toISOString().split('T')[0]
            });
            showToast.success('Stats uploaded successfully');
        } catch (error) {
            console.error(error);
            showToast.error('Failed to upload stats');
        }
    };

    const SocialIcon = ({ type }) => {
        switch (type) {
            case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
            case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
            case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
            case 'discord': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
            default: return <Globe className="w-4 h-4 text-gray-400" />;
        }
    };

    if (loading) return <div className="text-white flex justify-center items-center h-full">Loading...</div>;
    if (!team) return <div className="text-white">Team not found</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center">
                    <img src={team.logoUrl || 'https://via.placeholder.com/80'} alt={team.name} className="w-24 h-24 rounded-2xl bg-gray-800 object-cover mr-6 border border-white/10 shadow-lg" />
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">{team.name}</h1>
                        <p className="text-gray-400 font-medium flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs uppercase font-bold">{team.game}</span>
                            <span>•</span>
                            <span>{team.region || 'Global'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowBroadcastModal(true)} className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl flex items-center hover:bg-green-600 hover:text-white transition-all font-bold">
                        <Send className="mr-2 w-4 h-4" /> Send Broadcast
                    </button>
                    <button onClick={() => setShowStatsModal(true)} className="px-4 py-2 bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-xl flex items-center hover:bg-pink-600 hover:text-white transition-all font-bold">
                        <TrendingUp className="mr-2 w-4 h-4" /> Upload Stats
                    </button>
                    <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl flex items-center hover:bg-blue-600 hover:text-white transition-all font-bold">
                        <Edit className="mr-2 w-4 h-4" /> Edit Team
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Contact & Socials */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-3xl p-6 border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-blue-400" /> Contact Info
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-gray-500">Email</span>
                                <span className="text-white font-mono">{team.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-gray-500">Phone</span>
                                <span className="text-white font-mono">{team.phoneNumber}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-gray-500">Notification (WA)</span>
                                <span className="text-green-400 font-mono">{team.notificationContact?.whatsapp || 'Same as Phone'}</span>
                            </div>
                            <div className="pt-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Social Links</h4>
                                <div className="flex gap-3">
                                    {team.socialLinks && Object.entries(team.socialLinks).map(([key, url]) => (
                                        url && (
                                            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" title={key}>
                                                <SocialIcon type={key} />
                                            </a>
                                        )
                                    ))}
                                    {(!team.socialLinks || Object.values(team.socialLinks).every(v => !v)) && (
                                        <span className="text-gray-600 text-xs italic">No socials linked</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Events & Roster */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Events List */}
                    <div className="bg-gray-900 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-800/50">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-purple-400" /> Events
                            </h2>
                            <button onClick={() => setShowEventModal(true)} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20 font-bold">
                                <Plus className="mr-1.5 w-4 h-4" /> Assign Event
                            </button>
                        </div>
                        <div className="p-6">
                            {events.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No events assigned.</div>
                            ) : (
                                <div className="space-y-3">
                                    {events.map(event => (
                                        <div key={event._id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div>
                                                <div className="font-bold text-white">{event.title}</div>
                                                <div className="text-xs text-gray-500">{new Date(event.startTime).toLocaleString()} • {event.type}</div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold ${event.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                                                {event.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Roster List */}
                    <div className="bg-gray-900 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-800/50">
                            <h2 className="text-xl font-bold text-white flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-400" /> Roster
                            </h2>
                            <button onClick={() => setShowPlayerModal(true)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 font-bold">
                                <Plus className="mr-1.5 w-4 h-4" /> Add Player
                            </button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Player</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">UID</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {players.map(player => (
                                        <tr key={player._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-black border border-white/10 mr-3 flex items-center justify-center overflow-hidden">
                                                    {player.image || player.avatarUrl ? <img src={player.image || player.avatarUrl} alt={player.ign} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-600" />}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{player.ign}</div>
                                                    <div className="text-gray-500 text-xs">{player.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 font-medium">{player.role}</td>
                                            <td className="px-6 py-4 text-gray-400 font-mono text-sm">{player.uid || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeletePlayer(player._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {players.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No players added yet</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Modal - Granular Dates & Times */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-white/10 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Assign Event / Scrim</h2>
                            <button onClick={() => setShowEventModal(false)}><X className="text-gray-500 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleAddEvent} className="space-y-6">
                            {/* Basic Details: Title, Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label>
                                    <input type="text" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-purple-500 outline-none" placeholder="e.g. Scrim #42" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required />
                                </div>
                                <div>
                                    <CustomSelect
                                        label="Type"
                                        options={[
                                            { value: 'scrim', label: 'Scrim' },
                                            { value: 'tournament', label: 'Tournament' },
                                            { value: 'meeting', label: 'Meeting' }
                                        ]}
                                        value={eventForm.type}
                                        onChange={(val) => setEventForm({ ...eventForm, type: val })}
                                    />
                                </div>
                            </div>

                            {/* Gen Config: Days, Matches/Day (No Start Date) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Days</label>
                                    <input type="number" min="1" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-purple-500 outline-none" value={eventForm.totalDays} onChange={e => setEventForm({ ...eventForm, totalDays: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Matches/Day</label>
                                    <input type="number" min="1" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-purple-500 outline-none" value={eventForm.matchesPerDay} onChange={e => setEventForm({ ...eventForm, matchesPerDay: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <button type="button" onClick={handleGenerateSchedule} className="w-full py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 text-sm font-bold flex justify-center items-center mb-4">
                                <RefreshCw className="w-4 h-4 mr-2" /> Generate / Reset Schedule
                            </button>

                            {/* Schedule Display with Time/Date Inputs */}
                            {eventForm.schedule.length > 0 && (
                                <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                    {eventForm.schedule.map((day, dIndex) => (
                                        <div key={dIndex} className="bg-black/20 p-4 rounded-xl border border-white/5">

                                            {/* Day Header with Date Picker */}
                                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                                <span className="text-sm font-bold text-gray-300">Day {day.day}</span>
                                                <input
                                                    type="date"
                                                    className="bg-black/40 border border-white/10 rounded px-3 py-1 text-white text-xs outline-none focus:border-purple-500"
                                                    value={day.date}
                                                    onChange={(e) => handleDateChange(dIndex, e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {day.matches.map((match, mIndex) => (
                                                    <div key={mIndex} className="flex items-center space-x-2 text-xs bg-black/40 p-2 rounded-lg">
                                                        <span className="text-gray-500 font-mono w-6">#{match.matchOrder}</span>
                                                        <div className="flex-1">
                                                            <CustomSelect
                                                                options={MAPS}
                                                                value={match.map}
                                                                onChange={(val) => handleMatchChange(dIndex, mIndex, 'map', val)}
                                                                placeholder="Map"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <input
                                                            type="time"
                                                            className="bg-gray-800 border border-white/10 rounded px-2 py-2 text-white outline-none focus:border-purple-500 w-24"
                                                            value={match.time}
                                                            onChange={(e) => handleMatchChange(dIndex, mIndex, 'time', e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500">Confirm & Assign Event</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Player & Broadcast Modals remain same ... */}
            {showPlayerModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-white/10 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Add Player to Roster</h2>
                            <button onClick={() => setShowPlayerModal(false)}><X className="text-gray-500 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleAddPlayer} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="IGN" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none" value={playerForm.ign} onChange={e => setPlayerForm({ ...playerForm, ign: e.target.value })} required />
                                <input type="text" placeholder="UID" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none" value={playerForm.uid} onChange={e => setPlayerForm({ ...playerForm, uid: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Real Name" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none" value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} />
                                <div className="z-20 relative">
                                    <CustomSelect options={ROLES} value={playerForm.role} onChange={(val) => setPlayerForm({ ...playerForm, role: val })} placeholder="Role" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Social Links</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="Instagram" className="w-full p-2 bg-black/20 rounded border border-white/10 text-white text-sm" value={playerForm.instagram} onChange={e => setPlayerForm({ ...playerForm, instagram: e.target.value })} />
                                    <input type="text" placeholder="Twitter" className="w-full p-2 bg-black/20 rounded border border-white/10 text-white text-sm" value={playerForm.twitter} onChange={e => setPlayerForm({ ...playerForm, twitter: e.target.value })} />
                                    <input type="text" placeholder="Discord" className="w-full p-2 bg-black/20 rounded border border-white/10 text-white text-sm" value={playerForm.discord} onChange={e => setPlayerForm({ ...playerForm, discord: e.target.value })} />
                                </div>
                            </div>
                            <FileUploader label="Player Avatar" onUploadSuccess={(url) => setPlayerForm({ ...playerForm, avatarUrl: url })} />
                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={() => setShowPlayerModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500">Add Player</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showStatsModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-pink-500" /> Upload Social Stats</h2>
                            <button onClick={() => setShowStatsModal(false)}><X className="text-gray-500 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleUploadStats} className="space-y-4">
                            <CustomSelect
                                label="Platform"
                                options={['Instagram', 'Twitter', 'Facebook', 'YouTube', 'TikTok', 'Discord']}
                                value={statsForm.platform}
                                onChange={(val) => setStatsForm({ ...statsForm, platform: val })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Followers</label>
                                    <input type="number" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-pink-500 outline-none" value={statsForm.followers} onChange={e => setStatsForm({ ...statsForm, followers: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Engagement Rate (%)</label>
                                    <input type="number" step="0.01" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-pink-500 outline-none" value={statsForm.engagementRate} onChange={e => setStatsForm({ ...statsForm, engagementRate: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Reach</label>
                                    <input type="number" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-pink-500 outline-none" value={statsForm.reach} onChange={e => setStatsForm({ ...statsForm, reach: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Impressions</label>
                                    <input type="number" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-pink-500 outline-none" value={statsForm.impressions} onChange={e => setStatsForm({ ...statsForm, impressions: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Captured Date</label>
                                <input type="date" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-pink-500 outline-none" value={statsForm.date} onChange={e => setStatsForm({ ...statsForm, date: e.target.value })} required />
                            </div>
                            <button type="submit" className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-500">Save Stats</button>
                        </form>
                    </div>
                </div>
            )}

            {showBroadcastModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Send className="w-5 h-5" /> Send Broadcast</h2>
                            <button onClick={() => setShowBroadcastModal(false)}><X className="text-gray-500 hover:text-white" /></button>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">This will send a WhatsApp message to <b>{team.notificationContact?.whatsapp || team.phoneNumber}</b> containing the message below.</p>
                        <form onSubmit={handleSendBroadcast} className="space-y-4">
                            <textarea className="w-full p-3 h-32 bg-black/20 rounded-lg border border-white/10 text-white focus:border-green-500 outline-none resize-none" placeholder="Enter message..." value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)}></textarea>
                            <button type="submit" disabled={sendingBroadcast} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 flex justify-center items-center">{sendingBroadcast ? 'Sending...' : 'Send Broadcast'}</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Edit Team</h2>
                            <button onClick={() => setShowEditModal(false)}><X className="text-gray-500 hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleUpdateTeam} className="space-y-4">
                            <input type="text" placeholder="Team Name" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Game" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none" value={editForm.game} onChange={e => setEditForm({ ...editForm, game: e.target.value })} required />
                                <input type="text" placeholder="Region" className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none" value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })} />
                            </div>
                            <FileUploader label="Team Logo" currentImage={editForm.logoUrl} onUploadSuccess={(url) => setEditForm({ ...editForm, logoUrl: url })} />
                            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal isOpen={deletePlayerId !== null} onClose={() => setDeletePlayerId(null)} onConfirm={confirmDeletePlayer} title="Remove Player" message="Remove this player from the roster?" confirmText="Remove" isDanger={true} />
        </div>
    );
};

export default AdminTeamDetails;
