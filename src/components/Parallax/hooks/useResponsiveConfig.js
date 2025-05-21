// src/components/Parallax/hooks/useResponsiveConfig.js
import { useState, useEffect } from 'react';
import { getConfig } from '../config';

export function useResponsiveConfig() {
    const [config, setConfig] = useState(() => {
        try {
            return getConfig();
        } catch (error) {
            console.error('Failed to load configuration:', error);
            return {
                // Detailliertere Fallback-Konfiguration für höhere Zuverlässigkeit
                background: { startScale: 1.5, endScale: 1.0 },
                logo: {
                    segments: [{ scrollStart: 0, scrollEnd: 1, scaleStart: 1, scaleEnd: 1 }],
                    position: { top: '33%', left: '50%' },
                    size: '200px'
                },
                leftCloud: { segments: [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }] },
                rightCloud: { segments: [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }] },
                titles: []
            };
        }
    });

    useEffect(() => {
        // Speichere aktuelle Fensterbreite, um unnötige Updates zu vermeiden
        let currentWidth = window.innerWidth;

        const handleResize = () => {
            // Nur aktualisieren, wenn sich die Breakpoint-Kategorie ändert
            const newWidth = window.innerWidth;
            const breakpointChanged =
                (currentWidth < 480 && newWidth >= 480) ||
                (currentWidth >= 480 && currentWidth < 768 && (newWidth < 480 || newWidth >= 768)) ||
                (currentWidth >= 768 && currentWidth < 1024 && (newWidth < 768 || newWidth >= 1024)) ||
                (currentWidth >= 1024 && currentWidth < 1920 && (newWidth < 1024 || newWidth >= 1920)) ||
                (currentWidth >= 1920 && newWidth < 1920);

            if (breakpointChanged) {
                const newConfig = getConfig();
                setConfig(newConfig);
                currentWidth = newWidth;
            }
        };

        let resizeTimeout;
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        };

        window.addEventListener('resize', debouncedResize);

        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return config;
}