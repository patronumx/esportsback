import { useState } from 'react';
import { Search, Map, Trophy } from 'lucide-react';
import { EVENTS } from '../../../data/pmgcDrops';

const TeamDrops = () => {
    const [events] = useState(EVENTS);
    const [activeEventId, setActiveEventId] = useState(EVENTS[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const activeEvent = events.find(e => e.id === activeEventId) || events[0];

    const filteredTeams = activeEvent.teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.erangel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.miramar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.rondo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter Logic Enhanced for multi-word search? No, keep simple.

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Map className="w-8 h-8 text-purple-500" />
                        Pro Teams Drop Spots
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Comprehensive record of team drop locations across all maps.
                    </p>
                </div>
            </div>

            {/* Event Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-900/40 to-black/40 backdrop-blur-sm p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-end justify-between">
                    <div>
                        <h2 className="text-4xl font-extrabold text-white mb-2">{activeEvent.title}</h2>
                        {activeEvent.subtitle && <p className="text-xl text-gray-300 font-light">{activeEvent.subtitle}</p>}
                    </div>
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search teams or locations..."
                            className="bg-black/40 border border-white/10 text-white text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-3 placeholder-gray-500 transition-all hover:bg-black/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#09090b]/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">Erangel</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-yellow-500 uppercase tracking-wider">Miramar</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">Rondo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTeams.length > 0 ? (
                                    filteredTeams.map((team, index) => (
                                        <tr
                                            key={team.id}
                                            className="hover:bg-white/[0.02] transition-colors group cursor-default"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 relative">
                                                        <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <img
                                                            className="h-10 w-10 rounded-full object-contain relative z-10"
                                                            src={team.logo}
                                                            alt={team.name}
                                                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + team.name.replace(' ', '+') + '&background=random'; }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                                                            {team.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-700/30">
                                                    {team.erangel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-500 border border-yellow-700/30">
                                                    {team.miramar}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-400 border border-cyan-700/30">
                                                    {team.rondo}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            No teams found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-600 pt-4">
                Data is static and curated.
            </div>
        </div>
    );
};

export default TeamDrops;
