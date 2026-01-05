
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Shield, ChevronLeft, ChevronDown, ChevronRight, History, RotateCw,
    Trash2,
    X, FolderOpen
} from 'lucide-react';
import { fetchMapDrop, fetchMapHistory, loadMapFromHistory, addLogo, updateLogo, setObjects, clearMap, setMapName, setTitle, setStage } from '../../store/slices/mapDropSlice';
import MapLogosToolbar from '../../components/strategy/MapLogosToolbar';
import { useAuth } from '../../context/AuthContext';

import LeafletMapCanvas from '../../components/strategy/LeafletMapCanvas';
import MapTools from '../../components/strategy/MapTools';
import StrategyLoadModal from '../../components/strategy/StrategyLoadModal';
import StrategySaveModal from '../../components/strategy/StrategySaveModal';
import { ZONE_RADII } from '../../utils/esportsConstants';
import axios from 'axios';
import ERANGEL from '../../assets/maps/ERANGEL.jpg';
import MIRAMAR from '../../assets/maps/MIRAMAR.jpg';
import RONDO from '../../assets/maps/RONDO.jpg';
import { showToast } from '../../utils/toast';

const MAP_IMAGES = {
    ERANGEL,
    MIRAMAR,
    RONDO
};

// Placeholder logic: In a real app, this would come from the backend User/Team profile
// For now, we'll try to use user.teamId.logoUrl if it exists, or fallback.
const TeamMapViewer = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { mapName, objects, title, stage, loading, lastUpdated, mapHistory } = useSelector((state) => state.mapDrop);
    const [activeLogo, setActiveLogo] = React.useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = React.useState(false); // Default to CLOSED to save space

    // Tools State
    const [tool, setTool] = React.useState('select');
    const [color, setColor] = React.useState('#ffffff');
    const [selectedId, setSelectedId] = React.useState(null);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = React.useState(false);
    const [loadingId, setLoadingId] = React.useState(null);

    // Reset loadingId when global loading finishes
    useEffect(() => {
        if (!loading) setLoadingId(null);
    }, [loading]);

    // History Expansion State
    const [expandedEvents, setExpandedEvents] = React.useState({});
    const [expandedStages, setExpandedStages] = React.useState({});
    const [expandedDays, setExpandedDays] = React.useState({});

    // Grouping Logic (Matches AdminMapEditor)
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

    // Derived Team Logo
    // Backend sends `teamLogo` directly on the user object (see authController.js)
    const teamLogoUrl = user?.teamLogo || user?.team?.logoUrl || user?.logoUrl || null;
    // Note: The structure depends on how `user` is populated. 
    // If it's just { name, email, role, teamId: "..." }, we don't have the logo yet.
    // Let's assume for now we might not have it and show a graceful fallback.


    useEffect(() => {
        dispatch(clearMap());
        dispatch(fetchMapHistory());

        // Simple polling every 30 seconds for LATEST
        /*
        const interval = setInterval(() => {
            // Only poll if we are viewing the "latest" implicitly? 
            // Or maybe just refresh history check.
            // For now, let's keep polling latest.
            dispatch(fetchMapDrop());
        }, 30000);
        return () => clearInterval(interval);
        */
    }, [dispatch]);

    // Local state for loaded strategy title (overrides Admin Live Title)
    const [loadedStrategyTitle, setLoadedStrategyTitle] = React.useState(null);

    // Save/Load Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = React.useState(false);

    const handleConfirmSave = async (title) => {
        try {
            const payload = {
                mapName,
                title,
                objects,
                thumbnailUrl: null
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token} ` }
            };

            await axios.post('https://petite-towns-follow.loca.lt/api/strategies', payload, config);
            showToast.success('Strategy saved successfully!');
            setIsSaveModalOpen(false);
        } catch (error) {
            console.error(error);
            showToast.error('Failed to save strategy.');
        }
    };

    const handleSelectMap = (id) => {
        if (loading) return; // Prevent multiple clicks
        setLoadingId(id);
        dispatch(loadMapFromHistory(id));
        setLoadedStrategyTitle(null); // Clear local strategy title when loading Admin Map
    };

    const handleAddObject = (newObj) => {
        setPast([...past, objects]);
        setFuture([]);
        const id = Date.now().toString();
        dispatch(addLogo({
            ...newObj,
            id: id,
        }));
    };

    const handleUpdateObject = (id, changes) => {
        setPast([...past, objects]);
        setFuture([]);
        dispatch(updateLogo({ id, changes }));
    };

    const handleMapChange = (name) => {
        // Map change is a destructive action for context, maybe we don't undo across maps easily?
        // Or we treat it as an action.
        // For now, let's leave map switch out of history or clear history?
        // Existing logic clears map.
        dispatch(setMapName(name));
        dispatch(clearMap());
        dispatch(setTitle('')); // Clear Event Title
        dispatch(setStage('')); // Clear Stage
        setLoadedStrategyTitle(null); // Clear Strategy Title context
        setPast([]); // Clear history on map change to avoid confusion
        setFuture([]);
    };

    const spawnScenario = () => {
        // Clear existing zones
        const otherObjects = objects.filter(o => o.tool !== 'zone');
        // Canvas size from user data (Internal logic scale)
        const MAP_SIZE = 2048;
        // FIXED Center as requested ("from the center")
        const centerX = MAP_SIZE / 2;
        const centerY = MAP_SIZE / 2;
        const newZones = [];
        // Spawn 8 Exact Concentric Circles at Center
        for (let i = 1; i <= 8; i++) {
            newZones.push({
                id: `zone - ${i} -${Date.now()} `,
                tool: 'zone',
                phase: i,
                x: centerX,
                y: centerY,
                radius: (ZONE_RADII[`P${i}`] || 100) * 0.582, // Scaled for 2048px map
                stroke: 'white',
                strokeWidth: 8
            });
        }
        dispatch(setObjects([...otherObjects, ...newZones]));
        setTool('select');
        showToast.success("Generated 8 Exact Zones");
    };

    const handleRotateSelected = () => {
        if (!selectedId) return;
        const obj = objects.find(o => o.id === selectedId);
        if (!obj) return;

        setPast([...past, objects]);
        setFuture([]);

        if (obj.tool === 'logo' || obj.tool === 'marker' || obj.tool === 'enemy' || obj.tool === 'loot' || obj.tool === 'drop') {
            const currentRotation = obj.rotation || 0;
            const newRotation = (currentRotation + 45) % 360;
            dispatch(updateLogo({ id: selectedId, changes: { rotation: newRotation } }));
        } else if (obj.tool === 'polyline' || obj.tool === 'flight-path') {
            // Rotate points around center
            const xs = obj.points.map(p => p.x);
            const ys = obj.points.map(p => p.y);
            const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
            const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

            const angleRad = (45 * Math.PI) / 180;
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            const newPoints = obj.points.map(p => {
                const dx = p.x - cx;
                const dy = p.y - cy;
                return {
                    x: cx + (dx * cos - dy * sin),
                    y: cy + (dx * sin + dy * cos)
                };
            });
            dispatch(updateLogo({ id: selectedId, changes: { points: newPoints } }));
        }
        showToast.success('Refreshed Rotation');
    };

    // Explicit Logo Selection Handler (Matches AdminMapEditor)
    const handleLogoSelect = (logoSrc) => {
        setActiveLogo(logoSrc);
        setTool('logo');
    };

    // History State
    const [past, setPast] = React.useState([]);
    const [future, setFuture] = React.useState([]);

    const handleUndo = () => {
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        setFuture([objects, ...future]);
        setPast(newPast);
        dispatch(setObjects(previous));
    };

    const handleRedo = () => {
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);

        setPast([...past, objects]);
        setFuture(newFuture);
        dispatch(setObjects(next));
    };

    // Enhanced setObjects wrapper to record history
    const updateObjectsWithHistory = (newObjsOrFunc) => {
        let newObjs;
        if (typeof newObjsOrFunc === 'function') {
            newObjs = newObjsOrFunc(objects);
        } else {
            newObjs = newObjsOrFunc;
        }

        if (newObjs !== objects) {
            setPast([...past, objects]);
            setFuture([]); // Clear future on new action
            dispatch(setObjects(newObjs));
        }
    };

    const handleDeleteSelected = () => {
        if (!selectedId) return;
        const newObjs = objects.filter(obj => obj.id !== selectedId);
        updateObjectsWithHistory(newObjs);
        setSelectedId(null);
        showToast.success('Object deleted');
    };

    const handleLoadStrategy = (strategy) => {
        // Clearing history when loading a new strategy? 
        // Yes, likely meaningful.
        setPast([]);
        setFuture([]);
        dispatch(setObjects(strategy.objects));
        dispatch(setMapName(strategy.mapName));
        dispatch(setTitle(''));
        dispatch(setStage(''));
        setLoadedStrategyTitle(strategy.title);
        setIsLoadModalOpen(false);
        showToast.success(`Loaded strategy: ${strategy.title} `);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-black overflow-hidden relative">
            {/* Left Toolbar - Logos (Team Side Only) */}
            <div className="absolute top-24 left-4 z-[500] pointer-events-auto flex flex-col gap-4 justify-start w-[260px] max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pb-32">
                {/* Drawing Tools */}
                <div className="flex-shrink-0 w-full">
                    <MapTools
                        activeTool={tool}
                        setActiveTool={(newTool) => {
                            setTool(newTool);
                            if (newTool !== 'logo') setActiveLogo(null);
                        }}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={past.length > 0}
                        canRedo={future.length > 0}
                        onClear={() => dispatch(clearMap())}
                        onDeleteSelected={handleDeleteSelected}
                        onRotateSelected={handleRotateSelected}
                        hasSelection={!!selectedId}
                        onSpawnZone={spawnScenario}
                        mapName={mapName}
                        setMapName={handleMapChange}
                        onSave={() => setIsSaveModalOpen(true)}
                        onLoad={() => setIsLoadModalOpen(true)}
                        color={color}
                        setColor={setColor}
                        hideSaveLoad={false}
                    />
                </div>
            </div>

            {/* Right Toolbar - Logos */}
            <div className="absolute top-24 right-4 z-[500] pointer-events-auto max-h-[calc(100vh-120px)] flex flex-col gap-4 justify-start overflow-y-auto pl-2 pb-24 scrollbar-none w-[200px]">
                <div className="h-fit w-full">
                    <MapLogosToolbar
                        onSelectLogo={handleLogoSelect}
                        activeLogo={tool === 'logo' ? activeLogo : null}
                        className="!h-fit !min-h-0 !overflow-visible"
                    />
                </div>
            </div>


            {/* Header / Top Bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-black/80 backdrop-blur-md px-3 md:px-6 py-2 rounded-xl border border-white/10 flex flex-wrap justify-center items-center gap-2 md:gap-6 shadow-2xl max-w-[95vw] w-max transition-all">

                {/* Event Selector / Title Logic */}

                <div className="flex items-center gap-3">
                    {/* Always Show Event Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                            className={`flex items-center gap-2 p-1 rounded-lg transition-colors ${isEventDropdownOpen ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Event</span>
                                <span className="text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
                                    {title || 'NO EVENT'} <span className="text-purple-400">{stage}</span>
                                    <ChevronRight size={14} className={`text-gray-600 transition-transform ${isEventDropdownOpen ? 'rotate-90' : ''}`} />
                                </span>
                            </div>
                        </button>

                        {/* Dropdown for Map History */}
                        {isEventDropdownOpen && (
                            <div className="absolute top-full left-0 mt-4 w-80 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[600]">
                                {/* Header */}
                                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Switch Event</span>
                                    <div className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                        LIVE UPDATES
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-2">
                                    {Object.keys(groupedHistory).length > 0 ? (
                                        Object.entries(groupedHistory).map(([eventName, stages]) => (
                                            <div key={eventName} className="mb-2 last:mb-0">
                                                {/* Level 1: Event Name */}
                                                <div
                                                    onClick={() => toggleEvent(eventName)}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent
                                                        ${expandedEvents[eventName] ? 'bg-black/40 border-white/10' : 'hover:bg-black/40 hover:border-white/10'}
                                                    `}
                                                >
                                                    <div className={`p-1 rounded-full transition-colors ${expandedEvents[eventName] ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-400'}`}>
                                                        {expandedEvents[eventName] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                    </div>
                                                    <div className="flex-1 flex flex-col">
                                                        <span className="text-sm font-black text-white uppercase tracking-wide drop-shadow-md">{eventName}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            {Object.values(stages).reduce((acc, days) => acc + Object.values(days).reduce((dAcc, m) => dAcc + m.length, 0), 0)} Matches
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Level 2: Stages */}
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedEvents[eventName] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="pl-4 pr-1 py-1 space-y-1 mt-1 relative">
                                                        {/* Connector Line */}
                                                        <div className="absolute left-[22px] top-0 bottom-2 w-0.5 bg-gradient-to-b from-white/20 to-transparent"></div>

                                                        {Object.entries(stages).map(([stageName, days]) => {
                                                            const stageKey = `${eventName}-${stageName}`;
                                                            const isStageExpanded = expandedStages[stageKey];

                                                            return (
                                                                <div key={stageKey} className="relative z-10">
                                                                    <div
                                                                        onClick={() => toggleStage(eventName, stageName)}
                                                                        className={`
                                                                            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ml-4
                                                                            ${isStageExpanded ? 'bg-black/30 text-blue-300' : 'hover:bg-black/20 text-gray-300'}
                                                                        `}
                                                                    >
                                                                        {isStageExpanded ? <ChevronDown size={12} className="text-blue-400" /> : <ChevronRight size={12} className="text-gray-400" />}
                                                                        <span className="text-[11px] font-bold uppercase flex-1 drop-shadow-sm">{stageName}</span>
                                                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-gray-400 font-mono border border-white/5">
                                                                            {Object.values(days).reduce((acc, m) => acc + m.length, 0)}
                                                                        </span>
                                                                    </div>

                                                                    {/* Level 3: Days */}
                                                                    {isStageExpanded && (
                                                                        <div className="pl-8 pr-1 py-1 space-y-1">
                                                                            {Object.entries(days).map(([dayName, maps]) => {
                                                                                const dayKey = `${eventName}-${stageName}-${dayName}`;
                                                                                const isDayExpanded = expandedDays[dayKey];

                                                                                return (
                                                                                    <div key={dayKey}>
                                                                                        <div
                                                                                            onClick={(e) => { e.stopPropagation(); toggleDay(eventName, stageName, dayName); }}
                                                                                            className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 cursor-pointer group"
                                                                                        >
                                                                                            <div className={`w-1 h-1 rounded-full ${isDayExpanded ? 'bg-green-400' : 'bg-gray-600 group-hover:bg-gray-500'}`}></div>
                                                                                            <span className={`text-[11px] font-bold uppercase transition-colors ${isDayExpanded ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                                                                {dayName.match(/^\d+$/) ? `Day ${dayName}` : dayName}
                                                                                            </span>
                                                                                        </div>

                                                                                        {/* Level 4: Matches (Maps) */}
                                                                                        {isDayExpanded && (
                                                                                            <div className="grid grid-cols-1 gap-1 my-1 pl-3">
                                                                                                {maps.map((item) => (
                                                                                                    <button
                                                                                                        key={item._id}
                                                                                                        onClick={() => handleSelectMap(item._id)}
                                                                                                        disabled={loading}
                                                                                                        className={`flex items-center justify-between p-2 rounded-lg border transition-all group text-left relative overflow-hidden ${loadingId === item._id ? 'bg-blue-500/20 border-blue-500/50' : 'bg-black/40 border-white/10 hover:bg-blue-600/20 hover:border-blue-500/50'}`}
                                                                                                    >
                                                                                                        <div className={`flex flex-col z-10 ${loadingId === item._id ? 'opacity-50' : ''}`}>
                                                                                                            <span className="text-white font-bold text-[11px] group-hover:text-blue-200 transition-colors drop-shadow-sm">
                                                                                                                {item.matchNumber ? (item.matchNumber.startsWith('Match') ? item.matchNumber : `Match ${item.matchNumber}`) : item.mapName}
                                                                                                            </span>
                                                                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                                                                <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">{item.mapName}</span>
                                                                                                                <span className="w-0.5 h-0.5 rounded-full bg-gray-500"></span>
                                                                                                                <span className="text-[10px] text-gray-400 font-medium">{new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {loadingId === item._id ? (
                                                                                                            <RotateCw size={14} className="text-blue-400 animate-spin" />
                                                                                                        ) : (
                                                                                                            <ChevronRight size={14} className="text-white/40 group-hover:text-blue-400 transform group-hover:translate-x-0.5 transition-all" />
                                                                                                        )}
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
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                                            <FolderOpen size={24} className="text-gray-500 mb-2" />
                                            <span className="text-xs font-bold text-gray-500">No Events Found</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Strategy Status (Displayed alongside Event Selector if active) */}
                    {loadedStrategyTitle && (
                        <>
                            <div className="w-px h-8 bg-white/10 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Viewing Strategy</span>
                                    <span className="text-yellow-400 font-black uppercase tracking-wider text-sm">{loadedStrategyTitle}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setLoadedStrategyTitle(null);
                                        dispatch(fetchMapDrop()); // Reload Live Data
                                        setPast([]);
                                        setFuture([]);
                                        showToast.success(" Returned to Live View");
                                    }}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                    title="Close Strategy & Return to Live Events"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-white/10"></div>

                {/* Map Info */}
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Map</span>
                    <span className="text-white font-bold text-sm tracking-wide">{mapName} <span className="text-green-400 text-xs ml-1 font-normal opacity-70">(Live)</span></span>
                </div>

            </div>






            <div className="flex-1 relative z-0">
                <LeafletMapCanvas
                    mapImage={MAP_IMAGES[mapName]}
                    mapName={mapName}
                    tool={activeLogo ? 'logo' : tool}
                    activeLogo={activeLogo}
                    objects={objects}
                    setObjects={updateObjectsWithHistory}

                    color={color}
                    readOnly={false}
                    onAddObject={handleAddObject}
                    onUpdateObject={handleUpdateObject}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
            </div>

            {/* Modals */}
            <StrategyLoadModal
                isOpen={isLoadModalOpen}
                onClose={() => setIsLoadModalOpen(false)}
                onLoadStrategy={handleLoadStrategy}
            />

            <StrategySaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={handleConfirmSave}
                defaultTitle={`Strategy ${new Date().toLocaleDateString()} `}
            />
        </div>
    );
};

export default TeamMapViewer;
