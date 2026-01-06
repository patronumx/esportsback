import { useState, useEffect } from 'react';
import client from '../../api/client';
import { Instagram, Facebook, Twitter, Link as LinkIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';

const SocialsSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [socials, setSocials] = useState({
        instagram: '',
        twitter: '',
        facebook: '',
        discord: '',
        tiktok: ''
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const res = await client.get('/team/roster'); // Roster endpoint returns full team object including socialLinks
            if (res.data && res.data.socialLinks) {
                setSocials({
                    instagram: res.data.socialLinks.instagram || '',
                    twitter: res.data.socialLinks.twitter || '',
                    facebook: res.data.socialLinks.facebook || '',
                    discord: res.data.socialLinks.discord || '',
                    tiktok: res.data.socialLinks.tiktok || ''
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSocials({ ...socials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await client.put('/team/socials', socials);
            setMessage({ type: 'success', text: 'Social links updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update links. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                    <LinkIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">Social Media Links</h1>
                    <p className="text-gray-400">Manage your team's social presence across platforms.</p>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Instagram */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <Instagram className="w-4 h-4" /> Instagram URL
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={socials.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/yourteam"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Twitter / X */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <Twitter className="w-4 h-4" /> X (Twitter) URL
                        </label>
                        <input
                            type="text"
                            name="twitter"
                            value={socials.twitter}
                            onChange={handleChange}
                            placeholder="https://x.com/yourteam"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Facebook */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <Facebook className="w-4 h-4" /> Facebook URL
                        </label>
                        <input
                            type="text"
                            name="facebook"
                            value={socials.facebook}
                            onChange={handleChange}
                            placeholder="https://facebook.com/yourteam"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Discord */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 14.18 14.18 0 0 0-.64 1.314 18.068 18.068 0 0 0-5.426 0 14.18 14.18 0 0 0-.641-1.314.077.077 0 0 0-.078-.037 19.79 19.79 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.018.077.077 0 0 0 .084-.027 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.018.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.074.074 0 0 0-.032-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                            Discord URL
                        </label>
                        <input
                            type="text"
                            name="discord"
                            value={socials.discord}
                            onChange={handleChange}
                            placeholder="https://discord.gg/yourteam"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* TikTok */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            TikTok URL
                        </label>
                        <input
                            type="text"
                            name="tiktok"
                            value={socials.tiktok}
                            onChange={handleChange}
                            placeholder="https://tiktok.com/@yourteam"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SocialsSettings;
