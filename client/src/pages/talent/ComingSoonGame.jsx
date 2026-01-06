import React from 'react';
import { motion } from 'framer-motion';

const ComingSoonGame = () => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-600 mb-4 tracking-tighter">
                    COMING SOON
                </h1>
                <p className="text-slate-400 text-xl md:text-2xl font-light tracking-widest uppercase">
                    The battleground is being prepared
                </p>
            </motion.div>

            {/* Simple ambient background if needed, leveraging parent's layout transparency */}
        </div>
    );
};

export default ComingSoonGame;
