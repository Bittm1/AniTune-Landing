// src/components/Enhanced/utils/snapPoints.js
// 🎯 SNAP-POINT KONFIGURATION für Enhanced SimplePage

/**
 * 6 SNAP-POINTS für Enhanced SimplePage
 * Jeder Punkt hat: Index, Progress (0-1), Label, Snap-Verhalten
 */
export const SNAP_POINTS = [
    {
        index: 0,
        progress: 0.00,
        label: 'Logo + Newsletter',
        description: 'Startbildschirm mit Logo und Newsletter-Anmeldung',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    },
    {
        index: 1,
        progress: 0.15,
        label: 'Von Uns Heißt Für Uns',
        description: 'Erster Titel mit Audio',
        snapDuration: 1.0,
        snapEase: 'power2.out'
    },
    {
        index: 2,
        progress: 0.35,
        label: 'Der Weg Ist Das Ziel',
        description: 'Zweiter Titel mit Audio',
        snapDuration: 1.0,
        snapEase: 'power2.out'
    },
    {
        index: 3,
        progress: 0.55,
        label: 'Die Community Heißt',
        description: 'Dritter Titel mit Audio',
        snapDuration: 1.0,
        snapEase: 'power2.out'
    },
    {
        index: 4,
        progress: 0.75,
        label: 'AniTune Carousel',
        description: 'Carousel mit AniTune Features',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    },
    {
        index: 5,
        progress: 0.95,
        label: 'Newsletter CTA',
        description: 'Abschließender Newsletter Call-to-Action',
        snapDuration: 1.2,
        snapEase: 'power2.inOut'
    }
];

/**
 * 🎯 SNAP-POINT UTILITIES
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

// Alle Snap-Point Indices
export const getAllSnapIndices = () => {
    return SNAP_POINTS.map(point => point.index);
};

// Validierung
export const isValidSnapIndex = (index) => {
    return index >= 0 && index < SNAP_POINTS.length;
};

// Debug-Info für Entwicklung
export const getSnapPointDebugInfo = () => {
    return SNAP_POINTS.map(point => ({
        index: point.index,
        progress: point.progress,
        percentage: (point.progress * 100).toFixed(0) + '%',
        label: point.label
    }));
};

export default {
    SNAP_POINTS,
    getSnapPointByIndex,
    getSnapPointByProgress,
    getNextSnapPoint,
    getPrevSnapPoint,
    getAllSnapIndices,
    isValidSnapIndex,
    getSnapPointDebugInfo
  };