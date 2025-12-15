import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Plus, Trash2, Download, Trophy, TrendingUp, DollarSign, Calendar, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPerformance = () => {
    const [performances, setPerformances] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ team: '', tournamentName: '', placement: '', date: '', earnings: '', region: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [perfRes, teamsRes] = await Promise.all([
                api.get('/admin/performance'),
                api.get('/admin/teams')
            ]);
            setPerformances(perfRes.data.data || perfRes.data);
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
            await api.post('/admin/performance', formData);
            setShowModal(false);
            fetchData();
            setFormData({ team: '', tournamentName: '', placement: '', date: '', earnings: '', region: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete performance entry?')) {
            try {
                await api.delete(`/admin/performance/${id}`);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Calculate stats
    const totalEarnings = performances.reduce((acc, curr) => acc + (Number(curr.earnings) || 0), 0);
    const totalWins = performances.filter(p => Number(p.placement) === 1).length;
    const topPlacement = performances.length > 0 ? Math.min(...performances.map(p => Number(p.placement) || 999)) : '-';

    // Prepare chart data (sorted by date)
    const chartData = [...performances]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(p => ({
            name: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            earnings: Number(p.earnings) || 0,
            placement: p.placement
        }));

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
                    <a href="http://localhost:5000/api/admin/export/performance" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl flex items-center hover:bg-gray-700 transition-colors border border-white/5">
                        <Download className="mr-2 w-4 h-4" /> Export CSV
                    </a>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                        <Plus className="mr-2 w-5 h-5" /> Add Entry
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/40 to-black/40 p-6 rounded-3xl border border-blue-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-24 h-24 text-blue-400" /></div>
                    <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Total Earnings</p>
                    <h3 className="text-4xl font-black text-white">${totalEarnings.toLocaleString()}</h3>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-black/40 p-6 rounded-3xl border border-purple-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-purple-400" /></div>
                    <p className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-1">Total Wins</p>
                    <h3 className="text-4xl font-black text-white">{totalWins}</h3>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/40 to-black/40 p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24 text-emerald-400" /></div>
                    <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Best Placement</p>
                    <h3 className="text-4xl font-black text-white">#{topPlacement}</h3>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" /> Earnings Trend
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
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
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']}
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white">Add Performance</h2>
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
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tournament Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.tournamentName}
                                    onChange={e => setFormData({ ...formData, tournamentName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Placement</label>
                                    <input
                                        type="text"
                                        placeholder="#"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.placement}
                                        onChange={e => setFormData({ ...formData, placement: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Earnings</label>
                                    <input
                                        type="number"
                                        placeholder="$"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.earnings}
                                        onChange={e => setFormData({ ...formData, earnings: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Region</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.region}
                                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                                    />
                                </div>
                            </div>

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
        </div>
    );
};

export default AdminPerformance;
