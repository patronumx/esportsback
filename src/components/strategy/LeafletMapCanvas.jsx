import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TextPromptModal from '../common/TextPromptModal';
import { MapContainer, ImageOverlay, Circle, LayerGroup, useMap, Marker, FeatureGroup, useMapEvents, Polyline, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw'; // Ensure L.Draw is attached to L
import { EditControl } from 'react-leaflet-draw';
import { ZONE_RADII_PIXELS } from '../../utils/esportsConstants';
import { resolveLogoUrl } from '../../utils/logoAssets';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,

    shadowUrl: markerShadow,
});

import { Plane, Car } from 'lucide-react'; // Added Car
import { showToast } from '../../utils/toast';
// Component to handle map bounds and resizing
const MapController = ({ dimensions }) => {
    const map = useMap();

    useEffect(() => {
        // Map [0,0] to [dimensions, dimensions]
        // Expand bounds significantly to allow free panning (e.g. -2000 to +4000)
        // Default map is 0 to 2048.
        const extendedBounds = [[-2000, -2000], [dimensions + 2000, dimensions + 2000]];
        map.setMaxBounds(extendedBounds);

        // Initial view still fits the content
        const fitBounds = [[0, 0], [dimensions, dimensions]];
        map.fitBounds(fitBounds);
        // Ensure map dragging is enabled (fix for stuck drag state)
        map.dragging.enable();
    }, [map, dimensions]);

    return null;
};

const ZoomHandler = ({ onZoomChange }) => {
    const map = useMap();
    useMapEvents({
        zoomend: () => {
            onZoomChange(map.getZoom());
        }
    });
    return null;
};


// Custom Zoom Control Component
const CustomZoomControl = () => {
    const map = useMap();

    return (
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    map.zoomIn();
                }}
                className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all hover:scale-105"
                title="Zoom In"
            >
                +
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    map.zoomOut();
                }}
                className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all hover:scale-105"
                title="Zoom Out"
            >
                −
            </button>
        </div>
    );
};

// Component to handle programmatic drawing triggers based on 'tool' prop
const DrawHandler = ({ tool, onCreated }) => {
    const map = useMap();
    const drawHandlerRef = useRef(null);

    // Disable previous handler when tool changes
    useEffect(() => {
        // Reset defaults
        map.dragging.enable();
        map.getContainer().style.cursor = '';

        if (drawHandlerRef.current) {
            drawHandlerRef.current.disable();
            drawHandlerRef.current = null;
        }

        if (tool === 'select') return;

        let handler = null;
        const options = {
            shapeOptions: {
                color: tool === 'flight-path' ? '#FFA500' : 'white',
                weight: tool === 'flight-path' ? 4 : 2,
                dashArray: tool === 'flight-path' ? '20, 10' : null,
                opacity: 0.8
            }
        };

        // Instantiate specific draw handler based on tool
        switch (tool) {
            case 'flight-path':
            case 'polyline':
            case 'line': // Explicit Line Tool using Polyline logic (Click-Click)
                handler = new L.Draw.Polyline(map, options);
                break;
            case 'brush':
                // Handled manually in EventsHandler (Pencil Drag)
                handler = null;
                break;
            case 'marker':
            case 'enemy':
            case 'drop':
            case 'loot':
            case 'logo':
                handler = new L.Draw.Marker(map, { repeatMode: true });
                break;
            case 'polygon':
                handler = new L.Draw.Polygon(map, options);
                break;
            // Rectangle handled manually for click-click interaction
            // case 'rectangle':
            // case 'rect':
            //    handler = new L.Draw.Rectangle(map, options);
            //    break;
            // case 'circle':
            //     handler = new L.Draw.Circle(map, options);
            //     break;
            default:
                break;
        }

        if (handler) {
            handler.enable();
            drawHandlerRef.current = handler;
        }

    }, [tool, map]);

    // Global listener for creation
    useMapEvents({
        'draw:created': (e) => {
            onCreated(e);

            // Re-enable handler for continuous drawing if circle tool
            if (tool === 'circle' && drawHandlerRef.current) {
                // Short timeout to prevent immediate termination by the same click event
                setTimeout(() => {
                    if (drawHandlerRef.current) {
                        drawHandlerRef.current.enable();
                    }
                }, 10);
            }
        }
    });

    return null;
};

