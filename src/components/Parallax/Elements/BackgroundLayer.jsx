// src/components/Parallax/Elements/BackgroundLayer.jsx
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

    // WICHTIG: Nur Phase 1 (0-100%) verwenden
    const phase1Progress = Math.min(1, scrollProgress);

    // Direkte lineare Skalierung nur für Phase 1
    const scale = startScale - (phase1Progress * (startScale - endScale));

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
            </div>
        </ErrorBoundary>
    );
};

export default BackgroundLayer;