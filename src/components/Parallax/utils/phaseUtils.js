// src/components/Parallax/utils/phaseUtils.js
// ✅ ZENTRALE PHASE-DEFINITION - Single Source of Truth

/**
 * 🎯 ZENTRALE PHASE-BEREICHE
 * Diese Funktion bestimmt für ALLE Systeme (Titel + Audio) die aktuelle Phase
 * ✅ Nutzt die zentrale PHASE_CONFIG - ändere die Bereiche dort!
 * 
 * @param {number} scrollProgress - Scroll-Fortschritt (0-2.5)
 * @returns {number} Phase-Nummer (0-3)
 */
export const getActivePhaseFromScroll = (scrollProgress) => {
    // ✅ ZENTRAL GESTEUERT: Nutzt PHASE_CONFIG von oben
    if (scrollProgress >= PHASE_CONFIG.phase1.scrollStart && scrollProgress < PHASE_CONFIG.phase1.scrollEnd) {
        return 1; // Phase 1: Erster Titel
    }
    else if (scrollProgress >= PHASE_CONFIG.phase2.scrollStart && scrollProgress < PHASE_CONFIG.phase2.scrollEnd) {
        return 2; // Phase 2: Zweiter Titel
    }
    else if (scrollProgress >= PHASE_CONFIG.phase3.scrollStart && scrollProgress < PHASE_CONFIG.phase3.scrollEnd) {
        return 3; // Phase 3: Dritter Titel
    }

    return 0; // Phase 0: Logo/Newsletter oder andere Bereiche
};

/**
 * 🎵 AUDIO-MAPPING
 * Ordnet Phase-Nummern den entsprechenden Audio-Dateien zu
 * ✅ Nutzt zentrale PHASE_CONFIG
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

    return null; // Phase 0 = kein Audio
};

/**
 * 🎭 TITEL-MAPPING
 * Ordnet Phase-Nummern den entsprechenden Titel-Texten zu
 * ✅ Nutzt zentrale PHASE_CONFIG
 */
export const getTitleTextForPhase = (phase) => {
    if (phase === 1) return PHASE_CONFIG.phase1.title;
    if (phase === 2) return PHASE_CONFIG.phase2.title;
    if (phase === 3) return PHASE_CONFIG.phase3.title;
    return null; // Phase 0 = kein Titel
};

/**
 * 🔍 DEBUG-HILFSFUNKTION
 * Zeigt alle Informationen für eine bestimmte scrollProgress
 * ✅ Nutzt zentrale PHASE_CONFIG
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

    return {
        scrollProgress: scrollProgress.toFixed(3),
        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
        phase,
        titleText,
        audioConfig: audioConfig ? audioConfig.title : 'Kein Audio',
        audioPath: audioConfig ? audioConfig.basePath + '.mp3' : 'Kein Pfad',

        // Bereich-Info (aus PHASE_CONFIG)
        phaseRange,

        // Ist in Audio-Bereich?
        isInAudioRange: phase >= 1 && phase <= 3,

        // Ist in Titel-Bereich?
        isInTitleRange: phase >= 1 && phase <= 3,

        // ✅ NEU: Zentrale Konfiguration anzeigen
        centralConfig: phase >= 1 && phase <= 3 ? PHASE_CONFIG[`phase${phase}`] : null
    };
};

/**
 * 🎛️ ZENTRALE BEREICH-KONFIGURATION
 * ✅ HIER steuerst du ALLE Titel- und Audio-Trigger!
 */
export const PHASE_CONFIG = {
    // 🎯 HIER ÄNDERST DU DIE BEREICHE FÜR TITEL UND AUDIO:
    phase1: {
        scrollStart: 0.05,  // 5% → ändere hier für späteren Start
        scrollEnd: 0.50,    // 50% → ändere hier für längere/kürzere Phase 1
        debugStart: '2%',   // Anzeige im Debug
        debugEnd: '20%',    // Anzeige im Debug
        title: 'Von Uns Heißt Für Uns',
        audioPath: '/audio/von-uns-heißt-fuer-uns'
    },

    phase2: {
        scrollStart: 0.50,  // 50% → DER WEG startet hier - ändere für späteren Start!
        scrollEnd: 0.75,    // 75% → ändere hier für längere/kürzere Phase 2
        debugStart: '20%',  // Anzeige im Debug  
        debugEnd: '30%',    // Anzeige im Debug
        title: 'Der Weg Ist Das Ziel',
        audioPath: '/audio/der-weg-ist-das-ziel'
    },

    phase3: {
        scrollStart: 0.75,  // 75% → DIE COMMUNITY startet hier
        scrollEnd: 1.0,     // 100% → Ende der Titel-Phasen
        debugStart: '30%',  // Anzeige im Debug
        debugEnd: '40%',    // Anzeige im Debug
        title: 'Die Community Heißt',
        audioPath: '/audio/die-community-heißt'
    }
};

/**
 * 📊 ALLE BEREICHE ANZEIGEN
 * Für Debugging und Übersicht
 */
