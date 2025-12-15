import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Briefcase, Trash2, Clock, Calendar, Smartphone, Plus, CheckCircle, XCircle, AlertCircle, Edit2, Save, X } from 'lucide-react';

const ROLES = ['IGL', 'Assaulter', 'Support', 'Fragger'];
const EXPERIENCES = ['1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];

const Recruitments = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editForm, setEditForm] = useState({
        role: '',
        experience: '',
        age: '',
        minDevice: ''
    });
    const [saving, setSaving] = useState(false);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/team/recruitment');
            setPosts(data);
        } catch (error) {
            console.error('Error fetching recruitments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Status Toggle
    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
        try {
            const { data } = await api.put(`/team/recruitment/${id}/status`, { status: newStatus });
            setPosts(posts.map(p => p._id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    // Delete Logic
    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        setDeleting(true);
        try {
            await api.delete(`/team/recruitment/${postToDelete._id}`);
            setPosts(posts.filter(p => p._id !== postToDelete._id));
            setShowDeleteModal(false);
            setPostToDelete(null);
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        } finally {
            setDeleting(false);
        }
    };

    // Edit Logic
    const handleEditClick = (post) => {
        setEditingPost(post);
        setEditForm({
            role: post.role,
            experience: post.experience,
            age: post.age || '',
            minDevice: post.minDevice || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put(`/team/recruitment/${editingPost._id}`, editForm);
            setPosts(posts.map(p => p._id === editingPost._id ? { ...data, status: p.status } : p)); // Keep status as is or update if needed
            setShowEditModal(false);
            setEditingPost(null);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Recruitment Status</h1>
                    <p className="text-gray-400">Manage your active player searches. Closed posts are hidden from players.</p>
                </div>
                <Link to="/team/scout" className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    <Plus className="w-5 h-5" /> New Post
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading listings...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className={`bg-[#111] border rounded-2xl p-6 relative group transition-all ${post.status === 'Closed' ? 'border-red-900/30 opacity-75' : 'border-white/5 hover:border-fuchsia-500/30'}`}>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(post._id, post.status)}
                                        className={`p-2 rounded-lg transition-colors ${post.status === 'Open' ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-yellow-500 hover:bg-yellow-500/10'}`}
                                        title={post.status === 'Open' ? 'Close Recruitment' : 'Re-open Recruitment'}
                                    >
                                        {post.status === 'Open' ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(post)}
                                        className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Edit Post"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(post)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${post.status === 'Open' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'bg-gray-800 text-gray-500'}`}>
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${post.status === 'Open' ? 'text-fuchsia-400' : 'text-gray-500'}`}>
                                            {post.status === 'Open' ? 'Looking For' : 'Closed'}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{post.role}</h3>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-white/5 rounded-xl p-4 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><Clock size={14} /> Experience</span>
                                        <span className="text-white font-bold">{post.experience}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Min Age</span>
                                        <span className="text-white font-bold">{post.age ? `${post.age}+` : 'Any'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-2"><Smartphone size={14} /> Device</span>
                                        <span className="text-white font-bold">{post.minDevice || 'Any'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                                    <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
                                    {post.status === 'Open' ? (
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-400 rounded text-[10px] font-bold uppercase">
                                            <XCircle className="w-3 h-3" />
                                            Closed
                                        </div>
                                    )}
                                </div>

                                {post.status === 'Open' && (
                                    <button
                                        onClick={() => handleToggleStatus(post._id, post.status)}
                                        className="w-full mt-4 py-2 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                    >
                                        Close Recruitment
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-[#111] border border-dashed border-white/10 rounded-3xl">
                            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2">No Active Posts</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't posted any recruitment requests yet. Create one to find players.</p>
                            <Link to="/team/scout" className="inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 font-bold">
                                Go to Scout & Create Post
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-red-900/20 transform animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Delete Recruitment?</h3>
                        <p className="text-gray-400 mb-8">
                            Are you sure you want to delete this recruitment post completely? It will be gone forever.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative transform animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-black text-white italic tracking-tight mb-6">Edit Recruitment</h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Role Needed</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none appearance-none"
                                >
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Experience Required</label>
                                <select
                                    value={editForm.experience}
                                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none appearance-none"
                                >
                                    {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Min Age</label>
                                <input
                                    type="number"
                                    value={editForm.age}
                                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                    placeholder="e.g. 16"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Min Device</label>
                                <input
                                    type="text"
                                    value={editForm.minDevice}
                                    onChange={(e) => setEditForm({ ...editForm, minDevice: e.target.value })}
                                    placeholder="e.g. iPhone 11, 90 FPS"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-wide rounded-xl hover:bg-violet-400 hover:text-white transition-colors mt-4 flex items-center justify-center gap-2"
                            >
                                {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recruitments;
