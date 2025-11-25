const TournamentBracket = ({ bracket }) => {
  return (
    <div className="overflow-x-auto pb-6">
      <div className="inline-flex gap-8 min-w-full">
        {bracket.rounds.map((round, roundIdx) => (
          <div key={roundIdx} className="flex flex-col justify-around min-w-[280px] space-y-8">
            {/* Round Title */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {round.name}
              </h3>
              <p className="text-xs text-slate-500">{round.date}</p>
            </div>

            {/* Matches */}
            <div className="space-y-8">
              {round.matches.map((match, matchIdx) => (
                <div key={matchIdx} className="relative">
                  <div className="bg-brand-card backdrop-blur-xl rounded-lg border border-slate-800/50 overflow-hidden hover:border-violet-500/50 transition-all duration-300">
                    {/* Team 1 */}
                    <div className={`px-4 py-3 flex items-center justify-between ${
                      match.winner === match.team1.name ? 'bg-violet-600/10' : ''
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {match.team1.seed}
                        </div>
                        <span className={`font-medium ${
                          match.winner === match.team1.name ? 'text-violet-400' : 'text-slate-300'
                        }`}>
                          {match.team1.name}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${
                        match.winner === match.team1.name ? 'text-violet-400' : 'text-slate-500'
                      }`}>
                        {match.team1.score !== undefined ? match.team1.score : '-'}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-800/50" />

                    {/* Team 2 */}
                    <div className={`px-4 py-3 flex items-center justify-between ${
                      match.winner === match.team2.name ? 'bg-violet-600/10' : ''
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {match.team2.seed}
                        </div>
                        <span className={`font-medium ${
                          match.winner === match.team2.name ? 'text-violet-400' : 'text-slate-300'
                        }`}>
                          {match.team2.name}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${
                        match.winner === match.team2.name ? 'text-violet-400' : 'text-slate-500'
                      }`}>
                        {match.team2.score !== undefined ? match.team2.score : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Match Status/Time */}
                  {match.status && (
                    <div className="mt-2 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        match.status === 'LIVE'
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 animate-pulse'
                          : match.status === 'Completed'
                          ? 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                          : 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                  )}

                  {/* Connector Line (except last round) */}
                  {roundIdx < bracket.rounds.length - 1 && (
                    <div className="absolute top-1/2 -right-8 w-8 h-px bg-slate-800/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
