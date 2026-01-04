// Standard Map dimensions (Scaled to User Data Standard)
export const MAP_DIMENSIONS = 2048;

// Exact Inner Usable Radii (pixels) as specified by user
export const ZONE_RADII_PIXELS = {
    P1: 990.5,
    P2: 529.5,
    P3: 323,
    P4: 193,
    P5: 121,
    P6: 70,
    P7: 45.5,
    P8: 30.5,
    P9_REF: 5 // Small dot for P9
};

// We keep ZONE_RADII for compatibility if needed, or simply alias it
export const ZONE_RADII = ZONE_RADII_PIXELS;

export const FLIGHT_PATH_COLOR = '#ffffff';
export const ZONE_COLOR = '#ffffff';
export const IMAGE_SIZE = 2160; // Kept but unused for math circles
