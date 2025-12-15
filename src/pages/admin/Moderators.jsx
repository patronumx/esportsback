import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Plus, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Moderators = () => {
    const [moderators, setModerators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        fetchModerators();
    }, []);

    const fetchModerators = async () => {
        try {
            const { data } = await api.get('/admin/moderators');
            setModerators(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch moderators');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/moderators', formData);
            toast.success('Moderator created successfully');
            setShowModal(false);
            fetchModerators();
            setFormData({ name: '', email: '', password: '' });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create moderator');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to remove this moderator?')) {
            try {
                await api.delete(`/admin/moderators/${id}`);
                toast.success('Moderator removed');
                fetchModerators();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete moderator');
            }
        }
    };

    if (loading) return <div className="text-white flex justify-center items-center h-full">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Moderators</h1>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                    <Plus className="mr-2 w-4 h-4" /> Add Moderator
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moderators.map(mod => (
                    <div key={mod._id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex items-center justify-between hover:border-blue-500/30 transition-all">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 text-blue-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{mod.name}</h3>
                                <p className="text-gray-400 text-sm">{mod.email}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(mod._id)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Moderator</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Name</label>
                                <input type="text" className="w-full p-3 bg-black/50 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Email</label>
                                <input type="email" className="w-full p-3 bg-black/50 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Password</label>
                                <input type="password" className="w-full p-3 bg-black/50 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none transition-colors" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Moderators;
