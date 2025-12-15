import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Download, Play, Maximize2, X, Search, Image as ImageIcon, Video, Upload, Camera, Trash2, Mic, Handshake } from 'lucide-react';

const TeamMedia = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewItem, setPreviewItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentFilter, setCurrentFilter] = useState('All'); // All, Images, Videos, Interviews, Sponsors

    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadType, setUploadType] = useState('media'); // 'media' or 'logo'
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('general'); // general, interview, sponsor

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const { data } = await api.get('/team/media');
            setMedia(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch media', error);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        if (uploadType === 'media') {
            formData.append('title', title);
            formData.append('category', category);
        }

        try {
            const endpoint = uploadType === 'logo' ? '/team/logo' : '/team/media';

            await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (uploadType === 'media') {
                fetchMedia();
            } else {
                alert('Logo updated successfully! Refresh the page to see changes.');
            }

            setFile(null);
            setTitle('');
            setCategory('general');
            setShowUploadModal(false);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent preview opening
        if (!window.confirm("Are you sure you want to delete this file?")) return;
        try {
            await api.delete(`/team/media/${id}`);
            setMedia(media.filter(m => m._id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    // Filter media
    const filteredMedia = media.filter(m => {
        const matchesFilter = currentFilter === 'All' ||
            (currentFilter === 'Images' && m.type === 'image') ||
            (currentFilter === 'Videos' && m.type === 'video') ||
            (currentFilter === 'Interviews' && m.category === 'interview') ||
            (currentFilter === 'Sponsors' && m.category === 'sponsor');

        const matchesSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">
                            {uploadType === 'logo' ? 'Update Team Logo' : 'Upload Media'}
                        </h2>

                        <form onSubmit={handleUpload} className="space-y-4">
                            {uploadType === 'media' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="e.g. Scrim Highlights"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="general">General</option>
                                            <option value="interview">Interview</option>
                                            <option value="sponsor">Sponsor Clip</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select File</label>
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept={uploadType === 'logo' ? "image/*" : "image/*,video/*"}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-400">
                                            {file ? file.name : (uploadType === 'logo' ? 'Click to select Logo' : 'Click to select Image/Video')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !file}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                        Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Assets</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Access and download your team's media content.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => { setUploadType('logo'); setShowUploadModal(true); }}
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Camera className="w-4 h-4" /> Update Logo
                    </button>
                    <button
                        onClick={() => { setUploadType('media'); setShowUploadModal(true); }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> Upload Media
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex p-1 bg-gray-900/50 rounded-xl border border-white/5 overflow-x-auto">
                    {['All', 'Images', 'Videos', 'Interviews', 'Sponsors'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setCurrentFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${currentFilter === filter
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full bg-gray-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all duration-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No media assets found</p>
                    </div>
                ) : (
                    filteredMedia.map(item => (
                        <div
                            key={item._id}
                            className="group relative aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1"
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
                                    <h3 className="text-white font-bold truncate text-lg">{item.title || 'Untitled Asset'}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex gap-1">
                                            <span className={`
                                                flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10
                                                ${item.category === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                                                    item.category === 'sponsor' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        item.type === 'video' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}
                                            `}>
                                                {item.category === 'interview' ? <Mic className="w-3 h-3 mr-1" /> :
                                                    item.category === 'sponsor' ? <Handshake className="w-3 h-3 mr-1" /> :
                                                        item.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                                                {item.category === 'general' ? item.type.toUpperCase() : item.category.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => handleDelete(item._id, e)}
                                                className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={item.url}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Preview Modal (Lightbox) */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 animate-in fade-in duration-300" onClick={() => setPreviewItem(null)}>
                    <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="max-w-7xl max-h-[90vh] w-full p-4 flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/20 border border-white/10 bg-black">
                            {previewItem.type === 'video' ? (
                                <video src={previewItem.url} className="max-w-full max-h-[80vh] object-contain" controls autoPlay />
                            ) : (
                                <img src={previewItem.url} alt={previewItem.title} className="max-w-full max-h-[80vh] object-contain" />
                            )}
                        </div>
                        <div className="mt-6 text-center">
                            <h2 className="text-2xl font-bold text-white">{previewItem.title || 'Untitled Asset'}</h2>
                            <a
                                href={previewItem.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download Original
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMedia;
