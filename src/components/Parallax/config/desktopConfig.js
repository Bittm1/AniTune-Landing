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
                scrollEnd: 1,
                scaleStart: 1.2,
                scaleEnd: 0.8,
                opacityStart: 1,
                opacityEnd: 0.9
            }
        ],
        position: {
            top: '33%',
            left: '50%'
        },
        size: elementSizes.logo.lg,
        spring: springs.smooth,
        zIndex: zIndices.logo
    },

    // ===== Wolken-Konfigurationen =====
    leftCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0,
                opacityStart: 0.9,
                opacityEnd: 1.0
            },
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
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0,
                opacityStart: 0.9,
                opacityEnd: 1.0
            },
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

    // ===== Wald-Konfiguration =====
    forest: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -50,
                posEnd: 0,
                opacityStart: 0.95,
                opacityEnd: 1.0
            }
        ],
        zIndex: zIndices.forest,
    },

    // ===== Desktop-spezifische Titel-Konfiguration =====
    titles: createTitles(
        // Style-Überschreibungen für Desktop
        {
            fontSize: '2.5rem',
            fontWeight: 700,
            textShadow: '0 0 15px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6)'
        },
        {
            // Desktop-spezifische Positionen für alle 6 Titel
            positions: [
                { top: '58%', left: '50%' }, // Von Uns Ist Für Uns
                { top: '62%', left: '50%' }, // Der Weg
                { top: '66%', left: '50%' }, // Ist Das Ziel
                { top: '62%', left: '50%' }, // Die Community
                { top: '66%', left: '50%' }, // Heißt
                { top: '70%', left: '50%' }  // AniTune
            ],

            // Desktop-spezifische Animationen
            animations: [
                'fadeScale',    // Von Uns Ist Für Uns - Klassisch
                'slideUp',      // Der Weg - Von unten
                'popIn',        // Ist Das Ziel - Dynamisch
                'fadeScale',    // Die Community - Klassisch
                'slideDown',    // Heißt - Von oben
                'popIn'         // AniTune - Dynamisches Finale
            ],

            // Desktop-spezifische Timing-Anpassungen
            timing: createDeviceSpecificTiming('desktop')
        }
    )
};