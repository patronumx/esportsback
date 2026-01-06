const PlayerCard = ({ player, featured = false }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-2 ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* Base Background */}
      <div className="absolute inset-0 bg-brand-card" />

      {/* Dark Overlay for text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Border */}
      <div className="absolute inset-0 border border-slate-800/50 hover:border-violet-500/70 rounded-2xl transition-all duration-500" />

      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      {/* Player Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-64'} bg-gradient-to-b from-violet-900/20 to-transparent`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-violet-500/50">
            {player.initials || player.ign.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Role Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-violet-600/95 backdrop-blur-sm text-white border border-violet-400/60 shadow-lg drop-shadow-lg">
            {player.role}
          </span>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/60 drop-shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="relative p-6 space-y-4 z-10">
        <div>
          <h3
            className="text-2xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-1"
            style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)' }}
          >
            {player.ign}
          </h3>
          <p
            className="text-sm text-slate-200 font-semibold drop-shadow-md"
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)' }}
          >
            {player.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/60">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-violet-300 drop-shadow-lg">{player.stats.kd}</div>
            <div className="text-xs text-slate-300 font-semibold drop-shadow-md">K/D Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-purple-300 drop-shadow-lg">{player.stats.winRate}%</div>
            <div className="text-xs text-slate-300 font-semibold drop-shadow-md">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-violet-300 drop-shadow-lg">{player.stats.matches}</div>
            <div className="text-xs text-slate-300 font-semibold drop-shadow-md">Matches</div>
          </div>
        </div>

        {/* Achievements */}
        {player.achievements && player.achievements.length > 0 && (
          <div className="pt-4 border-t border-slate-700/60">
            <div className="text-xs font-bold text-slate-200 mb-2 drop-shadow-md">Recent Achievements</div>
            <div className="space-y-1">
              {player.achievements.slice(0, 2).map((achievement, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-100 font-medium flex items-center gap-2 drop-shadow-md"
                  style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}
                >
                  <span className="text-yellow-400 drop-shadow-lg">🏆</span>
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="flex gap-2 pt-4">
          {player.socials?.twitter && (
            <a
              href={player.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 text-xs font-bold text-center rounded-lg bg-slate-800/80 text-slate-200 hover:bg-violet-600/30 hover:text-white transition-all duration-300 border border-slate-600/80 hover:border-violet-400/80 drop-shadow-md hover:shadow-lg hover:shadow-violet-500/20"
            >
              Twitter
            </a>
          )}
          {player.socials?.instagram && (
            <a
              href={player.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 text-xs font-bold text-center rounded-lg bg-slate-800/80 text-slate-200 hover:bg-purple-600/30 hover:text-white transition-all duration-300 border border-slate-600/80 hover:border-purple-400/80 drop-shadow-md hover:shadow-lg hover:shadow-purple-500/20"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
