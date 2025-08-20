// src/components/Enhanced/layers/CloudLayer.jsx
// ☁️ CLOUD LAYER (VORNE) - Mit Config-Integration für responsive Positionierung

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';
import { calculateLayerPosition, getResponsivePositioning } from '../config/parallaxConfig';
import { elementSizes } from '../../Parallax/config/constants';

const CloudLayer = React.memo(({
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
    const leftPositioning = getResponsivePositioning('leftCloud', deviceType);
    const rightPositioning = getResponsivePositioning('rightCloud', deviceType);

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
            left: elementSizes?.cloud?.left?.[breakpoint] || { width: '35vw', maxWidth: '450px' },
            right: elementSizes?.cloud?.right?.[breakpoint] || { width: '30vw', maxWidth: '400px' }
        };
    }, [deviceConfig]);

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
            >
                {/* ===== LEFT CLOUD FRONT ===== */}
                {leftCloudData.visible && (
                    <div
                        className="left-cloud-front"
                        style={{
                            position: 'absolute',
                            bottom: leftPositioning.bottom || '52%', // Config oder Fallback
                            left: '0%',
                            transform: `translateX(${leftCloudData.translateY * multiplier}vw) scale(${leftCloudData.scale * multiplier})`,
                            opacity: leftCloudData.opacity,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
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
                            bottom: rightPositioning.bottom || '44%', // Config oder Fallback
                            right: '-5%',
                            transform: `translateX(${-rightCloudData.translateY * multiplier}vw) scale(${rightCloudData.scale * multiplier})`,
                            opacity: rightCloudData.opacity,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d'
                        }}
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
            </div>
        </ErrorBoundary>
    );
});

CloudLayer.displayName = 'CloudLayer';
export default CloudLayer;