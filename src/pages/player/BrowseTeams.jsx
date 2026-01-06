import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Search, Users, MapPin, Globe, Briefcase, Filter, MessageCircle, Phone } from 'lucide-react';

const BrowseTeams = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/player/all-recruitment-posts');
                setPosts(data);
            } catch (error) {
                console.error('Error fetching recruitment posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.team?.name?.toLowerCase().includes(search.toLowerCase()) ||
        post.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Recruitment Feed</h1>
                    <p className="text-gray-400">Browse active recruitment calls from teams.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by team or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-fuchsia-500 outline-none transition-colors"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading opportunities...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <div key={post._id} className="bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-fuchsia-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Briefcase className="w-24 h-24 text-fuchsia-500 transform rotate-12 translate-x-4 -translate-y-4" />
                                </div>

                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden border border-white/10">
                                        {post.team?.logoUrl ? (
                                            <img src={post.team.logoUrl} alt={post.team.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-600">{post.team?.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">{post.team?.name || 'Unknown Team'}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                                            <Globe size={12} /> {post.team?.region || 'Global'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 relative z-10">
                                    <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
                                        <div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Looking For</div>
                                            <div className="text-lg font-bold text-white">{post.role}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Experience</div>
                                            <div className="text-white font-medium">{post.experience}</div>
                                        </div>
                                    </div>
                                    {post.age && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
                                            <span>Min Age: <strong className="text-white">{post.age}+</strong></span>
                                        </div>
                                    )}
                                </div>

                                {post.team?.phoneNumber && (
                                    <div className="flex items-center gap-2 mb-4 relative z-10 p-1">
                                        <div className="flex-1 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-3 rounded-xl whitespace-nowrap overflow-hidden border border-emerald-500/20">
                                            <Phone className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{post.team.phoneNumber}</span>
                                        </div>
                                        <a
                                            href={`https://wa.me/${(() => {
                                                const clean = post.team.phoneNumber.replace(/\D/g, '');
                                                return clean.startsWith('0') ? '92' + clean.slice(1) : clean;
                                            })()}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-xl transition-colors shadow-lg shadow-[#25D366]/20 flex-shrink-0"
                                            title="Chat on WhatsApp"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}

                                <Link to={`/player/teams/${post.team?._id}`} className="relative z-10 block w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-center">
                                    View Team Profile
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-[#111] border border-dashed border-white/10 rounded-3xl">
                            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2">No Active Recruitments</h3>
                            <p className="text-gray-500">There are currently no teams actively looking for players.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrowseTeams;
