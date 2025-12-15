import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { User, Plus, X, Upload, Save } from 'lucide-react';

const STAFF_ROLES = ['Coach', 'Analyst'];

const SupportStaff = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingStaffRole, setEditingStaffRole] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', role: '', experience: '', age: '', instagram: '', twitter: '', discord: '', image: '', file: null });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchRoster();
    }, []);

    const fetchRoster = async () => {
        try {
            const { data } = await api.get('/team/roster');
            setTeam(data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) {
                alert('Access Denied: You might be logged in as a Player. Please log out and log in as a Team.');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStaffEditClick = (role, player = null) => {
        setEditingStaffRole(role);
        if (player) {
            setEditForm({
                name: player.name || '',
                role: role,
                experience: player.experience || '',
                age: player.age || '',
                instagram: player.socialLinks?.instagram || '',
                twitter: player.socialLinks?.twitter || '',
                discord: player.socialLinks?.discord || '',
                image: player.image || '',
                file: null
            });
        } else {
            setEditForm({ name: '', role: role, experience: '', age: '', instagram: '', twitter: '', discord: '', image: '', file: null });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setEditForm({ ...editForm, file: e.target.files[0] });
        }
    };

    const handleSave = async (role) => {
        setUploading(true);
        try {
            let imageUrl = editForm.image;

            // Upload image if selected
            if (editForm.file) {
                const formData = new FormData();
                formData.append('file', editForm.file);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.url;
            }

            // Construct new roster
            const newRoster = [...(team.roster || [])];

            const playerData = {
                name: editForm.name,
                role: editForm.role,
                experience: editForm.experience,
                age: editForm.age,
                socialLinks: {
                    instagram: editForm.instagram,
                    twitter: editForm.twitter,
                    discord: editForm.discord
                },
                image: imageUrl
            };

            // Remove existing with this role if any, then push new
            const existingIndex = newRoster.findIndex(p => p && p.role === role);
            if (existingIndex !== -1) {
                newRoster[existingIndex] = playerData;
            } else {
                newRoster.push(playerData);
            }

            // clean array
            const cleanRoster = newRoster.filter(p => p !== null);

            const { data } = await api.post('/team/roster', { roster: cleanRoster });
            setTeam(data);
            setEditingStaffRole(null);
        } catch (error) {
            console.error('Error saving staff:', error);
            alert('Failed to save staff member');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async (index) => {
        if (!confirm('Remove this staff member?')) return;
        try {
            const newRoster = [...(team.roster || [])];
            newRoster.splice(index, 1);
            const { data } = await api.post('/team/roster', { roster: newRoster });
            setTeam(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-violet-500"></div></div>;
    if (!team) return <div className="text-white">Team not found</div>;

    const rosterDisplay = team.roster || [];
    const coach = rosterDisplay.find(p => p && p.role === 'Coach');
    const analyst = rosterDisplay.find(p => p && p.role === 'Analyst');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase tracking-wide">Support Staff</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your team coach and analyst</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {STAFF_ROLES.map((role) => {
                    const staffMember = role === 'Coach' ? coach : analyst;
                    const isEditing = editingStaffRole === role;

                    return (
                        <div key={role} className={`relative bg-[#0d0d0d] rounded-2xl border ${isEditing ? 'border-violet-500 ring-1 ring-violet-500' : 'border-white/10'} overflow-hidden transition-all duration-300 min-h-[350px] flex flex-col`}>
                            {isEditing ? (
                                // Edit Form
                                <div className="p-6 flex-1 flex flex-col animate-in fade-in duration-200">
                                    <h3 className="text-white font-bold mb-4">{staffMember ? `Edit ${role}` : `Add ${role}`}</h3>

                                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Role</label>
                                            <input
                                                type="text"
                                                value={editForm.role}
                                                disabled
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-gray-500 font-bold outline-none text-sm cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Experience</label>
                                                <input
                                                    type="text"
                                                    value={editForm.experience}
                                                    onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none text-sm"
                                                    placeholder="e.g. 3 Years"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Age</label>
                                                <input
                                                    type="text"
                                                    value={editForm.age}
                                                    onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none text-sm"
                                                    placeholder="e.g. 25"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Social Links</label>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editForm.instagram}
                                                    onChange={e => setEditForm({ ...editForm, instagram: e.target.value })}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none text-sm"
                                                    placeholder="Instagram URL"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.twitter}
                                                    onChange={e => setEditForm({ ...editForm, twitter: e.target.value })}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none text-sm"
                                                    placeholder="Twitter/X URL"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.discord}
                                                    onChange={e => setEditForm({ ...editForm, discord: e.target.value })}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500 outline-none text-sm"
                                                    placeholder="Discord Username/Link"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Photo</label>
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer bg-[#1a1a1a] border border-white/10 hover:border-violet-500 px-4 py-2 rounded-lg text-sm text-gray-300 flex items-center gap-2 transition-colors">
                                                    <Upload size={16} /> Choose File
                                                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                                </label>
                                                {editForm.file && <span className="text-xs text-green-400 truncate max-w-[100px]">{editForm.file.name}</span>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => handleSave(role)}
                                            disabled={uploading}
                                            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {uploading ? 'Saving...' : <><Save size={16} /> Save</>}
                                        </button>
                                        <button
                                            onClick={() => setEditingStaffRole(null)}
                                            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : staffMember ? (
                                <>
                                    <div className="h-48 w-full relative group">
                                        <div className="absolute inset-0 bg-[#151515] flex items-center justify-center overflow-hidden">
                                            {staffMember.image ? (
                                                <img src={staffMember.image} alt={staffMember.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <User className="w-16 h-16 text-gray-700" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent opacity-80" />
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button onClick={() => handleStaffEditClick(role, staffMember)} className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-violet-500 transition-colors">
                                                <Upload size={14} />
                                            </button>
                                            <button onClick={() => handleRemove(team.roster.indexOf(staffMember))} className="p-2 bg-black/60 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 relative -mt-12 z-10 text-center flex-1 flex flex-col justify-end">
                                        <h3 className="text-2xl font-black text-white mb-0.5 uppercase tracking-tight">{staffMember.name}</h3>
                                        {/* Display Experience and Age instead of IGN */}
                                        <div className="text-xs text-gray-500 font-mono mb-2">
                                            {staffMember.experience && <span>Exp: {staffMember.experience}</span>}
                                            {staffMember.experience && staffMember.age && <span className="mx-2">|</span>}
                                            {staffMember.age && <span>Age: {staffMember.age}</span>}
                                        </div>

                                        <div className="inline-block px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
                                            {staffMember.role}
                                        </div>

                                        {/* Removed UID section in display since it's replaced */}
                                        <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-4 w-full text-xs">
                                            <div className="text-center p-2 rounded bg-white/5">
                                                <div className="text-gray-500 uppercase font-bold text-[10px]">Social</div>
                                                <div className="text-white truncate">{staffMember.socialLinks?.instagram ? 'Insta' : '-'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Empty Staff Slot
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => handleStaffEditClick(role)}>
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-4 group-hover:border-violet-500 group-hover:text-violet-500 text-gray-700 transition-colors">
                                        <Plus size={24} />
                                    </div>
                                    <h3 className="text-gray-500 font-bold group-hover:text-gray-300">Empty {role} Slot</h3>
                                    <p className="text-xs text-gray-600 mt-1">Click to add {role}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SupportStaff;
