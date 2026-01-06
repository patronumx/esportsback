import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Users, Globe, Trophy, ArrowLeft, Instagram, Twitter, MessageCircle } from 'lucide-react';

const TeamProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const { data } = await api.get(`/player/teams/${id}`);
                setTeam(data);
            } catch (error) {
                console.error('Error fetching team details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-500">Loading team profile...</div>;
    if (!team) return <div className="text-center py-20 text-red-500">Team not found</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
                <ArrowLeft size={20} /> Back to Browse
            </button>

            {/* Header Section */}
            <div className="relative rounded-3xl overflow-hidden bg-[#111] border border-white/10">
                {/* Banner Placeholder or Image */}
                <div className="h-48 md:h-64 bg-gradient-to-r from-violet-900/40 to-indigo-900/40 w-full relative">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                </div>

                <div className="px-6 md:px-10 pb-8 relative">
                    <div className="flex flex-col md:flex-row gap-6 items-end -mt-16 md:-mt-20">
                        {/* Logo */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-black border-4 border-[#111] shadow-2xl overflow-hidden flex items-center justify-center relative group">
                            {team.logoUrl ? (
                                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-4xl font-black text-gray-700 select-none">{team.name.substring(0, 2).toUpperCase()}</div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 mb-2">
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{team.name}</h1>
                            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <span className="flex items-center gap-2"><Globe size={16} className="text-violet-500" /> {team.region || 'Global'}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                                <span className="text-violet-400">{team.game || 'PUBG Mobile'}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-2">
                            {team.socialLinks?.instagram && (
                                <a href={team.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-violet-600 hover:text-white text-violet-500 transition-colors">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {team.socialLinks?.twitter && (
                                <a href={team.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-sky-500 hover:text-white text-sky-500 transition-colors">
                                    <Twitter size={20} />
                                </a>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Roster Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats */}
                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                            <Trophy className="text-yellow-500" size={20} /> Team Achievements
                        </h3>

                        <div className="bg-[#111] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative z-10">
                            <Trophy className="w-12 h-12 text-yellow-500/20 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Achievements Coming Soon</h3>
                            <p className="text-gray-500 text-sm">
                                We're updating our trophy cabinet. Detailed tournament history will be available shortly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Roster */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Users className="text-violet-500" /> Active Roster
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.roster && team.roster.length > 0 ? (
                            team.roster.map(player => (
                                <div key={player._id} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/30 transition-colors group">
                                    <div className="w-16 h-16 rounded-full bg-gray-800 overflow-hidden border-2 border-transparent group-hover:border-violet-500 transition-colors">
                                        {player.image ? (
                                            <img src={player.image} alt={player.ign} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <Users size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg group-hover:text-violet-400 transition-colors">{player.ign}</div>
                                        <div className="text-sm text-gray-400 font-mono uppercase">{player.role || 'Player'}</div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-10 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                                No active players found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamProfile;
