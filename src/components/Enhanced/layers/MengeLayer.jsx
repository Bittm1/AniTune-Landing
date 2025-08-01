// src/components/Enhanced/layers/MengeLayer.jsx
// 👥 MENGE LAYER - Mit zentraler calculateLayerPosition

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition } from '../config/parallaxConfig';

const MengeLayer = React.memo(({ scrollProgress, config, deviceConfig }) => {
    // ===== ZENTRALE BERECHNUNG =====
    const layerData = useMemo(() => {
        if (!config?.active || !config?.movement) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('🚨 MengeLayer: Invalid config', { config });
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
            visible: visible && position.opacity > 0.01, // Nur zeigen wenn tatsächlich sichtbar
            scale: position.scale
        };
    }, [scrollProgress, config]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1.0;

    // Performance Debug (Development only)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('👥 MengeLayer Active:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            opacity: layerData.opacity.toFixed(2),
            translateY: layerData.translateY.toFixed(1),
            multiplier,
            visibleThreshold: 'opacity > 0.01',
            source: 'calculateLayerPosition()'
        });
    }

    // Nicht rendern wenn nicht sichtbar (Performance)
    if (!layerData.visible) {
        return null;
    }

    // ===== SIZE & POSITION CONFIG =====
    const sizeConfig = config?.size || {};
    const positionConfig = config?.position || {};

    return (
        <ErrorBoundary>
            <div
                className="menge-layer"
                style={{
                    position: 'fixed',
                    bottom: '0%',
                    left: positionConfig.left || '55%',
                    transform: `translate(-50%, ${-layerData.translateY * multiplier}vh) scale(${layerData.scale})`,
                    opacity: layerData.opacity,
                    zIndex: config?.zIndex || 9,
                    width: sizeConfig.width || '90vw',
                    maxWidth: sizeConfig.maxWidth || '850px',
                    height: sizeConfig.height || 'auto',
                    // Performance optimizations
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none'
                }}
                data-layer="menge"
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
                data-opacity={layerData.opacity.toFixed(2)}
                data-translate-y={layerData.translateY.toFixed(1)}
            >
                <SafeImage
                    src="/Parallax/Menge.png"
                    fallbackSrc="/Parallax/fallback-menge.png"
                    alt="Menschenmenge - Newsletter Phase"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'contain',
                        // Responsive Anpassungen
                        ...(multiplier < 1 && {
                            maxHeight: '40vh' // Mobile: kleiner
                        })
                    }}
                    onError={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('🚨 MengeLayer: Image failed to load');
                        }
                    }}
                />

                {/* ===== DEVELOPMENT DEBUG INFO ===== */}
                {process.env.NODE_ENV === 'development' && layerData.opacity > 0.5 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(255, 140, 0, 0.9)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            lineHeight: '1.3',
                            zIndex: 1,
                            border: '1px solid #ff8c00',
                            maxWidth: '200px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            👥 MENGE LAYER ✅ ZENTRAL
                        </div>
                        <div>Opacity: {layerData.opacity.toFixed(2)}</div>
                        <div>TranslateY: {layerData.translateY.toFixed(1)}vh</div>
                        <div>Scroll: {(scrollProgress * 100).toFixed(1)}%</div>
                        <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px' }}>
                            calculateLayerPosition()<br />
                            Zentrale Berechnungen
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

MengeLayer.displayName = 'MengeLayer';

export default MengeLayer;