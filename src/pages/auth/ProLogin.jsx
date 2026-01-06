import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Loader, ArrowRight, ShieldCheck } from 'lucide-react';
import { showToast } from '../../utils/toast';

const ProLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password, 'team');

            if (!user.isPro) {
                showToast.error("Access Denied: Private Pro Team Area Only");
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 1500); // Wait for toast to be read
                setLoading(false);
                return;
            }

            navigate('/pro/dashboard');
        } catch (err) {
            console.error('Pro Login Error:', err);
            setError('Invalid Pro Team credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    {/* Glow Effect */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/10 group-hover:shadow-purple-500/20 transition-all duration-500">
                            <Crown className="w-10 h-10 text-yellow-400 drop-shadow-md" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight text-center">
                            Pro Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Portal</span>
                        </h2>
                        <p className="text-gray-500 mt-3 text-center text-sm font-medium flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Organizations Only
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Official Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder-gray-700"
                                placeholder="team@organization.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Secure Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder-gray-700"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-xl transition-all font-bold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 mt-4"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Access Pro Dashboard <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-600">
                            Restricted Area. Unauthorized access is monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProLogin;
