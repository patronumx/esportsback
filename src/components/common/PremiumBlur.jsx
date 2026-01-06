import React from 'react';
import { Lock } from 'lucide-react';

const PremiumBlur = ({ children, text = "On Request" }) => {
    return (
        <div className="relative group overflow-hidden rounded-3xl">
            <div className="filter blur-md opacity-30 select-none pointer-events-none transition-all duration-500 group-hover:blur-lg group-hover:opacity-20">
                {children}
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-xl shadow-violet-500/10 transition-transform duration-300 hover:scale-105">
                    <Lock className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{text}</span>
                </div>
            </div>
        </div>
    );
};

export default PremiumBlur;
