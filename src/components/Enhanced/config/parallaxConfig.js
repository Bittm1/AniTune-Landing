// src/components/Enhanced/config/parallaxConfig.js 
// 🎯 ANGEPASST FÜR 7 SNAP-POINTS: 0%-15%-30%-45%-60%-80%-95%

// ===== NEUE 7-SNAP-POINT MAPPING =====
export const SNAP_POINT_MAPPING = {
    0: { progress: 0.00, label: 'Logo + Newsletter' },        // 0%
    1: { progress: 0.15, label: 'Von Uns Heißt Für Uns' },   // 15%
    2: { progress: 0.30, label: 'Der Weg Ist Das Ziel' },    // 30% (NEU: war 35%)
    3: { progress: 0.45, label: 'Die Community Heißt' },     // 45% (NEU: war 55%)
    4: { progress: 0.60, label: 'Parallax Vollansicht' },    // 60% (NEU: war 75%)
    5: { progress: 0.80, label: 'Carousel Phase' },          // 80% (NEU: Leer)
    6: { progress: 0.95, label: 'Newsletter CTA' }           // 95% (VERSCHOBEN: war Index 5)
};

// ===== LAYER MOVEMENT KONFIGURATION (ANGEPASST) =====
// Alle Scroll-Bereiche wurden entsprechend der neuen Snap-Points angepasst!

