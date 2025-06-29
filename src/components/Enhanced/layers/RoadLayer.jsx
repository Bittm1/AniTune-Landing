// src/components/Enhanced/layers/RoadLayer.jsx
// 🛣️ ROAD LAYER - Clean und einfach

import React, { useMemo } from 'react';
import SafeImage from '../../Parallax/Elements/SafeImage';
import ErrorBoundary from '../../ErrorBoundary';

const RoadLayer = ({ scrollProgress, config }) => {
    // ===== BERECHNUNGEN =====
    const layerData = useMemo(() => {
        // Fallback Config falls nicht vorhanden
        const defaultConfig = {
            active: true,
            movement: {
                scrollStart: 0.30,
                scrollEnd: 1.0,
                posStart: -45,
                posEnd: 0,
                opacityStart: 0.0,
                opacityEnd: 0.3
            }
        };

        const activeConfig = config || defaultConfig;

        if (!activeConfig.active || !activeConfig.movement) {
            return { opacity: 0, translateY: 0, visible: false };
        }

        const { scrollStart, scrollEnd, posStart, posEnd, opacityStart, opacityEnd } = activeConfig.movement;

        // Sichtbarkeits-Check
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;
        if (!visible) {
            return { opacity: 0, translateY: 0, visible: false };
        }

        // Progress berechnen
        const localProgress = (scrollProgress - scrollStart) / (scrollEnd - scrollStart);
        const clampedProgress = Math.max(0, Math.min(1, localProgress));

        // Werte interpolieren
        const opacity = opacityStart + (opacityEnd - opacityStart) * clampedProgress;
        const translateY = posStart + (posEnd - posStart) * clampedProgress;

        return {
            opacity: Math.max(0, Math.min(1, opacity)),
            translateY,
            visible: true
        };
    }, [scrollProgress, config]);

    // Debug Log
    if (process.env.NODE_ENV === 'development') {
        console.log('🛣️ RoadLayer:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            visible: layerData.visible,
            opacity: layerData.opacity.toFixed(3),
            translateY: layerData.translateY.toFixed(1) + 'vh'
        });
    }

    // Nicht rendern wenn nicht sichtbar
    if (!layerData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    zIndex: config?.zIndex || 7,
                    pointerEvents: 'none',
                    transform: `translate(0, ${-layerData.translateY}vh)`,
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

                {/* Debug Anzeige */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            background: 'rgba(139, 69, 19, 0.9)',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'monospace'
                        }}
                    >
                        🛣️ ROAD: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default React.memo(RoadLayer);