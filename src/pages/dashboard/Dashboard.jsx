import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardDataForTeam, adminDashboardStats } from '../../data/dashboardData';
import { pmgcTeams } from '../../data/pmgcTeams';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    FileText,
    TrendingUp,
    Users,
    BarChart2,
    Download,
    LogOut,
    Video,
    Image as ImageIcon,
    Mic,
    Award,
    FileImage,
    Filter,
    RefreshCw,
    ChevronDown,
    Menu,
    X,
    Settings,
    Bell,
    Calendar,
    FolderOpen,
    Eye,
    ExternalLink,
    Upload,
    Share2
} from 'lucide-react';
import thumbvideo from '../../assets/thumbvideo.mp4';
import Media1 from '../../assets/Media1.MP4';
import Media2 from '../../assets/Media2.MP4';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('patronum_user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            if (userData.role === 'admin') {
                setStats(adminDashboardStats);
            } else {
                setStats(getDashboardDataForTeam(userData.teamId));
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('patronum_user');
        navigate('/login');
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            if (user.role === 'admin') {
                setStats(adminDashboardStats);
            } else {
                setStats(getDashboardDataForTeam(user.teamId));
            }
            setIsRefreshing(false);
        }, 1000);
    };

    if (!user || !stats) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const filteredContentLog = selectedFilter === 'all'
        ? stats.contentLog
        : stats.contentLog.filter(item => item.status === selectedFilter);

    // Mock gallery data
    const galleryImages = [
        { id: 1, title: 'Match Day 1 Highlights', url: 'https://placehold.co/400x300/6366f1/ffffff?text=Match+Day+1', type: 'photo' },
        { id: 2, title: 'Team Victory Celebration', url: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Victory', type: 'photo' },
        { id: 3, title: 'Sponsor Activation', url: 'https://placehold.co/400x300/a855f7/ffffff?text=Sponsor', type: 'photo' },
        { id: 4, title: 'Player Interview Setup', url: 'https://placehold.co/400x300/c084fc/ffffff?text=Interview', type: 'photo' },
        { id: 5, title: 'Tournament Recap Video', url: 'https://placehold.co/400x300/d8b4fe/ffffff?text=Video', type: 'video' },
        { id: 6, title: 'Behind the Scenes', url: 'https://placehold.co/400x300/e9d5ff/ffffff?text=BTS', type: 'photo' },
        { id: 7, title: 'Thumb Video', url: thumbvideo, type: 'video' },
        { id: 8, title: 'Media 1', url: Media1, type: 'video' },
        { id: 9, title: 'Media 2', url: Media2, type: 'video' },
    ];

    const getTeamLogo = (teamId) => {
        if (!teamId || teamId === 'admin') return null;

        const allTeams = [
            ...(pmgcTeams.gauntlet || []),
            ...(pmgcTeams.groupStage?.green || []),
            ...(pmgcTeams.groupStage?.red || []),
            ...(pmgcTeams.grandFinals || [])
        ];

        const team = allTeams.find(t => t.id === teamId);
        return team ? team.logo : null;
    };

    const teamLogo = user ? getTeamLogo(user.teamId) : null;

    return (
        <div className="min-h-screen bg-black text-slate-50 relative">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed left-0 top-0 h-full w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 z-50"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-600">
                                    Dashboard
                                </h2>
                                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User Info */}
                            {/* User Info */}
                            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="w-16 h-16 mx-auto rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-3 overflow-hidden p-2">
                                    {teamLogo ? (
                                        <img src={teamLogo} alt={user.teamName} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-violet-600">
                                            {user.teamName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <p className="font-semibold text-white text-center truncate">{user.teamName}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                <NavItem icon={<Home size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                                <NavItem icon={<FileText size={18} />} label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                                <NavItem icon={<FolderOpen size={18} />} label="Media Library" active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
                                <NavItem icon={<BarChart2 size={18} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                                <NavItem icon={<Users size={18} />} label="Team" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
                                <NavItem icon={<Calendar size={18} />} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                                <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                            </nav>

                            {/* Quick Actions */}
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Quick Actions</p>
                                <div className="space-y-2">
                                    <button className="w-full px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-sm rounded-lg transition-colors flex items-center gap-2">
                                        <Download size={16} />
                                        Export Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                {/* Top Bar */}
                <div className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-600">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </h1>
                                <p className="text-sm text-slate-400">One Link. Total Clarity.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                                <Bell size={20} className="text-slate-400" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button
                                onClick={handleRefresh}
                                className={`p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <LogOut size={18} />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {/* Dashboard Home */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
                                onClick={() => setExpandedSection(expandedSection === 'home' ? null : 'home')}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300 transition-colors">
                                            <Home size={24} />
                                        </div>
                                        <h2 className="text-xl font-semibold">Dashboard Home</h2>
                                    </div>
                                    <ChevronDown className={`transition-transform ${expandedSection === 'home' ? 'rotate-180' : ''}`} size={20} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatItem icon={<Video size={16} />} label="Reels" value={stats.home.reels} color="purple" />
                                    <StatItem icon={<ImageIcon size={16} />} label="Photos" value={stats.home.photos} color="violet" />
                                    <StatItem icon={<Mic size={16} />} label="Interviews" value={stats.home.interviews} color="fuchsia" />
                                    <StatItem icon={<Award size={16} />} label="Sponsor Clips" value={stats.home.sponsorClips} color="purple" />
                                </div>
                                <AnimatePresence>
                                    {expandedSection === 'home' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-4 pt-4 border-t border-white/10"
                                        >
                                            <p className="text-sm text-slate-400 mb-2">Total Content: {stats.home.reels + stats.home.photos + stats.home.interviews + stats.home.sponsorClips}</p>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-purple-500 to-violet-600" style={{ width: `${Math.min((stats.home.reels / 200) * 100, 100)}%` }} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-white/5">
                                    Totals for reels, photos, interviews, and sponsor clips.
                                </p>
                            </motion.div>

                            {/* Content Log */}
                            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-colors group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400 group-hover:text-violet-300 transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <h2 className="text-xl font-semibold">Content Log</h2>
                                    </div>
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                                    >
                                        <option value="all">All</option>
                                        <option value="raw">Raw</option>
                                        <option value="in-edit">In Edit</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="posted">Posted</option>
                                    </select>
                                </div>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                                    <AnimatePresence>
                                        {filteredContentLog.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex justify-between items-start gap-2 text-sm hover:bg-white/5 p-2 rounded-lg transition-colors group/item"
                                            >
                                                <span className="truncate text-slate-300 flex-1">{item.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <button className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                        <Eye size={14} className="text-slate-400 hover:text-purple-400" />
                                                    </button>
                                                    <StatusBadge status={item.status} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className="w-full mt-4 pt-4 border-t border-white/5 text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    View All Content <ExternalLink size={12} />
                                </button>
                            </motion.div>

                            {/* Other cards... */}
                            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-pink-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400 group-hover:text-pink-300 transition-colors">
                                        <TrendingUp size={24} />
                                    </div>
                                    <h2 className="text-xl font-semibold">Sponsor Exposure</h2>
                                </div>
                                <div className="space-y-4">
                                    {stats.sponsorExposure.map((sponsor, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div>
                                                <p className="font-medium text-slate-200">{sponsor.brand}</p>
                                                <p className="text-xs text-slate-500">{sponsor.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">{sponsor.appearances}</p>
                                                <p className="text-[10px] text-slate-500 uppercase">Appearances</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Social Insights */}
                            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-green-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:text-green-300 transition-colors">
                                        <BarChart2 size={24} />
                                    </div>
                                    <h2 className="text-xl font-semibold">Social Insights</h2>
                                </div>
                                <div className="space-y-4">
                                    <motion.div
                                        className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 p-4 rounded-xl"
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <p className="text-slate-400 text-sm mb-1">Total Engagement</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">{stats.socialInsights.totalEngagement}</span>
                                            <span className="text-green-400 text-sm font-medium">{stats.socialInsights.growth}</span>
                                        </div>
                                    </motion.div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Best Performing</p>
                                        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 p-3 rounded-lg">
                                            <p className="text-green-100 font-medium text-sm">{stats.socialInsights.bestPerformingClip}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Player Visibility */}
                            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 group-hover:text-orange-300 transition-colors">
                                        <Users size={24} />
                                    </div>
                                    <h2 className="text-xl font-semibold">Player Visibility</h2>
                                </div>
                                <div className="space-y-3">
                                    {stats.playerVisibility && stats.playerVisibility.length > 0 ? (
                                        stats.playerVisibility.map((player, idx) => (
                                            <motion.div
                                                key={idx}
                                                className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                whileHover={{ x: 4 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden border border-white/10">
                                                        {player.profileImage ? (
                                                            <img src={player.profileImage} alt={player.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-bold">{player.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-200">{player.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] text-slate-500">Match: {player.match}</p>
                                                            <div className={`w-2 h-2 rounded-full ${player.match === 'High' ? 'bg-green-500' :
                                                                player.match === 'Medium' ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                                }`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-mono text-orange-300">{player.views}</span>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm text-center py-4">No player data</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Sponsor ROI */}
                            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-colors group">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-red-500/10 rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                                        <FileImage size={24} />
                                    </div>
                                    <h2 className="text-xl font-semibold">Sponsor ROI PDF</h2>
                                </div>
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <motion.div
                                        className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Download size={32} className="text-red-400" />
                                    </motion.div>
                                    <p className="text-slate-300 font-medium mb-1">End-of-Event Recap</p>
                                    {stats.sponsorROI && (
                                        <div className="text-xs text-slate-400 mb-4 space-y-1">
                                            <p>Impressions: <span className="text-white font-semibold">{stats.sponsorROI.impressions}</span></p>
                                            <p>Engagement: <span className="text-white font-semibold">{stats.sponsorROI.engagementRate}</span></p>
                                        </div>
                                    )}
                                    <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg transition-all border border-red-500/20 hover:scale-105 transform">
                                        Download Report
                                    </button>
                                </div>
                            </motion.div>

                            {/* Recent Tournaments & Performance */}
                            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Performance Chart */}
                                <motion.div variants={itemVariants} className="lg:col-span-3 bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                                                <BarChart2 size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold">Performance Overview</h2>
                                                <p className="text-sm text-slate-400">Points history across recent major events</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Bar Chart */}
                                    <div className="h-64 w-full flex items-end justify-between gap-4 px-4 pb-4 relative">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                            <div className="w-full h-px bg-slate-500" />
                                            <div className="w-full h-px bg-slate-500" />
                                            <div className="w-full h-px bg-slate-500" />
                                            <div className="w-full h-px bg-slate-500" />
                                        </div>

                                        {stats.recentTournaments && stats.recentTournaments.map((tournament, idx) => {
                                            const maxPoints = Math.max(...stats.recentTournaments.map(t => t.points));
                                            const heightPercentage = (tournament.points / maxPoints) * 100;

                                            return (
                                                <div key={tournament.id} className="flex flex-col items-center gap-2 w-full group/bar relative z-10">
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap border border-white/10 z-20">
                                                        {tournament.points} pts • {tournament.placement}
                                                    </div>

                                                    {/* Bar */}
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${heightPercentage}%` }}
                                                        transition={{ duration: 1, delay: idx * 0.2, ease: "easeOut" }}
                                                        className={`w-full max-w-[60px] rounded-t-lg relative overflow-hidden ${tournament.placement === '1st' ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                                                            tournament.placement === '2nd' ? 'bg-gradient-to-t from-slate-600 to-slate-400' :
                                                                tournament.placement === '3rd' ? 'bg-gradient-to-t from-amber-800 to-amber-600' :
                                                                    'bg-gradient-to-t from-blue-900 to-blue-500'
                                                            }`}
                                                    >
                                                        <div className="absolute inset-0 bg-white/0 group-hover/bar:bg-white/20 transition-colors" />
                                                    </motion.div>

                                                    {/* Label */}
                                                    <span className="text-xs text-slate-400 font-medium text-center truncate w-full max-w-[80px]">
                                                        {tournament.name.split(' ').slice(0, 2).join(' ')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Coming Soon Overlay */}
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                                                Coming Soon
                                            </div>
                                            <p className="text-slate-300 text-sm">Performance analytics will be available after tournament participation</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Recent Tournaments List */}
                                <motion.div variants={itemVariants} className="lg:col-span-3 bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300 transition-colors">
                                            <Award size={24} />
                                        </div>
                                        <h2 className="text-xl font-semibold">Tournament Results</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-400">
                                            <thead className="text-xs uppercase bg-white/5 text-slate-300">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Tournament</th>
                                                    <th className="px-4 py-3">Placement</th>
                                                    <th className="px-4 py-3">Prize</th>
                                                    <th className="px-4 py-3">Points</th>
                                                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentTournaments && stats.recentTournaments.map((tournament) => (
                                                    <tr key={tournament.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs">🏆</div>
                                                            {tournament.name}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${tournament.placement === '1st' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                                tournament.placement === '2nd' ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
                                                                    tournament.placement === '3rd' ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
                                                                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                                                }`}>
                                                                {tournament.placement}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-green-400 font-mono font-bold">{tournament.prize}</td>
                                                        <td className="px-4 py-3 font-bold text-white">{tournament.points}</td>
                                                        <td className="px-4 py-3">{tournament.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Coming Soon Overlay */}
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
                                                Coming Soon
                                            </div>
                                            <p className="text-slate-300 text-sm">Tournament results will populate after competition participation</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Tournament Standings */}
                            <motion.div variants={itemVariants} className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 hover:border-yellow-500/50 transition-colors group relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400 group-hover:text-yellow-300 transition-colors">
                                        <Award size={24} />
                                    </div>
                                    <h2 className="text-xl font-semibold">Standings</h2>
                                </div>
                                <div className="space-y-3">
                                    {stats.tournamentStandings && stats.tournamentStandings.map((team) => (
                                        <div key={team.rank} className={`flex items-center justify-between p-3 rounded-lg ${team.team === user.teamName ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-white/5 hover:bg-white/10'} transition-colors`}>
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${team.rank === 1 ? 'bg-yellow-500 text-black' : team.rank === 2 ? 'bg-slate-300 text-black' : team.rank === 3 ? 'bg-amber-700 text-white' : 'bg-white/10 text-slate-400'}`}>
                                                    {team.rank}
                                                </span>
                                                <span className={`text-sm font-medium ${team.team === user.teamName ? 'text-purple-300' : 'text-slate-200'}`}>{team.team}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-white">{team.points}</span>
                                                <span className="text-[10px] text-slate-500 block">pts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Coming Soon Overlay */}
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                                            Coming Soon
                                        </div>
                                        <p className="text-slate-300 text-sm">League standings will update once tournament season begins</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Media Library Tab */}
                    {activeTab === 'media' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Media Library</h2>
                                    <p className="text-slate-400">View and download all your media assets</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                                    >
                                        {viewMode === 'grid' ? 'List View' : 'Grid View'}
                                    </button>
                                    <button className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm transition-colors flex items-center gap-2">
                                        <Upload size={16} />
                                        Upload New
                                    </button>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                {galleryImages.map((image) => (
                                    <motion.div
                                        key={image.id}
                                        className="bg-zinc-900/40 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-violet-600/20">
                                            <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => setSelectedImage(image)}
                                                    className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button className="p-3 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors">
                                                    <Download size={20} />
                                                </button>
                                                <button className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-colors">
                                                    <Share2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-white mb-1">{image.title}</h3>
                                            <p className="text-xs text-slate-400">Type: {image.type}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Other tabs content placeholders */}
                    {activeTab === 'content' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Content Management</h2>
                                    <p className="text-slate-400">Manage and track your content pipeline</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <select
                                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                                            value={selectedFilter}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="raw">Raw</option>
                                            <option value="in-edit">In Edit</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="posted">Posted</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setIsRequestModalOpen(true)}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={16} />
                                        Request Content
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {stats.contentLog.map((item) => {
                                    const isVideo = item.title.includes('Video') || item.title.includes('Reel') || item.title.includes('Media');
                                    const url = item.id === 6 ? thumbvideo : item.id === 7 ? Media1 : item.id === 8 ? Media2 : null;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            className="bg-zinc-900/40 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
                                            whileHover={{ y: -4 }}
                                        >
                                            <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center overflow-hidden">
                                                {url && isVideo ? (
                                                    <video
                                                        src={url}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        muted
                                                        loop
                                                        onMouseOver={e => e.target.play()}
                                                        onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                                                    />
                                                ) : (
                                                    <div className="text-4xl">{isVideo ? '🎥' : '📸'}</div>
                                                )}

                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                                                    <button
                                                        onClick={() => {
                                                            if (url) {
                                                                setSelectedImage({ ...item, url, type: 'video' });
                                                            }
                                                        }}
                                                        className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                    <a
                                                        href={url || '#'}
                                                        download
                                                        className="p-3 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors"
                                                    >
                                                        <Download size={20} />
                                                    </a>
                                                    <button className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-colors">
                                                        <Share2 size={20} />
                                                    </button>
                                                </div>

                                                <div className="absolute top-2 right-2 z-20">
                                                    <StatusBadge status={item.status} />
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="font-semibold text-white mb-1 truncate">{item.title}</h3>
                                                <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span>{isVideo ? 'Video' : 'Photo'}</span>
                                                    <span>{item.date}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Analytics Header */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatItem icon={<Eye size={16} />} label="Total Views" value="2.4M" color="purple" />
                                <StatItem icon={<Users size={16} />} label="New Followers" value="+12.5K" color="violet" />
                                <StatItem icon={<TrendingUp size={16} />} label="Engagement Rate" value="8.2%" color="fuchsia" />
                                <StatItem icon={<Share2 size={16} />} label="Total Shares" value="45.2K" color="purple" />
                            </div>

                            {/* Main Chart Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-zinc-900/40 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-semibold mb-6">Audience Growth</h3>
                                    <div className="h-64 flex items-end justify-between gap-2">
                                        {[65, 59, 80, 81, 56, 55, 40, 70, 60, 75, 85, 90].map((height, i) => (
                                            <div key={i} className="w-full bg-purple-500/20 rounded-t-lg relative group hover:bg-purple-500/40 transition-colors">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-600 to-violet-400 rounded-t-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 text-xs text-slate-400">
                                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                                    </div>
                                </div>

                                <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-semibold mb-6">Demographics</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">18-24 Years</span>
                                                <span className="text-white font-bold">45%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-[45%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">25-34 Years</span>
                                                <span className="text-white font-bold">30%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-500 w-[30%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">13-17 Years</span>
                                                <span className="text-white font-bold">15%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-fuchsia-500 w-[15%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">35+ Years</span>
                                                <span className="text-white font-bold">10%</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-pink-500 w-[10%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Content */}
                            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-semibold mb-6">Top Performing Content</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="text-xs uppercase bg-white/5 text-slate-300">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Content Title</th>
                                                <th className="px-4 py-3">Type</th>
                                                <th className="px-4 py-3">Views</th>
                                                <th className="px-4 py-3">Engagement</th>
                                                <th className="px-4 py-3 rounded-r-lg">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { title: "Grand Finals Highlights", type: "Video", views: "1.2M", engagement: "12%", date: "Dec 10" },
                                                { title: "Champion Interview", type: "Video", views: "850K", engagement: "15%", date: "Dec 09" },
                                                { title: "Team Announcement", type: "Post", views: "500K", engagement: "8%", date: "Dec 05" },
                                                { title: "Sponsor Showcase", type: "Reel", views: "320K", engagement: "10%", date: "Dec 02" },
                                            ].map((item, idx) => (
                                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-white">{item.title}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-white">{item.views}</td>
                                                    <td className="px-4 py-3 text-green-400">{item.engagement}</td>
                                                    <td className="px-4 py-3">{item.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'team' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {stats.teamRoster && stats.teamRoster.map((player, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative h-48 bg-gradient-to-br from-purple-900/20 to-black flex items-end justify-center">
                                        <img src={player.image} alt={player.name} className="h-full w-auto object-contain object-bottom" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-2xl font-bold text-white">{player.name}</h3>
                                            <p className="text-purple-400 text-sm">Pro Athlete</p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-3 rounded-lg text-center">
                                                <p className="text-xs text-slate-500 uppercase">Matches</p>
                                                <p className="text-lg font-bold text-white">{randomInt(10, 50)}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg text-center">
                                                <p className="text-xs text-slate-500 uppercase">K/D Ratio</p>
                                                <p className="text-lg font-bold text-green-400">{(randomInt(150, 400) / 100).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors">
                                            View Full Profile
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'schedule' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Calendar className="text-purple-400" /> Upcoming Matches
                                </h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className="text-center min-w-[60px]">
                                                    <p className="text-sm text-purple-400 font-bold">NOV</p>
                                                    <p className="text-2xl font-bold text-white">{24 + item}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">PMGC Group Stage - Day {item}</h3>
                                                    <p className="text-slate-400 text-sm">18:00 GMT • Erangel, Miramar, Sanhok</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                                                Set Reminder
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-green-400" /> Tournament History
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="text-xs uppercase bg-white/5 text-slate-300">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Tournament</th>
                                                <th className="px-4 py-3">Placement</th>
                                                <th className="px-4 py-3">Prize</th>
                                                <th className="px-4 py-3">Points</th>
                                                <th className="px-4 py-3 rounded-r-lg">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentTournaments && stats.recentTournaments.map((tournament) => (
                                                <tr key={tournament.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-white">{tournament.name}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${tournament.placement === '1st' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            tournament.placement === '2nd' ? 'bg-slate-400/20 text-slate-300' :
                                                                tournament.placement === '3rd' ? 'bg-amber-700/20 text-amber-600' :
                                                                    'bg-slate-500/20 text-slate-400'
                                                            }`}>
                                                            {tournament.placement}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-green-400 font-mono">{tournament.prize}</td>
                                                    <td className="px-4 py-3 font-bold text-white">{tournament.points}</td>
                                                    <td className="px-4 py-3">{tournament.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-8 text-center">
                            <Settings size={48} className="mx-auto mb-4 text-purple-400" />
                            <h3 className="text-xl font-semibold mb-2">Settings</h3>
                            <p className="text-slate-400">Dashboard settings and preferences coming soon...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-4xl w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="font-semibold text-white">{selectedImage.title}</h3>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            {selectedImage.type === 'video' ? (
                                <video src={selectedImage.url} controls className="w-full max-h-[70vh]" autoPlay />
                            ) : (
                                <img src={selectedImage.url} alt={selectedImage.title} className="w-full max-h-[70vh] object-contain" />
                            )}
                            <div className="p-4 flex items-center justify-between">
                                <p className="text-sm text-slate-400">Type: {selectedImage.type}</p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors flex items-center gap-2">
                                        <Download size={16} />
                                        Download
                                    </button>
                                    <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm transition-colors flex items-center gap-2">
                                        <Share2 size={16} />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Request Content Modal */}
            <AnimatePresence>
                {isRequestModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        onClick={() => setIsRequestModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="max-w-lg w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h3 className="text-xl font-bold text-white">Request New Content</h3>
                                <button
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Request Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Grand Finals Highlights Reel"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Content Type</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer">
                                            <option>Video Reel</option>
                                            <option>Photo Set</option>
                                            <option>Graphic Design</option>
                                            <option>Article/Blog</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description & Requirements</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Describe what you need..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Reference Link (Optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setIsRequestModalOpen(false)}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20">
                                        Submit Request
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const StatItem = ({ icon, label, value, color = 'purple' }) => {
    const colorClasses = {
        purple: 'from-purple-500 to-purple-600',
        violet: 'from-violet-500 to-violet-600',
        fuchsia: 'from-fuchsia-500 to-fuchsia-600'
    };

    return (
        <motion.div
            className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            whileHover={{ y: -2 }}
        >
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorClasses[color]}`}>{value}</p>
        </motion.div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        raw: 'bg-slate-500/20 text-slate-400 border-slate-500/20',
        'in-edit': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        delivered: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        posted: 'bg-green-500/20 text-green-400 border-green-500/20',
    };

    return (
        <span className={`text-[10px] px-2 py-1 rounded-full border ${styles[status] || styles.raw} uppercase font-medium tracking-wider whitespace-nowrap`}>
            {status}
        </span>
    );
};

export default Dashboard;

