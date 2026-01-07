import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Activity, Instagram, ArrowRight, Save } from 'lucide-react';
import { showToast } from '../../utils/toast';

const PlayerDashboard = () => {
    const { user, updateUser } = useAuth();
    const [recruitForm, setRecruitForm] = useState({
        role: user?.playerRole || user?.role || 'Assaulter',
        device: user?.device || '',
        phone: user?.phone || '',
        instagram: user?.socialLinks?.instagram || '',
        experience: user?.experience || '',
        age: user?.age || '',
        lookingForTeam: user?.lookingForTeam ?? true,
        avatarUrl: user?.avatarUrl || ''
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
                age: user.age || prev.age,
                lookingForTeam: user.lookingForTeam ?? prev.lookingForTeam,
                avatarUrl: user.avatarUrl || prev.avatarUrl
            }));
        }
    }, [user]);

    const handleUpdateRecruitment = async () => {
        if (!recruitForm.phone) {
            showToast.error('Phone number is required for recruitment profile.');
            return;
        }
        setUpdating(true);
        try {
            // Force lookingForTeam to true whenever profile is updated
            const payload = { ...recruitForm, lookingForTeam: true };
            const { data } = await api.put('/player/recruitment', payload);
            updateUser({
                ...data,
                role: user.role,
                playerRole: data.role
            });
            setShowSuccess(true);
        } catch (error) {
            console.error('Failed to update recruitment profile', error);
            const msg = error.response?.data?.message || error.message || 'Unknown error';
            showToast.error(`Failed to update profile: ${msg}`);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 relative pb-20">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#111] border border-violet-500/30 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl shadow-violet-500/20 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-violet-500/30">
                            <Activity className="w-8 h-8 text-violet-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Updated!</h3>
                        <p className="text-gray-400 mb-6 text-sm">Your profile is live.</p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 p-8 md:p-12 mb-8 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />

                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                            READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">DOMINATE?</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium">
                            Welcome back, <span className="text-white">{user?.ign}</span>. Keep your stats updated to get scouted by top tier teams.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recruitment Form (2/3) - Compact Height */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/10">
                                    <Users className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Recruitment Profile</h2>
                                    <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Manage your professional details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-violet-300/70 uppercase tracking-widest mb-1.5 px-1">Role</label>
                                    <select
                                        value={recruitForm.role}
                                        onChange={(e) => setRecruitForm({ ...recruitForm, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:bg-white/10 outline-none transition-all appearance-none font-medium hover:border-white/10"
                                    >
                                        {['Assaulter', 'IGL', 'Support', 'Fragger'].map(r => <option key={r} value={r} className="bg-[#111]">{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-violet-300/70 uppercase tracking-widest mb-1.5 px-1">Device</label>
                                    <input
                                        type="text"
                                        value={recruitForm.device}
                                        onChange={(e) => setRecruitForm({ ...recruitForm, device: e.target.value })}
                                        placeholder="Device Name"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:bg-white/10 outline-none transition-all font-medium hover:border-white/10 placeholder:text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-violet-300/70 uppercase tracking-widest mb-1.5 px-1">Experience</label>
                                    <select
                                        value={recruitForm.experience}
                                        onChange={(e) => setRecruitForm({ ...recruitForm, experience: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:bg-white/10 outline-none transition-all appearance-none font-medium hover:border-white/10"
                                    >
                                        <option value="" className="bg-[#111]">Select Experience</option>
                                        {[1, 2, 3, 4, 5].map(y => <option key={y} value={`${y} ${y === 1 ? 'Year' : 'Years'}${y === 5 ? '+' : ''}`} className="bg-[#111]">{y} {y === 1 ? 'Year' : 'Years'}{y === 5 ? '+' : ''}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-violet-300/70 uppercase tracking-widest mb-1.5 px-1">Age</label>
                                    <input
                                        type="number"
                                        value={recruitForm.age}
                                        onChange={(e) => setRecruitForm({ ...recruitForm, age: e.target.value })}
                                        placeholder="18"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:bg-white/10 outline-none transition-all font-medium hover:border-white/10 placeholder:text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-violet-300/70 uppercase tracking-widest mb-1.5 px-1">Phone</label>
                                    <input
                                        type="text"
                                        value={recruitForm.phone}
                                        onChange={(e) => setRecruitForm({ ...recruitForm, phone: e.target.value })}
                                        placeholder="Contact Number"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:bg-white/10 outline-none transition-all font-medium hover:border-white/10 placeholder:text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-violet-300/70 uppercase tracking-widest mb-1.5 px-1">Instagram</label>
                                    <input
                                        type="text"
                                        value={recruitForm.instagram}
                                        onChange={(e) => setRecruitForm({ ...recruitForm, instagram: e.target.value })}
                                        placeholder="IG Profile Link"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500/50 focus:bg-white/10 outline-none transition-all font-medium hover:border-white/10 placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpdateRecruitment}
                                disabled={updating}
                                className="mt-6 w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-violet-900/20 hover:shadow-violet-900/40 text-sm flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                            >
                                <Save className="w-4 h-4" />
                                {updating ? 'Saving...' : 'Save Profile Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-6">
                        {/* Find Team Card - Compact */}
                        <div className="bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 rounded-[1.5rem] p-6 text-center relative overflow-hidden group">
                            {/* Card content kept same */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />

                            {user?.team ? (
                                <div className="relative z-10 flex flex-col justify-center">
                                    <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 ring-4 ring-black shadow-2xl" />
                                    <div className="font-black text-2xl text-white mb-2 uppercase tracking-tighter">{user.team.name || 'Team Name'}</div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-bold text-violet-300 uppercase tracking-widest mx-auto">
                                        Member
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <div className="relative mb-6 group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-violet-600 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="w-20 h-20 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl mx-auto ring-1 ring-white/5">
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <Link
                                        to="/player/browse-teams"
                                        className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-xl transition-all duration-300 shadow-xl shadow-violet-900/20 hover:shadow-violet-900/40 flex items-center justify-center gap-2 group/btn transform hover:-translate-y-1 text-sm"
                                    >
                                        FIND A TEAM
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDashboard;
