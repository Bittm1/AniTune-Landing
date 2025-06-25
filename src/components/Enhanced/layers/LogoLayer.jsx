// src/components/Enhanced/layers/LogoLayer.jsx - CLEAN WITHOUT DEBUG

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';

// ===== ASSET PATH CORRECTION =====
const LOGO_ASSET = '/Parallax/Logo.svg'; // Changed to .svg based on logoConfig.js

const LogoLayer = ({ scrollProgress, position, config, deviceConfig }) => {
    // ===== ERROR HANDLING =====
    if (!config || !config.movement) {
        return null;
    }

    // ===== SIMPLIFIED LOGO CALCULATIONS =====
    const logoData = useMemo(() => {
        const progress = scrollProgress || 0;
        const { movement } = config;

        // Logo active from 0% to 15% (Snap 0 to Snap 1)
        const isActive = progress >= movement.scrollStart && progress <= movement.scrollEnd;

        if (!isActive) return { visible: false };

        // Calculate fade progress within range
        const fadeProgress = (progress - movement.scrollStart) / (movement.scrollEnd - movement.scrollStart);

        // Apply movement settings from parallaxConfig.js
        const opacity = movement.opacityStart + (movement.opacityEnd - movement.opacityStart) * fadeProgress;
        const scale = movement.scaleStart + (movement.scaleEnd - movement.scaleStart) * fadeProgress;

        return {
            visible: opacity > 0.01,
            opacity: Math.max(0, opacity),
            scale: Math.max(0.1, scale)
        };
    }, [scrollProgress, config]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1;

    // ===== LOGO STYLES =====
    const logoStyle = useMemo(() => {
        if (!logoData.visible) return null;

        return {
            position: 'fixed',
            top: '33%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${logoData.scale * multiplier})`,
            width: `${200 * multiplier}px`,
            height: `${200 * multiplier}px`,
            opacity: logoData.opacity,
            backgroundImage: `url(${LOGO_ASSET})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            zIndex: config.zIndex || 20,
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden',
            transition: 'opacity 300ms ease-out'
        };
    }, [logoData, multiplier, config.zIndex]);

    // ===== SIMPLE CONSOLE LOG FOR DEBUGGING =====
    if (process.env.NODE_ENV === 'development' && logoData.visible) {
        console.log('🏠 LogoLayer:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            opacity: logoData.opacity.toFixed(2),
            scale: logoData.scale.toFixed(2),
            asset: LOGO_ASSET
        });
    }

    return (
        <ErrorBoundary>
            {logoStyle && (
                <div
                    style={logoStyle}
                    data-logo-layer="enhanced"
                    data-testid="enhanced-logo"
                />
            )}
        </ErrorBoundary>
    );
};

export default React.memo(LogoLayer);