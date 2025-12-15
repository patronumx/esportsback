import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Trophy, Image, BarChart2, MessageSquare, Bell, LogOut, Shield, PieChart, Menu, X } from 'lucide-react';
import ModernBackground from '../components/ModernBackground';


const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/sys-admin-secret-login/auth');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setIsSidebarOpen(false)}
            className={`
                group flex items-center p-2 md:p-3 lg:p-4 rounded-xl transition-all duration-300 relative overflow-hidden mb-0.5 md:mb-1 lg:mb-2
                ${isActive(to)
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                }
            `}
        >
            <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-xl
            `} />
            <Icon className={`
                mr-2 md:mr-3 lg:mr-4 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110
                ${isActive(to) ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}
            `} />
            <span className="relative z-10 font-medium tracking-wide text-xs md:text-sm lg:text-base">{label}</span>
            {isActive(to) && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 md:h-6 lg:h-8 bg-blue-500 rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
        </Link>
    );

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative selection:bg-blue-500/30">
            <ModernBackground />

            {/* Mobile Header */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">NEXUS ADMIN</div>
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
                fixed inset-y-0 left-0 z-50 w-60 md:w-64 lg:w-80 bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-2xl transition-transform duration-300 md:translate-x-0 md:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 lg:p-8 pb-3 lg:pb-6 relative">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative mt-8 md:mt-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20"></div>
                        <div className="relative text-lg md:text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-300% animate-gradient">
                            NEXUS ADMIN
                        </div>
                    </div>
                    <p className="text-[10px] lg:text-xs text-gray-500 mt-1 lg:mt-2 font-medium tracking-widest uppercase pl-1">Control Center</p>
                </div>

                <div className="flex-1 flex flex-col px-3 md:px-4 space-y-0.5 md:space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="text-[10px] lg:text-xs font-bold text-gray-600 uppercase tracking-wider px-2 md:px-3 mb-1 mt-1">Overview</div>
                    <NavItem to="/sys-admin-secret-login/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/sys-admin-secret-login/analytics" icon={PieChart} label="Analytics" />

                    <div className="text-[10px] lg:text-xs font-bold text-gray-600 uppercase tracking-wider px-2 md:px-3 mb-1 mt-2 md:mt-4">Management</div>
                    <NavItem to="/sys-admin-secret-login/teams" icon={Users} label="Teams" />
                    <NavItem to="/sys-admin-secret-login/requests" icon={MessageSquare} label="Service Requests" />
                    <NavItem to="/sys-admin-secret-login/events" icon={Trophy} label="Events" />
                    <NavItem to="/sys-admin-secret-login/media" icon={Image} label="Media" />

                    <div className="text-[10px] lg:text-xs font-bold text-gray-600 uppercase tracking-wider px-2 md:px-3 mb-1 mt-2 md:mt-4">System</div>
                    <NavItem to="/sys-admin-secret-login/performance" icon={BarChart2} label="Performance" />
                    <NavItem to="/sys-admin-secret-login/revision-requests" icon={MessageSquare} label="Revisions" />
                    <NavItem to="/sys-admin-secret-login/notifications" icon={Bell} label="Notifications" />
                    <NavItem to="/sys-admin-secret-login/moderators" icon={Shield} label="Moderators" />
                </div>

                <div className="p-3 md:p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
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
            <main className="flex-1 overflow-y-auto relative z-10 bg-gradient-to-br from-black/0 via-blue-900/5 to-purple-900/5 pt-16 md:pt-0">

                <div className="p-8 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
