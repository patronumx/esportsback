import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeamCardImage from '../../assets/pubgm_team.jpg';
import PlayerCardImage from '../../assets/pubgm_player.jpg';
import TeamLogo from '../../assets/TEAM.png';

const PUBGMobile = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-sans selection:bg-violet-500/30 text-white">
            {/* Transparent background handled by parent or layout */}

            <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 flex flex-col items-center justify-center min-h-screen">

                <motion.div
                    className="text-center mb-8 md:mb-12 max-w-4xl w-full"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tight leading-tight whitespace-nowrap">
                        PUBG MOBILE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">ESPORTS</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                        Select your role in the battlegrounds lead your squad to victory
                    </motion.p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-6 w-full max-w-4xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Team Card */}
                    <motion.div
                        variants={itemVariants}
                        className="group relative h-[340px] md:h-[380px] rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 shadow-2xl backdrop-blur-sm"
                    >
                        {/* Background Image with Transparency */}
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: `url(${TeamCardImage})` }}>
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />
                        </div>

                        {/* Overlay Content */}
                        <div className="absolute inset-0 p-4 md:p-5 flex flex-col items-center justify-between z-10">
                            {/* Circular Logo - Limit Size */}
                            <div className="mt-12 w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/20 shadow-[0_0_30px_rgba(139,92,246,0.3)] bg-black/30 backdrop-blur-md flex items-center justify-center p-2 overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:border-violet-500/50">
                                <img src={TeamLogo} alt="Team Logo" className="w-full h-full object-cover rounded-full" />
                            </div>

                            <div className="flex flex-col items-center text-center w-full mb-1">
                                <h2 className="text-xl md:text-2xl font-bold mb-1 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Sign in as Team</h2>
                                <p className="text-slate-200 mb-4 font-light text-xs md:text-sm max-w-xs leading-relaxed">
                                    Manage your organization, roster, and brand presence.
                                </p>

                                <div className="flex gap-3 w-full max-w-[240px]">
                                    <Link to="/team/login" className="flex-1 py-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white hover:text-blue-900 font-bold tracking-wide transition-all duration-300 text-center shadow-lg hover:shadow-blue-500/30 text-xs md:text-sm">
                                        Login
                                    </Link>
                                    <Link to="/talent/team/signup" className="flex-1 py-2 rounded-xl bg-violet-600/90 hover:bg-violet-500 text-white font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-violet-500/50 text-center backdrop-blur-sm border border-transparent text-xs md:text-sm">
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Player Card */}
                    <motion.div
                        variants={itemVariants}
                        className="group relative h-[340px] md:h-[380px] rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 shadow-2xl backdrop-blur-sm"
                    >
                        {/* Background Image with Transparency */}
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: `url(${PlayerCardImage})` }}>
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />
                        </div>

                        {/* Overlay Content */}
                        <div className="absolute inset-0 p-4 md:p-5 flex flex-col items-center justify-between z-10">
                            {/* Circular Logo - Limit Size */}
                            <div className="mt-12 w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/20 shadow-[0_0_30px_rgba(232,121,249,0.3)] bg-black/30 backdrop-blur-md flex items-center justify-center p-2 overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:border-fuchsia-500/50">
                                <img src={TeamLogo} alt="Player Logo" className="w-full h-full object-cover rounded-full" />
                            </div>

                            <div className="flex flex-col items-center text-center w-full mb-1">
                                <h2 className="text-xl md:text-2xl font-bold mb-1 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Sign in as Player</h2>
                                <p className="text-slate-200 mb-4 font-light text-xs md:text-sm max-w-xs leading-relaxed">
                                    Build your legacy. Showcase your stats.
                                </p>

                                <div className="flex gap-3 w-full max-w-[240px]">
                                    <Link to="/talent/player/login" className="flex-1 py-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white hover:text-fuchsia-900 font-bold tracking-wide transition-all duration-300 text-center shadow-lg hover:shadow-fuchsia-500/30 text-xs md:text-sm">
                                        Login
                                    </Link>
                                    <Link to="/talent/player/signup" className="flex-1 py-2 rounded-xl bg-fuchsia-600/90 hover:bg-fuchsia-500 text-white font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/50 text-center backdrop-blur-sm border border-transparent text-xs md:text-sm">
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default PUBGMobile;
