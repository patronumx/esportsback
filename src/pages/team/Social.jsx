import { useEffect, useState } from 'react';
import api from '../../api/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import PremiumBlur from '../../components/common/PremiumBlur';

const TeamSocial = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch or fetch real data to blur
        const fetchData = async () => {
            try {
                const { data } = await api.get('/team/social-analytics');
                setData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mockHistory = [
        { date: '2023-01-01', followers: 5000, engagement: 2.5 },
        { date: '2023-01-05', followers: 5200, engagement: 3.1 },
        { date: '2023-01-10', followers: 5500, engagement: 2.8 },
        { date: '2023-01-15', followers: 5800, engagement: 4.2 },
        { date: '2023-01-20', followers: 6000, engagement: 3.5 },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-full text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Social Analytics <span className="text-sm font-normal text-gray-500 normal-case ml-2">(Data Locked)</span></h1>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Followers" },
                    { label: "Total Reach" },
                    { label: "Engagement Rate" },
                    { label: "Impressions" }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 relative h-full">
                        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</h3>
                        <p className="text-xl font-bold text-gray-500 uppercase tracking-tight select-none">Data Coming Soon</p>
                    </div>
                ))}
            </div>

            {/* Charts Section - UNLOCKED with Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <h3 className="text-white font-bold mb-4">Follower Growth (30 Days)</h3>
                    <div className="h-64 filter flex items-center justify-center border border-white/5 border-dashed rounded-xl bg-black/20">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Growth Data Coming Soon</p>
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <h3 className="text-white font-bold mb-4">Engagement Trends</h3>
                    <div className="h-64 filter flex items-center justify-center border border-white/5 border-dashed rounded-xl bg-black/20">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Trend Data Coming Soon</p>
                    </div>
                </div>
            </div>

            {/* Top Posts - UNLOCKED with Placeholder */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-white font-bold mb-4">Top Performing Posts</h3>
                <div className="flex items-center justify-center py-12 border border-white/5 border-dashed rounded-xl bg-black/20">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Post Analytics Coming Soon</p>
                </div>
            </div>
        </div>
    );
};

export default TeamSocial;
