import React, { useState } from 'react';
import { Map, ChevronDown } from 'lucide-react';

const MapHeader = ({ currentMap, onMapChange }) => {
    const maps = ['ERANGEL', 'MIRAMAR', 'RONDO'];
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1E1E1E]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-4 shadow-2xl z-[1000]">

            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                <Map className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-gray-400 tracking-wider">ACTIVE MAP</span>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-white font-bold text-sm uppercase cursor-pointer focus:outline-none py-1 hover:text-white/80 transition-colors"
                >
                    {currentMap}
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#1E1E1E] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[2000] py-1">
                        {maps.map(map => (
                            <button
                                key={map}
                                onClick={() => {
                                    onMapChange(map);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase transition-colors flex items-center justify-between ${map === currentMap
                                    ? 'bg-purple-500/10 text-purple-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                    }`}
                            >
                                {map}
                                {map === currentMap && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default MapHeader;
