// src/components/Parallax/config/logoConfig.js
// 🎨 ZENTRALE LOGO-KONFIGURATION für alle Phasen

import { zIndices } from './constants/index';

/**
 * 🎨 ZENTRALE LOGO-KONFIGURATIONEN
 * Verwaltet alle Logo-Phasen an einem Ort
 */
export const LOGO_PHASES = {
    // ✅ Phase 0: Standard Logo (0%-10% scroll)
    phase0: {
        enabled: true,
        scrollRange: {
            start: 0,
            end: 0.1, // 10% scroll
            fadeOutThreshold: 0.1
        },
        position: {
            top: '33%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        },
        animation: {
            scaleStart: 1.2,
            scaleEnd: 0.8,
            opacityStart: 1,
            opacityEnd: 0.9,
            transition: 'opacity 800ms ease-out'
        },
        style: {
            width: '200px', // Von elementSizes.logo.lg
            height: '200px',
            zIndex: zIndices.logo,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden'
        },
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                scaleStart: 1.2,
                scaleEnd: 0.8,
                opacityStart: 1,
                opacityEnd: 0.9
            }
        ]
    },

    // ✅ Phase 4: Theme Logo (100%-160% scroll)
    phase4: {
        enabled: true,
        scrollRange: {
            start: 1.0,   // 100% scroll (40% Debug)
            end: 1.6,     // 160% scroll (64% Debug)
            fadeInThreshold: 1.0
        },
        position: {
            top: '60.2%',
            left: '49.85%',
            transform: 'translate(-50%, -50%)'
        },
        animation: {
            scaleStart: 0.65,
            scaleEnd: 0.65,   // Konstante Größe
            opacityStart: 0,
            opacityEnd: 1.0,
            transition: 'all 0.2s ease-in-out'
        },
        style: {
            width: '300px',
            height: '300px',
            zIndex: 1000, // Höher als Phase 0
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
            willChange: 'opacity, transform',
            backfaceVisibility: 'hidden'
        },
        segments: [
            {
                scrollStart: 1.0,
                scrollEnd: 1.6,
                scaleStart: 0.65,
                scaleEnd: 0.65,
                opacityStart: 0,
                opacityEnd: 1.0
            }
        ]
    }
};

/**
 * 🎨 LOGO-ASSET KONFIGURATION
 */
export const LOGO_ASSETS = {
    default: '/Parallax/Logo.png',
    svg: '/Parallax/Logo.svg',
    fallback: '/Parallax/fallback-logo.png'
};

/**
 * 🎯 PHASE-ERKENNUNG für Logo
 * @param {number} scrollProgress - Scroll-Fortschritt (0-3.0)
 * @returns {string|null} - Phase-Name oder null
 */
export const getActiveLogoPhase = (scrollProgress) => {
    // Phase 0: 0%-10%
    if (scrollProgress >= LOGO_PHASES.phase0.scrollRange.start &&
        scrollProgress <= LOGO_PHASES.phase0.scrollRange.end) {
        return 'phase0';
    }

    // Phase 4: 100%-160%
    if (scrollProgress >= LOGO_PHASES.phase4.scrollRange.start &&
        scrollProgress <= LOGO_PHASES.phase4.scrollRange.end) {
        return 'phase4';
    }

    return null; // Keine Logo-Phase aktiv
};

/**
 * 🎨 LOGO-KONFIGURATION für spezifische Phase
 * @param {string} phase - Phase-Name ('phase0' oder 'phase4')
 * @returns {Object|null} - Logo-Konfiguration oder null
 */
export const getLogoConfigForPhase = (phase) => {
    if (!LOGO_PHASES[phase] || !LOGO_PHASES[phase].enabled) {
        return null;
    }

    return LOGO_PHASES[phase];
};

/**
 * 🎨 BERECHNE LOGO-OPACITY für aktuelle Scroll-Position
 * @param {string} phase - Phase-Name
 * @param {number} scrollProgress - Scroll-Fortschritt
 * @returns {number} - Opacity-Wert (0-1)
 */
export const calculateLogoOpacity = (phase, scrollProgress) => {
    const config = getLogoConfigForPhase(phase);
    if (!config) return 0;

    const { scrollRange, animation } = config;

    if (phase === 'phase0') {
        // Phase 0: Fade out bei 10% scroll
        if (scrollProgress <= scrollRange.start) return animation.opacityStart;
        if (scrollProgress >= scrollRange.fadeOutThreshold) return 0;

        // Linear fade out
        const fadeProgress = (scrollProgress - scrollRange.start) /
            (scrollRange.fadeOutThreshold - scrollRange.start);
        return animation.opacityStart * (1 - fadeProgress);
    }

    if (phase === 'phase4') {
        // Phase 4: Fade in ab 100% scroll
        if (scrollProgress < scrollRange.fadeInThreshold) return 0;
        if (scrollProgress >= scrollRange.end) return animation.opacityEnd;

        // Linear fade in
        const fadeProgress = (scrollProgress - scrollRange.fadeInThreshold) /
            (scrollRange.end - scrollRange.fadeInThreshold);
        return animation.opacityStart + (animation.opacityEnd - animation.opacityStart) * fadeProgress;
    }

    return 0;
};

/**
 * 🎨 BERECHNE LOGO-SCALE für aktuelle Scroll-Position
 * @param {string} phase - Phase-Name
 * @param {number} scrollProgress - Scroll-Fortschritt
 * @returns {number} - Scale-Wert
 */
