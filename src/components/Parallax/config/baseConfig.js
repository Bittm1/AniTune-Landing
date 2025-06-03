// src/components/Parallax/config/baseConfig.js - ANGEPASST für 3 Titel-Phasen

import { animationTiming } from './constants';
// ✅ NEU: Import der Scroll-Segmente
import { getActiveScrollSegments, getActiveTimingConfig } from './timingConfig';

// ===== Animations-Konfigurationen (unverändert) =====
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

// ✅ ANGEPASST: 4 Titel-Phasen für neue Segment-Aufteilung
export const titleTexts = [
    'Von Uns Heißt Für Uns',  // Phase 1 (bis 16% Debug)
    'Der Weg Ist Das Ziel',   // Phase 2 (bis 32% Debug)
    'Die Community Heißt',     // Phase 3 (bis 40% Debug)
    'AniTune'                 // Phase 4 ✅ HINZUGEFÜGT
];

// ✅ ANGEPASST: 3 Animationen für 3 Titel
export const defaultTitleAnimations = [
    'fadeScale',    // Von Uns Heißt Für Uns
    'slideUp',      // Der Weg Ist Das Ziel
    'popIn',         // Die Community Heißt
    'fadeScale'     // AniTune ✅ HINZUGEFÜGT
];

// ✅ KORRIGIERTE createTitles-Funktion mit 3 Titeln
export function createTitles(styleOverrides = {}, options = {}) {
    const positions = options.positions;
    const animations = options.animations || defaultTitleAnimations;
    const timing = options.timing || {};

    // ✅ NEU: Lade Segmente aus timingConfig statt hart-kodiert
    const segmentConfig = getActiveScrollSegments();
    const titleSegments = segmentConfig.segments;

    if (!positions || positions.length !== titleTexts.length) {
        throw new Error('createTitles: positions array is required and must match titleTexts length');
    }

    // ✅ KORRIGIERT: Erwarte genug Segmente für 3 Titel (Phase 0 + 3 Titel + weitere)
    const expectedSegments = titleTexts.length + 1; // +1 für Phase 0 (Logo)
    if (titleSegments.length < expectedSegments) {
        console.warn(`Expected at least ${expectedSegments} segments (Phase 0 + ${titleTexts.length} titles), got ${titleSegments.length}. Using available segments.`);
    }

    return titleTexts.map((text, index) => {
        const animationType = animations[index] || 'fadeScale';

        // ✅ KORRIGIERT: Überspringe Phase 0 (index + 1)
        // titleSegments[0] = Phase 0 (Logo/Newsletter)
        // titleSegments[1] = Phase 1 (Erster Titel)
        // titleSegments[2] = Phase 2 (Zweiter Titel)
        // titleSegments[3] = Phase 3 (Dritter Titel)
        const segmentIndex = index + 1;
        const segment = titleSegments[segmentIndex] || titleSegments[titleSegments.length - 1];

        if (!segment) {
            console.error(`No segment found for title ${index + 1}: "${text}"`);
            // Fallback-Segment erstellen basierend auf neuer Aufteilung
            const fallbackSegment = {
                scrollStart: index === 0 ? 0.05 : (index === 1 ? 0.4 : 0.8),
                scrollEnd: index === 0 ? 0.4 : (index === 1 ? 0.8 : 1.0),
                snapTarget: index === 0 ? 0.4 : (index === 1 ? 0.8 : 1.0),
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            };
            return createTitleObject(text, index, animationType, fallbackSegment, positions[index], styleOverrides, timing);
        }

        return createTitleObject(text, index, animationType, segment, positions[index], styleOverrides, timing);
    });
}

// ✅ NEU: Hilfsfunktion für Titel-Objekt-Erstellung
function createTitleObject(text, index, animationType, segment, position, styleOverrides, timing) {
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
        index,

        // ✅ Segment-Definition aus timingConfig
        segments: [segment],
        snapTarget: segment.snapTarget,
        snapDuration: segment.snapDuration,
        snapEase: segment.snapEase,

        position: position,

        style: {
            ...baseTitleStyle,
            ...styleOverrides,
            fontSize: text.length > 15 ?
                (styleOverrides.fontSize ? `calc(${styleOverrides.fontSize} * 0.85)` : '2.125rem') :
                (styleOverrides.fontSize || '2.5rem')
        },

        animation
    };
}

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

// ✅ ERWEITERTE Device-spezifische Timing-Funktion (verwendet jetzt timingConfig)
export function createDeviceSpecificTiming(deviceType = 'desktop') {
    // Lade Timing aus der timingConfig
    const timingConfig = getActiveTimingConfig();

    if (deviceType === 'mobile') {
        // Mobile: Alle Animationen 30% schneller
        return Object.fromEntries(
            Object.entries(timingConfig.titleAnimations).map(([key, timing]) => [
                key,
                {
                    ...timing,
                    duration: timing.duration * 0.7,
                    delay: timing.delay * 0.5,
                    outDuration: timing.outDuration * 0.7
                }
            ])
        );
    }

    return timingConfig.titleAnimations;
}

// ===== Snap-Scroll-Hilfsfunktionen (angepasst für 3 Titel) =====
export function findNearestSnapTarget(currentProgress, titles) {
    let nearestTitle = null;
    let minDistance = Infinity;

    titles.forEach(title => {
        const distance = Math.abs(currentProgress - title.snapTarget);
        if (distance < minDistance) {
            minDistance = distance;
            nearestTitle = title;
        }
    });

    return nearestTitle;
}

export function findAdjacentTitle(currentProgress, titles, direction = 'next') {
    const sortedTitles = [...titles].sort((a, b) => a.snapTarget - b.snapTarget);

    if (direction === 'next') {
        return sortedTitles.find(title => title.snapTarget > currentProgress) || sortedTitles[0];
    } else {
        return sortedTitles.reverse().find(title => title.snapTarget < currentProgress) || sortedTitles[0];
    }
}

export function getCurrentActiveTitle(scrollProgress, titles) {
    return titles.find(title => {
        const segment = title.segments[0];
        return scrollProgress >= segment.scrollStart && scrollProgress <= segment.scrollEnd;
    });
}