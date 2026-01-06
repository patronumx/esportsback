import React, { useState } from 'react';
import { Search, Info, Crosshair, Shield, TrendingDown, X } from 'lucide-react';

// --- IMPORTS ---
// AR
import ace32 from '../../../assets/weapons/AR/ace32c.png';
import akm from '../../../assets/weapons/AR/akm.png';
import aug from '../../../assets/weapons/AR/aug.png';
import groza from '../../../assets/weapons/AR/groza.png';
import honeybadger from '../../../assets/weapons/AR/honeybadger.png';
import m416 from '../../../assets/weapons/AR/m416.png';
import m762 from '../../../assets/weapons/AR/m762.png';
import mk47 from '../../../assets/weapons/AR/mk47.png';
import qbz from '../../../assets/weapons/AR/qbz.png';
import scarl from '../../../assets/weapons/AR/scar-l.png';
import famas from '../../../assets/weapons/AR/famas.png';
import g36c from '../../../assets/weapons/AR/g36c.png';
import m16a4 from '../../../assets/weapons/AR/m16a4.png';

// DMR
import mini14 from '../../../assets/weapons/DMR/mini_w.png';
import sks from '../../../assets/weapons/DMR/sks_w.png';
import mk12 from '../../../assets/weapons/DMR/mk12_w.png';
import slr from '../../../assets/weapons/DMR/slr_w.png';
import mk14 from '../../../assets/weapons/DMR/mk14_w.png';
import vss from '../../../assets/weapons/DMR/vss_w.png';
import qbu from '../../../assets/weapons/DMR/qbu_w.png';
import win94 from '../../../assets/weapons/DMR/win94_w.png';

// Shotgun
import s12k from '../../../assets/weapons/SHOTGUN/s12k_w.png';
import s1897 from '../../../assets/weapons/SHOTGUN/s1897_w.png';
import dbs from '../../../assets/weapons/SHOTGUN/dp12_w.png';
import s686 from '../../../assets/weapons/SHOTGUN/s686_w.png';
import m1014 from '../../../assets/weapons/SHOTGUN/m1014_w.png';
import ns2000 from '../../../assets/weapons/SHOTGUN/ns2000_w.png';

// Sniper
import k98 from '../../../assets/weapons/SNIPER/98k_w.png';
import amr from '../../../assets/weapons/SNIPER/amr_w.png';
import awm from '../../../assets/weapons/SNIPER/awm_w.png';
import dsr from '../../../assets/weapons/SNIPER/dsr_w.png'; // M24?
import m24 from '../../../assets/weapons/SNIPER/m24_w.png';
import mosin from '../../../assets/weapons/SNIPER/mosin_w.png';

// SMG
import mp5k from '../../../assets/weapons/SUB-MACHINE GUN/mp5k_w.png';
import p90 from '../../../assets/weapons/SUB-MACHINE GUN/p90_w.png';
import pp19 from '../../../assets/weapons/SUB-MACHINE GUN/pp19_w.png';
import tommy from '../../../assets/weapons/SUB-MACHINE GUN/thommygun_w.png';
import ump45 from '../../../assets/weapons/SUB-MACHINE GUN/ump45_w.png';
import uzi from '../../../assets/weapons/SUB-MACHINE GUN/uzi_w.png';
import vector from '../../../assets/weapons/SUB-MACHINE GUN/vector_w.png';

// LMG
import mg3 from '../../../assets/weapons/MACHINE GUN/mg3_w.png';

// Pistol
import mp7 from '../../../assets/weapons/PISTOL/MP7_w.png'; // NOTE: MP7 is often considered SMG in some contexts, but folder says Pistol? Or maybe just listed there. Moving to SMG logic if needed, but keeping as 'Pistol' category for folder match or 'Sidearm'.
import deagle from '../../../assets/weapons/PISTOL/deserteagle_w.png';
import flare from '../../../assets/weapons/PISTOL/flaregun_w.png';
import p18c from '../../../assets/weapons/PISTOL/p18c_w.png';
import p1911 from '../../../assets/weapons/PISTOL/p1911_w.png';
import p92 from '../../../assets/weapons/PISTOL/p92_w.png';
import r1895 from '../../../assets/weapons/PISTOL/r1895_w.png';
import r45 from '../../../assets/weapons/PISTOL/r45_w.png';
import sawedoff from '../../../assets/weapons/PISTOL/sawedoff_w.png';
import skorpion from '../../../assets/weapons/PISTOL/skorpion_w.png';

