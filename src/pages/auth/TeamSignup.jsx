import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const TeamSignup = () => {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const [formData, setFormData] = useState({
        teamName: '',
        ownerName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        instagram: '',
        region: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('teamName', formData.teamName);
        data.append('ownerName', formData.ownerName);
        data.append('email', formData.email);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('password', formData.password);
        data.append('instagram', formData.instagram);
        data.append('region', formData.region);
        if (logoFile) {
            data.append('logo', logoFile);
        }

        try {
            const response = await api.post('/auth/register/team', data);
            // Auto login and redirect
            if (response.data?.data?.token && response.data?.data?.user) {
                loginWithToken(response.data.data.token, response.data.data.user);
                navigate('/team/dashboard');
            } else {
                // Fallback if response structure is unexpected
                navigate('/team/login');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 font-sans selection:bg-violet-500/30 text-white">
            {/* Background handled by PublicLayout */}

            <div className="relative z-10 w-full max-w-4xl px-6">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">Team Registration</h2>
                        <p className="text-slate-400 text-sm">Register your organization and manage your roster</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Team & Owner Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-violet-300 border-b border-white/10 pb-2">Organization Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        name="teamName"
                                        value={formData.teamName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                        placeholder="Awesome Team"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Owner Name</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Team Logo (Upload)</label>
                                    <input
                                        type="file"
                                        name="logo"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500 transition-colors text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instagram Handle</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-500">@</span>
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                            placeholder="team_handle"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Region</label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600 appearance-none"
                                    >
                                        <option value="" disabled className="bg-slate-900 text-slate-400">Select Region</option>
                                        <option value="PAKISTAN" className="bg-slate-900">PAKISTAN</option>
                                        <option value="NEPAL" className="bg-slate-900">NEPAL</option>
                                        <option value="MONGOLIA" className="bg-slate-900">MONGOLIA</option>
                                        <option value="BANGLADESH" className="bg-slate-900">BANGLADESH</option>
                                        <option value="UZBEKISTAN" className="bg-slate-900">UZBEKISTAN</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact & Credentials */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-violet-300 border-b border-white/10 pb-2">Contact & Security</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Official Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                        placeholder="contact@team.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors text-white placeholder-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Register Team'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/team/login" className="text-white hover:text-violet-400 font-semibold underline">
                            Login into Dashboard
                        </Link>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default TeamSignup;
