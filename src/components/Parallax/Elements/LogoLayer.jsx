// src/components/Parallax/Elements/LogoLayer.jsx
import React from 'react';
import { getScaleFromSegments } from '../utils/animationUtils';

const LogoLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('LogoLayer: Missing configuration');
        return null;
    }

    const logoScale = getScaleFromSegments(config.segments, scrollProgress);

    // Berechne die Opacity basierend auf dem scrollProgress
    const opacity = Math.max(0, 1 - ((scrollProgress || 0) / 0.33));

    // Verwende die bereitgestellte imageSrc oder Fallback
    const imageSrc = config.imageSrc || "/Parallax/Logo.png";

    // Wenn vollständig unsichtbar, nicht rendern
    if (opacity <= 0.01) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: config.position.top,
                left: config.position.left,
                transform: `translate(-50%, -50%) scale(${logoScale})`,
                zIndex: 10,
                pointerEvents: 'none',
                opacity: opacity,
                transition: 'opacity 800ms ease-out',
                width: config.size,
                height: config.size, // Anpassen falls das Logo nicht quadratisch ist
                backgroundImage: `url(${imageSrc})`, // Geändert: Verwende die dynamische imageSrc
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                willChange: 'opacity',
            }}
        />
    );
};

export default LogoLayer;