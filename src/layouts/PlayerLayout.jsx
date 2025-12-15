import { useState, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X, Crosshair, User, Upload, Camera, Search } from 'lucide-react';
import Hyperspeed from '../components/Hyperspeed';

const PlayerLayout = () => {
    const { logout, user, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/talent/player/login');
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // 1. Upload Image
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const avatarUrl = uploadRes.data.url;

            // 2. Update Player Profile
            await api.put('/player/recruitment', { avatarUrl });

            // 3. Update Local Context
            updateUser({ avatarUrl });

        } catch (error) {
            console.error('Avatar upload failed', error);
            alert('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const isActive = (path) => location.pathname.startsWith(path);

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            onClick={() => setIsSidebarOpen(false)}
            className={`
                group flex items-center p-2 md:p-3 lg:p-4 rounded-xl transition-all duration-300 relative overflow-hidden mb-0.5 md:mb-1 lg:mb-2
                ${isActive(to)
                    ? 'bg-violet-500/10 text-white border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'text-gray-500 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                }
            `}
        >
            <Icon className={`
                mr-2 md:mr-3 lg:mr-4 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110
                ${isActive(to) ? 'text-violet-400' : 'text-gray-500 group-hover:text-violet-400'}
            `} />
            <span className="relative z-10 font-bold text-xs md:text-sm lg:text-base">{label}</span>
            {isActive(to) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 md:h-6 lg:h-8 bg-violet-500 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
            )}
        </Link>
    );

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-fuchsia-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Hyperspeed />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="font-black text-fuchsia-500 tracking-tight">PLAYER HUB</div>
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
                        {/* Player Card */}
                        <div className="bg-[#121212] rounded-2xl p-4 md:p-5 lg:p-6 border border-white/10 flex flex-col items-center text-center group hover:border-violet-500/30 transition-all duration-300 shadow-xl shadow-black/20">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div
                                className={`w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full p-1 bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20 relative group/avatar ${uploading ? 'opacity-75' : ''}`}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black relative">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.ign} className="w-full h-full object-cover object-top" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                                            <User className="w-10 h-10" />
                                        </div>
                                    )}
                                </div>

                                {/* Always Visible Camera Button */}
                                <button
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-0 right-0 translate-x-1 translate-y-1 p-2 bg-white text-violet-600 hover:bg-violet-50 hover:text-violet-700 rounded-full shadow-lg border-2 border-violet-100 transition-all z-50 flex items-center justify-center group/btn"
                                >
                                    <Camera className="w-4 h-4" />
                                    <div className="absolute opacity-0 group-hover/btn:opacity-100 left-full ml-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity z-50">
                                        Change Photo
                                    </div>
                                </button>
                            </div>
                            <div className="font-black text-white text-lg md:text-xl lg:text-2xl tracking-wide leading-tight">{user?.ign || 'Unknown Player'}</div>
                            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mt-2">
                                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">{user?.playerRole || user?.role || 'Free Agent'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col px-3 md:px-4 lg:px-6 space-y-0.5 md:space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider px-2 md:px-3 mb-1 mt-1">Main</div>
                    <NavItem to="/player/dashboard" icon={LayoutDashboard} label="Overview" />
                    <NavItem to="/player/matches" icon={Crosshair} label="My Matches" />
                    <NavItem to="/player/requests" icon={Calendar} label="My Requests" />
                    <NavItem to="/player/browse-teams" icon={Search} label="Browse Teams" />
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
            <main className="flex-1 overflow-y-auto relative z-10 bg-gradient-to-br from-black/0 via-violet-900/5 to-blue-900/5 pt-16 md:pt-0">
                <div className="p-8 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PlayerLayout;
