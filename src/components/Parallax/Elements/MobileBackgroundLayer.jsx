// src/components/Parallax/Elements/MobileBackgroundLayer.jsx - MIT SCROLL DEBUG

import React from 'react';
import SafeImage from './SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { zIndices } from '../config/constants/index';

/**
 * 📱 MOBILE BACKGROUND LAYER - ZWEISCHICHTIG + SCROLL DEBUG
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

            {/* ✅ SCROLL PROGRESS DEBUG - NUR MOBILE */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'fixed',
                        top: '15px',
                        left: '15px',
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        border: '2px solid #4CAF50',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        minWidth: '130px',
                        textAlign: 'center'
                    }}
                >
                    {/* Haupt-Anzeige: Scroll Progress in % */}
                    <div style={{
                        fontSize: '22px',
                        color: '#4CAF50',
                        marginBottom: '4px'
                    }}>
                        {(scrollProgress * 40).toFixed(1)}%
                    </div>

                    {/* Sub-Anzeige: Raw Progress */}
                    <div style={{
                        fontSize: '11px',
                        opacity: 0.7,
                        color: '#ccc'
                    }}>
                        {scrollProgress.toFixed(3)}
                    </div>

                    {/* Phase-Indikator */}
                    <div style={{
                        fontSize: '10px',
                        opacity: 0.8,
                        marginTop: '2px',
                        color: scrollProgress < 0.08 ? '#ffeb3b' :
                            scrollProgress < 0.35 ? '#4CAF50' :
                                scrollProgress < 0.65 ? '#2196F3' :
                                    scrollProgress < 0.9 ? '#ff9800' :
                                        scrollProgress < 1.15 ? '#9c27b0' :
                                            scrollProgress < 1.5 ? '#e91e63' : '#f44336'
                    }}>
                        {scrollProgress < 0.08 ? 'Logo' :
                            scrollProgress < 0.35 ? 'Titel 1' :
                                scrollProgress < 0.65 ? 'Titel 2' :
                                    scrollProgress < 0.9 ? 'Titel 3' :
                                        scrollProgress < 1.15 ? 'Titel 4' :
                                            scrollProgress < 1.5 ? 'Carousel' : 'Newsletter'}
                    </div>
                </div>
            )}

            {/* ✅ ORIGINAL DEBUG (vereinfacht) */}
            {process.env.NODE_ENV === 'development' && (() => {
                const debugData = {
                    scrollProgress: scrollProgress.toFixed(3),
                    debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
                    zoomProgress: (zoomProgress * 100).toFixed(1) + '%',
                    scale: scale.toFixed(3),
                    offsetY: offsetY.toFixed(1) + '%',
                    maxZoom: maxZoomProgress + ' (' + (maxZoomProgress * 40).toFixed(0) + '% Debug)',
                    currentPhase: scrollProgress < 0.08 ? 'Phase 0 (Logo)' :
                        scrollProgress < 0.35 ? 'Phase 1 (Titel 1)' :
                            scrollProgress < 0.65 ? 'Phase 2 (Titel 2)' :
                                scrollProgress < 0.9 ? 'Phase 3 (Titel 3)' :
                                    scrollProgress < 1.15 ? 'Phase 4 (Titel 4)' :
                                        scrollProgress < 1.5 ? 'Phase 5 (Carousel)' :
                                            'Phase 6+ (Newsletter)',
                    zoomActive: zoomProgress < 1.0,
                    zoomComplete: zoomProgress >= 1.0
                };

                // Nur bei größeren Änderungen loggen
                if (Math.abs(scrollProgress - (window.lastMobileDebugProgress || 0)) > 0.1) {
                    console.log('📱 Mobile Scroll Update:', {
                        progress: debugData.scrollProgress,
                        percentage: debugData.debugPercentage,
                        phase: debugData.currentPhase,
                        zoom: debugData.zoomProgress
                    });
                    window.lastMobileDebugProgress = scrollProgress;
                }

                return null;
            })()}
        </ErrorBoundary>
    );
};

export default MobileBackgroundLayer;