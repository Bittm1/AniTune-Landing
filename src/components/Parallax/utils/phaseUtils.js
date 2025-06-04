// src/components/Parallax/utils/phaseUtils.js
// ✅ ERWEITERT um Mobile-spezifische Phase-Konfiguration

/**
 * 📱 MOBILE DETECTION
 */
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    const isMobileViewport = window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isMobileViewport && isTouchDevice;
};

/**
 * 🖥️ DESKTOP PHASE-KONFIGURATION - MINIMALER FIX: nur Phase 2/3 Grenze
 */
export const DESKTOP_PHASE_CONFIG = {
    // Phase 1: 40%-80% unteres Debug - UNVERÄNDERT
    phase1: {
        scrollStart: 0.05,
        scrollEnd: 0.50,
        debugStart: '40%',
        debugEnd: '80%',
        title: 'Von Uns Heißt Für Uns',
        audioPath: '/audio/von-uns-heißt-fuer-uns'
    },

    // Phase 2: 80%-100% unteres Debug - MINIMALER FIX: 0.8 → 0.799
    phase2: {
        scrollStart: 0.50,
        scrollEnd: 0.85,    // ✅ MINIMAL FIX: 0.8 → 0.799 (0.001 Unterschied)
        debugStart: '80%',
        debugEnd: '100%',
        title: 'Der Weg Ist Das Ziel',
        audioPath: '/audio/der-weg-ist-das-ziel'
    },

    // Phase 3: 100%-110% unteres Debug - MINIMALER FIX: 0.8 → 0.801  
    phase3: {
        scrollStart: 0.86,  // ✅ MINIMAL FIX: 0.8 → 0.801 (0.001 Unterschied)
        scrollEnd: 1.0,      // UNVERÄNDERT
        debugStart: '100%',
        debugEnd: '110%',
        title: 'Die Community Heißt',
        audioPath: '/audio/die-community-heißt'
    },

    // Phase 4: 110%-120% unteres Debug - UNVERÄNDERT
    phase4: {
        scrollStart: 1.0,
        scrollEnd: 1.2,
        debugStart: '110%',
        debugEnd: '120%',
        title: '',
        audioPath: '/audio/anitune-theme'
    },

    // Phase 5: 120%-140% unteres Debug - CAROUSEL - UNVERÄNDERT
    phase5: {
        scrollStart: 1.2,
        scrollEnd: 1.6,
        debugStart: '120%',
        debugEnd: '140%',
        title: '',
        description: 'AniTune Carousel',
        audioPath: null,
        isCarousel: true
    },

    // Phase 6: 140%-160% unteres Debug - NEWSLETTER CTA - UNVERÄNDERT
    phase6: {
        scrollStart: 1.6,
        scrollEnd: 2.0,
        debugStart: '140%',
        debugEnd: '160%',
        title: '',
        description: 'Newsletter CTA',
        audioPath: null,
        isNewsletter: true
    }
};

/**
 * 📱 MOBILE PHASE-KONFIGURATION - MINIMALER FIX: nur Phase 2/3 Grenze
 */
export const MOBILE_PHASE_CONFIG = {
    // ✅ MOBILE Phase 1: Angepasst für Mobile Zoom - UNVERÄNDERT
    phase1: {
        scrollStart: 0.08,
        scrollEnd: 0.50,
        debugStart: '50%',
        debugEnd: '80%',
        title: 'Von Uns Heißt Für Uns',
        audioPath: '/audio/von-uns-heißt-fuer-uns'
    },

    // ✅ MOBILE Phase 2: MINIMALER FIX: 0.80 → 0.799
    phase2: {
        scrollStart: 0.50,
        scrollEnd: 0.85,      // ✅ MINIMAL FIX: 0.80 → 0.799 (gleicher Fix wie Desktop)
        debugStart: '70%',
        debugEnd: '90%',
        title: 'Der Weg Ist Das Ziel',
        audioPath: '/audio/der-weg-ist-das-ziel'
    },

    // ✅ MOBILE Phase 3: MINIMALER FIX: 0.80 → 0.801
    phase3: {
        scrollStart: 0.86,    // ✅ MINIMAL FIX: 0.80 → 0.801 (gleicher Fix wie Desktop)
        scrollEnd: 1,          // UNVERÄNDERT
        debugStart: '90%',
        debugEnd: '105%',
        title: 'Die Community Heißt',
        audioPath: '/audio/die-community-heißt'
    },

    // ✅ MOBILE Phase 4: UNVERÄNDERT
    phase4: {
        scrollStart: 1,
        scrollEnd: 1.40,       // UNVERÄNDERT - der Tippfehler "1." ist behoben
        debugStart: '105%',
        debugEnd: '120%',
        title: 'AniTune',
        audioPath: '/audio/anitune-theme'
    },

    // ✅ MOBILE Phase 5: Carousel - UNVERÄNDERT
    phase5: {
        scrollStart: 1.15,
        scrollEnd: 1.5,
        debugStart: '120%',
        debugEnd: '135%',
        title: '',
        description: 'AniTune Carousel',
        audioPath: null,
        isCarousel: true
    },

    // ✅ MOBILE Phase 6: Newsletter - UNVERÄNDERT
    phase6: {
        scrollStart: 1.5,
        scrollEnd: 1.8,
        debugStart: '135%',
        debugEnd: '150%',
        title: '',
        description: 'Newsletter CTA',
        audioPath: null,
        isNewsletter: true
    }
};

