// src/components/Parallax/Elements/BackgroundLayer.jsx
import React from 'react';
import SafeImage from './SafeImage';
import { zIndices } from '../config/constants/index';
import ErrorBoundary from '../../ErrorBoundary';

const BackgroundLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('BackgroundLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe mit Fallbacks
    const startScale = config.startScale || 1.5;
    const endScale = config.endScale || 1.0;
    const imageSrc = config.imageSrc || "/Parallax/Himmel.png";

    // Z-Index aus Config mit Fallback auf den definierten Wert
    const zIndex = config.zIndex || zIndices.background;

    // Direkte lineare Skalierung ohne Segments
    const scale = startScale - (scrollProgress * (startScale - endScale));

    return (
        <ErrorBoundary>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                transform: `scale(${scale})`,
                transformOrigin: 'center top',
                transition: 'transform 0.3s ease-out',
                zIndex: zIndex  // Verwende den konfigurierten Z-Index
            }}>
                <SafeImage
                    src={imageSrc}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top'
                    }}
                    alt="Hintergrundhimmel"
                    onError={() => console.warn('Background image failed to load')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default BackgroundLayer;