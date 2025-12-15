import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Trophy, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PremiumBlur from '../../components/common/PremiumBlur';

const TeamPerformance = () => {
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                // Mock data or fetch real data (it will be blurred anyway)
                const { data } = await api.get('/team/performance-history');
                setPerformances(data.data || data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    // Placeholder data for the chart background
    const mockChartData = [
        { name: 'Jan', earnings: 1000 },
        { name: 'Feb', earnings: 2500 },
        { name: 'Mar', earnings: 1800 },
        { name: 'Apr', earnings: 3200 },
        { name: 'May', earnings: 2900 },
        { name: 'Jun', earnings: 4500 },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                    Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Analytics</span>
                </h1>
                <p className="text-gray-400 text-sm">Track your team's results, earnings, and tournament history. (Premium Feature)</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/40 to-black/40 p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-24 h-24 text-emerald-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Total Earnings</p>
                        <h3 className="text-xl font-bold text-gray-500 uppercase tracking-tight select-none">Data Coming Soon</h3>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/40 to-black/40 p-6 rounded-3xl border border-cyan-500/20 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24 text-cyan-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-1">Total Wins</p>
                        <h3 className="text-xl font-bold text-gray-500 uppercase tracking-tight select-none">Data Coming Soon</h3>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-teal-900/40 to-black/40 p-6 rounded-3xl border border-teal-500/20 relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24 text-teal-400" /></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <p className="text-teal-400 text-sm font-bold uppercase tracking-wider mb-1">Best Placement</p>
                        <h3 className="text-xl font-bold text-gray-500 uppercase tracking-tight select-none">Data Coming Soon</h3>
                    </div>
                </div>
            </div>

            {/* Chart Section - UNLOCKED with Placeholder */}
            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 backdrop-blur-sm relative">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" /> Earnings Trend
                </h3>

                <div className="h-[300px] w-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-2xl bg-white/5">
                    <TrendingUp className="w-12 h-12 text-zinc-700 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">Chart Data Coming Soon</h3>
                    <p className="text-zinc-600 text-sm mt-1">Earnings history visualization will be available shortly.</p>
                </div>
            </div>

            {/* Recent Performance List - UNLOCKED with Placeholder */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" /> Recent Results
                </h3>

                <div className="flex flex-col items-center justify-center py-12 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <Trophy className="w-12 h-12 text-zinc-700 mb-3" />
                    <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">Match History Coming Soon</h3>
                    <p className="text-zinc-600 text-sm mt-1">Detailed match results will be listed here.</p>
                </div>
            </div>
        </div>
    );
};

export default TeamPerformance;
