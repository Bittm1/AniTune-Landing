// src/components/Enhanced/layers/BergeLayer.jsx
// ⛰️ BERGE LAYER - FIXED: Bleibt an Endposition sichtbar
// ✅ Layer verschwindet NICHT mehr nach scrollEnd

import React, { useMemo } from 'react';
import SafeImage from '../../Parallax/Elements/SafeImage';
import ErrorBoundary from '../../ErrorBoundary';

const BergeLayer = ({ scrollProgress, config }) => {
    // ===== BERECHNUNGEN (FIXED) =====
    const layerData = useMemo(() => {
        // Fallback Config falls nicht vorhanden
        const defaultConfig = {
            active: true,
            movement: {
                scrollStart: 0.00,
                scrollEnd: 0.6,
                posStart: -100,
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

    // Debug Log (ERWEITERT)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('⛰️ BergeLayer FIXED:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            visible: layerData.visible,
            opacity: layerData.opacity.toFixed(3),
            translateY: layerData.translateY.toFixed(1) + 'vh',
            atEndPosition: layerData.atEndPosition,
            source: 'FIXED visibility logic'
        });
    }

    // Nicht rendern wenn nicht sichtbar
    if (!layerData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            {/* Debug Anzeige (ERWEITERT MIT FIX-INFO) */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'fixed',
                        top: '220px',
                        left: '20px',
                        background: 'rgba(105, 105, 105, 0.9)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        zIndex: 9999,
                        border: '2px solid #FFD700', // ✅ Goldener Rahmen für "Fixed"
                        pointerEvents: 'none'
                    }}
                >
                    ⛰️ BERGE ✅ FIXED: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
                    <br />
                    {layerData.atEndPosition ? '🔒 AT END POSITION' : '🎬 ANIMATING'}
                </div>
            )}

            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    zIndex: config?.zIndex || 3,
                    pointerEvents: 'none',
                    transform: `translate(0, ${-layerData.translateY}vh)`,
                    opacity: layerData.opacity,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                }}
                data-berge-layer="fixed"
                data-at-end={layerData.atEndPosition}
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
            >
                <SafeImage
                    src="/Parallax/Vierter_Hintergrund.png"
                    fallbackSrc="/Parallax/Logo.png"
                    alt="Berge zum AniTune Event"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    onError={() => console.warn('❌ Berge image failed to load: /Parallax/Vierter_Hintergrund.png')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default React.memo(BergeLayer);