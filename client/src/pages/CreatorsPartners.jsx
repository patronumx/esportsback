import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import PartnersCarousel from '../components/PartnersCarousel';
import NewsletterSignup from '../components/NewsletterSignup';
import { creators, creatorStats } from '../data/creators';
import { partners } from '../data/partners';

const CreatorsPartners = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeArchetype, setActiveArchetype] = useState('streamer');

  const collabSteps = [
    {
      label: 'Discovery',
      description:
        'We understand the creator’s voice or the brand’s goals: niche, audience, tone, and what “success” actually means.',
    },
    {
      label: 'Blueprint',
      description:
        'We map out content pillars, campaign angles, delivery formats, and timelines that feel natural, not forced.',
    },
    {
      label: 'Launch & Iterate',
      description:
        'Campaigns go live with room to adapt based on real numbers: watchtime, click-through, sentiment, and retention.',
    },
  ];

  const archetypes = [
    {
      id: 'streamer',
      label: 'Competitive Streamer',
      tagline: 'High-intensity gameplay + live chat energy.',
      notes: 'Perfect for tech/peripheral brands and ISP tie-ins.',
    },
    {
      id: 'storyteller',
      label: 'Storyteller',
      tagline: 'Short-form highlights, breakdowns, and narratives.',
      notes: 'Great for lifestyle, mobile, and creator tools.',
    },
    {
      id: 'analyst',
      label: 'Analyst/Coach',
      tagline: 'Deep dives, VOD reviews, and educational content.',
      notes: 'Ideal for performance tools and training platforms.',
    },
  ];

  const activeArch = archetypes.find((a) => a.id === activeArchetype);

  return (
    <div>
      <PageHeader
        eyebrow="Creators & Brands"
        title="Creators deserve platforms, not limits."
        subtitle="The creator management wing connects gaming storytellers with tech and lifestyle brands in ways that feel authentic, not forced."
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20 space-y-12">
        <SectionCard eyebrow="For Creators" title="Grow with structure, not guesswork.">
          <p>
            As a creator under Patronum Esports, you get more than a logo. The team works with you on content pillars,
            posting rhythms, collaborations, and brand positioning, while you stay in control of your voice.
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <span className="text-violet-300 mt-1">▸</span>
              <span>Content strategy aligned with your strengths.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-300 mt-1">▸</span>
              <span>Thumbnail, title, and hook support for key uploads.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-300 mt-1">▸</span>
              <span>Clear and transparent deal structures for brand campaigns.</span>
            </li>
          </ul>

          <div className="mt-8 grid md:grid-cols-[1.3fr_1fr] gap-6 items-start">
            <div>
              <p className="text-sm text-slate-400 mb-3">Example creator archetypes:</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {archetypes.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActiveArchetype(a.id)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-all ${activeArchetype === a.id
                      ? 'bg-violet-600 border-violet-300 text-white shadow-md shadow-violet-500/40'
                      : 'bg-brand-card border-violet-500/30 text-slate-300 hover:border-violet-300'
                      }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Tap through to see how different creator types plug into Patronum.
              </p>
            </div>

            <div className="bg-brand-bg/80 border border-violet-500/30 rounded-2xl p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-violet-300 mb-2">ACTIVE ARCHETYPE</p>
              <p className="text-sm text-slate-100 font-semibold mb-1">{activeArch.label}</p>
              <p className="text-xs text-violet-200 mb-2">{activeArch.tagline}</p>
              <p className="text-xs text-slate-300">{activeArch.notes}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard eyebrow="For Brands" title="Partnerships with measurable impact.">
          <p>
            Brands are integrated into the gaming space with respect for the community. Instead of random shoutouts, the
            focus is on longer-term stories that link your product with real gaming moments.
          </p>
          <p>
            From sponsored segments and tournaments to integrated campaigns across multiple creators, partnerships are
            designed so that they can be measured, iterated, and scaled.
          </p>

          <div className="mt-8">
            <p className="text-sm text-slate-400 mb-3">How a typical collab journey feels:</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {collabSteps.map((step, idx) => (
                <button
                  key={step.label}
                  onClick={() => setActiveStep(idx)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-all ${idx === activeStep
                    ? 'bg-violet-600 border-violet-300 text-white shadow-md shadow-violet-500/40'
                    : 'bg-brand-card border-violet-500/30 text-slate-300 hover:border-violet-300'
                    }`}
                >
                  {idx + 1}. {step.label}
                </button>
              ))}
            </div>

            <div className="bg-brand-bg/80 border border-violet-500/30 rounded-2xl p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-violet-300 mb-2">
                STEP {activeStep + 1} • {collabSteps[activeStep].label}
              </p>
              <p className="text-sm text-slate-200">{collabSteps[activeStep].description}</p>
            </div>
          </div>
        </SectionCard>

        {/* Creator Network Stats */}
        <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30 mb-4">
              CREATOR NETWORK
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Creator Community</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Building the future of gaming content with talented creators across platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 text-center border border-violet-500/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Launching Soon
              </div>
              <div className="text-sm text-slate-400">Total Followers</div>
              <div className="text-xs text-slate-500 mt-2">Creator onboarding in progress</div>
            </div>
            <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 text-center border border-purple-500/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
                Coming Soon
              </div>
              <div className="text-sm text-slate-400">Monthly Views</div>
              <div className="text-xs text-slate-500 mt-2">Performance stats will update automatically</div>
            </div>
            <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 text-center border border-violet-500/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Releasing Soon
              </div>
              <div className="text-sm text-slate-400">Avg. Engagement</div>
              <div className="text-xs text-slate-500 mt-2">Live engagement metrics coming soon</div>
            </div>
            <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 text-center border border-purple-500/20">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
                Opening Soon
              </div>
              <div className="text-sm text-slate-400">Brand Partnerships</div>
              <div className="text-xs text-slate-500 mt-2">Partnership data will appear here</div>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap justify-center gap-3">
            {creatorStats.platforms.map((platform, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full bg-slate-800/50 text-slate-300 text-sm border border-slate-700/50"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Creators */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
              FEATURED CREATORS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Creators</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Talented individuals creating engaging gaming content across platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Streamer Slot */}
            <div className="group bg-brand-card backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-800/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-violet-600/20 to-purple-600/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-violet-500/50 border-4 border-slate-900">
                    🎮
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/30">
                    Opening Soon
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-1">Creator Slot Opening</h3>
                  <p className="text-sm text-violet-400 mb-2">Streamer / Live Content</p>
                  <p className="text-sm text-slate-400 line-clamp-3">
                    We are preparing to introduce our first professional streamers who will shape Patronum's live content identity.
                  </p>
                </div>

                {/* Specialty */}
                <div className="pt-4 border-t border-slate-800/50">
                  <div className="text-xs text-slate-500 mb-2">Specialty</div>
                  <div className="text-sm text-slate-300">PUBG | Valorant | Mobile Titles</div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 border-t border-slate-800/50">
                  <div className="px-4 py-3 rounded-lg bg-violet-600/10 border border-violet-500/30 text-center">
                    <div className="text-sm font-semibold text-violet-300">Applications Opening Soon</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Storyteller Slot */}
            <div className="group bg-brand-card backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-800/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-purple-500/50 border-4 border-slate-900">
                    🎬
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/30">
                    Opening Soon
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-1">Creator Slot Opening</h3>
                  <p className="text-sm text-purple-400 mb-2">Shorts / Storytelling Creator</p>
                  <p className="text-sm text-slate-400 line-clamp-3">
                    Short-form content creators are being scouted to lead our cinematic and storytelling division.
                  </p>
                </div>

                {/* Specialty */}
                <div className="pt-4 border-t border-slate-800/50">
                  <div className="text-xs text-slate-500 mb-2">Specialty</div>
                  <div className="text-sm text-slate-300">Reels | TikTok | Highlights</div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 border-t border-slate-800/50">
                  <div className="px-4 py-3 rounded-lg bg-purple-600/10 border border-purple-500/30 text-center">
                    <div className="text-sm font-semibold text-purple-300">Applications Opening Soon</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyst Slot */}
            <div className="group bg-brand-card backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-800/50 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-500/50 border-4 border-slate-900">
                    📊
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/30">
                    Opening Soon
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-1">Creator Slot Opening</h3>
                  <p className="text-sm text-blue-400 mb-2">Analyst / Guide Creator</p>
                  <p className="text-sm text-slate-400 line-clamp-3">
                    Educational creators are joining soon to deliver guides, breakdowns, and gameplay analysis.
                  </p>
                </div>

                {/* Specialty */}
                <div className="pt-4 border-t border-slate-800/50">
                  <div className="text-xs text-slate-500 mb-2">Specialty</div>
                  <div className="text-sm text-slate-300">Strategy | Knowledge | Meta Analysis</div>
                </div>

                {/* Status Badge */}
                <div className="pt-4 border-t border-slate-800/50">
                  <div className="px-4 py-3 rounded-lg bg-blue-600/10 border border-blue-500/30 text-center">
                    <div className="text-sm font-semibold text-blue-300">Applications Opening Soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="pt-12 mt-12 border-t border-slate-800/50">
          <div className="text-center mb-12">
          
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creator Growth Highlights</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Real results from creators who partnered with Patronum Esports
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Creator Growth Insights */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-brand-card border border-emerald-500/30 rounded-2xl p-8">
              <div className="text-4xl mb-4">📈</div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  Launching Soon
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Creator Growth Insights</h3>
              <p className="text-slate-400 text-sm mb-4">
                Detailed growth stories from upcoming Patronum creators will be available once our content and coaching pipeline is live.
              </p>
              <div className="pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 mb-2">Metrics Coming Soon</div>
                <div className="text-xs text-slate-300">
                  Follower growth • Engagement boosts • Content performance
                </div>
              </div>
            </div>

            {/* Card 2 - Brand Deal Highlights */}
            <div className="bg-gradient-to-br from-violet-900/20 to-brand-card border border-violet-500/30 rounded-2xl p-8">
              <div className="text-4xl mb-4">💰</div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30">
                  Launching Soon
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Brand Deal Highlights</h3>
              <p className="text-slate-400 text-sm mb-4">
                We will feature real partnership wins once our creators begin collaborating with brands under Patronum.
              </p>
              <div className="pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 mb-2">Data Coming Soon</div>
                <div className="text-xs text-slate-300">
                  Campaign impact • ROI insights • Collaboration partners
                </div>
              </div>
            </div>

            {/* Card 3 - Content Success Stories */}
            <div className="bg-gradient-to-br from-purple-900/20 to-brand-card border border-purple-500/30 rounded-2xl p-8">
              <div className="text-4xl mb-4">🎬</div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  Launching Soon
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Content Success Stories</h3>
              <p className="text-slate-400 text-sm mb-4">
                Expect viral content breakdowns, highlight series performance, and creator milestones soon.
              </p>
              <div className="pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 mb-2">Data Coming Soon</div>
                <div className="text-xs text-slate-300">
                  Views • Shares • Watch time • Platform reach
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Partners Showcase */}
        <div className="pt-12 mt-12 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 mb-4">
              BRAND PARTNERS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Working With Industry Leaders</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Trusted partnerships delivering value for brands and creators alike
            </p>
          </div>
          <PartnersCarousel partners={partners} />
        </div>

        {/* CTA Section */}
        <div className="pt-12 mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

export default CreatorsPartners;
