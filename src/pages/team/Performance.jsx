import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Trophy, TrendingUp, DollarSign, Calendar, Plus, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import PremiumBlur from '../../components/common/PremiumBlur';

const TeamPerformance = () => {
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        tournamentName: '',
        placement: '',
        earnings: '',
        wins: '',
        eliminations: '',
        matchesPlayed: '',
        date: new Date().toISOString().split('T')[0],
        region: ''
    });

    const fetchPerformance = async () => {
        try {
            const { data } = await api.get('/team/performance-history');
            setPerformances(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                placement: Number(formData.placement),
                earnings: formData.earnings ? Number(formData.earnings) : 0,
                wins: formData.wins ? Number(formData.wins) : 0,
                eliminations: formData.eliminations ? Number(formData.eliminations) : 0,
                matchesPlayed: formData.matchesPlayed ? Number(formData.matchesPlayed) : 0
            };
            await api.post('/team/performance', payload);
            setShowModal(false);
            fetchPerformance();
            setFormData({
                tournamentName: '',
                placement: '',
                earnings: '',
                wins: '',
                eliminations: '',
                matchesPlayed: '',
                date: new Date().toISOString().split('T')[0],
                region: ''
            });
            toast.success('Performance added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add performance');
        }
    };

    // Calculate Stats
    const totalEarnings = performances.reduce((acc, curr) => acc + (Number(curr.earnings) || 0), 0);
    const totalWins = performances.reduce((acc, curr) => acc + (Number(curr.wins) || 0), 0);
    const bestPlacement = performances.length > 0 ? Math.min(...performances.map(p => Number(p.placement) || 999)) : '-';

    // Chart Data (sort by date)
    const chartData = [...performances]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(p => ({
            name: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            earnings: Number(p.earnings) || 0,
            placement: p.placement
        }));

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                        Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Analytics</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Track your team's results, earnings, and tournament history.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                >
                    <Plus className="mr-2 w-5 h-5" /> Add Entry
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/40 to-black/40 p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-24 h-24 text-emerald-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Total Earnings</p>
                        <h3 className="text-4xl font-black text-white px-1 shadow-black drop-shadow-lg">${totalEarnings.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/40 to-black/40 p-6 rounded-3xl border border-cyan-500/20 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-cyan-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-1">Total Wins</p>
                        <h3 className="text-4xl font-black text-white px-1 shadow-black drop-shadow-lg">{totalWins}</h3>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-teal-900/40 to-black/40 p-6 rounded-3xl border border-teal-500/20 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24 text-teal-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-teal-400 text-sm font-bold uppercase tracking-wider mb-1">Best Placement</p>
                        <h3 className="text-4xl font-black text-white px-1 shadow-black drop-shadow-lg">#{bestPlacement}</h3>
                    </div>
                </div>
            </div>

            {/* Tournament History Table - Moved to Top */}
            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Tournament History
                    </h3>
                </div>

                {performances.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-white/5">
                        <p className="text-gray-500">No tournament records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                                    <th className="pb-4 pl-4">Tournament</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Region</th>
                                    <th className="pb-4 text-center">Matches</th>
                                    <th className="pb-4 text-center">Wins</th>
                                    <th className="pb-4 text-center">Placement</th>
                                    <th className="pb-4 text-right pr-4">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {performances.map((perf) => (
                                    <tr key={perf._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 pl-4 font-medium text-white group-hover:text-emerald-400 transition-colors">{perf.tournamentName}</td>
                                        <td className="py-4 text-gray-400 text-sm whitespace-nowrap">{new Date(perf.date).toLocaleDateString()}</td>
                                        <td className="py-4 text-gray-400 text-sm">{perf.region || '-'}</td>
                                        <td className="py-4 text-center text-gray-300">{perf.matchesPlayed}</td>
                                        <td className="py-4 text-center font-bold text-yellow-500">{Number(perf.wins) || 0}</td>
                                        <td className="py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${Number(perf.placement) === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                                                    Number(perf.placement) <= 3 ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50' :
                                                        'bg-gray-800 text-gray-400 border border-white/5'
                                                }`}>
                                                #{perf.placement}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4 font-bold text-emerald-400">${Number(perf.earnings).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Chart Section */}
            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Earnings Trend
                </h3>

                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorEarningsTeam" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']}
                            />
                            <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarningsTeam)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Add Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-xl border border-white/10 shadow-2xl relative overflow-hidden my-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white">Add Performance</h2>
                                <p className="text-gray-400 text-xs mt-1">Record your team's tournament results</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tournament Name</label>
                                <div className="relative group">
                                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                                        placeholder="e.g. PMGC 2024"
                                        value={formData.tournamentName}
                                        onChange={e => setFormData({ ...formData, tournamentName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Placement (#)</label>
                                    <input
                                        type="number"
                                        placeholder="1"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all font-bold placeholder:text-gray-600"
                                        value={formData.placement}
                                        onChange={e => setFormData({ ...formData, placement: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Earnings ($)</label>
                                    <input
                                        type="number"
                                        placeholder="50000"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                        value={formData.earnings}
                                        onChange={e => setFormData({ ...formData, earnings: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Wins</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                        value={formData.wins}
                                        onChange={e => setFormData({ ...formData, wins: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Kills</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                        value={formData.eliminations}
                                        onChange={e => setFormData({ ...formData, eliminations: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Matches</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                        value={formData.matchesPlayed}
                                        onChange={e => setFormData({ ...formData, matchesPlayed: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all [color-scheme:dark]"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Region</label>
                                    <input
                                        type="text"
                                        placeholder="Global"
                                        className="w-full pl-4 pr-3 py-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-emerald-500 focus:outline-none focus:bg-white/10 transition-all placeholder:text-gray-600"
                                        value={formData.region}
                                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20 mt-2"
                            >
                                Add Performance Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamPerformance;
