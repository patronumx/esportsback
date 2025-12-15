import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Trophy, Crosshair, Users, Activity, Instagram, Twitter, Calendar, MapPin, Clock } from 'lucide-react';

const PlayerDashboard = () => {
    const { user, updateUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [recruitForm, setRecruitForm] = useState({
        role: user?.playerRole || user?.role || 'Assaulter',
        device: user?.device || '',
        phone: user?.phone || '',
        instagram: user?.socialLinks?.instagram || '',
        experience: user?.experience || '',
        age: user?.age || ''
    });
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setRecruitForm(prev => ({
                ...prev,
                role: user.playerRole || user.role || prev.role,
                device: user.device || prev.device,
                phone: user.phone || prev.phone,
                instagram: user.socialLinks?.instagram || prev.instagram,
                experience: user.experience || prev.experience,
                age: user.age || prev.age
            }));
        }
        if (user?.stats) {
            setStats({
                matchesPlayed: user.stats.matches || 0,
                kdRatio: user.stats.kd || 0.0,
                wins: user.stats.wins || 0,
                avgDamage: user.stats.damage || 0
            });
        }
    }, [user]);

    const handleUpdateRecruitment = async () => {
        if (!recruitForm.phone) {
            alert('Phone number is required for recruitment profile.');
            return;
        }
        setUpdating(true);
        try {
            const { data } = await api.put('/player/recruitment', recruitForm);
            // Sync updated player data to global user context, ensuring we don't overwrite the auth role
            updateUser({
                ...data,
                role: user.role, // Preserve 'player' role
                playerRole: data.role // Map 'Assaulter' etc to playerRole
            });
            setShowSuccess(true);
        } catch (error) {
            console.error('Failed to update recruitment profile', error);
            const msg = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to update profile: ${msg}`);
        } finally {
            setUpdating(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-white/10 transition-all hover:bg-white/[0.02] group">
            <div className={`p-4 rounded-full bg-${color}-500/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-8 h-8 text-${color}-400`} />
            </div>
            <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{title}</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 relative">
            {/* Success Notification Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-violet-500/50 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-violet-500/20 transform animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Activity className="w-8 h-8 text-violet-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Profile Updated!</h3>
                        <p className="text-gray-400 mb-6">
                            Your recruitment profile is now live. Teams can see your stats and device details.
                        </p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Awesome, let's go!
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{user?.ign || 'Player'}</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Your command center for competitive dominance.</p>
                    </div>
                    <div className="flex gap-3">
                        {user?.instagram && (
                            <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-violet-600 hover:text-white text-violet-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Recruitment Profile Form - Full Width */}
                <div className="mb-8">
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-violet-500/10 rounded-lg">
                                    <Users className="w-5 h-5 text-violet-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Recruitment Profile</h2>
                            </div>
                            <span className="text-xs text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                                Visible to Scouts
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                                <select
                                    value={recruitForm.role}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, role: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 outline-none transition-colors appearance-none"
                                >
                                    {['Assaulter', 'IGL', 'Support', 'Fragger'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Device</label>
                                <input
                                    type="text"
                                    value={recruitForm.device}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, device: e.target.value })}
                                    placeholder="e.g. iPhone 14 Pro Max"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                                <input
                                    type="text"
                                    value={recruitForm.phone}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, phone: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instagram Link</label>
                                <input
                                    type="text"
                                    value={recruitForm.instagram}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, instagram: e.target.value })}
                                    placeholder="https://instagram.com/username"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Years of Exp</label>
                                <select
                                    value={recruitForm.experience}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, experience: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 outline-none transition-colors appearance-none"
                                >
                                    <option value="">Select Experience</option>
                                    <option value="1 Year">1 Year</option>
                                    <option value="2 Years">2 Years</option>
                                    <option value="3 Years">3 Years</option>
                                    <option value="4 Years">4 Years</option>
                                    <option value="5+ Years">5+ Years</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Age</label>
                                <input
                                    type="number"
                                    value={recruitForm.age}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, age: e.target.value })}
                                    placeholder="18"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateRecruitment}
                            disabled={updating}
                            className="mt-4 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {updating ? 'Updating...' : <><Activity size={16} /> Update Recruitment Profile</>}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <StatCard title="Matches Played" value={stats?.matchesPlayed || 0} icon={Crosshair} color="violet" />
                    <StatCard title="K/D Ratio" value={stats?.kdRatio || '0.0'} icon={Activity} color="emerald" />
                    <StatCard title="Tournament Wins" value={stats?.wins || 0} icon={Trophy} color="yellow" />
                    <StatCard title="Avg Damage" value={stats?.avgDamage || 0} icon={Crosshair} color="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Matches */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Clock className="text-violet-500" /> Recent Matches
                            </h2>
                            <button className="text-sm text-violet-400 hover:text-violet-300 font-bold">View All</button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                                <Activity className="w-12 h-12 text-violet-500/20 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Match History Coming Soon</h3>
                                <p className="text-gray-500 max-w-sm">
                                    We're working on integrating real-time match tracking and detailed analytics. Stay tuned!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDashboard;