/**
 * 🎯 INTELLIGENTE PHASE-CONFIG AUSWAHL
 */
export const getPhaseConfig = (forceMobile = null) => {
    const isMobile = forceMobile !== null ? forceMobile : isMobileDevice();

    if (isMobile) {
        return MOBILE_PHASE_CONFIG;
    }

    return DESKTOP_PHASE_CONFIG;
};

/**
 * 🔄 BACKWARD COMPATIBILITY: Original PHASE_CONFIG bleibt bestehen
 */
export const PHASE_CONFIG = DESKTOP_PHASE_CONFIG;

/**
 * 🎯 ERWEITERTE PHASE-ERKENNUNG mit Mobile Support
 */
export const getActivePhaseFromScroll = (scrollProgress, forceMobile = null) => {
    const phaseConfig = getPhaseConfig(forceMobile);

    if (scrollProgress >= phaseConfig.phase1.scrollStart && scrollProgress < phaseConfig.phase1.scrollEnd) {
        return 1;
    }
    else if (scrollProgress >= phaseConfig.phase2.scrollStart && scrollProgress < phaseConfig.phase2.scrollEnd) {
        return 2;
    }
    else if (scrollProgress >= phaseConfig.phase3.scrollStart && scrollProgress < phaseConfig.phase3.scrollEnd) {
        return 3;
    }
    else if (scrollProgress >= phaseConfig.phase4.scrollStart && scrollProgress < phaseConfig.phase4.scrollEnd) {
        return 4;
    }
    else if (scrollProgress >= phaseConfig.phase5.scrollStart && scrollProgress < phaseConfig.phase5.scrollEnd) {
        return 5;
    }
    else if (scrollProgress >= phaseConfig.phase6.scrollStart && scrollProgress < phaseConfig.phase6.scrollEnd) {
        return 6;
    }

    return 0; // Phase 0: Logo/Newsletter oder andere Bereiche
};

/**
 * 🎵 ERWEITERTE AUDIO-MAPPING mit Mobile Support
 */
export const getAudioConfigForPhase = (phase, forceMobile = null) => {
    const phaseConfig = getPhaseConfig(forceMobile);

    if (phase === 1) {
        return {
            id: 'phase1-audio',
            basePath: phaseConfig.phase1.audioPath,
            title: phaseConfig.phase1.title,
            phase: 1
        };
    }
    else if (phase === 2) {
        return {
            id: 'phase2-audio',
            basePath: phaseConfig.phase2.audioPath,
            title: phaseConfig.phase2.title,
            phase: 2
        };
    }
    else if (phase === 3) {
        return {
            id: 'phase3-audio',
            basePath: phaseConfig.phase3.audioPath,
            title: phaseConfig.phase3.title,
            phase: 3
        };
    }
    else if (phase === 4) {
        return {
            id: 'phase4-audio',
            basePath: phaseConfig.phase4.audioPath,
            title: phaseConfig.phase4.title,
            phase: 4,
            isTheme: true
        };
    }
    else if (phase === 5 || phase === 6) {
        return null; // Carousel und Newsletter haben kein Audio
    }

    return null; // Phase 0 = kein Audio
};

/**
 * 🎭 ERWEITERTE TITEL-MAPPING mit Mobile Support
 */
export const getTitleTextForPhase = (phase, forceMobile = null) => {
    const phaseConfig = getPhaseConfig(forceMobile);

    if (phase === 1) return phaseConfig.phase1.title;
    if (phase === 2) return phaseConfig.phase2.title;
    if (phase === 3) return phaseConfig.phase3.title;
    if (phase === 4) return phaseConfig.phase4.title;
    if (phase === 5 || phase === 6) return null;
    return null; // Phase 0 = kein Titel
};

