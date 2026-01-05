import React, { useState, useEffect } from 'react';
import { Layers, Save, RefreshCw, ChevronRight, ChevronDown, Clock, ShieldAlert, FolderOpen, Map as MapIcon, Calendar, Trophy, ChevronLeft } from 'lucide-react';
import LeafletMapCanvas from '../../../components/strategy/LeafletMapCanvas';
import MapTools from '../../../components/strategy/MapTools';
import erangelMap from '../../../assets/maps/ERANGEL.jpg';
import miramarMap from '../../../assets/maps/MIRAMAR.jpg';
import rondoMap from '../../../assets/maps/RONDO.jpg';
import { ZONE_RADII } from '../../../utils/esportsConstants';
import axios from 'axios';

// Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchMapHistory, loadMapFromHistory } from '../../../store/slices/mapDropSlice';

import Toast from '../../../components/common/Toast';

const MAPS = [
    { id: 'erangel', name: 'Erangel', image: erangelMap },
    { id: 'miramar', name: 'Miramar', image: miramarMap },
    { id: 'rondo', name: 'Rondo', image: rondoMap },
];

const AdminRotations = () => {
    // Redux Hook
    const dispatch = useDispatch();
    const { mapHistory } = useSelector((state) => state.mapDrop);

    // State
    const [selectedTeamId] = useState('global'); // Admin edits Global Default
    const [currentMapId, setCurrentMapId] = useState('erangel');
    const [selectedId, setSelectedId] = useState(null); // Map Object Selection

    // Tools State
    const [tool, setTool] = useState('cursor');
    const [color, setColor] = useState('#ef4444');
    const [objects, setObjects] = useState([]);
    const [activeLayer, setActiveLayer] = useState('primary'); // primary, alternate, emergency
    const [isPlanningCollapsed, setIsPlanningCollapsed] = useState(false);

    // Events / Drop Spots Sidebar State
    const [isEventsOpen, setIsEventsOpen] = useState(false);
    const [expandedEvents, setExpandedEvents] = useState({});
    const [expandedStages, setExpandedStages] = useState({});
    const [expandedDays, setExpandedDays] = useState({});

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Toast State
    const [toast, setToast] = useState(null);

    const currentMap = MAPS.find(m => m.id === currentMapId) || MAPS[0];

    // Fetch Rotations when Map changes
    const fetchRotations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://petite-towns-follow.loca.lt/api/rotations/${currentMapId}/${selectedTeamId}`);
            if (res.data && res.data.objects) {
                setObjects(res.data.objects);
                // Also update history to base
                setHistory([res.data.objects]); // Reset history to loaded state
                setHistoryIndex(0);
                setToast({ message: 'Loaded Saved Default Plan', type: 'success' });
            } else {
                setObjects([]);
                setHistory([[]]);
                setHistoryIndex(0);
                setToast({ message: 'No saved plan found. Starting fresh.', type: 'info' });
            }
        } catch (err) {
            console.error('Error fetching rotation plan:', err);
            setObjects([]);
            setToast({ message: 'Failed to load rotations', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Flag to skip fetching default rotation when loading an event map
    const skipFetchRef = React.useRef(false);
    const [currentEventId, setCurrentEventId] = useState(null);

    useEffect(() => {
        if (!currentMapId) return;

        if (skipFetchRef.current) {
            skipFetchRef.current = false;
            return;
        }

        // Reset event context if map manually changed
        setCurrentEventId(null);

        fetchRotations();
        dispatch(fetchMapHistory()); // Fetch Drop Spots Data
    }, [currentMapId, selectedTeamId, dispatch]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Determine Context: Event Strategy or Global Default?
            const saveTeamId = currentEventId ? `event_${currentEventId}` : selectedTeamId;
            const context = currentEventId ? 'Event Strategy' : 'Global Default';

            console.log(`Admin: Saving ${context} to backend:`, JSON.stringify(objects, null, 2));

            await axios.post('https://petite-towns-follow.loca.lt/api/rotations/save', {
                teamId: saveTeamId,
                mapId: currentMapId,
                objects: objects
            });
            setToast({ message: `${context} Saved Successfully!`, type: 'success' });
        } catch (err) {
            console.error('Error saving rotation plan:', err);
            setToast({ message: 'Failed to save rotation plan.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // History for Undo/Redo
    const [history, setHistory] = useState([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const updateObjectsWithHistory = (newObjects) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newObjects);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setObjects(newObjects);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setObjects(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setObjects(history[newIndex]);
        }
    };

    // Keyboard Shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [history, historyIndex]);


    const handleAddObject = (newObj) => {
        const enrichedObj = {
            ...newObj,
            id: Date.now().toString(),
            layer: activeLayer,
        };
        updateObjectsWithHistory([...objects, enrichedObj]);
    };

    const handleUpdateObject = (id, newProps) => {
        updateObjectsWithHistory(objects.map(obj => obj.id === id ? { ...obj, ...newProps } : obj));
    };

    const handleDeleteObject = (id) => {
        updateObjectsWithHistory(objects.filter(obj => obj.id !== id));
    };

    // Initial Load History Sync
    useEffect(() => {
        if (objects.length > 0 && history.length === 1 && history[0].length === 0) {
            // If objects loaded from backend, sync history base
            setHistory([objects]);
            setHistoryIndex(0);
        }
    }, [objects]); // Be careful with loop. Better to handle in fetch.

    // --- EVENTS / DROP SPOTS GROUPING LOGIC ---
    const groupedHistory = React.useMemo(() => {
        const groups = {};
        if (!mapHistory) return groups;

        // Sort by date desc first
        const sortedHistory = [...mapHistory].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        sortedHistory.forEach(item => {
            const eventName = item.title || 'Uncategorized';
            const stageName = item.stage || 'General';
            const dayName = item.day || 'Day 1'; // Default if missing

            if (!groups[eventName]) groups[eventName] = {};
            if (!groups[eventName][stageName]) groups[eventName][stageName] = {};
            if (!groups[eventName][stageName][dayName]) groups[eventName][stageName][dayName] = [];

            groups[eventName][stageName][dayName].push(item);
        });
        return groups;
    }, [mapHistory]);

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

    const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm, onCancel }

    const loadDropSpotMap = async (mapData) => {
        setConfirmModal({
            title: 'Load Event Map?',
            message: `Load "${mapData.title || 'Untitled'}"? This will allow you to see drop spots but will REPLACE your current canvas drawings.`,
            confirmText: 'Load Map',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    // 1. Try to fetch existing Event Strategy first
                    const targetTeamId = `event_${mapData._id}`;
                    const eventStrategyRes = await axios.get(`https://petite-towns-follow.loca.lt/api/rotations/${mapData.mapName ? mapData.mapName.toLowerCase() : 'erangel'}/${targetTeamId}?t=${Date.now()}`);

                    let newObjs = [];
                    // If Strategy exists AND matches event, use it. Else use Raw Drop Spots.
                    if (eventStrategyRes.data &&
                        eventStrategyRes.data.objects &&
                        eventStrategyRes.data.objects.length > 0 &&
                        eventStrategyRes.data.teamId === targetTeamId) {

                        newObjs = eventStrategyRes.data.objects;
                        setToast({ message: `Loaded Saved Strategy for: ${mapData.title}`, type: 'success' });
                    } else {
                        // Fetch FULL map data by ID (Raw)
                        const fullMap = await dispatch(loadMapFromHistory(mapData._id)).unwrap();
                        newObjs = fullMap.objects || [];
                        setToast({ message: `Loaded Raw Event Data: ${mapData.title}`, type: 'success' });
                    }

                    // Switch Map Background if valid
                    if (mapData.mapName && mapData.mapName.toLowerCase() !== currentMapId) {
                        skipFetchRef.current = true; // Signal to skip the next useEffect fetch
                        setCurrentMapId(mapData.mapName.toLowerCase());
                    }

                    setCurrentEventId(mapData._id); // Set Event Context
                    updateObjectsWithHistory(newObjs);
                    setIsEventsOpen(false);
                    setConfirmModal(null);
                } catch (err) {
                    console.error("Failed to load map details:", err);
                    setToast({ message: `Failed to load map: ${err.message}`, type: 'error' });
                    setConfirmModal(null);
                }
            },
            secondaryText: 'Load Raw Data',
            onSecondary: async () => {
                // FORCE Load Raw Data (Bypass Saved Strategy)
                try {
                    const fullMap = await dispatch(loadMapFromHistory(mapData._id)).unwrap();
                    const newObjs = fullMap.objects || [];
                    setToast({ message: `Force Loaded Raw Event Data: ${mapData.title}`, type: 'success' });

                    if (mapData.mapName && mapData.mapName.toLowerCase() !== currentMapId) {
                        skipFetchRef.current = true;
                        setCurrentMapId(mapData.mapName.toLowerCase());
                    }

                    setCurrentEventId(mapData._id);
                    updateObjectsWithHistory(newObjs);
                    setIsEventsOpen(false);
                    setConfirmModal(null);
                } catch (err) {
                    console.error("Failed to force load raw map:", err);
                    setToast({ message: `Failed to load raw map: ${err.message}`, type: 'error' });
                }
            },
            onCancel: () => setConfirmModal(null)
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0 relative z-[1001]">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Default Rotation Planner</h1>
                    <div className="flex items-center space-x-2 text-gray-400 mt-1">
                        <span>Management</span>
                        <ChevronRight size={16} />
                        <span className="text-purple-400">Global Defaults</span>
                    </div>
                </div>

                <div className="flex gap-3 items-center relative">
                    {/* Map Selector */}
                    <select
                        value={currentMapId}
                        onChange={(e) => setCurrentMapId(e.target.value)}
                        className="bg-[#121212] border border-white/10 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-32 p-2.5"
                    >
                        {MAPS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>

                    {/* Events Dropdown Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setIsEventsOpen(!isEventsOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isEventsOpen
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                : 'bg-[#121212] border border-white/10 hover:bg-white/5 text-gray-300'
                                }`}
                        >
                            <Trophy size={16} />
                            Events
                            <ChevronDown size={14} className={`transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Events Dropdown Menu */}
                        {isEventsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 max-h-[60vh] overflow-y-auto bg-[#09090b] border border-white/10 rounded-xl shadow-2xl z-[2000] custom-scrollbar backdrop-blur-xl">
                                <div className="p-3 border-b border-white/10 sticky top-0 bg-[#09090b]/95 backdrop-blur z-10 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">PMGC / Event Data</span>
                                    <button onClick={() => setIsEventsOpen(false)} className="text-gray-500 hover:text-white"><ChevronDown size={14} className="rotate-180" /></button>
                                </div>
                                <div className="p-2 space-y-1">
                                    {Object.keys(groupedHistory).length === 0 ? (
                                        <div className="text-center text-gray-500 py-8 text-xs">No Event Data Found</div>
                                    ) : (
                                        Object.entries(groupedHistory).map(([eventName, stages]) => (
                                            <div key={eventName} className="border border-white/5 rounded-lg overflow-hidden bg-white/[0.02]">
                                                <button
                                                    onClick={() => toggleEvent(eventName)}
                                                    className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors text-left"
                                                >
                                                    <span className="font-bold text-xs text-purple-200">{eventName}</span>
                                                    {expandedEvents[eventName] ? <ChevronDown size={12} className="text-purple-400" /> : <ChevronRight size={12} className="text-gray-600" />}
                                                </button>

                                                {expandedEvents[eventName] && (
                                                    <div className="bg-black/20 border-t border-white/5">
                                                        {Object.entries(stages).map(([stageName, days]) => {
                                                            const stageKey = `${eventName}-${stageName}`;
                                                            return (
                                                                <div key={stageKey} className="border-b border-white/5 last:border-0 pl-2">
                                                                    <button
                                                                        onClick={() => toggleStage(eventName, stageName)}
                                                                        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/5 transition-colors text-left"
                                                                    >
                                                                        <span className="font-semibold text-[10px] text-blue-300 pl-2 border-l-2 border-blue-500/30">{stageName}</span>
                                                                        {expandedStages[stageKey] ? <ChevronDown size={10} className="text-blue-400" /> : <ChevronRight size={10} className="text-gray-600" />}
                                                                    </button>

                                                                    {expandedStages[stageKey] && (
                                                                        <div className="bg-black/40 pl-2">
                                                                            {Object.entries(days).map(([dayName, items]) => {
                                                                                const dayKey = `${eventName}-${stageName}-${dayName}`;
                                                                                return (
                                                                                    <div key={dayKey}>
                                                                                        <button
                                                                                            onClick={(e) => toggleDay(eventName, stageName, dayName, e)}
                                                                                            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/5 transition-colors text-left"
                                                                                        >
                                                                                            <span className="font-medium text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                                                                <Calendar size={10} /> {dayName}
                                                                                            </span>
                                                                                            <span className="text-[9px] bg-white/10 px-1 rounded text-gray-500">{items.length}</span>
                                                                                        </button>

                                                                                        {expandedDays[dayKey] && (
                                                                                            <div className="px-2 pb-1 space-y-0.5">
                                                                                                {items.map(item => (
                                                                                                    <button
                                                                                                        key={item._id}
                                                                                                        onClick={() => loadDropSpotMap(item)}
                                                                                                        className="w-full text-left bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-white p-1.5 rounded text-[10px] flex items-center gap-2 group border border-transparent hover:border-purple-500/30 transition-all"
                                                                                                    >
                                                                                                        <MapIcon size={10} className="text-gray-500 group-hover:text-purple-400" />
                                                                                                        <span className="truncate">{item.matchNumber ? `Match ${item.matchNumber}` : 'Map'} - {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save/Update
                    </button>

                    <button
                        onClick={fetchRotations}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        Load Saved
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Map Area */}
                <div className="flex-1 bg-[#09090b] rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-white shadow-2xl order-2 lg:order-1">
                    <div className="absolute inset-0 z-0">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <RefreshCw className="animate-spin mb-2" /> Loading...
                            </div>
                        ) : (<LeafletMapCanvas
                            onUpdateObject={handleUpdateObject}
                            onAddObject={handleAddObject}
                            onDeleteObject={handleDeleteObject}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            tool={tool}
                            color={color}
                            mapImage={currentMap.image}
                            mapName={currentMap.name}
                            objects={objects}
                            setObjects={setObjects}
                        />
                        )}
                    </div>
                </div>

                {/* Tools Sidebar (Right Side) - Fixed Width */}
                <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto pr-1 order-1 lg:order-2 h-full flex-shrink-0">

                    {/* Layer Selector */}
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Layers size={14} /> Planning Layer
                            </h3>
                            <button
                                onClick={() => setIsPlanningCollapsed(!isPlanningCollapsed)}
                                className="text-gray-500 hover:text-white"
                            >
                                {isPlanningCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {!isPlanningCollapsed && (
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'primary', label: 'Primary Route', color: '#ef4444' },
                                    { id: 'alternate', label: 'Alternate Route', color: '#3b82f6' },
                                    { id: 'emergency', label: 'Emergency', color: '#eab308' }
                                ].map(layer => (
                                    <button
                                        key={layer.id}
                                        onClick={() => { setActiveLayer(layer.id); setColor(layer.color); }}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${activeLayer === layer.id
                                            ? 'bg-white/10 border-purple-500/50 text-white'
                                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{layer.label}</span>
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Drawing Tools */}
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-0 overflow-y-auto custom-scrollbar flex-1 min-h-[500px]">
                        <MapTools
                            activeTool={tool}
                            setActiveTool={setTool}
                            color={color}
                            setColor={setColor}
                            onClear={() => updateObjectsWithHistory([])}
                            draggable={false}
                            hideSaveLoad={true}
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            canUndo={historyIndex > 0}
                            canRedo={historyIndex < history.length - 1}
                            onSpawnZone={() => {
                                // Generate Phases 1-8
                                const newObjects = [];
                                for (let i = 1; i <= 8; i++) {
                                    const radius = ZONE_RADII[`P${i}`] || 100;
                                    newObjects.push({
                                        tool: 'zone',
                                        phase: i,
                                        id: Date.now().toString() + '-' + i,
                                        x: 1024, // Center
                                        y: 1024,
                                        // Apply scaling factor consistent with Team side (Rotations.jsx)
                                        radius: radius * 0.582,
                                        color: color || 'white'
                                    });
                                }
                                updateObjectsWithHistory([...objects, ...newObjects]);
                            }}
                        />
                    </div>
                </div>
            </div>

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

                            {/* Secondary Action (Load Raw) */}
                            {confirmModal.onSecondary && (
                                <button
                                    onClick={confirmModal.onSecondary}
                                    className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 font-medium transition-colors"
                                >
                                    {confirmModal.secondaryText}
                                </button>
                            )}

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

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminRotations;
