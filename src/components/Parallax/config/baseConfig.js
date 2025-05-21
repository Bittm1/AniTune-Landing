// src/components/Parallax/config/baseConfig.js

/**
 * Basis-Konfigurationen für das Parallax-System
 * Enthält grundlegende Definitionen, die von allen spezifischen Konfigurationen verwendet werden
 */
import { animationTiming } from './constants';


// ===== Animations-Konfigurationen =====

/**
 * Gemeinsame Animations-Einstellungen für verschiedene Übergänge
 * Optimiert für konsistente Nutzung der zentralen Timing-Konstanten
 */
export const baseAnimationConfig = {
    fade: {
        inDuration: animationTiming.standard,
        outDuration: animationTiming.standard,
        type: 'fade',
        easing: 'power2.inOut' // GSAP easing hinzugefügt für glattere Übergänge
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
        distance: 30 // Pixel für slide transition
    },
    // Neue optimierte Übergänge hinzugefügt
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
 * Für Performance-optimierte Animationen mit Memo-Kompatibilität
 */
export const springs = {
    smooth: {
        mass: 0.8,
        tension: 120,
        friction: 26,
        clamp: true,
        precision: 0.01, // Höhere Präzision verbessert die Leistung
        velocity: 0      // Anfangsgeschwindigkeit auf 0 setzen
    },
    responsive: {
        mass: 0.5,
        tension: 200,
        friction: 20,
        clamp: true,
        precision: 0.01,
        velocity: 0
    },
    // Neue optimierte Varianten
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

// ===== Inhalts-Konfigurationen =====

/**
 * Basis-Stil für alle Titel-Elemente
 * Mit Fallback für Schriftarten und verbesserten Lesbarkeits-Eigenschaften
 */
export const baseTitleStyle = {
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 10px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)', // Verbesserte Lesbarkeit
    fontFamily: 'Lobster, cursive, sans-serif', // Fallback-Schriftart hinzugefügt
    letterSpacing: '0.5px', // Bessere Lesbarkeit
    textAlign: 'center', // Konsistente Ausrichtung
    transform: 'translateX(-50%)', // Für Zentrierung mit left: 50%
    opacity: 0.95 // Leicht transparent für bessere Integration
};

/**
 * Titel-Texte für die verschiedenen Sektionen
 * Als separates Array für einfachere Pflege und Mehrsprachigkeit
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
export function createTitles(styles = {}, options = {}) {
    // Stelle sicher, dass die Optionen korrekt initialisiert sind
    const positions = options.positions || [];
    const animations = options.animations || [];

    return titleTexts.map((text, index) => ({
        id: `title-${index + 1}`,
        text,
        // Effizientere Positions-Zuweisung mit Fallback-Werten
        position: positions[index] || {
            top: `${50 + (index * 5)}%`, // Dynamische Positionierung basierend auf Index
            left: '50%'
        },
        style: {
            ...baseTitleStyle,
            ...styles,
            // Anpassung der Schriftgröße basierend auf Textlänge für bessere Anzeige
            fontSize: text.length > 15 ?
                (styles.fontSize ? `calc(${styles.fontSize} * 0.85)` : '2.125rem') :
                (styles.fontSize || '2.5rem')
        },
        // Effizientere Animations-Zuweisung mit individuellen Anpassungen
        animation: animations[index] ||
            (index % 2 === 0 ? baseAnimationConfig.fadeScale : baseAnimationConfig.fadeSlide)
    }));
}