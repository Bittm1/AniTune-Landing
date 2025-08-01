// src/components/Enhanced/layers/RoadLayer.jsx
// 🛣️ ROAD LAYER - Mit zentraler calculateLayerPosition

import React, { useMemo } from 'react';
import SafeImage from '../../Parallax/Elements/SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { calculateLayerPosition } from '../config/parallaxConfig';

const RoadLayer = ({ scrollProgress, config }) => {
    // ===== ZENTRALE BERECHNUNG =====
    const layerData = useMemo(() => {
        // Fallback Config falls nicht vorhanden
        const defaultConfig = {
            active: true,
            movement: {
                scrollStart: 0.15,
                scrollEnd: 0.6,
                posStart: -40,
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        };

        const activeConfig = config || defaultConfig;

        if (!activeConfig.active || !activeConfig.movement) {
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, activeConfig);

        // Sichtbarkeits-Check
        const { scrollStart, scrollEnd } = activeConfig.movement;
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            scale: position.scale,
            visible
        };
    }, [scrollProgress, config]);

    // Debug Log
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🛣️ RoadLayer:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            visible: layerData.visible,
            opacity: layerData.opacity.toFixed(3),
            translateY: layerData.translateY.toFixed(1) + 'vh',
            source: 'calculateLayerPosition()'
        });
    }

    // Nicht rendern wenn nicht sichtbar
    if (!layerData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            {/* Debug Anzeige (FIXED POSITION - außerhalb des beweglichen Containers) */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '20px',
                        background: 'rgba(139, 69, 19, 0.9)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                >
                    🛣️ ROAD ✅ ZENTRAL: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
                </div>
            )}

            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    zIndex: config?.zIndex || 7,
                    pointerEvents: 'none',
                    transform: `translate(0, ${-layerData.translateY}vh) scale(${layerData.scale})`,
                    opacity: layerData.opacity,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                }}
            >
                <SafeImage
                    src="/Parallax/Weg.png"
                    fallbackSrc="/Parallax/Logo.png"
                    alt="Weg zum AniTune Event"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    onError={() => console.warn('❌ Road image failed to load: /Parallax/Weg.png')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default React.memo(RoadLayer);