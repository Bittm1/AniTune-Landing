// src/components/Parallax/utils/animationUtils.js

/**
 * Animation-Utilities für scroll-basierte Parallax-Elemente (Logo, Wolken, etc.)
 * Titel-Animationen sind jetzt event-basiert und in den Config-Dateien definiert
 */

/**
 * Berechnet einen Wert basierend auf Segmenten und dem aktuellen Scroll-Fortschritt
 * @param {Array} segments Array von Segmenten mit scrollStart, scrollEnd, valueStart, valueEnd
 * @param {number} scrollProgress Aktuelle Scroll-Position (0-1)
 * @param {string} startProp Name der Eigenschaft für den Startwert (z.B. 'posStart', 'scaleStart')
 * @param {string} endProp Name der Eigenschaft für den Endwert (z.B. 'posEnd', 'scaleEnd')
 * @returns {number} Berechneter Wert für den aktuellen Scroll-Fortschritt
 */
export const getValueFromSegments = (segments, scrollProgress, startProp, endProp) => {
    // Finde das aktuelle Segment basierend auf scrollProgress
    const currentSegment = segments.find(
        segment => scrollProgress >= segment.scrollStart && scrollProgress <= segment.scrollEnd
    ) || segments[0]; // Fallback auf erstes Segment

    // Berechne den normalisierten Fortschritt innerhalb des Segments
    const segmentProgress = (scrollProgress - currentSegment.scrollStart) /
        (currentSegment.scrollEnd - currentSegment.scrollStart || 1); // Verhindere Division durch 0

    // Berechne den aktuellen Wert durch lineare Interpolation
    return currentSegment[startProp] +
        segmentProgress * (currentSegment[endProp] - currentSegment[startProp]);
};

/**
 * Spezifische Funktion für die Positionsberechnung
 */
export const getPositionFromSegments = (segments, scrollProgress) => {
    return getValueFromSegments(segments, scrollProgress, 'posStart', 'posEnd');
};

/**
 * Spezifische Funktion für die Skalierungsberechnung
 */
export const getScaleFromSegments = (segments, scrollProgress) => {
    return getValueFromSegments(segments, scrollProgress, 'scaleStart', 'scaleEnd');
};

/**
 * Spezifische Funktion für die Opacity-Berechnung
 */
export const getOpacityFromSegments = (segments, scrollProgress) => {
    const opacity = getValueFromSegments(segments, scrollProgress, 'opacityStart', 'opacityEnd');
    return Math.max(0, Math.min(1, opacity)); // Clamp zwischen 0 und 1
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