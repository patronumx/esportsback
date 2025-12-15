import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Plus, Trash2, Folder, Image as ImageIcon, Video, Search, X, Play, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUploader from '../../components/common/FileUploader';

const AdminMedia = () => {
    const [media, setMedia] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [previewItem, setPreviewItem] = useState(null);
    const [currentFilter, setCurrentFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ teamId: '', title: '', type: 'image', tags: '', folder: 'General', url: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mediaRes, teamsRes] = await Promise.all([
                api.get('/admin/media'),
                api.get('/admin/teams')
            ]);
            setMedia(mediaRes.data);
            setTeams(teamsRes.data.data || teamsRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/media', formData);
            setShowModal(false);
            fetchData();
            setFormData({ teamId: '', title: '', type: 'image', tags: '', folder: 'General', url: '' });
            toast.success('Media uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this media?')) {
            try {
                await api.delete(`/admin/media/${id}`);
                fetchData();
                toast.success('Media deleted');
                if (previewItem && previewItem._id === id) setPreviewItem(null);
            } catch (error) {
                console.error(error);
                toast.error('Delete failed');
            }
        }
    };

    // Filter media
    const filteredMedia = media.filter(m => {
        const matchesFilter = currentFilter === 'All' ||
            (currentFilter === 'Images' && m.type === 'image') ||
            (currentFilter === 'Videos' && m.type === 'video');
        const matchesSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

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
                        Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Gallery</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Manage and organize your team's digital assets.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="group relative px-6 py-3 bg-blue-600 rounded-xl overflow-hidden shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center text-white font-bold">
                        <Plus className="mr-2 w-5 h-5" /> Upload Media
                    </div>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex p-1 bg-gray-900/50 rounded-xl border border-white/5">
                    {['All', 'Images', 'Videos'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setCurrentFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${currentFilter === filter
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title or tags..."
                        className="w-full bg-gray-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all duration-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map(item => (
                    <div
                        key={item._id}
                        className="group relative aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1"
                        onClick={() => setPreviewItem(item)}
                    >
                        {item.type === 'video' ? (
                            <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                        ) : (
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white font-bold truncate text-lg">{item.title}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
                                        {item.team?.name || 'General'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                            className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="p-2 bg-white/10 text-white rounded-full backdrop-blur-md">
                                            {item.type === 'video' ? <Play className="w-4 h-4 fill-current" /> : <Maximize2 className="w-4 h-4" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                            <span className={`
                                flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg
                                ${item.type === 'video' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}
                            `}>
                                {item.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                                {item.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] rounded-3xl p-8 w-full max-w-lg border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className="text-2xl font-black text-white">Upload Media</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Team</label>
                                <select
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.teamId}
                                    onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                                    <select
                                        className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Highlights, Scrims, Finals"
                                    className="w-full p-3 bg-white/5 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:bg-white/10 transition-all"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <FileUploader
                                    label="Drop your file here"
                                    accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                                    onUploadSuccess={(url) => setFormData({ ...formData, url })}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Upload Asset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal (Lightbox) */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 animate-in fade-in duration-300" onClick={() => setPreviewItem(null)}>
                    <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="max-w-7xl max-h-[90vh] w-full p-4 flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 bg-black">
                            {previewItem.type === 'video' ? (
                                <video src={previewItem.url} className="max-w-full max-h-[80vh] object-contain" controls autoPlay />
                            ) : (
                                <img src={previewItem.url} alt={previewItem.title} className="max-w-full max-h-[80vh] object-contain" />
                            )}
                        </div>
                        <div className="mt-6 text-center">
                            <h2 className="text-2xl font-bold text-white">{previewItem.title}</h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                {previewItem.tags?.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full border border-white/5">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMedia;
