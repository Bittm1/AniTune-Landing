// src/components/Parallax/config/baseConfig.js

// Gemeinsame Animations-Konfigurationen
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

// Grundlegende Titeleigenschaften
export const baseTitleStyle = {
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 10px rgba(0,0,0,0.7)',
    fontFamily: 'Lobster, cursive'
};

// Basis Spring-Konfigurationen
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

// Titel-Texte (um Duplikate zu vermeiden)
export const titleTexts = [
    'Von Uns Ist Für Uns',
    'Der Weg',
    'Ist Das Ziel',
    'Die Community',
    'Heißt',
    'AniTune'
];

// Hilfsfunktion zum Erstellen von Titeln
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