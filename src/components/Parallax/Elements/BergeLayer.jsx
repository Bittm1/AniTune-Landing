// src/components/Parallax/Elements/BergeLayer.jsx
import React from 'react';
import { getPositionFromSegments } from '../utils/animationUtils';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

const BergeLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('BergeLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe auf Config-Werte mit Fallbacks
    const segments = config.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];
    const imageSrc = config.imageSrc || "/Parallax/Vierter_Hintergrund.png";
    const zIndex = config.zIndex || zIndices.berge;

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
                    alt="Berge hinten"
                    onError={() => console.warn('Berge image failed to load')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default BergeLayer;