// src/components/Enhanced/layers/WaldHintenLayer.jsx
// 🌲 WALD HINTEN LAYER - Mit zentraler calculateLayerPosition

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition } from '../config/parallaxConfig';

const WaldHintenLayer = React.memo(({ scrollProgress, config, deviceConfig }) => {
    // ===== ZENTRALE BERECHNUNG =====
    const layerData = useMemo(() => {
        if (!config?.active || !config?.movement) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('🚨 WaldHintenLayer: Invalid config', { config });
            }
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, config);

        // Sichtbarkeits-Check
        const { scrollStart, scrollEnd } = config.movement;
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            visible,
            scale: position.scale
        };
    }, [scrollProgress, config]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1.0;

    // Performance Debug (Development only)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🌲 WaldHintenLayer Active:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            opacity: layerData.opacity.toFixed(2),
            translateY: layerData.translateY.toFixed(1),
            scale: layerData.scale.toFixed(2),
            multiplier,
            source: 'calculateLayerPosition()'
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
                data-layer="wald-hinten"
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
            </div>
        </ErrorBoundary>
    );
});

WaldHintenLayer.displayName = 'WaldHintenLayer';

export default WaldHintenLayer;