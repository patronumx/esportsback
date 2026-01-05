import { useState, useEffect } from 'react';
import { Save, FileText, CheckCircle, AlertCircle, Layout, Calendar, Clock, ArrowRight, Eye, User, Target, Map, BookOpen, X, Swords, AlertOctagon, Car, MessageSquarePlus } from 'lucide-react';
import { showToast } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const AdminPlanning = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('strategies'); // 'strategies' | 'guidelines'

    // Guidelines State
    const [guidelineContent, setGuidelineContent] = useState('');
    const [isLoadingGuidelines, setIsLoadingGuidelines] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Strategies State
    const [teamPlans, setTeamPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);

    // Viewer State
    const [activePlan, setActivePlan] = useState(null);
    const [activeMatchId, setActiveMatchId] = useState(null);

    const activeMatch = activePlan?.matches?.find(m => m.id === activeMatchId);

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

    useEffect(() => {
        if (activeTab === 'guidelines') fetchGuidelines();
        if (activeTab === 'strategies') fetchTeamPlans();
    }, [activeTab]);

    // --- Guidelines Logic ---
    const fetchGuidelines = async () => {
        setIsLoadingGuidelines(true);
        try {
            const res = await fetch(`https://petite-towns-follow.loca.lt/api/guidelines/match-updates`);
            if (res.ok) {
                const data = await res.json();
                setGuidelineContent(data.content || '');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingGuidelines(false);
        }
    };

    const handleSaveGuidelines = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('https://petite-towns-follow.loca.lt/api/guidelines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify({ type: 'match-updates', content: guidelineContent })
            });
            if (res.ok) showToast.success("Guidelines Updated");
            else showToast.error("Failed to save");
        } catch (err) {
            showToast.error("Network Error");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Strategies Logic ---
    const fetchTeamPlans = async () => {
        setIsLoadingPlans(true);
        try {
            const res = await fetch(`https://petite-towns-follow.loca.lt/api/planning/admin/all`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTeamPlans(data);
            }
        } catch (err) {
            console.error(err);
            showToast.error("Failed to load plans");
        } finally {
            setIsLoadingPlans(false);
        }
    };

    const handleSaveFeedback = async () => {
        if (!activePlan) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://petite-towns-follow.loca.lt/api/planning/admin/feedback/${activePlan._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ adminFeedback: activePlan.adminFeedback })
            });

            if (!res.ok) throw new Error('Failed to save feedback');
            showToast.success('Feedback saved successfully');

            // Update local list
            setTeamPlans(prev => prev.map(p => p._id === activePlan._id ? { ...p, adminFeedback: activePlan.adminFeedback } : p));

        } catch (err) {
            console.error(err);
            showToast.error('Failed to save feedback');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Layout className="w-8 h-8 text-purple-500" /> Planning & Guidelines
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">Review team strategies and update submission guidelines.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {['strategies', 'guidelines'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB: STRATEGIES */}
            {activeTab === 'strategies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingPlans && <div className="text-center col-span-full py-20 text-gray-500">Loading strategies...</div>}
                    {!isLoadingPlans && teamPlans.length === 0 && <div className="text-center col-span-full py-20 text-gray-500">No strategies found.</div>}

                    {teamPlans.map(plan => (
                        <div key={plan._id} className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                                        {plan.team?.logoUrl ? (
                                            <img src={plan.team.logoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white leading-tight">{plan.team?.name || 'Unknown Team'}</h3>
                                        <div className="text-xs text-purple-400 font-mono">ID: {plan.team?._id?.slice(-4)}</div>
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/5 px-2 py-1 rounded">
                                    {format(new Date(plan.updatedAt), 'MMM d')}
                                </span>
                            </div>

                            <h4 className="text-lg font-bold text-gray-200 mb-2">{plan.tournamentName}</h4>

                            {plan.dates && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <Clock className="w-3 h-3" /> {plan.dates}
                                </div>
                            )}

                            {/* Feedback Indicator */}
                            {plan.adminFeedback && (
                                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                                    <MessageSquarePlus className="w-3 h-3 text-orange-400" />
                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Guidelines Sent</span>
                                </div>
                            )}

                            <div className="border-t border-white/5 pt-4 flex justify-end">
                                <button onClick={() => setActivePlan(plan)} className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    View Full Plan <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB: GUIDELINES */}
            {activeTab === 'guidelines' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-1 relative">
                        <textarea
                            className="w-full h-[60vh] bg-black/20 text-white p-8 text-lg font-mono leading-relaxed outline-none resize-none placeholder-gray-700 focus:bg-black/40 transition-colors rounded-xl"
                            placeholder="# Guidelines for Teams..."
                            value={guidelineContent}
                            onChange={(e) => setGuidelineContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveGuidelines}
                            disabled={isSaving}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Publish Guidelines'}
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODALS --- */}

            {/* PLAN DETAIL MODAL */}
            {activePlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pl-0 md:pl-72 lg:pl-80 transition-all">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setActivePlan(null)} />
                    <div className="relative bg-[#0a0a0a] w-full max-w-6xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/5">

                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                                    {activePlan.tournamentName}
                                </h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                        <User className="w-3 h-3 text-purple-400" />
                                        <span className="text-purple-400 font-bold text-xs uppercase tracking-wider">{activePlan.team?.name || "Unknown Team"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-400 font-medium text-xs">{activePlan.dates}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setActivePlan(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                        </div>

                        {/* Coach Feedback Section */}
                        <div className="px-8 py-6 border-b border-white/10 bg-[#0e0e0e]">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <MessageSquarePlus className="w-4 h-4 text-orange-400" /> Tournament Guidelines & Feedback
                            </h3>
                            <div className="relative">
                                <textarea
                                    value={activePlan.adminFeedback || ''}
                                    onChange={(e) => setActivePlan({ ...activePlan, adminFeedback: e.target.value })}
                                    placeholder="Enter specific guidelines or feedback for this tournament strategy..."
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all min-h-[100px] resize-y"
                                />
                                <button
                                    onClick={handleSaveFeedback}
                                    className="absolute bottom-3 right-3 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-orange-900/20 flex items-center gap-2"
                                >
                                    <Save className="w-3 h-3" /> Save Feedback
                                </button>
                            </div>
                        </div>

                        {/* Matches List */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#050505] custom-scrollbar space-y-4">
                            {activePlan.matches.map((match) => (
                                <div key={match.id} className="group relative bg-[#121212] border border-white/5 hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-0.5">
                                    {/* Visual strip based on map */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${mapBgColors[match.map].split(' ')[0].replace('/10', '')}`} />

                                    <div className="flex flex-col md:flex-row items-center gap-6 p-5 pl-7">
                                        {/* Match ID Group */}
                                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors shrink-0">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Match</span>
                                            <span className="text-3xl font-black text-white">{match.id}</span>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 items-center w-full">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1.5"><Map className="w-3 h-3" /> Map</span>
                                                <span className={`font-bold text-sm ${mapColors[match.map]}`}>{match.map}</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1.5"><Target className="w-3 h-3" /> Drop Point</span>
                                                <span className="font-bold text-gray-200 text-sm">
                                                    {match.drop || "Not Set"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Strategy</span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold w-fit
                                                    ${match.activeScenario === 'A' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                        match.activeScenario === 'B' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-red-500/10 text-red-400 border border-red-500/20'}
                                                 `}>
                                                    PLAN {match.activeScenario}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Score</span>
                                                <span className="font-black text-white text-2xl">{match.postMatch?.score || 0} <span className="text-xs font-normal text-gray-500">pts</span></span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <button
                                            onClick={() => setActiveMatchId(match.id)}
                                            className="w-full md:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all border border-white/5 group-hover:border-white/10 flex items-center justify-center gap-2 group/btn whitespace-nowrap"
                                        >
                                            Review Analysis <ArrowRight className="w-4 h-4 text-purple-500 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MATCH DETAIL MODAL (Overlay) */}
            {activeMatch && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 pl-0 md:pl-72 lg:pl-80 transition-all">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setActiveMatchId(null)} />
                    <div className="relative bg-[#0a0a0a] w-full max-w-5xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border bg-[#121212] ${mapColors[activeMatch.map]} border-white/10 shadow-lg`}>
                                    {activeMatch.id}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                        Match Analysis
                                        <span className={`text-sm px-2 py-0.5 rounded border ${mapBgColors[activeMatch.map]} ${mapColors[activeMatch.map]}`}>{activeMatch.map}</span>
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-400" /> {activePlan?.team?.name}</span>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                        <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-blue-400" /> {activeMatch.drop || "No Drop"}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setActiveMatchId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#050505] relative">
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                                {/* Left: Scenarios */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                                <Target className="w-5 h-5 text-purple-500" /> Tactical Scenario
                                            </h3>
                                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                                                PLAN {activeMatch.activeScenario}
                                            </span>
                                        </div>

                                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Car className="w-3 h-3" /> Vehicle Priority</label>
                                                    <div className="text-sm text-gray-200 font-medium">{activeMatch.scenarios[activeMatch.activeScenario]?.vehicle || 'Not specified'}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timing Window</label>
                                                    <div className="text-sm text-gray-200 font-medium">{activeMatch.scenarios[activeMatch.activeScenario]?.timing || 'Not specified'}</div>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/5 pt-4">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Rotation Strategy</label>
                                                <div className="text-sm text-gray-300 leading-relaxed font-mono bg-white/[0.02] p-4 rounded-xl border border-white/5 min-h-[100px] whitespace-pre-wrap">
                                                    {activeMatch.scenarios[activeMatch.activeScenario]?.rotation || 'No rotation details provided for this scenario.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Intel & Chokes */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 hover:border-orange-500/30 transition-colors group/card">
                                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2 text-orange-400">
                                                <Swords className="w-4 h-4 group-hover/card:rotate-12 transition-transform" /> Opponent Intel
                                            </h3>
                                            <div className="text-sm text-gray-400 leading-relaxed min-h-[80px] whitespace-pre-wrap">
                                                {activeMatch.keyPlayerNotes || 'No intel recorded.'}
                                            </div>
                                        </div>
                                        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 hover:border-red-500/30 transition-colors group/card">
                                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2 text-red-400">
                                                <AlertOctagon className="w-4 h-4 group-hover/card:scale-110 transition-transform" /> Choke Points
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(activeMatch.chokePoints) && activeMatch.chokePoints.length > 0 ? (
                                                    activeMatch.chokePoints.map((cp, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-bold">{cp}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No choke points identified.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Post Match */}
                                <div className="space-y-6">
                                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 h-full flex flex-col">
                                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-blue-500" /> Post-Match
                                        </h3>

                                        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl text-center mb-6">
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-1">{activeMatch.postMatch?.score || 0}</div>
                                            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Total Points</div>
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Mistakes & Learnings</label>
                                            <div className="w-full h-full min-h-[200px] bg-[#0a0a0a] border border-white/5 rounded-xl p-4 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                {activeMatch.postMatch?.planVsReality || 'No post-match analysis submitted.'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlanning;
