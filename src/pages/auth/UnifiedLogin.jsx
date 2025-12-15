import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Users, ArrowLeft, Loader } from 'lucide-react';

const UnifiedLogin = ({ type }) => {
    // type: 'team' | 'admin'
    const isTeam = type === 'team';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = isTeam ? {
        color: 'emerald',
        icon: Users,
        title: 'Team Portal',
        subtitle: 'Access your team dashboard',
        redirect: '/team/dashboard',
        role: 'team'
    } : {
        color: 'blue',
        icon: Shield,
        title: 'Admin Portal',
        subtitle: 'Sign in to manage the platform',
        redirect: '/sys-admin-secret-login/dashboard',
        role: 'admin'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, theme.role);
            navigate(theme.redirect);
        } catch (err) {
            console.error('Login Component Error:', err);
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic classes based on color
    const getColorClasses = () => {
        if (isTeam) {
            return {
                bg: 'bg-emerald-900/30',
                text: 'text-emerald-400',
                border: 'border-emerald-500/20',
                focus: 'focus:border-emerald-500',
                btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
                bgEffect: 'bg-emerald-600/10'
            };
        }
        return {
            bg: 'bg-blue-900/30',
            text: 'text-blue-400',
            border: 'border-blue-500/20',
            focus: 'focus:border-blue-500',
            btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
            bgEffect: 'bg-blue-600/10'
        };
    };

    const styles = getColorClasses();
    const Icon = theme.icon;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background handled by PublicLayout */}

            <Link
                to={isTeam ? "/talent/pubg-mobile" : "/login"}
                className="absolute top-24 left-8 text-gray-400 hover:text-white flex items-center transition-colors z-20"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Selection
            </Link>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className={`w-16 h-16 ${styles.bg} rounded-2xl flex items-center justify-center mb-4 ${styles.text} border ${styles.border}`}>
                            <Icon className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">{theme.title}</h2>
                        <p className="text-gray-400 mt-2">{theme.subtitle}</p>
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
                                className={`w-full p-3 rounded-xl bg-black/50 text-white border border-zinc-700 focus:outline-none ${styles.focus} transition-colors placeholder-gray-600`}
                                placeholder={`${isTeam ? 'team' : 'admin'}@example.com`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full p-3 rounded-xl bg-black/50 text-white border border-zinc-700 focus:outline-none ${styles.focus} transition-colors placeholder-gray-600`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${styles.btn} text-white p-3 rounded-xl transition-all font-medium shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2`}
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UnifiedLogin;
