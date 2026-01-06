import React from 'react';
import { Lock, Star, Clock } from 'lucide-react';

const PremiumPlaceholder = ({ title = "Premium Feature", description = "This feature is available on request. Contact support to unlock full team analytics and management tools.", type = "lock", launchDate }) => {
    const icons = {
        lock: Lock,
        star: Star,
        clock: Clock
    };

    const Icon = icons[type] || Lock;

    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    React.useEffect(() => {
        if (!launchDate) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(launchDate) - +new Date();
            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Initial call
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [launchDate]);

    return (
        <div className="flex flex-col items-center justify-center p-8 md:p-24 h-full min-h-[400px] text-center w-full">
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-violet-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full duration-700" />
                <div className="relative w-24 h-24 bg-[#0a0a0a] ring-1 ring-white/10 rounded-3xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-black">
                    <Icon className="w-10 h-10 text-violet-400 group-hover:text-violet-300 transition-colors duration-500" />
                </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase">
                {title}
            </h2>

            <p className="text-slate-400 max-w-lg text-lg md:text-xl leading-relaxed mb-12">
                {description}
            </p>

            {launchDate ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="group relative bg-[#0a0a0a] overflow-hidden rounded-2xl border border-white/5 p-4 md:p-6 transition-all duration-300 hover:border-violet-500/30 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative flex flex-col items-center">
                                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1 font-mono tracking-tighter tabular-nums bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                                    {String(value).padStart(2, '0')}
                                </span>
                                <div className="h-px w-8 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent my-2" />
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-violet-400/80">
                                    {unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <button className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] active:scale-95 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">Contact Support</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </button>
            )}
        </div>
    );
};

export default PremiumPlaceholder;
