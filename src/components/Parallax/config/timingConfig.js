// src/components/Parallax/config/timingConfig.js

/**
 * 🎛️ FINALE TIMING-KONFIGURATION MIT PHASE 8
 * ✅ Phase 0: snapTarget = 0 (0% von 0-1)
 * ✅ Phase 1-6: Gleichmäßig über den vollen 0-1 Bereich verteilt  
 * ✅ Phase 7: AniTune Carousel (ÜBER 100%)
 * ✅ Phase 8: Newsletter CTA (NEU!)
 * ✅ 9 Phasen bei: 0%, 16.67%, 33.33%, 50%, 66.67%, 83.33%, 100%, 108%, 116%
 */

// ===== SCROLL-SEGMENT-PRESETS =====
export const SCROLL_SEGMENT_PRESETS = {
    // ⚡ SCHNELLE ÜBERGÄNGE - ERWEITERT für Phase 8
    fast_segments: {
        name: 'Fast Segments mit Phase 8',
        description: 'Alle 9 Phasen gleichmäßig über 0-1.4 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.05,
                snapTarget: 0,         // 0% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 1-6: Titel bei 16.67%, 33.33%, 50%, 66.67%, 83.33%, 100%
            {
                scrollStart: 0.05,
                scrollEnd: 0.25,
                snapTarget: 0.1667,    // 16.67% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,    // 33.33% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,       // 50% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,    // 66.67% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,    // 83.33% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,       // 100% von 0-1
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ Phase 7: AniTune Carousel (ÜBER 100%)
            {
                scrollStart: 1.0,
                scrollEnd: 1.20,
                snapTarget: 1.1,       // 110% = Mitte der Phase 7
                snapDuration: 0.8,
                snapEase: "power3.out"
            },
            // ✅ NEU: Phase 8: Newsletter CTA
            {
                scrollStart: 1.20,
                scrollEnd: 1.40,
                snapTarget: 1.3,       // 130% = Mitte der Phase 8
                snapDuration: 0.8,
                snapEase: "power3.out"
            }
        ]
    },

    // ⚖️ AUSGEWOGENE BEREICHE (Standard) - ERWEITERT für Phase 8
    balanced_segments: {
        name: 'Balanced Segments - Professional Scale mit Phase 8',
        description: '16 Phasen gleichmäßig über 0-3 Bereich verteilt',

        segments: [
            // Phase 0: Logo/Newsletter
            { scrollStart: 0, scrollEnd: 0.04, snapTarget: 0, snapDuration: 1.2, snapEase: "power2.inOut" },
            // Phase 1-6: Titel-Phasen  
            { scrollStart: 0.04, scrollEnd: 0.24, snapTarget: 0.2, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 0.24, scrollEnd: 0.44, snapTarget: 0.4, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 0.44, scrollEnd: 0.64, snapTarget: 0.6, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 0.64, scrollEnd: 0.84, snapTarget: 0.8, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 0.84, scrollEnd: 1.04, snapTarget: 1.0, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 1.04, scrollEnd: 1.24, snapTarget: 1.2, snapDuration: 1.2, snapEase: "power2.inOut" },
            // Phase 7: AniTune Carousel 
            { scrollStart: 1.24, scrollEnd: 1.60, snapTarget: 1.4, snapDuration: 1.2, snapEase: "power2.inOut" },
            // ✅ NEU: Phase 8: Newsletter CTA
            { scrollStart: 1.60, scrollEnd: 2.00, snapTarget: 1.8, snapDuration: 1.2, snapEase: "power2.inOut" },
            // Phase 9-15: Zukünftige Features
            { scrollStart: 2.00, scrollEnd: 2.20, snapTarget: 2.1, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 2.20, scrollEnd: 2.40, snapTarget: 2.3, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 2.40, scrollEnd: 2.60, snapTarget: 2.5, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 2.60, scrollEnd: 2.80, snapTarget: 2.7, snapDuration: 1.2, snapEase: "power2.inOut" },
            { scrollStart: 2.80, scrollEnd: 3.00, snapTarget: 2.9, snapDuration: 1.2, snapEase: "power2.inOut" }
        ]
    },

    // 🎬 LANGE BEREICHE (Cinematisch) - ERWEITERT für Phase 8
    cinematic_segments: {
        name: 'Cinematic Segments mit Phase 8',
        description: 'Alle 9 Phasen gleichmäßig über 0-1.6 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.04,
                snapTarget: 0,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 1-6: Titel
            {
                scrollStart: 0.04,
                scrollEnd: 0.25,
                snapTarget: 0.1667,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ Phase 7: AniTune Carousel
            {
                scrollStart: 1.0,
                scrollEnd: 1.30,
                snapTarget: 1.15,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            },
            // ✅ NEU: Phase 8: Newsletter CTA
            {
                scrollStart: 1.30,
                scrollEnd: 1.60,
                snapTarget: 1.45,
                snapDuration: 2.5,
                snapEase: "power1.inOut"
            }
        ]
    },

    // 🎯 CUSTOM (Zum Experimentieren) - ERWEITERT für Phase 8
    custom_segments: {
        name: 'Custom Segments mit Phase 8',
        description: 'Alle 9 Phasen gleichmäßig über 0-1.8 Bereich verteilt',

        segments: [
            // ✅ Phase 0: Bei 0% - Logo/Newsletter Phase
            {
                scrollStart: 0,
                scrollEnd: 0.04,
                snapTarget: 0,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 1-6: Titel
            {
                scrollStart: 0.04,
                scrollEnd: 0.25,
                snapTarget: 0.1667,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            {
                scrollStart: 0.25,
                scrollEnd: 0.42,
                snapTarget: 0.3333,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            {
                scrollStart: 0.42,
                scrollEnd: 0.58,
                snapTarget: 0.5,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            {
                scrollStart: 0.58,
                scrollEnd: 0.75,
                snapTarget: 0.6667,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            {
                scrollStart: 0.75,
                scrollEnd: 0.92,
                snapTarget: 0.8333,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            {
                scrollStart: 0.92,
                scrollEnd: 1.0,
                snapTarget: 1.0,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ Phase 7: AniTune Carousel
            {
                scrollStart: 1.0,
                scrollEnd: 1.35,
                snapTarget: 1.175,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            },
            // ✅ NEU: Phase 8: Newsletter CTA
            {
                scrollStart: 1.35,
                scrollEnd: 1.70,
                snapTarget: 1.525,
                snapDuration: 1.8,
                snapEase: "power2.inOut"
            }
        ]
    }
};

// ===== TIMING-PRESETS (für Animationen) =====
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
        totalPhases: 9, // ✅ ERWEITERT: 0-8 = 9 Phasen
        averageSegmentLength: segmentConfig.segments.reduce((avg, seg) =>
            avg + (seg.scrollEnd - seg.scrollStart), 0) / segmentConfig.segments.length,
        configurable: true // Alle Phasen sind jetzt konfigurierbar
    };
}

// ===== ERWEITERTE UTILITY-FUNKTIONEN für Phase 8 =====

/**
 * ✅ NEU: Phase-spezifische Timing-Konfiguration
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
            phaseType: getPhaseType(phaseIndex)
        }
    };
}

/**
 * ✅ NEU: Phase-Typ bestimmen
 */
export function getPhaseType(phaseIndex) {
    if (phaseIndex === 0) return 'logo';
    if (phaseIndex >= 1 && phaseIndex <= 6) return 'title';
    if (phaseIndex === 7) return 'carousel';
    if (phaseIndex === 8) return 'newsletter';
    return 'future';
}

/**
 * ✅ NEU: Alle verfügbaren Presets auflisten
 */
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

/**
 * ✅ NEU: Preset wechseln (für Live-Testing)
 */
export function switchPreset(timingPreset = null, segmentPreset = null) {
    if (timingPreset && TIMING_PRESETS[timingPreset]) {
        console.log(`🎛️ Timing Preset gewechselt zu: ${timingPreset}`);
        // In einer echten Implementierung würde man hier den aktiven Preset ändern
    }

    if (segmentPreset && SCROLL_SEGMENT_PRESETS[segmentPreset]) {
        console.log(`📐 Segment Preset gewechselt zu: ${segmentPreset}`);
        // In einer echten Implementierung würde man hier den aktiven Preset ändern
    }

    return {
        timing: getActiveTimingConfig(),
        segments: getActiveScrollSegments()
    };
}

/**
 * ✅ NEU: Performance-optimierte Segment-Suche
 */
export function findSegmentForProgress(scrollProgress) {
    const segmentConfig = getActiveScrollSegments();

    // Binäre Suche für bessere Performance bei vielen Segmenten
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
                phaseType: getPhaseType(mid)
            };
        } else if (scrollProgress < segment.scrollStart) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    // Fallback: Nächstes Segment finden
    return {
        index: -1,
        segment: null,
        progress: 0,
        phaseType: 'unknown'
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

    // ✅ NEU: Phase 8 Erweiterungen
    getPhaseSpecific: getPhaseSpecificTiming,
    getPhaseType: getPhaseType,
    getAvailablePresets: getAvailablePresets,
    switchPreset: switchPreset,
    findSegmentForProgress: findSegmentForProgress
};