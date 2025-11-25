import React from 'react';

const ModernBackground = () => {
    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.15),_rgba(0,0,0,1))]"></div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                }}
            ></div>

            {/* Subtle Moving Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
    );
};

export default ModernBackground;
