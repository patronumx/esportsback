import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Calendar, Activity, Bell, Trophy, Users, Clock, Target, Plus, LogOut, ChevronRight, UserPlus, MapPin } from 'lucide-react';
import { showToast } from '../../utils/toast';
import { useDashboard } from '../../context/DashboardContext';

const TeamDashboard = () => {
    const { teamData: data, fetchTeamData } = useDashboard();
    const navigate = useNavigate();

    // Dashboard State
    const [teamProfile, setTeamProfile] = useState(null); // Local state for immediate data
    const [events, setEvents] = useState([]);
    const [roster, setRoster] = useState([]);
    const [recruitment, setRecruitment] = useState([]);
    const [scoutPlayers, setScoutPlayers] = useState([]); // Players from scout section
    const [isLoading, setIsLoading] = useState(true);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState({ whatsapp: '', instagram: '' });

    // Initial Fetch
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch context data just to keep it in sync, but we will use local fetch for display
                fetchTeamData();

                // Parallel fetch for widgets
                const [eventsRes, rosterRes, recruitRes, scoutRes] = await Promise.all([
                    api.get('/team/events'),
                    api.get('/team/roster'),
                    api.get('/team/recruitment'),
                    api.get('/team/scout') // Fetch scout players
                ]);

                setEvents(eventsRes.data || []);

                // Roster endpoint returns the full TEAM object.
                // We use this to set the profile info immediately.
                const profile = rosterRes.data;
                setTeamProfile(profile);

                // Handle Roster list
                // Handle Roster list
                // Prioritize 'players' (linked data) if available
                if (profile && profile.players && profile.players.length > 0) {
                    setRoster(profile.players);
                } else if (profile && profile.roster && profile.roster.length > 0) {
                    setRoster(profile.roster);
                } else {
                    setRoster([]);
                }

                setRecruitment(recruitRes.data || []);
                setScoutPlayers(scoutRes.data || []); // Set scouted players

            } catch (error) {
                console.error("Dashboard fetch error:", error);
                // showToast.error("Some dashboard data failed to load."); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [fetchTeamData]);

    // Update settings form when team data loads
    useEffect(() => {
        // Use teamProfile if available, otherwise data from context
        const sourceData = teamProfile || data;
        if (sourceData?.notificationContact) {
            setSettingsForm({
                whatsapp: sourceData.notificationContact.whatsapp || '',
                instagram: sourceData.notificationContact.instagram || ''
            });
        }
    }, [data, teamProfile]);

    const handleSaveSettings = async () => {
        try {
            await api.put('/team/settings', settingsForm);
            showToast.success("Notification settings saved!");
            setIsSettingsOpen(false);
            fetchTeamData();
        } catch (err) {
            showToast.error("Failed to save settings");
        }
    };

    // Calculate "Next Match" for the countdown
    const getNextEvent = () => {
        const now = new Date();
        let nextMatch = null;
        let activeMatch = null;
        let minDiff = Infinity;

        events.forEach(event => {
            let hasScheduleMatches = false;

            // Strict future check with limited "Live" window
            // If the event (or specific match) is definitively in the past (> 2 hours ago), ignore it.

            // 1. Process Schedule Matches
            if (event.schedule && event.schedule.length > 0) {
                event.schedule.forEach(day => {
                    let dayDate = null;
                    if (day.date) {
                        dayDate = new Date(day.date);
                    } else if (event.startTime) {
                        const start = new Date(event.startTime);
                        start.setDate(start.getDate() + (day.day - 1));
                        dayDate = start;
                    }

                    if (dayDate && day.matches) {
                        day.matches.forEach(match => {
                            if (match.time) {
                                hasScheduleMatches = true;
                                const [h, m] = match.time.split(':');
                                const matchTime = new Date(dayDate);
                                matchTime.setHours(parseInt(h), parseInt(m), 0, 0);

                                const diff = matchTime - now;

                                // Live Window: Started within last 1 hour
                                const LIVE_WINDOW = 60 * 60 * 1000;

                                // Is it live?
                                if (diff <= 0 && diff > -LIVE_WINDOW) {
                                    // Found a live match
                                    if (!activeMatch || diff > (activeMatch.diff || -Infinity)) {
                                        activeMatch = {
                                            ...event,
                                            targetTime: matchTime,
                                            displayTitle: `${event.title} - Day ${day.day}`,
                                            displayTime: match.time,
                                            isLive: true,
                                            diff: diff
                                        };
                                    }
                                }
                                // Is it upcoming?
                                else if (diff > 0) {
                                    if (diff < minDiff) {
                                        minDiff = diff;
                                        nextMatch = {
                                            ...event,
                                            targetTime: matchTime,
                                            displayTitle: `${event.title} - Day ${day.day}`,
                                            displayTime: match.time
                                        };
                                    }
                                }
                            }
                        });
                    }
                });
            }

            // 2. Process Main Event Time (Fallback)
            // Only use this if schedule didn't capture specific matches
            if (!hasScheduleMatches) {
                const eventStart = new Date(event.startTime);
                const diff = eventStart - now;
                const LIVE_WINDOW = 90 * 60 * 1000; // 90 mins for main event generic

                // Check Live
                if (diff <= 0 && diff > -LIVE_WINDOW) {
                    if (!activeMatch) {
                        activeMatch = {
                            ...event,
                            targetTime: eventStart,
                            displayTitle: event.title,
                            displayTime: eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isLive: true,
                            diff: diff
                        };
                    }
                }
                // Check Upcoming
                else if (diff > 0) {
                    if (diff < minDiff) {
                        minDiff = diff;
                        nextMatch = {
                            ...event,
                            targetTime: eventStart,
                            displayTitle: event.title,
                            displayTime: eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    }
                }
            }
        });

        // Prioritize actual LIVE match, then UPCOMING match.
        // If neither, returns null -> Shows "No upcoming missions"
        return activeMatch || nextMatch;
    };

    const nextEvent = getNextEvent();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!nextEvent) return;

        // Immediate update
        const updateTimer = () => {
            const now = new Date();
            const target = new Date(nextEvent.targetTime);
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("00:00:00");
            } else {
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [nextEvent]);

    // Use teamProfile for display if available, falling back to data, then fallback strings.
    // We only show loading if we have ABSOLUTELY nothing.
    const displayData = teamProfile || data;

    if (isLoading && !displayData) {
        return <div className="p-10 text-center text-gray-500 animate-pulse">Loading Headquarters...</div>;
    }

    return (
        <div className="space-y-8 pb-10">

            {/* Hero Section: Team Profile & Season Rank */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090b]">
                {/* Background Gradient/Image */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-[#0a0a0a] to-[#0a0a0a]" />
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dflj27820/image/upload/v1735700000/noise_overlay_w8g4k.png')] opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 p-5 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Verified Organization
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-lg">
                                TACTICAL OPERATIONS
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                    <Users className="w-4 h-4 text-purple-400" />
                                    <span>{roster.length} Operatives Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-all backdrop-blur-sm group"
                        >
                            <Bell className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                            <span>Notifications</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Column 1: Squad / Roster */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col h-full hover:border-purple-500/20 transition-colors group">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" /> My Squad
                        </h2>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Active</span>
                    </div>

                    {roster.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <Users className="w-8 h-8 text-gray-600 mb-2" />
                            <p className="text-sm font-medium text-gray-400">No players found.</p>
                            <p className="text-xs text-gray-600 mt-1">Add players in Roster settings.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {roster.slice(0, 6).map((player) => (
                                <div key={player._id || player.uid || Math.random()} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                    <img
                                        src={player.image || `https://ui-avatars.com/api/?name=${player.ign || player.name || 'P'}&background=random`}
                                        alt={player.ign}
                                        className="w-10 h-10 rounded-lg object-cover bg-black"
                                    />
                                    <div className="overflow-hidden">
                                        <div className="font-bold text-white text-sm truncate">{player.ign || player.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">{player.role || 'Member'}</div>
                                    </div>
                                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {roster.length > 6 && (
                        <button className="w-full mt-4 py-3 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                            View All {roster.length} Members
                        </button>
                    )}
                </div>

                {/* Column 2: Next Match & Events */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col h-full hover:border-purple-500/20 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-purple-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-red-500" /> Mission Control
                        </h2>
                        <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${nextEvent?.isLive ? 'text-red-500 animate-pulse' : 'text-gray-500 group-hover:text-red-400'}`}>
                            {nextEvent?.isLive ? 'Live Action' : 'Upcoming'}
                        </span>
                    </div>

                    {/* Countdown / Next Match Card */}
                    {nextEvent ? (
                        <div className={`bg-gradient-to-br ${nextEvent.isLive ? 'from-red-900/40 to-black border-red-500/50' : 'from-purple-900/20 to-black border-purple-500/30'} border rounded-2xl p-5 mb-4 relative overflow-hidden`}>
                            {nextEvent.isLive && (
                                <div className="absolute top-0 right-0 p-10 bg-red-500/20 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                            )}

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <div className={`text-[10px] font-bold ${nextEvent.isLive ? 'text-red-400' : 'text-purple-400'} uppercase tracking-widest mb-1`}>
                                        {nextEvent.isLive ? 'Current Operation' : 'Next Operation'}
                                    </div>
                                    <div className="font-black text-white text-lg leading-tight">{nextEvent.displayTitle || nextEvent.title}</div>
                                </div>
                                <div className={`p-2 ${nextEvent.isLive ? 'bg-red-500/10' : 'bg-purple-500/10'} rounded-lg`}>
                                    <Clock className={`w-5 h-5 ${nextEvent.isLive ? 'text-red-400' : 'text-purple-400'}`} />
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            <div className="text-center mb-4 py-3 bg-black/40 rounded-xl border border-white/5">
                                <div className={`text-3xl md:text-4xl font-black ${nextEvent.isLive ? 'text-red-500' : 'text-white'} font-mono tracking-wider tabular-nums`}>
                                    {nextEvent.isLive && nextEvent.isTournamentDay ? "TOURNAMENT LIVE" : (nextEvent.isLive ? "LIVE NOW" : (timeLeft || "00:00:00"))}
                                </div>
                                <div className={`text-[10px] font-bold ${nextEvent.isLive ? 'text-red-400' : 'text-purple-400'} uppercase tracking-widest mt-1`}>
                                    {nextEvent.isLive ? (nextEvent.isTournamentDay ? 'Status' : 'Status') : 'Time Remaining'}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-black/40 rounded-xl p-3 border border-white/5">
                                <div>
                                    <div className="text-xs text-gray-500 font-bold uppercase">Time</div>
                                    <div className="text-white font-mono font-bold">
                                        {nextEvent.displayTime === "Ongoing" ? "All Day" : new Date(nextEvent.targetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/10"></div>
                                <div>
                                    <div className="text-xs text-gray-500 font-bold uppercase">Date</div>
                                    <div className="text-white font-mono font-bold">
                                        {new Date(nextEvent.targetTime).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 text-center mb-4">
                            <p className="text-gray-500 text-sm font-medium">No upcoming missions.</p>
                            <p className="text-xs text-gray-600 mt-1">Schedule matches to see them here.</p>
                        </div>
                    )}

                    {/* List of other events */}
                    <div className="flex-1 space-y-2">
                        {events.length > 0 ? (
                            events.slice(0, 3).map(event => (
                                <div key={event._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/item">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-purple-500/30 transition-colors">
                                        {event.type === 'scrim' ? <Target className="w-4 h-4 text-gray-400" /> : <Trophy className="w-4 h-4 text-yellow-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{event.title}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
                                            <span>{new Date(event.startTime).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                                            <span className={event.status === 'Upcoming' ? 'text-green-500' : 'text-gray-500'}>{event.status}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover/item:text-white transition-colors" />
                                </div>
                            ))
                        ) : null}
                    </div>
                </div>

                {/* Column 3: Recruitment & Scout */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col h-full hover:border-purple-500/20 transition-colors group">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-emerald-500" /> Recruitment
                        </h2>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Hiring</span>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-4 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-3xl font-black text-white mb-1">{recruitment.filter(p => p.status === 'Open').length}</div>
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Open Roles</div>

                            <button
                                onClick={() => navigate('/team/recruitment', { state: { openCreate: true } })}
                                className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3 h-3" /> Post New Role
                            </button>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <Target className="w-32 h-32 text-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end pb-2 border-b border-white/5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Available Candidates</h3>
                            <span onClick={() => navigate('/team/recruitment')} className="text-[10px] font-bold text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors">View All</span>
                        </div>

                        {/* Scouted Players (Recent) */}
                        <div className="space-y-3">
                            {scoutPlayers.length === 0 ? (
                                <div className="text-xs text-gray-500 text-center py-4">No candidates found right now.</div>
                            ) : (
                                scoutPlayers.slice(0, 3).map((player) => (
                                    <div key={player._id} className="flex items-center gap-3 group/app cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl transition-all">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-sm font-bold text-white overflow-hidden shadow-lg">
                                            {player.image ? (
                                                <img src={player.image} alt={player.ign} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs">{player.ign ? player.ign.charAt(0).toUpperCase() : '?'}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-black text-white group-hover/app:text-emerald-400 transition-colors truncate mb-0.5">{player.ign || "Unknown Player"}</div>
                                            <div className="text-xs text-gray-400 font-medium truncate flex items-center gap-2">
                                                <span className="flex items-center gap-1"><Target className="w-3 h-3 text-gray-500" /> {player.role || "Flex"}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>{player.experience || "Native"}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate('/team/scout'); }}
                                            className="text-[10px] font-bold text-black bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors shadow-lg shadow-emerald-900/20"
                                        >
                                            Scout
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Notification Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
                    <div className="relative bg-[#09090b] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-purple-500" /> Notification Alerts
                            </h3>
                            <button onClick={() => setIsSettingsOpen(false)}><LogOut className="w-5 h-5 text-gray-500 rotate-45 hover:text-white" /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                <p className="text-xs text-purple-200">
                                    Configure where you want to receive alerts.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+92 300 1234567"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                        value={settingsForm.whatsapp}
                                        onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Instagram Handle</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-500">@</span>
                                        <input
                                            type="text"
                                            placeholder="team_official"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:border-purple-500 outline-none"
                                            value={settingsForm.instagram}
                                            onChange={e => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSettings}
                                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TeamDashboard;
