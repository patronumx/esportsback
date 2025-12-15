import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Image, Activity, Users, MessageSquare, Bell, LogOut, BarChart, Download, Menu, X, Search, Briefcase, Link2, Map, MonitorPlay, Route, MapPin } from 'lucide-react';
import Hyperspeed from '../components/Hyperspeed';


const TeamLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/team/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setIsSidebarOpen(false)}
            className={`
                group flex items-center p-2 md:p-3 lg:p-4 rounded-xl transition-all duration-300 relative overflow-hidden mb-0.5 md:mb-1 lg:mb-2
                ${isActive(to)
                    ? 'bg-purple-500/10 text-white border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'text-gray-500 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                }
            `}
        >
            <Icon className={`
                mr-2 md:mr-3 lg:mr-4 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110
                ${isActive(to) ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'}
            `} />
            <span className="relative z-10 font-bold text-xs md:text-sm lg:text-base">{label}</span>
            {isActive(to) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 md:h-6 lg:h-8 bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            )}
        </Link>
    );

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-emerald-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Hyperspeed />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="font-black text-purple-500 tracking-tight">DASHBOARD</div>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-60 md:w-64 lg:w-80 bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 md:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-3 md:p-4 lg:p-6 pb-2 relative">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-2 md:mb-4 lg:mb-6 mt-8 md:mt-0">
                        {/* Team Card */}
                        <div className="bg-[#111] rounded-2xl p-3 md:p-4 lg:p-6 border border-white/5 flex flex-col items-center text-center group hover:border-white/10 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-yellow-400 flex items-center justify-center text-xl md:text-2xl font-black text-black mb-2 md:mb-3 overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                                {user?.teamLogo ? (
                                    <img src={user.teamLogo} alt={user.teamName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-yellow-400 text-black">
                                        {user?.teamName ? user.teamName.charAt(0) : 'T'}
                                    </div>
                                )}
                            </div>
                            <div className="font-bold text-white text-xs md:text-sm lg:text-lg tracking-wide">{user?.teamName || 'Team Name'}</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col px-3 md:px-4 lg:px-6 space-y-0.5 md:space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider px-2 md:px-3 mb-1 mt-1">Main</div>
                    <NavItem to="/team/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/team/events" icon={Calendar} label="Events" />
                    <NavItem to="/team/media" icon={Image} label="Media" />
                    <NavItem to="/team/socials" icon={Link2} label="Socials" />

                    <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider px-2 md:px-3 mb-1 mt-2 md:mt-4">Team</div>
                    <NavItem to="/team/roster" icon={Users} label="Roster" />
                    <NavItem to="/team/recruitments" icon={Briefcase} label="Recruitments" />
                    <NavItem to="/team/scout" icon={Search} label="Scout Players" />
                    <NavItem to="/team/support" icon={Users} label="Analyst & Coach" />
                    <NavItem to="/team/notifications" icon={Bell} label="Notifications" />

                    <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider px-2 md:px-3 mb-1 mt-2 md:mt-4">Strategy Hub</div>
                    <NavItem to="/team/strategy/maps" icon={Map} label="Maps" />
                    <NavItem to="/team/strategy/video-analysis" icon={MonitorPlay} label="Video Analysis" />
                    <NavItem to="/team/strategy/rotations" icon={Route} label="Rotations" />
                    <NavItem to="/team/strategy/drops" icon={MapPin} label="Team Drops" />

                    <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider px-2 md:px-3 mb-1 mt-2 md:mt-4">Analytics</div>
                    <NavItem to="/team/performance" icon={Activity} label="Performance" />
                    <NavItem to="/team/social" icon={BarChart} label="Social Stats" />
                </div>

                <div className="p-3 md:p-4 border-t border-white/5 bg-[#050505] mt-auto">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center w-full p-2 md:p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium text-xs md:text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 bg-gradient-to-br from-black/0 via-emerald-900/5 to-cyan-900/5 pt-16 md:pt-0">
                <div className="p-8 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TeamLayout;
