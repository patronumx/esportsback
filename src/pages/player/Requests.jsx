import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Trash2, Edit2, AlertCircle, CheckCircle } from 'lucide-react';

const PlayerRequests = () => {
    const { user, loginWithToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Check if player has an active request
    const hasActiveRequest = user?.lookingForTeam;

    const handleDeleteRequest = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            const { data } = await api.put('/player/recruitment', {
                lookingForTeam: false
            });

            // Update local storage and reload to force context refresh
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                const updatedUser = { ...storedUser, lookingForTeam: false };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload();
            }

        } catch (error) {
            console.error('Failed to delete request', error);
            alert('Failed to remove request.');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl shadow-red-900/20 transform animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Remove Request?</h3>
                        <p className="text-gray-400 mb-8">
                            Are you sure you want to remove your recruitment request? Teams will no longer be able to find you.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={loading}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Removing...' : 'Yes, Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">My Requests</h1>
                <p className="text-gray-400">Manage your recruitment status and applications.</p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative overflow-hidden mb-8">
                {hasActiveRequest ? (
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Active Recruitment Request</h2>
                                    <p className="text-emerald-400 font-medium">You are visible to teams!</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/player/dashboard')}
                                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                    title="Edit Profile"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDeleteRequest}
                                    disabled={loading}
                                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-xl transition-colors"
                                    title="Delete Request"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 rounded-2xl p-6 border border-white/5">
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Role</div>
                                <div className="text-white font-medium">{user?.playerRole || user?.role}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Experience</div>
                                <div className="text-white font-medium">{user?.experience}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Device</div>
                                <div className="text-white font-medium">{user?.device}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Age</div>
                                <div className="text-white font-medium">{user?.age}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 relative z-10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Active Requests</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            You are currently not looking for a team. Update your recruitment profile to get scouted.
                        </p>
                        <button
                            onClick={() => navigate('/player/dashboard')}
                            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Create Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerRequests;
