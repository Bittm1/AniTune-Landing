// src/components/Enhanced/layers/DogLayer.jsx
// 🐕 DOG LAYER - FIXED: Bleibt an Endposition sichtbar
// ✅ Layer verschwindet NICHT mehr nach scrollEnd

import React, { useMemo } from 'react';
import SafeImage from '../../Parallax/Elements/SafeImage';
import ErrorBoundary from '../../ErrorBoundary';
import { calculateLayerPosition } from '../config/parallaxConfig';

const DogLayer = ({ scrollProgress, config }) => {
    // ===== STRICT ERROR HANDLING =====
    if (!config || !config.movement) {
        console.error('DogLayer: Missing config! Check parallaxConfig.js');
        return null;
    }

    // ===== ZENTRALE BERECHNUNG (FIXED) =====
    const layerData = useMemo(() => {
        if (!config.active || !config.movement) {
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
            scale: position.scale,
            visible,
            left: config.position?.left || '50.8%',
            width: config.size?.width || '5vw',
            maxWidth: config.size?.maxWidth || '250px'
        };
    }, [scrollProgress, config]);

    // Debug Log (ERWEITERT)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🐕 DogLayer FIXED:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            visible: layerData.visible,
            opacity: layerData.opacity.toFixed(3),
            translateY: layerData.translateY.toFixed(1) + 'vh',
            atEndPosition: scrollProgress > config.movement.scrollEnd,
            source: 'calculateLayerPosition() + FIXED visibility'
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
                        top: '70px',
                        left: '20px',
                        background: 'rgba(139, 69, 19, 0.9)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        border: '2px solid #FFD700' // ✅ Goldener Rahmen für "Fixed"
                    }}
                >
                    🐕 DOG ✅ FIXED VISIBILITY: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
                    <br />
                    {scrollProgress > config.movement.scrollEnd ? '🔒 AT END POSITION' : '🎬 ANIMATING'}
                </div>
            )}

            <div
                style={{
                    position: 'fixed',
                    bottom: '12%',
                    left: layerData.left,
                    width: layerData.width,
                    maxWidth: layerData.maxWidth,
                    height: 'auto',
                    zIndex: config?.zIndex || 8,
                    pointerEvents: 'none',
                    transform: `translate(-50%, ${-layerData.translateY}vh) scale(${layerData.scale})`,
                    opacity: layerData.opacity,
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                }}
                data-dog-layer="fixed"
                data-at-end={scrollProgress > config.movement.scrollEnd}
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
            >
                <SafeImage
                    src="/Parallax/Hund.png"
                    fallbackSrc="/Parallax/Logo.png"
                    alt="Hund auf dem Weg zum AniTune Event"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                    onError={() => console.warn('❌ Dog image failed to load: /Parallax/Hund.png')}
                />
            </div>
        </ErrorBoundary>
    );
};

export default React.memo(DogLayer);