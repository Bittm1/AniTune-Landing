// src/components/Parallax/config/index.js
import { desktopConfig } from './desktopConfig';
import { mobileConfig } from './mobileConfig';
import { getResponsiveConfig, getDebouncedResponsiveConfig } from './responsiveHelper';
import { zIndices, breakpoints, elementSizes, assetPaths, animationTiming } from './constants';
import { baseAnimationConfig, springs, createTitles } from './baseConfig';
// ✅ NEU: Export der zentralen Logo-Konfiguration
import logoConfig from './logoConfig';

// Exportiere die Basis-Konfigurationen
export {
    // Konfigurationen
    desktopConfig,
    mobileConfig,

    // ✅ NEU: Logo-Konfiguration
    logoConfig,

    // Konstanten
    zIndices,
    breakpoints,
    elementSizes,
    assetPaths,
    animationTiming,

    // Basis-Hilfsfunktionen
    baseAnimationConfig,
    springs,
    createTitles
};

// Exportiere die Hilfsfunktionen für responsive Anpassungen
export const getConfig = getResponsiveConfig;
export const getDebouncedConfig = getDebouncedResponsiveConfig();

// Für optimierte Leistung: React.useMemo-kompatible getConfig-Version
export const getMemoizedConfig = (width) => {
    // Wenn keine Breite angegeben ist und wir im Browser sind, verwende window.innerWidth
    const effectiveWidth = width || (typeof window !== 'undefined' ? window.innerWidth : null);

    // Wenn wir keine Breite haben, verwende die Standard-Desktop-Konfiguration
    if (!effectiveWidth) {
        return desktopConfig;
    }

    // Erkennung des Viewport-Typs basierend auf Breite
    if (effectiveWidth < breakpoints.xs) {
        return 'xs';
    } else if (effectiveWidth < breakpoints.sm) {
        return 'sm';
    } else if (effectiveWidth < breakpoints.md) {
        return 'md';
    } else if (effectiveWidth < breakpoints.xl) {
        return 'lg';
    } else {
        return 'xl';
    }
};

// Einfache API für Performance-Optimierung bei der Bildauswahl
export const getOptimizedImageSource = (type, viewportSize) => {
    if (!assetPaths[type]) {
        console.warn(`Bildtyp '${type}' existiert nicht in assetPaths.`);
        return null;
    }

    // Für große Bildschirme hochauflösende Bilder verwenden
    if (viewportSize === 'xl' && assetPaths[type].large) {
        return assetPaths[type].large;
    }

    return assetPaths[type].default;
};

// Hilfsfunktion zur Ermittlung der optimalen Elementgröße
export const getElementSize = (element, viewportSize) => {
    if (!elementSizes[element]) {
        console.warn(`Element '${element}' existiert nicht in elementSizes.`);
        return null;
    }

    return elementSizes[element][viewportSize] || elementSizes[element].lg;
};

// ✅ NEU: Logo-spezifische Hilfsfunktionen re-exportieren
export {
    getActiveLogoPhase,
    generateLogoStyle,
    getLogoDebugInfo,
    validateLogoConfig,
    LOGO_PHASES,
    LOGO_ASSETS
} from './logoConfig';