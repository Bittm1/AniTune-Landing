// src/components/Enhanced/utils/snapPoints.js
// 🎯 NEUE 7-SNAP-POINT KONFIGURATION für Enhanced SimplePage
// ✅ GLEICHMÄSSIGE VERTEILUNG: 0%-15%-30%-45%-60%-80%-95%

/**
 * 7 SNAP-POINTS für Enhanced SimplePage
 * Gleichmäßige Verteilung für bessere User Experience
 * Jeder Punkt hat: Index, Progress (0-1), Label, Snap-Verhalten
 */
export const SNAP_POINTS = [
    {
        index: 0,
        progress: 0.00,  // 0%
        label: 'Logo + Newsletter',
        description: 'Startbildschirm mit Logo und Newsletter-Anmeldung',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    },
    {
        index: 1,
        progress: 0.15,  // 15%
        label: 'Von Uns Heißt Für Uns',
        description: 'Erster Titel mit Audio - Parallax Bewegung beginnt',
        snapDuration: 1.0,
        snapEase: 'power2.out'
    },
    {
        index: 2,
        progress: 0.30,  // 30% (NEU: war 35%)
        label: 'Der Weg Ist Das Ziel',
        description: 'Zweiter Titel mit Audio - Wald Layer kommen dazu',
        snapDuration: 1.0,
        snapEase: 'power2.out'
    },
    {
        index: 3,
        progress: 0.45,  // 45% (NEU: war 55%)
        label: 'Die Community Heißt',
        description: 'Dritter Titel mit Audio - Tal und Wald Hinten Layer',
        snapDuration: 1.0,
        snapEase: 'power2.out'
    },
    {
        index: 4,
        progress: 0.60,  // 60% (NEU: war 75%)
        label: 'Parallax Vollansicht',
        description: 'Alle Parallax Layer voll sichtbar - Berge, Wolken, komplette Szene',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    },
    {
        index: 5,
        progress: 0.80,  // 80% (NEU: Leer für Carousel)
        label: 'Carousel Phase',
        description: 'Leere Phase - hier kommt später das AniTune Carousel rein',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    },
    {
        index: 6,
        progress: 0.95,  // 95% (VERSCHOBEN: war Index 5)
        label: 'Newsletter CTA',
        description: 'Abschließender Newsletter Call-to-Action hoch in der Sonne',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    }
];

/**
 * 🎯 SNAP-POINT UTILITIES
 * Alle Funktionen funktionieren weiterhin mit 7 Snap-Points
 */

// Finde Snap-Point by Index
export const getSnapPointByIndex = (index) => {
    return SNAP_POINTS.find(point => point.index === index) || SNAP_POINTS[0];
};

// Finde Snap-Point by Progress (nächstliegender)
export const getSnapPointByProgress = (progress) => {
    let closestPoint = SNAP_POINTS[0];
    let minDistance = Math.abs(progress - SNAP_POINTS[0].progress);

    for (const point of SNAP_POINTS) {
        const distance = Math.abs(progress - point.progress);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    }

    return closestPoint;
};

// Nächster Snap-Point
export const getNextSnapPoint = (currentIndex) => {
    const nextIndex = Math.min(currentIndex + 1, SNAP_POINTS.length - 1);
    return getSnapPointByIndex(nextIndex);
};

// Vorheriger Snap-Point  
export const getPrevSnapPoint = (currentIndex) => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    return getSnapPointByIndex(prevIndex);
};

// Alle Snap-Point Indices (jetzt 0-6 statt 0-5)
export const getAllSnapIndices = () => {
    return SNAP_POINTS.map(point => point.index);
};

// Validierung (jetzt für 7 Snap-Points)
export const isValidSnapIndex = (index) => {
    return index >= 0 && index < SNAP_POINTS.length;
};

// Debug-Info für Entwicklung
export const getSnapPointDebugInfo = () => {
    return SNAP_POINTS.map(point => ({
        index: point.index,
        progress: point.progress,
        percentage: (point.progress * 100).toFixed(0) + '%',
        label: point.label,
        description: point.description
    }));
};

// ===== NEUE HELPER FUNCTIONS FÜR 7-SNAP-SYSTEM =====

/**
 * Gibt gleichmäßige Abstände zwischen Snap-Points zurück
 */
export const getSnapPointIntervals = () => {
    const intervals = [];
    for (let i = 0; i < SNAP_POINTS.length - 1; i++) {
        const current = SNAP_POINTS[i];
        const next = SNAP_POINTS[i + 1];
        intervals.push({
            from: current.index,
            to: next.index,
            distance: next.progress - current.progress,
            percentage: ((next.progress - current.progress) * 100).toFixed(0) + '%'
        });
    }
    return intervals;
};

/**
 * Prüft ob Index in Audio-Bereich (1-3) liegt
 */
export const isAudioSnapPoint = (index) => {
    return index >= 1 && index <= 3;
};

/**
 * Prüft ob Index in Parallax-Bereich (1-4) liegt  
 */
export const isParallaxSnapPoint = (index) => {
    return index >= 1 && index <= 4;
};

/**
 * Prüft ob Index Newsletter-Snap-Point (6) ist
 */
export const isNewsletterSnapPoint = (index) => {
    return index === 6;
};

/**
 * Prüft ob Index leere Carousel-Phase (5) ist
 */
export const isCarouselSnapPoint = (index) => {
    return index === 5;
};

// ===== DEVELOPMENT DEBUG =====
if (process.env.NODE_ENV === 'development') {
    console.log('🎯 NEUE 7-SNAP-POINT STRUKTUR GELADEN:');
    console.table(getSnapPointDebugInfo());
    console.log('📊 SNAP-POINT ABSTÄNDE:');
    console.table(getSnapPointIntervals());
    console.log('🎵 Audio Snap-Points:', getAllSnapIndices().filter(isAudioSnapPoint));
    console.log('🌟 Parallax Snap-Points:', getAllSnapIndices().filter(isParallaxSnapPoint));
}

export default {
    SNAP_POINTS,
    getSnapPointByIndex,
    getSnapPointByProgress,
    getNextSnapPoint,
    getPrevSnapPoint,
    getAllSnapIndices,
    isValidSnapIndex,
    getSnapPointDebugInfo,
    getSnapPointIntervals,
    isAudioSnapPoint,
    isParallaxSnapPoint,
    isNewsletterSnapPoint,
    isCarouselSnapPoint
};