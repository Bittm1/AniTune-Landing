// src/components/Parallax/config/baseConfig.js

/**
 * Basis-Konfigurationen für das Parallax-System
 * Vereinfacht für Event-basierte Titel-Animationen
 */
import { animationTiming } from './constants';

// ===== Animations-Konfigurationen =====

/**
 * Gemeinsame Animations-Einstellungen für verschiedene Übergänge
 */
export const baseAnimationConfig = {
    fade: {
        inDuration: animationTiming.standard,
        outDuration: animationTiming.standard,
        type: 'fade',
        easing: 'power2.inOut'
    },
    fadeScale: {
        inDuration: animationTiming.standard,
        outDuration: animationTiming.standard,
        type: 'fade-scale',
        easing: 'power2.inOut',
        scaleFrom: 0.9,
        scaleTo: 1
    },
    fadeSlide: {
        inDuration: animationTiming.standard,
        outDuration: animationTiming.standard,
        type: 'fade-slide',
        easing: 'power2.inOut',
        distance: 30
    },
    popIn: {
        inDuration: animationTiming.medium,
        outDuration: animationTiming.fast,
        type: 'fade-scale',
        easing: 'back.out(1.7)',
        scaleFrom: 0.5,
        scaleTo: 1
    },
    floatIn: {
        inDuration: animationTiming.slow,
        outDuration: animationTiming.medium,
        type: 'fade-slide',
        easing: 'sine.out',
        distance: 50
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
        clamp: true,
        precision: 0.01,
        velocity: 0
    },
    responsive: {
        mass: 0.5,
        tension: 200,
        friction: 20,
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

// ===== Titel-spezifische Konfigurationen =====

/**
 * Basis-Stil für alle Titel-Elemente
 */
export const baseTitleStyle = {
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 10px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)',
    fontFamily: 'Lobster, cursive, sans-serif',
    letterSpacing: '0.5px',
    textAlign: 'center',
    transform: 'translateX(-50%)',
    opacity: 0.95
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

/**
 * Standard-Animationstypen für verschiedene Titel
 */
export const defaultTitleAnimations = [
    'fadeScale',    // Titel 1: Von Uns Ist Für Uns
    'slideUp',      // Titel 2: Der Weg
    'popIn',        // Titel 3: Ist Das Ziel
    'fadeScale',    // Titel 4: Die Community
    'slideDown',    // Titel 5: Heißt
    'popIn'         // Titel 6: AniTune
];

// Positionen werden jetzt device-spezifisch in desktopConfig.js / mobileConfig.js definiert

/**
 * Event-basierte Titel-Erstellungsfunktion mit einfachen Animation-Definitionen
 * @param {Object} styleOverrides - Überschreibende Stileigenschaften
 * @param {Object} options - Zusätzliche Optionen
 * @returns {Array} Array von Titel-Konfigurationsobjekten
 */
export function createTitles(styleOverrides = {}, options = {}) {
    // Positionen sind jetzt PFLICHT - müssen von desktopConfig/mobileConfig übergeben werden
    const positions = options.positions;
    const animations = options.animations || defaultTitleAnimations;
    const timing = options.timing || {};

    // Validierung: Positionen müssen übergeben werden
    if (!positions || positions.length !== titleTexts.length) {
        throw new Error('createTitles: positions array is required and must match titleTexts length');
    }

    return titleTexts.map((text, index) => {
        // Bestimme Animationstyp für diesen Titel
        const animationType = animations[index] || 'fadeScale';

        // Erstelle einfache Animation-Definition
        const animation = {
            type: animationType,
            duration: timing[animationType]?.duration || animationTiming.standard,
            outDuration: timing[animationType]?.outDuration || (timing[animationType]?.duration || animationTiming.standard) * 0.7,
            delay: timing[animationType]?.delay || 0,
            ease: timing[animationType]?.ease || getDefaultEaseForType(animationType),
            outEase: timing[animationType]?.outEase || 'power2.in'
        };

        return {
            id: `title-${index + 1}`,
            text,
            section: index + 1, // Welche Sektion (1-6)

            // Position (muss von Config übergeben werden)
            position: positions[index],

            // Styling
            style: {
                ...baseTitleStyle,
                ...styleOverrides,
                // Anpassung der Schriftgröße basierend auf Textlänge
                fontSize: text.length > 15 ?
                    (styleOverrides.fontSize ? `calc(${styleOverrides.fontSize} * 0.85)` : '2.125rem') :
                    (styleOverrides.fontSize || '2.5rem')
            },

            // Einfache Animation-Konfiguration
            animation
        };
    });
}

/**
 * Hilfsfunktion: Gibt Standard-Easing für Animationstyp zurück
 */
function getDefaultEaseForType(animationType) {
    switch (animationType) {
        case 'fadeScale': return 'power2.out';
        case 'slideUp': return 'power2.out';
        case 'slideDown': return 'power2.out';
        case 'slideLeft': return 'power2.out';
        case 'slideRight': return 'power2.out';
        case 'popIn': return 'back.out(1.7)';
        case 'fade': return 'power2.out';
        default: return 'power2.out';
    }
}

/**
 * Timing-Konfigurationen für verschiedene Devices
 */
export function createDeviceSpecificTiming(deviceType = 'desktop') {
    const baseTiming = {
        fadeScale: { duration: 0.6, delay: 0, ease: 'power2.out', outDuration: 0.4 },
        slideUp: { duration: 0.7, delay: 0.1, ease: 'power2.out', outDuration: 0.5 },
        slideDown: { duration: 0.7, delay: 0.1, ease: 'power2.out', outDuration: 0.5 },
        slideLeft: { duration: 0.6, delay: 0, ease: 'power2.out', outDuration: 0.4 },
        slideRight: { duration: 0.6, delay: 0, ease: 'power2.out', outDuration: 0.4 },
        popIn: { duration: 0.8, delay: 0.2, ease: 'back.out(1.7)', outDuration: 0.5 },
        fade: { duration: 0.5, delay: 0, ease: 'power2.out', outDuration: 0.3 }
    };

    if (deviceType === 'mobile') {
        // Schnellere Animationen für mobile Geräte
        return {
            fadeScale: { duration: 0.4, delay: 0, ease: 'power2.out', outDuration: 0.3 },
            slideUp: { duration: 0.5, delay: 0.05, ease: 'power2.out', outDuration: 0.3 },
            slideDown: { duration: 0.5, delay: 0.05, ease: 'power2.out', outDuration: 0.3 },
            slideLeft: { duration: 0.4, delay: 0, ease: 'power2.out', outDuration: 0.3 },
            slideRight: { duration: 0.4, delay: 0, ease: 'power2.out', outDuration: 0.3 },
            popIn: { duration: 0.6, delay: 0.1, ease: 'back.out(1.4)', outDuration: 0.4 }, // Weniger bounce
            fade: { duration: 0.3, delay: 0, ease: 'power2.out', outDuration: 0.2 }
        };
    }

    return baseTiming;
}