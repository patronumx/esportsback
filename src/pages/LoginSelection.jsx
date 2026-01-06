import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, ArrowLeft } from 'lucide-react';

const LoginSelection = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-1/3 -right-20 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl opacity-20" />
            </div>

            <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center transition-colors z-20">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
            </Link>

            <div className="relative z-10 max-w-4xl w-full text-center">
                <div className="mb-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
                        <span className="text-3xl font-bold text-white">P</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome Back</h1>
                    <p className="text-gray-400 text-lg">Select your portal to continue</p>
                </div>

                <div className="grid md:grid-cols-1 gap-6 max-w-sm mx-auto">
                    {/* Team Portal Card */}
                    <Link to="/team/login" className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 text-left">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-900/30 group-hover:text-emerald-400 transition-colors">
                                <Users className="w-6 h-6 text-gray-300 group-hover:text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Team Portal</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Manage your roster, view match schedules, check performance stats, and access media assets.
                            </p>
                            <span className="inline-flex items-center text-emerald-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Login as Team &rarr;
                            </span>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default LoginSelection;
