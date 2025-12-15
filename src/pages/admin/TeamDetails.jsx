import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { Plus, Trash2, User, Edit, X, Save } from 'lucide-react';
import FileUploader from '../../components/common/FileUploader';

const AdminTeamDetails = () => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [playerForm, setPlayerForm] = useState({ ign: '', name: '', role: '', avatarUrl: '' });
    const [editForm, setEditForm] = useState({ name: '', game: '', region: '', logoUrl: '' });

    useEffect(() => {
        fetchTeamDetails();
    }, [id]);

    const fetchTeamDetails = async () => {
        try {
            const teamRes = await api.get(`/admin/teams/${id}`);
            const playersRes = await api.get(`/admin/teams/${id}/players`);
            setTeam(teamRes.data);
            setEditForm({
                name: teamRes.data.name,
                game: teamRes.data.game,
                region: teamRes.data.region,
                logoUrl: teamRes.data.logoUrl
            });
            setPlayers(playersRes.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/admin/teams/${id}`, editForm);
            setTeam(data);
            setShowEditModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/teams/${id}/players`, playerForm);
            setShowPlayerModal(false);
            fetchTeamDetails();
            setPlayerForm({ ign: '', name: '', role: '', avatarUrl: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePlayer = async (playerId) => {
        if (confirm('Remove player from team?')) {
            try {
                await api.delete(`/admin/players/${playerId}`);
                fetchTeamDetails();
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (!team) return <div className="text-white">Team not found</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <img src={team.logoUrl || 'https://via.placeholder.com/80'} alt={team.name} className="w-20 h-20 rounded-full bg-gray-700 object-cover mr-6 border-2 border-white/10" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                        <p className="text-gray-400">{team.game} • {team.region}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl flex items-center hover:bg-blue-600 hover:text-white transition-all"
                >
                    <Edit className="mr-2 w-4 h-4" /> Edit Team
                </button>
            </div>

            {/* Roster Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Roster</h2>
                    <button onClick={() => setShowPlayerModal(true)} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center hover:bg-green-700 transition-colors">
                        <Plus className="mr-1.5 w-4 h-4" /> Add Player
                    </button>
                </div>
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Player</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {players.length === 0 ? (
                                <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No players added yet</td></tr>
                            ) : (
                                players.map(player => (
                                    <tr key={player._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center overflow-hidden">
                                                {player.avatarUrl ? <img src={player.avatarUrl} alt={player.ign} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-gray-400" />}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{player.ign}</div>
                                                <div className="text-gray-500 text-xs">{player.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{player.role}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDeletePlayer(player._id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Player Modal */}
            {showPlayerModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Add Player</h2>
                        <form onSubmit={handleAddPlayer}>
                            <input type="text" placeholder="Nickname (IGN)" className="w-full mb-3 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none" value={playerForm.ign} onChange={e => setPlayerForm({ ...playerForm, ign: e.target.value })} required />
                            <input type="text" placeholder="Real Name" className="w-full mb-3 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none" value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} />
                            <input type="text" placeholder="Role (e.g. IGL)" className="w-full mb-3 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none" value={playerForm.role} onChange={e => setPlayerForm({ ...playerForm, role: e.target.value })} />
                            <FileUploader
                                label="Player Avatar"
                                onUploadSuccess={(url) => setPlayerForm({ ...playerForm, avatarUrl: url })}
                            />
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowPlayerModal(false)} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Team Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white">Edit Team Details</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateTeam} className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Team Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Game Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={editForm.game}
                                        onChange={e => setEditForm({ ...editForm, game: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Region</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={editForm.region}
                                        onChange={e => setEditForm({ ...editForm, region: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <FileUploader
                                    label="Team Logo"
                                    currentImage={editForm.logoUrl}
                                    onUploadSuccess={(url) => setEditForm({ ...editForm, logoUrl: url })}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    <Save className="mr-2 w-5 h-5" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeamDetails;
