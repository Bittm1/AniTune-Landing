// src/components/Parallax/config/mobileConfig.js
import { springs, createTitles, createDeviceSpecificTiming } from './baseConfig';
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
                scrollEnd: 1,
                posStart: -80,
                posEnd: 0,
                opacityStart: 0.95,
                opacityEnd: 1.0
            }
        ],
        zIndex: zIndices.forest,
    },

    // ===== Mobile-optimierte Titel-Konfiguration =====
    titles: createTitles(
        // Style-Überschreibungen für Mobile
        {
            fontSize: '1.8rem',
            fontWeight: 600, // Etwas leichter für mobile Geräte
            textShadow: '0 0 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)', // Stärkerer Schatten für bessere Lesbarkeit
            letterSpacing: '0.3px' // Engerer Buchstabenabstand für kleinere Bildschirme
        },
        {
            // Mobile-spezifische Positionen (höher positioniert für kleinere Bildschirme)
            positions: [
                { top: '50%', left: '50%' }, // Von Uns Ist Für Uns
                { top: '50%', left: '50%' }, // Der Weg Ist Das Ziel
                { top: '50%', left: '50%' }, // Die Community Heißt
                { top: '50%', left: '50%' }  // AniTune
            ],

            // Vereinfachte Animationen für mobile Geräte (besser für Performance)
            animations: [
                'fadeScale',    // Von Uns Ist Für Uns - Einfach und zuverlässig
                'fade',         // Der Weg - Nur Fade für bessere Performance
                'fadeScale',    // Ist Das Ziel - Klassisch
                'fade',         // Die Community Heißt- Nur Fade
                'fadeScale',    // Heißt - Klassisch
                'popIn'         // AniTune - Dynamisches Finale
            ],

            // Mobile-spezifische Timing-Anpassungen (schneller für Touch-Interaktion)
            timing: createDeviceSpecificTiming('mobile')
        }
    )
};