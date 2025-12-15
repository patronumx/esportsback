import React from 'react';
import { Users, Video, Handshake, Film, Target, Sparkles, Zap, Globe, Cpu } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const About = () => {
  const pillars = [
    {
      icon: Video,
      label: 'Media Production',
      desc: 'State-of-the-art studio facilities and production support to showcase professional esports content.'
    },
    {
      icon: Users,
      label: 'Player Representation',
      desc: 'Connecting undiscovered talent with teams and opportunities through professional representation and career guidance.'
    },
    {
      icon: Handshake,
      label: 'Brand Partnerships',
      desc: 'Authentic collaborations between gaming communities and brands, delivering measurable results and long-term value.'
    },
    {
      icon: Cpu,
      label: 'Software Production',
      desc: 'Developing custom team portals, scouting systems, and digital tools to modernize esports management.'
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Integrity',
      desc: 'We prioritize honest partnerships, transparent dealings, and authentic representation.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      desc: 'Leveraging cutting-edge technology and creative approaches to push esports forward.'
    },
    {
      icon: Zap,
      title: 'Inclusion',
      desc: 'Building a community where every player, team, and brand has a place to grow.'
    },
    {
      icon: Globe,
      title: 'Impact',
      desc: "Growing Pakistan's esports ecosystem and representing it proudly on the global stage."
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="About Patronum Esports"
        title="Empowering Pakistan's Esports Ecosystem"
        subtitle="A multi-title gaming organization dedicated to representing players, covering events, and building communities across Pakistan's esports landscape."
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        {/* Who We Are */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/20 border border-purple-500/30 rounded-3xl p-8 md:p-12 hover:border-purple-500/60 hover:-translate-y-1 transition-all">
            <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6 text-xs font-semibold text-purple-300 tracking-widest uppercase">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Not Competitors. <span className="text-purple-400">Enablers.</span>
            </h2>
            <p className="text-slate-300 mb-4 text-lg leading-relaxed">
              Patronum Esports is <strong>not just a competitive team</strong>—we're a support system for Pakistan's gaming community. We don't just build teams; we <em>represent players</em> who need a bridge to opportunity.
            </p>
            <p className="text-slate-300 mb-4 text-lg leading-relaxed">
              From unrecognized, undiscovered talent seeking representation to teams needing management tools, we are building the digital infrastructure of Pakistan's esports. We develop custom team portals, automated scouting systems, and management software that professionalizes the entire ecosystem.
            </p>
            <p className="text-slate-300 mb-4 text-lg leading-relaxed">
              From brands wanting to connect with gaming audiences to events needing professional coverage—we're the connective tissue and the technology layer of Pakistan's esports ecosystem.
            </p>
            <p className="text-slate-400">
              Our mission is simple: <strong>unite gamers, uplift talent, and represent Pakistan proudly on global stages.</strong>
            </p>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Pillars</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Four pillars that define how we grow Pakistan's esports community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-white/5 to-transparent border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{pillar.label}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="text-center bg-white/5 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                <p className="text-slate-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-500/30 rounded-3xl p-8 md:p-12">
          <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6 text-xs font-semibold text-purple-300 tracking-widest uppercase">
            Our Story
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Built to Bridge Gaps
          </h2>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Patronum Esports started with a simple observation: Pakistan has incredible gaming talent, but many skilled players struggle to find representation, and brands don't know how to authentically connect with gaming communities.
          </p>
          <p className="text-slate-300 mb-4 leading-relaxed">
            We built Patronum to be the <strong>bridge</strong>. A platform where undiscovered talent finds career opportunities, brands discover authentic partnerships, and events receive world-class coverage.
          </p>
          <p className="text-slate-300 leading-relaxed">
            We're not here to win championships—we're here to <strong>enable others to win</strong>, to create, to grow, and to represent Pakistan's gaming culture with pride.
          </p>
        </div>

        {/* Ecosystem */}
        <div className="mt-16 bg-gradient-to-r from-white/5 to-transparent border border-purple-500/30 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">A Unified Ecosystem</h3>
          <p className="text-slate-300 mb-6">
            Everything we do feeds into one goal: <strong>growing Pakistan's esports</strong>. Communities attract brands. Brands support players. Players inspire the next generation. It's all connected.
          </p>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4">
              <p className="font-bold text-violet-300 mb-2">For Players</p>
              <p className="text-slate-400 text-sm">Representation, team connections, brand deals</p>
            </div>
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4">
              <p className="font-bold text-pink-300 mb-2">For Brands</p>
              <p className="text-slate-400 text-sm">Authentic partnerships, campaigns, analytics</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <p className="font-bold text-blue-300 mb-2">For Organizers</p>
              <p className="text-slate-400 text-sm">Anti-cheat solutions, integrity monitoring, broadcast production</p>
            </div>
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="font-bold text-emerald-300 mb-2">For Teams</p>
              <p className="text-slate-400 text-sm">Custom portals, scouting data, management tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
