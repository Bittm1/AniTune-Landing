// src/components/Enhanced/layers/WolkenHintenLayer.jsx
// ☁️ WOLKEN HINTEN LAYER - Mit zentraler calculateLayerPosition (2 Configs)
// ✅ Mit responsive Größen aus constants

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition } from '../config/parallaxConfig';
import { elementSizes } from '../../Parallax/config/constants'; // ✅ NEU: Import constants

const WolkenHintenLayer = React.memo(({
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

    // ✅ NEU: RESPONSIVE SIZES aus constants (gleiche wie vordere Wolken)
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
        console.log('☁️ WolkenHintenLayer Active:', {
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
                className="wolken-hinten-layer"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: Math.max(leftConfig?.zIndex || 12, rightConfig?.zIndex || 12),
                    pointerEvents: 'none'
                }}
                data-layer="wolken-hinten"
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
            >
                {/* ===== LEFT CLOUD HINTEN ===== */}
                {leftCloudData.visible && (
                    <div
                        className="left-cloud-hinten"
                        style={{
                            position: 'absolute',
                            bottom: leftConfig?.position?.bottom || '65%',
                            left: '10%',
                            transform: `translateX(${leftCloudData.translateY * multiplier}vw) scale(${leftCloudData.scale * multiplier})`,
                            opacity: leftCloudData.opacity,
                            // Performance optimizations
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                        data-cloud="left-hinten"
                        data-opacity={leftCloudData.opacity.toFixed(2)}
                        data-scale={leftCloudData.scale.toFixed(2)}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Hinten_links.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Linke Wolke Hinten - Parallax"
                            style={{
                                width: responsiveSizes.left.width,        // ✅ GEÄNDERT: Responsive width
                                maxWidth: responsiveSizes.left.maxWidth,  // ✅ GEÄNDERT: Responsive maxWidth
                                height: 'auto',                          // ✅ GEÄNDERT: Auto height für Proportionen
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => {
                                if (process.env.NODE_ENV === 'development') {
                                    console.warn('🚨 WolkenHintenLayer: Left cloud image failed to load');
                                }
                            }}
                        />
                    </div>
                )}

                {/* ===== RIGHT CLOUD HINTEN ===== */}
                {rightCloudData.visible && (
                    <div
                        className="right-cloud-hinten"
                        style={{
                            position: 'absolute',
                            bottom: rightConfig?.position?.bottom || '65%',
                            right: '10%',
                            transform: `translateX(${-rightCloudData.translateY * multiplier}vw) scale(${rightCloudData.scale * multiplier})`,
                            opacity: rightCloudData.opacity,
                            // Performance optimizations
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                        data-cloud="right-hinten"
                        data-opacity={rightCloudData.opacity.toFixed(2)}
                        data-scale={rightCloudData.scale.toFixed(2)}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Hinten_rechts.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Rechte Wolke Hinten - Parallax"
                            style={{
                                width: responsiveSizes.right.width,        // ✅ GEÄNDERT: Responsive width
                                maxWidth: responsiveSizes.right.maxWidth,  // ✅ GEÄNDERT: Responsive maxWidth
                                height: 'auto',                           // ✅ GEÄNDERT: Auto height für Proportionen
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => {
                                if (process.env.NODE_ENV === 'development') {
                                    console.warn('🚨 WolkenHintenLayer: Right cloud image failed to load');
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

WolkenHintenLayer.displayName = 'WolkenHintenLayer';

export default WolkenHintenLayer;