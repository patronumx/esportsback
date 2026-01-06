import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Briefcase, Search, CheckCircle, XCircle, Instagram, MessageCircle, Phone } from 'lucide-react';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [playerDevice, setPlayerDevice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const { data } = await api.get('/player/matches');
                if (Array.isArray(data)) {
                    setMatches(data);
                } else {
                    setMatches(data.matches || []);
                    setPlayerDevice(data.playerDevice);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const checkDeviceMatch = (minDevice) => {
        if (!minDevice) return true;
        if (!playerDevice) return false;
        return playerDevice.toLowerCase().includes(minDevice.toLowerCase()) ||
            minDevice.toLowerCase().includes(playerDevice.toLowerCase());
    };



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Recruitment Matches</h1>
                <p className="text-slate-400 text-sm">Teams looking for a player with your Role.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.length > 0 ? (
                        matches.map(post => {
                            const isDeviceMatch = checkDeviceMatch(post.minDevice);

                            return (
                                <div key={post._id} className="bg-[#0f0f0f] rounded-3xl border border-white/5 p-6 relative overflow-hidden group hover:border-violet-500/50 transition-all">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Briefcase className="w-24 h-24 text-white" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                                {post.team?.logoUrl ? (
                                                    <img src={post.team.logoUrl} alt={post.team.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="font-bold text-xl text-zinc-500">{post.team?.name?.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{post.team?.name || 'Unknown Team'}</h3>
                                                <div className="text-xs text-violet-400 font-bold uppercase tracking-wider">Recruiting</div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Role:</span>
                                                <span className="text-white font-bold">{post.role}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Experience:</span>
                                                <span className="text-white font-bold">{post.experience}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Min Age:</span>
                                                <span className="text-white font-bold">{post.age ? `${post.age}+` : 'Any'}</span>
                                            </div>

                                            <div className="border-t border-white/5 pt-2 mt-2">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-500">Min Device:</span>
                                                    <span className="text-white font-bold">{post.minDevice || 'Any'}</span>
                                                </div>

                                                {post.minDevice && (
                                                    <div className={`flex items-center gap-2 text-xs font-bold uppercase p-2 rounded-lg mt-2 ${isDeviceMatch ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {isDeviceMatch ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                <span>Device Match</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-4 h-4" />
                                                                <span>Device Mismatch</span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {post.team?.phoneNumber && (
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="flex-1 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-2 rounded-xl whitespace-nowrap overflow-hidden">
                                                    <Phone className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{post.team.phoneNumber}</span>
                                                </div>
                                                <a
                                                    href={`https://wa.me/${(() => {
                                                        const clean = post.team.phoneNumber.replace(/\D/g, '');
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
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-20 bg-[#0f0f0f] rounded-3xl border border-white/5">
                            <Search className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                            <p className="text-slate-500">No teams are currently looking for a player with your specific profile.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Matches;
