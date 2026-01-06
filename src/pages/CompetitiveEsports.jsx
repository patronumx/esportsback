import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import PlayerCard from '../components/PlayerCard';
import TournamentBracket from '../components/TournamentBracket';
import NewsletterSignup from '../components/NewsletterSignup';
import { players } from '../data/players';
import { tournaments } from '../data/tournaments';

const CompetitiveEsports = () => {
  const [tab, setTab] = useState('overview');

  const matches = [
    { id: 1, teams: 'Patronum vs AlphaX', status: 'LIVE', mode: 'PMGC Quals • Erangel', time: 'Now' },
    { id: 2, teams: 'Patronum vs Nova', status: 'Upcoming', mode: 'Scrim • Miramar', time: 'Tonight' },
    { id: 3, teams: 'Patronum vs Falcons', status: 'VOD', mode: 'EWC Set • Riyadh', time: 'Replay' },
  ];

  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMatchIndex((prev) => (prev + 1) % matches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [matches.length]);

  const activeMatch = matches[activeMatchIndex];

  return (
    <div>
      <PageHeader
        eyebrow="Competitive Esports"
        title="Built for the global stage."
        subtitle="Patronum Esports represents elite talent in PMGC, PGC, and PDC 2025 with systems designed around discipline, review, and resilience."
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20 space-y-12">
        <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'live', label: 'Live Tracker' },
            { id: 'prep', label: 'Prep Week' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-all ${
                tab === t.id
                  ? 'bg-violet-600 border-violet-300 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-brand-card border-violet-500/30 text-slate-300 hover:border-violet-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-10">
            <SectionCard eyebrow="Global Tournaments" title="From EWC Riyadh to PMGC and beyond.">
              <p>
                Every tournament chapter is part of a long-term story. EWC 2025 is a closed chapter. PMGC is the next
                one: a chance to show what Patronum stands for on the biggest stage.
              </p>
              <p>
                Rosters are selected not just on mechanics but on mindset, communication, clutch decision-making, and
                the ability to adapt under pressure.
              </p>
            </SectionCard>

            <SectionCard eyebrow="Systems" title="Performance, review, and structure.">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-violet-300 mt-1">▸</span>
                  <span>Structured scrim schedules with clear goals per block.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-300 mt-1">▸</span>
                  <span>VOD review with role-based breakdowns and decision trees.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-300 mt-1">▸</span>
                  <span>Analytics on rotations, fights, and endgame consistency.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-300 mt-1">▸</span>
                  <span>Mental performance and burnout prevention built into season planning.</span>
                </li>
              </ul>
            </SectionCard>
          </div>
        )}

        {tab === 'live' && (
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div className="bg-gradient-to-br from-brand-card to-brand-card/40 border border-violet-500/30 rounded-3xl p-8 md:p-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-violet-300 mb-1">LIVE TRACKER</p>
                  <h3 className="text-2xl font-bold">Match rotation</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-300">Simulated</span>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-slate-200 font-semibold">{activeMatch.teams}</p>
                <p className="text-xs text-slate-400">
                  {activeMatch.mode} • <span className="text-violet-300">{activeMatch.time}</span>
                </p>
              </div>
              <div className="space-y-3 mb-6">
                {matches.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs md:text-sm transition-all ${
                      idx === activeMatchIndex
                        ? 'bg-violet-600/20 border-violet-300 text-slate-100'
                        : 'bg-brand-bg border-violet-500/30 text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{m.teams}</p>
                      <p className="text-[11px] text-slate-400">{m.mode}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.status === 'LIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : m.status === 'Upcoming'
                            ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-400/40'
                            : 'bg-slate-500/10 text-slate-300 border border-slate-400/40'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                All data here is mock — built to show how a live board would feel.
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-900/40 to-brand-card border border-violet-500/40 rounded-3xl p-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-violet-300">KEY FOCUS</p>
              <p className="text-sm text-slate-200">
                Live tracking focuses on patterns: how we fight, when we rotate, and how we close out winning positions.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• Early-game landing consistency</li>
                <li>• Mid-game fight win rate</li>
                <li>• Endgame conversion from Top 5 to chicken dinner</li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'prep' && (
          <div className="grid md:grid-cols-2 gap-10">
            <SectionCard eyebrow="Scrim Blocks" title="How a prep week is structured.">
              <ul className="space-y-3">
                <li>Day 1–2: Macro testing, new rotations, and safe defaults.</li>
                <li>Day 3: Controlled high-intensity fights, focus on comms.</li>
                <li>Day 4: Tournament-sim blocks with strict rules.</li>
                <li>Day 5: VOD marathons, decision-tree reviews, and resets.</li>
              </ul>
            </SectionCard>
            <SectionCard eyebrow="Roles" title="Everyone knows their job.">
              <ul className="space-y-3 text-sm">
                <li>IGL: Macro calls, tempo, and round identity.</li>
                <li>Entry: First contact, info, and trade setups.</li>
                <li>Support: Utility, anchors, and clutch stabilization.</li>
                <li>Analyst: Reviews, tags, and matchup preparation.</li>
              </ul>
            </SectionCard>
          </div>
        )}

        {/* Player Roster Section */}
        <div className="pt-12 mt-12 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30 mb-4">
              MAIN ROSTER
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet The Champions</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Elite players representing Patronum Esports on the world stage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player, idx) => (
              <PlayerCard key={player.id} player={player} featured={idx === 0} />
            ))}
          </div>
        </div>

        {/* Tournament Schedule */}
        <div className="pt-12 mt-12 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
              TOURNAMENTS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Competition Schedule</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Upcoming and past tournament performances
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Upcoming Tournaments */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Upcoming Tournaments
              </h3>
              <div className="space-y-4">
                {tournaments.upcoming.map((tournament, idx) => (
                  <div
                    key={idx}
                    className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-violet-500/20 hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-100 mb-1">{tournament.name}</h4>
                        <p className="text-sm text-violet-400">{tournament.date}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
                        {tournament.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 text-xs">Location</div>
                        <div className="text-slate-300">{tournament.location}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Prize Pool</div>
                        <div className="text-slate-300 font-semibold">{tournament.prize}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Teams</div>
                        <div className="text-slate-300">{tournament.teams}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Format</div>
                        <div className="text-slate-300">{tournament.format}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Results */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Recent Results
              </h3>
              <div className="space-y-4">
                {tournaments.past.map((tournament, idx) => (
                  <div
                    key={idx}
                    className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-100 mb-1">{tournament.name}</h4>
                        <p className="text-sm text-slate-400">{tournament.date}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        tournament.placement.includes('1st')
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50'
                          : tournament.placement.includes('3rd')
                          ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                          : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                      }`}>
                        {tournament.placement}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-slate-500 mb-1">Earnings</div>
                      <div className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                        {tournament.earned}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800/50">
                      <div className="text-center">
                        <div className="text-lg font-bold text-violet-400">{tournament.stats.wins}</div>
                        <div className="text-xs text-slate-500">Wins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">{tournament.stats.losses}</div>
                        <div className="text-xs text-slate-500">Losses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-violet-400">{tournament.stats.winRate}</div>
                        <div className="text-xs text-slate-500">Win %</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">{tournament.stats.totalKills}</div>
                        <div className="text-xs text-slate-500">Kills</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Bracket */}
        <div className="pt-12 mt-12 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30 mb-4">
              LATEST CHAMPIONSHIP
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PDC 2025 Winter Regional Bracket</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our championship run through the regional qualifiers
            </p>
          </div>
          <TournamentBracket bracket={tournaments.bracket} />
        </div>

        {/* Newsletter CTA */}
        <div className="pt-12 mt-12">
          <NewsletterSignup compact={false} />
        </div>
      </div>
    </div>
  );
};

export default CompetitiveEsports;
