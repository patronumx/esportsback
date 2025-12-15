import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Calendar, Image, Activity, Bell, ArrowUpRight, Clock, Trophy, DollarSign, Video, Mic, Share2, Eye, Download, FileText, CheckCircle, AlertCircle, Loader, LogOut, Instagram, Twitter, Camera, Lock } from 'lucide-react';
import PremiumBlur from '../../components/common/PremiumBlur';

import { useDashboard } from '../../context/DashboardContext';

const TeamDashboard = () => {
    const { teamData: data, teamLoading: loading, fetchTeamData } = useDashboard();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('');

    // Request Handler
    const handleRequestUnlock = (type) => {
        setRequestType(type);
        setShowRequestModal(true);
    };

    const submitRequest = async () => {
        try {
            await api.post('/team/requests', {
                type: requestType,
                message: `Team requested access to ${requestType}`
            });
            setShowRequestModal(false);
            alert('Request submitted! Any admin will review shortly.'); // Using alert for speed, can be toast
        } catch (error) {
            console.error(error);
            alert('Request failed or already pending.');
        }
    };

    useEffect(() => {
        fetchTeamData();
    }, [fetchTeamData]);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    if (!data) return (
        <div className="flex items-center justify-center h-full text-red-400 bg-red-500/10 rounded-xl p-8 border border-red-500/20">
            Error loading dashboard data. Please try again later.
        </div>
    );

    // Modified StatCard to implement Premium blur on values
    const StatCard = ({ title, value, icon: Icon, color, subtext, isLocked }) => (
        <div
            onClick={() => isLocked && handleRequestUnlock(title)}
            className={`bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all h-full ${isLocked ? 'cursor-pointer hover:bg-white/10' : ''}`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon className={`w-24 h-24 text-${color}-500`} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4 text-gray-400">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{title}</span>
                </div>

                <div className="mt-auto">
                    <div className="mt-auto">
                        {isLocked ? (
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
                                <div className="px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                    <Lock className="w-3 h-3" /> On Request
                                </div>
                            </div>
                        ) : (
                            <PremiumBlur>
                                <div className="text-4xl font-black text-white mb-1 tracking-tight select-none">
                                    {value || "12.5M"}
                                </div>
                                {subtext && <div className="text-xs text-gray-500 font-medium">{subtext}</div>}
                            </PremiumBlur>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">

            {/* Header / Welcome Section */}
            <div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Team Dashboard</h1>
                <p className="text-slate-400 text-sm">Media & Sponsor Performance Overview</p>
            </div>

            {/* Active Roster Section - Moved to Top */}
            {data.activeRoster && data.activeRoster.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-violet-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Active Roster</h2>
                    </div>
                    {/* Increased grid columns for larger cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.activeRoster.map((player, idx) => (
                            <div key={idx} className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col items-center hover:scale-105 transition-transform duration-200 group relative overflow-hidden shadow-2xl hover:shadow-violet-500/20">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-violet-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="w-24 h-24 rounded-full border-2 border-violet-500/30 p-1 mb-4 relative z-10 group-hover:border-violet-400 transition-colors">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800">
                                        <img
                                            src={player.image || "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"}
                                            alt={player.ign}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0f0f0f]" title="Active" />
                                </div>

                                <div className="text-center relative z-10">
                                    <h3 className="text-xl font-black text-white mb-1 tracking-tight group-hover:text-violet-400 transition-colors">{player.ign}</h3>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">{player.role}</p>

                                    {/* Social Links */}
                                    <div className="flex justify-center gap-3 mb-4">
                                        {player.socialLinks?.instagram && (
                                            <a href={player.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                        )}
                                        {player.socialLinks?.twitter && (
                                            <a href={player.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                            </a>
                                        )}
                                        {/* Default placeholders if no links */}
                                        {!player.socialLinks && (
                                            <div className="flex gap-2 opacity-30">
                                                <Instagram className="w-4 h-4" />
                                                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>

                                    {player.experience && (
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-zinc-400 border border-white/5">
                                                {player.experience} XP
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Grid - Media & Sponsor Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Sponsor Impressions"
                    value="45.2M"
                    icon={DollarSign}
                    color="emerald"
                    subtext="ROI Data Locked"
                    isLocked={true}
                />
                <StatCard
                    title="Instagram Reach"
                    value="12.4M"
                    icon={Instagram}
                    color="pink"
                    subtext="+24% Engagement"
                    isLocked={true}
                />
                <StatCard
                    title="Content Interactions"
                    value="8.5M"
                    icon={Video}
                    color="violet"
                    subtext="Reels & TikToks"
                    isLocked={true}
                />
                <StatCard
                    title="Total Media Views"
                    value="62.1M"
                    icon={Eye}
                    color="cyan"
                    subtext="All Platforms"
                    isLocked={true}
                />
            </div>

            {/* Recent Activity Report - Table Layout */}
            <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-zinc-500" />
                        <h2 className="text-lg font-bold text-white">Activity Report</h2>
                    </div>
                </div>

                <div className="w-full text-left border-collapse">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="p-4 font-medium pl-6">Activity</th>
                                <th className="p-4 font-medium">Platform</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium text-right pr-6">Impact</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="group hover:bg-white/5 transition-colors border-b border-white/5">
                                <td className="p-4 pl-6 text-white font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <DollarSign className="w-4 h-4" />
                                    </div>
                                    Red Bull Partnership
                                </td>
                                <td className="p-4 text-gray-400">Sponsorship</td>
                                <td className="p-4 text-gray-500">2h ago</td>
                                <td className="p-4 text-right pr-6 text-gray-500 italic">Coming Soon</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors border-b border-white/5">
                                <td className="p-4 pl-6 text-white font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center text-pink-400">
                                        <Instagram className="w-4 h-4" />
                                    </div>
                                    Tournament Highlights
                                </td>
                                <td className="p-4 text-gray-400">Instagram</td>
                                <td className="p-4 text-gray-500">5h ago</td>
                                <td className="p-4 text-right pr-6 text-gray-500 italic">Coming Soon</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors border-b border-white/5">
                                <td className="p-4 pl-6 text-white font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Image className="w-4 h-4" />
                                    </div>
                                    Official Jersey Reveal
                                </td>
                                <td className="p-4 text-gray-400">Press Kit</td>
                                <td className="p-4 text-gray-500">1d ago</td>
                                <td className="p-4 text-right pr-6 text-gray-500 italic">Coming Soon</td>
                            </tr>
                            <tr className="group hover:bg-white/5 transition-colors">
                                <td className="p-4 pl-6 text-white font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    Weekly Channel Insights
                                </td>
                                <td className="p-4 text-gray-400">Analytics</td>
                                <td className="p-4 text-gray-500">2d ago</td>
                                <td className="p-4 text-right pr-6 text-gray-500 italic">Coming Soon</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
                        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Unlock {requestType}</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            This feature requires manual verification or a Pro upgrade. Send a request to our admins?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowRequestModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-medium transition-colors">Cancel</button>
                            <button onClick={submitRequest} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors">Send Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamDashboard;
