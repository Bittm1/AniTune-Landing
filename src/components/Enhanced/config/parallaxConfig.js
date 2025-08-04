// src/components/Enhanced/config/parallaxConfig.js 
// 🎯 ANGEPASST FÜR 7 SNAP-POINTS: 0%-15%-30%-45%-60%-80%-95%
// ✅ VOLLSTÄNDIG RESPONSIVE - ALLE LAYER MIT RESPONSIVE OPTIONEN

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

// ===== LAYER MOVEMENT KONFIGURATION (✅ ALLE LAYER MIT RESPONSIVE OPTIONEN) =====

export const LAYER_CONFIG = {
    // ===== BACKGROUND LAYER (✅ NEU: Responsive Scale) =====
    background: {
        active: true,
        movement: {
            startScale: 4.0,
            endScale: 1.0,
            scrollStart: 0.0,
            scrollEnd: 1.0
        },
        // ✅ NEU: Responsive Scale-Multiplier
        responsive: {
            mobile: {
                scaleMultiplier: 0.8,  // Etwas weniger Zoom auf Mobile
                offsetY: 20           // Leichte Y-Verschiebung
            },
            desktop: {
                scaleMultiplier: 1.0,  // Original Werte
                offsetY: 0
            },
            large: {
                scaleMultiplier: 1.1,  // Etwas mehr Zoom auf großen Screens
                offsetY: -10
            }
        },
        zIndex: 1
    },

    // ===== STARFIELD LAYER (✅ NEU: Responsive Opacity & Speed) =====
    starfield: {
        active: true,
        movement: {
            scrollStart: 0.0,
            scrollEnd: 1.0,
            opacity: 0.8,
            speed: 0.5
        },
        // ✅ NEU: Responsive Starfield-Parameter
        responsive: {
            mobile: {
                opacityMultiplier: 0.6,  // Weniger intensiv auf Mobile
                speedMultiplier: 0.7,    // Langsamere Animation
                density: 0.8             // Weniger Sterne
            },
            desktop: {
                opacityMultiplier: 1.0,  // Original Werte
                speedMultiplier: 1.0,
                density: 1.0
            },
            large: {
                opacityMultiplier: 1.2,  // Intensiver auf großen Screens
                speedMultiplier: 1.3,    // Schnellere Animation
                density: 1.4             // Mehr Sterne
            }
        },
        zIndex: 2
    },

    // ===== BERGE LAYER (✅ NEU: Responsive Positioning) =====
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
        // ✅ NEU: Responsive Positionierung
        responsive: {
            mobile: {
                positionMultiplier: 1.2,  // Stärkere Bewegung auf Mobile
                offsetX: -5,              // Leichte Links-Verschiebung
                offsetY: 15               // Etwas tiefer
            },
            desktop: {
                positionMultiplier: 1.0,  // Original Werte (-100 bis 0)
                offsetX: 0,
                offsetY: 0
            },
            large: {
                positionMultiplier: 0.8,  // Sanftere Bewegung auf großen Screens
                offsetX: 5,               // Leichte Rechts-Verschiebung
                offsetY: -10              // Etwas höher
            }
        },
        zIndex: 3
    },

    // ===== TAL LAYER (✅ NEU: Responsive Positioning) =====
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
        // ✅ NEU: Responsive Positionierung
        responsive: {
            mobile: {
                positionMultiplier: 1.3,  // Stärkere Bewegung
                offsetX: 0,
                offsetY: 20               // Tiefer positioniert
            },
            desktop: {
                positionMultiplier: 1.0,  // Original Werte (-60 bis 0)
                offsetX: 0,
                offsetY: 0
            },
            large: {
                positionMultiplier: 0.8,  // Sanftere Bewegung
                offsetX: 0,
                offsetY: -15              // Höher positioniert
            }
        },
        zIndex: 4
    },

    // ===== WALD HINTEN LAYER (✅ NEU: Responsive Positioning) =====
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
        // ✅ NEU: Responsive Positionierung
        responsive: {
            mobile: {
                positionMultiplier: 1.2,  // Stärkere Bewegung
                offsetX: -10,             // Links-Verschiebung
                offsetY: 25               // Tiefer
            },
            desktop: {
                positionMultiplier: 1.0,  // Original Werte (-95 bis 0)
                offsetX: 0,
                offsetY: 0
            },
            large: {
                positionMultiplier: 0.9,  // Etwas sanftere Bewegung
                offsetX: 8,               // Rechts-Verschiebung
                offsetY: -12              // Höher
            }
        },
        zIndex: 5
    },

    // ===== FOREST LAYER (✅ NEU: Responsive Positioning) =====
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
        // ✅ NEU: Responsive Positionierung
        responsive: {
            mobile: {
                positionMultiplier: 1.4,  // Deutlich stärkere Bewegung auf Mobile
                offsetX: -8,              // Links-Verschiebung
                offsetY: 18               // Tiefer
            },
            desktop: {
                positionMultiplier: 1.0,  // Original Werte (-55 bis 0)
                offsetX: 0,
                offsetY: 0
            },
            large: {
                positionMultiplier: 0.7,  // Sanftere Bewegung auf großen Screens
                offsetX: 12,              // Rechts-Verschiebung
                offsetY: -8               // Höher
            }
        },
        zIndex: 6
    },

    // ===== ROAD LAYER (✅ NEU: Responsive Positioning) =====
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
        // ✅ NEU: Responsive Positionierung
        responsive: {
            mobile: {
                positionMultiplier: 1.2,  // Stärkere Straßen-Bewegung
                offsetX: 0,               // Zentriert bleiben
                offsetY: 12,              // Etwas tiefer
                scaleMultiplier: 0.9      // Etwas kleiner auf Mobile
            },
            desktop: {
                positionMultiplier: 1.0,  // Original Werte (-40 bis 0)
                offsetX: 0,
                offsetY: 0,
                scaleMultiplier: 1.0
            },
            large: {
                positionMultiplier: 0.8,  // Sanftere Bewegung
                offsetX: 0,
                offsetY: -5,              // Etwas höher
                scaleMultiplier: 1.1      // Etwas größer auf großen Screens
            }
        },
        zIndex: 7
    },

    // ===== DOG LAYER (BESTEHENDES RESPONSIVE SYSTEM BEIBEHALTEN) =====
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                left: '48%'
            },
            desktop: {
                left: '50.8%'
            },
            large: {
                left: '52%'
            }
        },
        // ✅ BESTEHENDES SYSTEM: Responsive Größen
        size: {
            mobile: {
                width: '8vw',
                maxWidth: '120px'
            },
            desktop: {
                width: '5vw',
                maxWidth: '250px'
            },
            large: {
                width: '4vw',
                maxWidth: '300px'
            },
            height: 'auto'
        },
        zIndex: 8
    },

    // ===== MENGE LAYER (BESTEHENDES RESPONSIVE SYSTEM BEIBEHALTEN) =====
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                left: '50%'
            },
            desktop: {
                left: '55%'
            },
            large: {
                left: '58%'
            }
        },
        // ✅ BESTEHENDES SYSTEM: Responsive Größen
        size: {
            mobile: {
                width: '95vw',
                maxWidth: '400px'
            },
            desktop: {
                width: '90vw',
                maxWidth: '850px'
            },
            large: {
                width: '85vw',
                maxWidth: '1200px'
            },
            height: 'auto'
        },
        zIndex: 9
    },

    // ===== LOGO LAYER (BESTEHENDES RESPONSIVE SYSTEM BEIBEHALTEN) =====
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                top: '25%',
                left: '50%'
            },
            desktop: {
                top: '33%',
                left: '50%'
            },
            large: {
                top: '40%',
                left: '50%'
            }
        },
        zIndex: 20
    },

    // ===== 📧 NEWSLETTER LAYER (✅ NEU: Responsive Positioning) =====
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
        // ✅ NEU: Responsive Newsletter-Positionierung
        responsive: {
            mobile: {
                positionMultiplier: 1.2,  // Stärkere Bewegung auf Mobile
                offsetX: 0,
                offsetY: 20,              // Etwas tiefer starten
                scaleMultiplier: 0.8      // Kleinere Newsletter-Form
            },
            desktop: {
                positionMultiplier: 1.0,  // Original Werte (100 bis -40)
                offsetX: 0,
                offsetY: 0,
                scaleMultiplier: 1.0
            },
            large: {
                positionMultiplier: 0.8,  // Sanftere Bewegung
                offsetX: 0,
                offsetY: -20,             // Höher starten
                scaleMultiplier: 1.2      // Größere Newsletter-Form
            }
        },
        zIndex: 60  // Hoch über allem
    },

    // ===== CLOUD LAYERS (BESTEHENDES RESPONSIVE SYSTEM BEIBEHALTEN) =====
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                bottom: '50%'
            },
            desktop: {
                bottom: '43%'
            },
            large: {
                bottom: '40%'
            }
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                bottom: '52%'
            },
            desktop: {
                bottom: '44%'
            },
            large: {
                bottom: '41%'
            }
        },
        zIndex: 15
    },

    // ===== WOLKEN HINTEN LAYERS (BESTEHENDES RESPONSIVE SYSTEM BEIBEHALTEN) =====
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                bottom: '70%'
            },
            desktop: {
                bottom: '65%'
            },
            large: {
                bottom: '62%'
            }
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
        // ✅ BESTEHENDES SYSTEM: Responsive Positionierung
        positioning: {
            mobile: {
                bottom: '72%'
            },
            desktop: {
                bottom: '65%'
            },
            large: {
                bottom: '62%'
            }
        },
        zIndex: 12
    }
};

