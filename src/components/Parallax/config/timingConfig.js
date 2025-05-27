// src/components/Parallax/config/timingConfig.js

/**
 * 🎛️ FINALE TIMING-KONFIGURATION
 * ✅ Phase 0: snapTarget = 0 (0% von 0-1)
 * ✅ Phase 1-6: Gleichmäßig über den vollen 0-1 Bereich verteilt
 * ✅ Phase 7: AniTune Carousel (ÜBER 100%)
 * ✅ 8 Phasen bei: 0%, 16.67%, 33.33%, 50%, 66.67%, 83.33%, 100%, 108%
 */

// ===== SCROLL-SEGMENT-PRESETS =====
export const SCROLL_SEGMENT_PRESETS = {
    // ⚡ SCHNELLE ÜBERGÄNGE
    fast_segments: {
        name: 'Fast Segments',
        description: 'Alle 8 Phasen gleichmäßig über 0-1.2 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.05,
                snapTarget: 0,         // 0% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 1: Bei 16.67% - "Von Uns Ist Für Uns"
            {
                scrollStart: 0.05,
                scrollEnd: 0.25,
                snapTarget: 0.1667,    // 16.67% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 2: Bei 33.33% - "Der Weg"
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,    // 33.33% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 3: Bei 50% - "Ist Das Ziel"
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,       // 50% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 4: Bei 66.67% - "Die Community"
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,    // 66.67% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 5: Bei 83.33% - "Heißt"
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,    // 83.33% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 6: Bei 100% - "AniTune"
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,       // 100% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ NEU: Phase 7: AniTune Carousel (ÜBER 100%)
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.1,       // 110% = Mitte der Phase 7
                snapDuration: 0.8,
                snapEase: "power3.out"
            }
        ]
    },

    // ⚖️ AUSGEWOGENE BEREICHE (Standard)
    balanced_segments: {
        name: 'Balanced Segments',
        description: 'Alle 8 Phasen gleichmäßig über 0-1.2 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.04,
                snapTarget: 0,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 1: Bei 16.67% - "Von Uns Ist Für Uns"
            {
                scrollStart: 0.04,
                scrollEnd: 0.25,
                snapTarget: 0.1667,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 2: Bei 33.33% - "Der Weg"
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 3: Bei 50% - "Ist Das Ziel"
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 4: Bei 66.67% - "Die Community"
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 5: Bei 83.33% - "Heißt"
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 6: Bei 100% - "AniTune"
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            },
            // ✅ NEU: Phase 7: AniTune Carousel (ÜBER 100%)
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.1,       // 110% = Mitte der Phase 7
                snapDuration: 1.2,
                snapEase: "power2.inOut"
            }
        ]
    },

    // 🎬 LANGE BEREICHE (Cinematisch)
    cinematic_segments: {
        name: 'Cinematic Segments',
        description: 'Alle 8 Phasen gleichmäßig über 0-1.2 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.04,
                snapTarget: 0,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 1: Bei 16.67% - "Von Uns Ist Für Uns"
            {
                scrollStart: 0.04,
                scrollEnd: 0.25,
                snapTarget: 0.1667,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 2: Bei 33.33% - "Der Weg"
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 3: Bei 50% - "Ist Das Ziel"
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 4: Bei 66.67% - "Die Community"
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 5: Bei 83.33% - "Heißt"
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 6: Bei 100% - "AniTune"
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ NEU: Phase 7: AniTune Carousel (ÜBER 100%)
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.1,       // 110% = Mitte der Phase 7
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            }
        ]
    },

    // 🎯 CUSTOM (Zum Experimentieren)
    custom_segments: {
        name: 'Custom Segments',
        description: 'Alle 8 Phasen gleichmäßig über 0-1.2 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.04,
                snapTarget: 0,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 1: Bei 16.67% - "Von Uns Ist Für Uns"
            {
                scrollStart: 0.04,
                scrollEnd: 0.25,
                snapTarget: 0.1667,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 2: Bei 33.33% - "Der Weg"
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 3: Bei 50% - "Ist Das Ziel"
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 4: Bei 66.67% - "Die Community"
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 5: Bei 83.33% - "Heißt"
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 6: Bei 100% - "AniTune"
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 7: AniTune Carousel (ÜBER 100%)
            {
                scrollStart: 1.0,
                scrollEnd: 1.2,
                snapTarget: 1.1,       // 110% = Mitte der Phase 7
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            }
        ]
    }
};

// ===== TIMING-PRESETS (unverändert) =====
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

// ===== UTILITY-FUNKTIONEN =====

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
        averageSegmentLength: segmentConfig.segments.reduce((avg, seg) =>
            avg + (seg.scrollEnd - seg.scrollStart), 0) / segmentConfig.segments.length
    };
}

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
    getDebugInfo: getTimingDebugInfo
};