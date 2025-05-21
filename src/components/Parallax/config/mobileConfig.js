// src/components/Parallax/config/mobileConfig.js
import { springs, createTitles, baseAnimationConfig } from './baseConfig';
import { zIndices, elementSizes } from './constants';

export const mobileConfig = {
    // ===== Basis-Konfiguration =====
    background: {
        startScale: 3.0,  // Kleinerer Startzoom für mobile Geräte
        endScale: 1.0,
        spring: springs.responsive, // Schnellere Feder für mobile Geräte
        zIndex: zIndices.background
    },

    // ===== Logo-Konfiguration =====
    logo: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                scaleStart: 1.0,  // Kleinerer Anfangswert für mobile Geräte
                scaleEnd: 0.6,    // Kleinerer Endwert für mobile Geräte
                opacityStart: 1,
                opacityEnd: 0.85   // Etwas transparenter auf mobilen Geräten
            }
        ],
        position: {
            top: '30%',  // Höher positioniert auf mobilen Geräten
            left: '50%'
        },
        size: elementSizes.logo.sm, // Verwendung der zentralen Größendefinition
        spring: springs.responsive,  // Schnellere Feder für mobile Geräte
        zIndex: zIndices.logo
    },

    // ===== Wolken-Konfigurationen =====
    leftCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -90,  // Stärkere Bewegung auf mobilen Geräten
                posEnd: -30,    // Nicht vollständig sichtbar auf mobilen Geräten
                opacityStart: 0.9,
                opacityEnd: 1.0
            },
        ],
        position: {
            bottom: '52%'  // Angepasste Position für mobile Geräte
        },
        size: elementSizes.cloud.left.sm, // Zentrale Größendefinition
        spring: {
            ...springs.responsive,
            tension: 180,  // Schnellere Reaktion
            friction: 22   // Weniger Widerstand
        },
        zIndex: zIndices.clouds
    },

    rightCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -90,  // Stärkere Bewegung auf mobilen Geräten
                posEnd: -30,    // Nicht vollständig sichtbar auf mobilen Geräten
                opacityStart: 0.9,
                opacityEnd: 1.0
            },
        ],
        position: {
            bottom: '52%'  // Angepasste Position für mobile Geräte
        },
        size: elementSizes.cloud.right.sm, // Zentrale Größendefinition
        spring: {
            ...springs.responsive,
            tension: 180,  // Schnellere Reaktion
            friction: 22   // Weniger Widerstand
        },
        zIndex: zIndices.clouds
    },

    // ===== Wald-Konfiguration =====
    forest: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 0.3,
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
    // Generiere Titel mit der Hilfsfunktion - kleiner und mit angepassten Animationen für mobile Geräte
    titles: createTitles(
        {
            fontSize: '1.8rem',
            fontWeight: 600, // Etwas leichter für mobile Geräte
            textShadow: '0 0 8px rgba(0,0,0,0.8)' // Stärkerer Schatten für bessere Lesbarkeit
        },
        {
            // Angepasste Positionen für mobile Geräte
            positions: [
                { top: '55%', left: '50%' },
                { top: '60%', left: '50%' },
                { top: '65%', left: '50%' },
                { top: '60%', left: '50%' },
                { top: '65%', left: '50%' },
                { top: '70%', left: '50%' }
            ],
            // Vereinfachte Animationen für mobile Geräte (besser für Performance)
            animations: [
                baseAnimationConfig.fade,
                baseAnimationConfig.fade,
                baseAnimationConfig.fadeScale,
                baseAnimationConfig.fade,
                baseAnimationConfig.fadeScale,
                baseAnimationConfig.popIn
            ]
        }
    )
};