// src/components/Parallax/Elements/BackgroundLayer.jsx - VERLÄNGERTER ZOOM-PROGRESS
import React from 'react';
import SafeImage from './SafeImage';
import { zIndices } from '../config/constants/index';
import ErrorBoundary from '../../ErrorBoundary';

const BackgroundLayer = ({ scrollProgress, config }) => {
    if (!config) {
        console.warn('BackgroundLayer: Missing configuration');
        return null;
    }

    const startScale = config.startScale || 1.5;
    const endScale = config.endScale || 1.0;
    const imageSrc = config.imageSrc || "/Parallax/Himmel.png";
    const zIndex = config.zIndex || zIndices.background;

    // ✅ GEÄNDERT: Zoom-Progress bis 200% verlängern (scrollProgress 2.0)
    // Du kannst hier den Wert anpassen:
    // - 1.5 = Zoom stoppt bei 150% scroll (60% Debug)
    // - 2.0 = Zoom stoppt bei 200% scroll (80% Debug) 
    // - 2.5 = Zoom stoppt bei 250% scroll (100% Debug)
    const maxZoomProgress = 1.05; // ⬅️ HIER KANNST DU DEN WERT ANPASSEN

    const zoomProgress = Math.min(maxZoomProgress, scrollProgress) / maxZoomProgress;

    // Direkte lineare Skalierung über verlängerten Bereich
    const scale = startScale - (zoomProgress * (startScale - endScale));

    return (
        <ErrorBoundary>
            <div style={{
                position: 'fixed',
                top: '-9%',
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                transform: `scale(${scale})`,
                transformOrigin: 'center top',
                transition: 'transform 0.3s ease-out',
                zIndex: zIndex
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

                {/* ✅ NUR DEVELOPMENT: Debug-Info für Zoom-Progress */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            background: 'rgba(0, 100, 200, 0.8)',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    >
                        🔍 BG-ZOOM DEBUG:
                        <br />ScrollProgress: {scrollProgress.toFixed(2)}
                        <br />ZoomProgress: {(zoomProgress * 100).toFixed(1)}%
                        <br />Scale: {scale.toFixed(3)}
                        <br />Max: {maxZoomProgress} ({(maxZoomProgress * 40).toFixed(0)}% Debug)
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default BackgroundLayer;