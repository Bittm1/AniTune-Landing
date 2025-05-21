// src/components/Parallax/Elements/ForestLayer.jsx
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
    const imageSrc = config.imageSrc || "/Parallax/Erster_Hintergrund.png"; // Wald-Bild
    const zIndex = config.zIndex || zIndices.forest;

    // Berechne die aktuelle Position basierend auf den Segmenten
    const verticalOffset = getPositionFromSegments(segments, scrollProgress);

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    bottom: `${verticalOffset}%`, // Benutze die Position direkt als bottom-Wert
                    left: 0,
                    width: '100%',
                    zIndex: zIndex,
                    pointerEvents: 'none',
                    transition: 'bottom 0.3s ease-out' // Ändere die Transition-Eigenschaft auf bottom
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