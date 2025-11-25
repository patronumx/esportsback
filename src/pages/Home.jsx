import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Video, Handshake, Film, ArrowRight, CheckCircle2,
  TrendingUp, Zap, Target, Sparkles, Play, Globe, Award,
  Camera, UserPlus, Briefcase, Mic2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [activeStory, setActiveStory] = useState(0);

  const successStories = [
    {
      name: "Rising Creator",
      role: "Content Creator",
      achievement: "From 5K to 150K subscribers in 6 months",
      quote: "Patronum gave me the tools and support to turn my passion into a career"
    },
    {
      name: "Unsponsored Player",
      role: "Competitive Player",
      achievement: "Signed with major team after representation",
      quote: "They believed in me when no one else did"
    },
    {
      name: "Brand Partner",
      role: "Tech Company",
      achievement: "300% ROI on esports campaign",
      quote: "Patronum delivered results beyond our expectations"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Creator-Driven Mission */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden mt-24">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute bottom-1/3 -right-20 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center max-w-5xl mx-auto mb-16">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6 backdrop-blur-md hover:border-purple-400/50 transition-all text-sm">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-cyan-400" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="font-medium text-purple-200 uppercase tracking-wide">
                Patronum Esports • Pakistan → World
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Redefining Esports</span> <span className="text-slate-200">Excellence</span>
            </h1>

            {/* Mission Statement */}
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
              Empowering Global esports through dynamic{' '}
              <span className="text-purple-300 font-medium">creator content</span>, expert{' '}
              <span className="text-violet-300 font-medium">talent management</span>, strategic{' '}
              <span className="text-fuchsia-300 font-medium">brand partnerships</span>, and innovative{' '}
              <span className="text-pink-300 font-medium">media management</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/creators-partners"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2 min-w-[220px] justify-center"
              >
                <Video className="w-5 h-5" />
                Join as Creator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/brands"
                className="group px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-purple-300/50 transition-all backdrop-blur-md flex items-center gap-2 min-w-[220px] justify-center"
              >
                <Handshake className="w-5 h-5" />
                Partner With Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
              </Link>
            </div>

            {/* Our Growing Impact */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8">Our Growing Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: Users,
                    value: '10+',
                    label: 'Ongoing Creator Applications',
                    desc: 'Creators actively applying to join our ecosystem.'
                  },
                  {
                    icon: Award,
                    value: '5+',
                    label: 'Esports Titles in Development',
                    desc: 'Building competitive rosters for major global circuits.'
                  },
                  {
                    icon: Camera,
                    value: '50+',
                    label: 'Media Assets Produced',
                    desc: 'Reels, graphics, branding & production created in-house.'
                  },
                  {
                    icon: Globe,
                    value: '10K+',
                    label: 'Monthly Reach Potential',
                    desc: 'Community, creators, and brand visibility combined.'
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-400/40 transition-all hover:-translate-y-1 h-full flex flex-col items-start text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <stat.icon className="w-5 h-5 text-purple-400" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className="text-sm font-semibold text-purple-200 mb-2">{stat.label}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{stat.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT WE DO - Four Pillars */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Four pillars driving Pakistan's esports forward</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Creator Support */}
          <Link
            to="/creators-partners"
            className="group relative rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black" />
            <div className="absolute inset-0 border border-purple-500/30 group-hover:border-purple-400/70 rounded-2xl transition-all" />

            <div className="relative p-8 z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Creator Support</h3>
                  <p className="text-purple-300 text-sm mb-3">Production • Growth • Monetization</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                State-of-the-art production facilities, equipment access, content strategy, and monetization guidance for creators looking to level up.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/50 text-purple-200">
                  Studio Access
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/50 text-purple-200">
                  Equipment
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/50 text-purple-200">
                  Strategy
                </span>
              </div>
            </div>
          </Link>

          {/* Player Representation */}
          <div className="group relative rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-black" />
            <div className="absolute inset-0 border border-violet-500/30 group-hover:border-violet-400/70 rounded-2xl transition-all" />

            <div className="relative p-8 z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-violet-500/50 transition-all">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Player Representation</h3>
                  <p className="text-violet-300 text-sm mb-3">Bridging Talent & Opportunity</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Connecting unsponsored players with teams and brands. We handle negotiations, contracts, and career development so you can focus on competing.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/50 text-violet-200">
                  Team Placement
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/50 text-violet-200">
                  Contracts
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/50 text-violet-200">
                  Brand Deals
                </span>
              </div>
            </div>
          </div>

          {/* Brand Partnerships */}
          <Link
            to="/brands"
            className="group relative rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/50 to-black" />
            <div className="absolute inset-0 border border-pink-500/30 group-hover:border-pink-400/70 rounded-2xl transition-all" />

            <div className="relative p-8 z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all">
                  <Handshake className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Brand Partnerships</h3>
                  <p className="text-pink-300 text-sm mb-3">Campaigns • Sponsorships • ROI</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Connect your brand with Pakistan's gaming audience through authentic partnerships, custom campaigns, and measurable results.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500/50 text-pink-200">
                  Sponsorships
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500/50 text-pink-200">
                  Campaigns
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500/50 text-pink-200">
                  Analytics
                </span>
              </div>
            </div>
          </Link>

          {/* Event Coverage */}
          <div className="group relative rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-black" />
            <div className="absolute inset-0 border border-blue-500/30 group-hover:border-blue-400/70 rounded-2xl transition-all" />

            <div className="relative p-8 z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                  <Film className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Event Coverage</h3>
                  <p className="text-blue-300 text-sm mb-3">Professional Broadcasting</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Professional tournament coverage with cinematic production quality. We don't compete—we capture and broadcast the action.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-200">
                  Live Streaming
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-200">
                  Highlights
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-200">
                  Social Content
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GROWTH METRICS WITH ANIMATED CHARTS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Growth</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our impact across Pakistan's esports ecosystem</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Creator Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-purple-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Creator Growth</h3>
              <span className="text-emerald-400 text-sm font-semibold">+85% this year</span>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {[
                { month: 'Jan', value: 40, label: '40' },
                { month: 'Mar', value: 65, label: '65' },
                { month: 'Jun', value: 95, label: '95' },
                { month: 'Sep', value: 120, label: '120' },
                { month: 'Nov', value: 150, label: '150' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-12">{item.month}</span>
                  <div className="flex-1 bg-slate-800/50 rounded-full h-8 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 150) * 100}%` }}
                      transition={{ delay: idx * 0.1, duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-end pr-3"
                    >
                      <span className="text-white text-xs font-bold">{item.label}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Brand Partnership ROI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-purple-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Partnership Success</h3>

            </div>

            {/* Circular Progress Indicators */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Campaign Success', value: 92, color: 'purple' },
                { label: 'Brand Satisfaction', value: 88, color: 'violet' },
                { label: 'Renewal Rate', value: 85, color: 'pink' }
              ].map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-800"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - metric.value / 100) }}
                        transition={{ delay: idx * 0.2, duration: 1.5 }}
                        className={`text-${metric.color}-500`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{metric.value}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Impact Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-500/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Monthly Impact</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Video, label: 'Content Assets Produced', value: '120+', trend: '+18%' },
              { icon: Users, label: 'Creator Applications This Month', value: '40+', trend: '+25%' },
              { icon: Award, label: 'Players Scouted & Trialed', value: '15+', trend: '+10%' },
              { icon: Briefcase, label: 'Brand / Community Conversations', value: '12+', trend: '+30%' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                className="bg-white/5 border border-purple-500/20 rounded-xl p-6 text-center hover:border-purple-400/50 transition-all hover:-translate-y-1"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                <div className="text-xs text-emerald-400 font-semibold">{stat.trend} growth</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* SERVICES COMPARISON */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Patronum?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive support across all areas</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              category: 'Production Quality',
              metrics: [
                { name: '4K Capability', value: 100 },
                { name: 'Edit Turnaround', value: 95 },
                { name: 'Studio Access', value: 90 }
              ]
            },
            {
              category: 'Player Support',
              metrics: [
                { name: 'Team Connections', value: 88 },
                { name: 'Contract Support', value: 92 },
                { name: 'Career Guidance', value: 85 }
              ]
            },
            {
              category: 'Brand Value',
              metrics: [
                { name: 'Campaign ROI', value: 98 },
                { name: 'Audience Reach', value: 94 },
                { name: 'Engagement Rate', value: 89 }
              ]
            }
          ].map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white/5 border border-purple-500/20 rounded-2xl p-6"
            >
              <h4 className="text-lg font-bold mb-6 text-center">{service.category}</h4>
              <div className="space-y-4">
                {service.metrics.map((metric, mIdx) => (
                  <div key={mIdx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">{metric.name}</span>
                      <span className="text-purple-400 font-semibold">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ delay: idx * 0.15 + mIdx * 0.1, duration: 1 }}
                        className="h-full bg-gradient-to-r from-purple-600 to-violet-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SUCCESS STORIES */}
      {/* <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Real people. Real growth. Real impact.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="relative rounded-2xl overflow-hidden bg-white/5 border border-purple-500/20 p-6 hover:border-purple-400/50 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {story.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white">{story.name}</h4>
                  <p className="text-xs text-purple-300">{story.role}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-purple-200 mb-3">{story.achievement}</p>
              <p className="text-slate-400 italic text-sm">"{story.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div> */}

      {/* HOW IT WORKS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Simple steps to join the Patronum ecosystem</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: UserPlus, title: 'Apply', desc: 'Submit your application as a creator or player' },
            { icon: Target, title: 'Review', desc: 'Our team reviews your profile and potential' },
            { icon: Handshake, title: 'Onboard', desc: 'Get matched with resources and opportunities' },
            { icon: TrendingUp, title: 'Grow', desc: 'Scale your career with our support' },
          ].map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/creators-partners"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-violet-900/80" />
          <div className="absolute inset-0 border border-purple-500/30 rounded-3xl" />

          <div className="relative p-12 md:p-16 text-center z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Whether you're a creator, player, or brand—let's build something amazing together
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/creators-partners"
                className="px-8 py-4 bg-white text-purple-900 rounded-xl font-bold hover:bg-slate-100 transition-all hover:scale-105"
              >
                Join as Creator/Player
              </Link>
              <Link
                to="/brands"
                className="px-8 py-4 bg-white/10 border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Partner as Brand
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
