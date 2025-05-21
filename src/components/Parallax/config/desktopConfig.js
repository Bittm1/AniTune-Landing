// src/components/Parallax/config/desktopConfig.js
import { springs, createTitles, baseAnimationConfig } from './baseConfig';
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
                opacityEnd: 0.9 // Leichte Transparenz am Ende
            }
        ],
        position: {
            top: '33%',
            left: '50%'
        },
        size: elementSizes.logo.lg, // Verwendung der zentralen Größendefinition
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
        size: elementSizes.cloud.left.lg, // Zentrale Größendefinition
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
        size: elementSizes.cloud.right.lg, // Zentrale Größendefinition
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
        // Keine hartkodierten Bildpfade mehr, werden über imageSources injiziert
    },

    // ===== Titel-Konfiguration =====
    // Generiere Titel mit der Hilfsfunktion
    titles: createTitles(
        {
            fontSize: '2.5rem',
            fontWeight: 700 // Stärker für Desktop
        },
        {
            // Individuelle Positionen für die Titel
            positions: [
                { top: '60%', left: '50%' },
                { top: '65%', left: '50%' },
                { top: '70%', left: '50%' },
                { top: '65%', left: '50%' },
                { top: '70%', left: '50%' },
                { top: '75%', left: '50%' }
            ],
            // Individuelle Animationen für verschiedene Titel
            animations: [
                baseAnimationConfig.fadeScale,
                baseAnimationConfig.fadeSlide,
                baseAnimationConfig.popIn,
                baseAnimationConfig.fadeScale,
                baseAnimationConfig.floatIn,
                baseAnimationConfig.popIn
            ]
        }
    )
};