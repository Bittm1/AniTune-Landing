// src/components/Parallax/Elements/MobileBackgroundLayer.jsx - CLEAN (NO DEBUG PANELS)
import React from 'react';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

/**
 * 📱 MOBILE BACKGROUND LAYER - CLEAN VERSION
 * Ahmt das Desktop Zoom-Verhalten nach: Startet oben, bewegt sich zur Mitte
 * OHNE störende Debug-Panels für Mobile
 */
const MobileBackgroundLayer = ({ scrollProgress }) => {
    // Zoom-Konfiguration (gleich wie Desktop BackgroundLayer)
    const startScale = 4.0;
    const endScale = 1.0;
    const maxZoomProgress = 1.05; // Zoom stoppt bei 105% (42% Debug)

    // Zoom-Progress Berechnung (identisch mit BackgroundLayer)
    const zoomProgress = Math.min(maxZoomProgress, scrollProgress) / maxZoomProgress;
    const scale = startScale - (zoomProgress * (startScale - endScale));

    // Vertikale Bewegung während Zoom (simuliert Desktop-Verhalten)
    // Startet oben (-20%) und bewegt sich zur Mitte (0%)
    const startOffsetY = -20; // Startet 20% höher
    const endOffsetY = 0;     // Endet in normaler Position
    const offsetY = startOffsetY + (zoomProgress * (endOffsetY - startOffsetY));

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    // Transform Origin oben + zusätzliche Y-Bewegung
                    transform: `scale(${scale}) translateY(${offsetY}%)`,
                    transformOrigin: 'center top',
                    transition: 'transform 0.3s ease-out',
                    zIndex: zIndices.background
                }}
                data-layer="mobile-background"
                data-scale={scale.toFixed(3)}
                data-zoom-progress={(zoomProgress * 100).toFixed(1)}
                data-offset-y={offsetY.toFixed(1)}
            >
                {/* Modern Picture Element mit WebP + JPG Fallback */}
                <picture>
                    <source
                        srcSet="/Parallax/mobile/Anitune_all_mobile.webp"
                        type="image/webp"
                    />
                    <SafeImage
                        src="/Parallax/mobile/Anitune_all_mobile.jpg"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center center',
                            display: 'block'
                        }}
                        alt="AniTune Mobile Background"
                        onLoad={() => {
                            if (process.env.NODE_ENV === 'development') {
                                console.log('📱 Mobile Composite Background geladen');
                            }
                        }}
                        onError={() => {
                            console.warn('❌ Mobile composite image failed to load');
                        }}
                    />
                </picture>

                {/* ✅ KEIN DEBUG PANEL MEHR - Nur Console-Logs für Development */}
                {process.env.NODE_ENV === 'development' && (() => {
                    // Debug-Info nur in Console, nicht als UI-Element
                    const debugData = {
                        scrollProgress: scrollProgress.toFixed(3),
                        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
                        zoomProgress: (zoomProgress * 100).toFixed(1) + '%',
                        scale: scale.toFixed(3),
                        offsetY: offsetY.toFixed(1) + '%',
                        maxZoom: maxZoomProgress + ' (' + (maxZoomProgress * 40).toFixed(0) + '% Debug)'
                    };

                    // Nur bei signifikanten Änderungen loggen
                    if (Math.abs(scrollProgress - (window.lastMobileDebugProgress || 0)) > 0.1) {
                        console.log('📱 Mobile Background Update:', debugData);
                        window.lastMobileDebugProgress = scrollProgress;
                    }

                    return null; // Kein UI-Element
                })()}
            </div>
        </ErrorBoundary>
    );
};

export default MobileBackgroundLayer;