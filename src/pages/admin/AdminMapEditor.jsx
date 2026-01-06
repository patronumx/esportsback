import React, { useState, useEffect } from 'react';
import { Trash2, FolderOpen, AlertTriangle, ChevronRight, ChevronDown, ChevronLeft, History, X } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMapDrop, publishMapDrop, setMapName, addLogo, updateLogo, setObjects, clearMap, setTitle, setStage, setDay, setMatchNumber, fetchMapHistory, loadMapFromHistory, deleteMapDrop } from '../../store/slices/mapDropSlice';
import { showToast } from '../../utils/toast';

// Components
import LeafletMapCanvas from '../../components/strategy/LeafletMapCanvas';
import MapLogosToolbar from '../../components/strategy/MapLogosToolbar';
import MapTools from '../../components/strategy/MapTools';

// Assets
import ERANGEL from '../../assets/maps/ERANGEL.jpg';
import MIRAMAR from '../../assets/maps/MIRAMAR.jpg';
import RONDO from '../../assets/maps/RONDO.jpg';
import { ZONE_RADII } from '../../utils/esportsConstants';

const MAP_IMAGES = {
    ERANGEL,
    MIRAMAR,
    RONDO
};

const AdminMapEditor = () => {
    const dispatch = useDispatch();
    const { mapName, objects, title, stage, day, matchNumber, loading, lastUpdated, mapHistory } = useSelector((state) => state.mapDrop);

    const [tool, setTool] = useState('select');
    const [color, setColor] = useState('#ffffff');
    const [currentLogo, setCurrentLogo] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [loadConfirmId, setLoadConfirmId] = useState(null); // ID of map pending load
    const [deleteConfirmId, setDeleteConfirmId] = useState(null); // ID of map pending delete
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [currentMapId, setCurrentMapId] = useState(null);
    const [expandedEvents, setExpandedEvents] = useState({});
    const [expandedStages, setExpandedStages] = useState({});
    const [expandedDays, setExpandedDays] = useState({});

    // Initial Fetch
    // Initial Fetch
    useEffect(() => {
        dispatch(fetchMapDrop());
        dispatch(fetchMapHistory());
    }, [dispatch]);

    const handleLoadHistory = (id) => {
        setLoadConfirmId(id);
    };

    const confirmLoad = () => {
        if (loadConfirmId) {
            dispatch(loadMapFromHistory(loadConfirmId));
            setCurrentMapId(loadConfirmId);
            setLoadConfirmId(null);
        }
    };

    const handlePublish = async (isNew = false) => {
        try {
            const idToUse = isNew ? undefined : currentMapId;
            await dispatch(publishMapDrop({
                id: idToUse, // Pass ID if updating existing
                mapName,
                objects,
                title,
                stage,
                day,
                matchNumber,
                visibleToTeams: true
            })).unwrap();

            showToast.success(idToUse ? 'Map updated successfully!' : 'Map published as new!');
            dispatch(fetchMapHistory());

            // If saved as new, should we switch context to the new map? 
            // Usually yes, but for now let's keep it simple.
        } catch (err) {
            console.error(err);
            showToast.error('Failed to publish update.');
        }
    };

    const handleLogoSelect = (logoSrc) => {
        setCurrentLogo(logoSrc);
        setTool('logo');
    };

    const handleMapChange = (name) => {
        dispatch(setMapName(name));
        dispatch(clearMap());
        setCurrentMapId(null);
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
                id: `zone-${i}-${Date.now()}`,
                tool: 'zone',
                phase: i,
                x: centerX,
                y: centerY,
                radius: (ZONE_RADII[`P${i}`] || 100) * 0.582, // Scaled by 0.582 (3% less than 0.6)
                stroke: 'white',
                strokeWidth: 8
            });
        }

        dispatch(setObjects([...otherObjects, ...newZones]));
        setTool('select');
        showToast.success("Generated 8 Exact Zones");
    };



    const handleDelete = (id, e) => {
        e.stopPropagation(); // Prevent loading map
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        if (deleteConfirmId) {
            try {
                await dispatch(deleteMapDrop(deleteConfirmId)).unwrap();
                showToast.success('Saved spot deleted');

                // If the deleted map was the one currently open, clear the canvas
                if (deleteConfirmId === currentMapId) {
                    dispatch(clearMap());
                    setCurrentMapId(null);
                }

                setDeleteConfirmId(null);
            } catch (err) {
                console.error(err);
                showToast.error('Failed to delete spot');
            }
        }
    };

    // Grouping Logic
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

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-black overflow-hidden relative">
            {/* Header / Toolbar Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#1E1E1E]/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => dispatch(setTitle(e.target.value))}
                        placeholder="Event Name"
                        className="bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500 px-3 py-1.5 rounded-lg w-40 text-sm font-bold transition-all"
                    />
                    <input
                        type="text"
                        value={stage}
                        onChange={(e) => dispatch(setStage(e.target.value))}
                        placeholder="Stage (e.g. Finals)"
                        className="bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500 px-3 py-1.5 rounded-lg w-32 text-sm transition-all"
                    />
                    <input
                        type="text"
                        value={day}
                        onChange={(e) => dispatch(setDay(e.target.value))}
                        placeholder="Day"
                        className="bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500 px-3 py-1.5 rounded-lg w-20 text-sm transition-all"
                    />
                    <input
                        type="text"
                        value={matchNumber}
                        onChange={(e) => dispatch(setMatchNumber(e.target.value))}
                        placeholder="Match"
                        className="bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-blue-500 px-3 py-1.5 rounded-lg w-24 text-sm transition-all"
                    />
                </div>

                <div className="h-6 w-px bg-white/20 mx-2" />

                <span className="text-white font-bold whitespace-nowrap flex items-center gap-2">
                    <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Editor</span>
                    {mapName}
                </span>

                <div className="flex flex-col items-end leading-none ml-2">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Status</span>
                    <span className="text-gray-400 text-xs font-mono">
                        {loading ? 'Saving...' : (lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Draft')}
                    </span>
                </div>

                {/* History Dropdown */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-lg ${isHistoryOpen ? 'bg-white/20 border-white text-white' : 'bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/40'}`}
                        title="Saved Spots"
                    >
                        <History size={20} />
                    </button>

                    {isHistoryOpen && (
                        <div className="absolute top-full right-0 mt-4 w-80 bg-[#1E1E1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col z-[2000] animate-in slide-in-from-top-2 duration-200 p-1 max-h-[80vh]">
                            <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center rounded-t-xl">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <History size={12} className="text-blue-400" />
                                    Saved Spots
                                </h3>
                                <button
                                    onClick={() => setIsHistoryOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors bg-black/20 p-1 rounded-lg hover:bg-white/10"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-white/20 max-h-[60vh]">
                                {Object.keys(groupedHistory).length > 0 ? (
                                    Object.entries(groupedHistory).map(([eventName, stages]) => (
                                        <div key={eventName} className="mb-2">
                                            {/* Level 1: Event Name */}
                                            <div
                                                onClick={() => toggleEvent(eventName)}
                                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 group"
                                            >
                                                {expandedEvents[eventName] ? <ChevronDown size={14} className="text-blue-400" /> : <ChevronRight size={14} className="text-gray-500 group-hover:text-gray-300" />}
                                                <span className="text-white font-bold text-xs uppercase flex-1">{eventName}</span>
                                                <span className="text-[10px] text-gray-400 bg-black/40 px-1.5 rounded-sm font-mono border border-white/5">
                                                    {Object.values(stages).reduce((acc, days) => acc + Object.values(days).reduce((dAcc, m) => dAcc + m.length, 0), 0)}
                                                </span>
                                            </div>

                                            {/* Level 2: Stages */}
                                            {expandedEvents[eventName] && (
                                                <div className="pl-2 mt-1 space-y-1 relative">
                                                    <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
                                                    {Object.entries(stages).map(([stageName, days]) => {
                                                        const stageKey = `${eventName}-${stageName}`;
                                                        const isStageExpanded = expandedStages[stageKey];

                                                        return (
                                                            <div key={stageKey} className="ml-2 pl-2">
                                                                <div
                                                                    onClick={() => toggleStage(eventName, stageName)}
                                                                    className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 cursor-pointer group"
                                                                >
                                                                    {isStageExpanded ? <ChevronDown size={12} className="text-blue-400" /> : <ChevronRight size={12} className="text-gray-600 group-hover:text-gray-400" />}
                                                                    <span className="text-blue-200 text-[11px] font-bold uppercase flex-1">{stageName}</span>
                                                                    <span className="text-[9px] text-gray-600">
                                                                        {Object.values(days).reduce((acc, m) => acc + m.length, 0)}
                                                                    </span>
                                                                </div>

                                                                {/* Level 3: Days */}
                                                                {isStageExpanded && (
                                                                    <div className="pl-4 mt-1 space-y-1">
                                                                        {Object.entries(days).map(([dayName, maps]) => {
                                                                            const dayKey = `${eventName}-${stageName}-${dayName}`;
                                                                            const isDayExpanded = expandedDays[dayKey];

                                                                            return (
                                                                                <div key={dayKey}>
                                                                                    <div
                                                                                        onClick={(e) => toggleDay(eventName, stageName, dayName, e)}
                                                                                        className="flex items-center gap-2 p-1.5 rounded hover:bg-white/5 cursor-pointer"
                                                                                    >
                                                                                        <div className={`w-1.5 h-1.5 rounded-full ${isDayExpanded ? 'bg-blue-500' : 'bg-gray-700'}`} />
                                                                                        <span className="text-gray-300 text-[11px] font-bold uppercase">
                                                                                            {dayName.match(/^\d+$/) ? `Day ${dayName}` : dayName}
                                                                                        </span>
                                                                                        <span className="text-[9px] text-gray-600 ml-auto">({maps.length})</span>
                                                                                    </div>

                                                                                    {/* Level 4: Matches */}
                                                                                    {isDayExpanded && (
                                                                                        <div className="pl-2 mt-1 space-y-1 grid grid-cols-1 gap-1">
                                                                                            {maps.map((item) => (
                                                                                                <div
                                                                                                    key={item._id}
                                                                                                    className="group flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
                                                                                                    onClick={() => { handleLoadHistory(item._id); setIsHistoryOpen(false); }}
                                                                                                >
                                                                                                    <div className="flex flex-col">
                                                                                                        <span className="text-blue-300 font-bold text-[10px]">
                                                                                                            {item.matchNumber ? (item.matchNumber.startsWith('Match') ? item.matchNumber : `Match ${item.matchNumber}`) : item.mapName}
                                                                                                        </span>
                                                                                                        {item.matchNumber && <span className="text-[9px] text-gray-500">{item.mapName}</span>}
                                                                                                    </div>

                                                                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                        <button
                                                                                                            onClick={(e) => handleDelete(item._id, e)}
                                                                                                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                                                                                                            title="Delete"
                                                                                                        >
                                                                                                            <Trash2 size={12} />
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
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
                                ) : (
                                    <div className="text-gray-500 text-xs text-center p-8 flex flex-col items-center gap-2">
                                        <History size={24} className="opacity-20" />
                                        No saved maps found
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-2">
                    {currentMapId && (
                        <button
                            onClick={() => handlePublish(false)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/25 uppercase"
                        >
                            UPDATE
                        </button>
                    )}
                    <button
                        onClick={() => handlePublish(true)}
                        className={`${currentMapId ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25'} px-5 py-2 rounded-xl text-sm font-bold transition-all uppercase`}
                    >
                        {currentMapId ? 'PUBLISH NEW' : 'PUBLISH'}
                    </button>
                </div>
            </div>

            {/* Right Sidebar - Tools & Logos */}
            <div className="absolute top-24 right-4 z-[500] max-h-[calc(100vh-120px)] flex flex-col gap-2 items-end pointer-events-auto overflow-y-auto scrollbar-none pr-1 pb-4">
                <div className="flex-shrink-0">
                    <MapTools
                        activeTool={tool}
                        setActiveTool={setTool}
                        onUndo={() => { }}
                        onRedo={() => { }}
                        canUndo={false}
                        canRedo={false}
                        onClear={() => dispatch(clearMap())}
                        onSpawnZone={spawnScenario}
                        mapName={mapName}
                        setMapName={handleMapChange}
                        onSave={() => { }}
                        onLoad={() => { }}
                        color={color}
                        setColor={setColor}
                        hideSaveLoad={true}
                        draggable={true} // Enable Dragging
                    />
                </div>
                <div className="flex-shrink-0 h-[500px]">
                    <MapLogosToolbar
                        onSelectLogo={handleLogoSelect}
                        activeLogo={tool === 'logo' ? currentLogo : null}
                    />
                </div>
            </div>

            {/* Main Map Content - Restored */}
            <div className="flex-1 relative flex">


                <div className="flex-1 relative">
                    <LeafletMapCanvas
                        mapImage={MAP_IMAGES[mapName]}
                        mapName={mapName}
                        tool={tool}
                        objects={objects}
                        setObjects={(newObjs) => dispatch(setObjects(newObjs))}

                        color={color}
                        activeLogo={currentLogo}
                        selectedId={selectedId}
                        onSelect={setSelectedId}

                        onAddObject={(newObj) => {
                            dispatch(addLogo({ ...newObj, id: Date.now() + Math.random() }));
                        }}
                        onUpdateObject={(id, newProps) => {
                            dispatch(updateLogo({ id, changes: newProps }));
                        }}
                        onDeleteObject={(id) => {
                            dispatch(setObjects(objects.filter(o => o.id !== id)));
                            setSelectedId(null);
                        }}
                    />
                </div>
            </div>

            {/* Load Confirmation Modal */}


            {/* Load Confirmation Modal */}
            <ConfirmationModal
                isOpen={loadConfirmId !== null}
                onClose={() => setLoadConfirmId(null)}
                onConfirm={confirmLoad}
                title="Load Strategy?"
                message="Unsaved changes to your current map will be lost. Are you sure you want to proceed?"
                confirmText="Load Map"
                cancelText="Cancel"
                isDanger={false}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirmId !== null}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={confirmDelete}
                title="Delete Spot?"
                message="Are you sure you want to delete this save? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDanger={true}
            />
        </div >
    );
};

export default AdminMapEditor;
