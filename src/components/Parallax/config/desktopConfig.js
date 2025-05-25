// src/components/Parallax/config/desktopConfig.js
import { springs, createTitles, createDeviceSpecificTiming } from './baseConfig';
import { zIndices, elementSizes } from './constants';

export const desktopConfig = {
    // ===== Basis-Konfiguration =====
    background: {
        startScale: 4.0,
        endScale: 1.0,
        spring: springs.smooth,
        zIndex: zIndices.background
    },

    // ===== Logo-Konfiguration =====
    logo: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,        // Endet bei 100%
                scaleStart: 1.2,
                scaleEnd: 0.8,
                opacityStart: 1,
                opacityEnd: 0.9
            }
            // KEIN zweites Segment = Logo bleibt ab 100% konstant
        ],
        position: {
            top: '33%',
            left: '50%'
        },
        size: elementSizes.logo.lg,
        spring: springs.smooth,
        zIndex: zIndices.logo
    },

    // ===== Wolken-Konfigurationen (NUR Phase 1) =====
    leftCloud: {
        segments: [
            {
                scrollStart: 0.70,
                scrollEnd: 1,        // Endet bei 100%
                posStart: -35,
                posEnd: 0,
                opacityStart: 0.9,
                opacityEnd: 1.0
            }
            // KEIN zweites Segment = Wolke bleibt ab 100% an Position 0
        ],
        position: {
            bottom: '56%'
        },
        size: elementSizes.cloud.left.lg,
        spring: {
            ...springs.smooth,
            tension: 100,
            friction: 24
        },
        zIndex: zIndices.clouds
    },

    rightCloud: {
        segments: [
            {
                scrollStart: 0.70,
                scrollEnd: 1,        // Endet bei 100%
                posStart: -35,
                posEnd: 0,
                opacityStart: 0.9,
                opacityEnd: 1.0
            }
            // KEIN zweites Segment = Wolke bleibt ab 100% an Position 0
        ],
        position: {
            bottom: '56%'
        },
        size: elementSizes.cloud.right.lg,
        spring: {
            ...springs.smooth,
            tension: 100,
            friction: 24
        },
        zIndex: zIndices.clouds
    },

    leftCloudHinten: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.70,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0,
                opacityStart: 1,
                opacityEnd: 1.0
            }
        ],
        position: {
            bottom: '70%'
        },
        size: elementSizes.cloud.left.lg,
        zIndex: zIndices.wolkenHinten
    },

    rightCloudHinten: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.70,
                scrollEnd: 1,
                posStart: -25,
                posEnd: 0,
                opacityStart: 1,
                opacityEnd: 1.0
            }
        ],
        position: {
            bottom: '70%'
        },
        size: elementSizes.cloud.right.lg,
        zIndex: zIndices.wolkenHinten
    },

    // ===== Wald-Konfiguration (NUR Phase 1) =====
    forest: {
        segments: [
            // Phase 1: 0-100% (wie bisher)
            {
                scrollStart: 0.42,
                scrollEnd: 1,
                posStart: -55,
                posEnd: 0,           // Bei 100% ist er an Position 0
                opacityStart: 1.0,   // Startet vollständig sichtbarkk
                opacityEnd: 1.0
            },
        ],
        zIndex: zIndices.forest,
    },

    road: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.30,
                scrollEnd: 1,
                posStart: -45,
                posEnd: 0,
                opacityStart: 0.0,
                opacityEnd: 0.3
            },
        ],
        zIndex: zIndices.road

    },
    berge: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.60,
                scrollEnd: 1,
                posStart: -50,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            },
            // Phase 2: 100%-200%
        ],
        zIndex: zIndices.berge
    },

    tal: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.50,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0,
                opacityStart: 0.0,
                opacityEnd: 0.4
            },
            // Phase 2: 100%-200%
        ],
        zIndex: zIndices.tal
    },

    waldHinten: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.60,
                scrollEnd: 1,
                posStart: -35,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            },

        ],
        zIndex: zIndices.waldHinten
    },
    
    // In desktopConfig.js - Person und Menge Layer (vertikal bewegend)

    // ===== Person Layer =====
    dog: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.30,
                scrollEnd: 1,
                posStart: -33,      // Startet außerhalb (unten)
                posEnd: 12,         // Kommt fast ins Bild
                opacityStart: 1.0,
                opacityEnd: 1.0
            },
        ],
        position: {
            left: '50.8%'              // Konfigurierbare X-Position
        },
        size: {
            width: '5vw',
            maxWidth: '250px',
            height: 'auto'
        },
        zIndex: zIndices.dog
    },

    // ===== Menge Layer =====
    menge: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -120,      // Startet außerhalb (unten)
                posEnd: 0,         // Kommt langsam ins Bild
                opacityStart: 0.0,
                opacityEnd: 0.8
            },
        ],
        position: {
            left: '55%'              // Konfigurierbare X-Position (rechts)
        },
        size: {
            width: '90vw',
            maxWidth: '850px',
            height: 'auto'
        },
        zIndex: zIndices.menge
    },
    
    // ===== Desktop-spezifische Titel-Konfiguration =====
    titles: createTitles(
        {
            fontSize: '2.5rem',
            fontWeight: 700,
            textShadow: '0 0 15px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6)'
        },
        {
            positions: [
                { top: '50%', left: '50%' }, // Von Uns Ist Für Uns
                { top: '50%', left: '50%' }, // Der Weg
                { top: '50%', left: '50%' }, // Ist Das Ziel
                { top: '50%', left: '50%' }, // Die Community
                { top: '50%', left: '50%' }, // Heißt
                { top: '50%', left: '50%' }  // AniTune
            ],
            animations: [
                'fadeScale',    // Von Uns Ist Für Uns
                'slideUp',      // Der Weg
                'popIn',        // Ist Das Ziel
                'fadeScale',    // Die Community
                'slideDown',    // Heißt
                'popIn'         // AniTune
            ],
            timing: createDeviceSpecificTiming('desktop')
        }
    )
};