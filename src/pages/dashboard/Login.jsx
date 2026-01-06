import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardUsers } from '../../data/dashboardData';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('patronum_user');
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const user = dashboardUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
            localStorage.setItem('patronum_user', JSON.stringify(user));
            navigate('/dashboard');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative z-20 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/10 z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-purple-500/20 p-8 rounded-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-600 mb-2">
                        Patronum Esports
                    </h1>
                    <p className="text-slate-400">Dashboard Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="teamname@patronum.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
                    >
                        Enter Dashboard
                    </button>
                </form>

      
            </motion.div>
        </div>
    );
};

export default Login;