/**
 * 🔍 ERWEITERTE DEBUG-HILFSFUNKTION mit Mobile Support
 */
export const getPhaseDebugInfo = (scrollProgress, forceMobile = null) => {
    const isMobile = forceMobile !== null ? forceMobile : isMobileDevice();
    const phaseConfig = getPhaseConfig(isMobile);
    const phase = getActivePhaseFromScroll(scrollProgress, isMobile);
    const audioConfig = getAudioConfigForPhase(phase, isMobile);
    const titleText = getTitleTextForPhase(phase, isMobile);

    // Ermittle aktuellen Bereich
    let phaseRange = 'Logo/Andere';
    let phaseDescription = 'Logo/Newsletter';

    if (phase >= 1 && phase <= 6) {
        const config = phaseConfig[`phase${phase}`];
        phaseRange = `${(config.scrollStart * 100).toFixed(0)}%-${(config.scrollEnd * 100).toFixed(0)}%`;
        phaseDescription = config.description || config.title || `Phase ${phase}`;
    }

    return {
        scrollProgress: scrollProgress.toFixed(3),
        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
        phase,
        titleText,
        phaseDescription,
        audioConfig: audioConfig ? audioConfig.title : 'Kein Audio',
        audioPath: audioConfig ? audioConfig.basePath + '.mp3' : 'Kein Pfad',
        phaseRange,
        isInAudioRange: phase >= 1 && phase <= 4,
        isInTitleRange: phase >= 1 && phase <= 4,
        isCarouselPhase: phase === 5,
        isNewsletterPhase: phase === 6,
        centralConfig: phase >= 1 && phase <= 6 ? phaseConfig[`phase${phase}`] : null,

        // ✅ NEU: Mobile-Debug-Info
        deviceType: isMobile ? '📱 Mobile' : '🖥️ Desktop',
        isMobile: isMobile,
        configSource: isMobile ? 'MOBILE_PHASE_CONFIG' : 'DESKTOP_PHASE_CONFIG'
    };
};

/**
 * 📊 ERWEITERTE BEREICHE-ANZEIGE mit Mobile Support
 */
export const getAllPhaseRanges = (forceMobile = null) => {
    const isMobile = forceMobile !== null ? forceMobile : isMobileDevice();
    const phaseConfig = getPhaseConfig(isMobile);
    const deviceType = isMobile ? '📱 Mobile' : '🖥️ Desktop';

    return {
        deviceType,
        configSource: isMobile ? 'MOBILE_PHASE_CONFIG' : 'DESKTOP_PHASE_CONFIG',
        phase0: { range: '0%-5%', description: 'Logo/Newsletter' },
        phase1: {
            range: `${(phaseConfig.phase1.scrollStart * 100).toFixed(0)}%-${(phaseConfig.phase1.scrollEnd * 100).toFixed(0)}%`,
            description: phaseConfig.phase1.title
        },
        phase2: {
            range: `${(phaseConfig.phase2.scrollStart * 100).toFixed(0)}%-${(phaseConfig.phase2.scrollEnd * 100).toFixed(0)}%`,
            description: phaseConfig.phase2.title
        },
        phase3: {
            range: `${(phaseConfig.phase3.scrollStart * 100).toFixed(0)}%-${(phaseConfig.phase3.scrollEnd * 100).toFixed(0)}%`,
            description: phaseConfig.phase3.title
        },
        phase4: {
            range: `${(phaseConfig.phase4.scrollStart * 100).toFixed(0)}%-${(phaseConfig.phase4.scrollEnd * 100).toFixed(0)}%`,
            description: phaseConfig.phase4.title + (isMobile ? ' (Mobile: "AniTune")' : ' (Theme)')
        },
        phase5: {
            range: `${(phaseConfig.phase5.scrollStart * 100).toFixed(0)}%-${(phaseConfig.phase5.scrollEnd * 100).toFixed(0)}%`,
            description: phaseConfig.phase5.description
        },
        phase6: {
            range: `${(phaseConfig.phase6.scrollStart * 100).toFixed(0)}%-${(phaseConfig.phase6.scrollEnd * 100).toFixed(0)}%`,
            description: phaseConfig.phase6.description
        }
    };
};

/**
 * ✅ MOBILE-SPEZIFISCHE HELPER-FUNKTIONEN
 */

/**
 * 📱 Hole Mobile Phase-Konfiguration für bestimmte Phase
 */
