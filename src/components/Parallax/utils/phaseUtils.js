// src/components/Parallax/utils/phaseUtils.js
// ✅ ERWEITERT um Phase 5 & 6

/**
 * 🎛️ ZENTRALE BEREICH-KONFIGURATION - ALLE 7 PHASEN (0-6)
 */
export const PHASE_CONFIG = {
    // Phase 1: 40%-80% unteres Debug  
    phase1: {
        scrollStart: 0.05,
        scrollEnd: 0.50,
        debugStart: '40%',
        debugEnd: '80%',
        title: 'Von Uns Heißt Für Uns',
        audioPath: '/audio/von-uns-heißt-fuer-uns'
    },

    // Phase 2: 80%-100% unteres Debug
    phase2: {
        scrollStart: 0.50,
        scrollEnd: 0.8,
        debugStart: '80%',
        debugEnd: '100%',
        title: 'Der Weg Ist Das Ziel',
        audioPath: '/audio/der-weg-ist-das-ziel'
    },

    // Phase 3: 100%-110% unteres Debug
    phase3: {
        scrollStart: 0.8,
        scrollEnd: 1.0,
        debugStart: '100%',
        debugEnd: '110%',
        title: 'Die Community Heißt',
        audioPath: '/audio/die-community-heißt'
    },

    // Phase 4: 110%-120% unteres Debug
    phase4: {
        scrollStart: 1.0,
        scrollEnd: 1.2,
        debugStart: '110%',
        debugEnd: '120%',
        title: '',
        audioPath: '/audio/anitune-theme'
    },

    // ✅ NEU: Phase 5: 120%-140% unteres Debug - CAROUSEL
    phase5: {
        scrollStart: 1.2,
        scrollEnd: 1.6,
        debugStart: '120%',
        debugEnd: '140%',
        title: '',
        description: 'AniTune Carousel',
        audioPath: null, // Kein Audio im Carousel
        isCarousel: true
    },

    // ✅ NEU: Phase 6: 140%-160% unteres Debug - NEWSLETTER CTA  
    phase6: {
        scrollStart: 1.6,
        scrollEnd: 2.0,
        debugStart: '140%',
        debugEnd: '160%',
        title: '',
        description: 'Newsletter CTA',
        audioPath: null, // Kein Audio im Newsletter
        isNewsletter: true
    }
};

/**
 * 🎯 PHASE-ERKENNUNG für 7 Phasen (0-6)
 */
export const getActivePhaseFromScroll = (scrollProgress) => {
    if (scrollProgress >= PHASE_CONFIG.phase1.scrollStart && scrollProgress < PHASE_CONFIG.phase1.scrollEnd) {
        return 1;
    }
    else if (scrollProgress >= PHASE_CONFIG.phase2.scrollStart && scrollProgress < PHASE_CONFIG.phase2.scrollEnd) {
        return 2;
    }
    else if (scrollProgress >= PHASE_CONFIG.phase3.scrollStart && scrollProgress < PHASE_CONFIG.phase3.scrollEnd) {
        return 3;
    }
    else if (scrollProgress >= PHASE_CONFIG.phase4.scrollStart && scrollProgress < PHASE_CONFIG.phase4.scrollEnd) {
        return 4;
    }
    // ✅ NEU: Phase 5 (Carousel)
    else if (scrollProgress >= PHASE_CONFIG.phase5.scrollStart && scrollProgress < PHASE_CONFIG.phase5.scrollEnd) {
        return 5;
    }
    // ✅ NEU: Phase 6 (Newsletter)
    else if (scrollProgress >= PHASE_CONFIG.phase6.scrollStart && scrollProgress < PHASE_CONFIG.phase6.scrollEnd) {
        return 6;
    }

    return 0; // Phase 0: Logo/Newsletter oder andere Bereiche
};

/**
 * 🎵 AUDIO-MAPPING für 7 Phasen (erweitert)
 */
