// src/components/Parallax/Elements/RoadLayer.jsx
import React from 'react';
import { getPositionFromSegments } from '../utils/animationUtils';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

const RoadLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('RoadLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe auf Config-Werte mit Fallbacks
    const segments = config.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];
    const imageSrc = config.imageSrc || "/Parallax/Weg.png";
    const zIndex = config.zIndex || zIndices.road;

    // Berechne die aktuelle Position basierend auf den Segmenten
    const verticalOffset = getPositionFromSegments(segments, scrollProgress);

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    bottom: `${verticalOffset}%`,
                    left: 0,
                    width: '100%',
                    zIndex: zIndex,
                    pointerEvents: 'none',
                    transition: 'bottom 0.3s ease-out'
                }}
            >
                <SafeImage
                    src={imageSrc}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    alt="Weg"
                    onError={() => console.warn('Road image failed to load')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default RoadLayer;