const MapDownloadListener = ({ mapName }) => {
    const map = useMap();

    useEffect(() => {
        const handleTrigger = async (e) => {
            const toastId = showToast.loading("Generating full map image...");

            // 1. Save state
            const prevCenter = map.getCenter();
            const prevZoom = map.getZoom();

            // 2. Zoom to Fit World (High Res)
            // Bounds: [[0,0], [2048, 2048]]
            map.fitBounds([[0, 0], [2048, 2048]], { animate: false });

            // 3. Wait for tiles
            await new Promise(r => setTimeout(r, 1500));

            // 4. Capture
            try {
                const { toPng } = await import('html-to-image');
                const node = map.getContainer();
                const dataUrl = await toPng(node, {
                    cacheBust: true,
                    pixelRatio: 2, // High Quality requested
                    backgroundColor: '#171717',
                    filter: (node) => {
                        // Exclude Zoom Controls (Leaflet default)
                        if (node.classList && node.classList.contains('leaflet-control-container')) return false;
                        // Exclude Custom Zoom Buttons
                        if (node.tagName === 'BUTTON' && (node.innerText === '+' || node.innerText === '−')) return false;
                        return true;
                    }
                });

                const link = document.createElement('a');
                link.download = `strategy-${mapName}-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();

                showToast.success("Full map downloaded!");
            } catch (err) {
                console.error(err);
                showToast.error("Download failed");
            } finally {
                // 5. Restore
                map.setView(prevCenter, prevZoom, { animate: false });
                showToast.dismiss(toastId);
            }
        };

        window.addEventListener('TRIGGER_MAP_DOWNLOAD', handleTrigger);
        return () => window.removeEventListener('TRIGGER_MAP_DOWNLOAD', handleTrigger);
    }, [map, mapName]);

    return null;
};

const ZoneRenderer = ({ zone, toLeaflet, toKonva, onZoneDragEnd }) => {
    const circleRef = useRef(null);
    const pos = toLeaflet(zone.x, zone.y);

    const eventHandlers = useMemo(() => ({
        dragstart: (e) => {
            e.target._map.dragging.disable();
        },
        drag: (e) => {
            const { lat, lng } = e.target.getLatLng();
            // Visually update the circle without triggering React state re-render
            if (circleRef.current) {
                circleRef.current.setLatLng([lat - zone.radius, lng]);
            }
        },
        dragend: (e) => {
            const map = e.target._map;
            map.dragging.enable();

            const { lat, lng } = e.target.getLatLng();
            const newZoneLat = lat - zone.radius;
            const newZoneLng = lng;
            const newPos = toKonva(newZoneLat, newZoneLng);

            // Commit final position to state
            onZoneDragEnd(zone.id, { x: newPos.x, y: newPos.y });
        }
    }), [zone, toKonva, onZoneDragEnd]);

    return (
        <React.Fragment key={zone.id}>
            <Circle
                ref={circleRef}
                center={pos}
                radius={zone.radius}
                pathOptions={{
                    color: 'white',
                    fill: false,
                    weight: 2,
                    interactive: false,
                    className: 'pointer-events-none'
                }}
            />
            <Marker
                key={`${zone.id}-${zone.x}-${zone.y}`}
                position={[pos[0] + zone.radius, pos[1]]}
                icon={L.divIcon({
                    className: 'custom-zone-handle',
                    html: `<div style="width: 24px; height: 24px; background-color: #f59e0b; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })}
                draggable={true}
                bubblingMouseEvents={false}
                zIndexOffset={1000}
                eventHandlers={eventHandlers}
            />
        </React.Fragment>
    );
};

const LeafletMapCanvas = ({
    mapImage,
    mapName,
    objects,
    setObjects,
    tool,
    color,
    onAddObject,
    onUpdateObject,
    activeLogo,
    selectedId,
    onSelect,
    onDeleteObject, // New Prop
    readOnly = false // Default to false
}) => {
    // Debug Logging
    // console.log('LeafletMapCanvas Render:', { mapName, objectsCount: objects.length, activeLogo });
    const MAP_DIMENSIONS = 2048; // Fixed coordinate system
    const bounds = [[0, 0], [MAP_DIMENSIONS, MAP_DIMENSIONS]];

    // State for custom drag (ID of zone being dragged + offset from center)
    const [dragState, setDragState] = useState(null);
    const [currentZoom, setCurrentZoom] = useState(1);

    // State for Text Prompt Modal
    const [textModal, setTextModal] = useState({ isOpen: false, pos: null });

    // Scaling State
    const [scaleState, setScaleState] = useState(null); // { id, startDist, startRadius, startPoints, center }

    // Refs for optimization
    const layerRefs = useRef({});
    // Fix: DrawHandler ref needs to be exposed or rebuilt
    // Actually, we can just use a ref to store active drawing session info or re-trigger.

    // Ref for activeLogo to avoid stale closures in event handlers
    const activeLogoRef = useRef(activeLogo);
    useEffect(() => {
        activeLogoRef.current = activeLogo;
    }, [activeLogo]);

    // Ref for tool to avoid stale closures
    const toolRef = useRef(tool);
    useEffect(() => {
        toolRef.current = tool;
    }, [tool]);

    const colorRef = useRef(color);
    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    // Convert Konva {x, y} to Leaflet {lat, lng} (Simple CRS)
    const toLeaflet = useCallback((x, y) => [MAP_DIMENSIONS - y, x], [MAP_DIMENSIONS]);
    const toKonva = useCallback((lat, lng) => ({ x: lng, y: MAP_DIMENSIONS - lat }), [MAP_DIMENSIONS]);

    // Handle Zone Drag with Parent/Child Constraints
    const handleZoneDragEnd = useCallback((zoneId, newPos) => {
        let updatedZone = { ...objects.find(o => o.id === zoneId), ...newPos };
        if (!updatedZone) return;

        // 1. Constraint: Child must stay in Parent
        if (Number(updatedZone.phase) > 1) {
            const parent = objects.find(o => o.tool === 'zone' && Number(o.phase) === Number(updatedZone.phase) - 1);
            if (parent) {
                const dx = updatedZone.x - parent.x;
                const dy = updatedZone.y - parent.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // If child is outside parent, pull it back
                if (dist + updatedZone.radius > parent.radius) {
                    const maxDist = parent.radius - updatedZone.radius;
                    if (maxDist < 0) {
                        // Parent is smaller than child? Should not happen in valid hierarchy, but safe fallback
                    } else if (dist > 0) {
                        const scale = maxDist / dist;
                        updatedZone.x = parent.x + dx * scale;
                        updatedZone.y = parent.y + dy * scale;
                    } else {
                        // Centered
                        updatedZone.x = parent.x;
                        updatedZone.y = parent.y;
                    }
                }
            }
        }

        // 2. Cascade: Moving Parent moves Children
        const originalZone = objects.find(o => o.id === zoneId);
        const shiftX = updatedZone.x - originalZone.x;
        const shiftY = updatedZone.y - originalZone.y;

        const newObjects = objects.map(obj => {
            if (obj.id === zoneId) {
                return { ...obj, x: updatedZone.x, y: updatedZone.y };
            }
            // If dragging P1, move P2, P3...
            if (obj.tool === 'zone' && obj.phase > updatedZone.phase) {
                return { ...obj, x: obj.x + shiftX, y: obj.y + shiftY };
            }
            return obj;
        });

        setObjects(newObjects);
    }, [objects]);



    // Geometry-based zone logic (New Implementation)
    const handleZoneDragEndGeometry = useCallback((zoneId, newPos) => {
        // Validation
        if (typeof newPos.x !== 'number' || typeof newPos.y !== 'number' || isNaN(newPos.x) || isNaN(newPos.y)) {
            console.error("Invalid Zone Drag Position:", newPos);
            return;
        }

        let updatedZone = { ...objects.find(o => o.id === zoneId), ...newPos };
        if (!updatedZone) return;

        const updatedRadius = Number(updatedZone.radius);

        const largerZones = objects.filter(o => o.tool === 'zone' && Number(o.radius) > updatedRadius);
        largerZones.sort((a, b) => Number(a.radius) - Number(b.radius));

        const parent = largerZones[0];
        if (parent) {
            const parentRadius = Number(parent.radius);
            const dx = updatedZone.x - parent.x;
            const dy = updatedZone.y - parent.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = parentRadius - updatedRadius;

            if (dist > maxDist) {
                if (maxDist < 0) {
                    // Should not happen, but if parent < child, ignore constraint or snap to center
                } else if (dist > 0) {
                    const scale = (maxDist - 0.1) / dist; // -0.1 to ensure it's STRICTLY inside
                    updatedZone.x = parent.x + dx * scale;
                    updatedZone.y = parent.y + dy * scale;
                } else {
                    updatedZone.x = parent.x;
                    updatedZone.y = parent.y;
                }
            }
        }

        const originalZone = objects.find(o => o.id === zoneId);
        const shiftX = updatedZone.x - originalZone.x;
        const shiftY = updatedZone.y - originalZone.y;

        const newObjects = objects.map(obj => {
            if (obj.id === zoneId) {
                return { ...obj, x: updatedZone.x, y: updatedZone.y };
            }
            if (obj.tool === 'zone' && Number(obj.radius) < updatedRadius) {
                return { ...obj, x: obj.x + shiftX, y: obj.y + shiftY };
            }
            return obj;
        });

        setObjects(newObjects);
    }, [objects]);

    const handleFeatureCreated = useCallback((e) => {
        const type = e.layerType;
        const layer = e.layer;
        const currentTool = toolRef.current; // Get fresh tool

        if (type === 'marker' || currentTool === 'enemy' || currentTool === 'drop' || currentTool === 'loot') {
            const { lat, lng } = layer.getLatLng();
            const pos = toKonva(lat, lng);

            let finalTool = 'marker';
            let finalColor = colorRef.current || 'white';

            if (currentTool === 'enemy') { finalTool = 'enemy'; finalColor = '#ef4444'; } // Red
            if (currentTool === 'drop') { finalTool = 'drop'; finalColor = '#06b6d4'; }   // Cyan
            if (currentTool === 'loot') { finalTool = 'loot'; finalColor = '#22c55e'; }   // Green

            onAddObject({
                tool: finalTool,
                x: pos.x,
                y: pos.y,
                color: finalColor
            });

        } else if (type === 'polyline') {
            const latLngs = layer.getLatLngs();
            // Flatten if nested (Leaflet handles multi-polylines differently sometimes, but usually flat for simple lines)
            const flatLatLngs = Array.isArray(latLngs[0]) ? latLngs.flat() : latLngs;

            const points = flatLatLngs.map(ll => toKonva(ll.lat, ll.lng));

            const isFlightPath = currentTool === 'flight-path';

            onAddObject({
                tool: isFlightPath ? 'flight-path' : 'polyline',
                points: points,
                color: isFlightPath ? '#FFA500' : (colorRef.current || 'white'),
                strokeWidth: isFlightPath ? 4 : 2,
                dash: isFlightPath ? [20, 10] : null
            });
        }
        else if (type === 'rectangle') {
            const bounds = layer.getBounds();
            // Use public methods instead of internal _ properties
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            const swPos = toKonva(sw.lat, sw.lng);
            const nePos = toKonva(ne.lat, ne.lng);

            onAddObject({
                tool: 'rectangle',
                x: swPos.x,  // Store x,y, width, height for consistent rendering? 
                // Or bounds? AdminMapEditor used bounds [[lat,lng],[lat,lng]].
                // LeafletMapCanvas uses Konva renders. Konva Rect needs x,y,width,height.
                // But LeafletMapCanvas might render using Leaflet Rectangle?
                // Let's check how 'rectangle' is rendered.
                // Assuming bounds is what it wants for now, or fallback to standard logic.
                // Actually, Step 758 removed Rectangle tool.
                // "The user's main objective is to completely remove the Rectangle drawing tool".
                // So I should arguably remove the rectangle block too if it exists?
                // But primarily I need to ADD polyline.
                // I will add polyline and keep rectangle if it was there (lines 391-405).
                // Wait, I am replacing lines 391-441?
                // No, I should insert it before or after.
                // I will target the end of the `marker/enemy` block and INSERT `else if (type === 'polyline')`.
                // The `marker/enemy` block ends at 390? No, 390 is inside the mess.
                // The first block (364-390) is malformed. It checks `type === 'marker'` OR `currentTool === 'enemy'`.
                // But `currentTool` comes from ref.
                // If I select "Line" tool, `currentTool` is 'line'.
                // `type` is 'polyline'.
                // So `if (type === 'marker' ...)` is false.
                // Use separate block.
                bounds: [
                    [sw.lat, sw.lng],
                    [ne.lat, ne.lng]
                ],
                color: colorRef.current || 'white'
            });
        }
        else if (type === 'marker') {
            const { lat, lng } = layer.getLatLng();
            const pos = toKonva(lat, lng);
            const radius = layer.getRadius ? layer.getRadius() : 0;

            if (currentTool === 'logo') {
                onAddObject({
                    tool: 'logo',
                    x: pos.x,
                    y: pos.y,
                    logoSrc: activeLogoRef.current,
                    width: 60,
                    height: 60
                });
            } else {
                onAddObject({
                    tool: 'marker',
                    x: pos.x,
                    y: pos.y,
                    color: colorRef.current
                });
            }
        }
        else if (type === 'circle') {
            const { lat, lng } = layer.getLatLng();
            const pos = toKonva(lat, lng);
            const radius = layer.getRadius();

            onAddObject({
                tool: 'circle',
                x: pos.x,
                y: pos.y,
                radius: radius,
                color: colorRef.current || 'white'
            });
        }
    }, [onAddObject, toKonva, color]); // refs are stable

    // Helper: Distance between two points
    const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const handleZoneDrag = useCallback((id, newLatLng, isFinal = true) => {
        const newPos = toKonva(newLatLng.lat, newLatLng.lng); // Konva Coords
        const objToDrag = objects.find(o => o.id === id);
        if (!objToDrag) return;

        // --- RECTANGLE LOGIC ---
        if (objToDrag.tool === 'rectangle') {
            const b = objToDrag.bounds;
            const centerLat = (b[0][0] + b[1][0]) / 2;
            const centerLng = (b[0][1] + b[1][1]) / 2;
            const dLat = newLatLng.lat - centerLat;
            const dLng = newLatLng.lng - centerLng;
            const newBounds = [
                [b[0][0] + dLat, b[0][1] + dLng],
                [b[1][0] + dLat, b[1][1] + dLng]
            ];

            if (!isFinal) {
                const visual = layerRefs.current[`visual-${id}`];
                if (visual) visual.setBounds(newBounds);
                return;
            }

            setObjects(objects.map(o => o.id === id ? { ...o, bounds: newBounds } : o));
            return;
        }

        // --- POLYLINE / FLIGHT PATH LOGIC ---
        if (objToDrag.tool === 'polyline' || objToDrag.tool === 'flight-path') {
            // Calculate current center of the object
            const xs = objToDrag.points.map(p => p.x);
            const ys = objToDrag.points.map(p => p.y);
            const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
            const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;

            // Delta is New Position (Handle) - Old Position (Center)
            const dx = newPos.x - centerX;
            const dy = newPos.y - centerY;

            const newPoints = objToDrag.points.map(p => ({ x: p.x + dx, y: p.y + dy }));

            if (!isFinal) {
                const latlngs = newPoints.map(p => toLeaflet(p.x, p.y));
                const visual = layerRefs.current[`visual-${id}`];
                const hit = layerRefs.current[`hit-${id}`];

                if (visual) visual.setLatLngs(latlngs);
                if (hit) hit.setLatLngs(latlngs);

                // Flight Path Markers
                if (objToDrag.tool === 'flight-path') {
                    const startMarker = layerRefs.current[`start-${id}`];
                    const endMarker = layerRefs.current[`end-${id}`];
                    if (startMarker && latlngs.length > 0) startMarker.setLatLng(latlngs[0]);
                    if (endMarker && latlngs.length > 0) endMarker.setLatLng(latlngs[latlngs.length - 1]);
                }
                return;
            }

            setObjects(objects.map(o => o.id === id ? { ...o, points: newPoints } : o));
            return;
        }

        // --- MARKER / LOGO LOGIC (Free Drag) ---
        // These usually handle themselves via Leaflet drag, but if triggered here:
        if (['logo', 'marker', 'enemy', 'drop', 'loot'].includes(objToDrag.tool)) {
            if (!isFinal) {
                // Not implemented visually here because Markers use built-in drag
                return;
            }
            setObjects(objects.map(o => o.id === id ? { ...o, x: newPos.x, y: newPos.y } : o));
            return;
        }

        // --- CIRCLE / ZONE LOGIC ---
        let finalX = newPos.x;
        let finalY = newPos.y;

        // 1. CONSTRAINT (Child inside Parent) - Only for 'zone'
        if (objToDrag.tool === 'zone') {
            const parent = objects.find(o => o.tool === 'zone' && o.phase === objToDrag.phase - 1);
            if (parent) {
                const maxDist = parent.radius - objToDrag.radius;
                const d = dist({ x: parent.x, y: parent.y }, { x: finalX, y: finalY });
                if (d > maxDist) {
                    const angle = Math.atan2(finalY - parent.y, finalX - parent.x);
                    finalX = parent.x + Math.cos(angle) * maxDist;
                    finalY = parent.y + Math.sin(angle) * maxDist;
                }
            }
        }

        // Visual Update for Circles/Zones
        if (!isFinal && objToDrag.tool === 'circle') {
            const visual = layerRefs.current[`visual-${id}`];
            const hit = layerRefs.current[`hit-${id}`];
            const latLng = toLeaflet(finalX, finalY);
            if (visual) visual.setLatLng(latLng);
            if (hit) hit.setLatLng(latLng);
            return;
        }

        // 2. CASCADE (Move Children with Parent) - Only for 'zone'
        if (objToDrag.tool !== 'zone') {
            setObjects(objects.map(o => o.id === id ? { ...o, x: finalX, y: finalY } : o));
            return;
        }

        // If Zone, perform cascade (Complex, maybe commit every step? Or skip visual opt for zones)
        // User didn't complain about zones. Let's keep zones as is (commit every step) or optimize later.
        // For now, if !isFinal, we SKIP zone updates to avoid heavy calculation loops, 
        // OR we just execute the calculation but don't commit?
        // Let's commit zones for now (safe fallback) as they have constraints.
        // Actually, if we return here, zone won't move until mouseup. That's jerky.
        // SO: For 'zone', we CONTINUE to commit even if !isFinal (current behavior).
        // Since zones are limited to 8 items, it's fast enough.

        const dx = finalX - objToDrag.x;
        const dy = finalY - objToDrag.y;

        const updates = [];
        updates.push({ id: objToDrag.id, x: finalX, y: finalY });

        const getDescendants = (parentId) => {
            const parentObj = objects.find(o => o.id === parentId);
            if (!parentObj) return [];
            const child = objects.find(o => o.tool === 'zone' && o.phase === parentObj.phase + 1);
            if (child) {
                return [child, ...getDescendants(child.id)];
            }
            return [];
        };

        const descendants = getDescendants(objToDrag.id);
        descendants.forEach(child => {
            updates.push({
                id: child.id,
                x: child.x + dx,
                y: child.y + dy
            });
        });

        setObjects(objects.map(obj => {
            const update = updates.find(u => u.id === obj.id);
            return update ? { ...obj, ...update } : obj;
        }));
    }, [objects, toKonva, toLeaflet]);

    // --- DROP HANDLER FOR DRAG & DROP LOGOS & TOOLS ---
    const DropHandler = () => {
        const map = useMap();

        useEffect(() => {
            const container = map.getContainer();

            const handleDragOver = (e) => {
                e.preventDefault(); // Allow drop
                e.dataTransfer.dropEffect = 'copy';
            };

            const handleDrop = (e) => {
                e.preventDefault();
                const logoSrc = e.dataTransfer.getData('logoSrc');
                const originalPath = e.dataTransfer.getData('originalPath');
                const toolType = e.dataTransfer.getData('toolType');
                const toolColor = e.dataTransfer.getData('toolColor');

                if (!logoSrc && !toolType) return;

                // Calculate Map Coordinates from Drop Point
                const containerRect = container.getBoundingClientRect();
                const dropPoint = map.containerPointToLatLng([
                    e.clientX - containerRect.left,
                    e.clientY - containerRect.top
                ]);

                // Convert to Konva Coords
                const pos = toKonva(dropPoint.lat, dropPoint.lng);

                if (logoSrc) {
                    onAddObject({
                        tool: 'logo',
                        x: pos.x,
                        y: pos.y,
                        logoSrc: originalPath || logoSrc, // Prefer stable path for DB storage
                        width: 60,
                        height: 60
                    });
                } else if (toolType) {
                    // --- Shape Drop Logic ---
                    const color = toolColor || '#ffffff';

                    if (toolType === 'circle') {
                        onAddObject({
                            tool: 'circle',
                            x: pos.x,
                            y: pos.y,
                            radius: 100, // Default radius
                            color: color
                        });
                    } else if (toolType === 'line' || toolType === 'flight-path') {
                        // Create a default horizontal line/path centered on drop
                        const halfLen = 100;
                        const points = [
                            { x: pos.x - halfLen, y: pos.y },
                            { x: pos.x + halfLen, y: pos.y }
                        ];

                        const isFlight = toolType === 'flight-path';

                        onAddObject({
                            tool: isFlight ? 'flight-path' : 'polyline',
                            points: points,
                            color: isFlight ? '#FFA500' : color,
                            strokeWidth: isFlight ? 4 : 2,
                            dash: isFlight ? [20, 10] : null
                        });
                    } else if (toolType === 'spawn-zone') {
                        // Get default radius for Phase 1 (or make generic)
                        const radius = 200; // Default
                        onAddObject({
                            tool: 'zone',
                            phase: 1, // Default to Phase 1
                            x: pos.x,
                            y: pos.y,
                            radius: radius,
                            color: color
                        });
                    } else {
                        // Standard Markers (enemy, loot, marker, etc.)
                        onAddObject({
                            tool: toolType,
                            x: pos.x,
                            y: pos.y,
                            color: color
                        });
                    }
                }
            };

            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('drop', handleDrop);

            return () => {
                container.removeEventListener('dragover', handleDragOver);
                container.removeEventListener('drop', handleDrop);
            };
        }, [map]);

        return null;
    };

    // Handler for Text Modal Submission
    // Handler for Text Modal Submission
    const handleTextSubmit = useCallback((text) => {
        if (!text) {
            setTextModal({ isOpen: false, pos: null, editingId: null, initialValue: '' });
            return;
        }

        if (textModal.editingId) {
            // Edit existing text
            onUpdateObject(textModal.editingId, { text });
        } else if (textModal.pos) {
            // Create new text
            const { x, y } = textModal.pos;
            onAddObject({
                tool: 'text',
                x,
                y,
                text: text,
                color: color || '#ffffff',
                fontSize: 14
            });
        }
        setTextModal({ isOpen: false, pos: null, editingId: null, initialValue: '' });
    }, [textModal, onUpdateObject, onAddObject, color]);

    // Custom Renderer with high padding to prevent clipping during pans
    // Memoize to avoid re-creating on every render
    const canvasRenderer = useMemo(() => L.canvas({ padding: 0.75 }), []);

    const renderedObjects = useMemo(() => (
        <>
            {objects.filter(obj => obj.tool === 'zone').map((zone) => (
                <ZoneRenderer
                    key={zone.id}
                    zone={zone}
                    toLeaflet={toLeaflet}
                    toKonva={toKonva}
                    onZoneDragEnd={handleZoneDragEndGeometry}
                />
            ))}

            {objects.filter(obj => obj.tool === 'flight-path' || obj.tool === 'polyline').map((obj) => {
                if (!obj.points || obj.points.length < 2) return null;
                const positions = obj.points.map(p => toLeaflet(p.x, p.y));

                // Better Plane Icon (Solid Top-Down Silhouette)
                const planeIcon = L.divIcon({
                    className: 'custom-plane-icon',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24" style="filter: drop-shadow(0 0 2px black); transform: rotate(45deg);">
                        <path d="M10.18 9"/>
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                return (
                    <React.Fragment key={obj.id}>
                        {/* Visual Polyline */}
                        <Polyline
                            ref={el => { if (el) layerRefs.current[`visual-${obj.id}`] = el; }}
                            positions={positions}
                            pathOptions={{
                                color: obj.color || 'white',
                                weight: obj.strokeWidth || 3,
                                dashArray: obj.dash ? '20, 10' : null,
                                opacity: 0.9,
                                interactive: false // Handled by hit line
                            }}
                        />
                        {/* Hit Area Polyline */}
                        <Polyline
                            ref={el => { if (el) layerRefs.current[`hit-${obj.id}`] = el; }}
                            positions={positions}
                            pathOptions={{
                                color: 'transparent', // Invisible
                                weight: 25, // Thicker hit area
                                opacity: 0,
                                interactive: true
                            }}
                            eventHandlers={{
                                mousedown: (e) => {
                                    L.DomEvent.stopPropagation(e.originalEvent);
                                    e.target._map.dragging.disable();
                                    // Select object
                                    if (onSelect) onSelect(obj.id);

                                    // Calculate offset for all points?
                                    // For lines, simple point drag is messy.
                                    // Let's implement "Entire Line Drag"
                                    const mouseLat = e.latlng.lat;
                                    const mouseLng = e.latlng.lng;
                                    const centerLat = positions[0][0]; // Anchor to first point
                                    const centerLng = positions[0][1];

                                    setDragState({
                                        id: obj.id,
                                        offsetLat: mouseLat - centerLat,
                                        offsetLng: mouseLng - centerLng
                                    });
                                }
                            }}
                        />
                        {obj.tool === 'flight-path' && (
                            <>
                                {/* Start Plane */}
                                <Marker
                                    ref={el => { if (el) layerRefs.current[`start-${obj.id}`] = el; }}
                                    position={positions[0]}
                                    icon={planeIcon}
                                    interactive={false}
                                />
                                {/* End Plane */}
                                <Marker
                                    ref={el => { if (el) layerRefs.current[`end-${obj.id}`] = el; }}
                                    position={positions[positions.length - 1]}
                                    icon={planeIcon}
                                    interactive={false}
                                />
                            </>
                        )}
                    </React.Fragment>
                );
            })}
            {objects.filter(obj => obj.tool === 'rectangle').map((obj) => {
                if (!obj.bounds || !Array.isArray(obj.bounds) || obj.bounds.length !== 2) return null;
                const [p1, p2] = obj.bounds;
                if (!p1 || !p2 || isNaN(p1[0]) || isNaN(p1[1]) || isNaN(p2[0]) || isNaN(p2[1])) {
                    return null;
                }

                return (
                    <Rectangle
                        ref={el => { if (el) layerRefs.current[`visual-${obj.id}`] = el; }}
                        key={obj.id}
                        bounds={obj.bounds}
                        pathOptions={{
                            color: obj.color || 'white',
                            fill: true,
                            fillOpacity: 0.05, // Slight fill for better UX/Hit detection
                            weight: 2
                        }}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                if (onSelect) onSelect(obj.id);
                            },
                            mousedown: (e) => {
                                L.DomEvent.stopPropagation(e.originalEvent);
                                // e.target._map.dragging.disable(); // Handled by EventsHandler? No, usually here.
                                e.originalEvent.preventDefault(); // crucial

                                if (onSelect) onSelect(obj.id);

                                setDragState({
                                    type: 'rectangle',
                                    id: obj.id,
                                    startLat: e.latlng.lat,
                                    startLng: e.latlng.lng,
                                    initialBounds: obj.bounds // [[lat1,lng1], [lat2,lng2]]
                                });

                                e.target._map.dragging.disable();
                            }
                        }}
                    />
                );
            })}

            {objects.filter(obj => obj.tool === 'circle').map((obj) => {
                const pos = toLeaflet(obj.x, obj.y);
                return (
                    <React.Fragment key={obj.id}>
                        {/* Visual Circle */}
                        <Circle
                            ref={el => { if (el) layerRefs.current[`visual-${obj.id}`] = el; }}
                            center={pos}
                            radius={obj.radius}
                            pathOptions={{
                                color: obj.color || 'white',
                                fill: false,
                                weight: 2,
                                interactive: false // Events handled by hit circle
                            }}
                        />
                        {/* Hit Area Circle (Invisible but thicker) */}
                        <Circle
                            ref={el => { if (el) layerRefs.current[`hit-${obj.id}`] = el; }}
                            center={pos}
                            radius={obj.radius}
                            pathOptions={{
                                stroke: true,
                                color: 'transparent', // Invisible
                                weight: 25, // Large hit area
                                opacity: 0,
                                fill: false,
                                interactive: true // Ensure interactive
                            }}
                            bubblingMouseEvents={false} // Prevents map draw on mousedown
                            eventHandlers={{
                                click: (e) => {
                                    L.DomEvent.stopPropagation(e);
                                    if (onSelect) onSelect(obj.id);
                                },
                                mousedown: (e) => {
                                    // Restore Body Dragging
                                    L.DomEvent.stopPropagation(e);
                                    e.target._map.dragging.disable();

                                    if (onSelect) onSelect(obj.id); // Select on drag start too

                                    const mouseLat = e.latlng.lat;
                                    const mouseLng = e.latlng.lng;
                                    const centerLat = pos[0];
                                    const centerLng = pos[1];

                                    setDragState({
                                        id: obj.id,
                                        offsetLat: mouseLat - centerLat,
                                        offsetLng: mouseLng - centerLng
                                    });
                                }
                            }}
                        />
                    </React.Fragment>
                )
            })}

            {objects.filter(obj => obj.tool === 'logo' && obj.logoSrc).map((obj) => {
                const pos = toLeaflet(obj.x, obj.y);

                // Dynamic Scaling Logic
                // Boost visibility when zoomed out or in
                const baseSize = obj.width || 60;
                const scale = Math.pow(2, currentZoom - 1);

                // Increased multiplier (1.8) and limits (50px - 300px) as requested
                let size = Math.max(50, baseSize * scale * 1.8);
                if (isNaN(size) || size <= 0) size = 60;
                size = Math.min(300, size);

                // Debug sizing
                // if (obj.tool === 'logo') console.log(`Rendering Logo ID: ${obj.id}, Size: ${size}, Src: ${obj.logoSrc}`);

                // Inject style to force max-width if css fails
                const styleInjection = `<style>.custom-logo-icon-v2 img { max-width: ${size}px !important; max-height: ${size}px !important; }</style>`;

                const icon = L.divIcon({
                    className: 'custom-logo-icon-v2',
                    // Explicit pixel size in style to override any CSS conflicts
                    html: `${styleInjection}<div style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                     <img src="${resolveLogoUrl(obj.logoSrc)}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); display: block;" />
                                   </div>`,
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2],
                });

                return (
                    <Marker
                        key={obj.id}
                        position={pos}
                        icon={icon}
                        draggable={!readOnly}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                if (onSelect) onSelect(obj.id);
                            },
                            dragend: (e) => {
                                const { lat, lng } = e.target.getLatLng();
                                const newPos = toKonva(lat, lng);
                                onUpdateObject(obj.id, { x: newPos.x, y: newPos.y });
                            }
                        }}
                    />
                );

            })}

            {objects.filter(obj => obj.tool === 'vehicle').map((obj) => {
                const pos = toLeaflet(obj.x, obj.y);
                // Scale icon based on zoom to make it stick to map scale
                // Zoom 1 = Scale 1 (64px base).
                const scale = Math.max(0.3, Math.pow(2, currentZoom - 1));
                const size = 64 * scale;

                const html = renderToStaticMarkup(
                    <div style={{
                        width: `${size}px`, height: `${size}px`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: obj.color || '#ef4444',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                    }}>
                        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M12 14 V 22" />
                            <path d="M10 12 L 2 12" />
                            <path d="M14 12 L 22 12" />
                            <path d="M22 12 A 10 10 0 0 0 12 2" strokeOpacity="0.5" />
                        </svg>
                    </div>
                );
                const icon = L.divIcon({
                    className: 'custom-vehicle-icon',
                    html: html,
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2],
                });

                return (
                    <Marker
                        key={obj.id}
                        position={pos}
                        icon={icon}
                        draggable={true} // Allow drag
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                if (onSelect) onSelect(obj.id);
                            },
                            dragend: (e) => {
                                const { lat, lng } = e.target.getLatLng();
                                const newPos = toKonva(lat, lng);
                                onUpdateObject(obj.id, { x: newPos.x, y: newPos.y });
                            }
                        }}
                    />
                );
            })}

            {objects.filter(obj => obj.tool === 'text').map((obj) => {
                const pos = toLeaflet(obj.x, obj.y);
                const icon = L.divIcon({
                    className: 'custom-text-icon',
                    html: `<div style="
                        color: ${obj.color};
                        font-size: ${obj.fontSize || 14}px;
                        font-weight: bold;
                        white-space: nowrap;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                        transform: translate(-50%, -50%);
                        pointer-events: auto;
                    ">${obj.text}</div>`,
                    iconSize: [100, 40],
                    iconAnchor: [50, 20],
                });

                return (
                    <Marker
                        key={obj.id}
                        position={pos}
                        icon={icon}
                        draggable={!readOnly}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                if (onSelect) onSelect(obj.id);
                            },
                            dblclick: (e) => {
                                L.DomEvent.stopPropagation(e);
                                setTextModal({
                                    isOpen: true,
                                    pos: null,
                                    editingId: obj.id,
                                    initialValue: obj.text
                                });
                            },
                            dragend: (e) => {
                                const { lat, lng } = e.target.getLatLng();
                                const newPos = toKonva(lat, lng);
                                onUpdateObject(obj.id, { x: newPos.x, y: newPos.y });
                            }
                        }}
                    />
                );
            })}

            {objects.filter(obj => ['enemy', 'loot', 'drop', 'marker'].includes(obj.tool)).map((obj) => {
                const pos = toLeaflet(obj.x, obj.y);

                let iconHtml = '';
                // Enemy: Red Skull
                if (obj.tool === 'enemy') {
                    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${obj.color || '#ef4444'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 7a5 5 0 0 1 10 0v4a5 5 0 0 1-10 0v-4"/><path d="M4 11v8a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-8"/></svg>`;
                }
                // Loot: Green Simple Marker (Circle)
                else if (obj.tool === 'loot') {
                    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#22c55e" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="6"/></svg>`;
                }
                // Drop: Cyan MapPin
                else if (obj.tool === 'drop') {
                    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${obj.color || '#06b6d4'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
                }
                // Default Marker
                else {
                    iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="1"><circle cx="12" cy="12" r="6"/></svg>`;
                }

                const customIcon = L.divIcon({
                    className: 'custom-marker-icon',
                    html: `<div style="filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));">${iconHtml}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                return (
                    <Marker
                        key={obj.id}
                        position={pos}
                        icon={customIcon}
                        draggable={!readOnly}
                        eventHandlers={{
                            dragend: (e) => {
                                const { lat, lng } = e.target.getLatLng();
                                const newPos = toKonva(lat, lng);
                                onUpdateObject(obj.id, { x: newPos.x, y: newPos.y });
                            }
                        }}
                    />
                );
            })}
        </>
    ), [objects, toLeaflet, toKonva, handleZoneDragEndGeometry, onSelect, currentZoom, readOnly, onUpdateObject, setTextModal, layerRefs, setDragState]);

    return (
        <div className="relative w-full h-full bg-[#09090b]">
            <MapContainer
                crs={L.CRS.Simple}
                zoomControl={false}
                center={[MAP_DIMENSIONS / 2, MAP_DIMENSIONS / 2]}
                zoom={0}
                minZoom={-2}
                maxZoom={4}
                zoomSnap={0.1}
                zoomDelta={0.5}
                style={{ height: '100%', width: '100%', background: '#09090b' }}
                preferCanvas={true} // Keep this as default
                attributionControl={false}
                renderer={canvasRenderer} // Apply globally if possible, otherwise per layer
            >
                <MapController dimensions={MAP_DIMENSIONS} />
                <ZoomHandler onZoomChange={setCurrentZoom} />

                {/* Programmatic Draw Handler */}
                {!readOnly && <DrawHandler tool={activeLogo ? 'select' : tool} onCreated={handleFeatureCreated} />}
                {!readOnly && <DropHandler />}
                <EventsHandler
                    dragState={dragState}
                    setDragState={setDragState}
                    handleZoneDrag={handleZoneDrag}
                    tool={tool}
                    activeLogo={activeLogo}
                    onAddObject={onAddObject}
                    color={color}
                    onSelect={onSelect}
                    toKonva={toKonva}
                    onUpdateObject={onUpdateObject}
                    onOpenTextModal={(pos) => setTextModal({ isOpen: true, pos })}
                />


                {/* Selection & Transform Controls (Handles) */}
                {selectedId && !readOnly && (() => {
                    const obj = objects.find(o => o.id === selectedId);
                    if (!obj) return null;

                    // --- HELPERS ---
                    // Calculate Centroid/Center for the handle
                    let centerX, centerY;
                    if (obj.tool === 'circle') {
                        const center = toLeaflet(obj.x, obj.y); // [lat, lng]
                        centerX = center[1]; // lng
                        centerY = center[0]; // lat
                    } else if (obj.tool === 'rectangle') {
                        // Rectangle Center
                        if (obj.bounds && obj.bounds.length === 2) {
                            const p1 = obj.bounds[0];
                            const p2 = obj.bounds[1];
                            const cLat = (p1[0] + p2[0]) / 2;
                            const cLng = (p1[1] + p2[1]) / 2;
                            centerX = cLng;
                            centerY = cLat;
                        } else {
                            // Fallback if bounds undefined
                            centerX = 0; centerY = 0;
                        }
                    } else if (obj.tool === 'polyline' || obj.tool === 'flight-path') {
                        const xs = obj.points.map(p => p.x);
                        const ys = obj.points.map(p => p.y);
                        // Center of Bounding Box
                        const cXKonva = (Math.min(...xs) + Math.max(...xs)) / 2;
                        const cYKonva = (Math.min(...ys) + Math.max(...ys)) / 2;
                        const center = toLeaflet(cXKonva, cYKonva);
                        centerX = center[1];
                        centerY = center[0];
                    } else {
                        // For markers/logos/text/vehicle with x,y
                        const center = toLeaflet(obj.x, obj.y);
                        centerX = center[1];
                        centerY = center[0];
                    }

                    return (
                        <React.Fragment>
                            {/* --- MOVE HANDLE (Center) --- */}
                            <Marker
                                position={[centerY, centerX]}
                                draggable={true}
                                icon={L.divIcon({
                                    className: 'move-handle',
                                    html: `<div class="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 transition-transform" title="Drag to Move">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20"/></svg>
                                           </div>`,
                                    iconSize: [0, 0]
                                })}
                                zIndexOffset={1002} // Higher than scale handle
                                bubblingMouseEvents={false}
                                eventHandlers={{
                                    dragstart: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        e.target._map.dragging.disable();
                                    },
                                    drag: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        const { lat, lng } = e.target.getLatLng();
                                        const newPos = toKonva(lat, lng);

                                        // Visual update only
                                        if (obj.tool === 'circle') {
                                            const visual = layerRefs.current[`visual-${obj.id}`];
                                            const hit = layerRefs.current[`hit-${obj.id}`];
                                            // Handle itself updates automatically via drag
                                            // Update Circle parts
                                            if (visual) visual.setLatLng([lat, lng]);
                                            if (hit) hit.setLatLng([lat, lng]);
                                            // Update Scale Handle position too
                                            // (Requires re-render or ref access? React state update on drag end handles it, 
                                            //  but for smooth visual, we might need direct DOM manipulation or force update. 
                                            //  Actually, if we move center, Scale Handle stays at old position until re-render!
                                            //  We need to move the Scale Handle manually too if valid ref.)
                                            //  Let's trust React re-render on dragend for Position Reset, 
                                            //  but while dragging, Scale Handle will lag. 
                                            //  Fix: Dragging Center Handle moves the object conceptually.
                                        }
                                        // Other tools...
                                    },
                                    dragend: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        e.target._map.dragging.enable();
                                        const { lat, lng } = e.target.getLatLng();
                                        handleZoneDrag(obj.id, { lat, lng }, true);
                                    },
                                    click: (e) => L.DomEvent.stopPropagation(e),
                                    mousedown: (e) => L.DomEvent.stopPropagation(e),
                                    pointerdown: (e) => L.DomEvent.stopPropagation(e)
                                }}
                            />

                            {/* --- DELETE HANDLE (Offset Left) --- */}
                            {!readOnly && onDeleteObject && (
                                <Marker
                                    position={[centerY, centerX]}
                                    draggable={false}
                                    icon={L.divIcon({
                                        className: 'delete-handle',
                                        html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-[200%] hover:scale-110 transition-transform cursor-pointer" title="Delete Object">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                               </div>`,
                                        iconSize: [0, 0]
                                    })}
                                    zIndexOffset={1003}
                                    eventHandlers={{
                                        click: (e) => {
                                            L.DomEvent.stopPropagation(e);
                                            onDeleteObject(obj.id);
                                        }
                                    }}
                                />
                            )}

                            {/* --- SCALE HANDLE (Edge/Corner) --- */}
                            {(() => {
                                if (obj.tool === 'circle') {
                                    return (
                                        <Marker
                                            position={[centerY, centerX + obj.radius]}
                                            draggable={true}
                                            icon={L.divIcon({
                                                className: 'scale-handle',
                                                html: `<div class="w-8 h-8 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-ew-resize hover:scale-110 transition-transform" title="Drag to Resize">
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12H3"/><path d="M21 12l-4-4"/><path d="M21 12l-4 4"/><path d="M3 12l4-4"/><path d="M3 12l4 4"/></svg>
                                                       </div>`,
                                                iconSize: [0, 0]
                                            })}
                                            bubblingMouseEvents={false}
                                            eventHandlers={{
                                                dragstart: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    e.target._map.dragging.disable();
                                                },
                                                drag: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    const { lng } = e.target.getLatLng();
                                                    const newRadius = Math.abs(lng - centerX);
                                                    const visualLayer = layerRefs.current[`visual-${obj.id}`];
                                                    const hitLayer = layerRefs.current[`hit-${obj.id}`];
                                                    if (visualLayer) visualLayer.setRadius(newRadius);
                                                    if (hitLayer) hitLayer.setRadius(newRadius);
                                                },
                                                dragend: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    e.target._map.dragging.enable();
                                                    const { lng } = e.target.getLatLng();
                                                    const newRadius = Math.abs(lng - centerX);
                                                    onUpdateObject(obj.id, { radius: newRadius });
                                                },
                                                click: (e) => L.DomEvent.stopPropagation(e),
                                                mousedown: (e) => L.DomEvent.stopPropagation(e),
                                                pointerdown: (e) => L.DomEvent.stopPropagation(e)
                                            }}
                                        />
                                    );
                                } else if (obj.tool === 'polyline' || obj.tool === 'flight-path') {
                                    // Scale Handle at Top-Right of bounds
                                    const xs = obj.points.map(p => p.x);
                                    const ys = obj.points.map(p => p.y);
                                    const maxX = Math.max(...xs);
                                    const minY = Math.min(...ys); // Top (Konva y=0 is top)
                                    // Leaflet: Lat = MAP_DIM - y. So minKonvaY = maxLat.

                                    const handleLat = MAP_DIMENSIONS - minY;
                                    const handleLng = maxX;

                                    // Capture Center for scaling calculation
                                    const cLat = centerY;
                                    const cLng = centerX;

                                    return (
                                        <Marker
                                            position={[handleLat, handleLng]}
                                            draggable={true}
                                            icon={L.divIcon({
                                                className: 'scale-handle',
                                                html: `<div class="w-6 h-6 bg-white border-2 border-black rounded-sm shadow-sm cursor-nwse-resize transform -translate-x-1/2 -translate-y-1/2 touch-none"></div>`,
                                                iconSize: [0, 0]
                                            })}
                                            bubblingMouseEvents={false}
                                            eventHandlers={{
                                                dragstart: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    e.target._map.dragging.disable();
                                                    // Store initial state for scaling math
                                                    // setScaleState({ // setScaleState is not defined, assuming it's not critical for this replacement
                                                    //     id: obj.id,
                                                    //     startPoints: obj.points,
                                                    //     centerX: (Math.min(...xs) + Math.max(...xs)) / 2,
                                                    //     centerY: (Math.min(...ys) + Math.max(...ys)) / 2,
                                                    //     startHandle: { x: maxX, y: minY },
                                                    //     startMaxX: maxX, startMinY: minY
                                                    // });
                                                },
                                                drag: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    const { lat, lng } = e.target.getLatLng();
                                                    const currX = lng;
                                                    const currY = MAP_DIMENSIONS - lat;

                                                    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
                                                    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

                                                    const startDist = Math.sqrt(Math.pow(maxX - cx, 2) + Math.pow(minY - cy, 2));
                                                    const currDist = Math.sqrt(Math.pow(currX - cx, 2) + Math.pow(currY - cy, 2));

                                                    if (startDist < 1) return;
                                                    const scale = currDist / startDist;

                                                    const newPoints = obj.points.map(p => ({
                                                        x: cx + (p.x - cx) * scale,
                                                        y: cy + (p.y - cy) * scale
                                                    }));

                                                    // VISUAL ONLY UPDATE
                                                    const visual = layerRefs.current[`visual-${obj.id}`]; // Polyline
                                                    const hit = layerRefs.current[`hit-${obj.id}`];       // Hit Polyline
                                                    if (visual || hit) {
                                                        const latlngs = newPoints.map(p => toLeaflet(p.x, p.y));
                                                        if (visual) visual.setLatLngs(latlngs);
                                                        if (hit) hit.setLatLngs(latlngs);
                                                    }
                                                },
                                                dragend: (e) => {
                                                    L.DomEvent.stopPropagation(e);
                                                    e.target._map.dragging.enable();

                                                    const { lat, lng } = e.target.getLatLng();
                                                    const currX = lng;
                                                    const currY = MAP_DIMENSIONS - lat;
                                                    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
                                                    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
                                                    const startDist = Math.sqrt(Math.pow(maxX - cx, 2) + Math.pow(minY - cy, 2));
                                                    const currDist = Math.sqrt(Math.pow(currX - cx, 2) + Math.pow(currY - cy, 2));
                                                    const scale = currDist / startDist;

                                                    const newPoints = obj.points.map(p => ({
                                                        x: cx + (p.x - cx) * scale,
                                                        y: cy + (p.y - cy) * scale
                                                    }));
                                                    onUpdateObject(obj.id, { points: newPoints });
                                                }
                                            }}
                                        />
                                    );
                                }
                            })()}
                        </React.Fragment>
                    );
                })()}


                <ImageOverlay
                    url={mapImage}
                    bounds={[[0, 0], [MAP_DIMENSIONS, MAP_DIMENSIONS]]} // Use Dimensions, NOT image size
                />


                <FeatureGroup>
                    {/* We keep empty FeatureGroup or minimal EditControl if we want editing later,
                        but for now DrawHandler handles creation. */ }
                </FeatureGroup>

                <LayerGroup>


                    {renderedObjects}
                </LayerGroup>


                <CustomZoomControl />
                <MapDownloadListener mapName={mapName} />
            </MapContainer>

            {/* Text Input Modal */}

            <TextPromptModal
                isOpen={textModal.isOpen}
                onClose={() => setTextModal({ isOpen: false, pos: null, editingId: null, initialValue: '' })}
                onSubmit={handleTextSubmit}
                title={textModal.editingId ? "Edit Label" : "Add Label"}
                placeholder="Enter text..."
                initialValue={textModal.initialValue || ''}
            />
        </div >
    );
};

