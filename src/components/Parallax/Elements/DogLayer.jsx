import React from 'react';
import { getPositionFromSegments } from '../utils/animationUtils';
import SafeImage from './SafeImage';
import { zIndices } from '../config/constants/index';
import ErrorBoundary from '../../ErrorBoundary';

const DogLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('DogLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe auf Config-Werte mit Fallbacks
    const segments = config.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];
    const imageSrc = config.imageSrc || "/Parallax/Hund.png";
    const zIndex = config.zIndex || zIndices.dog;

    // Berechne die aktuelle Position basierend auf den Segmenten (Y-Achse wie bei Forest)
    const verticalOffset = getPositionFromSegments(segments, scrollProgress);

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0, // Basis-Position
                    left: config.position?.left || '50%',        // Konfigurierbare X-Position
                    transform: `translateX(-50%) translate(0, ${-verticalOffset}vh)`, // Zentriert horizontal + vertikale Bewegung
                    zIndex: zIndex,
                    pointerEvents: 'none',

                    // PERFORMANCE: Sanfte Optimierungen ohne aggressive Einstellungen
                    transition: 'transform 0.3s ease-out',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                }}
            >
                <SafeImage
                    src={imageSrc}
                    style={{
                        width: config.size?.width || '20vw',
                        maxWidth: config.size?.maxWidth || '300px',
                        height: config.size?.height || 'auto',
                        display: 'block'
                    }}
                    alt="Hund"
                    onError={() => console.warn('Dog image failed to load')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default DogLayer;