import { useEffect, useState } from 'react';
import api from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TeamAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/admin/analytics/teams');
                setData(response.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load team analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-white flex justify-center items-center h-full">Loading...</div>;
    if (!data) return <div className="text-white">No data available</div>;

    // Transform data for charts
    const regionData = data.teamsByRegion.map(item => ({ name: item._id || 'Unknown', value: item.count }));

    // Sort months for growth chart
    const growthData = data.teamsGrowth.map(item => ({
        name: `Month ${item._id}`,
        teams: item.count
    }));

    const topTeamsData = data.activeTeams.map(team => ({
        name: team.name,
        events: team.eventCount
    }));

    const socialStatsData = data.socialStats ? data.socialStats.map(item => ({
        name: item.name,
        followers: item.followers
    })) : [];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Team Analytics
            </h1>

            {/* Social Stats */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">Social Stats</h2>
                {!data.allSocialStats || data.allSocialStats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No social stats uploaded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 border-b border-white/10 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold">Team</th>
                                    <th className="p-4 font-bold">Platform</th>
                                    <th className="p-4 font-bold text-right">Followers</th>
                                    <th className="p-4 font-bold text-right">Engagement</th>
                                    <th className="p-4 font-bold text-right">Reach</th>
                                    <th className="p-4 font-bold text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.allSocialStats.map((stat) => (
                                    <tr key={stat._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                {stat.team && (
                                                    <div className="w-8 h-8 rounded-full bg-black/50 border border-white/10 mr-3 flex items-center justify-center overflow-hidden">
                                                        {stat.team.logoUrl ? <img src={stat.team.logoUrl} alt={stat.team.name} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500">{stat.team.name[0]}</div>}
                                                    </div>
                                                )}
                                                <span className="font-bold text-white">{stat.team?.name || 'Unknown Team'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 capitalize">{stat.platform}</td>
                                        <td className="p-4 text-right text-gray-300 font-mono">{stat.followers.toLocaleString()}</td>
                                        <td className="p-4 text-right text-gray-300 font-mono">{stat.engagementRate}%</td>
                                        <td className="p-4 text-right text-gray-300 font-mono">{stat.reach.toLocaleString()}</td>
                                        <td className="p-4 text-right text-gray-500 text-sm">{new Date(stat.capturedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Active Teams List (Moved to Top) */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">Active Teams Directory</h2>
                {!data.teamsList || data.teamsList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No teams found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 border-b border-white/10 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold">Team Name</th>
                                    <th className="p-4 font-bold">Region</th>
                                    <th className="p-4 font-bold">Game</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.teamsList.map((team) => (
                                    <tr key={team._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-black/50 border border-white/10 mr-3 flex items-center justify-center overflow-hidden">
                                                    {team.logoUrl ? <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500">{team.name[0]}</div>}
                                                </div>
                                                <span className="font-bold text-white">{team.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400">{team.region || '-'}</td>
                                        <td className="p-4 text-gray-400">
                                            <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold">{team.game}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <a href={`/sys-admin-secret-login/teams/${team._id}`} className="inline-block px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-colors">
                                                View Profile
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Teams</h3>
                    <p className="text-4xl font-bold text-white mt-2">{data.totalTeams}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Regions</h3>
                    <p className="text-4xl font-bold text-white mt-2">{regionData.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Top Performer</h3>
                    <p className="text-xl font-bold text-white mt-2 truncate">{topTeamsData[0]?.name || 'N/A'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Regional Distribution */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Teams by Region</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={regionData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {regionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team Growth */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Team Growth (Last 6 Months)</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Line type="monotone" dataKey="teams" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: "#10b981" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Most Active Teams (by Events) */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-4">Most Active Teams (by Events)</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topTeamsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                <Bar dataKey="events" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                    {topTeamsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Social Teams Chart */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Top Social Media Performers (Followers)</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={socialStatsData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                            <Bar dataKey="followers" fill="#ec4899" radius={[0, 4, 4, 0]}>
                                {socialStatsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>



        </div>
    );
};

export default TeamAnalytics;
