import React from 'react';

const SectionCard = ({ eyebrow, title, children }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/30">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-card to-brand-card/40" />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Border */}
      <div className="absolute inset-0 border border-violet-500/20 hover:border-violet-500/60 rounded-3xl transition-all duration-300" />

      {/* Content */}
      <div className="relative p-8 md:p-12 z-10">
        <div className="inline-block px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded-full mb-4 backdrop-blur-sm">
          <span className="text-xs font-bold text-violet-200 uppercase tracking-wider drop-shadow-md">{eyebrow}</span>
        </div>
        <h3
          className="text-2xl md:text-3xl font-extrabold mb-6 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)' }}
        >
          {title}
        </h3>
        <div
          className="text-slate-100 leading-relaxed space-y-4 font-medium drop-shadow-md"
          style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