// Melee
import sickle from '../../../assets/weapons/MELEE/bishou_w.png'; // bishou?
import machete from '../../../assets/weapons/MELEE/machete_w.png';
import pan from '../../../assets/weapons/MELEE/pan_w.png';

// Crossbow
import crossbow from '../../../assets/weapons/CROSSBOW/crossbow_w.png';

// --- CONSTANTS & DATA ---

// Range Stats Data (Damage at specific meters for Head/Chest 4.1 update)
const RANGE_STATS = {
    m416: [
        { range: 10, head: 89, chest: 38 }, { range: 15, head: 89, chest: 38 },
        { range: 20, head: 88, chest: 38 }, { range: 25, head: 88, chest: 38 },
        { range: 30, head: 88, chest: 38 }, { range: 35, head: 88, chest: 38 },
        { range: 40, head: 88, chest: 38 }, { range: 45, head: 88, chest: 38 },
        { range: 50, head: 87, chest: 38 }, { range: 60, head: 87, chest: 38 },
        { range: 70, head: 87, chest: 37 }, { range: 80, head: 87, chest: 37 },
        { range: 90, head: 86, chest: 37 }, { range: 100, head: 86, chest: 37 },
        { range: 150, head: 85, chest: 36 }, { range: 200, head: 83, chest: 36 },
        { range: 250, head: 81, chest: 35 }, { range: 300, head: 80, chest: 34 },
    ],
    scarl: [
        { range: 10, head: 91, chest: 39 }, { range: 15, head: 91, chest: 39 },
        { range: 20, head: 91, chest: 39 }, { range: 25, head: 91, chest: 39 },
        { range: 30, head: 90, chest: 39 }, { range: 35, head: 90, chest: 39 },
        { range: 40, head: 90, chest: 39 }, { range: 45, head: 90, chest: 39 },
        { range: 50, head: 90, chest: 39 }, { range: 60, head: 90, chest: 39 },
        { range: 70, head: 89, chest: 39 }, { range: 80, head: 89, chest: 38 },
        { range: 90, head: 89, chest: 38 }, { range: 100, head: 88, chest: 38 },
        { range: 150, head: 87, chest: 38 }, { range: 200, head: 86, chest: 37 },
        { range: 250, head: 84, chest: 36 }, { range: 300, head: 83, chest: 36 },
    ],
    aug: [
        { range: 10, head: 89, chest: 38 }, { range: 15, head: 88, chest: 38 },
        { range: 20, head: 88, chest: 38 }, { range: 25, head: 88, chest: 38 },
        { range: 30, head: 88, chest: 38 }, { range: 35, head: 88, chest: 38 },
        { range: 40, head: 87, chest: 38 }, { range: 45, head: 87, chest: 38 },
        { range: 50, head: 87, chest: 38 }, { range: 60, head: 87, chest: 37 },
        { range: 70, head: 86, chest: 37 }, { range: 80, head: 86, chest: 37 },
        { range: 90, head: 86, chest: 37 }, { range: 100, head: 85, chest: 37 },
        { range: 150, head: 84, chest: 36 }, { range: 200, head: 82, chest: 35 },
        { range: 250, head: 80, chest: 34 }, { range: 300, head: 78, chest: 34 },
    ],
    // Provided tables had ASM, but no asset. Adding placeholder data structure for logic.
    asm: [
        { range: 10, head: 87, chest: 37 }, { range: 15, head: 86, chest: 37 },
        { range: 20, head: 86, chest: 37 }, { range: 25, head: 86, chest: 37 },
        { range: 30, head: 86, chest: 37 }, { range: 35, head: 86, chest: 37 },
        { range: 40, head: 86, chest: 37 }, { range: 45, head: 86, chest: 37 },
        { range: 50, head: 85, chest: 37 }, { range: 60, head: 85, chest: 37 },
        { range: 70, head: 85, chest: 37 }, { range: 80, head: 85, chest: 36 },
        { range: 90, head: 84, chest: 36 }, { range: 100, head: 84, chest: 36 },
        { range: 150, head: 82, chest: 36 }, { range: 200, head: 81, chest: 35 },
        { range: 250, head: 79, chest: 34 }, { range: 300, head: 78, chest: 34 },
    ]
};

