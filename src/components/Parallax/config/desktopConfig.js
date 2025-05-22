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
                scrollStart: 0,
                scrollEnd: 1,        // Endet bei 100%
                posStart: -60,
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
                scrollStart: 0,
                scrollEnd: 1,        // Endet bei 100%
                posStart: -60,
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
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0,
                opacityStart: 0.9,
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
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -60,
                posEnd: +8,
                opacityStart: 0.9,
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
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -80,
                posEnd: -20,           // Bei 100% ist er an Position 0
                opacityStart: 0.95,
                opacityEnd: 1.0
            },
            // Phase 2: 100%-200% (neu!)
            {
                scrollStart: 1,      // Startet bei 100%
                scrollEnd: 1.2,        // Endet bei 200%
                posStart: -20,         // Startet wo Phase 1 endete
                posEnd: 0,         // Sinkt nach unten (halb verschwunden)
                opacityStart: 1.0,   // Startet vollständig sichtbar
                opacityEnd: 0.6      // Wird transparenter
            }
        ],
        zIndex: zIndices.forest,
    },

    road: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.8,
                scrollEnd: 1,
                posStart: -60,
                posEnd: -40,
                opacityStart: 0.0,
                opacityEnd: 0.3
            },
            // Phase 2: 100%-200%
            {
                scrollStart: 1,
                scrollEnd: 1.5,
                posStart: -40,
                posEnd: 0,
                opacityStart: 0.3,
                opacityEnd: 0.8
            }
        ],
        zIndex: zIndices.road

    },
    berge: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0.8,
                scrollEnd: 1,
                posStart: -80,
                posEnd: -40,
                opacityStart: 1.0,
                opacityEnd: 1.0
            },
            // Phase 2: 100%-200%
            {
                scrollStart: 1,
                scrollEnd: 1.8,
                posStart:  -40,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        ],
        zIndex: zIndices.berge
    },

    tal: {
        segments: [
            // Phase 1: 0-100%
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -120,
                posEnd: -30,
                opacityStart: 0.0,
                opacityEnd: 0.4
            },
            // Phase 2: 100%-200%
            {
                scrollStart: 1,
                scrollEnd: 2,
                posStart: -30,
                posEnd: 0,
                opacityStart: 0.4,
                opacityEnd: 0.7
            }
        ],
        zIndex: zIndices.tal
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