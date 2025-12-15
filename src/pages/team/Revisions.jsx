import { useEffect, useState } from 'react';
import api from '../../api/client';
import { MessageSquare, Send } from 'lucide-react';

const TeamRevisions = () => {
    const [requests, setRequests] = useState([]);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ media: '', message: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reqRes, mediaRes] = await Promise.all([
                api.get('/team/revision-requests'),
                api.get('/team/media')
            ]);
            setRequests(reqRes.data);
            setMedia(mediaRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (payload.media === '') delete payload.media;
        try {
            await api.post('/team/request-revision', payload);
            fetchData();
            setFormData({ media: '', message: '' });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Revision Requests</h1>
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <p className="text-gray-500">No requests submitted</p>
                    ) : (
                        requests.map(req => (
                            <div key={req._id} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <span className={`px-2 py-1 text-xs rounded uppercase font-bold mr-3 ${req.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : req.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {req.status}
                                        </span>
                                        <span className="text-gray-500 text-sm">{new Date(req.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-300 mb-3">{req.message}</p>
                                    {req.media && (
                                        <div className="flex items-center text-sm text-blue-400">
                                            <span className="mr-2">Related Media:</span>
                                            <a href={req.media.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{req.media.title || 'View Media'}</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div>
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 sticky top-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center uppercase tracking-wide"><Send className="mr-2 w-5 h-5" /> New Request</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-gray-400 text-sm mb-1 uppercase tracking-wider">Related Media (Optional)</label>
                            <select className="w-full p-3 bg-black text-white rounded border border-zinc-700 focus:border-emerald-500 focus:outline-none" value={formData.media} onChange={e => setFormData({ ...formData, media: e.target.value })}>
                                <option value="">None / General</option>
                                {media.map(m => <option key={m._id} value={m._id}>{m.title || 'Untitled'}</option>)}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm mb-1 uppercase tracking-wider">Message</label>
                            <textarea className="w-full p-3 bg-black text-white rounded border border-zinc-700 focus:border-emerald-500 focus:outline-none h-32" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required placeholder="Describe your request..."></textarea>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded hover:bg-emerald-700 transition-colors font-bold uppercase tracking-wide shadow-lg shadow-emerald-900/20">Submit Request</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamRevisions;
