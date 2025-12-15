import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Check, X, MessageSquare, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRevisions = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/admin/revision-requests');
            setRequests(data.data || data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/admin/revision-requests/${id}/status`, { status });
            toast.success(`Request ${status}`);
            fetchRequests();
            if (selectedRequest && selectedRequest._id === id) {
                setSelectedRequest({ ...selectedRequest, status });
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const { data } = await api.post(`/admin/revision-requests/${selectedRequest._id}/comments`, { text: commentText });
            setSelectedRequest(data.data);
            setCommentText('');
            toast.success('Comment added');
            fetchRequests();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add comment');
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Revision Requests</h1>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Team</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {requests.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No requests found</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{req.team?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-gray-300 capitalize">{req.type}</td>
                                    <td className="px-6 py-4 text-gray-400 truncate max-w-xs">{req.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded capitalize ${req.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                                            req.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                                                'bg-yellow-500/20 text-yellow-300'
                                            }`}>{req.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => setSelectedRequest(req)} className="text-blue-400 hover:text-blue-300 transition-colors" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {req.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(req._id, 'approved')} className="text-green-400 hover:text-green-300 transition-colors" title="Approve">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleStatusUpdate(req._id, 'rejected')} className="text-red-400 hover:text-red-300 transition-colors" title="Reject">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg w-full max-w-2xl border border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Request Details</h2>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Team</label>
                                    <p className="text-white font-medium">{selectedRequest.team?.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase">Type</label>
                                    <p className="text-white font-medium capitalize">{selectedRequest.type}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase">Description</label>
                                    <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg mt-1">{selectedRequest.description}</p>
                                </div>
                                {selectedRequest.mediaUrl && (
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-500 uppercase">Attachment</label>
                                        <a href={selectedRequest.mediaUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline mt-1 truncate">
                                            {selectedRequest.mediaUrl}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Comments Section */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Discussion
                                </h3>
                                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                                    {selectedRequest.comments?.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No comments yet.</p>
                                    ) : (
                                        selectedRequest.comments?.map((comment, idx) => (
                                            <div key={idx} className="bg-gray-700/30 p-3 rounded-lg">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-blue-300">User</span>
                                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-300 text-sm">{comment.text}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <form onSubmit={handleAddComment} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-700 bg-gray-700/30 flex justify-end space-x-3">
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')} className="px-4 py-2 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">Reject Request</button>
                                    <button onClick={() => handleStatusUpdate(selectedRequest._id, 'approved')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Approve Request</button>
                                </>
                            )}
                            <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRevisions;