export const getAllPhaseRanges = () => {
    return {
        phase0: { range: '0%-5% + 100%+', description: 'Logo/Newsletter/Carousel/etc.' },
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
        }
    };
};

// ✅ VALIDIERUNGS-FUNKTION - Nutzt zentrale PHASE_CONFIG
export const validatePhaseConsistency = () => {
    const testCases = [
        { progress: 0.04, expectedPhase: 0, description: 'Logo-Bereich' },
        { progress: PHASE_CONFIG.phase1.scrollStart, expectedPhase: 1, description: 'Start Phase 1' },
        { progress: (PHASE_CONFIG.phase1.scrollStart + PHASE_CONFIG.phase1.scrollEnd) / 2, expectedPhase: 1, description: 'Mitte Phase 1' },
        { progress: PHASE_CONFIG.phase1.scrollEnd - 0.01, expectedPhase: 1, description: 'Ende Phase 1' },
        { progress: PHASE_CONFIG.phase2.scrollStart, expectedPhase: 2, description: 'Start Phase 2' },
        { progress: (PHASE_CONFIG.phase2.scrollStart + PHASE_CONFIG.phase2.scrollEnd) / 2, expectedPhase: 2, description: 'Mitte Phase 2' },
        { progress: PHASE_CONFIG.phase2.scrollEnd - 0.01, expectedPhase: 2, description: 'Ende Phase 2' },
        { progress: PHASE_CONFIG.phase3.scrollStart, expectedPhase: 3, description: 'Start Phase 3' },
        { progress: (PHASE_CONFIG.phase3.scrollStart + PHASE_CONFIG.phase3.scrollEnd) / 2, expectedPhase: 3, description: 'Mitte Phase 3' },
        { progress: PHASE_CONFIG.phase3.scrollEnd - 0.01, expectedPhase: 3, description: 'Ende Phase 3' },
        { progress: 1.00, expectedPhase: 0, description: 'Nach Titeln' }
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

    console.log('🔍 PHASE-VALIDIERUNG (ZENTRAL):', allCorrect ? '✅ ALLE KORREKT' : '❌ FEHLER GEFUNDEN');
    results.forEach(r => {
        console.log(`${r.status} ${r.description}: ${r.progress} → Phase ${r.actualPhase} (erwartet: ${r.expectedPhase})`);
    });

    return allCorrect;
};

/**
 * 🎛️ ZENTRALE STEUERUNG - BEREICHE ÄNDERN
 * ✅ HIER kannst du die Bereiche für Titel UND Audio gleichzeitig ändern!
 * 
 * @param {Object} newConfig - Neue Phase-Konfiguration
 * @example
 * updatePhaseConfig({
 *   phase1: { scrollStart: 0.05, scrollEnd: 0.60 }, // "Von Uns" länger
 *   phase2: { scrollStart: 0.60, scrollEnd: 0.80 }, // "Der Weg" später
 *   phase3: { scrollStart: 0.80, scrollEnd: 1.0 }   // "Community" wie vorher
 * });
 */
export const updatePhaseConfig = (newConfig) => {
    console.log('🎛️ ZENTRALE BEREICH-ÄNDERUNG:');

    Object.keys(newConfig).forEach(phaseKey => {
        if (PHASE_CONFIG[phaseKey]) {
            const oldConfig = { ...PHASE_CONFIG[phaseKey] };
            PHASE_CONFIG[phaseKey] = { ...PHASE_CONFIG[phaseKey], ...newConfig[phaseKey] };

            console.log(`✅ ${phaseKey}: 
                Alt: ${(oldConfig.scrollStart * 100).toFixed(0)}%-${(oldConfig.scrollEnd * 100).toFixed(0)}%
                Neu: ${(PHASE_CONFIG[phaseKey].scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG[phaseKey].scrollEnd * 100).toFixed(0)}%`);
        }
    });

    console.log('🔄 Validiere neue Bereiche...');
    return validatePhaseConsistency();
};

/**
 * 📊 AKTUELLE KONFIGURATION ANZEIGEN
 */
export const showCurrentConfig = () => {
    console.log('🎛️ AKTUELLE ZENTRALE KONFIGURATION:');
    console.log('=====================================');

    Object.keys(PHASE_CONFIG).forEach(phaseKey => {
        const config = PHASE_CONFIG[phaseKey];
        console.log(`${phaseKey.toUpperCase()}: ${(config.scrollStart * 100).toFixed(0)}%-${(config.scrollEnd * 100).toFixed(0)}%`);
        console.log(`  📝 Titel: "${config.title}"`);
        console.log(`  🎵 Audio: ${config.audioPath}.mp3`);
        console.log(`  📊 Debug: ${config.debugStart}-${config.debugEnd}`);
        console.log('');
    });

    return getAllPhaseRanges();
};

export default {
    // Zentrale Konfiguration
    PHASE_CONFIG,

    // Kern-Funktionen
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getTitleTextForPhase,
    getPhaseDebugInfo,
    getAllPhaseRanges,
    validatePhaseConsistency,

    // ✅ NEU: Zentrale Steuerung
    updatePhaseConfig,
    showCurrentConfig
};