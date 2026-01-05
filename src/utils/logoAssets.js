
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

        // Also map the URL itself to itself (in case storage is already correct)
        // normalizedMap[url.toLowerCase()] = url; 
        // Warning: URLs in prod are hashed (/assets/Logo-123.png), so this might not match "src" style storage.
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

    // Normalize the saved path
    // Remove /src/, ../, and lowercase
    let normalized = savedSrc
        .replace(/^\/?src\//, '') // Remove leading /src/ or src/
        .replace(/^\.\.\//, '')   // Remove leading ../
        .replace(/^\//, '')       // Remove leading /
        .toLowerCase();

    // Attempt match
    // Check if the normalized path is in our map (which contains "assets/teamlogo/...")
    // If saving stored "assets/teamlogo/..." we are good.

    // We try to match the tail if exact match fails
    // e.g. saved: "some/weird/path/assets/teamlogo/file.png" -> we want "assets/teamlogo/file.png"

    if (normalizedMap[normalized]) {
        return normalizedMap[normalized];
    }

    // Try to find by filename if path fails (Risky if duplicate filenames, but better than broken image)
    // Actually, `assets/teamlogo` structure is pretty unique.

    // Fuzzy search: verify if 'assets/teamlogo' exists in string
    if (normalized.includes('assets/teamlogo')) {
        const parts = normalized.split('assets/teamlogo');
        const tail = 'assets/teamlogo' + parts[1]; // Reconstruct "assets/teamlogo/..."
        if (normalizedMap[tail]) return normalizedMap[tail];
    }

    return savedSrc; // Fallback
};

export const getAllLogos = () => logoCollections;
