// src/components/Parallax/Elements/MobileBackgroundLayer.jsx - MINIMALER FIX

import React from 'react';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

/**
 * 📱 MOBILE BACKGROUND LAYER - ZWEISCHICHTIG
 */
const MobileBackgroundLayer = ({ scrollProgress }) => {
    // ===== ZOOM-KONFIGURATION (ORIGINAL) =====
    const startScale = 3.0;
    const endScale = 1.0;
    const maxZoomProgress = 1.2;
    const startOffsetY = 0;
    const endOffsetY = 0;

    // ===== BERECHNUNGEN (ORIGINAL) =====
    const zoomProgress = Math.min(maxZoomProgress, scrollProgress) / maxZoomProgress;
    const scale = startScale - (zoomProgress * (startScale - endScale));
    const offsetY = startOffsetY + (zoomProgress * (endOffsetY - startOffsetY));

    return (
        <ErrorBoundary>
            {/* ===== HINTERGRUND (Mobile_Hg.webp) ===== */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    transform: `scale(${scale}) translateY(${offsetY}%)`,
                    transformOrigin: 'center top',
                    transition: 'transform 0.3s ease-out',
                    zIndex: zIndices.background // 0
                }}
                data-layer="mobile-background"
                data-scale={scale.toFixed(3)}
                data-zoom-progress={(zoomProgress * 100).toFixed(1)}
                data-offset-y={offsetY.toFixed(1)}
            >
                <picture>
                    <source
                        srcSet="/Parallax/mobile/Mobile_Hg.webp"
                        type="image/webp"
                    />
                    <SafeImage
                        src="/Parallax/mobile/Mobile_Hg.jpg"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            display: 'block'
                        }}
                        alt="AniTune Mobile Hintergrund"
                        onLoad={() => {
                            if (process.env.NODE_ENV === 'development') {
                                console.log('📱 Mobile Hintergrund geladen');
                            }
                        }}
                        onError={() => {
                            console.warn('❌ Mobile Hintergrund failed to load');
                        }}
                    />
                </picture>
            </div>

            {/* ===== VORDERGRUND (Mobile_Vg.webp) ===== */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    transform: `scale(${scale}) translateY(${offsetY}%)`,
                    transformOrigin: 'center top',
                    transition: 'transform 0.3s ease-out',
                    zIndex: 100 // Über Newsletter/Carousel
                }}
                data-layer="mobile-foreground"
                data-scale={scale.toFixed(3)}
                data-zoom-progress={(zoomProgress * 100).toFixed(1)}
                data-offset-y={offsetY.toFixed(1)}
            >
                <picture>
                    <source
                        srcSet="/Parallax/mobile/Mobile_Vg.webp"
                        type="image/webp"
                    />
                    <SafeImage
                        src="/Parallax/mobile/Mobile_Vg.jpg"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            display: 'block'
                        }}
                        alt="AniTune Mobile Vordergrund"
                        onLoad={() => {
                            if (process.env.NODE_ENV === 'development') {
                                console.log('📱 Mobile Vordergrund geladen');
                            }
                        }}
                        onError={() => {
                            console.warn('❌ Mobile Vordergrund failed to load');
                        }}
                    />
                </picture>
            </div>

            {/* ✅ DEBUG (ORIGINAL) */}
            {process.env.NODE_ENV === 'development' && (() => {
                const debugData = {
                    scrollProgress: scrollProgress.toFixed(3),
                    debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
                    zoomProgress: (zoomProgress * 100).toFixed(1) + '%',
                    scale: scale.toFixed(3),
                    offsetY: offsetY.toFixed(1) + '%',
                    maxZoom: maxZoomProgress + ' (' + (maxZoomProgress * 40).toFixed(0) + '% Debug)',
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

                if (Math.abs(scrollProgress - (window.lastMobileDebugProgress || 0)) > 0.1) {
                    console.log('📱 Mobile Zweischicht Update:', debugData);
                    window.lastMobileDebugProgress = scrollProgress;
                }

                return null;
            })()}
        </ErrorBoundary>
    );
};

export default MobileBackgroundLayer;