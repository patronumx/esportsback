import { useState, useEffect } from 'react';
import {
    Target, Map, Shield, Swords, Car, Flag, Save,
    ClipboardList, AlertTriangle, Plus, Trash2, Calendar, FolderOpen, X, Play, Clock,
    Zap, Eye, MessageSquare, AlertOctagon, Skull, Activity, BookOpen, Trophy, FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from '../../../utils/toast';
import { useAuth } from '../../../context/AuthContext';

// Updated Default Data Structure
const DEFAULT_MATCHES = [1, 2, 3, 4, 5, 6].map(id => ({
    id,
    map: id === 1 ? 'Rondo' : id > 4 ? 'Miramar' : 'Erangel',
    // Global
    drop: '',
    activeScenario: 'A',
    // Scenarios
    scenarios: {
        A: { rotation: '', vehicle: '', timing: '', risk: 'Medium' },
        B: { rotation: '', vehicle: '', timing: '', risk: 'High' },
        C: { rotation: '', vehicle: '', timing: '', risk: 'High' }
    },
    chokePoints: [], // stored as comma separated string for simple editing or allow tag input? Let's use string for now.

    // Live Reference
    callouts: [],
    emergencyProtocols: [],

    // Intel
    opponentPlaystyle: [],
    keyPlayerNotes: '',

    // Post Match
    postMatch: {
        planVsReality: '',
        mistakeTags: [],
        score: 0
    },

    // Extras
    objectives: '',
    notes: ''
}));

const Planning = () => {
    const { user } = useAuth();

    // Data
    const [plans, setPlans] = useState([]);

    // Editor State
    const [currentPlanId, setCurrentPlanId] = useState('new');
    const [tournamentName, setTournamentName] = useState('New Tournament Strategy');
    const [dates, setDates] = useState('');
    const [adminFeedback, setAdminFeedback] = useState('');
    const [matches, setMatches] = useState(DEFAULT_MATCHES);

    // UI State
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [schedule, setSchedule] = useState({ start: '', end: '' });
    const [activeMatchId, setActiveMatchId] = useState(null);
    const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
    const [guidelines, setGuidelines] = useState('');

    // Loading/Saving
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchPlanList();
        fetchPlanList();
        fetchGuidelines();
    }, [user]);

    const fetchGuidelines = async () => {
        try {
            const res = await fetch('https://petite-towns-follow.loca.lt/api/guidelines/match-updates');
            if (res.ok) {
                const data = await res.json();
                setGuidelines(data.content || '');
            }
        } catch (err) { console.error(err); }
    };

    const fetchPlanList = async () => {
        if (!user?.token) return;
        try {
            const res = await fetch('https://petite-towns-follow.loca.lt/api/planning', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) setPlans(await res.json());
        } catch (err) { console.error(err); }
    };

    const loadPlanDetails = async (id) => {
        setIsLibraryOpen(false);
        if (id === 'new') {
            setCurrentPlanId('new');
            setTournamentName('New Tournament Strategy');
            setDates('');
            setTournamentName('New Tournament Strategy');
            setDates('');
            setAdminFeedback('');
            setMatches(DEFAULT_MATCHES);
            return;
        }

        try {
            const res = await fetch(`https://petite-towns-follow.loca.lt/api/planning/${id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentPlanId(data._id);
                setTournamentName(data.tournamentName);
                setTournamentName(data.tournamentName);
                setDates(data.dates || '');
                setAdminFeedback(data.adminFeedback || '');

                // Deep Merge Logic for Backwards Compatibility
                const merged = DEFAULT_MATCHES.map(dm => {
                    const found = data.matches.find(d => d.id === dm.id);
                    if (!found) return dm;

                    // Merge scenarios ensuring structure exists
                    const scenarios = { ...dm.scenarios, ...(found.scenarios || {}) };
                    // Handle activeScenario
                    const activeScenario = found.activeScenario || 'A';

                    return { ...dm, ...found, scenarios, activeScenario }; // `found` will override `dm` but `scenarios` is safe
                });

                setMatches(merged);
                showToast.success(`Loaded: ${data.tournamentName}`);
            }
        } catch (err) {
            showToast.error("Failed to load plan");
        }
    };

    const savePlanning = async () => {
        if (!user) return showToast.error("Login required");
        if (!user.token) return showToast.error("Authentication Error: No Token");
        if (!tournamentName.trim()) return showToast.error("Please enter a Tournament Name");

        setIsSaving(true);
        try {
            // Ensure array fields are formatted correctly
            const toArray = (val) => Array.isArray(val) ? val : (val || '').split(',').map(s => s.trim()).filter(Boolean);

            const formattedMatches = matches.map(m => ({
                ...m,
                chokePoints: toArray(m.chokePoints),
                opponentPlaystyle: toArray(m.opponentPlaystyle),
                postMatch: {
                    ...m.postMatch,
                    mistakeTags: toArray(m.postMatch.mistakeTags)
                }
            }));

            const payload = { tournamentName, dates, matches: formattedMatches };
            const isNew = currentPlanId === 'new';
            const url = isNew
                ? 'https://petite-towns-follow.loca.lt/api/planning'
                : `https://petite-towns-follow.loca.lt/api/planning/${currentPlanId}`;

            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const saved = await res.json();
                showToast.success('Strategy Saved!');
                setCurrentPlanId(saved._id);
                fetchPlanList();
            } else {
                const errData = await res.json();
                showToast.error(errData.message || 'Save Failed');
            }
        } catch (err) {
            showToast.error('Network Error');
        } finally {
            setIsSaving(false);
        }
    };

    const deletePlan = async (idToDelete) => {
        if (!confirm('Delete this strategy?')) return;
        try {
            const res = await fetch(`https://petite-towns-follow.loca.lt/api/planning/${idToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                showToast.success('Strategy Deleted');
                const remaining = plans.filter(p => p._id !== idToDelete);
                setPlans(remaining);
                if (currentPlanId === idToDelete) loadPlanDetails('new');
            }
        } catch (err) { showToast.error("Failed to delete"); }
    };

    const applySchedule = () => {
        if (!schedule.start) return showToast.error("Start date is required");
        try {
            const startDate = new Date(schedule.start);
            const endDate = schedule.end ? new Date(schedule.end) : null;
            let formatted = format(startDate, 'MMM d, h:mm a');
            if (endDate) formatted += ` - ${format(endDate, 'MMM d, h:mm a')}`;
            setDates(formatted);
            setIsScheduleModalOpen(false);
        } catch (e) { showToast.error("Invalid Date Selection"); }
    };

    // --- Helper for Deep Updates ---

    // The active match for the MODAL
    const activeMatch = matches.find(m => m.id === activeMatchId);

    // Update specific match by ID (for table rows & modal)
    const updateMatchById = (id, field, value) => {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    // Update specific scenario by Match ID (for modal mainly, but exposed globally)
    const updateScenarioByMatchId = (matchId, scenarioKey, field, value) => {
        setMatches(prev => prev.map(m => {
            if (m.id !== matchId) return m;
            return {
                ...m,
                scenarios: {
                    ...m.scenarios,
                    [scenarioKey]: {
                        ...m.scenarios[scenarioKey],
                        [field]: value
                    }
                }
            };
        }));
    };

    // Helpers convenience for the active modal match
    const updateActiveMatchField = (field, value) => {
        if (activeMatchId) updateMatchById(activeMatchId, field, value);
    };

    const updateActiveScenario = (scenarioKey, field, value) => {
        if (activeMatchId) updateScenarioByMatchId(activeMatchId, scenarioKey, field, value);
    };

    const mapColors = {
        'Erangel': 'text-green-400',
        'Miramar': 'text-yellow-500',
        'Rondo': 'text-cyan-400',
        'Sanhok': 'text-emerald-500'
    };

    const mapBgColors = {
        'Erangel': 'bg-green-500/10 border-green-500/20',
        'Miramar': 'bg-yellow-500/10 border-yellow-500/20',
        'Rondo': 'bg-cyan-500/10 border-cyan-500/20',
        'Sanhok': 'bg-emerald-500/10 border-emerald-500/20'
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative max-w-6xl mx-auto">

            {/* Library Modal */}
            {isLibraryOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLibraryOpen(false)} />
                    <div className="relative bg-[#09090b] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="w-5 h-5 text-purple-500" /> Strategy Library</h2>
                            <button onClick={() => setIsLibraryOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {plans.length === 0 && <div className="text-center py-10 text-gray-500">No saved strategies found.</div>}
                            {plans.map(p => (
                                <div key={p._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all group">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg">{p.tournamentName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                            {p.dates && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.dates}</span>}
                                            <span className="text-xs text-gray-600">ID: {p._id.slice(-4)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => loadPlanDetails(p._id)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"><Play className="w-3 h-3 fill-current" /> Load</button>
                                        <button onClick={() => deletePlan(p._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-zinc-900 border-t border-white/10">
                            <button onClick={() => loadPlanDetails('new')} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 text-gray-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"><Plus className="w-4 h-4" /> Create New Strategy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Modal */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsScheduleModalOpen(false)} />
                    <div className="relative bg-[#09090b] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-purple-500" /> Tournament Schedule</h3>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start</label><input type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none [color-scheme:dark]" value={schedule.start} onChange={(e) => setSchedule({ ...schedule, start: e.target.value })} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End</label><input type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none [color-scheme:dark]" value={schedule.end} onChange={(e) => setSchedule({ ...schedule, end: e.target.value })} /></div>
                            <button onClick={applySchedule} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg mt-2">Apply Schedule</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guidelines Modal */}
            {isGuidelinesOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsGuidelinesOpen(false)} />
                    <div className="relative bg-[#09090b] border border-white/10 w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#09090b]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" /> Match Submission Guidelines
                            </h2>
                            <button onClick={() => setIsGuidelinesOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/20 space-y-8">
                            {/* Specific Tournament Guidelines */}
                            {adminFeedback && (
                                <div className="space-y-3">
                                    <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Tournament Strategy Guidelines
                                    </h3>
                                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                                        <div className="prose prose-invert max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                                            {adminFeedback}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Global Guidelines */}
                            <div className="space-y-3">
                                <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> General Rules & Guidelines
                                </h3>
                                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                    <div className="prose prose-invert max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                                        {guidelines || "No general guidelines set by Admin."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">

                {/* 1. Statistics / Header Panel */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#09090b]/80 border border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-xl shadow-black/20">
                    <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/40 shrink-0"><ClipboardList className="w-6 h-6 text-white" /></div>
                        <div className="flex-1 min-w-0">
                            <input className="bg-transparent text-2xl font-bold text-white border-b border-white/10 focus:border-purple-500 focus:outline-none w-full min-w-[200px] mb-1 placeholder-gray-500" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} placeholder="Unnamed Strategy" />
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsScheduleModalOpen(true)} className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5 hover:border-purple-500/50 hover:bg-white/10 transition-all group">
                                    <Calendar className="w-3.5 h-3.5 text-gray-500 group-hover:text-purple-400" />
                                    <span className={`${dates ? 'text-purple-300 font-medium' : 'text-gray-500'}`}>{dates || "Set Schedule..."}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <button onClick={() => setIsGuidelinesOpen(true)} className="px-5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold rounded-xl transition-colors flex items-center gap-2 border border-blue-500/20"><FileText className="w-4 h-4" /> Guidelines</button>
                        <button onClick={() => setIsLibraryOpen(true)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors flex items-center gap-2 border border-white/10"><FolderOpen className="w-4 h-4 text-purple-400" /> Load</button>
                        <button onClick={savePlanning} disabled={isSaving} className="px-6 py-2.5 bg-white text-black font-bold hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"><Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}</button>
                    </div>
                </div>

                {/* Coach Feedback Display */}
                {adminFeedback && (
                    <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl h-fit shrink-0">
                            <MessageSquare className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-1">Tournament Guidelines & Feedback</h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                {adminFeedback}
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. Matches Table */}
                {/* 2. Matches Table (Refined UI) */}
                <div className="space-y-4">
                    {matches.map((match) => (
                        <div key={match.id} className="group relative bg-[#09090b]/80 border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.05)] hover:-translate-y-1">
                            <div className="flex flex-col md:flex-row gap-6 items-center">

                                {/* Match Info */}
                                <div className="w-full md:w-32 flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Match</span>
                                    <span className="text-3xl font-black text-white leading-none">{match.id}</span>
                                    <span className={`text-xs font-bold mt-2 ${mapColors[match.map]}`}>{match.map}</span>
                                </div>

                                {/* Main Content Grid */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full">

                                    {/* Strategy / Drop */}
                                    <div className="lg:col-span-5 space-y-4 w-full">
                                        <div className="relative group/input">
                                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/input:text-purple-500 transition-colors" />
                                            <input
                                                type="text"
                                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-purple-500/50 focus:bg-purple-900/10 focus:outline-none transition-all placeholder-gray-700 font-medium"
                                                placeholder="Set Drop Location..."
                                                value={match.drop}
                                                onChange={(e) => updateMatchById(match.id, 'drop', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 overflow-x-auto">
                                            {['A', 'B', 'C'].map(plan => (
                                                <button
                                                    key={plan}
                                                    onClick={() => updateMatchById(match.id, 'activeScenario', plan)}
                                                    className={`flex-1 min-w-[60px] py-2 rounded-lg text-xs font-black transition-all duration-300 relative overflow-hidden whitespace-nowrap ${match.activeScenario === plan
                                                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                                                        : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'
                                                        }`}
                                                >
                                                    PLAN {plan}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Performance Stats */}
                                    <div className="lg:col-span-6 grid grid-cols-3 gap-4 w-full">
                                        <div className="col-span-1 h-32 md:h-auto">
                                            <div className="relative group/score h-full w-full">
                                                {/* Fix: Moved overlay behind or removed blocking elements. Added z-10 to input. */}
                                                <div className="absolute inset-0 bg-yellow-500/5 rounded-xl opacity-0 group-focus-within/score:opacity-100 transition-opacity pointer-events-none" />
                                                <input
                                                    type="number"
                                                    className="relative z-10 w-full h-full bg-black/40 border border-white/5 rounded-xl text-center font-black text-2xl text-white focus:border-yellow-500/50 focus:outline-none transition-all placeholder-gray-700"
                                                    value={match.postMatch.score}
                                                    onChange={(e) => updateMatchById(match.id, 'postMatch', { ...match.postMatch, score: parseInt(e.target.value) || 0 })}
                                                    placeholder="0"
                                                />
                                                <div className="absolute bottom-2 left-0 right-0 text-[9px] font-bold text-center text-gray-600 uppercase tracking-widest pointer-events-none z-20">Pts</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 h-32 md:h-auto">
                                            <textarea
                                                className="w-full h-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-red-100/80 focus:border-red-500/30 focus:bg-red-900/10 focus:outline-none transition-all resize-none placeholder-gray-700 leading-relaxed"
                                                placeholder="Log key mistakes..."
                                                value={Array.isArray(match.postMatch.mistakeTags) ? match.postMatch.mistakeTags.join(', ') : match.postMatch.mistakeTags || ''}
                                                onChange={(e) => updateMatchById(match.id, 'postMatch', { ...match.postMatch, mistakeTags: e.target.value.split(', ') })}
                                            />
                                        </div>
                                    </div>

                                    {/* Expand Action */}
                                    <div className="lg:col-span-1 flex items-center justify-center">
                                        <button
                                            onClick={() => setActiveMatchId(match.id)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-110 transition-all duration-300"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Detail Editor Modal */}
            {
                activeMatch && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setActiveMatchId(null)} />
                        <div className="relative bg-[#09090b] w-full max-w-6xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                            {/* Modal Header */}
                            <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-[#09090b]">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border ${mapBgColors[activeMatch.map]}`}>
                                        <span className={mapColors[activeMatch.map]}>{activeMatch.id}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Match {activeMatch.id} planning</h2>
                                        <p className="text-gray-400 text-sm flex items-center gap-2">
                                            <Map className="w-3 h-3" /> {activeMatch.map}
                                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                            <Target className="w-3 h-3" /> {activeMatch.drop || "No Drop Set"}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveMatchId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/20">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                    {/* Left Column: Tactical Scenarios */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                            {/* Decor */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                            <div className="flex justify-between items-center mb-6 relative z-10">
                                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                                    <Target className="w-5 h-5 text-purple-500" /> Tactical Scenarios
                                                </h3>
                                                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                                                    {['A', 'B', 'C'].map(sc => (
                                                        <button
                                                            key={sc}
                                                            onClick={() => updateActiveMatchField('activeScenario', sc)}
                                                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeMatch.activeScenario === sc ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                                        >
                                                            Plan {sc}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Scenario Form */}
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-5 space-y-4">
                                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                    <span className="text-sm font-bold text-purple-300">Scenario {activeMatch.activeScenario} Configuration</span>
                                                    <select
                                                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:border-purple-500 focus:outline-none"
                                                        value={activeMatch.scenarios[activeMatch.activeScenario].risk}
                                                        onChange={(e) => updateActiveScenario(activeMatch.activeScenario, 'risk', e.target.value)}
                                                    >
                                                        <option value="Low">Low Risk</option>
                                                        <option value="Medium">Medium Risk</option>
                                                        <option value="High">High Risk</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Vehicle Requirement</label>
                                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500" placeholder="e.g. 2 UAZ + 2 Buggy" value={activeMatch.scenarios[activeMatch.activeScenario].vehicle || ''} onChange={(e) => updateActiveScenario(activeMatch.activeScenario, 'vehicle', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Timing Window</label>
                                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500" placeholder="e.g. 1:30 Phase 1" value={activeMatch.scenarios[activeMatch.activeScenario].timing || ''} onChange={(e) => updateActiveScenario(activeMatch.activeScenario, 'timing', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Detailed Rotation Path</label>
                                                    <textarea
                                                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-purple-500 resize-none font-mono leading-relaxed"
                                                        placeholder="Step by step rotation guide..."
                                                        value={activeMatch.scenarios[activeMatch.activeScenario].rotation || ''}
                                                        onChange={(e) => updateActiveScenario(activeMatch.activeScenario, 'rotation', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Intel & Chokes */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5">
                                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2 text-orange-400">
                                                    <Swords className="w-4 h-4" /> Opponent Intel
                                                </h3>
                                                <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500/50 resize-none mb-2" placeholder="Dangerous teams nearby..." value={activeMatch.keyPlayerNotes || ''} onChange={(e) => updateActiveMatchField('keyPlayerNotes', e.target.value)} />
                                            </div>
                                            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-5">
                                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2 text-red-400">
                                                    <AlertOctagon className="w-4 h-4" /> Choke Points
                                                </h3>
                                                <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-red-500/50 resize-none" placeholder="Danger zones..." value={Array.isArray(activeMatch.chokePoints) ? activeMatch.chokePoints.join(', ') : activeMatch.chokePoints || ''} onChange={(e) => updateActiveMatchField('chokePoints', e.target.value.split(', '))} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Post Match & Extra */}
                                    <div className="space-y-6">
                                        {/* Post Match Review Extended */}
                                        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
                                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-blue-500" /> Post-Match
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                                    <div className="text-3xl font-black text-white">{activeMatch.postMatch.score}</div>
                                                    <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Total Points Obtained</div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Mistakes & Learnings</label>
                                                    <textarea className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 resize-none" placeholder="Detailed breakdown of what went wrong or right..." value={activeMatch.postMatch.planVsReality || ''} onChange={(e) => updateActiveMatchField('postMatch', { ...activeMatch.postMatch, planVsReality: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 bg-[#09090b] flex justify-end">
                                <button onClick={() => setActiveMatchId(null)} className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">Done</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Planning;
