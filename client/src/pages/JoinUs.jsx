import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';

const JoinUs = () => {
  const [formData, setFormData] = useState({ name: '', role: '', region: '', links: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const rolePreview = {
    player: 'You’ll be considered for scrims, trial blocks, and potential roster pathways.',
    creator: 'We look at your content pillars, audience fit, and where we can help you scale.',
    brand: 'We explore how your product can show up authentically in our ecosystem.',
    other: 'We’ll read and route your message to the right part of the ecosystem.',
  };

  return (
    <div>
      <PageHeader
        eyebrow="Join Us"
        title="Be part of the next chapter."
        subtitle="Whether you are a player, creator, or brand, there is a way to plug into the Patronum ecosystem."
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/30 rounded-2xl p-8 hover:border-violet-500/60 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Players</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              For competitive players or teams who want to trial or scrim with Patronum Esports.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Creators</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              For streamers, editors, and storytellers who want a structured ecosystem to grow with.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/60 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Brands</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              For brands seeking long-term, data-driven partnerships in the gaming and esports space.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-card to-brand-card/50 border border-violet-500/30 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>

          {submitted && (
            <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl text-violet-300">
              Thank you! We&apos;ll be in touch soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-bg border border-violet-500/30 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-bg border border-violet-500/30 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                >
                  <option value="">Select role</option>
                  <option value="player">Player</option>
                  <option value="creator">Creator</option>
                  <option value="brand">Brand</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-bg border border-violet-500/30 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  placeholder="Your region"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Links</label>
                <input
                  type="text"
                  value={formData.links}
                  onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-bg border border-violet-500/30 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors"
                  placeholder="Social media, portfolio, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-brand-bg border border-violet-500/30 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors resize-none"
                placeholder="Tell us about yourself and why you want to join..."
              />
            </div>

            {formData.role && (
              <div className="text-xs text-slate-300 bg-violet-500/5 border border-violet-500/30 rounded-2xl px-4 py-3">
                <span className="font-semibold text-violet-200 mr-1">What this means:</span>
                {rolePreview[formData.role] || rolePreview.other}
              </div>
            )}

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full font-semibold hover:shadow-xl hover:shadow-violet-500/50 transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
