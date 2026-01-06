import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Video, Award, Target, BarChart3, Globe, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import NewsletterSignup from '../components/NewsletterSignup';

const Brands = () => {
  const [activeUseCase, setActiveUseCase] = useState(0);

  const useCases = [
    {
      title: "Gaming Peripheral Brand",
      challenge: "This case study is currently being prepared and will showcase how Patronum helps gaming brands increase visibility and trust among competitive players.",
      solution: "We are actively developing partnership frameworks, creator integrations, and content strategies designed to boost product awareness and engagement. The full solution breakdown will be published once live campaigns begin.",
      results: {
        reach: "Metrics will be released after initial campaign execution",
        engagement: "Engagement performance and social lift numbers will be published soon",
        conversion: "Impact on sales, conversions, and brand lift will be revealed once campaigns go live"
      },
      icon: "🎮"
    },
    {
      title: "Energy Drink Brand",
      challenge: "Case study in progress. We are gearing up to help lifestyle brands connect with gaming audiences in authentic and measurable ways.",
      solution: "Our campaign structure will include creator-driven storytelling, tournament integration, and targeted social amplification. Full details will be shared after campaign launch.",
      results: {
        reach: "To be revealed soon",
        engagement: "To be revealed soon",
        conversion: "To be revealed soon"
      },
      icon: "⚡"
    },
    {
      title: "Mobile Network Provider",
      challenge: "Case study under development to highlight how Patronum supports telecom brands looking to enter the esports & gaming space.",
      solution: "Planned execution includes influencer-driven promotions, gaming event presence, and creator content tailored to youth audiences.",
      results: {
        reach: "Coming soon",
        engagement: "Coming soon",
        conversion: "Coming soon"
      },
      icon: "📱"
    }
  ];

  const partnershipPackages = [
    {
      name: 'Event Coverage Partnership',
      icon: Video,
      color: 'from-purple-600 to-violet-600',
      borderColor: 'border-purple-500/30',
      price: 'Custom',
      features: [
        'Professional tournament broadcast coverage',
        'Behind-the-scenes content and player interviews',
        'Social media amplification across all platforms',
        'Logo integration in broadcast graphics',
        'Dedicated brand segments during coverage',
        'Post-event highlight reels with branding'
      ],
    },
    {
      name: 'Creator Network Partnership',
      icon: Users,
      color: 'from-violet-600 to-purple-600',
      borderColor: 'border-violet-500/30',
      price: 'Custom',
      features: [
        'Access to 50+ content creators',
        'Sponsored content series across multiple creators',
        'Product integration in streams and videos',
        'Authentic creator testimonials',
        'Multi-platform distribution (YouTube, Twitch, TikTok)',
        'Monthly performance reports with ROI metrics'
      ],
    },
    {
      name: 'Player Representation Partnership',
      icon: Award,
      color: 'from-pink-600 to-purple-600',
      borderColor: 'border-pink-500/30',
      price: 'Custom',
      features: [
        'Brand ambassador program with represented players',
        'Player meet-and-greet activations',
        'Exclusive player content for your channels',
        'Team jersey placement opportunities',
        'Tournament activation rights',
        'Community engagement campaigns'
      ],
    },
  ];

  const audienceMetrics = [
    {
      label: 'Audience Reach Metrics',
      value: 'Launching Soon',
      description: 'Our monthly reach data will be displayed once campaigns and creator content roll out.',
      icon: Globe,
      color: 'text-purple-400'
    },
    {
      label: 'Engagement Insights',
      value: 'Launching Soon',
      description: 'Live engagement performance and interaction rates coming soon.',
      icon: TrendingUp,
      color: 'text-violet-400'
    },
    {
      label: 'Community Growth Data',
      value: 'Launching Soon',
      description: 'Real-time active community stats will be shown after launch.',
      icon: Users,
      color: 'text-pink-400'
    },
    {
      label: 'Content Performance Metrics',
      value: 'Launching Soon',
      description: 'Monthly viewership and platform analytics will be revealed soon.',
      icon: Video,
      color: 'text-purple-400'
    }
  ];

  const deliverables = [
    {
      icon: Video,
      title: 'Professional Content',
      items: ['Tournament highlights', 'Player interviews', 'BTS footage', 'Product showcases']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      items: ['Real-time dashboards', 'ROI tracking', 'Audience insights', 'Campaign performance']
    },
    {
      icon: Target,
      title: 'Strategic Planning',
      items: ['Campaign strategy', 'Content calendars', 'Activation ideas', 'Optimization']
    },
    {
      icon: Zap,
      title: 'Fast Execution',
      items: ['24-48hr turnaround', 'Agile production', 'Quick iterations', 'Live support']
    }
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Brand Partnerships"
        title="Partner with Pakistan's Premier Esports Ecosystem"
        subtitle="Connect your brand with passionate gaming audiences through authentic partnerships that deliver measurable results across content creation, event coverage, and player representation."
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {/* Value Proposition */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-500/30 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 - Creator Network Ranking */}
              <div className="text-center bg-slate-900/40 border border border-purple-500/20 rounded-2xl p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-3">
                  Coming Soon
                </div>
                <p className="text-slate-200 font-semibold mb-2">Creator Network Ranking</p>
                <p className="text-sm text-slate-400 leading-relaxed">Updates will be published as our creator ecosystem expands.</p>
              </div>

              {/* Card 2 - Campaign Performance Insights */}
              <div className="text-center bg-slate-900/40 border border-purple-500/20 rounded-2xl p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  Coming Soon
                </div>
                <p className="text-slate-200 font-semibold mb-2">Campaign Performance Insights</p>
                <p className="text-sm text-slate-400 leading-relaxed">ROI metrics will be shared once our first brand campaigns go live.</p>
              </div>

              {/* Card 3 - Event Coverage Stats */}
              <div className="text-center bg-slate-900/40 border border-purple-500/20 rounded-2xl p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                  Coming Soon
                </div>
                <p className="text-slate-200 font-semibold mb-2">Event Coverage Stats</p>
                <p className="text-sm text-slate-400 leading-relaxed">Annual event coverage data will appear as our media division activates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases / Case Studies */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 mb-4">
              PROVEN RESULTS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Partnership Success Stories</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              See how brands achieved their goals through strategic partnerships
            </p>
          </div>

          {/* Use Case Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {useCases.map((useCase, idx) => (
              <button
                key={idx}
                onClick={() => setActiveUseCase(idx)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${activeUseCase === idx
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                  }`}
              >
                <span className="mr-2">{useCase.icon}</span>
                {useCase.title}
              </button>
            ))}
          </div>

          {/* Active Use Case */}
          <motion.div
            key={activeUseCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-purple-500/30 rounded-2xl p-8 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">{useCases[activeUseCase].title}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Challenge</p>
                    <p className="text-slate-200">{useCases[activeUseCase].challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Solution</p>
                    <p className="text-slate-200">{useCases[activeUseCase].solution}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/10 border border-emerald-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-emerald-400 mb-4">Results</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Reach</span>
                    <span className="text-emerald-400 font-bold">{useCases[activeUseCase].results.reach}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Engagement</span>
                    <span className="text-emerald-400 font-bold">{useCases[activeUseCase].results.engagement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Conversion</span>
                    <span className="text-emerald-400 font-bold">{useCases[activeUseCase].results.conversion}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partnership Packages */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30 mb-4">
              PARTNERSHIP OPTIONS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Partnership Model</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Flexible packages designed to meet your brand objectives
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipPackages.map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white/5 border ${pkg.borderColor} rounded-2xl p-8 hover:border-purple-400/50 transition-all hover:-translate-y-2`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <pkg.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-purple-400 font-bold text-lg mb-6">{pkg.price} Pricing</p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full px-6 py-3 bg-gradient-to-r ${pkg.color} text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Audience Metrics */}
        <div className="mb-20 bg-gradient-to-br from-violet-900/20 to-purple-900/10 border border-violet-500/30 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-400 border border-violet-600/30 mb-4">
              AUDIENCE REACH
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Network at a Glance</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceMetrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                className="text-center bg-slate-900/40 border border-violet-500/20 rounded-2xl p-6"
              >
                <metric.icon className={`w-10 h-10 ${metric.color} mx-auto mb-4`} />
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <p className="text-slate-200 font-semibold mb-2 text-sm">{metric.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What You Get */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-pink-600/20 text-pink-400 border border-pink-600/30 mb-4">
              DELIVERABLES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Get</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive support across all partnership touchpoints
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliverables.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
                <item.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                <ul className="space-y-2">
                  {item.items.map((subitem, sIdx) => (
                    <li key={sIdx} className="text-sm text-slate-400">• {subitem}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-500/30 rounded-3xl p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner?</h2>
            <p className="text-slate-400 mb-8">
              Let's discuss how we can help your brand connect with Pakistan's most engaged gaming audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:partnerships@patronumesports.com"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                Contact Partnership Team
              </a>
              <button className="px-8 py-4 bg-white/5 border border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:bg-purple-900/20 hover:border-purple-500/60 transition-all">
                Download Media Kit
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              partnerships@patronumesports.com • Response within 24 hours
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

export default Brands;
