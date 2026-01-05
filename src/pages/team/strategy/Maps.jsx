import React, { useState, useRef, useEffect } from 'react';
import MapTools from '../../../components/strategy/MapTools';

import LeafletMapCanvas from '../../../components/strategy/LeafletMapCanvas';
import StrategyLoadModal from '../../../components/strategy/StrategyLoadModal';
import StrategySaveModal from '../../../components/strategy/StrategySaveModal';
import { showToast } from '../../../utils/toast';
import { ZONE_RADII } from '../../../utils/esportsConstants';
import axios from 'axios';

// Import map assets
import MapLogosToolbar from '../../../components/strategy/MapLogosToolbar';
import ERANGEL from '../../../assets/maps/ERANGEL.jpg';
import MIRAMAR from '../../../assets/maps/MIRAMAR.jpg';
import RONDO from '../../../assets/maps/RONDO.jpg';

const MAP_IMAGES = {
    ERANGEL,
    MIRAMAR,
    RONDO
};

const Maps = () => {
    const [mapName, setMapName] = useState('ERANGEL');
    const [tool, setTool] = useState('select');
    const [color, setColor] = useState('#ffffff');
    const [objects, setObjects] = useState([]);
    const [history, setHistory] = useState([[]]);
    const [historyStep, setHistoryStep] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

    // Stage reference to get snapshot for thumbnail
    const stageRef = useRef(null);

    // History Management
    const isUndoingRef = useRef(false);

    useEffect(() => {
        if (isUndoingRef.current) {
            isUndoingRef.current = false;
            return;
        }

        // Simple distinct check to avoid duplicate history entries
        const currentHistory = history[historyStep];
        if (JSON.stringify(currentHistory) !== JSON.stringify(objects)) {
            const newHistory = history.slice(0, historyStep + 1);
            newHistory.push(objects);
            setHistory(newHistory);
            setHistoryStep(newHistory.length - 1);
        }
    }, [objects]); // Dependencies: only objects changes trigger this

    const undo = () => {
        if (historyStep > 0) {
            isUndoingRef.current = true; // Block useEffect
            const previous = history[historyStep - 1];
            setObjects(previous);
            setHistoryStep(historyStep - 1);
        }
    };

    const redo = () => {
        if (historyStep < history.length - 1) {
            isUndoingRef.current = true; // Block useEffect
            const next = history[historyStep + 1];
            setObjects(next);
            setHistoryStep(historyStep + 1);
        }
    };

    // Listen for keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) redo();
                else undo();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedId) {
                    const newObjects = objects.filter(o => o.id !== selectedId);
                    setObjects(newObjects);
                    setSelectedId(null);
                    // addToHistory(); // In a real app we'd want this
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [historyStep, history, selectedId, objects]);


    // addCircle function removed - logic moved to MapCanvas 'zone-center' tool

    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    // Initial Open Modal
    const saveStrategy = () => {
        setIsSaveModalOpen(true);
    };

    // Actual Save Logic called by Modal
    const handleConfirmSave = async (title) => {
        try {
            // Generate thumbnail disabled for now
            const payload = {
                mapName,
                title,
                objects,
                thumbnailUrl: null
            };

            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('https://petite-towns-follow.loca.lt/api/strategies', payload, config);
            showToast.success('Strategy saved successfully!');
        } catch (error) {
            console.error(error);
            showToast.error('Failed to save strategy.');
        }
    };

    const handleLoadStrategy = (strategy) => {
        setObjects(strategy.objects);
        setMapName(strategy.mapName);
        setIsLoadModalOpen(false);
        showToast.success(`Loaded strategy: ${strategy.title}`);
    };

    const openLoadModal = () => {
        setIsLoadModalOpen(true);
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
                strokeWidth: 8 // Specified 8px uniform thickness
            });
        }

        // Zone 9 (optional center dot/reference)
        // User didn't explicitly ask for P9 in "Total zones: 8", but usually needed.
        // I will omit P9 for now to strictly follow "Total zones: 8".
        // Or add it if it breaks nothing? User list stopped at Z8.
        // Safe to skip Z9 based on strict text.

        setObjects([...otherObjects, ...newZones]);
        setTool('select');
        showToast.success("Generated 8 Exact Zones");
    };

    const [currentLogo, setCurrentLogo] = useState(null);

    const handleLogoSelect = (logoSrc) => {
        setCurrentLogo(logoSrc);
        setTool('logo');
    };

    // --- Download Logic ---
    const handleDownload = async () => {
        const element = document.querySelector('.leaflet-container');
        if (!element) return;

        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(element, {
                cacheBust: true,
                backgroundColor: '#171717',
                pixelRatio: 1 // Optimize performance
            });

            const link = document.createElement('a');
            link.download = `map-strategy-${mapName}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            showToast.success("Map downloaded successfully");
        } catch (error) {
            console.error("Download failed:", error);
            showToast.error("Failed to download map");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden pt-16">
            <div className="flex-1 relative flex">

                {/* Left Sidebar: Team Logos */}
                <div className="absolute top-24 left-4 z-[1000]">
                    <MapLogosToolbar
                        onSelectLogo={handleLogoSelect}
                        activeLogo={tool === 'logo' ? currentLogo : null}
                    />
                </div>

                <div className="flex-1 relative">
                    <LeafletMapCanvas
                        mapImage={MAP_IMAGES[mapName]}
                        mapName={mapName}
                        tool={tool}
                        objects={objects}
                        setObjects={setObjects}
                        color={color} // Default or state
                        activeLogo={currentLogo} // Pass selected logo
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onAddObject={(newObj) => setObjects(prev => [...prev, { ...newObj, id: Date.now() + Math.random() }])}
                        onUpdateObject={(id, newProps) => {
                            setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...newProps } : obj));
                        }}
                    />


                </div>

                {/* Floating Sidebar - Narrow Admin Style */}
                <div className="absolute top-4 right-4 z-[1000] h-[85vh] w-[190px] overflow-y-auto">
                    <MapTools
                        activeTool={tool}
                        setActiveTool={setTool}
                        onUndo={undo}
                        onRedo={redo}
                        canUndo={historyStep > 0}
                        canRedo={historyStep < history.length - 1}
                        onClear={() => setObjects([])}
                        onSpawnZone={spawnScenario}
                        mapName={mapName}
                        setMapName={setMapName}
                        onSave={saveStrategy}
                        onLoad={openLoadModal}
                        color={color}
                        setColor={setColor}
                        onDownloadAction={handleDownload}
                        hideSaveLoad={false}
                    />
                </div>
            </div>

            <StrategyLoadModal
                isOpen={isLoadModalOpen}
                onClose={() => setIsLoadModalOpen(false)}
                onLoadStrategy={handleLoadStrategy}
            />

            <StrategySaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={handleConfirmSave}
                defaultTitle={`Strategy ${new Date().toLocaleDateString()}`}
            />
        </div>
    );
};

export default Maps;
