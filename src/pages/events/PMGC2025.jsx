import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionCard from '../../components/SectionCard';
import NewsletterSignup from '../../components/NewsletterSignup';
import { pmgcTeams } from '../../data/pmgcTeams';
import pmgcLogo from '../../assets/PMGC.png';
import aboutimg from '../../assets/aboutimg.jpeg';
import aboutimg2 from '../../assets/aboutimg2.jpeg';
import thumbvideo from '../../assets/thumbvideo.mp4';
import Media1 from '../../assets/Media1.MP4';
import Media2 from '../../assets/Media2.MP4';
import dash1 from '../../assets/dash1.png';
import dash2 from '../../assets/dash2.png';
import dash3 from '../../assets/dash3.png';
import Media3 from '../../assets/Media3.mp4';

import { Link } from "react-router-dom";

const PMGC2025 = () => {
  const [activePhase, setActivePhase] = useState('gauntlet');
  const [activeGroup, setActiveGroup] = useState('green');

  const phases = [
    { id: 'gauntlet', name: 'The Gauntlet', icon: '⚔️', color: 'cyan' },
    { id: 'group', name: 'Group Stage', icon: '🏆', color: 'purple' },
    { id: 'lastchance', name: 'Last Chance', icon: '🎯', color: 'amber' },
    { id: 'finals', name: 'Grand Finals', icon: '👑', color: 'yellow' }
  ];

  const getTeamsByPhase = () => {
    if (activePhase === 'gauntlet') return pmgcTeams.gauntlet;
    if (activePhase === 'group') {
      return activeGroup === 'green' ? pmgcTeams.groupStage.green : pmgcTeams.groupStage.red;
    }
    if (activePhase === 'lastchance') return pmgcTeams.lastChance;
    return pmgcTeams.grandFinals;
  };

  const getCardColors = () => {
    if (activePhase === 'group') {
      if (activeGroup === 'green') {
        return {
          cardBg: 'from-emerald-900/90 to-green-900/80',
          border: 'border-emerald-500/40 hover:border-emerald-400/80',
          shadow: 'hover:shadow-emerald-500/30',
          gradient: 'from-emerald-400/30 to-green-400/30',
          gradientHover: 'group-hover:from-emerald-400/50 group-hover:to-green-400/50',
          textHover: 'group-hover:text-emerald-300',
          playerText: 'text-emerald-300',
          overlay: 'from-emerald-400/0 via-emerald-400/10 to-emerald-400/0',
          logoBg: 'bg-emerald-950',
          badgeBg: 'bg-emerald-600/80',
          badgeText: 'text-emerald-100'
        };
      } else {
        return {
          cardBg: 'from-red-900/90 to-rose-900/80',
          border: 'border-red-500/40 hover:border-red-400/80',
          shadow: 'hover:shadow-red-500/30',
          gradient: 'from-red-400/30 to-rose-400/30',
          gradientHover: 'group-hover:from-red-400/50 group-hover:to-rose-400/50',
          textHover: 'group-hover:text-red-300',
          playerText: 'text-red-300',
          overlay: 'from-red-400/0 via-red-400/10 to-red-400/0',
          logoBg: 'bg-red-950',
          badgeBg: 'bg-red-600/80',
          badgeText: 'text-red-100'
        };
      }
    }

    // Last Chance amber theme
    if (activePhase === 'lastchance') {
      return {
        cardBg: 'from-amber-900/90 to-orange-900/80',
        border: 'border-amber-500/40 hover:border-amber-400/80',
        shadow: 'hover:shadow-amber-500/30',
        gradient: 'from-amber-400/30 to-orange-400/30',
        gradientHover: 'group-hover:from-amber-400/50 group-hover:to-orange-400/50',
        textHover: 'group-hover:text-amber-300',
        playerText: 'text-amber-300',
        overlay: 'from-amber-400/0 via-amber-400/10 to-amber-400/0',
        logoBg: 'bg-amber-950',
        badgeBg: 'bg-amber-600/80',
        badgeText: 'text-amber-100'
      };
    }

    // Grand Finals yellow/gold theme
    if (activePhase === 'finals') {
      return {
        cardBg: 'from-yellow-900/90 to-amber-900/80',
        border: 'border-yellow-500/40 hover:border-yellow-400/80',
        shadow: 'hover:shadow-yellow-500/30',
        gradient: 'from-yellow-400/30 to-amber-400/30',
        gradientHover: 'group-hover:from-yellow-400/50 group-hover:to-amber-400/50',
        textHover: 'group-hover:text-yellow-300',
        playerText: 'text-yellow-300',
        overlay: 'from-yellow-400/0 via-yellow-400/10 to-yellow-400/0',
        logoBg: 'bg-yellow-950',
        badgeBg: 'bg-yellow-600/80',
        badgeText: 'text-yellow-100'
      };
    }

    // Default cyan theme for Gauntlet
    return {
      cardBg: 'from-slate-900/90 to-slate-800/80',
      border: 'border-cyan-500/40 hover:border-cyan-500/80',
      shadow: 'hover:shadow-cyan-500/30',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      gradientHover: 'group-hover:from-cyan-500/40 group-hover:to-blue-500/40',
      textHover: 'group-hover:text-cyan-400',
      playerText: 'text-cyan-400',
      overlay: 'from-cyan-500/0 via-cyan-500/10 to-cyan-500/0',
      logoBg: 'bg-slate-900',
      badgeBg: 'bg-cyan-600/80',
      badgeText: 'text-cyan-100'
    };
  };

  const navigate = useNavigate();

  const handleTeamClick = (team) => {
    if (!team.isPlaceholder) {
      navigate(`/events/pmgc-2025/team/${team.id}`);
    }
  };

  const TeamCard = ({ team }) => {
    const colors = getCardColors();
    const isPlaceholder = team.isPlaceholder;

    return (
      <div
        onClick={() => handleTeamClick(team)}
        className={`group relative bg-gradient-to-br ${colors.cardBg} rounded-xl p-3 md:p-6 border ${colors.border} transition-all duration-300 ${isPlaceholder ? 'opacity-60 cursor-default' : 'cursor-pointer hover:scale-105 hover:shadow-2xl ' + colors.shadow
          }`}
      >
        {/* Qualification Badge */}
        {team.qualifiedFrom && (
          <div className={`absolute top-2 right-2 px-2 py-1 ${colors.badgeBg} ${colors.badgeText} text-[10px] font-semibold rounded-full z-10`}>
            {team.qualifiedFrom}
          </div>
        )}

        {/* Placement Badge (for Grand Finals) */}
        {team.placement && activePhase === 'finals' && (
          <div className={`absolute top-2 left-2 px-2 py-1 bg-slate-800/90 text-slate-200 text-[10px] font-semibold rounded-full z-10 border border-slate-600/50`}>
            {team.placement}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className={`relative w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${colors.gradient} p-1 ${!isPlaceholder && colors.gradientHover} transition-all`}>
            <div className={`w-full h-full rounded-full ${colors.logoBg} flex items-center justify-center overflow-hidden`}>
              {isPlaceholder ? (
                <div className={`w-full h-full flex items-center justify-center ${colors.playerText} font-bold text-2xl`}>
                  ?
                </div>
              ) : (
                <>
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-10 h-10 md:w-20 md:h-20 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className={`w-full h-full items-center justify-center ${colors.playerText} font-bold hidden`}
                    style={{ display: 'none' }}
                  >
                    {team.name.substring(0, 2)}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className={`text-sm md:text-lg font-bold ${isPlaceholder ? 'text-slate-400' : 'text-slate-50'} ${!isPlaceholder && colors.textHover} transition-colors mb-1`}>
              {team.name}
            </h3>
            {/* <p className="text-xs text-slate-400 uppercase tracking-wider">{team.region}</p> */}
            {!isPlaceholder && team.players && team.players.length > 0 && (
              <p className={`text-xs ${colors.playerText} mt-2`}>
                {team.players.length} Players
              </p>
            )}
          </div>

          {!isPlaceholder && (
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.overlay} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`} />
          )}
        </div>
      </div>
    );
  };

  const PlayerModal = ({ team, onClose }) => {
    if (!team) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl shadow-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all"
          >
            ✕
          </button>

          {/* Hero Banner Area */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            {/* Dynamic gradient based on team name hash or just a nice default */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-slate-900 to-cyan-900 opacity-80" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-end gap-6">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-4 shadow-xl flex-shrink-0 mb-[-10px]">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/20 hidden">
                  {team.name.substring(0, 2)}
                </div>
              </div>

              {/* Team Name & Region */}
              <div className="mb-1 md:mb-2">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                    {team.region}
                  </span>
                  {team.qualifiedFrom && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                      {team.qualifiedFrom}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-none">
                  {team.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8">

            {/* Stats / Info Row (Placeholder for now) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">World Rank</div>
                <div className="text-xl md:text-2xl font-bold text-slate-200">#--</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Total Earnings</div>
                <div className="text-xl md:text-2xl font-bold text-emerald-400">$---,---</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Matches Played</div>
                <div className="text-xl md:text-2xl font-bold text-slate-200">--</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Wins</div>
                <div className="text-xl md:text-2xl font-bold text-amber-400">--</div>
              </div>
            </div>

            {/* Roster Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-500 rounded-full" />
                Active Roster
              </h3>

              {team.players && team.players.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {team.players.map((player, index) => (
                    <div key={index} className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                      <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        {/* Fallback for missing player image */}
                        <div className="hidden w-full h-full items-center justify-center flex-col gap-2">
                          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl opacity-50">👤</div>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                        {/* Player Name Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-4">
                          <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{player.name}</h4>
                          <p className="text-xs text-slate-400 uppercase tracking-wider">Player</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-500">Roster information not available yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl md:text-6xl font-bold tracking-widest animate-pulse">COMING SOON</h1>
    </div>
  );


  if (false) {
    return (
      <>
        {/* PMGC hero with centered logo + heading */}
        <div className="relative pt-24 pb-20 overflow-hidden">
          {/* background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-1/3 -right-20 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl opacity-40" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-4">

            {/* Row: logo + year */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <img
                src={pmgcLogo}
                alt="PUBG MOBILE Global Championship"
                className="h-8 w-auto md:h-16 object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]"
              />
              <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-50">
                2025
              </span>
            </div>

            {/* Tagline centered under both */}
            <p className="mt-1 text-sm md:text-lg text-slate-300 text-center">
              This Is The #1 You're Looking For
            </p>

            {/* <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-slate-50 text-center mt-4">Patronum Esports — Global Esports Media & Tech Partner</h1>

          <div className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2 rounded-xl overflow-hidden border border-violet-500/30 shadow-xl shadow-violet-500/20 group h-full">
              <img
                src={aboutimg}
                alt="About Patronum Esports Landscape"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            
            <div className="md:col-span-1 rounded-xl overflow-hidden border border-violet-500/30 shadow-xl shadow-violet-500/20 group h-[200px] md:h-auto">
              <img
                src={aboutimg2}
                alt="About Patronum Esports Portrait"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div> */}
          </div>
        </div>






        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          {/* Event Overview */}
          {/* <SectionCard eyebrow="Tournament Overview" title="The Ultimate Championship">
          <p>
            The PUBG MOBILE Global Championship (PMGC) is the most prestigious tournament in PUBG MOBILE esports, bringing together the world's best teams to compete for glory and massive prize pools.
          </p>
          <p>
            Watch elite teams from around the globe battle through four intense phases: The Gauntlet, Group Stage, Last Chance, and Grand Finals - all taking place in Thailand from November 24 to December 14, 2025.
          </p>
        </SectionCard> */}


          {/* Tournament Phases */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 mb-4">
                COMPETING TEAMS
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Explore Teams by Phase</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Browse all teams competing in each phase of PMGC 2025
              </p>
            </div>

            {/* Phase Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {phases.map((phase) => {
                const getPhaseGradient = (color) => {
                  switch (color) {
                    case 'cyan': return 'from-cyan-600 to-blue-600 shadow-cyan-500/50';
                    case 'purple': return 'from-purple-600 to-pink-600 shadow-purple-500/50';
                    case 'amber': return 'from-amber-600 to-orange-600 shadow-amber-500/50';
                    case 'yellow': return 'from-yellow-600 to-amber-600 shadow-yellow-500/50';
                    default: return 'from-cyan-600 to-purple-600 shadow-cyan-500/50';
                  }
                };

                return (
                  <button
                    key={phase.id}
                    onClick={() => {
                      setActivePhase(phase.id);
                      setActiveGroup('green');
                    }}
                    className={`px-3 py-2 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${activePhase === phase.id
                      ? `bg-gradient-to-r ${getPhaseGradient(phase.color)} text-white shadow-lg`
                      : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700'
                      }`}
                  >
                    <span className="mr-2">{phase.icon}</span>
                    {phase.name}
                  </button>
                );
              })}
            </div>

            {/* Group Stage Sub-tabs */}
            {activePhase === 'group' && (
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setActiveGroup('green')}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${activeGroup === 'green'
                    ? 'bg-emerald-600/80 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                >
                  🟢 Group Green
                </button>
                <button
                  onClick={() => setActiveGroup('red')}
                  className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${activeGroup === 'red'
                    ? 'bg-red-600/80 text-white shadow-lg shadow-red-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                >
                  🔴 Group Red
                </button>
              </div>
            )}

            {/* Phase Info Panel */}
            <div className="mb-8 max-w-4xl mx-auto">
              {activePhase === 'gauntlet' && (
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⚔️</div>
                    <div>
                      <h4 className="text-lg font-bold text-cyan-300 mb-2">The Gauntlet - Opening Stage</h4>
                      <p className="text-sm text-slate-300">
                        16 teams compete in 18 intense matches over 3 days. <span className="text-emerald-400 font-semibold">Top 7 teams</span> advance directly to Grand Finals, while <span className="text-amber-400 font-semibold">8th-16th place</span> teams move to the Group Stage.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePhase === 'group' && (
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <h4 className="text-lg font-bold text-purple-300 mb-2">Group Stage - Double Groups</h4>
                      <p className="text-sm text-slate-300">
                        32 teams split into Group Green and Group Red compete in 18 matches each. <span className="text-emerald-400 font-semibold">Top 3 from each group</span> qualify for Grand Finals. <span className="text-amber-400 font-semibold">4th-11th place</span> teams advance to Last Chance. <span className="text-red-400 font-semibold">Bottom 5 teams</span> are eliminated.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePhase === 'lastchance' && (
                <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h4 className="text-lg font-bold text-amber-300 mb-2">Last Chance - Final Opportunity</h4>
                      <p className="text-sm text-slate-300">
                        16 teams (4th-11th from both Group Green and Group Red) compete in 12 matches over 2 days for their final shot at glory. Only <span className="text-emerald-400 font-semibold">the top 2 teams</span> will advance to Grand Finals. All others are eliminated.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePhase === 'finals' && (
                <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">👑</div>
                    <div>
                      <h4 className="text-lg font-bold text-yellow-300 mb-2">Grand Finals - The Ultimate Championship</h4>
                      <p className="text-sm text-slate-300">
                        16 elite teams compete for the PMGC 2025 title and $3,000,000+ prize pool. Featuring <span className="text-slate-200 font-semibold">7 teams from The Gauntlet</span>, <span className="text-slate-200 font-semibold">6 from Group Stage</span>, <span className="text-slate-200 font-semibold">2 from Last Chance</span>, and <span className="text-slate-200 font-semibold">1 Host Country Invite</span>. The Smash Rule applies on Day 3!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {getTeamsByPhase().map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>

            {/* Team Count */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Showing <span className="text-cyan-400 font-semibold">{getTeamsByPhase().length}</span> teams
                {activePhase === 'group' && (
                  <span> in <span className="font-semibold">{activeGroup === 'green' ? 'Group Green' : 'Group Red'}</span></span>
                )}
              </p>
            </div>
          </div>

          {/* Content Pipeline Section */}
          <div className="mt-10 mb-10 md:mt-16 md:mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-50 uppercase tracking-wider mb-2">
                Content Pipeline powered by Patronum Esports Dashboard
              </h2>


            </div>

            <div className="relative max-w-5xl mx-auto px-4">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-violet-900 via-cyan-900 to-violet-900 -translate-y-6 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {/* Step 1: Capture */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-900 border border-violet-500/30 group-hover:border-violet-400 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-500 flex items-center justify-center mb-4 relative bg-gradient-to-br from-slate-900 to-violet-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-8 md:h-8 text-violet-400 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {/* Arrow for mobile */}
                    <div className="md:hidden absolute -bottom-6 text-slate-600">↓</div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-violet-300 transition-colors">Capture</h3>
                  <p className="text-xs text-slate-500 text-center mt-1 px-1">High-fidelity recording</p>
                </div>

                {/* Step 2: Edit */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-900 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500 flex items-center justify-center mb-4 relative bg-gradient-to-br from-slate-900 to-cyan-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-8 md:h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {/* Arrow for mobile */}
                    <div className="md:hidden absolute -bottom-6 text-slate-600">↓</div>
                    {/* Arrow for desktop */}
                    <div className="hidden md:block absolute -right-1/2 top-1/2 -translate-y-1/2 text-slate-700 transform translate-x-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">Edit</h3>
                  <p className="text-xs text-slate-500 text-center mt-1 px-1">Pro post-production</p>
                </div>

                {/* Step 3: Deliver */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-900 border border-purple-500/30 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-500 flex items-center justify-center mb-4 relative bg-gradient-to-br from-slate-900 to-purple-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-8 md:h-8 text-purple-400 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {/* Arrow for mobile */}
                    <div className="md:hidden absolute -bottom-6 text-slate-600">↓</div>
                    {/* Arrow for desktop */}
                    <div className="hidden md:block absolute -right-1/2 top-1/2 -translate-y-1/2 text-slate-700 transform translate-x-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-purple-300 transition-colors">Deliver</h3>
                  <p className="text-xs text-slate-500 text-center mt-1 px-1">Multi-platform publish</p>
                </div>

                {/* Step 4: Analyse */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-900 border border-emerald-500/30 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500 flex items-center justify-center mb-4 relative bg-gradient-to-br from-slate-900 to-emerald-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-8 md:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {/* Arrow for mobile */}
                    <div className="md:hidden absolute -bottom-6 text-slate-600">↓</div>
                    {/* Arrow for desktop */}
                    <div className="hidden md:block absolute -right-1/2 top-1/2 -translate-y-1/2 text-slate-700 transform translate-x-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">Analyse</h3>
                  <p className="text-xs text-slate-500 text-center mt-1 px-1">Performance tracking</p>
                </div>

                {/* Step 5: Report */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-900 border border-amber-500/30 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-500 flex items-center justify-center mb-4 relative bg-gradient-to-br from-slate-900 to-amber-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-8 md:h-8 text-amber-400 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-amber-300 transition-colors">Report</h3>
                  <p className="text-xs text-slate-500 text-center mt-1 px-1">Strategy optimization</p>
                </div>
              </div>
            </div>

            {/* Dashboard Workflow & Features Section */}
            <div className="mt-16 mb-16 md:mt-24 md:mb-24 max-w-7xl mx-auto px-6">
              {/* Workflow Header */}


              {/* Workflow Steps */}


              {/* Dashboard Features Showcase */}
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-purple-500/20 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
                    Patronum Esports Dashboard — One Link. Total Clarity.
                  </h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                    We prioritize speed without sacrificing craft — assets optimized for immediate publishing
                  </p>
                </div>

                {/* Dashboard Images Display */}
                <div className="space-y-8">
                  {/* Main Dashboard View */}
                  <div className="relative group rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:border-purple-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <img
                      src={dash1}
                      alt="Dashboard Overview"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20">
                      <span className="px-3 py-1 bg-purple-600/90 text-white text-xs md:text-sm font-bold rounded-full backdrop-blur-md">
                        Content Management
                      </span>
                    </div>
                  </div>

                  {/* Secondary Views Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Analytics View */}
                    <div className="relative group rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/50 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      <img
                        src={dash2}
                        alt="Analytics Dashboard"
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20">
                        <span className="px-3 py-1 bg-cyan-600/90 text-white text-xs md:text-sm font-bold rounded-full backdrop-blur-md">
                          Real-time Analytics
                        </span>
                      </div>
                    </div>

                    {/* Content Log View */}
                    <div className="relative group rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/50 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      <img
                        src={dash3}
                        alt="Content Management"
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20">
                        <span className="px-3 py-1 bg-amber-600/90 text-white text-xs md:text-sm font-bold rounded-full backdrop-blur-md">
                          Team Overview
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-12 text-center">
                  <Link to="/login">
                    <button className="px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-300 hover:-translate-y-1 text-lg">
                      Access Demo Dashboard →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Highlight Video Section */}
            <div className="mt-16 mb-16 md:mt-24 md:mb-24 max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Portrait Video */}
                <div className="flex justify-center md:justify-end">
                  <div className="relative w-full max-w-[360px] max-h-[650px] rounded-3xl overflow-hidden border-4 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)] group bg-black">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={thumbvideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Right Column: Content */}
                <div className="text-left">
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-50 uppercase tracking-wider mb-3">
                      Highlight of EWC 2025
                    </h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" />
                  </div>

                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 group">
                      <div className="mt-1 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:border-amber-500/60 transition-all shrink-0">
                        <span className="text-amber-400 text-sm">�</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-200 group-hover:text-amber-300 transition-colors">Comprehensive Event Coverage</h4>
                        <p className="text-sm text-slate-400 mt-1">Bringing esports stories to life through expert coverage, dynamic storytelling, and real-time event insights.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="mt-1 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:border-amber-500/60 transition-all shrink-0">
                        <span className="text-amber-400 text-sm">🎤</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-200 group-hover:text-amber-300 transition-colors">Exclusive Behind-the-Scenes</h4>
                        <p className="text-sm text-slate-400 mt-1">Unprecedented access to player interviews, backstage moments, and the untold stories of the championship.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="mt-1 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:border-amber-500/60 transition-all shrink-0">
                        <span className="text-amber-400 text-sm">🌍</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-200 group-hover:text-amber-300 transition-colors">Global Media Presence</h4>
                        <p className="text-sm text-slate-400 mt-1">Connecting fans worldwide with high-quality content, professional photography, and immersive storytelling.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Core Deliverables — On-Site Capture */}
            <div className="mt-16 mb-16 md:mt-24 md:mb-24 max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-50 uppercase tracking-wider mb-3">
                  Core Deliverables — On-Site Capture
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Media 1 - Pre Match */}
                <div className="relative group rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:border-purple-500/60 transition-all duration-300 bg-black">
                  <div className="aspect-[9/16] relative overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={Media1} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Label */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-purple-400/30 backdrop-blur-sm">
                        <span className="text-white font-bold text-sm uppercase tracking-wider">Pre-Match</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media 2 - Match Highlights */}
                <div className="relative group rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:border-cyan-500/60 transition-all duration-300 bg-black">
                  <div className="aspect-[9/16] relative overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={Media2} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Label */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/30 backdrop-blur-sm">
                        <span className="text-white font-bold text-sm uppercase tracking-wider">Post-Match</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media 3 - Post Match */}
                <div className="relative group rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/60 transition-all duration-300 bg-black">
                  <div className="aspect-[9/16] relative overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={Media3} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Label */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400/30 backdrop-blur-sm">
                        <span className="text-white font-bold text-sm uppercase tracking-wider">In
                          -Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          {/* <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-8 border border-violet-500/30 hover:border-violet-500/60 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold">Event Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Tournament</p>
                <p className="text-lg font-semibold">PMGC 2025 Finals</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Dates</p>
                <p className="text-lg font-semibold">Nov 24 - Dec 14, 2025</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Location</p>
                <p className="text-lg font-semibold">Thailand 🇹🇭</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Prize Pool</p>
                <p className="text-lg font-semibold text-violet-300">$3,000,000+</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold">Qualification</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Region</p>
                <p className="text-lg font-semibold">International</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Teams</p>
                <p className="text-lg font-semibold">48 Teams Worldwide</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Competition Phases</p>
                <p className="text-lg font-semibold text-emerald-400">4 Stages</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Players</p>
                <p className="text-lg font-semibold">240+ Pro Players</p>
              </div>
            </div>
          </div>
        </div> */}


          {/* 
        Tournament Flow Visualization
        <div className="mt-20">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
              TOURNAMENT FLOW
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Qualification Path</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Follow the journey from 48 teams to the ultimate championship
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* The Gauntlet */}
          {/* <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 rounded-xl p-6 border border-cyan-500/30 text-center">
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-xl font-bold text-cyan-300 mb-2">The Gauntlet</h3>
              <div className="text-3xl font-bold text-slate-50 mb-3">16</div>
              <p className="text-sm text-slate-400 mb-4">Teams</p>
              <div className="space-y-2 text-xs">
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg py-2 px-3">
                  <span className="text-emerald-400 font-semibold">Top 7</span>
                  <div className="text-[10px] text-slate-400 mt-1">→ Grand Finals</div>
                </div>
                <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg py-2 px-3">
                  <span className="text-amber-400 font-semibold">8th-16th</span>
                  <div className="text-[10px] text-slate-400 mt-1">→ Group Stage</div>
                </div>
              </div>
            </div>

            {/* Group Stage */}
          {/* <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-purple-300 mb-2">Group Stage</h3>
              <div className="text-3xl font-bold text-slate-50 mb-3">32</div>
              <p className="text-sm text-slate-400 mb-4">Teams (2 groups of 16)</p>
              <div className="space-y-2 text-xs">
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg py-2 px-3">
                  <span className="text-emerald-400 font-semibold">Top 3 each</span>
                  <div className="text-[10px] text-slate-400 mt-1">→ Grand Finals</div>
                </div>
                <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg py-2 px-3">
                  <span className="text-amber-400 font-semibold">4th-11th each</span>
                  <div className="text-[10px] text-slate-400 mt-1">→ Last Chance</div>
                </div>
                <div className="bg-red-600/20 border border-red-500/30 rounded-lg py-2 px-3">
                  <span className="text-red-400 font-semibold">Bottom 5 each</span>
                  <div className="text-[10px] text-slate-400 mt-1">✕ Eliminated</div>
                </div>
              </div>
            </div> */}

          {/* Last Chance */}
          {/* <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 rounded-xl p-6 border border-amber-500/30 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-amber-300 mb-2">Last Chance</h3>
              <div className="text-3xl font-bold text-slate-50 mb-3">16</div>
              <p className="text-sm text-slate-400 mb-4">Teams</p>
              <div className="space-y-2 text-xs">
                <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg py-2 px-3">
                  <span className="text-emerald-400 font-semibold">Top 2</span>
                  <div className="text-[10px] text-slate-400 mt-1">→ Grand Finals</div>
                </div>
                <div className="bg-red-600/20 border border-red-500/30 rounded-lg py-2 px-3">
                  <span className="text-red-400 font-semibold">Rest</span>
                  <div className="text-[10px] text-slate-400 mt-1">✕ Eliminated</div>
                </div>
              </div>
            </div>  */}
          {/* Grand Finals
            <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 rounded-xl p-6 border border-yellow-500/30 text-center">
              <div className="text-4xl mb-3">👑</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-2">Grand Finals</h3>
              <div className="text-3xl font-bold text-slate-50 mb-3">16</div>
              <p className="text-sm text-slate-400 mb-4">Teams</p>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg py-1.5 px-2">
                  <div className="text-slate-300">7 from Gauntlet</div>
                </div>
                <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg py-1.5 px-2">
                  <div className="text-slate-300">6 from Groups</div>
                </div>
                <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg py-1.5 px-2">
                  <div className="text-slate-300">2 from Last Chance</div>
                </div>
                <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg py-1.5 px-2">
                  <div className="text-slate-300">1 Host Invitee</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}



          {/* Watch & Follow */}
          <div className="mt-12 pt-10 md:mt-20 md:pt-16 border-t border-slate-800/50">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
                STAY CONNECTED
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Watch the Action</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Don't miss a single moment of PMGC 2025. Follow the championship live.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">📺</div>
                <h3 className="text-xl font-bold mb-3">Official Stream</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Watch live on the official PUBG MOBILE Esports channels
                </p>
                <a
                  href="https://www.youtube.com/@PUBGMOBILEEsports"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                    Go to Official Stream
                  </button>
                </a>

              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-xl font-bold mb-3">Match Updates</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Get real-time updates, highlights, and behind-the-scenes content
                </p>
                <button
                  onClick={() => {
                    const footer = document.querySelector("footer");
                    footer?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  Follow Our Socials
                </button>


              </div>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 pt-16">
            <NewsletterSignup />
          </div>
        </div>


      </>
    );
  }
};

export default PMGC2025;