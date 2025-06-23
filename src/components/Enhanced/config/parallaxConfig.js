// src/components/Enhanced/config/parallaxConfig.js - ANPASSBARE BEWEGUNGEN

// ===== SNAP-POINT MAPPING (0-5) =====
export const SNAP_POINT_MAPPING = {
    0: { progress: 0.00, label: 'Logo + Newsletter' },      // 0%
    1: { progress: 0.15, label: 'Von Uns Heißt Für Uns' }, // 15%
    2: { progress: 0.35, label: 'Der Weg Ist Das Ziel' },  // 35%
    3: { progress: 0.55, label: 'Die Community Heißt' },   // 55%
    4: { progress: 0.75, label: 'AniTune Carousel' },      // 75%
    5: { progress: 0.95, label: 'Newsletter CTA' }         // 95%
};

// ===== LAYER MOVEMENT KONFIGURATION =====
// Hier kannst du alle Bewegungen anpassen!

export const LAYER_CONFIG = {
    // ===== BACKGROUND LAYER =====
    background: {
        active: true,
        movement: {
            startScale: 4.0,
            endScale: 1.0,
            scrollStart: 0.0,
            scrollEnd: 1.0
        },
        zIndex: 1
    },

    // ===== STARFIELD LAYER =====
    starfield: {
        active: true,
        movement: {
            scrollStart: 0.0,
            scrollEnd: 1.0,
            opacity: 0.8,
            speed: 0.5
        },
        zIndex: 2
    },

    // ===== BERGE LAYER =====
    berge: {
        active: true,
        movement: {
            scrollStart: 0.75,  // Snap 4 (75%)
            scrollEnd: 1.0,     // Ende (100%)
            posStart: -55,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 3
    },

    // ===== TAL LAYER =====
    tal: {
        active: true,
        movement: {
            scrollStart: 0.55,  // Snap 3 (55%)
            scrollEnd: 1.0,
            posStart: -60,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 4
    },

    // ===== WALD HINTEN LAYER =====
    waldHinten: {
        active: true,
        movement: {
            scrollStart: 0.55,  // Snap 3 (55%)
            scrollEnd: 1.0,
            posStart: -35,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 5
    },

    // ===== FOREST LAYER =====
    forest: {
        active: true,
        movement: {
            scrollStart: 0.35,  // Snap 2 (35%)
            scrollEnd: 1.0,
            posStart: -55,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 6
    },

    // ===== ROAD LAYER =====
    road: {
        active: true,
        movement: {
            scrollStart: 0.15,  // Snap 1 (15%)
            scrollEnd: 1.0,
            posStart: -45,
            posEnd: 0,
            opacityStart: 0.0,
            opacityEnd: 0.3
        },
        zIndex: 7
    },

    // ===== DOG LAYER =====
    dog: {
        active: true,
        movement: {
            scrollStart: 0.15,  // Snap 1 (15%)
            scrollEnd: 1.0,
            posStart: -33,
            posEnd: 12,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        position: {
            left: '50.8%'
        },
        size: {
            width: '5vw',
            maxWidth: '250px',
            height: 'auto'
        },
        zIndex: 8
    },

    // ===== MENGE LAYER =====
    menge: {
        active: true,
        movement: {
            scrollStart: 0.0,
            scrollEnd: 1.0,
            posStart: -170,
            posEnd: -20,
            opacityStart: 0.0,
            opacityEnd: 0.8
        },
        position: {
            left: '55%'
        },
        size: {
            width: '90vw',
            maxWidth: '850px',
            height: 'auto'
        },
        zIndex: 9
    },

    // ===== LOGO LAYER =====
    logo: {
        active: true,
        movement: {
            scrollStart: 0.0,
            scrollEnd: 0.15,    // Bis Snap 1
            scaleStart: 1.0,
            scaleEnd: 0.8,
            opacityStart: 1.0,
            opacityEnd: 0.0
        },
        zIndex: 20
    },

    // ===== CLOUD LAYERS =====
    leftCloud: {
        active: true,
        movement: {
            scrollStart: 0.75,  // Snap 4 (75%)
            scrollEnd: 1.0,     // Ende (100%)
            posStart: -60,
            posEnd: 5,
            opacityStart: 0.9,
            opacityEnd: 1.0,
            scaleStart: 1.7,
            scaleEnd: 1.7
        },
        position: {
            bottom: '43%'
        },
        zIndex: 15
    },

    rightCloud: {
        active: true,
        movement: {
            scrollStart: 0.75,  // Snap 4 (75%)
            scrollEnd: 1.0,
            posStart: -40,
            posEnd: 5,
            opacityStart: 0.9,
            opacityEnd: 1.0,
            scaleStart: 1.5,
            scaleEnd: 1.5
        },
        position: {
            bottom: '44%'
        },
        zIndex: 15
    },

    // ===== WOLKEN HINTEN LAYERS =====
    leftCloudHinten: {
        active: true,
        movement: {
            scrollStart: 0.75,  // Snap 4 (75%)
            scrollEnd: 1.0,
            posStart: -140,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0,
            scaleStart: 1.20,
            scaleEnd: 1.20
        },
        position: {
            bottom: '65%'
        },
        zIndex: 12
    },

    rightCloudHinten: {
        active: true,
        movement: {
            scrollStart: 0.75,  // Snap 4 (75%)
            scrollEnd: 1.0,
            posStart: -140,
            posEnd: 10,
            opacityStart: 1.0,
            opacityEnd: 1.0,
            scaleStart: 1.40,
            scaleEnd: 1.40
        },
        position: {
            bottom: '65%'
        },
        zIndex: 12
    }
};

// ===== RESPONSIVE KONFIGURATION =====
export const RESPONSIVE_CONFIG = {
    desktop: {
        // Desktop-spezifische Anpassungen
        multiplier: 1.0,
        titleFontSize: '2.5rem'
    },
    mobile: {
        // Mobile-spezifische Anpassungen
        multiplier: 0.7,
        titleFontSize: '1.8rem'
    }
};

// ===== ANIMATION SPRINGS =====
export const ANIMATION_SPRINGS = {
    smooth: {
        mass: 0.8,
        tension: 120,
        friction: 26,
        clamp: true,
        precision: 0.01,
        velocity: 0
    },
    snappy: {
        mass: 0.4,
        tension: 250,
        friction: 18,
        clamp: true,
        precision: 0.01,
        velocity: 0
    },
    gentle: {
        mass: 1.2,
        tension: 100,
        friction: 30,
        clamp: true,
        precision: 0.01,
        velocity: 0
    }
};

// ===== LAYER AKTIVIERUNG PRO SNAP-POINT =====
export const SNAP_POINT_LAYERS = {
    0: ['background', 'starfield', 'logo'],                           // Logo + Newsletter
    1: ['background', 'starfield', 'road', 'dog'],                   // Von Uns Heißt Für Uns
    2: ['background', 'starfield', 'road', 'dog', 'forest'],        // Der Weg Ist Das Ziel  
    3: ['background', 'starfield', 'road', 'dog', 'forest', 'tal', 'waldHinten'], // Die Community Heißt
    4: ['background', 'starfield', 'road', 'dog', 'forest', 'tal', 'waldHinten', 'berge', 'leftCloud', 'rightCloud', 'leftCloudHinten', 'rightCloudHinten'], // AniTune Carousel
    5: ['background', 'starfield', 'menge']                          // Newsletter CTA
};

// ===== HELPER FUNCTIONS =====

/**
 * Berechnet Position basierend auf scrollProgress und Layer-Config
 */
export function calculateLayerPosition(scrollProgress, layerConfig) {
    const { movement } = layerConfig;

    if (scrollProgress < movement.scrollStart) {
        return {
            position: movement.posStart || 0,
            opacity: movement.opacityStart || 1,
            scale: movement.scaleStart || 1
        };
    }

    if (scrollProgress > movement.scrollEnd) {
        return {
            position: movement.posEnd || 0,
            opacity: movement.opacityEnd || 1,
            scale: movement.scaleEnd || 1
        };
    }

    // Interpolation zwischen Start und End
    const progress = (scrollProgress - movement.scrollStart) / (movement.scrollEnd - movement.scrollStart);

    return {
        position: interpolate(movement.posStart || 0, movement.posEnd || 0, progress),
        opacity: interpolate(movement.opacityStart || 1, movement.opacityEnd || 1, progress),
        scale: interpolate(movement.scaleStart || 1, movement.scaleEnd || 1, progress)
    };
}

/**
 * Interpoliert zwischen zwei Werten
 */
function interpolate(start, end, progress) {
    return start + (end - start) * Math.min(1, Math.max(0, progress));
}

/**
 * Gibt aktive Layer für einen Snap-Point zurück
 */
export function getActiveLayersForSnapPoint(snapPoint) {
    return SNAP_POINT_LAYERS[snapPoint] || [];
}

/**
 * Prüft ob Layer bei aktuellem Snap-Point aktiv sein soll
 */
export function isLayerActiveAtSnapPoint(layerName, snapPoint) {
    const activeLayers = getActiveLayersForSnapPoint(snapPoint);
    return activeLayers.includes(layerName);
}