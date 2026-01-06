import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle, Rect, Text, Transformer, Group, Arrow } from 'react-konva';
import { ZONE_RADII, FLIGHT_PATH_COLOR, ZONE_COLOR } from '../../utils/esportsConstants';
import useImage from 'use-image';

// Helper to get distance between points
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Custom MapImage component to handle handling large images
const MapImage = ({ src, onLoaded, width, height }) => {
    const [image, status] = useImage(src);

    useEffect(() => {
        if (image && onLoaded) {
            // Force report of standardized size
            onLoaded({ width: width || image.width, height: height || image.height });
        }
    }, [image, onLoaded, width, height]);

    if (status === 'loading') return <Text text="Loading Map..." x={100} y={100} fill="white" fontSize={24} />;

    return <KonvaImage image={image} width={width} height={height} />;
};


const MapCanvas = ({
    mapSrc,
    tool,
    objects,
    setObjects,
    selectShape,
    selectedId,
    checkDeselect,
    gridVisible,
    stageRef
}) => {
    const [mapSize, setMapSize] = useState({ width: 8192, height: 8192 });
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth - 320,
        height: window.innerHeight - 64
    });

    useEffect(() => {
        const handleResize = () => {
            // Navbar (64) + MapTools (~60) = ~124px offset height
            // Width is close to full window width (minus scrollbar if any)
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 124
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [isDrawing, setIsDrawing] = useState(false);

    // Position ref for delta calculations during drag
    const lastPosRef = useRef({ x: 0, y: 0 });

    // Handle Map Load
    const handleMapLoad = useCallback((size) => {
        setMapSize(size);

        // Initial auto-fit
        if (stageRef.current) {
            const stage = stageRef.current;
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight - 124;

            const scaleX = containerWidth / size.width;
            const scaleY = containerHeight / size.height;
            const scale = Math.min(scaleX, scaleY, 1); // Fit to screen, max 1

            stage.scale({ x: scale, y: scale });
            stage.position({ x: 0, y: 0 });
            stage.batchDraw();
        }
    }, [stageRef]); // Added stageRef dependency

    // Drawing Logic
    const handleMouseDown = (e) => {
        // If we clicked on an empty area, deselect
        checkDeselect(e);

        if (tool === 'select') return;

        const pos = e.target.getStage().getRelativePointerPosition();
        setIsDrawing(true);

        const id = Date.now().toString();

        let newObject;

        if (tool === 'brush') {
            newObject = {
                id,
                tool,
                points: [pos.x, pos.y],
                stroke: '#df2935', // Red default
                strokeWidth: 5,
                tension: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
            };
        } else if (tool === 'line' || tool === 'arrow') {
            newObject = {
                id,
                tool,
                points: [pos.x, pos.y, pos.x, pos.y],
                stroke: '#fdca40', // Yellow default
                strokeWidth: 5,
                fullPoints: [pos.x, pos.y] // Store start
            };
        } else if (tool === 'rect') {
            newObject = {
                id,
                tool,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                stroke: '#3772ff',
                strokeWidth: 4,
                fill: 'rgba(55, 114, 255, 0.2)'
            };
        } else if (tool === 'circle') {
            newObject = {
                id,
                tool,
                x: pos.x,
                y: pos.y,
                radius: 0,
                stroke: '#ffffff',
                strokeWidth: 4,
                fill: 'rgba(255,255,255,0.1)'
            };
        } else if (tool === 'zone-center') {
            // Create concentric zones group
            newObject = {
                id,
                tool: 'concentric-zones',
                x: pos.x,
                y: pos.y,
                // No individual radius, uses constants
                stroke: ZONE_COLOR,
                strokeWidth: 2,
            };
        } else if (tool === 'flight-path') {
            newObject = {
                id,
                tool: 'flight-path',
                points: [pos.x, pos.y, pos.x, pos.y], // Start and end same initially
                stroke: FLIGHT_PATH_COLOR,
                strokeWidth: 4,
                fullPoints: [pos.x, pos.y]
            };
        }

        if (newObject) {
            setObjects([...objects, newObject]);
        }
    };

    // Drag Logic: Group Movement & Strict Containment
    const handleDragStart = (e) => {
        lastPosRef.current = e.target.position();
    };

    const handleDragMove = (e) => {
        const id = e.target.id();
        const obj = objects.find(o => o.id === id);

        if (!obj || obj.tool !== 'zone') return;

        const node = e.target;
        let currentPos = node.position();

        // 1. Parent Constraint (e.g. Z2 inside Z1)
        if (obj.phase > 1) {
            const parent = objects.find(o => o.tool === 'zone' && o.phase === obj.phase - 1);
            if (parent) {
                // We use parent's state position (center) as reference.
                // NOTE: If parent is also moving, state might lag, but practically 
                // in standard drag (one obj at a time) this works for child constraints.
                const parentPos = { x: parent.x, y: parent.y };

                const dx = currentPos.x - parentPos.x;
                const dy = currentPos.y - parentPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = parent.radius - obj.radius;

                if (dist > maxDist) {
                    // Clamp
                    const angle = Math.atan2(dy, dx);
                    const clampedX = parentPos.x + maxDist * Math.cos(angle);
                    const clampedY = parentPos.y + maxDist * Math.sin(angle);

                    node.position({ x: clampedX, y: clampedY });
                    currentPos = { x: clampedX, y: clampedY };
                }
            }
        }

        // 2. Move Children (e.g. Dragging Z1 moves Z2..Z8)
        const deltaX = currentPos.x - lastPosRef.current.x;
        const deltaY = currentPos.y - lastPosRef.current.y;

        lastPosRef.current = currentPos;

        if (deltaX !== 0 || deltaY !== 0) {
            // Find children: zones with phase > obj.phase
            const children = objects.filter(o => o.tool === 'zone' && o.phase > obj.phase);
            children.forEach(child => {
                const childNode = stageRef.current.findOne('#' + child.id);
                if (childNode) {
                    childNode.move({ x: deltaX, y: deltaY });
                }
            });
        }
    };

    const handleDragEnd = (e) => {
        // Sync all visual positions to state
        const id = e.target.id();
        const obj = objects.find(o => o.id === id);

        if (obj && obj.tool === 'zone') {
            // Update ALL zones from their current Node positions
            // This captures the dragged parent AND the moved children
            setObjects(objects.map(o => {
                if (o.tool === 'zone') {
                    const n = stageRef.current.findOne('#' + o.id);
                    if (n) {
                        return { ...o, x: n.x(), y: n.y() };
                    }
                }
                return o;
            }));
        } else {
            // Standard update for non-zones
            const node = e.target;
            setObjects(objects.map(o => {
                if (o.id === id) return { ...o, x: node.x(), y: node.y() };
                return o;
            }));
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const stage = e.target.getStage();
        const point = stage.getRelativePointerPosition();

        // Update the last object
        const lastObject = objects[objects.length - 1];

        if (tool === 'brush') {
            const newPoints = lastObject.points.concat([point.x, point.y]);
            const newObjects = objects.slice(0, objects.length - 1).concat({
                ...lastObject,
                points: newPoints,
            });
            setObjects(newObjects);
        } else if (tool === 'line' || tool === 'arrow' || tool === 'flight-path') {
            const newObjects = objects.slice(0, objects.length - 1).concat({
                ...lastObject,
                points: [lastObject.fullPoints[0], lastObject.fullPoints[1], point.x, point.y]
            });
            setObjects(newObjects);
        } else if (tool === 'rect') {
            const newWidth = point.x - lastObject.x;
            const newHeight = point.y - lastObject.y;

            const newObjects = objects.slice(0, objects.length - 1).concat({
                ...lastObject,
                width: newWidth,
                height: newHeight
            });
            setObjects(newObjects);
        } else if (tool === 'circle') {
            const dx = point.x - lastObject.x;
            const dy = point.y - lastObject.y;
            const radius = Math.sqrt(dx * dx + dy * dy);

            const newObjects = objects.slice(0, objects.length - 1).concat({
                ...lastObject,
                radius
            });
            setObjects(newObjects);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    // Transformer
    const trRef = useRef();
    useEffect(() => {
        if (selectedId && trRef.current) {
            const node = stageRef.current.findOne('#' + selectedId);
            if (node) {
                // If it's a zone, we might want to disable resizing
                const isZone = objects.find(o => o.id === selectedId)?.tool === 'zone';

                trRef.current.nodes([node]);

                if (isZone || objects.find(o => o.id === selectedId)?.tool === 'concentric-zones') {
                    trRef.current.enabledAnchors([]); // Disable all resize handles
                    trRef.current.rotateEnabled(false); // Disable rotation
                } else {
                    trRef.current.enabledAnchors(['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']);
                    trRef.current.rotateEnabled(true);
                }

                trRef.current.getLayer().batchDraw();
            }
        } else if (trRef.current) {
            trRef.current.nodes([]);
            trRef.current.getLayer().batchDraw();
        }
    }, [selectedId, objects]); // Check objects too in case selected obj was deleted

    // Grid
    const GRID_SIZE = 1000; // 1km in standard PUBG maps usually 100px or similar depending on scale. 
    // Let's assume standard maps are 8192x8192 for 8km maps (Erangel/Miramar).
    // So 1km = 1024px.
    // 100m = 102.4px.
    // Let's use 1km grid lines.

    const gridLines = [];
    if (gridVisible) {
        for (let i = 0; i < mapSize.width; i += 1024) {
            gridLines.push(<Line key={`v-${i}`} points={[i, 0, i, mapSize.height]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} listening={false} />);
        }
        for (let i = 0; i < mapSize.height; i += 1024) {
            gridLines.push(<Line key={`h-${i}`} points={[0, i, mapSize.width, i]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} listening={false} />);
        }
    }


    return (
        <div className="flex-1 bg-black relative overflow-hidden h-full">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                draggable={tool === 'select'}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={checkDeselect}
                ref={stageRef}
                onWheel={(e) => {
                    e.evt.preventDefault();
                    const scaleBy = 1.1;
                    const stage = e.target.getStage();
                    const oldScale = stage.scaleX();
                    const mousePointTo = {
                        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
                        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
                    };

                    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

                    // Clamp zoom (prevent getting stuck)
                    newScale = Math.max(0.01, Math.min(newScale, 50));

                    stage.scale({ x: newScale, y: newScale });

                    const newPos = {
                        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
                        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
                    };
                    stage.position(newPos);
                    stage.batchDraw();
                }}
            >
                <Layer>
                    {/* Map Image - Forced to 2048x2048 Standard */}
                    <MapImage src={mapSrc} onLoaded={handleMapLoad} width={2048} height={2048} />

                    {/* Grid Overlay */}
                    {gridVisible && gridLines}

                    {/* Drawn Objects */}
                    {objects.map((obj, i) => {
                        if (obj.tool === 'brush') {
                            return (
                                <Line
                                    key={obj.id}
                                    id={obj.id}
                                    points={obj.points}
                                    stroke={obj.stroke}
                                    strokeWidth={obj.strokeWidth}
                                    tension={obj.tension}
                                    lineCap="round"
                                    lineJoin="round"
                                    onClick={() => selectShape(obj.id)}
                                    draggable={tool === 'select'}
                                />
                            );
                        } else if (obj.tool === 'line' || obj.tool === 'arrow') {
                            return (
                                <React.Fragment key={obj.id}>
                                    <Line
                                        id={obj.id}
                                        points={obj.points}
                                        stroke={obj.stroke}
                                        strokeWidth={obj.strokeWidth}
                                        onClick={() => selectShape(obj.id)}
                                        draggable={tool === 'select'}
                                    />
                                    {/* If arrow, add tip logic here efficiently or just simple line for now */}
                                </React.Fragment>
                            );
                        } else if (obj.tool === 'rect') {
                            return (
                                <Rect
                                    key={obj.id}
                                    id={obj.id}
                                    x={obj.x}
                                    y={obj.y}
                                    width={obj.width}
                                    height={obj.height}
                                    stroke={obj.stroke}
                                    strokeWidth={obj.strokeWidth}
                                    fill={obj.fill}
                                    onClick={() => selectShape(obj.id)}
                                    draggable={tool === 'select'}
                                />
                            );
                        } else if (obj.tool === 'circle') {
                            return (
                                <Circle
                                    key={obj.id}
                                    id={obj.id}
                                    x={obj.x}
                                    y={obj.y}
                                    radius={obj.radius}
                                    stroke={obj.stroke}
                                    strokeWidth={obj.strokeWidth}
                                    fill={obj.fill}
                                    dash={obj.dash}
                                    onClick={() => selectShape(obj.id)}
                                    draggable={tool === 'select'}
                                />
                            );
                        } else if (obj.tool === 'text') {
                            return (
                                <Text
                                    key={obj.id}
                                    id={obj.id}
                                    x={obj.x}
                                    y={obj.y}
                                    text={obj.text}
                                    fontSize={obj.fontSize || 24}
                                    fill={obj.fill || '#fff'}
                                    onClick={() => selectShape(obj.id)}
                                    draggable={tool === 'select'}
                                />
                            );
                        } else if (obj.tool === 'zone') {
                            // Render exact mathematical circle
                            return (
                                <Circle
                                    key={obj.id}
                                    id={obj.id}
                                    x={obj.x}
                                    y={obj.y}
                                    radius={obj.radius}
                                    stroke={obj.stroke || 'white'}
                                    strokeWidth={obj.strokeWidth || 8}
                                    fillEnabled={false}
                                    draggable={tool === 'select'}
                                    onClick={() => selectShape(obj.id)}
                                    onDragStart={handleDragStart}
                                    onDragMove={handleDragMove}
                                    onDragEnd={handleDragEnd}
                                    hitStrokeWidth={20} // Easier selection
                                />
                            );
                        } else if (obj.tool === 'flight-path') {
                            const [x1, y1, x2, y2] = obj.points;
                            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                            return (
                                <Group
                                    key={obj.id}
                                    id={obj.id}
                                    draggable={tool === 'select'}
                                    onClick={() => selectShape(obj.id)}
                                >
                                    {/* Path Line */}
                                    <Line
                                        points={obj.points}
                                        stroke={obj.stroke}
                                        strokeWidth={obj.strokeWidth}
                                        dash={[20, 10]}
                                        lineCap="round"
                                        strokeScaleEnabled={false}
                                        listening={false}
                                    />
                                    {/* Start Dot */}
                                    <Circle
                                        x={x1}
                                        y={y1}
                                        radius={8}
                                        fill={obj.stroke}
                                        strokeScaleEnabled={false}
                                        listening={false}
                                    />
                                    {/* Plane Icon (Text emoji as placeholder) */}
                                    <Text
                                        x={x2}
                                        y={y2}
                                        text="✈️"
                                        fontSize={40}
                                        offsetX={20}
                                        offsetY={20}
                                        rotation={angle + 90} // Adjust for emoji orientation
                                        listening={false}
                                    />
                                </Group>
                            );
                        }
                        return null;
                    })}

                    {/* Selection Transformer */}
                    <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => {
                        // Limit resize logic if needed
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default MapCanvas;
