import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, Loader } from 'lucide-react';

const TeamLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, 'team');
            navigate('/team/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background handled by PublicLayout */}

            <Link to="/login" className="absolute top-24 left-8 text-gray-400 hover:text-white flex items-center transition-colors z-20">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back lo Selection
            </Link>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 border border-emerald-500/20">
                            <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Team Portal</h2>
                        <p className="text-gray-400 mt-2">Access your team dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 text-sm border border-red-500/20 flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-xl bg-black/50 text-white border border-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                                placeholder="team@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl bg-black/50 text-white border border-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-lg shadow-emerald-600/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamLogin;
