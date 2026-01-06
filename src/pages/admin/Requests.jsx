import { useState, useEffect } from 'react';
import api from '../../api/client';
import { CheckCircle, XCircle, Clock, Shield, AlertTriangle, MessageSquare } from 'lucide-react';
import { showToast } from '../../utils/toast';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/admin/requests'); // Use the endpoint we just made
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await api.put(`/admin/requests/${id}`, { status });
            showToast.success(`Request ${status}`);
            fetchRequests();
        } catch (error) {
            showToast.error("Action failed");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Service Requests</h1>
                    <p className="text-gray-400 text-sm">Manage unlock requests from teams.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-white">No Pending Requests</h3>
                        <p className="text-gray-500 text-sm">All caught up! No teams have requested services.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-purple-500/30 transition-all">

                            {/* Team Info Badge */}
                            <div className="flex-shrink-0">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${req.team?.isPro ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/50' : 'bg-gray-800 border-gray-700'}`}>
                                    {req.team?.isPro ? <Shield className="w-6 h-6 text-purple-400" /> : <Shield className="w-6 h-6 text-gray-400" />}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-white">{req.team?.name || 'Unknown Team'}</h3>
                                    {req.team?.isPro ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500 text-white tracking-wider">PRO TEAM</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-700 text-gray-300 tracking-wider">BASIC TEAM</span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-gray-300 font-medium">{req.type} Request</p>
                                {req.message && <p className="text-gray-500 text-sm mt-1">"{req.message}"</p>}
                                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Requested {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Actions */}
                            {req.status === 'pending' && (
                                <div className="flex items-center gap-3 mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleAction(req._id, 'approved')}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(req._id, 'rejected')}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminRequests;
