
// Centralized Logo Asset Management

// Eagerly load all logo URLs
// Path is relative to THIS file (src/utils/logoAssets.js)
// So ../assets matches src/assets
const globOptions = { eager: true, import: 'default' };

const logoCollections = {
    'PMGC 2025': import.meta.glob('../assets/teamlogo/PMGC 2025/**/*.png', { eager: true, import: 'default' }),
    'PMWC 2025': import.meta.glob('../assets/teamlogo/PMWC 2025/**/*.png', { eager: true, import: 'default' }),
    'PMGO 2025': import.meta.glob('../assets/teamlogo/PMGO 2025/**/*.png', { eager: true, import: 'default' }),
    'PMGC 2024': import.meta.glob('../assets/teamlogo/PMGC 2024/**/*.png', { eager: true, import: 'default' }),
    'PMWC 2024': import.meta.glob('../assets/teamlogo/PMWC 2024/**/*.png', { eager: true, import: 'default' }),
    'PMSL AMERICA': import.meta.glob('../assets/teamlogo/PMSL AMERICA/**/*.png', { eager: true, import: 'default' }),
    'PMSL CSA': import.meta.glob('../assets/teamlogo/PMSL CSA/**/*.png', { eager: true, import: 'default' }),
    'PMSL EMEA': import.meta.glob('../assets/teamlogo/PMSL EMEA/**/*.png', { eager: true, import: 'default' }),
    'PMSL EU': import.meta.glob('../assets/teamlogo/PMSL EU/**/*.png', { eager: true, import: 'default' }),
    'PMSL MENA': import.meta.glob('../assets/teamlogo/PMSL MENA/**/*.png', { eager: true, import: 'default' }),
    'PMSL SEA': import.meta.glob('../assets/teamlogo/PMSL SEA/**/*.png', { eager: true, import: 'default' })
};

// Flatten all logos into a single map of NormalizedPath -> URL
const normalizedMap = {};

Object.values(logoCollections).forEach(collection => {
    Object.entries(collection).forEach(([path, url]) => {
        // Normalize Path: Remove leading ../ and standardize separators
        // key example: "../assets/teamlogo/PMGC 2025/Logo.png"
        // normalized: "assets/teamlogo/pmgc 2025/logo.png" (lowercase for fuzzy match)
        const normalized = path.replace(/^\.\.\//, '').toLowerCase();
        normalizedMap[normalized] = url;
    });
});

/**
 * Resolves a potentially broken or relative logo path to the correct runtime URL.
 * @param {string} savedSrc - The src string saved in the database (e.g. "/src/assets/..." or old relative path)
 * @returns {string} - The correct URL to display, or the original if no match found.
 */
export const resolveLogoUrl = (savedSrc) => {
    if (!savedSrc) return '';

    // If it's a data URL or external URL, return as is
    if (savedSrc.startsWith('data:') || savedSrc.startsWith('http')) return savedSrc;

    let processedPath = savedSrc;

    // 1. Decode URI components (handle %20 vs space)
    try {
        processedPath = decodeURIComponent(processedPath);
    } catch (e) {
        // Ignore error
    }

    // 2. Normalize: Extract 'assets/teamlogo/...' part
    // This handles various prefixes like /src/, ../, or absolute paths
    const assetsIndex = processedPath.toLowerCase().indexOf('assets/teamlogo');

    let normalizedTarget = '';

    if (assetsIndex !== -1) {
        // "assets/teamlogo/PMGC 2025/..."
        normalizedTarget = processedPath.substring(assetsIndex).toLowerCase();
    } else {
        // Fallback cleanup if 'assets/teamlogo' not found explicitly
        normalizedTarget = processedPath
            .replace(/^\/?src\//, '')
            .replace(/^\.\.\//, '')
            .replace(/^\//, '')
            .toLowerCase();
    }

    // 3. Exact Match Attempt
    if (normalizedMap[normalizedTarget]) {
        return normalizedMap[normalizedTarget];
    }

    // 4. Filename Backup Match (Risky but helpful if folders moved)
    // Extract filename: "Logo.png" from "path/to/Logo.png"
    const parts = normalizedTarget.split('/');
    const filename = parts.length > 0 ? parts[parts.length - 1] : null;

    if (filename) {
        // Search values in normalizedMap for a key that ends with this filename
        const possibleKey = Object.keys(normalizedMap).find(key => key.endsWith(`/${filename}`));
        if (possibleKey) {
            return normalizedMap[possibleKey];
        }
    }

    return savedSrc; // Fallback to original if aggressive recovery fails
};

export const getAllLogos = () => logoCollections;
