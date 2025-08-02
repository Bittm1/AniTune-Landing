// src/components/Enhanced/layers/WaldHintenLayer.jsx
// 🌲 WALD HINTEN LAYER - FIXED: Bleibt an Endposition sichtbar
// ✅ calculateLayerPosition + FIXED visibility logic

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition } from '../config/parallaxConfig';

const WaldHintenLayer = React.memo(({ scrollProgress, config, deviceConfig }) => {
    // ===== ZENTRALE BERECHNUNG (FIXED) =====
    const layerData = useMemo(() => {
        if (!config?.active || !config?.movement) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('🚨 WaldHintenLayer: Invalid config', { config });
            }
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, config);

        // ===== 🔧 FIXED SICHTBARKEITS-CHECK =====
        const { scrollStart } = config.movement;
        // ✅ VORHER: scrollProgress >= scrollStart && scrollProgress <= scrollEnd
        // ✅ NACHHER: Nur scrollStart prüfen - Layer bleibt IMMER sichtbar ab scrollStart
        const visible = scrollProgress >= scrollStart;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            visible,
            scale: position.scale,
            atEndPosition: scrollProgress > config.movement.scrollEnd
        };
    }, [scrollProgress, config]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1.0;

    // Performance Debug (ERWEITERT)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🌲 WaldHintenLayer FIXED:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            opacity: layerData.opacity.toFixed(2),
            translateY: layerData.translateY.toFixed(1),
            scale: layerData.scale.toFixed(2),
            multiplier,
            atEndPosition: layerData.atEndPosition,
            source: 'calculateLayerPosition() + FIXED visibility'
        });
    }

    // Nicht rendern wenn nicht sichtbar (Performance)
    if (!layerData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                className="wald-hinten-layer"
                style={{
                    position: 'fixed',
                    bottom: '0%',
                    left: '50%',
                    transform: `translate(-50%, ${-layerData.translateY * multiplier}vh) scale(${layerData.scale})`,
                    opacity: layerData.opacity,
                    zIndex: config?.zIndex || 5,
                    width: '100vw',
                    height: 'auto',
                    // Performance optimizations
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none'
                }}
                data-layer="wald-hinten-fixed"
                data-at-end={layerData.atEndPosition}
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
                data-opacity={layerData.opacity.toFixed(2)}
            >
                <SafeImage
                    src="/Parallax/zweiter_Hintergrund.webp"
                    fallbackSrc="/Parallax/fallback-wald.png"
                    alt="Wald Hinten - Hintergrund Parallax"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover'
                    }}
                    onError={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('🚨 WaldHintenLayer: Image failed to load');
                        }
                    }}
                />

                {/* ===== DEVELOPMENT DEBUG INFO (FIXED VERSION) ===== */}
                {process.env.NODE_ENV === 'development' && layerData.opacity > 0.3 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(46, 125, 50, 0.9)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            lineHeight: '1.3',
                            zIndex: 1,
                            border: '2px solid #FFD700', // ✅ Goldener Rahmen für "Fixed"
                            maxWidth: '200px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            🌲 WALD HINTEN ✅ FIXED
                        </div>
                        <div>Opacity: {layerData.opacity.toFixed(2)}</div>
                        <div>TranslateY: {layerData.translateY.toFixed(1)}vh</div>
                        <div>Scale: {layerData.scale.toFixed(2)}</div>
                        <div>Status: {layerData.atEndPosition ? '🔒 AT END' : '🎬 ANIMATING'}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px' }}>
                            calculateLayerPosition()<br />
                            FIXED visibility logic
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

WaldHintenLayer.displayName = 'WaldHintenLayer';

export default WaldHintenLayer;