export const calculateLogoScale = (phase, scrollProgress) => {
    const config = getLogoConfigForPhase(phase);
    if (!config) return 1;

    const { scrollRange, animation } = config;

    if (phase === 'phase0') {
        // Phase 0: Scale animation während scroll
        if (scrollProgress <= scrollRange.start) return animation.scaleStart;
        if (scrollProgress >= scrollRange.end) return animation.scaleEnd;

        // Linear scale transition
        const scaleProgress = (scrollProgress - scrollRange.start) /
            (scrollRange.end - scrollRange.start);
        return animation.scaleStart + (animation.scaleEnd - animation.scaleStart) * scaleProgress;
    }

    if (phase === 'phase4') {
        // Phase 4: Konstante Scale
        return animation.scaleStart;
    }

    return 1;
};

/**
 * 🎨 GENERIERE KOMPLETTES STYLE-OBJEKT für Logo-Phase
 * @param {string} phase - Phase-Name
 * @param {number} scrollProgress - Scroll-Fortschritt
 * @param {string} imageSrc - Bild-URL
 * @returns {Object} - Komplettes Style-Objekt
 */
export const generateLogoStyle = (phase, scrollProgress, imageSrc = LOGO_ASSETS.default) => {
    const config = getLogoConfigForPhase(phase);
    if (!config) return { display: 'none' };

    const opacity = calculateLogoOpacity(phase, scrollProgress);
    const scale = calculateLogoScale(phase, scrollProgress);

    return {
        position: 'fixed',
        top: config.position.top,
        left: config.position.left,
        transform: `${config.position.transform} scale(${scale})`,
        width: config.style.width,
        height: config.style.height,
        zIndex: config.style.zIndex,
        opacity: opacity,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: config.style.backgroundSize,
        backgroundPosition: config.style.backgroundPosition,
        backgroundRepeat: config.style.backgroundRepeat,
        pointerEvents: config.style.pointerEvents,
        transition: config.animation.transition,
        filter: config.style.filter || 'none',
        willChange: config.style.willChange,
        backfaceVisibility: config.style.backfaceVisibility
    };
};

/**
 * 🔍 DEBUG-INFORMATIONEN für Logo-System
 * @param {number} scrollProgress - Scroll-Fortschritt
 * @returns {Object} - Debug-Informationen
 */
export const getLogoDebugInfo = (scrollProgress) => {
    const activePhase = getActiveLogoPhase(scrollProgress);
    const debugInfo = {
        scrollProgress: scrollProgress.toFixed(3),
        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
        activePhase: activePhase || 'none',
        phases: {}
    };

    // Informationen für alle Phasen
    Object.keys(LOGO_PHASES).forEach(phase => {
        const config = LOGO_PHASES[phase];
        const opacity = calculateLogoOpacity(phase, scrollProgress);
        const scale = calculateLogoScale(phase, scrollProgress);

        debugInfo.phases[phase] = {
            enabled: config.enabled,
            range: `${(config.scrollRange.start * 100).toFixed(0)}%-${(config.scrollRange.end * 100).toFixed(0)}%`,
            opacity: opacity.toFixed(3),
            scale: scale.toFixed(3),
            visible: opacity > 0.01,
            active: activePhase === phase
        };
    });

    return debugInfo;
};

/**
 * 🎨 LOGO-KONFIGURATION für DESKTOP-CONFIG
 * Ersetzt die alte logo-Konfiguration in desktopConfig.js
 */
export const getDesktopLogoConfig = () => {
    const phase0Config = getLogoConfigForPhase('phase0');

    return {
        segments: phase0Config.segments,
        position: phase0Config.position,
        size: phase0Config.style.width, // Kompatibilität mit alter API
        spring: { mass: 0.8, tension: 120, friction: 26 }, // Aus original springs.smooth
        zIndex: phase0Config.style.zIndex,
        imageSrc: LOGO_ASSETS.default
    };
};

/**
 * 🎨 VALIDIERUNG der Logo-Konfiguration
 * @returns {Array} - Array von Warnungen/Fehlern
 */
export const validateLogoConfig = () => {
    const warnings = [];

    Object.keys(LOGO_PHASES).forEach(phase => {
        const config = LOGO_PHASES[phase];

        // Prüfe erforderliche Eigenschaften
        if (!config.scrollRange) {
            warnings.push(`❌ ${phase}: Keine scrollRange definiert`);
        }

        if (!config.position) {
            warnings.push(`❌ ${phase}: Keine Position definiert`);
        }

        if (!config.style) {
            warnings.push(`❌ ${phase}: Keine Style-Eigenschaften definiert`);
        }

        // Prüfe Scroll-Range Konsistenz
        if (config.scrollRange && config.scrollRange.start >= config.scrollRange.end) {
            warnings.push(`⚠️ ${phase}: scrollRange.start >= scrollRange.end`);
        }
    });

    return warnings;
};

/**
 * 🎨 STANDARD-EXPORT
 */
export default {
    LOGO_PHASES,
    LOGO_ASSETS,
    getActiveLogoPhase,
    getLogoConfigForPhase,
    calculateLogoOpacity,
    calculateLogoScale,
    generateLogoStyle,
    getLogoDebugInfo,
    getDesktopLogoConfig,
    validateLogoConfig
};