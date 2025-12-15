import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Search, Filter, User, Briefcase, Clock, Calendar, Smartphone, Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLES = ['Role', 'IGL', 'Assaulter', 'Support', 'Fragger'];
const EXPERIENCES = ['Experience', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];

const ScoutPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: 'Role',
        experience: 'Experience',
        search: '',
        age: '', // exact age for now
        device: ''
    });

    const [showRecruitModal, setShowRecruitModal] = useState(false);
    const [recruitForm, setRecruitForm] = useState({
        role: 'Assaulter',
        experience: '1 Year',
        age: '',
        minDevice: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [matches, setMatches] = useState([]);

    const handleRecruitSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data } = await api.post('/team/recruitment', recruitForm);
            setMatches(data.matches || []);
            setShowRecruitModal(false);
        } catch (error) {
            console.error('Error posting recruitment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, [filters]); // Debouncing would be better in prod, but fine for now

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (filters.role !== 'Role') params.append('role', filters.role);
            if (filters.experience !== 'Experience') params.append('experience', filters.experience);
            if (filters.age) params.append('age', filters.age);
            if (filters.search) params.append('search', filters.search);
            if (filters.device) params.append('device', filters.device);

            const { data } = await api.get(`/team/scout?${params.toString()}`);
            setPlayers(data);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">

            {/* Header & Nav */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Scout Players</h1>
                    <p className="text-slate-400 text-sm">Find the perfect free agent for your roster</p>
                </div>
                <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/10">
                    <Link to="/team/dashboard" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md">Dashboard</Link>
                    <Link to="/team/roster" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md">My Roster</Link>
                    <div className="px-4 py-2 text-sm text-black bg-white font-bold rounded-md shadow-lg cursor-default">Scout</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowRecruitModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                    <Briefcase className="w-5 h-5" /> Create Recruitment Post
                </button>
            </div>

            {/* Recruitment Modal */}
            {showRecruitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowRecruitModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <h2 className="text-2xl font-black text-white italic tracking-tight mb-6">Create Recruitment Post</h2>

                        <form onSubmit={handleRecruitSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Role Needed</label>
                                <select
                                    value={recruitForm.role}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, role: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none appearance-none"
                                >
                                    {ROLES.filter(r => r !== 'Role').map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Experience Required</label>
                                <select
                                    value={recruitForm.experience}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, experience: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none appearance-none"
                                >
                                    {EXPERIENCES.filter(e => e !== 'Experience').map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Min Age</label>
                                <input
                                    type="number"
                                    value={recruitForm.age}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, age: e.target.value })}
                                    placeholder="e.g. 16"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Min Device</label>
                                <input
                                    type="text"
                                    value={recruitForm.minDevice}
                                    onChange={(e) => setRecruitForm({ ...recruitForm, minDevice: e.target.value })}
                                    placeholder="e.g. iPhone 11, 90 FPS"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-wide rounded-xl hover:bg-violet-400 hover:text-white transition-colors mt-4"
                            >
                                {submitting ? 'Posting...' : 'Post & Find Matches'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Matches Notification Modal */}
            {matches.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <button
                            onClick={() => setMatches([])}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center mb-8">
                            <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full inline-block mb-4">
                                <Search className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-white">We Found Matches!</h2>
                            <p className="text-gray-400">These players match your recruitment criteria.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {matches.map(player => (
                                <div key={player._id} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        {player.avatarUrl ? <img src={player.avatarUrl} alt={player.ign} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-zinc-600" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{player.ign}</div>
                                        <div className="text-xs text-gray-500">{player.experience} • {player.age}yo</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500 mb-4">Notifications have been sent to these players.</p>
                            <button onClick={() => setMatches([])} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Filters Bar */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-4 mb-8 sticky top-4 z-20 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by Name/IGN..."
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-violet-500 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <select
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-violet-500 focus:outline-none appearance-none cursor-pointer"
                        >
                            {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>

                    {/* Experience Filter */}
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <select
                            name="experience"
                            value={filters.experience}
                            onChange={handleFilterChange}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-violet-500 focus:outline-none appearance-none cursor-pointer"
                        >
                            {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                        </select>
                    </div>

                    {/* Age Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <input
                            type="number"
                            name="age"
                            value={filters.age}
                            onChange={handleFilterChange}
                            placeholder="Age (Exact)"
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-violet-500 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Device Filter */}
                    <div className="relative">
                        <Smartphone className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            name="device"
                            value={filters.device}
                            onChange={handleFilterChange}
                            placeholder="Device (e.g. iPhone)"
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-violet-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Players Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {players.length > 0 ? (
                        players.map(player => (
                            <div key={player._id} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-violet-500/30 hover:bg-white/[0.02] transition-all group">
                                {/* Avatar */}
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-violet-500/50 transition-colors">
                                    {player.avatarUrl ? (
                                        <img src={player.avatarUrl} alt={player.ign} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-zinc-600" />
                                    )}
                                </div>

                                {/* Player Info section - grows to fill space */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 w-full md:w-auto items-center">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white truncate italic tracking-tight">{player.ign}</h3>
                                        <p className="text-sm text-gray-400 truncate font-medium">{player.name}</p>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Role</div>
                                        <span className="px-3 py-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-full text-sm font-black uppercase tracking-wide">
                                            {player.role || 'N/A'}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Age</div>
                                        <div className="text-sm text-white font-bold">
                                            {player.age ? `${player.age} Years` : 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Experience</div>
                                        <div className="text-sm text-white font-bold">
                                            {player.experience || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Device</div>
                                        <div className="text-sm text-white font-bold truncate" title={player.device}>
                                            {player.device || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info (Replaces Action Button) */}
                                <div className="w-full md:w-auto flex flex-col items-end gap-2 min-w-[140px]">
                                    {player.socialLinks?.instagram && (
                                        <a href={player.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors font-bold text-sm bg-pink-500/10 px-4 py-2 rounded-xl w-full justify-center">
                                            <Instagram className="w-4 h-4" /> Instagram
                                        </a>
                                    )}
                                    {player.phone && (
                                        <div className="flex items-center gap-2 w-full">
                                            <div className="flex-1 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-2 rounded-xl whitespace-nowrap overflow-hidden">
                                                <Phone className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{player.phone}</span>
                                            </div>
                                            <a
                                                href={`https://wa.me/${(() => {
                                                    const clean = player.phone.replace(/\D/g, '');
                                                    return clean.startsWith('0') ? '92' + clean.slice(1) : clean;
                                                })()}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-xl transition-colors shadow-lg shadow-[#25D366]/20 flex-shrink-0"
                                                title="Chat on WhatsApp"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#111] rounded-3xl border border-white/5">
                            <div className="bg-zinc-900 p-6 rounded-full mb-4">
                                <Search className="w-12 h-12 text-zinc-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No players found</h3>
                            <p className="text-slate-500 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
                            <button onClick={() => setFilters({ role: 'Role', experience: 'Experience', search: '', age: '' })} className="mt-6 text-violet-400 hover:text-violet-300 font-bold text-sm">Clear Filters</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScoutPlayers;
