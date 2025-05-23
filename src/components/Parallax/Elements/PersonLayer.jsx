// src/components/Parallax/Elements/PersonLayer.jsx
import React from 'react';
import { getPositionFromSegments } from '../utils/animationUtils';
import SafeImage from './SafeImage';
import { zIndices } from '../config/constants/index';
import ErrorBoundary from '../../ErrorBoundary';

const PersonLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('PersonLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe auf Config-Werte mit Fallbacks
    const segments = config.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];
    const imageSrc = config.imageSrc || "/Parallax/Person.png";
    const zIndex = config.zIndex || zIndices.person;

    // Berechne die aktuelle Position basierend auf den Segmenten (Y-Achse wie bei Forest)
    const verticalOffset = getPositionFromSegments(segments, scrollProgress);

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    bottom: `${verticalOffset}%`,
                    left: config.position?.left || '50%',        // Konfigurierbare X-Position
                    transform: 'translateX(-50%)',               // Zentriert horizontal
                    zIndex: zIndex,
                    pointerEvents: 'none',
                    transition: 'bottom 0.3s ease-out'
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
                    alt="Person"
                    onError={() => console.warn('Person image failed to load')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default PersonLayer;