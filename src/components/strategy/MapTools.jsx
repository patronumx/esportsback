import React, { useState } from 'react';
import {
    MousePointer2,
    ChevronLeft,
    ChevronDown,
    Trash2,
    Palette,
    MapPin, // Drop
    Plane, // Flight Path
    Pencil,
    Minus, // Line
    Square, // Rectangle
    Circle,
    Type, // Text
    RotateCcw,
    RotateCw,
    UserX,
    Target,
    Package,
    Eraser,
    RefreshCcw,
    X,
    CarFront, // Vehicle
    Download
} from 'lucide-react';

import { showToast } from '../../utils/toast';

const COLORS = [
    '#ffffff', // White
    // ... (rest of colors)
];


const MapTools = ({
    activeTool,
    setActiveTool,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onClear,
    onSpawnZone,
    mapName,
    setMapName,
    onSave,
    onLoad,
    color,
    setColor,
    hideSaveLoad,
    onDeleteSelected,
    onRotateSelected,
    hasSelection,
    draggable = false,
    compact = false,
    customColors, // New prop
    // onDownloadAction removed
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Internal Download Handler
    // Internal Download Handler (Trigger Full Map Capture via Event)
    const handleDownload = () => {
        // Dispatch event for LeafletMapCanvas to catch
        const event = new CustomEvent('TRIGGER_MAP_DOWNLOAD', {
            detail: { mapName: mapName || 'map' }
        });
        window.dispatchEvent(event);
    };

    // Determine colors to use
    const displayColors = customColors || COLORS;




    // Group 1: Annotation Tools (as per screenshot)
    const ANNOTATION_TOOLS = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'brush', icon: Pencil, label: 'Freehand' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'text', icon: Type, label: 'Text' },
    ];

    // Group 2: Strategy Tools (Existing functionality)
    const STRATEGY_TOOLS = [
        { id: 'flight-path', icon: Plane, label: 'Flight' },
        { id: 'spawn-zone', icon: Target, label: 'Zone', action: onSpawnZone },

        { id: 'enemy', icon: UserX, label: 'Enemy' },
        { id: 'loot', icon: Package, label: 'Loot' },
        { id: 'marker', icon: MapPin, label: 'Point' },
        { id: 'vehicle', icon: CarFront, label: 'Vehicle' } // Added Vehicle
    ];

    const MAP_OPTIONS = ['ERANGEL', 'MIRAMAR', 'RONDO'];

    if (isCollapsed) return null; // Or logic for collapsed state

    return (
        <div className="w-full bg-[#09090b]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl p-4 space-y-6">

            {/* Header (Map Selector) */}
            {!hideSaveLoad && mapName && (
                <div className="relative z-50">
                    <button
                        onClick={() => setIsMapOpen(!isMapOpen)}
                        className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 px-3 rounded-lg border border-white/5 flex items-center justify-between transition-all"
                    >
                        <span className="uppercase tracking-wide flex items-center gap-2">
                            <MapPin size={12} className="text-purple-400" /> {mapName}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isMapOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMapOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#121212] border border-white/10 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                            {MAP_OPTIONS.map(map => (
                                <button
                                    key={map}
                                    onClick={() => { setMapName(map); setIsMapOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase transition-colors ${map === mapName ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    {map}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}


            {/* Annotation Tools Section */}
            <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Annotation Tools</div>
                <div className="grid grid-cols-3 gap-2">
                    {ANNOTATION_TOOLS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => t.action ? t.action() : setActiveTool(t.id)}
                            className={`relative group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 gap-2 aspect-square overflow-hidden ${activeTool === t.id
                                ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-500/50'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                }`}
                        >
                            <div className={`p-2 rounded-full transition-all duration-300 ${activeTool === t.id ? 'bg-purple-500/20' : 'bg-transparent group-hover:bg-white/5'}`}>
                                <t.icon size={22} className={`stroke-[1.5] transition-transform duration-300 ${activeTool === t.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                            </div>
                            <span className="text-[10px] font-bold tracking-wide uppercase">{t.label}</span>

                            {/* Active Indicator Dot */}
                            {activeTool === t.id && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_currentColor]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Palette Section */}
            <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Color Palette</div>
                <div className="grid grid-cols-6 gap-2">
                    {displayColors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor && setColor(c)}
                            className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#09090b]' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>

            {/* Strategy Tools Section (Separated) */}
            <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Strategy Tools</div>
                <div className="grid grid-cols-3 gap-2">
                    {STRATEGY_TOOLS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => t.action ? t.action() : setActiveTool(t.id)}
                            draggable={true}
                            onDragStart={(e) => {
                                e.stopPropagation();
                                e.dataTransfer.setData('toolType', t.id);
                                let c = color || '#ffffff';
                                if (t.id === 'enemy') c = '#ef4444';
                                if (t.id === 'loot') c = '#22c55e';
                                if (t.id === 'marker') c = '#3b82f6';
                                if (t.id === 'flight-path') c = '#FFA500';
                                if (t.id === 'vehicle') c = '#ef4444'; // Red default
                                e.dataTransfer.setData('toolColor', c);
                            }}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all gap-1 aspect-square ${activeTool === t.id
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400 hover:text-white'
                                }`}
                        >
                            <t.icon size={18} className="stroke-[1.5]" />
                            <span className="text-[9px] font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions Section (Full width buttons) */}
            <div className="space-y-2 mt-auto pt-4">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${canUndo
                        ? 'bg-white/5 border-white/5 text-gray-200 hover:bg-white/10'
                        : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                >
                    <RotateCcw size={14} /> Undo Last
                </button>

                <button
                    onClick={onDeleteSelected}
                    disabled={!hasSelection}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${hasSelection
                        ? 'bg-white/5 border-white/5 text-gray-200 hover:bg-red-500/10 hover:text-red-400'
                        : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                >
                    <X size={14} /> Delete Selected
                </button>

                <button
                    onClick={onClear}
                    className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-red-500/10 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <Eraser size={14} /> Clear Canvas
                </button>
            </div>

            {/* Save/Load (Bottom) */}
            {!hideSaveLoad && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                    {/* Download Button - Moved Above Save/Load */}
                    {/* Download Button - Internal Handler - Force Render */}
                    <button
                        onClick={handleDownload}
                        className="w-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/20 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={14} /> DOWNLOAD
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={onSave} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20 py-2 rounded-lg text-xs font-bold transition-all">SAVE</button>
                        <button onClick={onLoad} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20 py-2 rounded-lg text-xs font-bold transition-all">LOAD</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapTools;
