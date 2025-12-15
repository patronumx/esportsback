import { useEffect, useState } from 'react';
import api from '../../api/client';
import {
    LayoutDashboard, Users, Trophy, BarChart2, Bell, Settings,
    LogOut, ChevronRight, Crown, Shield, Star, Zap, Globe,
    Calendar, Image, Activity, ArrowUpRight, Clock, DollarSign, Video, Mic, Share2, Eye, Download, FileText, CheckCircle, AlertCircle, Loader, Instagram, Twitter, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PremiumBlur from '../../components/common/PremiumBlur';

// Sidebar Link Component
const NavLink = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
        <span className="font-medium">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />}
    </Link>
);

import { useDashboard } from '../../context/DashboardContext';

const ProDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { teamData: data, teamLoading: loading, fetchTeamData } = useDashboard();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/pro/login');
    };

    useEffect(() => {
        fetchTeamData();
    }, [fetchTeamData]);

    // Modified StatCard to implement Premium blur on values
    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-[#0a0a0a] backdrop-blur-md p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all h-full">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon className={`w-24 h-24 text-${color}-500`} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4 text-gray-400">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{title}</span>
                </div>

                <div className="mt-auto">
                    <PremiumBlur text="On Request">
                        <div className="text-4xl font-black text-white mb-1 tracking-tight blur-sm select-none">
                            {value || "12.5M"}
                        </div>
                        {subtext && <div className="text-xs text-gray-500 font-medium blur-sm">{subtext}</div>}
                    </PremiumBlur>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col relative z-20">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-white">PRO <span className="text-purple-500">SUITE</span></h1>
                            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Enterprise Edition</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <NavLink to="/pro/dashboard" icon={LayoutDashboard} label="Overview" active={isActive('/pro/dashboard')} />
                        <NavLink to="/pro/roster" icon={Users} label="Roster Management" active={isActive('/pro/roster')} />
                        <NavLink to="/pro/tournaments" icon={Trophy} label="Tournaments" active={isActive('/pro/tournaments')} />
                        <NavLink to="/pro/analytics" icon={BarChart2} label="Performance Data" active={isActive('/pro/analytics')} />
                        <NavLink to="/pro/settings" icon={Settings} label="Organization" active={isActive('/pro/settings')} />
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-white/5 mx-4 mb-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-2xl border border-white/10 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                                <img src={user?.teamLogo || 'https://via.placeholder.com/100'} alt="Team Logo" className="w-full h-full object-cover" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-sm font-bold text-white truncate">{user?.teamName || 'Pro Team'}</h4>
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-500 font-medium">Verified Pro</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black relative">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                        <p className="text-gray-500 text-sm">Welcome back, Manager.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-black" />
                        </button>
                        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                            <Globe className="w-3 h-3 text-blue-400" />
                            <span className="text-xs font-medium text-gray-300">Global Region</span>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : !data ? (
                        <div className="flex items-center justify-center h-64 text-red-400 bg-red-500/10 rounded-xl p-8 border border-red-500/20">
                            Error loading dashboard data. Please try again later.
                        </div>
                    ) : (
                        <div className="space-y-8 pb-10">
                            {/* Active Roster Section */}
                            {data.activeRoster && data.activeRoster.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <Activity className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Active Roster</h2>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {data.activeRoster.map((player, idx) => (
                                            <div key={idx} className="bg-[#0a0a0a] backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col items-center hover:scale-105 transition-transform duration-200 group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="w-24 h-24 rounded-full border-2 border-purple-500/30 p-1 mb-4 relative z-10 group-hover:border-purple-400 transition-colors">
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
                                                    <h3 className="text-xl font-black text-white mb-1 tracking-tight group-hover:text-purple-400 transition-colors">{player.ign}</h3>
                                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">{player.role}</p>

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
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatCard
                                    title="Sponsor Impressions"
                                    value="45.2M"
                                    icon={DollarSign}
                                    color="emerald"
                                    subtext="ROI Data Locked"
                                />
                                <StatCard
                                    title="Instagram Reach"
                                    value="12.4M"
                                    icon={Instagram}
                                    color="pink"
                                    subtext="+24% Engagement"
                                />
                                <StatCard
                                    title="Content Interactions"
                                    value="8.5M"
                                    icon={Video}
                                    color="violet"
                                    subtext="Reels & TikToks"
                                />
                                <StatCard
                                    title="Total Media Views"
                                    value="62.1M"
                                    icon={Eye}
                                    color="cyan"
                                    subtext="All Platforms"
                                />
                            </div>

                            {/* Recent Activity Report */}
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
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProDashboard;
