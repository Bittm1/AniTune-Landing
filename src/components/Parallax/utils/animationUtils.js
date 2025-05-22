// src/components/Parallax/utils/animationUtils.js

/**
 * Animation-Utilities für scroll-basierte Parallax-Elemente
 * Erweitert für mehrere Segmente und 0-200% scroll range
 */

/**
 * ERWEITERTE Funktion: Berechnet einen Wert basierend auf Segmenten und dem aktuellen Scroll-Fortschritt
 * Unterstützt jetzt mehrere Segmente und automatische Fallbacks
 * @param {Array} segments Array von Segmenten mit scrollStart, scrollEnd, valueStart, valueEnd
 * @param {number} scrollProgress Aktuelle Scroll-Position (0-2 für 0-200%)
 * @param {string} startProp Name der Eigenschaft für den Startwert (z.B. 'posStart', 'scaleStart')
 * @param {string} endProp Name der Eigenschaft für den Endwert (z.B. 'posEnd', 'scaleEnd')
 * @returns {number} Berechneter Wert für den aktuellen Scroll-Fortschritt
 */
export const getValueFromSegments = (segments, scrollProgress, startProp, endProp) => {
    // Sicherheitscheck für leere oder ungültige Segmente
    if (!segments || segments.length === 0) {
        console.warn('getValueFromSegments: Keine Segmente gefunden');
        return 0;
    }

    // Sortiere Segmente nach scrollStart (Sicherheit)
    const sortedSegments = [...segments].sort((a, b) => a.scrollStart - b.scrollStart);

    // Finde das aktuelle Segment basierend auf scrollProgress
    let currentSegment = null;

    for (const segment of sortedSegments) {
        if (scrollProgress >= segment.scrollStart && scrollProgress <= segment.scrollEnd) {
            currentSegment = segment;
            break;
        }
    }

    // Fallback-Logik: Wenn kein aktives Segment gefunden
    if (!currentSegment) {
        // Wenn scrollProgress unter allen Segmenten liegt
        if (scrollProgress < sortedSegments[0].scrollStart) {
            currentSegment = sortedSegments[0];
            // Verwende den Startwert des ersten Segments
            return currentSegment[startProp] || 0;
        }
        // Wenn scrollProgress über allen Segmenten liegt
        else {
            currentSegment = sortedSegments[sortedSegments.length - 1];
            // Verwende den Endwert des letzten Segments (WICHTIG für "Einfrieren")
            return currentSegment[endProp] || 0;
        }
    }

    // Berechne den normalisierten Fortschritt innerhalb des Segments
    const segmentProgress = Math.max(0, Math.min(1,
        (scrollProgress - currentSegment.scrollStart) /
        (currentSegment.scrollEnd - currentSegment.scrollStart || 1) // Verhindere Division durch 0
    ));

    // Berechne den aktuellen Wert durch lineare Interpolation
    const startValue = currentSegment[startProp] || 0;
    const endValue = currentSegment[endProp] || 0;

    return startValue + segmentProgress * (endValue - startValue);
};

/**
 * Spezifische Funktion für die Positionsberechnung
 * @param {Array} segments - Array von Segment-Objekten
 * @param {number} scrollProgress - Scroll-Fortschritt (0-2)
 * @returns {number} Position in Prozent
 */
export const getPositionFromSegments = (segments, scrollProgress) => {
    return getValueFromSegments(segments, scrollProgress, 'posStart', 'posEnd');
};

/**
 * Spezifische Funktion für die Skalierungsberechnung
 * @param {Array} segments - Array von Segment-Objekten
 * @param {number} scrollProgress - Scroll-Fortschritt (0-2)
 * @returns {number} Skalierungsfaktor
 */
export const getScaleFromSegments = (segments, scrollProgress) => {
    return getValueFromSegments(segments, scrollProgress, 'scaleStart', 'scaleEnd');
};

/**
 * Spezifische Funktion für die Opacity-Berechnung
 * @param {Array} segments - Array von Segment-Objekten
 * @param {number} scrollProgress - Scroll-Fortschritt (0-2)
 * @returns {number} Opacity-Wert (zwischen 0 und 1)
 */
export const getOpacityFromSegments = (segments, scrollProgress) => {
    const opacity = getValueFromSegments(segments, scrollProgress, 'opacityStart', 'opacityEnd');
    return Math.max(0, Math.min(1, opacity)); // Clamp zwischen 0 und 1
};

/**
 * Debug-Funktion: Zeigt an welches Segment aktuell aktiv ist
 * @param {Array} segments - Array von Segment-Objekten  
 * @param {number} scrollProgress - Scroll-Fortschritt (0-2)
 * @returns {Object} Debug-Informationen
 */
export const getActiveSegmentInfo = (segments, scrollProgress) => {
    if (!segments || segments.length === 0) return null;

    const sortedSegments = [...segments].sort((a, b) => a.scrollStart - b.scrollStart);

    for (let i = 0; i < sortedSegments.length; i++) {
        const segment = sortedSegments[i];
        if (scrollProgress >= segment.scrollStart && scrollProgress <= segment.scrollEnd) {
            return {
                segmentIndex: i,
                segment: segment,
                progress: (scrollProgress - segment.scrollStart) / (segment.scrollEnd - segment.scrollStart),
                phase: scrollProgress <= 1 ? 'Phase 1 (0-100%)' : 'Phase 2 (100-200%)'
            };
        }
    }

    return {
        segmentIndex: -1,
        segment: null,
        progress: 0,
        phase: scrollProgress <= 1 ? 'Phase 1 (0-100%)' : 'Phase 2 (100-200%)',
        note: scrollProgress < sortedSegments[0].scrollStart ? 'Before first segment' : 'After last segment'
    };
};

/**
 * Prüft, ob ein Bild existiert (kann für Error-Handling verwendet werden)
 * @param {string} url Bild-URL
 * @returns {Promise<boolean>} Promise, das true zurückgibt, wenn das Bild geladen werden kann
 */
export const imageExists = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};