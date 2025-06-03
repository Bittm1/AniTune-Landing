// src/components/Parallax/utils/phaseUtils.js
// ✅ ZENTRALE PHASE-DEFINITION OHNE Logo-Doppelungen

/**
 * 🎛️ ZENTRALE BEREICH-KONFIGURATION - LOGISCHE AUFTEILUNG
 * ✅ Logo-Konfiguration nach logoConfig.js ausgelagert
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

    // ✅ Phase 4: 110%-200% unteres Debug OHNE Logo-Konfiguration
    phase4: {
        scrollStart: 1.0,
        scrollEnd: 1.6,
        debugStart: '110%',
        debugEnd: '200%',
        title: '',
        audioPath: '/audio/anitune-theme'
        // ✅ Logo-Konfiguration entfernt - jetzt in logoConfig.js
    }
};

/**
 * 🎯 PHASE-ERKENNUNG für 4 Phasen
 * Diese Funktion bestimmt für ALLE Systeme (Titel + Audio) die aktuelle Phase
 * 
 * @param {number} scrollProgress - Scroll-Fortschritt (0-1.2+)
 * @returns {number} Phase-Nummer (0-4)
 */
export const getActivePhaseFromScroll = (scrollProgress) => {
    if (scrollProgress >= PHASE_CONFIG.phase1.scrollStart && scrollProgress < PHASE_CONFIG.phase1.scrollEnd) {
        return 1; // Phase 1: Erster Titel
    }
    else if (scrollProgress >= PHASE_CONFIG.phase2.scrollStart && scrollProgress < PHASE_CONFIG.phase2.scrollEnd) {
        return 2; // Phase 2: Zweiter Titel
    }
    else if (scrollProgress >= PHASE_CONFIG.phase3.scrollStart && scrollProgress < PHASE_CONFIG.phase3.scrollEnd) {
        return 3; // Phase 3: Dritter Titel
    }
    else if (scrollProgress >= PHASE_CONFIG.phase4.scrollStart && scrollProgress < PHASE_CONFIG.phase4.scrollEnd) {
        return 4; // ✅ Phase 4: AniTune Theme (OHNE Logo-Details)
    }

    return 0; // Phase 0: Logo/Newsletter oder andere Bereiche
};

/**
 * 🎵 AUDIO-MAPPING für 4 Phasen
 * Ordnet Phase-Nummern den entsprechenden Audio-Dateien zu
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
    // ✅ Phase 4 Audio-Konfiguration OHNE Logo-Details
    else if (phase === 4) {
        return {
            id: 'phase4-audio',
            basePath: PHASE_CONFIG.phase4.audioPath,
            title: PHASE_CONFIG.phase4.title,
            phase: 4,
            isTheme: true // ✅ Markierung als Theme-Audio
        };
    }

    return null; // Phase 0 = kein Audio
};

/**
 * 🎭 TITEL-MAPPING für 4 Phasen
 * Ordnet Phase-Nummern den entsprechenden Titel-Texten zu
 */
export const getTitleTextForPhase = (phase) => {
    if (phase === 1) return PHASE_CONFIG.phase1.title;
    if (phase === 2) return PHASE_CONFIG.phase2.title;
    if (phase === 3) return PHASE_CONFIG.phase3.title;
    if (phase === 4) return PHASE_CONFIG.phase4.title;
    return null; // Phase 0 = kein Titel
};

/**
 * ✅ ENTFERNT: getLogoConfigForPhase
 * Diese Funktion ist jetzt in logoConfig.js verfügbar
 */

/**
 * 🔍 DEBUG-HILFSFUNKTION für 4 Phasen OHNE Logo-Details
 * Zeigt alle Informationen für eine bestimmte scrollProgress
 */
export const getPhaseDebugInfo = (scrollProgress) => {
    const phase = getActivePhaseFromScroll(scrollProgress);
    const audioConfig = getAudioConfigForPhase(phase);
    const titleText = getTitleTextForPhase(phase);

    // Ermittle aktuellen Bereich
    let phaseRange = 'Logo/Andere';
    if (phase === 1) phaseRange = `${(PHASE_CONFIG.phase1.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase1.scrollEnd * 100).toFixed(0)}%`;
    else if (phase === 2) phaseRange = `${(PHASE_CONFIG.phase2.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase2.scrollEnd * 100).toFixed(0)}%`;
    else if (phase === 3) phaseRange = `${(PHASE_CONFIG.phase3.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase3.scrollEnd * 100).toFixed(0)}%`;
    else if (phase === 4) phaseRange = `${(PHASE_CONFIG.phase4.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase4.scrollEnd * 100).toFixed(0)}%`;

    return {
        scrollProgress: scrollProgress.toFixed(3),
        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
        phase,
        titleText,
        audioConfig: audioConfig ? audioConfig.title : 'Kein Audio',
        audioPath: audioConfig ? audioConfig.basePath + '.mp3' : 'Kein Pfad',

        // ✅ Logo-Info entfernt - verwende logoConfig.js für Logo-Details

        // Bereich-Info
        phaseRange,
        isInAudioRange: phase >= 1 && phase <= 4,
        isInTitleRange: phase >= 1 && phase <= 4,
        isPhase4: phase === 4, // ✅ Vereinfacht: nur Phase-Check
        centralConfig: phase >= 1 && phase <= 4 ? PHASE_CONFIG[`phase${phase}`] : null
    };
};

