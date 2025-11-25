import React from 'react';

const PageHeader = ({ eyebrow, title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient orbs like home page */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-1/3 -right-20 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/40 rounded-full mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
            {eyebrow}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-50 via-violet-200 to-slate-50 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
