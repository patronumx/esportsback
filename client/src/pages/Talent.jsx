import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import Assets
import PUBG from '../assets/PUBG.png';
import FF from '../assets/FF.png';
import TEKKEN from '../assets/TEKKEN.png';
import FC26 from '../assets/FC26.png';
import HOK from '../assets/HOK.png';

const games = [
    { name: "PUBG MOBILE", path: "/talent/pubg-mobile", img: PUBG, width: "w-40 md:w-56" },
    { name: "FREE FIRE", path: "/talent/coming-soon", img: FF, width: "w-40 md:w-52" },
    { name: "TEKKEN 8", path: "/talent/coming-soon", img: TEKKEN, width: "w-48 md:w-64" },
    { name: "FC 26", path: "/talent/coming-soon", img: FC26, width: "w-32 md:w-44" },
    { name: "HONOR OF KINGS", path: "/talent/coming-soon", img: HOK, width: "w-36 md:w-48" }
];

const Talent = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="min-h-screen relative overflow-hidden font-sans flex items-center justify-center py-20">
            {/* Background handled by global layout */}

            <div className="z-10 w-full max-w-7xl px-4 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white mb-4 uppercase drop-shadow-2xl">
                        Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 pr-4 filter drop-shadow-lg">Battlefield</span>
                    </h1>
                    <p className="text-gray-400 tracking-[0.2em] text-sm md:text-base uppercase font-bold">Choose a game to enter the ecosystem</p>
                </motion.div>

                <div className="w-full flex flex-col items-center gap-10 md:gap-16">
                    {/* Top Row: 3 Games */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {games.slice(0, 3).map((game, index) => (
                            <GameCard key={index} game={game} index={index} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
                        ))}
                    </div>

                    {/* Bottom Row: 2 Games */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {games.slice(3, 5).map((game, index) => (
                            <GameCard key={index + 3} game={game} index={index + 3} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

const GameCard = ({ game, index, hoveredIndex, setHoveredIndex }) => (
    <Link
        to={game.path}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        className="flex flex-col items-center gap-6 group perspective-1000"
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative w-72 h-40 md:w-80 md:h-48 lg:w-80 lg:h-48 xl:w-96 xl:h-60 bg-gradient-to-br from-white/5 to-white/0 border border-purple-500/30 rounded-[2rem] flex items-center justify-center overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:border-purple-500/60 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] group-hover:-translate-y-2 backdrop-blur-sm"
        >
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/10 opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_70%)] opacity-100 transition-opacity duration-500" />

            <img
                src={game.img}
                alt={game.name}
                className={`${game.width} object-contain opacity-100 grayscale-0 transition-all duration-700 ease-out relative z-10 drop-shadow-2xl group-hover:scale-110`}
            />
        </motion.div>

        <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-purple-500 transition-all duration-500" />
            <h3 className="text-lg md:text-xl font-bold tracking-[0.25em] text-white uppercase transition-all duration-300">
                {game.name}
            </h3>
            <div className="h-[1px] w-8 bg-purple-500 transition-all duration-500" />
        </div>
    </Link>
);

export default Talent;
