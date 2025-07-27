// src/components/Enhanced/layers/ForestLayer.jsx
// 🌲 FOREST LAYER - Clean und einfach (nach RoadLayer Pattern)

import React, { useMemo } from 'react';
import SafeImage from '../../Parallax/Elements/SafeImage';
import ErrorBoundary from '../../ErrorBoundary';

const ForestLayer = ({ scrollProgress, config }) => {
    // ===== BERECHNUNGEN =====
    const layerData = useMemo(() => {
        // Fallback Config falls nicht vorhanden
        const defaultConfig = {
            active: true,
            movement: {
                scrollStart: 0.30,
                scrollEnd: 1.0,
                posStart: -55,
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

    // Debug Log (wie RoadLayer)
    if (process.env.NODE_ENV === 'development') {
        console.log('🌲 ForestLayer:', {
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
            {/* Debug Anzeige (FIXED POSITION) */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'fixed',  // ✅ FIXED statt absolute!
                        top: '120px',
                        left: '20px',
                        background: 'rgba(34, 139, 34, 0.9)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        zIndex: 9999  // ✅ Hinzugefügt
                    }}
                >
                    🌲 FOREST: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
                </div>
            )}

            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    zIndex: config?.zIndex || 6,
                    pointerEvents: 'none',
                    transform: `translate(0, ${-layerData.translateY}vh)`,
                    opacity: layerData.opacity,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                }}
            >
                <SafeImage
                    src="/Parallax/Erster_Hintergrund.webp"
                    fallbackSrc="/Parallax/Logo.png"
                    alt="Wald zum AniTune Event"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    onError={() => console.warn('❌ Forest image failed to load: /Parallax/Erster_Hintergrund.webp')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default React.memo(ForestLayer);