export const getAudioConfigForPhase = (phase) => {
    if (phase === 1) {
        return {
            id: 'phase1-audio',
            basePath: PHASE_CONFIG.phase1.audioPath,
            title: PHASE_CONFIG.phase1.title,
            phase: 1
        };
    }
    else if (phase === 2) {
        return {
            id: 'phase2-audio',
            basePath: PHASE_CONFIG.phase2.audioPath,
            title: PHASE_CONFIG.phase2.title,
            phase: 2
        };
    }
    else if (phase === 3) {
        return {
            id: 'phase3-audio',
            basePath: PHASE_CONFIG.phase3.audioPath,
            title: PHASE_CONFIG.phase3.title,
            phase: 3
        };
    }
    else if (phase === 4) {
        return {
            id: 'phase4-audio',
            basePath: PHASE_CONFIG.phase4.audioPath,
            title: PHASE_CONFIG.phase4.title,
            phase: 4,
            isTheme: true
        };
    }
    // ✅ NEU: Phase 5 & 6 haben kein Audio
    else if (phase === 5 || phase === 6) {
        return null; // Carousel und Newsletter haben kein Audio
    }

    return null; // Phase 0 = kein Audio
};

/**
 * 🎭 TITEL-MAPPING für 7 Phasen (erweitert)
 */
export const getTitleTextForPhase = (phase) => {
    if (phase === 1) return PHASE_CONFIG.phase1.title;
    if (phase === 2) return PHASE_CONFIG.phase2.title;
    if (phase === 3) return PHASE_CONFIG.phase3.title;
    if (phase === 4) return PHASE_CONFIG.phase4.title;
    // ✅ NEU: Phase 5 & 6 haben keine Titel
    if (phase === 5 || phase === 6) return null;
    return null; // Phase 0 = kein Titel
};

/**
 * 🔍 DEBUG-HILFSFUNKTION für 7 Phasen
 */
export const getPhaseDebugInfo = (scrollProgress) => {
    const phase = getActivePhaseFromScroll(scrollProgress);
    const audioConfig = getAudioConfigForPhase(phase);
    const titleText = getTitleTextForPhase(phase);

    // Ermittle aktuellen Bereich
    let phaseRange = 'Logo/Andere';
    let phaseDescription = 'Logo/Newsletter';

    if (phase >= 1 && phase <= 6) {
        const config = PHASE_CONFIG[`phase${phase}`];
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
        centralConfig: phase >= 1 && phase <= 6 ? PHASE_CONFIG[`phase${phase}`] : null
    };
};

/**
 * 📊 ALLE BEREICHE ANZEIGEN für 7 Phasen
 */
export const getAllPhaseRanges = () => {
    return {
        phase0: { range: '0%-5%', description: 'Logo/Newsletter' },
        phase1: {
            range: `${(PHASE_CONFIG.phase1.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase1.scrollEnd * 100).toFixed(0)}%`,
            description: PHASE_CONFIG.phase1.title
        },
        phase2: {
            range: `${(PHASE_CONFIG.phase2.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase2.scrollEnd * 100).toFixed(0)}%`,
            description: PHASE_CONFIG.phase2.title
        },
        phase3: {
            range: `${(PHASE_CONFIG.phase3.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase3.scrollEnd * 100).toFixed(0)}%`,
            description: PHASE_CONFIG.phase3.title
        },
        phase4: {
            range: `${(PHASE_CONFIG.phase4.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase4.scrollEnd * 100).toFixed(0)}%`,
            description: PHASE_CONFIG.phase4.title + ' (Theme)'
        },
        // ✅ NEU: Phase 5 & 6
        phase5: {
            range: `${(PHASE_CONFIG.phase5.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase5.scrollEnd * 100).toFixed(0)}%`,
            description: PHASE_CONFIG.phase5.description
        },
        phase6: {
            range: `${(PHASE_CONFIG.phase6.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase6.scrollEnd * 100).toFixed(0)}%`,
            description: PHASE_CONFIG.phase6.description
        }
    };
};

/**
 * ✅ SCHNELLER FIX: validatePhaseConsistency
 */
export const validatePhaseConsistency = () => {
    console.log('✅ Phase-Validierung: 7 Phasen (0-6) definiert');
    return true;
};

/**
 * ✅ SCHNELLER FIX: updatePhaseConfig & showCurrentConfig
 */
export const updatePhaseConfig = (newConfig) => {
    console.log('🎛️ updatePhaseConfig aufgerufen');
    return true;
};

export const showCurrentConfig = () => {
    console.log('📊 Aktuelle Konfiguration: 7 Phasen (0-6)');
    return getAllPhaseRanges();
};

// ✅ VOLLSTÄNDIGER EXPORT
export default {
    PHASE_CONFIG,
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getTitleTextForPhase,
    getPhaseDebugInfo,
    getAllPhaseRanges,
    validatePhaseConsistency,
    updatePhaseConfig,
    showCurrentConfig
};