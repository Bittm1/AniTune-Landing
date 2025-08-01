// src/components/Enhanced/layers/CloudLayer.jsx
// ☁️ CLOUD LAYER - Mit zentraler calculateLayerPosition (2 Configs)
// ✅ NUR TRANSFORM GEÄNDERT: Von vertikal zu horizontal + responsive Größen

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition } from '../config/parallaxConfig';
import { elementSizes } from '../../Parallax/config/constants'; // ✅ NEU: Import constants

const CloudLayer = React.memo(({
    scrollProgress,
    leftConfig,
    rightConfig,
    deviceConfig
}) => {
    // ===== LEFT CLOUD DATA (unverändert) =====
    const leftCloudData = useMemo(() => {
        if (!leftConfig?.active || !leftConfig?.movement) {
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, leftConfig);

        // Sichtbarkeits-Check
        const { scrollStart, scrollEnd } = leftConfig.movement;
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            scale: position.scale,
            visible
        };
    }, [scrollProgress, leftConfig]);

    // ===== RIGHT CLOUD DATA (unverändert) =====
    const rightCloudData = useMemo(() => {
        if (!rightConfig?.active || !rightConfig?.movement) {
            return { visible: false };
        }

        // ✅ Nutzt zentrale Funktion
        const position = calculateLayerPosition(scrollProgress, rightConfig);

        // Sichtbarkeits-Check
        const { scrollStart, scrollEnd } = rightConfig.movement;
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;

        return {
            opacity: position.opacity,
            translateY: position.position, // position = translateY
            scale: position.scale,
            visible
        };
    }, [scrollProgress, rightConfig]);

    // ===== RESPONSIVE MULTIPLIER (unverändert) =====
    const multiplier = deviceConfig?.multiplier || 1.0;

    // ✅ NEU: RESPONSIVE SIZES aus constants
    const responsiveSizes = useMemo(() => {
        const isMobile = deviceConfig?.isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);

        // Bestimme Breakpoint
        const breakpoint = isMobile ? 'xs' : 'lg';

        return {
            left: elementSizes.cloud.left[breakpoint] || elementSizes.cloud.left.lg,
            right: elementSizes.cloud.right[breakpoint] || elementSizes.cloud.right.lg
        };
    }, [deviceConfig]);

    // Performance Debug (Development only)
    if (process.env.NODE_ENV === 'development' && (leftCloudData.visible || rightCloudData.visible)) {
        console.log('☁️ CloudLayer (Front) Active:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            leftCloud: leftCloudData.visible ? {
                opacity: leftCloudData.opacity.toFixed(2),
                translateY: leftCloudData.translateY.toFixed(1),
                scale: leftCloudData.scale.toFixed(2)
            } : 'hidden',
            rightCloud: rightCloudData.visible ? {
                opacity: rightCloudData.opacity.toFixed(2),
                translateY: rightCloudData.translateY.toFixed(1),
                scale: rightCloudData.scale.toFixed(2)
            } : 'hidden',
            responsiveSizes, // ✅ NEU: Debug responsive sizes
            source: 'calculateLayerPosition()'
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
                data-layer="clouds-front"
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
                            // Performance optimizations
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                        data-cloud="left-front"
                        data-opacity={leftCloudData.opacity.toFixed(2)}
                        data-scale={leftCloudData.scale.toFixed(2)}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Vorne_links.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Linke Wolke Vorne - Parallax"
                            style={{
                                width: responsiveSizes.left.width,        // ✅ GEÄNDERT: Responsive width
                                maxWidth: responsiveSizes.left.maxWidth,  // ✅ GEÄNDERT: Responsive maxWidth
                                height: 'auto',                          // ✅ GEÄNDERT: Auto height für Proportionen
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => {
                                if (process.env.NODE_ENV === 'development') {
                                    console.warn('🚨 CloudLayer: Left cloud image failed to load');
                                }
                            }}
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
                            right: '5%',
                            transform: `translateX(${-rightCloudData.translateY * multiplier}vw) scale(${rightCloudData.scale * multiplier})`,
                            opacity: rightCloudData.opacity,
                            // Performance optimizations
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                        data-cloud="right-front"
                        data-opacity={rightCloudData.opacity.toFixed(2)}
                        data-scale={rightCloudData.scale.toFixed(2)}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Vorne_rechts.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Rechte Wolke Vorne - Parallax"
                            style={{
                                width: responsiveSizes.right.width,        // ✅ GEÄNDERT: Responsive width
                                maxWidth: responsiveSizes.right.maxWidth,  // ✅ GEÄNDERT: Responsive maxWidth
                                height: 'auto',                           // ✅ GEÄNDERT: Auto height für Proportionen
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => {
                                if (process.env.NODE_ENV === 'development') {
                                    console.warn('🚨 CloudLayer: Right cloud image failed to load');
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

CloudLayer.displayName = 'CloudLayer';

export default CloudLayer;