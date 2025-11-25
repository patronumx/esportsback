import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import VideoGallery from '../components/VideoGallery';
import NewsletterSignup from '../components/NewsletterSignup';
import { videos } from '../data/videos';

const MediaCoverage = () => {
  const [category, setCategory] = useState('tournaments');

  const items = [
    {
      id: 1,
      category: 'tournaments',
      title: 'EWC Riyadh • Chapter Recap',
      tag: 'Tournament',
      desc: 'From bootcamp to stage lights — how the chapter unfolded.',
    },
    {
      id: 2,
      category: 'tournaments',
      title: 'PMGC Road • Qualifier Story',
      tag: 'Tournament',
      desc: 'Watching the path from scrims to PMGC from a camera lens.',
    },
    {
      id: 3,
      category: 'bts',
      title: 'Behind the Screens • Practice Day',
      tag: 'BTS',
      desc: 'What a full prep day looks like from morning to shutdown.',
    },
    {
      id: 4,
      category: 'series',
      title: 'Creator Spotlight • Episode 01',
      tag: 'Series',
      desc: 'Introducing the storytellers behind the Patronum banner.',
    },
  ];

  const filtered = items.filter((i) => i.category === category);

  return (
    <div>
      <PageHeader
        eyebrow="Media & Event Coverage"
        title="Turning tournaments into stories."
        subtitle="From EWC Riyadh to PMGC, the media and production team captures every chapter of global esports as cinematic experiences."
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        <SectionCard eyebrow="Storytelling" title="Cameras on the frontlines.">
          <p>
            Content is built around story arcs: underdogs, rivalries, comebacks, and the pressure of the big stage.
          </p>
          <p>
            Highlights, recap reels, player features, and behind-the-scenes vlogs are produced to bring fans closer to
            each chapter.
          </p>
        </SectionCard>

        <div className="mt-12 mb-6 flex flex-wrap gap-3 justify-center md:justify-start">
          {[
            { id: 'tournaments', label: 'Tournaments' },
            { id: 'bts', label: 'Behind the Scenes' },
            { id: 'series', label: 'Content Series' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-all ${
                category === c.id
                  ? 'bg-violet-600 border-violet-300 text-white shadow-md shadow-violet-500/40'
                  : 'bg-brand-card border-violet-500/30 text-slate-300 hover:border-violet-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-gradient-to-br from-brand-card to-brand-card/40 border border-violet-500/20 rounded-2xl overflow-hidden hover:border-violet-500/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
            >
              <div className="h-32 bg-gradient-to-r from-violet-700/60 to-purple-600/60 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, rgba(248,250,252,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(199,210,254,0.25), transparent 55%)',
                  }}
                ></div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-slate-100 border border-white/20">
                    {item.tag}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/30 text-violet-100 border border-violet-300/40">
                    4K Ready
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-violet-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
                <button className="text-xs font-semibold text-violet-300 group-hover:text-violet-100 flex items-center gap-1">
                  View media kit
                  <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <SectionCard eyebrow="Coverage Map" title="From local to global.">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-violet-300 mt-1">▸</span>
              <span>Coverage of EWC Riyadh and global events like PMGC.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-300 mt-1">▸</span>
              <span>Plans to expand into PGC, PDC 2025, and other top-tier tournaments.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-violet-300 mt-1">▸</span>
              <span>Partnership-ready media packages for brands who want to show up during peak hype moments.</span>
            </li>
          </ul>
        </SectionCard>

        {/* Video Gallery */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30 mb-4">
              VIDEO LIBRARY
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Our Content</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tournament highlights, behind-the-scenes footage, and exclusive content
            </p>
          </div>
          <VideoGallery videos={videos} />
        </div>

        {/* Media Kit Section */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-3xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
                  MEDIA RESOURCES
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Media & Press Kit</h2>
                <p className="text-slate-400">
                  Everything you need to cover Patronum Esports
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                  <div className="text-2xl mb-3">📸</div>
                  <h3 className="text-lg font-bold mb-2">Brand Assets</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Official logos, colors, and brand guidelines
                  </p>
                  <button className="px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors text-sm font-medium border border-violet-600/30">
                    Download Assets
                  </button>
                </div>

                <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                  <div className="text-2xl mb-3">📰</div>
                  <h3 className="text-lg font-bold mb-2">Press Releases</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Latest news, announcements, and updates
                  </p>
                  <button className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium border border-purple-600/30">
                    View Releases
                  </button>
                </div>

                <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                  <div className="text-2xl mb-3">🎬</div>
                  <h3 className="text-lg font-bold mb-2">B-Roll Footage</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    High-quality video footage for media use
                  </p>
                  <button className="px-4 py-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30 transition-colors text-sm font-medium border border-violet-600/30">
                    Access Footage
                  </button>
                </div>

                <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
                  <div className="text-2xl mb-3">📊</div>
                  <h3 className="text-lg font-bold mb-2">Team Statistics</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Performance data and tournament results
                  </p>
                  <button className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium border border-purple-600/30">
                    View Stats
                  </button>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-slate-800/50">
                <p className="text-sm text-slate-400 mb-4">
                  For media inquiries and interview requests
                </p>
                <a
                  href="mailto:media@patronumesports.com"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  Contact Media Team
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Production Capabilities */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 mb-4">
              PRODUCTION
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Production Capabilities</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Professional content creation with cutting-edge equipment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-brand-card backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 hover:border-violet-500/50 transition-all">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-3">Live Streaming</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Multi-camera production
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Professional audio mixing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Real-time graphics overlay
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  4K streaming capability
                </li>
              </ul>
            </div>

            <div className="bg-brand-card backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 hover:border-purple-500/50 transition-all">
              <div className="text-3xl mb-4">✂️</div>
              <h3 className="text-xl font-bold mb-3">Video Editing</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Highlight reels
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Cinematic storytelling
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Motion graphics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span>
                  Color grading & VFX
                </li>
              </ul>
            </div>

            <div className="bg-brand-card backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 hover:border-violet-500/50 transition-all">
              <div className="text-3xl mb-4">📡</div>
              <h3 className="text-xl font-bold mb-3">Broadcast</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Multi-platform streaming
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Tournament production
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Commentary & analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span>
                  Event coverage
                </li>
              </ul>
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

export default MediaCoverage;
