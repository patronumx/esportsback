import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, Video, Database, Cpu, Eye, TrendingUp, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';

const TechAntiCheat = () => {
  const [activeTab, setActiveTab] = useState('anti-cheat');
  const [logIndex, setLogIndex] = useState(0);
  const [activeUseCase, setActiveUseCase] = useState(0);

  const logs = [
    '[AC] Scanning match events for unusual patterns...',
    '[AC] Flagged 2 suspicious POVs for manual review.',
    '[Analytics] Generated heatmap for rotations - Miramar block.',
    '[AC] No external tools detected in last 10 rounds.',
    '[Analytics] Identified new high-success entry paths.',
    '[Media] Processing 4K tournament footage - 87% complete.',
    '[Database] Synced 1,240 player stats across 15 tournaments.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % logs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [logs.length]);

  const techSolutions = [
    {
      id: 'anti-cheat',
      icon: Shield,
      label: 'Anti-Cheat Systems',
      color: 'from-red-600 to-orange-600',
      stats: {
        accuracy: '99.2%',
        speed: '<5 min',
        coverage: '50+ events'
      }
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Performance Analytics',
      color: 'from-blue-600 to-cyan-600',
      stats: {
        metrics: '200+',
        processing: 'Real-time',
        insights: '1000s/mo'
      }
    },
    {
      id: 'media',
      icon: Video,
      label: 'Media Management',
      color: 'from-purple-600 to-pink-600',
      stats: {
        storage: '50TB+',
        quality: '4K 60fps',
        turnaround: '<24hrs'
      }
    },
    {
      id: 'database',
      icon: Database,
      label: 'Data Infrastructure',
      color: 'from-green-600 to-emerald-600',
      stats: {
        records: '500K+',
        uptime: '99.9%',
        speed: '<100ms'
      }
    }
  ];

  const antiCheatUseCases = [
    {
      title: "Tournament Integrity",
      challenge: "Organizers need to verify 100+ matches per event for fair play",
      solution: "Automated pattern detection + manual review dashboard for admins",

    },
    {
      title: "Team Protection",
      challenge: "Teams falsely accused need evidence to clear their reputation",
      solution: "Comprehensive VOD analysis with timestamped data proving legitimacy",

    },
    {
      title: "Community Trust",
      challenge: "Viewers question if matches are fair without transparency",
      solution: "Public anti-cheat reports + live monitoring during broadcasts",

    }
  ];

  const analyticsUseCases = [
    {
      title: "Player Performance Tracking",
      challenge: "Coaches need data-driven insights to improve team strategy",
      solution: "AI-powered heatmaps, rotation analysis, and fight outcome predictions",

    },
    {
      title: "Content Optimization",
      challenge: "Creators don't know which content performs best",
      solution: "Real-time analytics showing engagement, retention, and audience demographics",

    },
    {
      title: "Brand ROI Measurement",
      challenge: "Brands can't measure campaign effectiveness",
      solution: "Comprehensive tracking of impressions, engagement, and conversion metrics",

    }
  ];

  const mediaUseCases = [
    {
      title: "Event Coverage Pipeline",
      challenge: "Tournaments need professional coverage delivered quickly",
      solution: "Automated ingestion → editing → distribution pipeline with 4K quality",

    },
    {
      title: "Creator Content Library",
      challenge: "Creators need B-roll footage and assets for production",
      solution: "Centralized asset library with searchable tags and instant downloads",

    },
    {
      title: "Highlight Generation",
      challenge: "Manual highlight creation takes hours per match",
      solution: "AI-powered highlight detection with automatic editing and export",

    }
  ];

  const databaseUseCases = [
    {
      title: "Player Statistics Platform",
      challenge: "No centralized database for Pakistan esports player stats",
      solution: "Comprehensive database tracking 500K+ player records across all games",

    },
    {
      title: "Tournament History",
      challenge: "Historical tournament data scattered and inaccessible",
      solution: "Unified database with searchable tournament history and results",

    },
    {
      title: "Brand Partnership Metrics",
      challenge: "Brands need historical performance data before partnerships",
      solution: "Real-time dashboard showing audience metrics and engagement trends",

    }
  ];

  const getCurrentUseCases = () => {
    switch (activeTab) {
      case 'anti-cheat': return antiCheatUseCases;
      case 'analytics': return analyticsUseCases;
      case 'media': return mediaUseCases;
      case 'database': return databaseUseCases;
      default: return antiCheatUseCases;
    }
  };

  const activeSolution = techSolutions.find(s => s.id === activeTab);
  const currentUseCases = getCurrentUseCases();

  return (
    <div>
      <PageHeader
        eyebrow="Technology & Infrastructure"
        title="Powered by Data, Secured by Technology"
        subtitle="Comprehensive technology solutions powering Pakistan's esports ecosystem—from anti-cheat systems to content management, analytics to data infrastructure."
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {/* Tech Solutions Grid */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techSolutions.map((solution, idx) => (
              <motion.button
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  setActiveTab(solution.id);
                  setActiveUseCase(0);
                }}
                className={`text-left bg-white/5 border rounded-2xl p-6 transition-all ${activeTab === solution.id
                  ? 'border-purple-500/60 bg-purple-900/20 shadow-lg shadow-purple-500/20'
                  : 'border-slate-800/50 hover:border-purple-500/30'
                  }`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <solution.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">{solution.label}</h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(solution.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400 capitalize">{key}</span>
                      <span className="text-purple-400 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Solution Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Use Cases */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{activeSolution.label}</h2>
              <p className="text-slate-400">Real-world applications and impact</p>
            </div>

            {/* Use Case Tabs */}
            <div className="flex flex-col gap-3 mb-6">
              {currentUseCases.map((useCase, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveUseCase(idx)}
                  className={`text-left px-4 py-3 rounded-xl transition-all ${activeUseCase === idx
                    ? `bg-gradient-to-r ${activeSolution.color} text-white shadow-lg`
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                    }`}
                >
                  <div className="font-semibold">{useCase.title}</div>
                  {activeUseCase === idx && (
                    <div className="text-xs mt-1 opacity-90">{useCase.challenge}</div>
                  )}
                </button>
              ))}
            </div>

            {/* Active Use Case Details */}
            <motion.div
              key={activeUseCase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">Challenge</p>
                  <p className="text-slate-200">{currentUseCases[activeUseCase].challenge}</p>
                </div>
                <div>
                  <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-2">Solution</p>
                  <p className="text-slate-200">{currentUseCases[activeUseCase].solution}</p>
                </div>

              </div>
            </motion.div>
          </div>

          {/* System Status Terminal */}
          <div>
            <div className="bg-gradient-to-br from-black/70 via-purple-950/60 to-slate-900 border border-purple-500/40 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-purple-300 font-semibold">System Monitor</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs text-emerald-400">All Systems Operational</span>
                </div>
              </div>

              <div className="h-64 bg-black/40 rounded-2xl border border-purple-500/40 p-4 flex flex-col gap-2 overflow-hidden font-mono text-xs">
                {Array.from({ length: 8 }).map((_, i) => {
                  const idx = (logIndex - (7 - i) + logs.length) % logs.length;
                  return (
                    <p
                      key={i}
                      className={`whitespace-nowrap transition-all ${i === 7 ? 'text-purple-200' : 'text-slate-500'
                        }`}
                    >
                      {i === 7 && <span className="text-emerald-400 mr-2">▶</span>}
                      {logs[idx]}
                    </p>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Real-time monitoring of anti-cheat, analytics, media processing, and database operations
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-3">
                  <Cpu className="w-5 h-5 text-purple-400 mb-2" />
                  <div className="text-xs text-slate-400">Processing</div>
                  <div className="text-lg font-bold text-white">2.4TB</div>
                </div>
                <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-3">
                  <TrendingUp className="w-5 h-5 text-violet-400 mb-2" />
                  <div className="text-xs text-slate-400">Uptime</div>
                  <div className="text-lg font-bold text-white">99.9%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack Overview */}
        <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-500/30 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
              INFRASTRUCTURE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Enterprise-grade systems powering Pakistan's esports ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
              <Eye className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="font-bold mb-3">Monitoring & Detection</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• AI-powered pattern recognition</li>
                <li>• Real-time anomaly detection</li>
                <li>• Behavioral analysis systems</li>
                <li>• Automated flagging pipelines</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-violet-500/20 rounded-xl p-6">
              <Zap className="w-8 h-8 text-violet-400 mb-4" />
              <h4 className="font-bold mb-3">Processing & Analysis</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• High-performance computing</li>
                <li>• Distributed processing</li>
                <li>• Machine learning models</li>
                <li>• Predictive analytics</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-pink-500/20 rounded-xl p-6">
              <Database className="w-8 h-8 text-pink-400 mb-4" />
              <h4 className="font-bold mb-3">Storage & Distribution</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 50TB+ cloud storage</li>
                <li>• CDN for global delivery</li>
                <li>• Redundant backups</li>
                <li>• 99.9% uptime SLA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white/5 border border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Partner with Our Technology Team</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Looking for anti-cheat solutions, analytics platforms, or media management systems for your tournaments?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
            Contact Tech Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechAntiCheat;
