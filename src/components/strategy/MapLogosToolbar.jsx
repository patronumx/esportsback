import React, { useState, useEffect, useRef } from 'react';
import { Folder, ChevronLeft, ChevronRight, Upload, Plus, Trash2 } from 'lucide-react';

// Eagerly load URL strings only. 
// This avoids the overhead of loading full modules but resolves paths at build time.
// We keep the rendering logic optimized (only render active folder) to solve performance.
import { getAllLogos } from '../../utils/logoAssets';

// Load Collections from centralized utility
const logoCollections = getAllLogos();

// Helper to process glob results into a nested structure (Recursive)
const processLogos = (globResult, rootPathSegment) => {
    const rootItems = [];

    const getOrCreateFolder = (items, name) => {
        let folder = items.find(i => i.type === 'folder' && i.name === name);
        if (!folder) {
            folder = { type: 'folder', name, items: [] };
            items.push(folder);
        }
        return folder;
    };

    Object.keys(globResult).forEach(path => {
        // path example: ../assets/teamlogo/PMGC 2025/Week 1/Group Red/Logo.png (from utils)
        // Note: verify path structure from utils vs local
        // In utils: import.meta.glob('../assets/...')
        // So keys start with ../assets

        const normalizedPath = path.replace(/\\/g, '/');
        // Split by the specific root segment tag to find relative path
        const splitTag = `/teamlogo/${rootPathSegment}/`;
        const parts = normalizedPath.split(splitTag);

        if (parts.length < 2) return;

        const relativePath = parts[1]; // e.g. "Week 1/Group Red/Logo.png"
        const segments = relativePath.split('/');

        const filename = segments.pop(); // Last segment is file
        const folderPath = segments; // Remaining segments are folders

        // Traverse / Build Tree
        let currentLevel = rootItems;
        folderPath.forEach(folderName => {
            const folder = getOrCreateFolder(currentLevel, folderName);
            currentLevel = folder.items;
        });

        // Add File
        currentLevel.push({
            type: 'file',
            name: filename.replace('.png', ''),
            src: globResult[path],
            originalPath: path // Store the stable original path (e.g. ../assets/teamlogo/...)
        });
    });

    // Helper to sort items (folders first, then files; numeric sort)
    const sortItems = (items) => {
        items.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
            }
            return a.name.localeCompare(b.name, undefined, { numeric: true });
        });
        items.forEach(item => {
            if (item.type === 'folder') {
                sortItems(item.items);
            }
        });
    };

    sortItems(rootItems);
    return rootItems;
};


const LOGO_CATEGORIES = {
    "PMGC 2025": processLogos(logoCollections['PMGC 2025'], "PMGC 2025"),
    "PMWC 2025": processLogos(logoCollections['PMWC 2025'], "PMWC 2025"),
    "PMGO 2025": processLogos(logoCollections['PMGO 2025'], "PMGO 2025"),
    "PMGC 2024": processLogos(logoCollections['PMGC 2024'], "PMGC 2024"),
    "PMWC 2024": processLogos(logoCollections['PMWC 2024'], "PMWC 2024"),
    "PMSL AMERICA": processLogos(logoCollections['PMSL AMERICA'], "PMSL AMERICA"),
    "PMSL CSA": processLogos(logoCollections['PMSL CSA'], "PMSL CSA"),
    "PMSL EMEA": processLogos(logoCollections['PMSL EMEA'], "PMSL EMEA"),
    "PMSL EU": processLogos(logoCollections['PMSL EU'], "PMSL EU"),
    "PMSL MENA": processLogos(logoCollections['PMSL MENA'], "PMSL MENA"),
    "PMSL SEA": processLogos(logoCollections['PMSL SEA'], "PMSL SEA")
};

