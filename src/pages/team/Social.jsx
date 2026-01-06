import { useEffect, useState } from 'react';
import api from '../../api/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import PremiumBlur from '../../components/common/PremiumBlur';

const TeamSocial = () => {
    const [data, setData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, historyRes] = await Promise.all([
                    api.get('/team/social-analytics'),
                    api.get('/team/analytics/history')
                ]);
                setData(analyticsRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-full text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    const overview = data?.overview || { totalFollowers: 0, totalReach: 0, avgEngagement: 0, totalImpressions: 0 };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Social Analytics</h1>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Followers", value: overview.totalFollowers.toLocaleString() },
                    { label: "Total Reach", value: overview.totalReach.toLocaleString() },
                    { label: "Engagement Rate", value: `${overview.avgEngagement}%` },
                    { label: "Impressions", value: overview.totalImpressions.toLocaleString() }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 relative h-full">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</h3>
                        <p className="text-3xl font-bold text-white uppercase tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <h3 className="text-white font-bold mb-4">Follower Growth (30 Days)</h3>
                    <div className="h-64 w-full">
                        {history.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                    <Area type="monotone" dataKey="followers" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFollowers)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No history data available</div>
                        )}
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <h3 className="text-white font-bold mb-4">Engagement Trends</h3>
                    <div className="h-64 w-full">
                        {history.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                                    <Line type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No trend data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Platform Breakdown (Optional, using data.platforms) */}
            {data?.platforms && data.platforms.length > 0 && (
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <h3 className="text-white font-bold mb-4">Platform Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {data.platforms.map(p => (
                            <div key={p._id} className="bg-black/20 p-4 rounded-lg border border-white/5">
                                <p className="text-gray-400 text-xs uppercase">{p._id}</p>
                                <p className="text-xl font-bold text-white">{p.followers.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Followers</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamSocial;
