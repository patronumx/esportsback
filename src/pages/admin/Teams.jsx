import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Download, Users, Gamepad2, Globe, Search, X, Shield } from 'lucide-react';
import FileUploader from '../../components/common/FileUploader';

const AdminTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', game: '', region: '', logoUrl: '' });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/admin/teams');
            setTeams(data.data || data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/teams', formData);
            setShowModal(false);
            fetchTeams();
            setFormData({ name: '', email: '', password: '', game: '', region: '', logoUrl: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this team?')) {
            try {
                await api.delete(`/admin/teams/${id}`);
                fetchTeams();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.region?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                        Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Management</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Manage your esports teams, rosters, and credentials.</p>
                </div>
                <div className="flex gap-3">
                    <a href="http://localhost:5000/api/admin/export/teams" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl flex items-center hover:bg-gray-700 transition-colors border border-white/5">
                        <Download className="mr-2 w-4 h-4" /> Export CSV
                    </a>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="mr-2 w-5 h-5" /> Add Team
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search teams by name, game, or region..."
                    className="w-full bg-black/20 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all duration-300 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map(team => (
                    <div key={team._id} className="group relative bg-gray-900 rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1 shadow-xl">
                        {/* Background Gradient */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-900/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 p-2 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={team.logoUrl || 'https://via.placeholder.com/150'}
                                        alt={team.name}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <Link to={`/sys-admin-secret-login/teams/${team._id}`} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => handleDelete(team._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1">{team.name}</h3>
                            <div className="flex items-center text-gray-400 text-sm mb-6">
                                <Shield className="w-4 h-4 mr-1 text-blue-400" />
                                <span>Team ID: <span className="font-mono text-gray-500">#{team._id.slice(-6)}</span></span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center text-gray-400 text-xs uppercase font-bold mb-1">
                                        <Gamepad2 className="w-3 h-3 mr-1" /> Game
                                    </div>
                                    <div className="text-white font-medium truncate">{team.game}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center text-gray-400 text-xs uppercase font-bold mb-1">
                                        <Globe className="w-3 h-3 mr-1" /> Region
                                    </div>
                                    <div className="text-white font-medium truncate">{team.region || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex justify-between items-center group-hover:bg-blue-600/5 transition-colors">
                            <div className="flex -space-x-2">
                                {/* Placeholder for player avatars if available later */}
                                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-500">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <Link to={`/sys-admin-secret-login/teams/${team._id}`} className="text-sm font-bold text-blue-400 group-hover:text-blue-300 flex items-center transition-colors">
                                View Details <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white">Create New Team</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Team Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Game Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. PUBG Mobile"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.game}
                                        onChange={e => setFormData({ ...formData, game: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Region</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. NA, EU, ASIA"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.region}
                                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-blue-400" /> Credentials
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Team Login Email"
                                        className="w-full p-3 bg-black/20 text-white rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-sm"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Team Login Password"
                                        className="w-full p-3 bg-black/20 text-white rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-sm"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <FileUploader
                                    label="Team Logo"
                                    onUploadSuccess={(url) => setFormData({ ...formData, logoUrl: url })}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Create Team
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeams;
