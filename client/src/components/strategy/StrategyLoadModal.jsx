import React, { useEffect, useState } from 'react';
import { X, Clock, Map as MapIcon } from 'lucide-react';
import axios from 'axios';
import { showToast } from '../../utils/toast';

import ERANGEL from '../../assets/maps/ERANGEL.jpg';
import MIRAMAR from '../../assets/maps/MIRAMAR.jpg';
import RONDO from '../../assets/maps/RONDO.jpg';

const MAP_IMAGES = {
    ERANGEL,
    MIRAMAR,
    RONDO
};

const StrategyLoadModal = ({ isOpen, onClose, onLoadStrategy, type = 'general' }) => {
    const [strategies, setStrategies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStrategies();
        }
    }, [isOpen]);

    const fetchStrategies = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get('https://petite-towns-follow.loca.lt/api/strategies', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Client-side filtering for simplicity, or could pass query param
            const filtered = type ? data.filter(s => s.type === type) : data;
            setStrategies(filtered);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                showToast.error('Session expired. Please login again.');
            } else {
                showToast.error('Failed to load strategies');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">

                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h2 className="text-xl font-bold text-white font-orbitron">Load Strategy</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="text-center text-gray-400 py-8">Loading strategies...</div>
                    ) : strategies.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">No saved strategies found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {strategies.map((strategy) => (
                                <div
                                    key={strategy._id}
                                    onClick={() => onLoadStrategy(strategy)}
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 cursor-pointer hover:border-purple-500 hover:bg-zinc-750 transition-all group"
                                >
                                    <div className="aspect-video bg-black rounded overflow-hidden mb-3 relative">
                                        {strategy.thumbnailUrl ? (
                                            <img src={strategy.thumbnailUrl} alt={strategy.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 relative group-hover:opacity-90 transition-opacity">
                                                {MAP_IMAGES[strategy.mapName] ? (
                                                    <img
                                                        src={MAP_IMAGES[strategy.mapName]}
                                                        alt={strategy.mapName}
                                                        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                        <MapIcon className="w-8 h-8" />
                                                    </div>
                                                )}

                                                {/* Overlay Icon */}
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <MapIcon className="w-8 h-8 text-white/20 group-hover:text-white/80 transition-colors" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-mono">
                                            {strategy.mapName}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-white group-hover:text-purple-400 truncate">{strategy.title}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(strategy.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrategyLoadModal;