// Simple Component to render logo
const LogoItem = ({ item, onSelect, activeLogo }) => {
    return (
        <div
            draggable="true"
            onDragStart={(e) => {
                e.dataTransfer.setData('logoSrc', item.src);
                // ALSO set original stable path if available
                if (item.originalPath) {
                    e.dataTransfer.setData('originalPath', item.originalPath);
                }
                e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => onSelect && onSelect(item.src)}
            className={`w-full aspect-square rounded-xl p-2 transition-all flex items-center justify-center border cursor-grab active:cursor-grabbing group relative overflow-hidden ${activeLogo === item.src
                ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105'
                : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20 active:scale-95'
                }`}
            title={item.name}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-500" />
            <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-contain drop-shadow-md pointer-events-none group-hover:scale-110 transition-transform duration-300"
            />
        </div>
    );
};

const MapLogosToolbar = ({ onSelectLogo, activeLogo, className = '' }) => {
    // State
    const [currentCategory, setCurrentCategory] = useState(null);
    const [folderStack, setFolderStack] = useState([]); // Stack of folder objects for deep navigation
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [customLogos, setCustomLogos] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target.result;
            const newLogo = {
                type: 'file',
                name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                src: result,
                isCustom: true
            };
            setCustomLogos(prev => [newLogo, ...prev]);
            // Auto Select
            if (onSelectLogo) onSelectLogo(result);
        };
        reader.readAsDataURL(file);
    };

    if (isCollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="bg-zinc-900/95 backdrop-blur-md border border-white/10 p-4 rounded-xl text-white hover:bg-zinc-800 transition-all shadow-xl group border-l-4 border-l-purple-500 animate-in slide-in-from-right duration-300 pointer-events-auto"
                title="Show Teams"
            >
                <ChevronLeft className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </button>
        );
    }

    // Navigation Handlers
    const handleCategoryClick = (cat) => {
        setCurrentCategory(cat);
        setFolderStack([]); // Start at root of category
    };

    const handleFolderClick = (folder) => {
        setFolderStack(prev => [...prev, folder]);
    };

    const handleBack = () => {
        if (folderStack.length > 0) {
            setFolderStack(prev => prev.slice(0, -1)); // Pop stack
        } else {
            setCurrentCategory(null); // Go back to Main Categories
        }
    };

    // Render Logic
    const renderMainList = () => (
        <div className="flex flex-col gap-2 p-2 h-full overflow-y-auto custom-scrollbar">
            {/* Upload Section */}
            <div className="mb-2 space-y-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 rounded-lg border border-dashed border-white/20 bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-white transition-all group"
                >
                    <Upload size={16} className="group-hover:scale-110 transition-transform text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Custom</span>
                </button>

                {/* Custom Logos Grid */}
                {customLogos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {customLogos.map((item, idx) => (
                            <div key={`custom-${idx}`} className="relative group/custom">
                                <LogoItem
                                    item={item}
                                    onSelect={onSelectLogo}
                                    activeLogo={activeLogo}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCustomLogos(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover/custom:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-white/10 my-1" />

            {Object.keys(LOGO_CATEGORIES).map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border border-white/5 hover:border-white/20 transition-all text-gray-400 group hover:text-white shadow-sm hover:shadow-lg hover:shadow-purple-500/10"
                >
                    <Folder className="w-6 h-6 mb-1 text-purple-500/80 group-hover:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-[10px] font-bold text-center leading-tight tracking-wide">{cat}</span>
                </button>
            ))}
        </div>
    );

    const renderContent = () => {
        // Determine items to show based on stack
        let items = [];
        if (folderStack.length > 0) {
            items = folderStack[folderStack.length - 1].items;
        } else {
            items = LOGO_CATEGORIES[currentCategory] || [];
        }

        return (
            <div className="flex flex-col h-full bg-zinc-900/30">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1 p-3 text-[10px] font-bold text-gray-400 hover:text-white border-b border-white/5 bg-zinc-900/80 sticky top-0 backdrop-blur z-10 uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                    <ChevronLeft className="w-3 h-3 text-purple-500" /> BACK
                </button>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        {items.length === 0 && <div className="text-gray-500 text-[10px] text-center p-4">Empty Folder</div>}
                        {items.map((item, idx) => {
                            if (item.type === 'folder') {
                                return (
                                    <button
                                        key={`folder-${idx}`}
                                        onClick={() => handleFolderClick(item)}
                                        className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/5 hover:border-white/20 transition-all group shadow-sm"
                                    >
                                        <Folder className="w-6 h-6 mb-1 text-purple-500/80 group-hover:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                                        <span className="text-[9px] font-bold text-gray-300 group-hover:text-white text-center leading-tight whitespace-normal w-full">{item.name}</span>
                                    </button>
                                );
                            } else {
                                // It's a file (Logo)
                                return (
                                    <LogoItem
                                        key={`file-${idx}`}
                                        item={item}
                                        onSelect={onSelectLogo}
                                        activeLogo={activeLogo}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Header Title Logic
    let headerTitle = "Teams";
    if (currentCategory) headerTitle = currentCategory;
    if (folderStack.length > 0) headerTitle = folderStack[folderStack.length - 1].name;

    return (
        <div className={`w-full bg-[#1E1E1E]/95 backdrop-blur-md border border-white/10 rounded-xl flex flex-col shadow-2xl h-full min-h-0 overflow-hidden animate-in slide-in-from-right duration-300 ring-1 ring-white/5 relative ${className}`}>
            <div
                onClick={() => setIsCollapsed(true)}
                className="p-3 border-b border-white/5 text-center shrink-0 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors group"
                title="Hide / Collapse"
            >
                <div className="flex items-center justify-center gap-1">
                    <ChevronLeft className="w-3 h-3 text-gray-500 group-hover:text-white" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-tight block truncate whitespace-pre-wrap">
                        {headerTitle}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {currentCategory ? renderContent() : renderMainList()}
            </div>
        </div>
    );
};

export default MapLogosToolbar;
