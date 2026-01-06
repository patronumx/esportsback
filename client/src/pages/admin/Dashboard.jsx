import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import { Users, Trophy, Image, MessageSquare, ArrowUpRight, Calendar, Clock } from 'lucide-react';

import { useDashboard } from '../../context/DashboardContext';

const AdminDashboard = () => {
    const { adminData: stats, adminLoading: loading, fetchAdminData } = useDashboard();

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!stats) return (
        <div className="flex items-center justify-center h-full text-red-400 bg-red-500/10 rounded-xl p-8 border border-red-500/20">
            Error loading dashboard data. Please try again later.
        </div>
    );

    const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
        <div className={`relative overflow-hidden bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 group hover:border-${color}-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-500`}></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
                    <div className={`p-2 bg-${color}-500/10 rounded-lg group-hover:bg-${color}-500/20 transition-colors duration-300`}>
                        <Icon className={`text-${color}-400 w-5 h-5`} />
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <p className="text-4xl font-black text-white tracking-tight">{value}</p>
                    <div className={`flex items-center text-${color}-400 text-xs font-medium bg-${color}-500/10 px-2 py-1 rounded-full border border-${color}-500/20`}>
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>Active</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Overview</span>
                    </h1>
                    <p className="text-gray-400">Welcome back, Administrator. Here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Teams"
                    value={stats.teamCount}
                    icon={Users}
                    color="blue"
                    gradient="from-blue-500 to-cyan-500"
                />
                <StatCard
                    title="Total Players"
                    value={stats.playerCount}
                    icon={Users}
                    color="purple"
                    gradient="from-purple-500 to-pink-500"
                />
                <StatCard
                    title="Pending Revisions"
                    value={stats.pendingRevisions}
                    icon={MessageSquare}
                    color="yellow"
                    gradient="from-yellow-500 to-orange-500"
                />
                <StatCard
                    title="Upcoming Events"
                    value={stats.upcomingEvents.length}
                    icon={Trophy}
                    color="green"
                    gradient="from-green-500 to-emerald-500"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Events List */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Trophy className="w-5 h-5 mr-3 text-blue-400" />
                            Upcoming Events
                        </h2>
                        <Link to="/sys-admin-secret-login/events" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
                    </div>
                    <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {stats.upcomingEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <Calendar className="w-10 h-10 mb-3 opacity-20" />
                                <p>No upcoming events scheduled</p>
                            </div>
                        ) : (
                            stats.upcomingEvents.map(event => (
                                <div key={event._id} className="group flex items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Trophy className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{event.title}</h4>
                                        <div className="flex items-center mt-1 space-x-3 text-xs text-gray-400">
                                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(event.startTime).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                            <span className="capitalize text-blue-400">{event.type}</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Media List */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Image className="w-5 h-5 mr-3 text-purple-400" />
                            Recent Media
                        </h2>
                        <Link to="/sys-admin-secret-login/media" className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">View All</Link>
                    </div>
                    <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {stats.recentMedia.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                                <Image className="w-10 h-10 mb-3 opacity-20" />
                                <p>No media uploaded recently</p>
                            </div>
                        ) : (
                            stats.recentMedia.map(media => (
                                <div key={media._id} className="group flex items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Image className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate group-hover:text-purple-400 transition-colors">{media.title || 'Untitled Media'}</h4>
                                        <p className="text-xs text-gray-400 mt-1">Uploaded on {new Date(media.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
