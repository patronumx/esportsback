const AchievementTimeline = ({ achievements }) => {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-600 via-purple-600 to-transparent" />

      {/* Timeline Items */}
      <div className="space-y-8">
        {achievements.map((achievement, index) => (
          <div key={index} className="relative flex gap-6 group">
            {/* Timeline Dot */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/50 group-hover:shadow-2xl group-hover:shadow-violet-500/70 transition-all duration-300 group-hover:scale-110">
                {achievement.icon}
              </div>
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-full bg-violet-600/30 animate-ping opacity-0 group-hover:opacity-100" />
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-brand-card backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 group-hover:border-violet-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-500/10 group-hover:-translate-y-1">
              {/* Date Badge */}
              <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30">
                {achievement.date}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                {achievement.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-4">
                {achievement.description}
              </p>

              {/* Tags */}
              {achievement.tags && achievement.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {achievement.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-2 py-1 text-xs rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              {achievement.stats && (
                <div className="mt-4 pt-4 border-t border-slate-800/50 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(achievement.stats).map(([key, value], statIdx) => (
                    <div key={statIdx} className="text-center">
                      <div className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        {value}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementTimeline;