const STATS_NA = { head: 'N/A', chest: 'N/A' };

const WEAPONS_DATA = [
    // --- ARs ---
    { id: 'm762', name: 'M762', type: 'AR', image: m762, stats: { head: 100, chest: 43 } },
    { id: 'aug', name: 'AUG', type: 'AR', image: aug, stats: { head: 89, chest: 38 }, hasRange: true },
    { id: 'm416', name: 'M416', type: 'AR', image: m416, stats: { head: 89, chest: 38 }, hasRange: true },
    { id: 'scarl', name: 'SCAR-L', type: 'AR', image: scarl, stats: { head: 91, chest: 39 }, hasRange: true },
    { id: 'akm', name: 'AKM', type: 'AR', image: akm, stats: { head: 104, chest: 45 } },
    { id: 'groza', name: 'Groza', type: 'AR', image: groza, stats: { head: 104, chest: 45 } },
    { id: 'ace32', name: 'ACE32', type: 'AR', image: ace32, stats: { head: 97, chest: 42 } },
    { id: 'honeybg', name: 'Honey Badger', type: 'AR', image: honeybadger, stats: { head: 93, chest: 40 } },
    { id: 'qbz', name: 'QBZ', type: 'AR', image: qbz, stats: { head: 91, chest: 39 } },
    { id: 'mutant', name: 'Mk47 Mutant', type: 'AR', image: mk47, stats: { head: 104, chest: 45 } },
    { id: 'famas', name: 'FAMAS', type: 'AR', image: famas, stats: STATS_NA },
    { id: 'g36c', name: 'G36C', type: 'AR', image: g36c, stats: STATS_NA },
    { id: 'm16a4', name: 'M16A4', type: 'AR', image: m16a4, stats: STATS_NA },
    // ASM would go here but no image

    // --- DMRs ---
    { id: 'mini14', name: 'Mini14', type: 'DMR', image: mini14, stats: { head: 112, chest: 53 } },
    { id: 'sks', name: 'SKS', type: 'DMR', image: sks, stats: { head: 126, chest: 57 } },
    { id: 'mk12', name: 'Mk12', type: 'DMR', image: mk12, stats: { head: 107, chest: 46 } },
    { id: 'slr', name: 'SLR', type: 'DMR', image: slr, stats: { head: 133, chest: 57 } },
    { id: 'mk14', name: 'Mk14', type: 'DMR', image: mk14, stats: { head: 140, chest: 60 } },
    { id: 'vss', name: 'VSS', type: 'DMR', image: vss, stats: { head: 98, chest: 42 } },
    { id: 'qbu', name: 'QBU', type: 'DMR', image: qbu, stats: { head: 126, chest: 54 } },
    { id: 'win94', name: 'Win94', type: 'DMR', image: win94, stats: STATS_NA },

    // --- Shotguns ---
    { id: 's12k', name: 'S12K', type: 'Shotgun', image: s12k, stats: { head: 295, chest: 206 } },
    { id: 's1897', name: 'S1897', type: 'Shotgun', image: s1897, stats: { head: 320, chest: 224 } },
    { id: 'dbs', name: 'DBS', type: 'Shotgun', image: dbs, stats: { head: 278, chest: 203 } },
    { id: 's686', name: 'S686', type: 'Shotgun', image: s686, stats: { head: 322, chest: 225 } },
    { id: 'm1014', name: 'M1014', type: 'Shotgun', image: m1014, stats: { head: 320, chest: 224 } },
    { id: 'ns2000', name: 'NS2000', type: 'Shotgun', image: ns2000, stats: { head: 348, chest: 244 } },

    // --- Snipers ---
    { id: 'awm', name: 'AWM', type: 'Sniper', image: awm, stats: STATS_NA },
    { id: 'amr', name: 'AMR', type: 'Sniper', image: amr, stats: STATS_NA },
    { id: 'm24', name: 'M24', type: 'Sniper', image: m24, stats: STATS_NA },
    { id: 'k98', name: 'Kar98k', type: 'Sniper', image: k98, stats: STATS_NA },
    { id: 'mosin', name: 'Mosin Nagant', type: 'Sniper', image: mosin, stats: STATS_NA },
    { id: 'dsr', name: 'DSR', type: 'Sniper', image: dsr, stats: STATS_NA },

    // --- SMG ---
    { id: 'ump45', name: 'UMP45', type: 'SMG', image: ump45, stats: STATS_NA },
    { id: 'uzi', name: 'Micro UZI', type: 'SMG', image: uzi, stats: STATS_NA },
    { id: 'vector', name: 'Vector', type: 'SMG', image: vector, stats: STATS_NA },
    { id: 'tommy', name: 'Tommy Gun', type: 'SMG', image: tommy, stats: STATS_NA },
    { id: 'pp19', name: 'PP-19 Bizon', type: 'SMG', image: pp19, stats: STATS_NA },
    { id: 'p90', name: 'P90', type: 'SMG', image: p90, stats: STATS_NA },
    { id: 'mp5k', name: 'MP5K', type: 'SMG', image: mp5k, stats: STATS_NA },

    // --- LMG ---
    { id: 'mg3', name: 'MG3', type: 'LMG', image: mg3, stats: STATS_NA },

    // --- Pistol ---
    { id: 'p1911', name: 'P1911', type: 'Pistol', image: p1911, stats: STATS_NA },
    { id: 'p92', name: 'P92', type: 'Pistol', image: p92, stats: STATS_NA },
    { id: 'p18c', name: 'P18C', type: 'Pistol', image: p18c, stats: STATS_NA },
    { id: 'deagle', name: 'Deagle', type: 'Pistol', image: deagle, stats: STATS_NA },
    { id: 'r1895', name: 'R1895', type: 'Pistol', image: r1895, stats: STATS_NA },
    { id: 'r45', name: 'R45', type: 'Pistol', image: r45, stats: STATS_NA },
    { id: 'sawedoff', name: 'Sawed-off', type: 'Pistol', image: sawedoff, stats: STATS_NA },
    { id: 'skorpion', name: 'Skorpion', type: 'Pistol', image: skorpion, stats: STATS_NA },
    { id: 'flare', name: 'Flare Gun', type: 'Pistol', image: flare, stats: STATS_NA },
    { id: 'mp7', name: 'MP7', type: 'Pistol', image: mp7, stats: STATS_NA },

    // --- Melee ---
    { id: 'pan', name: 'Pan', type: 'Melee', image: pan, stats: STATS_NA },
    { id: 'machete', name: 'Machete', type: 'Melee', image: machete, stats: STATS_NA },
    { id: 'sickle', name: 'Sickle', type: 'Melee', image: sickle, stats: STATS_NA },

    // --- Crossbow ---
    { id: 'crossbow', name: 'Crossbow', type: 'Other', image: crossbow, stats: STATS_NA },
];

