// src/components/Enhanced/layers/CloudLayer.jsx
// ☁️ CLOUD LAYER (VORNE) - FIXED: Bleibt an Endposition sichtbar
// ✅ calculateLayerPosition + FIXED visibility logic

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition } from '../config/parallaxConfig';
import { elementSizes } from '../../Parallax/config/constants';

const CloudLayer = React.memo(({
    scrollProgress,
    leftConfig,
    rightConfig,
    deviceConfig
}) => {
    // ===== LEFT CLOUD DATA (FIXED) =====
    const leftCloudData = useMemo(() => {
        if (!leftConfig?.active || !leftConfig?.movement) {
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, leftConfig);

        // ===== 🔧 FIXED SICHTBARKEITS-CHECK =====
        const { scrollStart } = leftConfig.movement;
        // ✅ VORHER: scrollProgress >= scrollStart && scrollProgress <= scrollEnd
        // ✅ NACHHER: Nur scrollStart prüfen - Layer bleibt IMMER sichtbar ab scrollStart
        const visible = scrollProgress >= scrollStart;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            scale: position.scale,
            visible,
            atEndPosition: scrollProgress > leftConfig.movement.scrollEnd
        };
    }, [scrollProgress, leftConfig]);

    // ===== RIGHT CLOUD DATA (FIXED) =====
    const rightCloudData = useMemo(() => {
        if (!rightConfig?.active || !rightConfig?.movement) {
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, rightConfig);

        // ===== 🔧 FIXED SICHTBARKEITS-CHECK =====
        const { scrollStart } = rightConfig.movement;
        // ✅ VORHER: scrollProgress >= scrollStart && scrollProgress <= scrollEnd
        // ✅ NACHHER: Nur scrollStart prüfen - Layer bleibt IMMER sichtbar ab scrollStart
        const visible = scrollProgress >= scrollStart;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            scale: position.scale,
            visible,
            atEndPosition: scrollProgress > rightConfig.movement.scrollEnd
        };
    }, [scrollProgress, rightConfig]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1.0;

    // ===== RESPONSIVE SIZES =====
    const responsiveSizes = useMemo(() => {
        const isMobile = deviceConfig?.isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);
        const breakpoint = isMobile ? 'xs' : 'lg';

        return {
            left: elementSizes?.cloud?.left?.[breakpoint] || { width: '35vw', maxWidth: '450px' },
            right: elementSizes?.cloud?.right?.[breakpoint] || { width: '30vw', maxWidth: '400px' }
        };
    }, [deviceConfig]);

    // Performance Debug (ERWEITERT)
    if (process.env.NODE_ENV === 'development' && (leftCloudData.visible || rightCloudData.visible)) {
        console.log('☁️ CloudLayer (Front) FIXED:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            leftCloud: leftCloudData.visible ? {
                opacity: leftCloudData.opacity.toFixed(2),
                translateY: leftCloudData.translateY.toFixed(1),
                scale: leftCloudData.scale.toFixed(2),
                atEnd: leftCloudData.atEndPosition
            } : 'hidden',
            rightCloud: rightCloudData.visible ? {
                opacity: rightCloudData.opacity.toFixed(2),
                translateY: rightCloudData.translateY.toFixed(1),
                scale: rightCloudData.scale.toFixed(2),
                atEnd: rightCloudData.atEndPosition
            } : 'hidden',
            source: 'calculateLayerPosition() + FIXED visibility'
        });
    }

    // Nicht rendern wenn beide Wolken unsichtbar
    if (!leftCloudData.visible && !rightCloudData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                className="cloud-layer"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: Math.max(leftConfig?.zIndex || 15, rightConfig?.zIndex || 15),
                    pointerEvents: 'none'
                }}
                data-layer="clouds-front-fixed"
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
            >
                {/* ===== LEFT CLOUD FRONT ===== */}
                {leftCloudData.visible && (
                    <div
                        className="left-cloud-front"
                        style={{
                            position: 'absolute',
                            bottom: leftConfig?.position?.bottom || '43%',
                            left: '5%',
                            transform: `translateX(${leftCloudData.translateY * multiplier}vw) scale(${leftCloudData.scale * multiplier})`,
                            opacity: leftCloudData.opacity,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                        data-cloud="left-front-fixed"
                        data-at-end={leftCloudData.atEndPosition}
                        data-opacity={leftCloudData.opacity.toFixed(2)}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Vorne_links.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Linke Wolke Vorne - Parallax"
                            style={{
                                width: responsiveSizes.left.width,
                                maxWidth: responsiveSizes.left.maxWidth,
                                height: 'auto',
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => console.warn('❌ CloudLayer: Left cloud image failed')}
                        />
                    </div>
                )}

                {/* ===== RIGHT CLOUD FRONT ===== */}
                {rightCloudData.visible && (
                    <div
                        className="right-cloud-front"
                        style={{
                            position: 'absolute',
                            bottom: rightConfig?.position?.bottom || '44%',
                            right: '0%',
                            transform: `translateX(${-rightCloudData.translateY * multiplier}vw) scale(${rightCloudData.scale * multiplier})`,
                            opacity: rightCloudData.opacity,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                        data-cloud="right-front-fixed"
                        data-at-end={rightCloudData.atEndPosition}
                        data-opacity={rightCloudData.opacity.toFixed(2)}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Vorne_rechts.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Rechte Wolke Vorne - Parallax"
                            style={{
                                width: responsiveSizes.right.width,
                                maxWidth: responsiveSizes.right.maxWidth,
                                height: 'auto',
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => console.warn('❌ CloudLayer: Right cloud image failed')}
                        />
                    </div>
                )}

                {/* ===== DEBUG INFO (FIXED VERSION) ===== */}
                {process.env.NODE_ENV === 'development' && (leftCloudData.visible || rightCloudData.visible) && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '270px',
                            left: '20px',
                            background: 'rgba(100, 149, 237, 0.9)',
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
                        ☁️ WOLKEN FRONT ✅ FIXED
                        <br />
                        Left: {leftCloudData.visible ? (leftCloudData.atEndPosition ? '🔒' : '🎬') : '❌'}
                        Right: {rightCloudData.visible ? (rightCloudData.atEndPosition ? '🔒' : '🎬') : '❌'}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

CloudLayer.displayName = 'CloudLayer';

export default CloudLayer;