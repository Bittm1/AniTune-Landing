// src/components/Enhanced/layers/WolkenHintenLayer.jsx
// ☁️ WOLKEN HINTEN LAYER - Mit Config-Integration für responsive Positionierung

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition, getResponsivePositioning } from '../config/parallaxConfig';
import { elementSizes } from '../../Parallax/config/constants';

const WolkenHintenLayer = React.memo(({
    scrollProgress,
    leftConfig,
    rightConfig,
    deviceConfig
}) => {
    // ===== DEVICE TYPE ERMITTELN =====
    const deviceType = useMemo(() => {
        if (deviceConfig?.deviceType) return deviceConfig.deviceType;
        if (deviceConfig?.isMobile) return 'mobile';
        if (typeof window !== 'undefined' && window.innerWidth >= 1440) return 'large';
        return 'desktop';
    }, [deviceConfig]);

    // ===== RESPONSIVE POSITIONING AUS CONFIG =====
    const leftPositioning = getResponsivePositioning('leftCloudHinten', deviceType);
    const rightPositioning = getResponsivePositioning('rightCloudHinten', deviceType);

    // ===== LEFT CLOUD DATA (FIXED) =====
    const leftCloudData = useMemo(() => {
        if (!leftConfig?.active || !leftConfig?.movement) {
            return { visible: false };
        }

        const position = calculateLayerPosition(scrollProgress, leftConfig);
        const { scrollStart } = leftConfig.movement;
        const visible = scrollProgress >= scrollStart;

        return {
            opacity: position.opacity,
            translateY: position.position,
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

        const position = calculateLayerPosition(scrollProgress, rightConfig);
        const { scrollStart } = rightConfig.movement;
        const visible = scrollProgress >= scrollStart;

        return {
            opacity: position.opacity,
            translateY: position.position,
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
            left: elementSizes?.cloud?.left?.[breakpoint] || { width: '30vw', maxWidth: '400px' },
            right: elementSizes?.cloud?.right?.[breakpoint] || { width: '25vw', maxWidth: '350px' }
        };
    }, [deviceConfig]);

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
            >
                {/* ===== LEFT CLOUD HINTEN ===== */}
                {leftCloudData.visible && (
                    <div
                        className="left-cloud-hinten"
                        style={{
                            position: 'absolute',
                            bottom: leftPositioning.bottom || '65%', // Config oder Fallback
                            left: '10%',
                            transform: `translateX(${leftCloudData.translateY * multiplier}vw) scale(${leftCloudData.scale * multiplier})`,
                            opacity: leftCloudData.opacity,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Hinten_links.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Linke Wolke Hinten - Parallax"
                            style={{
                                width: responsiveSizes.left.width,
                                maxWidth: responsiveSizes.left.maxWidth,
                                height: 'auto',
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => console.warn('❌ WolkenHintenLayer: Left cloud image failed')}
                        />
                    </div>
                )}

                {/* ===== RIGHT CLOUD HINTEN ===== */}
                {rightCloudData.visible && (
                    <div
                        className="right-cloud-hinten"
                        style={{
                            position: 'absolute',
                            bottom: rightPositioning.bottom || '65%', // Config oder Fallback
                            right: '10%',
                            transform: `translateX(${-rightCloudData.translateY * multiplier}vw) scale(${rightCloudData.scale * multiplier})`,
                            opacity: rightCloudData.opacity,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <SafeImage
                            src="/Parallax/Wolken_Hinten_rechts.png"
                            fallbackSrc="/Parallax/fallback-cloud.png"
                            alt="Rechte Wolke Hinten - Parallax"
                            style={{
                                width: responsiveSizes.right.width,
                                maxWidth: responsiveSizes.right.maxWidth,
                                height: 'auto',
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            onError={() => console.warn('❌ WolkenHintenLayer: Right cloud image failed')}
                        />
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

WolkenHintenLayer.displayName = 'WolkenHintenLayer';
export default WolkenHintenLayer;