/**
 * 📊 ALLE BEREICHE ANZEIGEN für 4 Phasen
 * Für Debugging und Übersicht
 */
export const getAllPhaseRanges = () => {
    return {
        phase0: { range: '0%-5% + 120%+', description: 'Logo/Newsletter/Carousel/etc.' },
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
            description: PHASE_CONFIG.phase4.title + ' (Theme)' // ✅ Logo-Info entfernt
        }
    };
};

/**
 * 🎛️ ZENTRALE STEUERUNG - BEREICHE ÄNDERN
 * @param {Object} newConfig - Neue Phase-Konfiguration
 */
export const updatePhaseConfig = (newConfig) => {
    console.log('🎛️ ZENTRALE BEREICH-ÄNDERUNG (4 PHASEN):');

    Object.keys(newConfig).forEach(phaseKey => {
        if (PHASE_CONFIG[phaseKey]) {
            const oldConfig = { ...PHASE_CONFIG[phaseKey] };
            PHASE_CONFIG[phaseKey] = { ...PHASE_CONFIG[phaseKey], ...newConfig[phaseKey] };

            console.log(`✅ ${phaseKey}: 
                Alt: ${(oldConfig.scrollStart * 100).toFixed(0)}%-${(oldConfig.scrollEnd * 100).toFixed(0)}%
                Neu: ${(PHASE_CONFIG[phaseKey].scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG[phaseKey].scrollEnd * 100).toFixed(0)}%`);
        }
    });

    return validatePhaseConsistency();
};

/**
 * VALIDIERUNGS-FUNKTION für 4 Phasen
 */
export const validatePhaseConsistency = () => {
    const testCases = [
        { progress: 0.04, expectedPhase: 0, description: 'Logo-Bereich' },
        { progress: PHASE_CONFIG.phase1.scrollStart, expectedPhase: 1, description: 'Start Phase 1' },
        { progress: (PHASE_CONFIG.phase1.scrollStart + PHASE_CONFIG.phase1.scrollEnd) / 2, expectedPhase: 1, description: 'Mitte Phase 1' },
        { progress: PHASE_CONFIG.phase1.scrollEnd - 0.01, expectedPhase: 1, description: 'Ende Phase 1' },
        { progress: PHASE_CONFIG.phase2.scrollStart, expectedPhase: 2, description: 'Start Phase 2' },
        { progress: PHASE_CONFIG.phase2.scrollEnd - 0.01, expectedPhase: 2, description: 'Ende Phase 2' },
        { progress: PHASE_CONFIG.phase3.scrollStart, expectedPhase: 3, description: 'Start Phase 3' },
        { progress: PHASE_CONFIG.phase3.scrollEnd - 0.01, expectedPhase: 3, description: 'Ende Phase 3' },
        { progress: PHASE_CONFIG.phase4.scrollStart, expectedPhase: 4, description: 'Start Phase 4' },
        { progress: PHASE_CONFIG.phase4.scrollEnd - 0.01, expectedPhase: 4, description: 'Ende Phase 4' },
        { progress: 1.3, expectedPhase: 0, description: 'Nach allen Phasen' }
    ];

    const results = testCases.map(test => {
        const actualPhase = getActivePhaseFromScroll(test.progress);
        const isCorrect = actualPhase === test.expectedPhase;

        return {
            ...test,
            actualPhase,
            isCorrect,
            status: isCorrect ? '✅' : '❌'
        };
    });

    const allCorrect = results.every(r => r.isCorrect);

    console.log('🔍 PHASE-VALIDIERUNG (4 PHASEN):', allCorrect ? '✅ ALLE KORREKT' : '❌ FEHLER GEFUNDEN');
    results.forEach(r => {
        console.log(`${r.status} ${r.description}: ${r.progress} → Phase ${r.actualPhase} (erwartet: ${r.expectedPhase})`);
    });

    return allCorrect;
};

/**
 * 📊 AKTUELLE KONFIGURATION ANZEIGEN für 4 Phasen
 */
export const showCurrentConfig = () => {
    console.log('🎛️ AKTUELLE ZENTRALE KONFIGURATION (4 PHASEN - OHNE Logo):');
    console.log('================================================================');

    Object.keys(PHASE_CONFIG).forEach(phaseKey => {
        const config = PHASE_CONFIG[phaseKey];
        console.log(`${phaseKey.toUpperCase()}: ${(config.scrollStart * 100).toFixed(0)}%-${(config.scrollEnd * 100).toFixed(0)}%`);
        console.log(`  📝 Titel: "${config.title}"`);
        console.log(`  🎵 Audio: ${config.audioPath}.mp3`);
        console.log(`  📊 Debug: ${config.debugStart}-${config.debugEnd}`);
        console.log('');
    });

    console.log('🎨 LOGO-KONFIGURATION: Siehe logoConfig.js');
    return getAllPhaseRanges();
};

// ✅ VOLLSTÄNDIGER EXPORT OHNE Logo-Funktionen
export default {
    PHASE_CONFIG,
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getTitleTextForPhase,
    getPhaseDebugInfo,
    getAllPhaseRanges,
    validatePhaseConsistency,
    // ✅ ENTFERNT: getLogoConfigForPhase (jetzt in logoConfig.js)
    updatePhaseConfig,
    showCurrentConfig
};