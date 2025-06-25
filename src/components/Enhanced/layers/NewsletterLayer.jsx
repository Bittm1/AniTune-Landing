// src/components/Enhanced/layers/NewsletterLayer.jsx
import React, { useMemo } from 'react';
import Newsletter from '../../Newsletter/Newsletter';

const NewsletterLayer = React.memo(({
    scrollProgress,
    position,
    config,
    deviceConfig = {}
}) => {
    const { multiplier = 1.0 } = deviceConfig;

    // ===== NEWSLETTER VISIBILITY CHECK (WIE LOGO) =====
    const layerData = useMemo(() => {
        if (!config?.active || !config?.movement) {
            return { opacity: 0, translateY: 0, visible: false };
        }

        const { scrollStart, scrollEnd, posStart, posEnd, opacityStart, opacityEnd } = config.movement;

        // Sichtbar zwischen 0% und 15% (wie Logo)
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;

        if (!visible) {
            return { opacity: 0, translateY: 0, visible: false };
        }

        // Progress innerhalb des Bereichs
        const localProgress = scrollEnd > scrollStart
            ? Math.max(0, Math.min(1, (scrollProgress - scrollStart) / (scrollEnd - scrollStart)))
            : 0;

        // Smooth fade/movement
        const opacity = opacityStart + (opacityEnd - opacityStart) * localProgress;
        const translateY = (posStart + (posEnd - posStart) * localProgress) * multiplier;

        return {
            opacity: Math.max(0, Math.min(1, opacity)),
            translateY,
            visible: true
        };
    }, [scrollProgress, config, multiplier]);

    // Nicht rendern wenn nicht sichtbar
    if (!layerData.visible) {
        return null;
    }

    // ===== CONTAINER STYLES =====
    const containerStyles = useMemo(() => ({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, calc(-50% + ${layerData.translateY}px))`,
        opacity: layerData.opacity,
        zIndex: config?.zIndex || 60,
        pointerEvents: layerData.opacity > 0.1 ? 'auto' : 'none',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
    }), [layerData.translateY, layerData.opacity, config?.zIndex]);

    return (
        <div style={containerStyles}>
            <Newsletter />
        </div>
    );
});

NewsletterLayer.displayName = 'NewsletterLayer';

export default NewsletterLayer;