// ===== RESPONSIVE KONFIGURATION (✅ ERWEITERT AUF 3 DEVICE-TYPES) =====
export const RESPONSIVE_CONFIG = {
    mobile: {
        multiplier: 0.7,
        titleFontSize: '1.8rem'
    },
    desktop: {
        multiplier: 1.0,
        titleFontSize: '2.5rem'
    },
    // ✅ NEU: Large Screen Support
    large: {
        multiplier: 1.2,
        titleFontSize: '3rem'
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

// ===== HELPER FUNCTIONS (✅ ERWEITERT: Beide Responsive-Systeme unterstützt) =====

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
 * ✅ BESTEHENDES SYSTEM: Holt responsive Positionierung für einen Layer (positioning-Objekt)
 */
export function getResponsivePositioning(layerName, deviceType = null) {
    const layer = LAYER_CONFIG[layerName];
    if (!layer || !layer.positioning) {
        return {};
    }

    const device = deviceType || getDeviceType();
    return layer.positioning[device] || layer.positioning.desktop || {};
}

/**
 * ✅ BESTEHENDES SYSTEM: Holt responsive Größen für einen Layer (size-Objekt)
 */
export function getResponsiveSize(layerName, deviceType = null) {
    const layer = LAYER_CONFIG[layerName];
    if (!layer || !layer.size) {
        return {};
    }

    const device = deviceType || getDeviceType();

    // Kombiniere device-spezifische und allgemeine Größen
    const deviceSize = layer.size[device] || {};
    const generalSize = { height: layer.size.height }; // z.B. height: 'auto'

    return { ...generalSize, ...deviceSize };
}

/**
 * ✅ NEUES SYSTEM: Holt responsive Parameter für einen Layer (responsive-Objekt)
 */
export function getResponsiveParameters(layerName, deviceType = null) {
    const layer = LAYER_CONFIG[layerName];
    if (!layer || !layer.responsive) {
        return {};
    }

    const device = deviceType || getDeviceType();
    return layer.responsive[device] || layer.responsive.desktop || {};
}

/**
 * ✅ UNIVERSAL: Kombiniert beide Responsive-Systeme für einen Layer
 */
export function getLayerResponsiveConfig(layerName, deviceType = null) {
    return {
        positioning: getResponsivePositioning(layerName, deviceType),
        size: getResponsiveSize(layerName, deviceType),
        parameters: getResponsiveParameters(layerName, deviceType)
    };
}

/**
 * ✅ NEU: Device-Type ermitteln (3-stufig)
 */
export function getDeviceType() {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    const isTouchDevice = 'ontouchstart' in window;

    if (width <= 767 && isTouchDevice) {
        return 'mobile';
    } else if (width >= 1440) {
        return 'large';
    } else {
        return 'desktop';
    }
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
 * Device-spezifische Konfiguration ermitteln (erweitert)
 */
export function getDeviceConfig() {
    if (typeof window === 'undefined') return RESPONSIVE_CONFIG.desktop;

    const deviceType = getDeviceType();
    return RESPONSIVE_CONFIG[deviceType] || RESPONSIVE_CONFIG.desktop;
}

/**
 * ✅ NEU: Zeigt alle Layer mit ihren Responsive-Typen
 */
export function getLayerResponsiveTypes() {
    const layerTypes = {};

    Object.keys(LAYER_CONFIG).forEach(layerName => {
        const layer = LAYER_CONFIG[layerName];
        const types = [];

        if (layer.positioning) types.push('positioning');
        if (layer.size) types.push('size');
        if (layer.responsive) types.push('parameters');

        layerTypes[layerName] = types.length > 0 ? types : ['none'];
    });

    return layerTypes;
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
    console.log('🎯 7-SNAP-POINT PARALLAX CONFIG GELADEN (✅ VOLLSTÄNDIG RESPONSIVE):');
    console.log('📊 Snap-Point Mapping:', SNAP_POINT_MAPPING);
    console.log('🌟 Layer Config Keys:', Object.keys(LAYER_CONFIG));
    console.log('📱 Device Type:', getDeviceType());
    console.log('✅ Config Valid:', validateAllConfigs());

    // Zeige Layer-Verteilung pro Snap-Point
    console.log('🎬 LAYER AKTIVIERUNG PRO SNAP-POINT:');
    for (let i = 0; i <= 6; i++) {
        console.log(`  Snap ${i} (${(SNAP_POINT_MAPPING[i]?.progress * 100).toFixed(0)}%): ${getActiveLayersForSnapPoint(i).length} Layer`);
    }

    // ✅ NEU: Zeige alle responsive Layer mit ihren Typen
    console.log('📱 RESPONSIVE LAYER-ÜBERSICHT:');
    const responsiveTypes = getLayerResponsiveTypes();
    Object.entries(responsiveTypes).forEach(([layerName, types]) => {
        if (types[0] !== 'none') {
            console.log(`  ${layerName}: ✅ ${types.join(', ')}`);
        } else {
            console.log(`  ${layerName}: ❌ Keine responsive Optionen`);
        }
    });

    console.log(`📱 RESPONSIVE STATISTIK: ${Object.values(responsiveTypes).filter(types => types[0] !== 'none').length}/${Object.keys(LAYER_CONFIG).length} Layer haben responsive Optionen`);
}