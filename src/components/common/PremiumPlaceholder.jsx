import React from 'react';
import { Lock, Star, Clock } from 'lucide-react';

const PremiumPlaceholder = ({ title = "Premium Feature", description = "This feature is available on request. Contact support to unlock full team analytics and management tools.", type = "lock" }) => {
    const icons = {
        lock: Lock,
        star: Star,
        clock: Clock
    };

    const Icon = icons[type] || Lock;

    return (
        <div className="flex flex-col items-center justify-center p-12 md:p-24 h-full min-h-[400px] text-center">
            <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full" />
                <div className="relative w-24 h-24 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-10 h-10 text-violet-400" />
                </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight uppercase">
                {title}
            </h2>

            <p className="text-slate-400 max-w-md text-lg leading-relaxed mb-8">
                {description}
            </p>

            <button className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 active:scale-95">
                Contact Support
            </button>
        </div>
    );
};

export default PremiumPlaceholder;
