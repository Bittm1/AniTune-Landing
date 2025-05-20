// src/components/Parallax/utils/animationUtils.js

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