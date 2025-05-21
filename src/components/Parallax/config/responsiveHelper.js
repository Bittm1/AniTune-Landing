// src/components/Parallax/config/responsiveHelper.js
import { desktopConfig } from './desktopConfig';
import { mobileConfig } from './mobileConfig';
import { breakpoints, elementSizes, assetPaths } from './constants';


/**
 * Erweiterte Funktion zur Auswahl der Konfiguration mit Unterstützung für verschiedene Breiten
 * Optimiert für bessere Performance und Wartbarkeit
 */
export const getResponsiveConfig = () => {
    // Cache für die berechnete Konfiguration
    const configCache = {
        lastWidth: null,
        config: null
    };

    // Wenn wir im Server-Side Rendering sind, geben wir die Desktop-Konfiguration zurück
    if (typeof window === 'undefined') {
        return {
            ...desktopConfig,
            imageSources: {
                background: assetPaths.background.default,
                forest: assetPaths.forest.default,
                leftCloud: assetPaths.leftCloud.default,
                rightCloud: assetPaths.rightCloud.default,
                logo: assetPaths.logo.default
            }
        };
    }

    // Aktuelle Viewport-Breite
    const width = window.innerWidth;

    // Wenn die Breite gleich ist wie beim letzten Aufruf, verwenden wir den Cache
    if (configCache.lastWidth === width && configCache.config) {
        return configCache.config;
    }

    // Für die Bildpfade immer die sicheren Standardwerte verwenden
    const baseImageSources = {
        background: assetPaths.background.default,
        forest: assetPaths.forest.default,
        leftCloud: assetPaths.leftCloud.default,
        rightCloud: assetPaths.rightCloud.default,
        logo: assetPaths.logo.default
    };

    // Konfiguration basierend auf Viewport-Breite festlegen
    let config;

    // Sehr klein (Smartphones)
    if (width < breakpoints.xs) {
        config = {
            ...mobileConfig,
            logo: {
                ...mobileConfig.logo,
                size: elementSizes.logo.xs
            },
            imageSources: baseImageSources
        };
    }
    // Klein (große Smartphones / kleine Tablets)
    else if (width < breakpoints.sm) {
        config = {
            ...mobileConfig,
            imageSources: baseImageSources
        };
    }
    // Mittel (Tablets)
    else if (width < breakpoints.md) {
        config = {
            ...desktopConfig,
            logo: {
                ...desktopConfig.logo,
                size: elementSizes.logo.md
            },
            // Leicht angepasste Positionen für Tablets
            leftCloud: {
                ...desktopConfig.leftCloud,
                position: {
                    ...desktopConfig.leftCloud.position,
                    bottom: '54%'
                },
                size: elementSizes.cloud.left.md
            },
            rightCloud: {
                ...desktopConfig.rightCloud,
                position: {
                    ...desktopConfig.rightCloud.position,
                    bottom: '54%'
                },
                size: elementSizes.cloud.right.md
            },
            imageSources: baseImageSources
        };
    }
    // Desktop (Standard)
    else if (width < breakpoints.xl) {
        config = {
            ...desktopConfig,
            imageSources: baseImageSources
        };
    }
    // Große Bildschirme (1920px und mehr)
    else {
        config = {
            ...desktopConfig,
            // Hier können Sie spezielle Anpassungen für große Bildschirme vornehmen
            background: {
                ...desktopConfig.background,
                startScale: 4.5, // Größerer Zoom-Effekt für große Displays
                endScale: 1.0
            },
            logo: {
                ...desktopConfig.logo,
                size: elementSizes.logo.xl, // Größeres Logo für große Displays
            },
            // Angepasste Größen für große Bildschirme
            leftCloud: {
                ...desktopConfig.leftCloud,
                size: elementSizes.cloud.left.xl
            },
            rightCloud: {
                ...desktopConfig.rightCloud,
                size: elementSizes.cloud.right.xl
            },
            // Hochauflösende Ressourcen für große Bildschirme
            imageSources: {
                ...baseImageSources,
                background: assetPaths.background.large // Hochauflösender Hintergrund für große Bildschirme
            }
        };
    }

    // Konfiguration zwischenspeichern
    configCache.lastWidth = width;
    configCache.config = config;

    return config;
};

// Für Performance-Optimierung: Debounced Version der getResponsiveConfig-Funktion
// die bei häufigen Aufrufen (z.B. Resize) nur alle 100ms tatsächlich berechnet wird
export const getDebouncedResponsiveConfig = () => {
    let timeout = null;
    let cachedConfig = null;

    return () => {
        // Wenn wir bereits eine Konfiguration haben, geben wir diese zurück
        if (cachedConfig) {
            return cachedConfig;
        }

        // Aktuelle Konfiguration berechnen
        cachedConfig = getResponsiveConfig();

        // Timeout setzen, um den Cache nach 100ms zu leeren
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cachedConfig = null;
        }, 100);

        return cachedConfig;
    };
};