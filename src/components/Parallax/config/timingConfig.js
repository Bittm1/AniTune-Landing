// src/components/Parallax/config/timingConfig.js - SYNC FIX für Phase 6

/**
 * 🎛️ SYNCHRONISIERTE TIMING-KONFIGURATION FÜR PHASE 6
 * ✅ Phase 6: 64%-80% Debug (1.6-2.0 scrollProgress) - SYNC mit phaseUtils.js
 */

// ===== SCROLL-SEGMENT-PRESETS =====
export const SCROLL_SEGMENT_PRESETS = {
    // ⚡ SCHNELLE ÜBERGÄNGE - SYNC FIX für Phase 6
    fast_segments: {
        name: 'Fast Segments - Phase 6 Sync Fix',
        description: 'Alle 7 Phasen mit synchronisierter Phase 6 (64%-80%)',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.05,
                snapTarget: 0,         // 0% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 1: Von Uns Heißt Für Uns - bis 16% Debug (0.4 scrollProgress)
            {
                scrollStart: 0.05,
                scrollEnd: 0.4,
                snapTarget: 0.4,       // 40% = 16% Debug
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 2: Der Weg Ist Das Ziel - bis 32% Debug (0.8 scrollProgress)
            {
                scrollStart: 0.4,
                scrollEnd: 0.8,
                snapTarget: 0.8,       // 80% = 32% Debug
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 3: Die Community Heißt - bis 40% Debug (1.0 scrollProgress)
            {
                scrollStart: 0.8,
                scrollEnd: 1.0,
                snapTarget: 1.0,       // 100% = 40% Debug
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 4: Noch zu definieren - bis 48% Debug (1.2 scrollProgress)
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.2,       // 120% = 48% Debug
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 5: AniTune Carousel - bis 64% Debug (1.6 scrollProgress)
            {
                scrollStart: 1.2,
                scrollEnd: 1.6,        // ✅ GEÄNDERT: 1.5 → 1.6 (SYNC)
                snapTarget: 1.4,       // ✅ GEÄNDERT: 1.35 → 1.4 (Mitte)
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 6: Newsletter CTA - 64%-80% Debug (1.6-2.0 scrollProgress) - SYNC FIX
            {
                scrollStart: 1.6,      // ✅ SYNC: Jetzt wie phaseUtils.js
                scrollEnd: 2.0,        // ✅ SYNC: Jetzt wie phaseUtils.js
                snapTarget: 1.8,       // ✅ GEÄNDERT: 1.65 → 1.8 (80% des Bereichs)
                snapDuration: 0.8,
                snapEase: "power3.out"
            }
        ]
    },

    // ⚖️ AUSGEWOGENE BEREICHE (Standard) - SYNC FIX für Phase 6
    balanced_segments: {
        name: 'Balanced Segments - Phase 6 Sync Fix',
        description: '7 Phasen mit synchronisierter Phase 6 (64%-80%)',

        segments: [
            // Phase 0: Logo/Newsletter (0% Debug)
            {
                scrollStart: 0,
                scrollEnd: 0.05,
                snapTarget: 0,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // ✅ Phase 1: Von Uns Heißt Für Uns - bis 16% Debug (0.4 scrollProgress)
            {
                scrollStart: 0.05,
                scrollEnd: 0.4,
                snapTarget: 0.4,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // ✅ Phase 2: Der Weg Ist Das Ziel - bis 32% Debug (0.8 scrollProgress)  
            {
                scrollStart: 0.4,
                scrollEnd: 0.8,
                snapTarget: 0.8,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // ✅ Phase 3: Die Community Heißt - bis 40% Debug (1.0 scrollProgress)
            {
                scrollStart: 0.8,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // ✅ Phase 4: Noch zu definieren - bis 48% Debug (1.2 scrollProgress)
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.2,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // Phase 5: AniTune Carousel - bis 64% Debug (1.6 scrollProgress) - SYNC FIX
            {
                scrollStart: 1.2,
                scrollEnd: 1.6,        // ✅ SYNC: 1.5 → 1.6
                snapTarget: 1.4,       // ✅ SYNC: 1.35 → 1.4
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // Phase 6: Newsletter CTA - 64%-80% Debug (1.6-2.0) - HAUPTFIX
            {
                scrollStart: 1.6,      // ✅ SYNC: Jetzt identisch mit phaseUtils.js
                scrollEnd: 2.0,        // ✅ SYNC: Jetzt identisch mit phaseUtils.js  
                snapTarget: 1.8,       // ✅ OPTIMIERT: 80% des Bereichs für vollständige Sichtbarkeit
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },

            // Rest bleibt für Erweiterungen...
            { scrollStart: 2.0, scrollEnd: 2.2, snapTarget: 2.1, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 2.2, scrollEnd: 2.4, snapTarget: 2.3, snapDuration: 1.2, snapEase: "power2.inOut" }
        ]
    },

    // 🎬 LANGE BEREICHE (Cinematisch) - SYNC FIX für Phase 6
    cinematic_segments: {
        name: 'Cinematic Segments - Phase 6 Sync Fix',
        description: 'Alle 7 Phasen mit synchronisierter Phase 6 und längeren Animationen',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.05,
                snapTarget: 0,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 1: Von Uns Heißt Für Uns - bis 16% Debug
            {
                scrollStart: 0.05,
                scrollEnd: 0.4,
                snapTarget: 0.4,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 2: Der Weg Ist Das Ziel - bis 32% Debug
            {
                scrollStart: 0.4,
                scrollEnd: 0.8,
                snapTarget: 0.8,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 3: Die Community Heißt - bis 40% Debug
            {
                scrollStart: 0.8,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 4: Noch zu definieren - bis 48% Debug
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.2,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 5: AniTune Carousel - SYNC FIX
            {
                scrollStart: 1.2,
                scrollEnd: 1.6,        // ✅ SYNC
                snapTarget: 1.4,       // ✅ SYNC
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 6: Newsletter CTA - HAUPTFIX
            {
                scrollStart: 1.6,      // ✅ SYNC mit phaseUtils.js
                scrollEnd: 2.0,        // ✅ SYNC mit phaseUtils.js
                snapTarget: 1.8,       // ✅ OPTIMIERT für bessere Sichtbarkeit
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            }
        ]
    },

    // 🎯 CUSTOM (Zum Experimentieren) - SYNC FIX für Phase 6
    custom_segments: {
        name: 'Custom Segments - Phase 6 Sync Fix',
        description: 'Alle 7 Phasen mit synchronisierter Phase 6 und anpassbaren Parametern',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.05,
                snapTarget: 0,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 1: Von Uns Heißt Für Uns - bis 16% Debug
            {
                scrollStart: 0.05,
                scrollEnd: 0.4,
                snapTarget: 0.4,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 2: Der Weg Ist Das Ziel - bis 32% Debug
            {
                scrollStart: 0.4,
                scrollEnd: 0.8,
                snapTarget: 0.8,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 3: Die Community Heißt - bis 40% Debug
            {
                scrollStart: 0.8,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 4: Noch zu definieren - bis 48% Debug
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.2,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 5: AniTune Carousel - SYNC FIX
            {
                scrollStart: 1.2,
                scrollEnd: 1.6,        // ✅ SYNC
                snapTarget: 1.4,       // ✅ SYNC
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 6: Newsletter CTA - HAUPTFIX
            {
                scrollStart: 1.6,      // ✅ SYNC mit phaseUtils.js
                scrollEnd: 2.0,        // ✅ SYNC mit phaseUtils.js
                snapTarget: 1.8,       // ✅ OPTIMIERT
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            }
        ]
    }
};

// ===== TIMING-PRESETS (für Animationen) - unverändert =====
export const TIMING_PRESETS = {
    fast: {
        name: 'Fast & Responsive',
        description: 'Schnelle Übergänge für responsive UX',

        snapDuration: 0.8,
        snapEase: 'power3.out',
        lockDelay: 100,
        backToLogoDuration: 1.0,
        backToLogoEase: 'power2.out',

        titleAnimations: {
            fadeScale: { duration: 0.4, delay: 0.05, outDuration: 0.25 },
            slideUp: { duration: 0.5, delay: 0.1, outDuration: 0.3 },
            slideDown: { duration: 0.5, delay: 0.1, outDuration: 0.3 },
            popIn: { duration: 0.6, delay: 0.15, outDuration: 0.4 },
            fade: { duration: 0.3, delay: 0, outDuration: 0.2 }
        }
    },

    balanced: {
        name: 'Balanced',
        description: 'Ausgewogene Timing für beste UX',

        snapDuration: 1.5,
        snapEase: 'power2.inOut',
        lockDelay: 300,
        backToLogoDuration: 2.0,
        backToLogoEase: 'power2.inOut',

        titleAnimations: {
            fadeScale: { duration: 0.8, delay: 0.2, outDuration: 0.5 },
            slideUp: { duration: 1.0, delay: 0.3, outDuration: 0.6 },
            slideDown: { duration: 1.0, delay: 0.3, outDuration: 0.6 },
            popIn: { duration: 1.2, delay: 0.4, outDuration: 0.8 },
            fade: { duration: 0.6, delay: 0.1, outDuration: 0.4 }
        }
    },

    cinematic: {
        name: 'Cinematic',
        description: 'Langsame, dramatische Übergänge',

        snapDuration: 3.5,
        snapEase: 'power1.inOut',
        lockDelay: 600,
        backToLogoDuration: 4.0,
        backToLogoEase: 'sine.inOut',

        titleAnimations: {
            fadeScale: { duration: 2.0, delay: 0.8, outDuration: 1.2 },
            slideUp: { duration: 2.5, delay: 1.0, outDuration: 1.5 },
            slideDown: { duration: 2.5, delay: 1.0, outDuration: 1.5 },
            popIn: { duration: 3.0, delay: 1.2, outDuration: 2.0 },
            fade: { duration: 1.8, delay: 0.6, outDuration: 1.0 }
        }
    },

    custom: {
        name: 'Custom',
        description: 'Anpassbare Einstellungen zum Testen',

        snapDuration: 2.0,
        snapEase: 'power2.inOut',
        lockDelay: 400,
        backToLogoDuration: 2.5,
        backToLogoEase: 'power2.inOut',

        titleAnimations: {
            fadeScale: { duration: 1.2, delay: 0.3, outDuration: 0.7 },
            slideUp: { duration: 1.4, delay: 0.4, outDuration: 0.8 },
            slideDown: { duration: 1.4, delay: 0.4, outDuration: 0.8 },
            popIn: { duration: 1.8, delay: 0.6, outDuration: 1.0 },
            fade: { duration: 0.8, delay: 0.2, outDuration: 0.5 }
        }
    }
};

// ===== AKTIVE KONFIGURATIONEN =====
export const ACTIVE_TIMING_PRESET = 'balanced';
export const ACTIVE_SEGMENT_PRESET = 'balanced_segments';

// ===== UTILITY-FUNKTIONEN (unverändert) =====

export function getActiveTimingConfig() {
    const config = TIMING_PRESETS[ACTIVE_TIMING_PRESET];

    if (!config) {
        console.warn(`Timing preset '${ACTIVE_TIMING_PRESET}' nicht gefunden. Verwende 'balanced'.`);
        return TIMING_PRESETS.balanced;
    }

    return config;
}

export function getActiveScrollSegments() {
    const segments = SCROLL_SEGMENT_PRESETS[ACTIVE_SEGMENT_PRESET];

    if (!segments) {
        console.warn(`Segment preset '${ACTIVE_SEGMENT_PRESET}' nicht gefunden. Verwende 'balanced_segments'.`);
        return SCROLL_SEGMENT_PRESETS.balanced_segments;
    }

    return segments;
}

export function getAnimationTiming(animationType) {
    const config = getActiveTimingConfig();
    return config.titleAnimations[animationType] || config.titleAnimations.fadeScale;
}

export function getSnapTiming() {
    const config = getActiveTimingConfig();
    return {
        duration: config.snapDuration,
        ease: config.snapEase,
        lockDelay: config.lockDelay
    };
}

export function getBackToLogoTiming() {
    const config = getActiveTimingConfig();
    return {
        duration: config.backToLogoDuration,
        ease: config.backToLogoEase
    };
}

export function getDeviceOptimizedTiming() {
    if (typeof window === 'undefined') {
        return getActiveTimingConfig();
    }

    const isMobile = window.innerWidth < 768;

    if (isMobile && ACTIVE_TIMING_PRESET !== 'mobile') {
        const currentConfig = getActiveTimingConfig();
        return {
            ...currentConfig,
            snapDuration: currentConfig.snapDuration * 0.7,
            lockDelay: currentConfig.lockDelay * 0.8,
            titleAnimations: Object.fromEntries(
                Object.entries(currentConfig.titleAnimations).map(([key, timing]) => [
                    key,
                    {
                        ...timing,
                        duration: timing.duration * 0.7,
                        delay: timing.delay * 0.5
                    }
                ])
            )
        };
    }

    return getActiveTimingConfig();
}

export function getTimingDebugInfo() {
    const timingConfig = getActiveTimingConfig();
    const segmentConfig = getActiveScrollSegments();

    return {
        timingPreset: ACTIVE_TIMING_PRESET,
        segmentPreset: ACTIVE_SEGMENT_PRESET,
        timingName: timingConfig.name,
        segmentName: segmentConfig.name,
        snapDuration: timingConfig.snapDuration,
        totalSegments: segmentConfig.segments.length,
        totalPhases: segmentConfig.segments.length,
        averageSegmentLength: segmentConfig.segments.reduce((avg, seg) =>
            avg + (seg.scrollEnd - seg.scrollStart), 0) / segmentConfig.segments.length,
        configurable: true,
        // ✅ SYNC FIX: Debug-Info für korrigierte Phase 6
        phase6SyncInfo: {
            oldRange: "60%-72% Debug (1.5-1.8 scrollProgress)",
            newRange: "64%-80% Debug (1.6-2.0 scrollProgress)",
            syncStatus: "✅ SYNC mit phaseUtils.js",
            snapTarget: "1.8 (80% des Bereichs für beste Sichtbarkeit)"
        }
    };
}

// ===== ERWEITERTE UTILITY-FUNKTIONEN =====

/**
 * ✅ SYNC FIX: Phase-spezifische Timing-Konfiguration
 */
export function getPhaseSpecificTiming(phaseIndex) {
    const segmentConfig = getActiveScrollSegments();
    const timingConfig = getActiveTimingConfig();

    if (phaseIndex < 0 || phaseIndex >= segmentConfig.segments.length) {
        console.warn(`Phase ${phaseIndex} existiert nicht. Verwende Standard-Timing.`);
        return timingConfig;
    }

    const segment = segmentConfig.segments[phaseIndex];

    return {
        ...timingConfig,
        snapDuration: segment.snapDuration,
        snapEase: segment.snapEase,
        // Phase-spezifische Anpassungen
        phaseSpecific: {
            scrollStart: segment.scrollStart,
            scrollEnd: segment.scrollEnd,
            snapTarget: segment.snapTarget,
            duration: segment.scrollEnd - segment.scrollStart,
            phaseType: getPhaseType(phaseIndex),
            debugPercentage: (segment.snapTarget * 40).toFixed(0) + '%',
            // ✅ SYNC FIX: Spezielle Info für Phase 6
            ...(phaseIndex === 6 && {
                syncInfo: "✅ Phase 6 synchronisiert mit phaseUtils.js (1.6-2.0)",
                snapOptimization: "Target 1.8 für optimale Newsletter-Sichtbarkeit"
            })
        }
    };
}

/**
 * ✅ ANGEPASST: Phase-Typ bestimmen mit Phase 6 Support
 */
export function getPhaseType(phaseIndex) {
    if (phaseIndex === 0) return 'logo';
    if (phaseIndex >= 1 && phaseIndex <= 4) return 'title';
    if (phaseIndex === 5) return 'carousel';
    if (phaseIndex === 6) return 'newsletter'; // ✅ SYNC FIX
    return 'future';
}

// ===== REST DER UTILITY-FUNKTIONEN (unverändert) =====
export function getAvailablePresets() {
    return {
        timing: Object.keys(TIMING_PRESETS).map(key => ({
            key,
            name: TIMING_PRESETS[key].name,
            description: TIMING_PRESETS[key].description
        })),
        segments: Object.keys(SCROLL_SEGMENT_PRESETS).map(key => ({
            key,
            name: SCROLL_SEGMENT_PRESETS[key].name,
            description: SCROLL_SEGMENT_PRESETS[key].description
        }))
    };
}

export function switchPreset(timingPreset = null, segmentPreset = null) {
    if (timingPreset && TIMING_PRESETS[timingPreset]) {
        console.log(`🎛️ Timing Preset gewechselt zu: ${timingPreset}`);
    }

    if (segmentPreset && SCROLL_SEGMENT_PRESETS[segmentPreset]) {
        console.log(`📐 Segment Preset gewechselt zu: ${segmentPreset}`);
    }

    return {
        timing: getActiveTimingConfig(),
        segments: getActiveScrollSegments()
    };
}

export function findSegmentForProgress(scrollProgress) {
    const segmentConfig = getActiveScrollSegments();

    let left = 0;
    let right = segmentConfig.segments.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const segment = segmentConfig.segments[mid];

        if (scrollProgress >= segment.scrollStart && scrollProgress <= segment.scrollEnd) {
            return {
                index: mid,
                segment: segment,
                progress: (scrollProgress - segment.scrollStart) / (segment.scrollEnd - segment.scrollStart),
                phaseType: getPhaseType(mid),
                debugPercentage: (segment.snapTarget * 40).toFixed(0) + '%',
                // ✅ SYNC FIX: Spezielle Info für Phase 6
                ...(mid === 6 && {
                    syncStatus: "✅ SYNC mit phaseUtils.js",
                    newsletterOptimization: "Snap Target 1.8 für beste Sichtbarkeit"
                })
            };
        } else if (scrollProgress < segment.scrollStart) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return {
        index: -1,
        segment: null,
        progress: 0,
        phaseType: 'unknown',
        debugPercentage: '0%'
    };
}

// ===== STANDARD-EXPORT =====
export default {
    timingPresets: TIMING_PRESETS,
    segmentPresets: SCROLL_SEGMENT_PRESETS,
    activeTimingPreset: ACTIVE_TIMING_PRESET,
    activeSegmentPreset: ACTIVE_SEGMENT_PRESET,
    getActiveTiming: getActiveTimingConfig,
    getActiveSegments: getActiveScrollSegments,
    getAnimation: getAnimationTiming,
    getSnap: getSnapTiming,
    getBackToLogo: getBackToLogoTiming,
    getDeviceOptimized: getDeviceOptimizedTiming,
    getDebugInfo: getTimingDebugInfo,

    // ✅ SYNC FIX: Erweiterte Exports
    getPhaseSpecific: getPhaseSpecificTiming,
    getPhaseType: getPhaseType,
    getAvailablePresets: getAvailablePresets,
    switchPreset: switchPreset,
    findSegmentForProgress: findSegmentForProgress
};