export const LAYER_CONFIG = {
    // ===== BACKGROUND LAYER (unverändert) =====
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

    // ===== STARFIELD LAYER (unverändert) =====
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

    // ===== BERGE LAYER (ANGEPASST: 60% statt 75%) =====
    berge: {
        active: true,
        movement: {
            scrollStart: 0.00,  // NEU: Snap 4 (60% statt 75%)
            scrollEnd: 0.6,     // Ende (100%)
            posStart: -100,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 3
    },

    // ===== TAL LAYER (ANGEPASST: 45% statt 55%) =====
    tal: {
        active: true,
        movement: {
            scrollStart: 0.15,  // NEU: Snap 3 (45% statt 55%)
            scrollEnd: 0.6,
            posStart: -60,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 4
    },

    // ===== WALD HINTEN LAYER (ANGEPASST: 45% statt 55%) =====
    waldHinten: {
        active: true,
        movement: {
            scrollStart: 0.15,  // NEU: Snap 3 (45% statt 55%)
            scrollEnd: 0.6,
            posStart: -95,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 5
    },

    // ===== FOREST LAYER (ANGEPASST: 30% statt 35%) =====
    forest: {
        active: true,
        movement: {
            scrollStart: 0.15,  // NEU: Snap 2 (30% statt 35%)
            scrollEnd: 0.6,
            posStart: -55,
            posEnd: 0,
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        zIndex: 6
    },

    // ===== ROAD LAYER (unverändert bei 15%) =====
    road: {
        active: true,
        movement: {
            scrollStart: 0.15,  // Snap 1 (15% - bleibt gleich)
            scrollEnd: 0.6,
            posStart: -40,
            posEnd: 0,
            opacityStart: 1,
            opacityEnd: 1
        },
        zIndex: 7
    },

    // ===== DOG LAYER (unverändert bei 15%) =====
    dog: {
        active: true,
        movement: {
            scrollStart: 0.15,  // Snap 1 (15% - bleibt gleich)
            scrollEnd: 0.6,
            posStart: -40,
            posEnd: 0,
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

    // ===== MENGE LAYER (für Newsletter Phase) =====
    menge: {
        active: true,
        movement: {
            scrollStart: 0.30,
            scrollEnd: 0.6,
            posStart: -170,
            posEnd: -20,
            opacityStart: 1.0,
            opacityEnd: 1.0,
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

    // ===== LOGO LAYER (unverändert) =====
    logo: {
        active: true,
        movement: {
            scrollStart: 0.0,
            scrollEnd: 0.15,    // Bis Snap 1 (bleibt gleich)
            scaleStart: 1.0,
            scaleEnd: 0.8,
            opacityStart: 1.0,
            opacityEnd: 0.0
        },
        zIndex: 20
    },

    // ===== 📧 NEWSLETTER LAYER (BLEIBT bei 95%, aber Index 6) =====
    newsletter: {
        active: true,
        movement: {
            scrollStart: 0.95,   // Snap 6 (95% - bleibt gleich!)
            scrollEnd: 1.0,      // Ende (100%)
            posStart: 100,       // Startet unten off-screen
            posEnd: -40,         // "Hoch in der Sonne"
            opacityStart: 0.0,   // Fade in
            opacityEnd: 1.0      // Voll sichtbar
        },
        zIndex: 60  // Hoch über allem
    },

    // ===== CLOUD LAYERS (ANGEPASST: 60% statt 75%) =====
    leftCloud: {
        active: true,
        movement: {
            scrollStart: 0.45,  // NEU: Snap 4 (60% statt 75%)
            scrollEnd: 0.6,     // Ende (100%)
            posStart: -60,
            posEnd: 5,
            opacityStart: 1.0,
            opacityEnd: 1.0,
            scaleStart: 1.7,
            scaleEnd: 1.7
        },
        position: {
            bottom: '43%'
        },
        zIndex: 12
    },

    rightCloud: {
        active: true,
        movement: {
            scrollStart: 0.45,  // NEU: Snap 4 (60% statt 75%)
            scrollEnd: 0.6,
            posStart: -40,
            posEnd: 5,
            opacityStart: 1.0,
            opacityEnd: 1.0,
            scaleStart: 1.5,
            scaleEnd: 1.5
        },
        position: {
            bottom: '44%'
        },
        zIndex: 15
    },

    // ===== WOLKEN HINTEN LAYERS (ANGEPASST: 60% statt 75%) =====
    leftCloudHinten: {
        active: true,
        movement: {
            scrollStart: 0.45,  // NEU: Snap 4 (60% statt 75%)
            scrollEnd: 0.6,
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
        zIndex: 15
    },

    rightCloudHinten: {
        active: true,
        movement: {
            scrollStart: 0.45,  // NEU: Snap 4 (60% statt 75%)
            scrollEnd: 0.6,
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

// ===== RESPONSIVE KONFIGURATION (unverändert) =====
export const RESPONSIVE_CONFIG = {
    desktop: {
        multiplier: 1.0,
        titleFontSize: '2.5rem'
    },
    mobile: {
        multiplier: 0.7,
        titleFontSize: '1.8rem'
    }
};

// ===== ANIMATION SPRINGS (unverändert) =====
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

// ===== LAYER AKTIVIERUNG PRO SNAP-POINT (ERWEITERT AUF 7) =====
// ✅ FIXED: Menge kommt ab Snap-Point 2 (30%) statt erst bei Snap-Point 6 (95%)

export const SNAP_POINT_LAYERS = {
    0: ['background', 'starfield', 'logo'],                           // Logo + Newsletter
    1: ['background', 'starfield', 'road', 'dog'],                   // Von Uns Heißt Für Uns
    2: ['background', 'starfield', 'road', 'dog', 'forest', 'menge'], // ✅ MENGE HINZUGEFÜGT: Der Weg Ist Das Ziel + Menge
    3: ['background', 'starfield', 'road', 'dog', 'forest', 'tal', 'waldHinten', 'menge'], // ✅ MENGE BEIBEHALTEN: Die Community Heißt
    4: ['background', 'starfield', 'road', 'dog', 'forest', 'tal', 'waldHinten', 'berge', 'leftCloud', 'rightCloud', 'leftCloudHinten', 'rightCloudHinten', 'menge'], // ✅ MENGE BEIBEHALTEN: Parallax Vollansicht
    5: ['background', 'starfield', 'road', 'dog', 'forest', 'tal', 'waldHinten', 'berge', 'leftCloud', 'rightCloud', 'leftCloudHinten', 'rightCloudHinten', 'menge'], // ✅ MENGE BEIBEHALTEN: Carousel Phase
    6: ['background', 'starfield', 'road', 'dog', 'forest', 'tal', 'waldHinten', 'berge', 'leftCloud', 'rightCloud', 'leftCloudHinten', 'rightCloudHinten', 'menge', 'newsletter'] // ✅ MENGE + Newsletter CTA
};

// ===== HELPER FUNCTIONS (erweitert für 7 Snap-Points) =====

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
 * Gibt aktive Layer für einen Snap-Point zurück (jetzt 0-6)
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

/**
 * Validiert alle Layer-Konfigurationen für 7 Snap-Points
 */
export function validateAllConfigs() {
    const errors = [];

    // Prüfe SNAP_POINT_MAPPING
    for (let i = 0; i <= 6; i++) {
        if (!SNAP_POINT_MAPPING[i]) {
            errors.push(`Missing SNAP_POINT_MAPPING for index ${i}`);
        }
    }

    // Prüfe SNAP_POINT_LAYERS
    for (let i = 0; i <= 6; i++) {
        if (!SNAP_POINT_LAYERS[i]) {
            errors.push(`Missing SNAP_POINT_LAYERS for index ${i}`);
        }
    }

    if (errors.length > 0) {
        console.error('🚨 CONFIG VALIDATION ERRORS:', errors);
        return false;
    }

    return true;
}

/**
 * Device-spezifische Konfiguration ermitteln
 */
export function getDeviceConfig() {
    if (typeof window === 'undefined') return RESPONSIVE_CONFIG.desktop;

    const isMobile = window.innerWidth < 768 && 'ontouchstart' in window;
    return isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
}

// ===== DEBUG CONFIG (erweitert) =====
export const DEBUG_CONFIG = {
    enabled: process.env.NODE_ENV === 'development',
    logLayerUpdates: true,
    showLayerInfo: true,
    logSnapPointChanges: true,
    logScrollProgress: false
};

// ===== DEVELOPMENT DEBUG =====
if (DEBUG_CONFIG.enabled) {
    console.log('🎯 7-SNAP-POINT PARALLAX CONFIG GELADEN:');
    console.log('📊 Snap-Point Mapping:', SNAP_POINT_MAPPING);
    console.log('🌟 Layer Config Keys:', Object.keys(LAYER_CONFIG));
    console.log('✅ Config Valid:', validateAllConfigs());

    // Zeige Layer-Verteilung pro Snap-Point
    console.log('🎬 LAYER AKTIVIERUNG PRO SNAP-POINT:');
    for (let i = 0; i <= 6; i++) {
        console.log(`  Snap ${i} (${(SNAP_POINT_MAPPING[i]?.progress * 100).toFixed(0)}%): ${getActiveLayersForSnapPoint(i).length} Layer`);
    }
}