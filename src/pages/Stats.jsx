import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import IQImage from '../assets/GROUP STAGE/GROUP GREEN/Inner Circle Esports/PLAYERS/IQ.png';
import portalImage from '../assets/portal.jpg';

const topFraggers = [
    { rank: 1, name: 'IQ', kd: 0.90, elims: 118, damage: '29,009' },
    { rank: 2, name: 'FALAK', kd: 1.17, elims: 104 },
    { rank: 3, name: 'UZM', kd: 0.75, elims: 81 },
    { rank: 4, name: 'BLADE', kd: 1.03, elims: 74 },
    { rank: 5, name: 'T24', kd: 1.20, elims: 65 },
    { rank: 6, name: 'NOCKI', kd: 0.86, elims: 57 },
    { rank: 7, name: 'GHOOST', kd: 0.98, elims: 54 },
    { rank: 8, name: 'AALIYAN', kd: 0.71, elims: 17 },
    { rank: 9, name: 'GOKUBOT', kd: 0.38, elims: 9 },
    { rank: 10, name: 'DIVINE', kd: 0.25, elims: 6 },
];

const Stats = () => {
    const topPlayer = topFraggers[0];

    return (
        <div className="min-h-screen bg-black selection:bg-orange-500 selection:text-white">

            {/* Standard Page Header */}
            <PageHeader
                image={portalImage}
                eyebrow="Caster | Stats Analysis"
                title="Gaming Portal YT"
                subtitle="Muhammad Abubakar • 20k+ YouTube • 1M+ TikTok Likes • Covering PMGC, EWC, PMSL, PMPL, PMNC, PMCC"
            />

            {/* Stats Dashboard Section (Pushed down by PageHeader) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 relative z-10 mt-8">
                {/* Dashboard Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 relative inline-block">
                        <span className="relative z-10 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                            TOP FRAGGERS
                        </span>
                    </h2>

                    <div className="flex justify-center items-center mt-6">
                        <div className="relative inline-flex items-center group">
                            <div className="absolute inset-0 bg-orange-600 blur opacity-40 transform skew-x-12 transition-opacity group-hover:opacity-60"></div>
                            <div className="relative flex items-center bg-gradient-to-r from-neutral-900/90 to-black/90 backdrop-blur-md border border-orange-500/30 text-white text-lg font-bold px-10 py-2 transform -skew-x-12 shadow-2xl">
                                <span className="block transform skew-x-12 tracking-[0.2em] text-orange-100">PMGC 2022-2025 ( PAKISTAN )</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid - Using h-full consistency */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[600px]">

                    {/* LEFT COLUMN: Featured Player (#1) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative h-full rounded-2xl overflow-hidden border border-white/5 flex flex-col"
                    >

                        {/* Rank Badge */}
                        <div className="absolute top-6 left-6 w-14 h-14 bg-white rounded flex items-center justify-center shadow-[0_0_20px_rgba(255,165,0,0.4)] border-2 border-orange-500 z-30 transform -rotate-6">
                            <span className="text-3xl font-black text-orange-600">#1</span>
                        </div>

                        {/* Player Image Area */}
                        <div className="relative flex-grow flex items-end justify-center z-10 pt-12 overflow-hidden pb-0">
                            <motion.img
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                src={IQImage}
                                alt={topPlayer.name}
                                className="h-[80%] w-auto object-contain object-bottom drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                                style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
                            />
                        </div>

                        {/* Player Info Footer */}
                        <div className="relative z-20 pb-8 px-8 mt-auto">
                            <h2 className="text-7xl font-black uppercase mb-4 text-white tracking-tighter leading-none"
                                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                                {topPlayer.name}
                            </h2>
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div>
                                    <div className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">Elims</div>
                                    <div className="text-white text-3xl font-black">{topPlayer.elims}</div>
                                </div>
                                <div>
                                    <div className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">KD</div>
                                    <div className="text-white text-3xl font-black">{topPlayer.kd}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Damage</div>
                                    <div className="text-orange-200 text-xl font-mono">{topPlayer.damage}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Leaderboard Table */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col"
                    >
                        <div className="grid grid-cols-12 bg-white/5 p-5 border-b border-white/10 text-orange-500/90 font-black uppercase text-xs tracking-[0.2em] flex-shrink-0">
                            <div className="col-span-2 text-center">Rank</div>
                            <div className="col-span-6 pl-4">Player</div>
                            <div className="col-span-2 text-center">KD</div>
                            <div className="col-span-2 text-center">Elims</div>
                        </div>

                        <div className="flex-grow flex flex-col divide-y divide-white/5 overflow-y-auto custom-scrollbar">
                            {topFraggers.map((player, index) => (
                                <motion.div
                                    key={player.rank}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                    className="grid grid-cols-12 items-center px-6 text-base font-medium transition-colors cursor-default flex-grow min-h-[60px]"
                                >
                                    <div className="col-span-2 text-center">
                                        <span className={`font-black italic ${index === 0 ? 'text-orange-500 text-2xl' : 'text-gray-600 text-xl'}`}>
                                            {player.rank}
                                        </span>
                                    </div>

                                    <div className="col-span-6 pl-4 uppercase tracking-snug text-gray-100 flex items-center gap-4">
                                        {index < 3 && (
                                            <span className={`text-xs ${index === 0 ? 'text-orange-500' : 'text-yellow-600'}`}>★</span>
                                        )}
                                        <span className={`${index === 0 ? 'text-white font-black text-xl tracking-wider' : 'tracking-wide text-gray-300'}`}>
                                            {player.name}
                                        </span>
                                    </div>

                                    <div className="col-span-2 text-center text-gray-500 font-mono text-sm">
                                        {player.kd}
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className={`px-2.5 py-1 rounded text-sm font-bold min-w-[45px] inline-block text-center ${index === 0 ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' :
                                            'bg-white/5 text-gray-400'
                                            }`}>
                                            {player.elims}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                 .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 165, 0, 0.2);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default Stats;
