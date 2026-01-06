import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Briefcase, Trash2, Clock, Calendar, Smartphone, Plus, CheckCircle, XCircle, AlertCircle, Edit2, Save, X, Search, User } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { showToast } from '../../utils/toast';

const ROLES = ['IGL', 'Assaulter', 'Support', 'Fragger'];
const EXPERIENCES = ['1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];

const Recruitments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Open Modal if requested via navigation state
    useEffect(() => {
        if (location.state?.openCreate) {
            setShowCreateModal(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        role: 'Assaulter',
        experience: '1 Year',
        age: '',
        minDevice: ''
    });
    const [creating, setCreating] = useState(false);
    const [matches, setMatches] = useState([]);

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

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data } = await api.post('/team/recruitment', createForm);
            setPosts([data.post, ...posts]); // Add new post to list
            setMatches(data.matches || []);
            setShowCreateModal(false);
            showToast.success('Recruitment post created');
        } catch (error) {
            console.error('Error posting recruitment:', error);
            showToast.error('Failed to create post');
        } finally {
            setCreating(false);
        }
    };

    // Status Toggle
    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
        try {
            const { data } = await api.put(`/team/recruitment/${id}/status`, { status: newStatus });
            setPosts(posts.map(p => p._id === id ? { ...p, status: newStatus } : p));
            showToast.success('Status updated');
        } catch (error) {
            console.error('Error updating status:', error);
            showToast.error('Failed to update status');
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
            showToast.success('Recruitment post deleted');
        } catch (error) {
            console.error('Error deleting post:', error);
            showToast.error('Failed to delete post');
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
            showToast.success('Post updated successfully');
        } catch (error) {
            console.error('Error updating post:', error);
            showToast.error('Failed to update post');
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
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-violet-500/20"
                >
                    <Plus className="w-5 h-5" /> New Post
                </button>
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
                            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 font-bold hover:underline">
                                <Plus className="w-4 h-4" /> Create First Post
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Custom Delete Confirmation Modal - Replaced with Generic */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Recruitment"
                message="Are you sure you want to delete this recruitment post completely? It will be gone forever."
                confirmText={deleting ? 'Deleting...' : 'Delete Recruitment'}
                isDanger={true}
                isLoading={deleting}
            />

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-violet-500/10 relative overflow-hidden group">
                        {/* Decorative Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <button
                            onClick={() => setShowEditModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-sm z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-6">MISSION PARAMETERS</h2>

                            <form onSubmit={handleEditSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    {/* Role Select */}
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Briefcase className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        </div>
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none appearance-none transition-all cursor-pointer hover:bg-white/[0.02]"
                                        >
                                            {ROLES.map(r => <option key={r} value={r} className="bg-[#1a1a1a] text-white py-2">{r}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500" />
                                        </div>
                                    </div>

                                    {/* Experience Select */}
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Clock className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        </div>
                                        <select
                                            value={editForm.experience}
                                            onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none appearance-none transition-all cursor-pointer hover:bg-white/[0.02]"
                                        >
                                            {EXPERIENCES.map(e => <option key={e} value={e} className="bg-[#1a1a1a] text-white py-2">{e}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Age Input */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <Calendar className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                            </div>
                                            <input
                                                type="number"
                                                value={editForm.age}
                                                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                                placeholder="Age"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                        </div>

                                        {/* Device Input */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <Smartphone className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={editForm.minDevice}
                                                onChange={(e) => setEditForm({ ...editForm, minDevice: e.target.value })}
                                                placeholder="Device"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-4 bg-white hover:bg-gray-100 text-black font-black uppercase tracking-wide rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Recruitment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-violet-500/10 relative overflow-hidden group">
                        {/* Decorative Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-sm z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/5 mb-4">
                                <Briefcase className="w-6 h-6 text-fuchsia-400" />
                            </div>

                            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1">NEW MISSION</h2>
                            <p className="text-gray-400 text-sm mb-6">Define the parameters for your new operative.</p>

                            <form onSubmit={handleCreateSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    {/* Role Select */}
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Briefcase className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        </div>
                                        <select
                                            value={createForm.role}
                                            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none appearance-none transition-all cursor-pointer hover:bg-white/[0.02]"
                                        >
                                            {ROLES.map(r => <option key={r} value={r} className="bg-[#1a1a1a] text-white">{r}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500" />
                                        </div>
                                    </div>

                                    {/* Experience Select */}
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Clock className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                        </div>
                                        <select
                                            value={createForm.experience}
                                            onChange={(e) => setCreateForm({ ...createForm, experience: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none appearance-none transition-all cursor-pointer hover:bg-white/[0.02]"
                                        >
                                            {EXPERIENCES.map(e => <option key={e} value={e} className="bg-[#1a1a1a] text-white">{e}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Age Input */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <Calendar className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                            </div>
                                            <input
                                                type="number"
                                                value={createForm.age}
                                                onChange={(e) => setCreateForm({ ...createForm, age: e.target.value })}
                                                placeholder="Age"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                        </div>

                                        {/* Device Input */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                <Smartphone className="w-5 h-5 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={createForm.minDevice}
                                                onChange={(e) => setCreateForm({ ...createForm, minDevice: e.target.value })}
                                                placeholder="Device"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black uppercase tracking-wide rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    {creating ? (
                                        <>Posting...</>
                                    ) : (
                                        <>
                                            Initialize Search <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
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
                            <X className="w-6 h-6" />
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
        </div>
    );
};

export default Recruitments;
