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

    // ===== Wolken-Konfigurationen mit Skalierung =====
    leftCloud: {
        segments: [
            {
                scrollStart: 0.70,
                scrollEnd: 1,        // Endet bei 100%
                posStart: -60,
                posEnd: 5,
                opacityStart: 0.9,
                opacityEnd: 1.0,
                // NEU: Skalierung während der Bewegung
                scaleStart: 1.7,     // Startet kleiner
                scaleEnd: 1.7        // Wird größer beim Näherkommen
            }
        ],
        position: {
            bottom: '43%'
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
                posStart: -40,
                posEnd: 5,
                opacityStart: 0.9,
                opacityEnd: 1.0,
                // NEU: Andere Skalierung für Variation
                scaleStart: 1.5,     // Startet etwas kleiner
                scaleEnd: 1.5        // Wird etwas größer
            }
        ],
        position: {
            bottom: '44%'
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
            {
                scrollStart: 0.70,
                scrollEnd: 1,
                posStart: -140,
                posEnd: 0,
                opacityStart: 1,
                opacityEnd: 1.0,
                // NEU: Hintergrund-Wolken skalieren langsamer
                scaleStart: 1.20,     // Startet normal
                scaleEnd: 1.20       // Wird nur leicht größer
            }
        ],
        position: {
            bottom: '65%'
        },
        size: elementSizes.cloud.left.lg,
        zIndex: zIndices.wolkenHinten
    },

    rightCloudHinten: {
        segments: [
            {
                scrollStart: 0.70,
                scrollEnd: 1,
                posStart: -140,
                posEnd: 10,
                opacityStart: 1,
                opacityEnd: 1.0,
                // NEU: Ähnliche Skalierung
                scaleStart: 1.40,
                scaleEnd: 1.40        // Etwas weniger als linke
            }
        ],
        position: {
            bottom: '65%'
        },
        size: elementSizes.cloud.right.lg,
        zIndex: zIndices.wolkenHinten
    },

    // ===== Wald-Konfiguration (unverändert) =====
    forest: {
        segments: [
            {
                scrollStart: 0.42,
                scrollEnd: 1,
                posStart: -55,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            },
        ],
        zIndex: zIndices.forest,
    },

    road: {
        segments: [
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
            {
                scrollStart: 0.60,
                scrollEnd: 1,
                posStart: -55,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            },
        ],
        zIndex: zIndices.berge
    },

    tal: {
        segments: [
            {
                scrollStart: 0.50,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0,
                opacityStart: 1,
                opacityEnd: 1
            },
        ],
        zIndex: zIndices.tal
    },

    waldHinten: {
        segments: [
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

    // ===== Person Layer =====
    dog: {
        segments: [
            {
                scrollStart: 0.30,
                scrollEnd: 1,
                posStart: -33,
                posEnd: 12,
                opacityStart: 1.0,
                opacityEnd: 1.0
            },
        ],
        position: {
            left: '50.8%'
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
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -120,
                posEnd: -20,
                opacityStart: 0.0,
                opacityEnd: 0.8
            },
        ],
        position: {
            left: '55%'
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