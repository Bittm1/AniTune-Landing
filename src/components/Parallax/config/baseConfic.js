// src/components/Parallax/config/baseConfig.js

/**
 * Basis-Konfigurationen für das Parallax-System
 * Enthält grundlegende Definitionen, die von allen spezifischen Konfigurationen verwendet werden
 */


// ===== Animations-Konfigurationen =====

/**
 * Gemeinsame Animations-Einstellungen für verschiedene Übergänge
 */
export const baseAnimationConfig = {
    fade: {
        inDuration: 0.2,
        outDuration: 0.2,
        type: 'fade'
    },
    fadeScale: {
        inDuration: 0.2,
        outDuration: 0.2,
        type: 'fade-scale'
    },
    fadeSlide: {
        inDuration: 0.2,
        outDuration: 0.2,
        type: 'fade-slide'
    }
};

/**
 * Basis-Federungen für Animationen (GSAP Physics)
 */
export const springs = {
    smooth: {
        mass: 0.8,
        tension: 120,
        friction: 26,
        clamp: true
    },
    responsive: {
        mass: 0.5,
        tension: 200,
        friction: 20,
        clamp: true
    }
};

// ===== Inhalts-Konfigurationen =====

/**
 * Basis-Stil für alle Titel-Elemente
 */
export const baseTitleStyle = {
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 10px rgba(0,0,0,0.7)',
    fontFamily: 'Lobster, cursive'
};

/**
 * Titel-Texte für die verschiedenen Sektionen
 */
export const titleTexts = [
    'Von Uns Ist Für Uns',
    'Der Weg',
    'Ist Das Ziel',
    'Die Community',
    'Heißt',
    'AniTune'
];

// ===== Hilfsfunktionen =====

/**
 * Erstellt Titel-Konfigurationsobjekte für alle Sektionen
 * @param {Object} styles - Überschreibende Stileigenschaften
 * @param {Object} options - Zusätzliche Optionen (Positionen, Animation)
 * @returns {Array} Array von Titel-Konfigurationsobjekten
 */
export function createTitles(styles, options = {}) {
    return titleTexts.map((text, index) => ({
        id: `title-${index + 1}`,
        text,
        position: options.positions?.[index] || {
            top: '60%',
            left: '50%'
        },
        style: {
            ...baseTitleStyle,
            ...styles
        },
        animation: options.animation || baseAnimationConfig.fadeScale
    }));
}