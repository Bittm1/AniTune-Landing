// src/components/Parallax/Elements/BackgroundLayer.jsx
import React from 'react';
import SafeImage from './SafeImage';
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
                zIndex: 0
            }}>
                <SafeImage
                    src="/Parallax/Himmel.png"
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