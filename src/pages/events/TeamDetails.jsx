import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pmgcTeams } from '../../data/pmgcTeams';

const TeamDetails = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();

    // Helper to find team across all phases
    const findTeam = (id) => {
        // Check Gauntlet
        let team = pmgcTeams.gauntlet.find(t => t.id === id);
        if (team) return team;

        // Check Group Stage Green
        team = pmgcTeams.groupStage.green.find(t => t.id === id);
        if (team) return team;

        // Check Group Stage Red
        team = pmgcTeams.groupStage.red.find(t => t.id === id);
        if (team) return team;

        // Check Last Chance
        team = pmgcTeams.lastChance.find(t => t.id === id);
        if (team) return team;

        // Check Grand Finals
        team = pmgcTeams.grandFinals.find(t => t.id === id);
        if (team) return team;

        return null;
    };

    const team = findTeam(teamId);

    if (!team) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-slate-50 font-onest">
            {/* Hero Banner Area */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                {/* Dynamic gradient based on team name hash or just a nice default */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-slate-900 to-cyan-900 opacity-80" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:flex-row items-end gap-8">
                    {/* Logo */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 shadow-2xl flex-shrink-0 mb-[-20px] relative z-10">
                        <img
                            src={team.logo}
                            alt={team.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/20 hidden">
                            {team.name.substring(0, 2)}
                        </div>
                    </div>

                    {/* Team Name & Region */}
                    <div className="mb-2 md:mb-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                                {team.region}
                            </span>
                            {team.qualifiedFrom && (
                                <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                                    {team.qualifiedFrom}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight uppercase italic leading-none">
                            {team.name}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">

                {/* Stats / Info Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-violet-500/30 transition-colors">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">World Rank</div>
                        <div className="text-3xl md:text-4xl font-bold text-slate-200">#--</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Total Earnings</div>
                        <div className="text-3xl md:text-4xl font-bold text-emerald-400">$---,---</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/30 transition-colors">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Matches Played</div>
                        <div className="text-3xl md:text-4xl font-bold text-slate-200">--</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/30 transition-colors">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Wins</div>
                        <div className="text-3xl md:text-4xl font-bold text-amber-400">--</div>
                    </div>
                </div>

                {/* Roster Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-white">Active Roster</h2>
                    </div>

                    {team.players && team.players.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {team.players.map((player, index) => (
                                <div key={index} className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2">
                                    <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950">
                                        <img
                                            src={player.image}
                                            alt={player.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        {/* Fallback for missing player image */}
                                        <div className="hidden w-full h-full items-center justify-center flex-col gap-4">
                                            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-5xl opacity-50">👤</div>
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                        {/* Player Name Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                            <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic">{player.name}</h3>
                                            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mt-1">Player</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                            <div className="text-6xl mb-4 opacity-20">👥</div>
                            <p className="text-xl text-slate-500 font-medium">Roster information not available yet.</p>
                        </div>
                    )}
                </div>

                {/* Recent Matches (Placeholder) */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-8 w-1 bg-violet-500 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-white">Recent Performance</h2>
                    </div>

                    <div className="bg-slate-900/30 rounded-3xl border border-slate-800 p-8 text-center">
                        <p className="text-slate-500">Match history data coming soon...</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeamDetails;
