import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Circle, Arrow, Text, Transformer } from 'react-konva';
import {
    Play, Pause, Upload, Eraser, MousePointer2,
    Pen, Circle as CircleIcon, Square, Minus,
    RotateCcw, Sparkles, AlertCircle, X,
    ChevronRight, ChevronDown, Type, Move, Save, FolderOpen, Trash2, Download
} from 'lucide-react';
import { showToast } from '../../../utils/toast';
import api from '../../../api/client';

const VideoAnalysis = () => {
    // Video State
    const [videoSrc, setVideoSrc] = useState(null);
    const [videoFile, setVideoFile] = useState(null); // Store actual file for upload
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // Metadata State
    const [title, setTitle] = useState('New Analysis');
    const [savedAnalyses, setSavedAnalyses] = useState([]);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(false);

    // Canvas State
    const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
    const [annotations, setAnnotations] = useState([]);
    const [currentTool, setCurrentTool] = useState('cursor'); // cursor, freehand, line, arrow, rect, circle, text
    const [currentColor, setCurrentColor] = useState('#ef4444'); // red-500
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedId, setSelectedId] = useState(null); // ID of selected shape
    const [isTextEditing, setIsTextEditing] = useState(false);
    const [editTextId, setEditTextId] = useState(null);
    const [editTextValue, setEditTextValue] = useState("");

    // Refs
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const videoContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const isDrawingRef = useRef(false);
    const currentShapeRef = useRef(null);
    const transformerRef = useRef(null);

    // Update dimensions on resize
    const updateDimensions = useCallback(() => {
        if (videoContainerRef.current) {
            const rect = videoContainerRef.current.getBoundingClientRect();
            setDimensions({
                width: Math.ceil(rect.width),
                height: Math.ceil(rect.height)
            });
        }
    }, []);

    useEffect(() => {
        if (!videoContainerRef.current) return;

        // Initial check
        updateDimensions();

        const observer = new ResizeObserver(() => {
            updateDimensions();
        });

        observer.observe(videoContainerRef.current);
        window.addEventListener('resize', updateDimensions);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateDimensions);
        };
    }, [updateDimensions]);

    // Handle File Load (Local)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setVideoFile(file); // Store file for potential upload
            setAnnotations([]); // Clear previous annotations
            setIsPlaying(false); // Start Paused
            setTitle(file.name.replace(/\.[^/.]+$/, "")); // Default title from filename
            showToast.success("Video loaded successfully");
        }
    };

    // Save Analysis
    const handleSave = async () => {
        if (!videoSrc) {
            showToast.error("No video to save");
            return;
        }
        if (!title.trim()) {
            showToast.error("Please enter a title");
            return;
        }

        setIsSaving(true);
        try {
            let finalVideoUrl = videoSrc;

            // If it's a local blob, upload it
            if (videoSrc.startsWith('blob:') && videoFile) {
                const formData = new FormData();
                formData.append('file', videoFile);

                showToast.info("Uploading video to cloud... This may take a moment.");
                const uploadRes = await api.post('/upload', formData);
                finalVideoUrl = uploadRes.data.url;
            }

            // Save Analysis Record
            const payload = {
                title,
                videoUrl: finalVideoUrl,
                annotations
            };

            await api.post('/video-analysis', payload);
            showToast.success("Analysis saved successfully!");
            setVideoSrc(finalVideoUrl); // Update state to use remote URL now
            setVideoFile(null); // No longer needed
        } catch (err) {
            console.error("Save Error Details:", err.response?.data);
            const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            showToast.error(`Failed to save: ${errMsg}`);
        } finally {
            setIsSaving(false);
        };
    };

    // Open Load Modal
    const openLoadModal = async () => {
        setShowLoadModal(true);
        setIsLoadingList(true);
        try {
            const res = await api.get('/video-analysis');
            setSavedAnalyses(res.data);
        } catch (error) {
            showToast.error("Failed to load list");
        } finally {
            setIsLoadingList(false);
        }
    };

    // Load Specific Analysis
    const loadAnalysis = (analysis) => {
        setVideoSrc(analysis.videoUrl);
        setAnnotations(analysis.annotations || []);
        setTitle(analysis.title);
        setVideoFile(null);
        setIsPlaying(false);
        setShowLoadModal(false);
        showToast.success("Analysis loaded");
    };

    // Delete Analysis
    const deleteAnalysis = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this analysis?")) return;

        try {
            await api.delete(`/video-analysis/${id}`);
            setSavedAnalyses(savedAnalyses.filter(a => a._id !== id));
            showToast.success("Deleted");
        } catch (error) {
            showToast.error("Failed to delete");
        }
    };

    // Video Controls
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            // Force dimension update when video metadata loads (size might change)
            setTimeout(updateDimensions, 100);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleSpeedChange = () => {
        const speeds = [0.5, 1, 1.5, 2];
        const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        setPlaybackSpeed(newSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = newSpeed;
        }
    };

    // Drawing Logic
    const getPointerPos = (e) => {
        const stage = e.target.getStage();
        return stage.getPointerPosition();
    };

    // Global Drawing Handlers (moved outside the component render scope ideally, but here via refs)
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (!isDrawingRef.current || !currentShapeRef.current) return;

            // Calculate pos relative to stage
            // Calculate pos relative to video container
            const container = videoContainerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Constrain to canvas
            // const constrainedX = Math.max(0, Math.min(x, dimensions.width));
            // const constrainedY = Math.max(0, Math.min(y, dimensions.height));
            // actually standard konva behavior usually allows going out, but let's just use raw

            const pos = { x, y };
            const shape = { ...currentShapeRef.current };

            if (currentTool === 'freehand') {
                shape.points = shape.points.concat([pos.x, pos.y]);
            } else if (currentTool === 'line') {
                // Fix: Use existing start point (points[0], points[1]) instead of x/y (which are 0)
                const startX = shape.points[0];
                const startY = shape.points[1];
                shape.points = [startX, startY, pos.x, pos.y];
            } else if (currentTool === 'rect') {
                shape.width = pos.x - shape.x;
                shape.height = pos.y - shape.y;
            } else if (currentTool === 'circle') {
                const dx = pos.x - shape.x;
                const dy = pos.y - shape.y;
                shape.radius = Math.sqrt(dx * dx + dy * dy);
            }

            // Sync with React State (throttled slightly if needed, but direct set is ok for now)
            setAnnotations(prev => {
                const newAnns = prev.slice(0, -1).concat(shape);
                return newAnns;
            });

            currentShapeRef.current = shape;
        };

        const handleGlobalMouseUp = () => {
            if (isDrawingRef.current) {
                isDrawingRef.current = false;
                setIsDrawing(false);
                currentShapeRef.current = null;
            }
        };

        if (isDrawing) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDrawing, currentTool, dimensions]); // Re-bind when drawing state starts

    const handleMouseDown = (e) => {
        // If clicking on an empty area and tool is 'cursor', deselect
        const stage = e.target.getStage();
        const clickedOnEmpty = e.target === stage;

        if (clickedOnEmpty && currentTool === 'cursor') {
            setSelectedId(null);
            return;
        }

        // Prevent creating new annotation if clicking on existing shape
        if (!clickedOnEmpty) {
            if (currentTool === 'cursor') return; // Let Shape onClick handle selection
            if (currentTool === 'text') return;   // Prevent new text creation on existing text
            // Allow drawing lines/shapes ON TOP of others, but maybe not text
        }

        if (currentTool === 'cursor' || !videoSrc) return;

        // Start Drawing
        isDrawingRef.current = true;
        setIsDrawing(true);
        setSelectedId(null);

        const pos = getPointerPos(e);
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        // Fix: Path tools (freehand, line) use points relative to x,y if x,y is set.
        // Initialize x,y to 0 for these so dragging works as offset later.
        const isPathTool = currentTool === 'freehand' || currentTool === 'line';

        let newAnnotation = {
            id,
            tool: currentTool,
            color: currentColor,
            strokeWidth: strokeWidth,
            points: isPathTool ? [pos.x, pos.y] : [],
            x: isPathTool ? 0 : pos.x,
            y: isPathTool ? 0 : pos.y,
            width: 0,
            height: 0,
            radius: 0,
            text: 'Double click to edit',
            draggable: false
        };

        if (currentTool === 'text') return; // Handled in onClick now

        setAnnotations([...annotations, newAnnotation]);
        currentShapeRef.current = newAnnotation;
    };

    const handleStageClick = (e) => {
        const stage = e.target.getStage();
        const clickedOnEmpty = e.target === stage;

        if (currentTool === 'text' && clickedOnEmpty && videoSrc) {
            const pos = getPointerPos(e);
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const newAnnotation = {
                id,
                tool: 'text',
                color: currentColor,
                strokeWidth: strokeWidth,
                points: [],
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                radius: 0,
                text: 'Double click to edit',
                draggable: false
            };
            setAnnotations(prev => [...prev, newAnnotation]);
            setSelectedId(id);
            setCurrentTool('cursor');
        }
    };

    // No longer need inline mouseMove/Up on Stage, but we keep them empty or remove props
    // Actually Stage needs to NOT have them if window handles it, OR we just ignore them.
    // Window listener is better for 'dragging out of bounds'

    const clearAnnotations = () => {
        setAnnotations([]);
        setSelectedId(null);
        showToast.success("All drawings cleared");
    };

    const undoLast = () => {
        setAnnotations(annotations.slice(0, -1));
        setSelectedId(null);
    };

    const handleDeleteSelected = () => {
        if (selectedId) {
            setAnnotations(annotations.filter(ann => ann.id !== selectedId));
            setSelectedId(null);
        }
    };

    // Tools Configuration
    const tools = [
        { id: 'cursor', icon: MousePointer2, label: 'Select' },
        { id: 'freehand', icon: Pen, label: 'Freehand' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'rect', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: CircleIcon, label: 'Circle' },
        { id: 'text', icon: Type, label: 'Text' },
    ];

    const colors = [
        '#ef4444', // Red
        '#f97316', // Orange
        '#f59e0b', // Amber
        '#eab308', // Yellow
        '#84cc16', // Lime
        '#22c55e', // Green
        '#10b981', // Emerald
        '#14b8a6', // Teal
        '#06b6d4', // Cyan
        '#0ea5e9', // Sky
        '#3b82f6', // Blue
        '#6366f1', // Indigo
        '#8b5cf6', // Violet
        '#a855f7', // Purple
        '#d946ef', // Fuchsia
        '#ec4899', // Pink
        '#f43f5e', // Rose
        '#78350f', // Brown
        '#ffffff', // White
        '#9ca3af', // Gray 400
        '#4b5563', // Gray 600
        '#1f2937', // Gray 800
        '#000000', // Black
        '#5b21b6', // Dark Violet
    ];

    // Request Fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Transformer Implementation
    const Shape = ({ shape, isSelected, onSelect, onChange }) => {
        const shapeRef = useRef(null);
        const trRef = useRef(null);

        useEffect(() => {
            if (isSelected && trRef.current && shapeRef.current) {
                trRef.current.nodes([shapeRef.current]);
                trRef.current.getLayer().batchDraw();
            }
        }, [isSelected]);

        const handleTextEdit = () => {
            if (shape.tool !== 'text') return;
            setEditTextId(shape.id);
            setEditTextValue(shape.text);
            setIsTextEditing(true);
        };

        const commonProps = {
            onClick: onSelect,
            onTap: onSelect,
            ref: shapeRef,
            draggable: currentTool === 'cursor',
            onDragEnd: (e) => {
                if (currentTool === 'cursor') {
                    onChange({
                        ...shape,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }
            },
            onTransformEnd: (e) => {
                const node = shapeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.scaleX(1);
                node.scaleY(1);

                const newAttrs = {
                    ...shape,
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                };

                if (shape.tool === 'text') {
                    // Scale font size instead of scale trait
                    newAttrs.fontSize = (shape.fontSize || 24) * scaleX;
                } else if (shape.tool === 'circle') {
                    newAttrs.radius = shape.radius * scaleX;
                } else {
                    newAttrs.width = Math.max(5, node.width() * scaleX);
                    newAttrs.height = Math.max(5, node.height() * scaleY);
                }

                onChange(newAttrs);
            }
        };

        if (shape.tool === 'freehand') {
            return (
                <Line
                    key={shape.id}
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    x={shape.x}
                    y={shape.y}
                    hitStrokeWidth={20}
                    {...commonProps}
                />
            );
        } else if (shape.tool === 'line') {
            return (
                <Line
                    key={shape.id}
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    tension={0}
                    lineCap="round"
                    lineJoin="round"
                    x={shape.x}
                    y={shape.y}
                    hitStrokeWidth={20}
                    {...commonProps}
                />
            );
        } else if (shape.tool === 'rect') {
            return (
                <>
                    <Rect
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        stroke={shape.color}
                        strokeWidth={shape.strokeWidth}
                        hitStrokeWidth={20}
                        {...commonProps}
                    />
                    {isSelected && (
                        <Transformer
                            ref={trRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                                return newBox;
                            }}
                            anchorSize={12}
                            anchorCornerRadius={6}
                        />
                    )}
                </>
            );
        } else if (shape.tool === 'circle') {
            return (
                <>
                    <Circle
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        radius={shape.radius}
                        stroke={shape.color}
                        strokeWidth={shape.strokeWidth}
                        hitStrokeWidth={20}
                        {...commonProps}
                    />
                    {isSelected && <Transformer ref={trRef} />}
                </>
            );
        } else if (shape.tool === 'text') {
            return (
                <>
                    <Text
                        key={shape.id}
                        x={shape.x}
                        y={shape.y}
                        text={shape.text}
                        fontSize={shape.fontSize || 24}
                        fill={shape.color}
                        onDblClick={handleTextEdit}
                        onDblTap={handleTextEdit}
                        {...commonProps}
                    />
                    {isSelected && <Transformer ref={trRef} enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']} />}
                </>
            )
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Strategy Hub</h1>
                    <div className="flex items-center space-x-2 text-gray-400 mt-1">
                        <span>Video Analysis</span>
                        <ChevronRight size={16} />
                        <span className="text-purple-400">VOD Review</span>
                    </div>
                </div>

                {/* AI Badge Request */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-sm font-medium text-purple-100">
                        AI Powered Video Analysis <span className="opacity-60 font-normal ml-1">- Coming Soon</span>
                    </span>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-4 gap-6 h-auto lg:h-[calc(100vh-200px)] min-h-[600px]">

                {/* Left Sidebar - Tools */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Controls Card */}
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 shadow-xl flex-1 flex flex-col gap-6">

                        {/* File & Save/Load Section */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-medium text-sm group"
                                >
                                    <Upload size={16} />
                                    <span>Import</span>
                                </button>
                                <button
                                    onClick={openLoadModal}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium text-sm border border-white/10"
                                >
                                    <FolderOpen size={16} />
                                    <span>Load</span>
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="video/*"
                                onChange={handleFileChange}
                            />

                            {/* Save UI */}
                            {videoSrc && (
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Analysis Title"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg transition-all font-medium text-sm"
                                    >
                                        <Save size={16} />
                                        <span>{isSaving ? 'Saving...' : 'Save Analysis'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Drawing Tools */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Annotation Tools</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {tools.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setCurrentTool(t.id)}
                                        className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all ${currentTool === t.id
                                            ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                            : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400 hover:text-white'
                                            }`}
                                        title={t.label}
                                    >
                                        <t.icon size={20} />
                                        <span className="text-[10px] hidden xl:block">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Color Palette</h3>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCurrentColor(c)}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${currentColor === c ? 'border-white ring-2 ring-purple-500/50' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-2">
                            <button
                                onClick={undoLast}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors text-sm"
                            >
                                <RotateCcw size={16} />
                                <span>Undo Last</span>
                            </button>
                            <button
                                onClick={handleDeleteSelected}
                                disabled={!selectedId}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors text-sm border
                                ${selectedId
                                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 cursor-pointer'
                                        : 'bg-white/5 text-gray-500 border-transparent cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <X size={16} />
                                <span>Delete Selected</span>
                            </button>
                            <button
                                onClick={clearAnnotations}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-900/10 hover:bg-red-900/20 text-red-500/70 border border-transparent rounded-lg transition-colors text-xs"
                            >
                                <Eraser size={14} />
                                <span>Clear Canvas</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* Text Edit Modal */}
                {isTextEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-[#1e1e1e] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
                            <h3 className="text-xl font-bold text-white mb-4">Edit Text</h3>
                            <input
                                autoFocus
                                type="text"
                                value={editTextValue}
                                onChange={(e) => setEditTextValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const newAnns = annotations.map(a =>
                                            a.id === editTextId ? { ...a, text: editTextValue } : a
                                        );
                                        setAnnotations(newAnns);
                                        setIsTextEditing(false);
                                    }
                                }}
                                className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none mb-6"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsTextEditing(false)}
                                    className="px-5 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const newAnns = annotations.map(a =>
                                            a.id === editTextId ? { ...a, text: editTextValue } : a
                                        );
                                        setAnnotations(newAnns);
                                        setIsTextEditing(false);
                                    }}
                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Area - Canvas & Video */}
                <div
                    ref={containerRef}
                    className="lg:col-span-3 bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative flex flex-col"
                >
                    {videoSrc ? (
                        <>
                            {/* Video & Canvas Container */}
                            <div ref={videoContainerRef} className="relative w-full h-full flex-grow bg-black flex items-center justify-center overflow-hidden">
                                <video
                                    ref={videoRef}
                                    src={videoSrc}
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={() => setIsPlaying(false)}
                                // Make sure video doesn't capture clicks, passed to canvas
                                />
                                <Stage
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    onMouseDown={handleMouseDown}
                                    onClick={handleStageClick}
                                    className="absolute inset-0 z-10"
                                    style={{ cursor: currentTool === 'cursor' ? 'default' : 'crosshair' }}
                                >
                                    <Layer>
                                        {annotations.map((ann, i) => (
                                            <Shape
                                                key={ann.id}
                                                shape={ann}
                                                isSelected={ann.id === selectedId}
                                                onSelect={() => {
                                                    if (currentTool === 'cursor') {
                                                        setSelectedId(ann.id);
                                                    }
                                                }}
                                                onChange={(newAttrs) => {
                                                    const newAnns = annotations.slice();
                                                    newAnns[i] = newAttrs;
                                                    setAnnotations(newAnns);
                                                }}
                                            />
                                        ))}
                                    </Layer>
                                </Stage>
                            </div>

                            {/* Playback Controls Bar */}
                            <div className="h-16 bg-[#121212] border-t border-white/5 flex items-center px-4 gap-4 z-20">
                                <button
                                    onClick={togglePlay}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors flex-shrink-0"
                                >
                                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                                </button>

                                <div className="flex-1 flex flex-col gap-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 font-mono">
                                        <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
                                        <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSpeedChange}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 min-w-[60px]"
                                >
                                    {playbackSpeed}x
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <Upload size={32} className="opacity-50" />
                            </div>
                            <p className="text-lg font-medium">No video loaded</p>
                            <p className="text-sm max-w-xs text-center opacity-60">Import a video file from the sidebar to begin analysis</p>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors"
                                >
                                    Select File
                                </button>
                                <button
                                    onClick={openLoadModal}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
                                >
                                    Load Saved
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Load Modal */}
            {
                showLoadModal && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#121212]">
                                <h3 className="text-lg font-bold text-white">Saved Analyses</h3>
                                <button onClick={() => setShowLoadModal(false)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 space-y-3">
                                {isLoadingList ? (
                                    <p className="text-center text-gray-500 py-8">Loading...</p>
                                ) : savedAnalyses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No saved analyses found.</p>
                                    </div>
                                ) : (
                                    savedAnalyses.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => loadAnalysis(item)}>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-white truncate">{item.title}</h4>
                                                <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={(e) => deleteAnalysis(e, item._id)}
                                                className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default VideoAnalysis;
