// src/components/Enhanced/layers/DogLayer.jsx
// 🐕 DOG LAYER - Mit zentraler calculateLayerPosition

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

    // ===== ZENTRALE BERECHNUNG =====
    const layerData = useMemo(() => {
        if (!config.active || !config.movement) {
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
            scale: position.scale,
            visible,
            left: config.position?.left || '50.8%',
            width: config.size?.width || '5vw',
            maxWidth: config.size?.maxWidth || '250px'
        };
    }, [scrollProgress, config]);

    // Debug Log
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🐕 DogLayer:', {
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
                        top: '70px',
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
                    🐕 DOG ✅ ZENTRAL: {layerData.opacity.toFixed(2)} opacity, {layerData.translateY.toFixed(1)}vh
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