// src/components/Enhanced/layers/TalLayer.jsx
// 🏔️ TAL LAYER - FIXED: Bleibt an Endposition sichtbar
// ✅ Layer verschwindet NICHT mehr nach scrollEnd
// ✅ ERWEITERT: Responsive Positionierung + Asset-Management

import React, { useMemo } from 'react';
import SafeImage from '../../Parallax/Elements/SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { getResponsivePositioning, getResponsiveSize } from '../config/parallaxConfig'; // ✅ NEU: Responsive Helpers

const TalLayer = ({ scrollProgress, config, deviceConfig }) => {
    // ===== RESPONSIVE POSITIONING =====
    const responsivePos = useMemo(() => {
        return getResponsivePositioning('tal') || {};
    }, []);

    const responsiveSize = useMemo(() => {
        return getResponsiveSize('tal') || {};
    }, []);

    // ===== BERECHNUNGEN (FIXED) =====
    const layerData = useMemo(() => {
        // Fallback Config falls nicht vorhanden
        const defaultConfig = {
            active: true,
            movement: {
                scrollStart: 0.45,
                scrollEnd: 1.0,
                posStart: -60,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        };

        const activeConfig = config || defaultConfig;

        if (!activeConfig.active || !activeConfig.movement) {
            return { opacity: 0, translateY: 0, visible: false };
        }

        const { scrollStart, scrollEnd, posStart, posEnd, opacityStart, opacityEnd } = activeConfig.movement;

        // ===== 🔧 FIXED SICHTBARKEITS-CHECK =====
        // ✅ VORHER: scrollProgress >= scrollStart && scrollProgress <= scrollEnd
        // ✅ NACHHER: Nur scrollStart prüfen - Layer bleibt IMMER sichtbar ab scrollStart
        const visible = scrollProgress >= scrollStart;

        if (!visible) {
            return { opacity: 0, translateY: 0, visible: false };
        }

        // ===== POSITION BERECHNUNG (MIT END-POSITION FREEZE) =====
        let localProgress, opacity, translateY;

        if (scrollProgress <= scrollEnd) {
            // Normal animation zwischen scrollStart und scrollEnd
            localProgress = (scrollProgress - scrollStart) / (scrollEnd - scrollStart);
            const clampedProgress = Math.max(0, Math.min(1, localProgress));

            opacity = opacityStart + (opacityEnd - opacityStart) * clampedProgress;
            translateY = posStart + (posEnd - posStart) * clampedProgress;
        } else {
            // ✅ NACH scrollEnd: An Endposition "einfrieren"
            opacity = opacityEnd;
            translateY = posEnd;
        }

        return {
            opacity: Math.max(0, Math.min(1, opacity)),
            translateY,
            visible: true,
            atEndPosition: scrollProgress > scrollEnd
        };
    }, [scrollProgress, config]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1.0;

    // Debug Log (ERWEITERT)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🏔️ TalLayer FIXED + RESPONSIVE:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            visible: layerData.visible,
            opacity: layerData.opacity.toFixed(3),
            translateY: layerData.translateY.toFixed(1) + 'vh',
            atEndPosition: layerData.atEndPosition,
            responsivePos,
            multiplier,
            source: 'FIXED visibility + responsive positioning'
        });
    }

    // Nicht rendern wenn nicht sichtbar
    if (!layerData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            {/* Debug Anzeige (ERWEITERT MIT RESPONSIVE INFO) */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'fixed',
                        top: '170px',
                        left: '20px',
                        background: 'rgba(165, 42, 42, 0.9)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        zIndex: 9999,
                        border: '2px solid #00ff88', // ✅ Grüner Rahmen für "Responsive"
                        pointerEvents: 'none'
                    }}
                >
                    🏔️ TAL ✅ FIXED + RESPONSIVE: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
                    <br />
                    {layerData.atEndPosition ? '🔒 AT END POSITION' : '🎬 ANIMATING'}
                    <br />
                    📱 Multiplier: {multiplier}
                </div>
            )}

            <div
                style={{
                    position: 'fixed',
                    bottom: responsivePos.bottom || 0, // ✅ NEU: Responsive Bottom-Position
                    left: responsivePos.left || 0, // ✅ NEU: Responsive Left-Position
                    width: responsiveSize.width || '100%', // ✅ NEU: Responsive Width
                    zIndex: config?.zIndex || 4,
                    pointerEvents: 'none',
                    transform: `translate(0, ${-layerData.translateY * multiplier}vh)`, // ✅ Mit Multiplier
                    opacity: layerData.opacity,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                }}
                data-tal-layer="fixed-responsive"
                data-at-end={layerData.atEndPosition}
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
                data-multiplier={multiplier}
            >
                <SafeImage
                    src="/Parallax/Dritter_Hintergrund.png"
                    fallbackSrc="/Parallax/Logo.png"
                    alt="Tal zum AniTune Event"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    onError={() => console.warn('❌ Tal image failed to load: /Parallax/Dritter_Hintergrund.png')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default React.memo(TalLayer);