import React from 'react';
import PageHeader from '../../components/PageHeader';
import SectionCard from '../../components/SectionCard';
import NewsletterSignup from '../../components/NewsletterSignup';

const PGC2025 = () => {
  return (
    <div>
      <PageHeader
        eyebrow="PUBG Global Championship"
        title="PGC 2025"
        subtitle="Elite PC esports competition. The world's best PUBG teams battle for supremacy in tactical gameplay and strategic excellence."
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        {/* Event Overview */}
        <SectionCard eyebrow="Tournament Overview" title="PC Battle Royale at its Finest">
          <p>
            The PUBG Global Championship (PGC) represents the highest level of competitive PUBG on PC. Teams from across the world compete in intense tactical battles that test strategy, coordination, and mechanical skill.
          </p>
          <p>
            As part of our expansion into PC esports, Patronum Esports is preparing to compete at PGC 2025, demonstrating our versatility and commitment to excellence across multiple platforms.
          </p>
        </SectionCard>

        {/* Event Details */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 hover:border-emerald-500/60 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold">Event Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Tournament</p>
                <p className="text-lg font-semibold">PGC 2025 Championship</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Dates</p>
                <p className="text-lg font-semibold">TBA 2025</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Platform</p>
                <p className="text-lg font-semibold">PC - Steam</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Prize Pool</p>
                <p className="text-lg font-semibold text-emerald-300">$2,000,000+</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl p-8 border border-teal-500/30 hover:border-teal-500/60 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold">Competition Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Regions</p>
                <p className="text-lg font-semibold">Global - All Regions</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Teams</p>
                <p className="text-lg font-semibold">32 Top Teams</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Format</p>
                <p className="text-lg font-semibold">Group Stage + Finals</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Map Pool</p>
                <p className="text-lg font-semibold">Erangel, Miramar, Vikendi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why PGC Matters */}
        <div className="mt-16">
          <SectionCard eyebrow="Strategic Depth" title="The Ultimate Test of Skill">
            <p>
              PGC on PC requires a different skill set compared to mobile esports. The precision of mouse and keyboard controls, larger maps, and more complex ballistics create a highly tactical environment where every decision matters.
            </p>
            <p>
              Success at PGC demands perfect communication, deep game knowledge, and the ability to adapt strategies on the fly. Teams must balance aggressive plays for eliminations with smart rotations and zone positioning.
            </p>
          </SectionCard>
        </div>

        {/* Key Differences */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-brand-card to-brand-card/40 border border-emerald-500/20 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 mb-4">
                PC ESPORTS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes PGC Unique</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Understanding the elevated competitive landscape of PC battle royale
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-brand-bg/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">Precision Gameplay</h3>
                <p className="text-sm text-slate-400">
                  Mouse and keyboard controls enable pixel-perfect aim and advanced movement techniques that define professional PC play.
                </p>
              </div>

              <div className="bg-brand-bg/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20">
                <div className="text-3xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold mb-3">Complex Rotations</h3>
                <p className="text-sm text-slate-400">
                  Larger maps and vehicle dynamics create intricate rotation strategies and zone control battles unique to PC PUBG.
                </p>
              </div>

              <div className="bg-brand-bg/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3">High-Speed Combat</h3>
                <p className="text-sm text-slate-400">
                  Faster paced gunfights with advanced recoil control and spray patterns that separate elite players from the rest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our PC Division */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-teal-600/20 text-teal-400 border border-teal-600/30 mb-4">
              TEAM EXPANSION
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Building Our PC Legacy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Patronum Esports is investing in top PC talent to compete at the highest level
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🎮</span>
                  Roster Development
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">▸</span>
                    <span>Recruiting experienced PC players with proven tournament results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">▸</span>
                    <span>Building synergy through intensive bootcamp training</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">▸</span>
                    <span>Developing team-specific strategies for different map scenarios</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">▸</span>
                    <span>Partnering with veteran coaches from successful PGC teams</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Competition Path
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 mt-1">▸</span>
                    <span>Competing in regional qualifiers and ladder tournaments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 mt-1">▸</span>
                    <span>Earning Pro Circuit points through consistent placements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 mt-1">▸</span>
                    <span>Analyzing international teams' gameplay and meta strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-400 mt-1">▸</span>
                    <span>Setting qualification for PGC 2025 as our primary objective</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Format */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <SectionCard eyebrow="Competition Structure" title="How PGC Works">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-emerald-300 mb-2">Weekly Survival</h4>
                <p className="text-slate-400">
                  Teams compete in weekly matches throughout the season. Consistent performance is crucial as points accumulate over time, separating consistent teams from one-hit wonders.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-emerald-300 mb-2">Grand Finals</h4>
                <p className="text-slate-400">
                  Top-performing teams from weekly matches advance to the Grand Finals where stakes are highest. Multiple days of intense competition determine the world champion.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-emerald-300 mb-2">Point System</h4>
                <p className="text-slate-400">
                  Placement points combined with kill points reward both survival and aggressive play. The best teams master the balance between fighting and positioning.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Follow the Journey */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30 mb-4">
              STAY UPDATED
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow Our PGC Journey</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Track our progress as we compete for a spot at PGC 2025
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Live Standings</h3>
              <p className="text-sm text-slate-400 mb-6">
                Check real-time leaderboards and qualification standings
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
                View Standings
              </button>
            </div>

            <div className="bg-gradient-to-br from-teal-900/20 to-emerald-900/20 border border-teal-500/30 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-3">Match Replays</h3>
              <p className="text-sm text-slate-400 mb-6">
                Watch VODs, highlights, and analysis of our matches
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:-translate-y-1">
                Watch Replays
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 pt-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

export default PGC2025;
