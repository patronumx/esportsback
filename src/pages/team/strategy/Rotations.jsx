import React, { useState, useMemo, useEffect } from 'react';
import { Layers, Map as MapIcon, Flag, Navigation, ShieldAlert, BadgeCheck, Clock, ChevronRight, ChevronDown, Trophy, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'; // Redux Hooks
import LeafletMapCanvas from '../../../components/strategy/LeafletMapCanvas';
import MapTools from '../../../components/strategy/MapTools';
import StrategySaveModal from '../../../components/strategy/StrategySaveModal';
import StrategyLoadModal from '../../../components/strategy/StrategyLoadModal';
import erangelMap from '../../../assets/maps/ERANGEL.jpg';
import miramarMap from '../../../assets/maps/MIRAMAR.jpg';
import rondoMap from '../../../assets/maps/RONDO.jpg';
import axios from 'axios';
import { ZONE_RADII } from '../../../utils/esportsConstants';
import { showToast } from '../../../utils/toast';
import { fetchMapHistory, loadMapFromHistory } from '../../../store/slices/mapDropSlice'; // Import mapDrop actions

const MAPS = [
    { id: 'erangel', name: 'Erangel', image: erangelMap },
    { id: 'miramar', name: 'Miramar', image: miramarMap },
    { id: 'rondo', name: 'Rondo', image: rondoMap },
];

// Mock Chokepoints (Danger Zones)
const CHOKEPOINTS = {
    erangel: [
        { id: 'cp1', tool: 'circle', x: 1000, y: 1500, radius: 100, color: 'rgba(239, 68, 68, 0.5)', label: 'Military Bridge (West)' },
        { id: 'cp2', tool: 'circle', x: 1400, y: 1500, radius: 100, color: 'rgba(239, 68, 68, 0.5)', label: 'Military Bridge (East)' },
        { id: 'cp3', tool: 'circle', x: 950, y: 900, radius: 150, color: 'rgba(239, 68, 68, 0.5)', label: 'Pochinki Fields' },
    ],
    miramar: [
        { id: 'cp_m1', tool: 'circle', x: 1024, y: 1024, radius: 200, color: 'rgba(239, 68, 68, 0.5)', label: 'Pecado Stadium' },
    ]
};

// Custom 6 Colors for Rotations
const ROTATION_COLORS = [
    '#ffffff', // White
    '#ef4444', // Red (Enemy/Danger)
    '#3b82f6', // Blue (Friendly/Alt)
    '#22c55e', // Green (Safe/Loot)
    '#eab308', // Yellow (Warning)
    '#a855f7', // Purple (Rotation)
    '#f97316', // Orange
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#14b8a6', // Teal
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#d946ef', // Fuchsia
    '#f43f5e', // Rose
    '#64748b', // Slate
    '#0ea5e9', // Sky
    '#10b981', // Emerald
];

const Rotations = () => {
    const dispatch = useDispatch();
    const { mapHistory } = useSelector(state => state.mapDrop);

    // State
    const [currentMapId, setCurrentMapId] = useState('erangel');
    const [tool, setTool] = useState('cursor');
    const [color, setColor] = useState('#ef4444');
    const [objects, setObjects] = useState([]);
    const [activeLayer, setActiveLayer] = useState('primary'); // primary, alternate, emergency
    const [showChokepoints, setShowChokepoints] = useState(false);
    const [activeTab, setActiveTab] = useState('planning');

    // Loading/Saving
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // History State
    const [past, setPast] = React.useState([]);
    const [future, setFuture] = React.useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // Save/Load Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

    // --- EVENTS / DROP SPOTS LOGIC ---
    useEffect(() => {
        dispatch(fetchMapHistory());
    }, [dispatch]);

    const groupedHistory = useMemo(() => {
        const groups = {};
        if (!mapHistory) return groups;
        const sortedHistory = [...mapHistory].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        sortedHistory.forEach(item => {
            const eventName = item.title || 'Uncategorized';
            const stageName = item.stage || 'General';
            const dayName = item.day || 'Day 1';

            if (!groups[eventName]) groups[eventName] = {};
            if (!groups[eventName][stageName]) groups[eventName][stageName] = {};
            if (!groups[eventName][stageName][dayName]) groups[eventName][stageName][dayName] = [];

            groups[eventName][stageName][dayName].push(item);
        });
        return groups;
    }, [mapHistory]);

    const [isEventsOpen, setIsEventsOpen] = useState(false);
    const [expandedEvents, setExpandedEvents] = useState({});
    const [expandedStages, setExpandedStages] = useState({});
    const [expandedDays, setExpandedDays] = useState({});
    // Flag to skip fetching default rotation when loading an event map
    const skipFetchRef = React.useRef(false);

    const toggleEvent = (evt) => setExpandedEvents(prev => ({ ...prev, [evt]: !prev[evt] }));
    const toggleStage = (evt, stg) => {
        const key = `${evt}-${stg}`;
        setExpandedStages(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const toggleDay = (evt, stg, day, e) => {
        if (e) e.stopPropagation();
        const key = `${evt}-${stg}-${day}`;
        setExpandedDays(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const [confirmModal, setConfirmModal] = useState(null);

    const loadDropSpotMap = (mapData) => {
        setConfirmModal({
            title: 'Load Event Map?',
            message: `Load "${mapData.title || 'Untitled'}"? This will allow you to analyse the drop spots but will REPLACE your current canvas drawings.`,
            confirmText: 'Load Map',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    // 1. Try to fetch existing Event Strategy first
                    const targetMap = mapData.mapName ? mapData.mapName.toLowerCase() : 'erangel';
                    const targetTeamId = `event_${mapData._id}`;
                    const eventStrategyRes = await axios.get(`https://petite-towns-follow.loca.lt/api/rotations/${targetMap}/${targetTeamId}?t=${Date.now()}`);

                    let newObjs = [];

                    // Strict Check: Only use strategy if it matches the EVENT ID (ignore global fallback)
                    if (eventStrategyRes.data &&
                        eventStrategyRes.data.objects &&
                        eventStrategyRes.data.objects.length > 0 &&
                        eventStrategyRes.data.teamId === targetTeamId) {

                        newObjs = eventStrategyRes.data.objects;
                        showToast.success(`Loaded Analysis for: ${mapData.title}`);
                    } else {
                        // Fetch FULL map data by ID (Raw)
                        const fullMap = await dispatch(loadMapFromHistory(mapData._id)).unwrap();
                        newObjs = fullMap.objects || [];
                        showToast.success(`Loaded Raw Data: ${mapData.title}`);
                    }

                    // Switch Map Background
                    if (mapData.mapName && mapData.mapName.toLowerCase() !== currentMapId) {
                        skipFetchRef.current = true;
                        setCurrentMapId(mapData.mapName.toLowerCase());
                    }

                    updateObjectsWithHistory(newObjs);
                    setIsEventsOpen(false);
                    setConfirmModal(null);
                } catch (err) {
                    console.error("Failed to load map details:", err);
                    showToast.error("Failed to load map details.");
                    setConfirmModal(null);
                }
            },
            onCancel: () => setConfirmModal(null)
        });
    };

    const handleUndo = () => {
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        setFuture([objects, ...future]);
        setPast(newPast);
        setObjects(previous);
    };

    const handleRedo = () => {
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);
        setPast([...past, objects]);
        setFuture(newFuture);
        setObjects(next);
    };

    const updateObjectsWithHistory = (newObjs) => {
        if (newObjs !== objects) {
            setPast([...past, objects]);
            setFuture([]); // Clear future
            setObjects(newObjs);
        }
    };


    // Get User Info (Need Team ID)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teamId = user.teamId || user._id;

    // Derived State
    const currentMap = MAPS.find(m => m.id === currentMapId) || MAPS[0];

    // Fetch Rotations
    useEffect(() => {
        if (!teamId) return;

        if (skipFetchRef.current) {
            skipFetchRef.current = false;
            return;
        }

        const fetchRotations = async () => {
            setLoading(true);
            try {
                // Determine API URL - this will return Global Default if team specific doesn't exist
                const res = await axios.get(`https://petite-towns-follow.loca.lt/api/rotations/${currentMapId}/${teamId}`);
                if (res.data && res.data.objects) {
                    setObjects(res.data.objects);
                } else {
                    setObjects([]);
                }
            } catch (err) {
                console.error('Error fetching rotations:', err);
                setObjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRotations();
    }, [currentMapId, teamId]);

    const handleConfirmSave = async (title) => {
        setSaving(true);
        try {
            // Use local API for strategies if that's preferred, but keeping consistent with TeamMapViewer
            const payload = {
                mapName: currentMapId.toUpperCase(),
                title,
                objects,
                thumbnailUrl: null,
                type: 'rotation' // Explicitly mark as rotation plan
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            console.log('Frontend: Saving objects to backend:', JSON.stringify(objects, null, 2));

            await axios.post('https://petite-towns-follow.loca.lt/api/strategies', payload, config);
            showToast.success('Strategy saved successfully!');
            setIsSaveModalOpen(false);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                showToast.error('Session expired. Please login again.');
            } else {
                showToast.error('Failed to save strategy.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleLoadStrategy = (strategy) => {
        setPast([]);
        setFuture([]);
        // Convert map name to id if needed, or assume strategy.mapName works
        const mapId = strategy.mapName.toLowerCase();
        setCurrentMapId(mapId);
        setObjects(strategy.objects);
        setIsLoadModalOpen(false);
        showToast.success(`Loaded strategy: ${strategy.title}`);
    };

    const handleAddObject = (newObj) => {
        const enrichedObj = {
            ...newObj,
            id: Date.now().toString(),
            layer: activeLayer,
        };
        setObjects([...objects, enrichedObj]);
    };

    const handleUpdateObject = (id, newProps) => {
        setObjects(objects.map(obj => obj.id === id ? { ...obj, ...newProps } : obj));
    };

    const handleDeleteObject = (id) => {
        setObjects(objects.filter(obj => obj.id !== id));
    };

    // Propagate changes via history
    const handleObjectsChange = (newObjs) => {
        updateObjectsWithHistory(newObjs);
    };

    const spawnScenario = () => {
        // Clear existing zones
        const otherObjects = objects.filter(o => o.tool !== 'zone');
        // Canvas size from user data (Internal logic scale)
        const MAP_SIZE = 2048;
        // FIXED Center
        const centerX = MAP_SIZE / 2;
        const centerY = MAP_SIZE / 2;
        const newZones = [];
        // Spawn 8 Exact Concentric Circles at Center
        for (let i = 1; i <= 8; i++) {
            newZones.push({
                id: `zone-${i}-${Date.now()}`,
                tool: 'zone',
                phase: i,
                x: centerX,
                y: centerY,
                radius: (ZONE_RADII[`P${i}`] || 100) * 0.582, // Scaled for 2048px map
                stroke: 'white',
                strokeWidth: 8
            });
        }
        updateObjectsWithHistory([...otherObjects, ...newZones]);
        setTool('select');
        showToast.success("Generated 8 Exact Zones");
    };

    // Filter objects for display (All + Layer Toggles if implemented, currently showing all for simplicity in planning)
    // Actually, keeping the toggle logic is good for viewing.
    const displayObjects = useMemo(() => {
        let objs = [...objects];

        // Add Chokepoints if toggled
        if (showChokepoints && CHOKEPOINTS[currentMapId]) {
            objs = [...objs, ...CHOKEPOINTS[currentMapId]];
        }

        return objs.filter(obj => {
            if (activeTab === 'planning') return true;
            // Add more filters if needed
            return true;
        });
    }, [objects, activeTab, showChokepoints, currentMapId]);

    // Sync: Selection -> Color Picker
    useEffect(() => {
        if (selectedId) {
            const obj = objects.find(o => o.id === selectedId);
            if (obj && obj.color && obj.color !== color) {
                setColor(obj.color);
            }
        }
    }, [selectedId, objects]);

    // Sync: Color Picker -> Selected Object
    useEffect(() => {
        if (selectedId && color) {
            const obj = objects.find(o => o.id === selectedId);
            if (obj && obj.color !== color) {
                // Determine if we should update history or just state (history is safer for undo)
                const newObjs = objects.map(o => o.id === selectedId ? { ...o, color } : o);
                // Update without adding to history to avoid 100 history entries for dragging slider?
                // But MapTools usually has preset colors.
                // If it's a click, history is fine.
                // We use updateObjectsWithHistory
                updateObjectsWithHistory(newObjs);
            }
        }
    }, [color]); // Trigger only when color changes (not when objects change to avoid loops)

    // Keyboard Delete Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                // Ignore if typing in an input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                const newObjs = objects.filter(o => o.id !== selectedId);
                updateObjectsWithHistory(newObjs);
                setSelectedId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, objects]);

    // --- Download Logic ---
    const handleDownload = async () => {
        const element = document.querySelector('.leaflet-container');
        if (!element) return;

        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(element, {
                cacheBust: true,
                backgroundColor: '#171717',
                pixelRatio: 1
            });

            const link = document.createElement('a');
            link.download = `rotation-plan-${currentMapId}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            showToast.success("Rotation plan downloaded");
        } catch (error) {
            console.error("Download failed:", error);
            showToast.error("Failed to download plan");
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-[#09090b] text-white">

            {/* Sidebar (Tools) - Order 2 on Mobile (Bottom), Order 1 on Desktop (Left) */}
            <div className="w-full md:w-80 h-[45vh] md:h-full flex-shrink-0 border-t md:border-t-0 md:border-r border-white/5 bg-[#09090b] flex flex-col z-20 shadow-2xl order-2 md:order-1 overflow-hidden">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between md:block">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-1">
                            STRATEGY HUB
                        </h1>
                        <p className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">Rotations & Pathing</p>
                    </div>
                    {/* Mobile Only Save Button in Header for quick access */}
                    <button
                        onClick={() => setIsSaveModalOpen(true)}
                        className="md:hidden text-xs bg-purple-600 px-3 py-1.5 rounded-lg font-bold"
                    >
                        SAVE
                    </button>
                </div>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">

                    {/* Map Selection */}
                    <div className="grid grid-cols-3 gap-2">
                        {MAPS.map(map => (
                            <button
                                key={map.id}
                                onClick={() => setCurrentMapId(map.id)}
                                className={`relative group overflow-hidden rounded-xl aspect-square border-2 transition-all duration-300 ${currentMapId === map.id
                                    ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
                                    }`}
                            >
                                <img src={map.image} alt={map.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center p-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${currentMapId === map.id ? 'text-white' : 'text-gray-400'}`}>
                                        {map.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Annotation Tools */}
                    <MapTools
                        activeTool={tool}
                        setActiveTool={setTool}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={past.length > 0}
                        canRedo={future.length > 0}
                        onClear={() => updateObjectsWithHistory([])}
                        onDeleteSelected={() => {
                            if (selectedId) {
                                const newObjs = objects.filter(o => o.id !== selectedId);
                                updateObjectsWithHistory(newObjs);
                                setSelectedId(null);
                            }
                        }}
                        hasSelection={!!selectedId}
                        color={color}
                        setColor={setColor}
                        customColors={ROTATION_COLORS} // Restrict to 6 colors
                        onSpawnZone={spawnScenario}
                        hideSaveLoad={false}
                        onSave={() => setIsSaveModalOpen(true)}
                        onLoad={() => setIsLoadModalOpen(true)}
                        onDownload={handleDownload}
                    />

                    {/* Controls & Layers */}
                    <div className="bg-[#121212] rounded-2xl p-4 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Layers size={14} /> Layers
                            </h3>
                            <button
                                onClick={() => setIsSaveModalOpen(true)}
                                disabled={saving}
                                className="hidden md:block text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-bold transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Plan"}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {[
                                { id: 'primary', label: 'Primary Route', color: '#ef4444' },
                                { id: 'alternate', label: 'Alternate Route', color: '#3b82f6' },
                                { id: 'emergency', label: 'Emergency', color: '#eab308' }
                            ].map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => { setActiveLayer(layer.id); setColor(layer.color); }}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${activeLayer === layer.id
                                        ? 'bg-white/5 border-purple-500/50 text-white shadow-lg'
                                        : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-sm font-medium">{layer.label}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: layer.color, backgroundColor: layer.color }} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Toolbar / Events Dropdown */}
            <div className="absolute top-4 right-4 z-[100] flex gap-3">
                {/* Events Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsEventsOpen(!isEventsOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xl backdrop-blur-md border border-white/10 ${isEventsOpen
                            ? 'bg-purple-600 text-white shadow-purple-900/40'
                            : 'bg-black/60 text-gray-300 hover:bg-black/80 hover:text-white'
                            }`}
                    >
                        <Trophy size={14} className={isEventsOpen ? 'text-white' : 'text-purple-400'} />
                        EVENTS
                        <ChevronDown size={14} className={`transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isEventsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-72 max-h-[60vh] overflow-y-auto bg-[#09090b]/95 border border-white/10 rounded-xl shadow-2xl z-[2000] custom-scrollbar backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-3 border-b border-white/10 sticky top-0 bg-[#09090b] z-10">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Event Map</span>
                            </div>
                            <div className="p-2 space-y-1">
                                {Object.keys(groupedHistory).length === 0 ? (
                                    <div className="text-center text-gray-500 py-4 text-xs">No Event Data Found</div>
                                ) : (
                                    Object.entries(groupedHistory).map(([eventName, stages]) => (
                                        <div key={eventName} className="border border-white/5 rounded-lg overflow-hidden bg-white/[0.02]">
                                            <button onClick={() => toggleEvent(eventName)} className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors text-left">
                                                <span className="font-bold text-xs text-purple-200">{eventName}</span>
                                                {expandedEvents[eventName] ? <ChevronDown size={12} className="text-purple-400" /> : <ChevronRight size={12} className="text-gray-600" />}
                                            </button>
                                            {expandedEvents[eventName] && (
                                                <div className="bg-black/20 border-t border-white/5">
                                                    {Object.entries(stages).map(([stageName, days]) => {
                                                        const stageKey = `${eventName}-${stageName}`;
                                                        return (
                                                            <div key={stageKey} className="border-b border-white/5 last:border-0 pl-2">
                                                                <button onClick={() => toggleStage(eventName, stageName)} className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/5 transition-colors text-left">
                                                                    <span className="font-semibold text-[10px] text-blue-300">{stageName}</span>
                                                                    {expandedStages[stageKey] ? <ChevronDown size={10} className="text-blue-400" /> : <ChevronRight size={10} className="text-gray-600" />}
                                                                </button>
                                                                {expandedStages[stageKey] && (
                                                                    <div className="bg-black/40 pl-2">
                                                                        {Object.entries(days).map(([dayName, items]) => {
                                                                            const dayKey = `${eventName}-${stageName}-${dayName}`;
                                                                            return (
                                                                                <div key={dayKey}>
                                                                                    <button onClick={(e) => toggleDay(eventName, stageName, dayName, e)} className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/5 transition-colors text-left">
                                                                                        <span className="font-medium text-[10px] text-gray-400 uppercase flex items-center gap-1"><Calendar size={10} /> {dayName}</span>
                                                                                        <span className="text-[9px] bg-white/10 px-1 rounded text-gray-500">{items.length}</span>
                                                                                    </button>
                                                                                    {expandedDays[dayKey] && (
                                                                                        <div className="px-2 pb-1 space-y-0.5">
                                                                                            {items.map(item => (
                                                                                                <button key={item._id} onClick={() => loadDropSpotMap(item)} className="w-full text-left bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-white p-1.5 rounded text-[10px] flex items-center gap-2 group border border-transparent hover:border-purple-500/30 transition-all">
                                                                                                    <MapIcon size={10} className="text-gray-500 group-hover:text-purple-400" />
                                                                                                    <span className="truncate">{item.matchNumber ? `Match ${item.matchNumber}` : 'Map'}</span>
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Canvas - Order 1 on Mobile (Top), Order 2 on Desktop (Right) */}
            <div className="flex-1 relative z-0 h-[55vh] md:h-full order-1 md:order-2">
                <LeafletMapCanvas
                    mapImage={currentMap.image}
                    mapName={currentMap.name}
                    tool={tool}
                    objects={displayObjects}
                    setObjects={updateObjectsWithHistory}
                    activeLayer={activeLayer}
                    color={color}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onAddObject={(newObj) => {
                        const enriched = { ...newObj, layer: activeLayer, id: Date.now().toString() };
                        updateObjectsWithHistory([...objects, enriched]);
                    }}
                    onUpdateObject={(id, props) => {
                        const newObjs = objects.map(o => o.id === id ? { ...o, ...props } : o);
                        updateObjectsWithHistory(newObjs);
                    }}
                    isMobile={window.innerWidth < 768} // Pass basic mobile flag layout hint
                />
            </div>

            {/* Modals */}
            <StrategyLoadModal
                isOpen={isLoadModalOpen}
                onClose={() => setIsLoadModalOpen(false)}
                onLoadStrategy={handleLoadStrategy}
                type="rotation"
            />

            <StrategySaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={(title) => handleConfirmSave(title, 'rotation')} // Added 'rotation' type
                defaultTitle={`Rotation Plan ${new Date().toLocaleDateString()}`}
            />

            {/* CONFIRMATION MODAL */}
            {confirmModal && (
                <div className="absolute inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-purple-500" />
                            {confirmModal.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            {confirmModal.message}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={confirmModal.onCancel}
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors border border-transparent hover:border-white/5"
                            >
                                {confirmModal.cancelText || 'Cancel'}
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105"
                            >
                                {confirmModal.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Rotations;
