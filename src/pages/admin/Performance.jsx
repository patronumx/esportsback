import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Plus, Trash2, Download, Trophy, TrendingUp, DollarSign, Calendar, X, Users, Gamepad2, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import CustomSelect from '../../components/common/CustomSelect';
import { showToast } from '../../utils/toast';

const AdminPerformance = () => {
    const [performances, setPerformances] = useState([]);
    const [teams, setTeams] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        team: '',
        tournamentName: '',
        placement: '',
        date: '',
        earnings: '',
        region: '',
        matchesPlayed: '',
        eliminations: '',
        playerStats: []
    });

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [perfRes, teamsRes, playersRes] = await Promise.all([
                api.get('/admin/performance'),
                api.get('/admin/teams?limit=100'),
                api.get('/admin/players')
            ]);
            setPerformances(perfRes.data.data || perfRes.data);
            setTeams(teamsRes.data.data || teamsRes.data);
            setAllPlayers(playersRes.data.data || playersRes.data);
        } catch (error) {
            console.error(error);
            showToast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Initialize player stats when team changes
    useEffect(() => {
        if (formData.team) {
            const teamPlayers = allPlayers.filter(p => p.team?._id === formData.team || p.team === formData.team);
            setFormData(prev => ({
                ...prev,
                playerStats: teamPlayers.map(p => ({
                    player: p._id,
                    ign: p.ign,
                    kills: 0,
                    assists: 0,
                    deaths: 0,
                    matches: 0,
                    mvpCount: 0
                }))
            }));
        }
    }, [formData.team, allPlayers]);

    const handlePlayerStatChange = (index, field, value) => {
        const newStats = [...formData.playerStats];
        newStats[index][field] = Number(value);
        setFormData({ ...formData, playerStats: newStats });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                placement: Number(formData.placement),
                earnings: formData.earnings ? Number(formData.earnings) : 0,
                eliminations: formData.eliminations ? Number(formData.eliminations) : 0,
                wins: formData.wins ? Number(formData.wins) : 0,
                matchesPlayed: formData.matchesPlayed ? Number(formData.matchesPlayed) : 0,
                playerStats: formData.playerStats.map(stat => ({
                    ...stat,
                    kills: Number(stat.kills) || 0,
                    assists: Number(stat.assists) || 0,
                    deaths: Number(stat.deaths) || 0,
                    matches: Number(stat.matches) || 0,
                    mvpCount: Number(stat.mvpCount) || 0
                }))
            };
            await api.post('/admin/performance', payload);
            setShowModal(false);
            fetchData();
            setFormData({ team: '', tournamentName: '', placement: '', date: '', earnings: '', region: '', matchesPlayed: '', eliminations: '', wins: '', playerStats: [] });
            showToast.success('Performance added successfully');
        } catch (error) {
            console.error(error);
            showToast.error('Failed to add performance');
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/admin/performance/${deleteId}`);
            fetchData();
            showToast.success('Performance entry deleted');
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            showToast.error('Failed to delete performance entry');
        }
    };

    // Calculate stats
    const totalEarnings = performances.reduce((acc, curr) => acc + (Number(curr.earnings) || 0), 0);
    const totalWins = performances.filter(p => Number(p.placement) === 1).length;
    const topPlacement = performances.length > 0 ? Math.min(...performances.map(p => Number(p.placement) || 999)) : '-';

    // Prepare chart data (sorted by date)
    const chartData = [...performances]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(p => {
            const teamId = typeof p.team === 'object' ? p.team._id : p.team;
            const team = teams.find(t => t._id === teamId);
            return {
                name: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                earnings: Number(p.earnings) || 0,
                placement: p.placement,
                teamName: team ? team.name : 'Unknown Team'
            };
        });

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                        Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Analytics</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Track team results, earnings, and tournament history.</p>
                </div>
                <div className="flex gap-3">
                    <a href="https://petite-towns-follow.loca.lt/api/admin/export/performance" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl flex items-center hover:bg-gray-700 transition-colors border border-white/5">
                        <Download className="mr-2 w-4 h-4" /> Export CSV
                    </a>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                        <Plus className="mr-2 w-5 h-5" /> Add Entry
                    </button>
                </div>
            </div>



            {/* Team Standings Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" /> Team Standings
                </h3>
                {teams.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-white/5">
                        <p className="text-gray-500">No teams found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map(team => {
                            const teamPerfs = performances.filter(p => p.team?._id === team._id || p.team === team._id);
                            const earnings = teamPerfs.reduce((acc, curr) => acc + (Number(curr.earnings) || 0), 0);
                            const wins = teamPerfs.reduce((acc, curr) => acc + (Number(curr.wins) || 0), 0);
                            const matches = teamPerfs.reduce((acc, curr) => acc + (Number(curr.matchesPlayed) || 0), 0);
                            const kills = teamPerfs.reduce((acc, curr) => acc + (Number(curr.eliminations) || 0), 0);

                            return {
                                ...team,
                                earnings: earnings,
                                wins: wins,
                                matches: matches,
                                kills: kills
                            };
                        })
                            .sort((a, b) => b.earnings - a.earnings)
                            .map(team => (
                                <div key={team._id} className="bg-gray-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {team.logo ? (
                                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-gray-500">{team.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{team.name}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-500" /> {team.wins} Wins</span>
                                            <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3 text-blue-500" /> {team.matches} Matches</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-emerald-400 font-black text-lg">${team.earnings.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500 font-bold">{team.kills} Kills</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Chart Section */}
            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" /> Earnings Trend
                </h3>
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value, name, props) => [`$${value.toLocaleString()}`, props.payload.teamName]}
                            />
                            <Area type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Performance List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" /> Recent Results
                </h3>
                {performances.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-white/5">
                        <p className="text-gray-500">No performance records found</p>
                    </div>
                ) : (
                    performances.map(perf => (
                        <div key={perf._id} className="group flex flex-col md:flex-row items-center bg-gray-900/40 hover:bg-gray-800 rounded-2xl border border-white/5 hover:border-blue-500/30 p-4 transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/40 border border-white/10 mr-4 font-black text-lg text-white group-hover:border-blue-500/50 transition-colors">
                                #{perf.placement}
                            </div>
                            <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                                <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{perf.tournamentName}</h4>
                                <div className="flex items-center justify-center md:justify-start text-sm text-gray-400 gap-3">
                                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(perf.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{perf.team?.name || 'Unknown Team'}</span>
                                    {perf.matchesPlayed > 0 && <span>• {perf.matchesPlayed} Matches</span>}
                                    {perf.eliminations > 0 && <span>• {perf.eliminations} Kills</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Earnings</p>
                                    <p className="text-xl font-black text-emerald-400">${Number(perf.earnings).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(perf._id)}
                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-2xl border border-white/10 shadow-2xl relative overflow-hidden my-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white">Add Performance</h2>
                                <p className="text-gray-400 text-xs mt-1">Record tournament results and stats</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {/* Main Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Team</label>
                                    <CustomSelect
                                        options={teams}
                                        value={formData.team}
                                        onChange={(value) => setFormData({ ...formData, team: value })}
                                        placeholder="Select Team"
                                        labelKey="name"
                                        valueKey="_id"
                                        icon={Users}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tournament Name</label>
                                    <div className="relative group">
                                        <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full pl-9 pr-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                            placeholder="e.g. PMGC 2024"
                                            value={formData.tournamentName}
                                            onChange={e => setFormData({ ...formData, tournamentName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Placement</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 font-bold flex items-center justify-center">#</div>
                                        <input
                                            type="text"
                                            placeholder="1"
                                            className="w-full pl-8 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                            value={formData.placement}
                                            onChange={e => setFormData({ ...formData, placement: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Earnings</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 font-bold flex items-center justify-center">$</div>
                                        <input
                                            type="number"
                                            placeholder="50000"
                                            className="w-full pl-8 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                            value={formData.earnings}
                                            onChange={e => setFormData({ ...formData, earnings: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Matches</label>
                                    <div className="relative group">
                                        <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full pl-9 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                            value={formData.matchesPlayed}
                                            onChange={e => setFormData({ ...formData, matchesPlayed: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Wins</label>
                                    <div className="relative group">
                                        <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full pl-9 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                            value={formData.wins}
                                            onChange={e => setFormData({ ...formData, wins: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Team Kills</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-400 transition-colors flex items-center justify-center font-bold">K</div>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full pl-9 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                            value={formData.eliminations}
                                            onChange={e => setFormData({ ...formData, eliminations: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="date"
                                            className="w-full pl-9 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600 [color-scheme:dark]"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Region</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Global"
                                            className="w-full pl-9 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                            value={formData.region}
                                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Player Stats Section */}
                            {formData.playerStats.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-white flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-blue-400" />
                                            Player Statistics
                                        </h3>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Detailed Breakdown</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                        {formData.playerStats.map((stat, index) => (
                                            <div key={stat.player} className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="min-w-[100px]">
                                                    <div className="font-bold text-blue-400 text-sm truncate">{stat.ign}</div>
                                                    <div className="text-[10px] text-gray-500">Player</div>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 flex-1">
                                                    <div>
                                                        <label className="text-[9px] text-gray-500 uppercase block mb-1">Kills</label>
                                                        <input type="number" className="w-full p-2 bg-white/5 rounded-lg border border-white/10 text-white text-sm text-center focus:border-blue-500 focus:outline-none transition-colors" value={stat.kills} onChange={e => handlePlayerStatChange(index, 'kills', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] text-gray-500 uppercase block mb-1">Assists</label>
                                                        <input type="number" className="w-full p-2 bg-white/5 rounded-lg border border-white/10 text-white text-sm text-center focus:border-blue-500 focus:outline-none transition-colors" value={stat.assists} onChange={e => handlePlayerStatChange(index, 'assists', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] text-gray-500 uppercase block mb-1">Matches</label>
                                                        <input type="number" className="w-full p-2 bg-white/5 rounded-lg border border-white/10 text-white text-sm text-center focus:border-blue-500 focus:outline-none transition-colors" value={stat.matches} onChange={e => handlePlayerStatChange(index, 'matches', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] text-gray-500 uppercase block mb-1">MVP</label>
                                                        <input type="number" className="w-full p-2 bg-white/5 rounded-lg border border-white/10 text-yellow-400 font-bold text-sm text-center focus:border-yellow-500 focus:outline-none transition-colors" value={stat.mvpCount} onChange={e => handlePlayerStatChange(index, 'mvpCount', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Add Performance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <ConfirmationModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Performance"
                message="Are you sure you want to delete this performance entry?"
                confirmText="Delete"
                isDanger={true}
            />
        </div >
    );
};

export default AdminPerformance;