// Separate component for Map Events to access useMap context correctly
const EventsHandler = ({
    dragState, setDragState, handleZoneDrag,
    tool, activeLogo, onAddObject, color,
    onSelect, toKonva, onOpenTextModal, onUpdateObject
}) => {
    const map = useMap();
    const [drawingState, setDrawingState] = useState(null);

    useMapEvents({
        click: (e) => {
            if (activeLogo) {
                const { lat, lng } = e.latlng;
                const pos = toKonva(lat, lng);
                onAddObject({
                    tool: 'logo',
                    type: 'logo',
                    x: pos.x,
                    y: pos.y,
                    logoSrc: activeLogo,
                    width: 60,
                    height: 60,
                    rotation: 0
                });
            } else if (tool === 'vehicle') {
                const { lat, lng } = e.latlng;
                const pos = toKonva(lat, lng);
                onAddObject({
                    tool: 'vehicle',
                    x: pos.x,
                    y: pos.y,
                    color: color || '#ef4444' // Default Red
                });
            } else if (tool === 'text') {
                const { lat, lng } = e.latlng;
                const pos = toKonva(lat, lng);
                if (onOpenTextModal) {
                    onOpenTextModal(pos);
                }
            }
        },
        mousedown: (e) => {
            // --- Custom Drag-to-Draw for Rectangles and Brush (Pencil) ---
            if (tool === 'rectangle') {
                e.originalEvent.preventDefault();
                map.dragging.disable();
                const { lat, lng } = e.latlng;
                setDrawingState({
                    tool: tool,
                    start: [lat, lng],
                    current: [lat, lng]
                });
            } else if (tool === 'brush') {
                // Pencil Tool Start
                e.originalEvent.preventDefault();
                map.dragging.disable();
                const { lat, lng } = e.latlng;
                setDrawingState({
                    tool: 'brush',
                    points: [{ x: lat, y: lng }] // Storing LatLngs for brush
                });
            } else if (tool === 'circle') {
                // Manual Circle Draw Start
                e.originalEvent.preventDefault();
                map.dragging.disable();
                const { lat, lng } = e.latlng;
                setDrawingState({
                    tool: 'circle',
                    start: [lat, lng],
                    current: [lat, lng]
                });
            } else if (tool === 'select') {
                if (e.originalEvent.target.classList.contains('leaflet-container')) {
                    onSelect(null);
                }
            }
        },
        mousemove: (e) => {
            // Drag Logic for Move Handle / objects
            if (dragState) {
                if (dragState.type === 'rectangle') {
                    const { id, startLat, startLng, initialBounds } = dragState;
                    const deltaLat = e.latlng.lat - startLat;
                    const deltaLng = e.latlng.lng - startLng;

                    const newBounds = [
                        [initialBounds[0][0] + deltaLat, initialBounds[0][1] + deltaLng],
                        [initialBounds[1][0] + deltaLat, initialBounds[1][1] + deltaLng]
                    ];
                    onUpdateObject(id, { bounds: newBounds });
                } else {
                    // Zone Drag
                    const { id, offsetLat, offsetLng } = dragState;
                    const newLat = e.latlng.lat - offsetLat;
                    const newLng = e.latlng.lng - offsetLng;
                    handleZoneDrag(id, { lat: newLat, lng: newLng }, false);
                }
            }

            // Drawing Preview Logic
            if (drawingState) {
                const { lat, lng } = e.latlng;

                if (drawingState.tool === 'rectangle') {
                    setDrawingState(prev => ({ ...prev, current: [lat, lng] }));
                } else if (drawingState.tool === 'brush') {
                    // Add points to brush path
                    setDrawingState(prev => ({ ...prev, points: [...prev.points, { x: lat, y: lng }] }));
                } else if (drawingState.tool === 'circle') {
                    setDrawingState(prev => ({ ...prev, current: [lat, lng] }));
                }
            }
        },
        mouseup: (e) => {
            // End Dragging Object
            if (dragState) {
                if (dragState.type === 'rectangle') {
                    // Final update (already doing it live in mousemove, but good to ensure)
                    // No special cleanup needed besides setState null
                } else {
                    const { id, offsetLat, offsetLng } = dragState;
                    const newLat = e.latlng.lat - offsetLat;
                    const newLng = e.latlng.lng - offsetLng;
                    handleZoneDrag(id, { lat: newLat, lng: newLng }, true);
                }
                setDragState(null);
                map.dragging.enable();
            }

            // End Drawing
            if (drawingState) {
                map.dragging.enable();
                const toolType = drawingState.tool;

                if (toolType === 'rectangle') {
                    const start = drawingState.start;
                    const end = drawingState.current;
                    setDrawingState(null);
                    const dist = Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2));
                    if (dist < 0.0001) return;

                    const bounds = L.latLngBounds(start, end);
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    onAddObject({
                        tool: 'rectangle',
                        bounds: [[sw.lat, sw.lng], [ne.lat, ne.lng]],
                        color: color || 'white'
                    });
                } else if (toolType === 'circle') {
                    const start = drawingState.start;
                    const end = drawingState.current;
                    setDrawingState(null);

                    // Calculate Radius in Map Units (Pixels)
                    const startPos = toKonva(start[0], start[1]);
                    const endPos = toKonva(end[0], end[1]);
                    const radius = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));

                    if (radius < 5) return;

                    onAddObject({
                        tool: 'circle',
                        x: startPos.x,
                        y: startPos.y,
                        radius: radius,
                        color: color || 'white'
                    });
                } else if (toolType === 'brush') {
                    const points = drawingState.points; // [{x: lat, y: lng}]
                    setDrawingState(null);
                    if (points.length < 2) return;

                    // Convert LatLngs to Konva for storage
                    const konvaPoints = points.map(p => toKonva(p.x, p.y));

                    // Simplify: Maybe reduce points? For now raw.
                    onAddObject({
                        tool: 'polyline', // Freehand stored as polyline
                        points: konvaPoints,
                        color: color || 'white',
                        strokeWidth: 3,
                        smooth: true // Helper flag if needed later
                    });
                }
            }
        },
    });

    return (
        <React.Fragment>
            {drawingState && (
                <React.Fragment>
                    {drawingState.tool === 'rectangle' && (
                        <Rectangle
                            bounds={[drawingState.start, drawingState.current]}
                            pathOptions={{ color: color || 'white', dashArray: '5, 5', fill: false }}
                        />
                    )}
                    {drawingState.tool === 'circle' && (
                        <Circle
                            center={drawingState.start}
                            radius={(() => {
                                const startPos = toKonva(drawingState.start[0], drawingState.start[1]);
                                const endPos = toKonva(drawingState.current[0], drawingState.current[1]);
                                return Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
                            })()}
                            pathOptions={{ color: color || 'white', dashArray: '5, 5', fill: false }}
                        />
                    )}
                    {drawingState.tool === 'brush' && drawingState.points && drawingState.points.length > 1 && (
                        <Polyline
                            positions={drawingState.points.map(p => [p.x, p.y])}
                            pathOptions={{ color: color || 'white', weight: 4, opacity: 0.7 }}
                        />
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};




export default LeafletMapCanvas;
