// src/components/Parallax/Elements/MobileBackgroundLayer.jsx - ANGEPASSTE ZOOM KONFIGURATION

import React from 'react';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

/**
 * 📱 MOBILE BACKGROUND LAYER - ANGEPASSTER ZOOM
 */
const MobileBackgroundLayer = ({ scrollProgress }) => {
    // ===== ZOOM-KONFIGURATION - HIER ANPASSEN =====

    // 🎯 ZOOM-STÄRKE ANPASSEN
    const startScale = 3.0;      // ⬅️ ERHÖHT: Stärkerer Zoom (war 4.0)
    const endScale = 1.0;        // ⬅️ Bleibt gleich: Normale Größe am Ende

    // 🎯 ZOOM-DAUER ANPASSEN (mit Phasen abgleichen)
    const maxZoomProgress = 1.2; // ⬅️ VERLÄNGERT: Zoom bis 160% (64% Debug) - Ende Phase 5

    // 🎯 VERTIKALE POSITION ANPASSEN (weiter oben starten)
    const startOffsetY = 0;    // ⬅️ ERHÖHT: Startet 40% höher (war -20%)
    const endOffsetY = 0;      // ⬅️ ANGEPASST: Endet 10% höher (war 0%)

    // ===== BERECHNUNGEN =====

    // Zoom-Progress Berechnung
    const zoomProgress = Math.min(maxZoomProgress, scrollProgress) / maxZoomProgress;
    const scale = startScale - (zoomProgress * (startScale - endScale));

    // Vertikale Bewegung während Zoom
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
                    // Transform mit Scale + Y-Offset
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
                {/* Mobile Composite Background */}
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
                            objectPosition: 'center top', // ⬅️ WICHTIG: Position für Zoom
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

                {/* ✅ ERWEITERTE DEBUG-INFO (nur Development) */}
                {process.env.NODE_ENV === 'development' && (() => {
                    // Debug-Info nur in Console für bessere Performance
                    const debugData = {
                        scrollProgress: scrollProgress.toFixed(3),
                        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
                        zoomProgress: (zoomProgress * 100).toFixed(1) + '%',
                        scale: scale.toFixed(3),
                        offsetY: offsetY.toFixed(1) + '%',
                        maxZoom: maxZoomProgress + ' (' + (maxZoomProgress * 40).toFixed(0) + '% Debug)',

                        // ✅ NEU: Phasen-Info
                        currentPhase: scrollProgress < 0.05 ? 'Phase 0 (Logo)' :
                            scrollProgress < 0.5 ? 'Phase 1 (Titel 1)' :
                                scrollProgress < 0.8 ? 'Phase 2 (Titel 2)' :
                                    scrollProgress < 1.0 ? 'Phase 3 (Titel 3)' :
                                        scrollProgress < 1.2 ? 'Phase 4 (Titel 4)' :
                                            scrollProgress < 1.6 ? 'Phase 5 (Carousel)' :
                                                'Phase 6+ (Newsletter)',

                        zoomActive: zoomProgress < 1.0,
                        zoomComplete: zoomProgress >= 1.0
                    };

                    // Nur bei größeren Änderungen loggen
                    if (Math.abs(scrollProgress - (window.lastMobileDebugProgress || 0)) > 0.1) {
                        console.log('📱 Mobile Zoom Update:', debugData);
                        window.lastMobileDebugProgress = scrollProgress;
                    }

                    return null;
                })()}
            </div>
        </ErrorBoundary>
    );
};

export default MobileBackgroundLayer;