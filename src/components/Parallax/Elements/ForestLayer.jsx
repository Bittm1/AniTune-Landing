import React from 'react';
import { getPositionFromSegments } from '../utils/animationUtils';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

const ForestLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('ForestLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe auf Config-Werte mit Fallbacks
    const segments = config.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];
    const imageSrc = config.imageSrc || "/Parallax/Erster_Hintergrund.png";
    const zIndex = config.zIndex || zIndices.forest;

    // Berechne die aktuelle Position basierend auf den Segmenten
    const verticalOffset = getPositionFromSegments(segments, scrollProgress);

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0, // Basis-Position
                    left: 0,
                    width: '100%',
                    zIndex: zIndex,
                    pointerEvents: 'none',

                    // PERFORMANCE: Viewport-basierte Transform (gleiche Logik wie vorher)
                    transform: `translate(0, ${-verticalOffset}vh)`,

                    // PERFORMANCE: Sanfte Optimierungen
                    transition: 'transform 0.3s ease-out',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                }}
            >
                <SafeImage
                    src={imageSrc}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    alt="Wald Silhouette"
                    onError={() => console.warn('Forest image failed to load')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default ForestLayer;