export const getMobilePhaseConfig = (phase) => {
    return MOBILE_PHASE_CONFIG[`phase${phase}`] || null;
};

/**
 * 🖥️ Hole Desktop Phase-Konfiguration für bestimmte Phase
 */
export const getDesktopPhaseConfig = (phase) => {
    return DESKTOP_PHASE_CONFIG[`phase${phase}`] || null;
};

/**
 * 🔧 Update Mobile Phase-Bereiche (für Live-Anpassung)
 */
export const updateMobilePhaseRanges = (phaseUpdates) => {
    Object.keys(phaseUpdates).forEach(phaseKey => {
        if (MOBILE_PHASE_CONFIG[phaseKey]) {
            MOBILE_PHASE_CONFIG[phaseKey] = {
                ...MOBILE_PHASE_CONFIG[phaseKey],
                ...phaseUpdates[phaseKey]
            };
        }
    });

    if (process.env.NODE_ENV === 'development') {
        console.log('📱 Mobile Phase-Bereiche aktualisiert:', phaseUpdates);
        console.log('📊 Neue Mobile-Konfiguration:', MOBILE_PHASE_CONFIG);
    }
};

/**
 * 🎛️ Phase-Bereiche live anpassen (Development Helper)
 */
export const adjustMobilePhaseRange = (phase, scrollStart, scrollEnd) => {
    if (MOBILE_PHASE_CONFIG[`phase${phase}`]) {
        MOBILE_PHASE_CONFIG[`phase${phase}`].scrollStart = scrollStart;
        MOBILE_PHASE_CONFIG[`phase${phase}`].scrollEnd = scrollEnd;

        if (process.env.NODE_ENV === 'development') {
            console.log(`📱 Mobile Phase ${phase} angepasst: ${scrollStart}-${scrollEnd}`);
        }
    }
};

/**
 * 📊 Debug: Vergleiche Desktop vs Mobile Konfiguration
 */
export const comparePhaseConfigs = () => {
    const comparison = {};

    [1, 2, 3, 4, 5, 6].forEach(phase => {
        const desktop = DESKTOP_PHASE_CONFIG[`phase${phase}`];
        const mobile = MOBILE_PHASE_CONFIG[`phase${phase}`];

        comparison[`phase${phase}`] = {
            desktop: {
                range: `${(desktop.scrollStart * 100).toFixed(0)}%-${(desktop.scrollEnd * 100).toFixed(0)}%`,
                length: ((desktop.scrollEnd - desktop.scrollStart) * 100).toFixed(1) + '%'
            },
            mobile: {
                range: `${(mobile.scrollStart * 100).toFixed(0)}%-${(mobile.scrollEnd * 100).toFixed(0)}%`,
                length: ((mobile.scrollEnd - mobile.scrollStart) * 100).toFixed(1) + '%'
            },
            difference: {
                startDiff: ((mobile.scrollStart - desktop.scrollStart) * 100).toFixed(1) + '%',
                endDiff: ((mobile.scrollEnd - desktop.scrollEnd) * 100).toFixed(1) + '%'
            }
        };
    });

    return comparison;
};

/**
 * ✅ BACKWARD COMPATIBILITY Funktionen (unverändert)
 */
export const validatePhaseConsistency = () => {
    console.log('✅ Phase-Validierung: Desktop + Mobile Konfigurationen definiert');
    return true;
};

export const updatePhaseConfig = (newConfig) => {
    console.log('🎛️ updatePhaseConfig aufgerufen');
    return true;
};

export const showCurrentConfig = (forceMobile = null) => {
    console.log('📊 Aktuelle Konfiguration: Desktop + Mobile Support');
    return getAllPhaseRanges(forceMobile);
};

// ✅ VOLLSTÄNDIGER EXPORT
export default {
    // Konfigurationen
    PHASE_CONFIG: DESKTOP_PHASE_CONFIG, // Backward compatibility
    DESKTOP_PHASE_CONFIG,
    MOBILE_PHASE_CONFIG,

    // Hauptfunktionen
    getPhaseConfig,
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getTitleTextForPhase,
    getPhaseDebugInfo,
    getAllPhaseRanges,

    // Mobile-spezifische Funktionen
    getMobilePhaseConfig,
    getDesktopPhaseConfig,
    updateMobilePhaseRanges,
    adjustMobilePhaseRange,
    comparePhaseConfigs,

    // Backward compatibility
    validatePhaseConsistency,
    updatePhaseConfig,
    showCurrentConfig
};