const CATEGORIES = ['All', 'AR', 'DMR', 'Shotgun', 'Sniper', 'SMG', 'LMG', 'Pistol', 'Melee', 'Other'];

// Range Stats Modal
const RangeStatsModal = ({ weaponId, weaponName, onClose }) => {
    const stats = RANGE_STATS[weaponId === 'asm' ? 'asm' : weaponId] || []; // Handle logic binding

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {weaponName}
                            <span className="text-sm font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Damage Drop-off</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Damage values over distance (Meters)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-auto p-0 scrollbar-hide">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-[#121212] sticky top-0 z-10 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-3 font-medium">Range (m)</th>
                                <th className="px-6 py-3 font-medium text-white/90">Head Damage</th>
                                <th className="px-6 py-3 font-medium text-white/90">Chest Damage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.map((row, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3 font-mono text-purple-400">{row.range}m</td>
                                    <td className="px-6 py-3 text-gray-300 font-medium">{row.head}</td>
                                    <td className="px-6 py-3 text-gray-300 font-medium">{row.chest}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#0a0a0a] text-xs text-center text-gray-600">
                    Values based on 4.1 Update statistics
                </div>
            </div>
        </div>
    );
};


const Weaponary = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRangeWeapon, setSelectedRangeWeapon] = useState(null); // { id, name }

    const filteredWeapons = WEAPONS_DATA.filter(weapon => {
        const matchesCategory = selectedCategory === 'All' || weapon.type === selectedCategory;
        const matchesSearch = weapon.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Weaponry</h1>
                    <p className="text-gray-400 mt-1 max-w-2xl">
                        Comprehensive database of weapon mechanics and damage statistics.
                    </p>
                </div>

                {/* Search */}
                <div className="relative group w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search weapon..."
                        className="w-full bg-[#121212] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${selectedCategory === cat
                            ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                            : 'bg-[#121212] text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-white/5'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWeapons.map((weapon) => (
                    <div
                        key={weapon.id}
                        className="group relative bg-[#121212] border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.1)] flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="h-32 mb-6 flex items-center justify-center relative overflow-hidden rounded-lg bg-black/20 group-hover:bg-purple-900/5 transition-colors">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img
                                src={weapon.image}
                                alt={weapon.name}
                                className="w-[85%] h-full object-contain drop-shadow-2xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">{weapon.name}</h3>
                                    <span className="text-xs font-medium text-gray-500 px-2 py-0.5 rounded bg-white/5 border border-white/5 uppercase tracking-wider">
                                        {weapon.type}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <div className={`bg-[#0a0a0a] rounded-lg p-3 border border-white/5 transition-colors ${weapon.stats.head === 'N/A' ? 'opacity-50' : 'group-hover:border-purple-500/10'}`}>
                                    <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                                        <Crosshair size={12} />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Head</span>
                                    </div>
                                    <div className="text-xl font-bold text-white">
                                        {weapon.stats.head}
                                        {weapon.stats.head !== 'N/A' && <span className="text-[10px] text-gray-600 font-normal ml-0.5">DMG</span>}
                                    </div>
                                </div>

                                <div className={`bg-[#0a0a0a] rounded-lg p-3 border border-white/5 transition-colors ${weapon.stats.chest === 'N/A' ? 'opacity-50' : 'group-hover:border-purple-500/10'}`}>
                                    <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                                        <Shield size={12} />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">Chest</span>
                                    </div>
                                    <div className="text-xl font-bold text-white">
                                        {weapon.stats.chest}
                                        {weapon.stats.chest !== 'N/A' && <span className="text-[10px] text-gray-600 font-normal ml-0.5">DMG</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Range Stats Button */}
                            {weapon.hasRange && (
                                <button
                                    onClick={() => setSelectedRangeWeapon({ id: weapon.id, name: weapon.name })}
                                    className="w-full mt-3 py-2 flex items-center justify-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-semibold transition-all"
                                >
                                    <TrendingDown size={14} />
                                    View Range Drop-off
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredWeapons.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                    <Info size={24} className="mb-2 opacity-50" />
                    <p>No weapons found matching "{searchQuery}"</p>
                </div>
            )}

            {/* Modal */}
            {selectedRangeWeapon && (
                <RangeStatsModal
                    weaponId={selectedRangeWeapon.id}
                    weaponName={selectedRangeWeapon.name}
                    onClose={() => setSelectedRangeWeapon(null)}
                />
            )}
        </div>
    );
};

export default Weaponary;
