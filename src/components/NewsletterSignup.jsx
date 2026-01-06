import { useState } from 'react';

const NewsletterSignup = ({ compact = false }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'success', 'error', ''

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
      return;
    }

    // Simulate submission
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus(''), 5000);
  };

  if (compact) {
    return (
      <div className="bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50">
        <h3 className="text-lg font-bold text-slate-100 mb-2">Stay Updated</h3>
        <p className="text-sm text-slate-400 mb-4">Get the latest news and updates</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            Subscribe
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-3 px-4 py-2 bg-emerald-600/20 border border-emerald-600/30 rounded-lg text-emerald-400 text-sm text-center">
            Subscribed successfully!
          </div>
        )}
        {status === 'error' && (
          <div className="mt-3 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm text-center">
            Please enter a valid email
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-slate-900/20 backdrop-blur-xl border border-violet-500/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(139 92 246) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative p-12 text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-2xl shadow-violet-500/50">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Join the Patronum Community
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get exclusive updates on tournaments, player signings, behind-the-scenes content, and be the first to know about upcoming events and opportunities.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-800/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              Subscribe
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="max-w-md mx-auto px-6 py-3 bg-emerald-600/20 border border-emerald-600/30 rounded-lg text-emerald-400 font-medium">
            Successfully subscribed! Check your inbox for confirmation.
          </div>
        )}
        {status === 'error' && (
          <div className="max-w-md mx-auto px-6 py-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 font-medium">
            Please enter a valid email address
          </div>
        )}

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 pt-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No spam, ever
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Unsubscribe anytime
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            5K+ subscribers
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
