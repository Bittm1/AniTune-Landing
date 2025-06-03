// src/components/Parallax/utils/phaseUtils.js
// ✅ ZENTRALE PHASE-DEFINITION - Single Source of Truth mit Phase 4

/**
 * 🎛️ ZENTRALE BEREICH-KONFIGURATION
 * ✅ HIER steuerst du ALLE Titel- und Audio-Trigger!
 */
export const PHASE_CONFIG = {
    // 🎯 BESTEHENDE PHASEN (deine aktuellen Einstellungen)
    phase1: {
        scrollStart: 0.05,  // 5%
        scrollEnd: 0.50,    // 50%
        debugStart: '2%',
        debugEnd: '20%',
        title: 'Von Uns Heißt Für Uns',
        audioPath: '/audio/von-uns-heißt-fuer-uns'
    },

    phase2: {
        scrollStart: 0.50,  // 50%
        scrollEnd: 0.8,     // 80% (deine Anpassung)
        debugStart: '20%',
        debugEnd: '30%',
        title: 'Der Weg Ist Das Ziel',
        audioPath: '/audio/der-weg-ist-das-ziel'
    },

    phase3: {
        scrollStart: 0.8,   // 80% (deine Anpassung)
        scrollEnd: 1.2,     // 120% (deine Anpassung)
        debugStart: '30%',
        debugEnd: '40%',
        title: 'Die Community Heißt',
        audioPath: '/audio/die-community-heißt'
    },

    // ✅ NEU: PHASE 4 - ANITUNE THEME + LOGO
    phase4: {
        scrollStart: 1.2,   // 120% - direkt nach deiner Phase 3
        scrollEnd: 1.6,     // 160% - genug Zeit für Theme + Logo
        debugStart: '48%',
        debugEnd: '64%',
        title: 'AniTune',   // Titel für das Logo
        audioPath: '/audio/anitune-theme', // ✅ DEIN THEME-AUDIO

        // ✅ NEU: Flexible Logo-Konfiguration
        showLogo: true,     // Flag für Logo-Anzeige
        logoConfig: {
            // ✅ ANPASSBARE POSITION
            position: {
                top: '50%',     // ✅ Du kannst ändern: '40%', '60%', etc.
                left: '50%',    // ✅ Du kannst ändern: '30%', '70%', etc.
                transform: 'translate(-50%, -50%)' // ✅ Für perfekte Zentrierung
            },

            // ✅ ANPASSBARE GRÖSSE & STYLING
            scale: 2.0,         // ✅ Du kannst ändern: 1.5, 2.5, etc.
            width: '300px',     // ✅ Du kannst ändern: '200px', '400px', etc.
            height: '300px',    // ✅ Du kannst ändern: '200px', '400px', etc.

            // ✅ ANPASSBARER Z-INDEX
            zIndex: 100,        // ✅ Du kannst ändern: 50, 150, 200, etc.

            // ✅ ANIMATION & EFFEKTE
            animation: 'fadeScale', // ✅ Du kannst ändern: 'popIn', 'fade', etc.
            opacity: 1.0,       // ✅ Du kannst ändern: 0.8, 0.9, etc.

            // ✅ ERWEITERTE STYLING-OPTIONEN
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))', // Glow-Effekt
            transition: 'all 0.8s ease-in-out' // Smooth Transitions
        }
    }
};

/**
 * 🎯 ERWEITERTE PHASE-ERKENNUNG für 4 Phasen
 * Diese Funktion bestimmt für ALLE Systeme (Titel + Audio) die aktuelle Phase
 * ✅ Nutzt die zentrale PHASE_CONFIG - ändere die Bereiche dort!
 * 
 * @param {number} scrollProgress - Scroll-Fortschritt (0-2.5)
 * @returns {number} Phase-Nummer (0-4)
 */
export const getActivePhaseFromScroll = (scrollProgress) => {
    // ✅ ZENTRAL GESTEUERT: Nutzt PHASE_CONFIG
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
        return 4; // ✅ NEU: Phase 4: AniTune Theme + Logo
    }

    return 0; // Phase 0: Logo/Newsletter oder andere Bereiche
};

/**
 * 🎵 ERWEITERTE AUDIO-MAPPING für 4 Phasen
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
    // ✅ NEU: Phase 4 Audio-Konfiguration
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
 * 🎭 ERWEITERTE TITEL-MAPPING für 4 Phasen
 * Ordnet Phase-Nummern den entsprechenden Titel-Texten zu
 * ✅ Nutzt zentrale PHASE_CONFIG
 */
export const getTitleTextForPhase = (phase) => {
    if (phase === 1) return PHASE_CONFIG.phase1.title;
    if (phase === 2) return PHASE_CONFIG.phase2.title;
    if (phase === 3) return PHASE_CONFIG.phase3.title;
    if (phase === 4) return PHASE_CONFIG.phase4.title; // ✅ NEU
    return null; // Phase 0 = kein Titel
};

/**
 * ✅ NEU: FLEXIBLE LOGO-KONFIGURATION für Phase 4
 */
export const getLogoConfigForPhase = (phase) => {
    if (phase === 4 && PHASE_CONFIG.phase4.showLogo) {
        const logoConfig = PHASE_CONFIG.phase4.logoConfig;

        return {
            show: true,

            // ✅ FLEXIBLE POSITION (du kannst in PHASE_CONFIG ändern)
            position: logoConfig.position,

            // ✅ GRÖSSE & SKALIERUNG
            scale: logoConfig.scale,
            width: logoConfig.width,
            height: logoConfig.height,

            // ✅ Z-INDEX (du kannst in PHASE_CONFIG ändern)
            zIndex: logoConfig.zIndex,

            // ✅ STYLING & EFFEKTE
            opacity: logoConfig.opacity,
            filter: logoConfig.filter,
            transition: logoConfig.transition,

            // ✅ ANIMATION
            animation: logoConfig.animation,

            // ✅ KOMPLETTES STYLE-OBJEKT für direktes Anwenden
            style: {
                position: 'fixed',
                top: logoConfig.position.top,
                left: logoConfig.position.left,
                transform: logoConfig.position.transform,
                width: logoConfig.width,
                height: logoConfig.height,
                zIndex: logoConfig.zIndex,
                opacity: logoConfig.opacity,
                filter: logoConfig.filter,
                transition: logoConfig.transition,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none'
            }
        };
    }
    return null; // Andere Phasen = kein spezielles Logo
};

/**
 * 🔍 ERWEITERTE DEBUG-HILFSFUNKTION für 4 Phasen
 * Zeigt alle Informationen für eine bestimmte scrollProgress
 * ✅ Nutzt zentrale PHASE_CONFIG
 */
export const getPhaseDebugInfo = (scrollProgress) => {
    const phase = getActivePhaseFromScroll(scrollProgress);
    const audioConfig = getAudioConfigForPhase(phase);
    const titleText = getTitleTextForPhase(phase);
    const logoConfig = getLogoConfigForPhase(phase); // ✅ NEU

    // Ermittle aktuellen Bereich
    let phaseRange = 'Logo/Andere';
    if (phase === 1) phaseRange = `${(PHASE_CONFIG.phase1.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase1.scrollEnd * 100).toFixed(0)}%`;
    else if (phase === 2) phaseRange = `${(PHASE_CONFIG.phase2.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase2.scrollEnd * 100).toFixed(0)}%`;
    else if (phase === 3) phaseRange = `${(PHASE_CONFIG.phase3.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase3.scrollEnd * 100).toFixed(0)}%`;
    else if (phase === 4) phaseRange = `${(PHASE_CONFIG.phase4.scrollStart * 100).toFixed(0)}%-${(PHASE_CONFIG.phase4.scrollEnd * 100).toFixed(0)}%`; // ✅ NEU

    return {
        scrollProgress: scrollProgress.toFixed(3),
        debugPercentage: (scrollProgress * 40).toFixed(1) + '%',
        phase,
        titleText,
        audioConfig: audioConfig ? audioConfig.title : 'Kein Audio',
        audioPath: audioConfig ? audioConfig.basePath + '.mp3' : 'Kein Pfad',

        // ✅ NEU: Erweiterte Logo-Info
        logoConfig: logoConfig ?
            `Logo (${logoConfig.position.top}/${logoConfig.position.left}, Z:${logoConfig.zIndex}, Scale:${logoConfig.scale})` :
            'Kein Logo',

        // Bereich-Info (aus PHASE_CONFIG)
        phaseRange,

        // ✅ ERWEITERT: Audio-Bereich jetzt 1-4
        isInAudioRange: phase >= 1 && phase <= 4,

        // ✅ ERWEITERT: Titel-Bereich jetzt 1-4  
        isInTitleRange: phase >= 1 && phase <= 4,

        // ✅ NEU: Logo-Bereich
        isInLogoRange: phase === 4,

        // ✅ ERWEITERT: Zentrale Konfiguration für alle 4 Phasen
        centralConfig: phase >= 1 && phase <= 4 ? PHASE_CONFIG[`phase${phase}`] : null
    };
};

/**
 * 📊 ERWEITERTE ALLE BEREICHE ANZEIGEN für 4 Phasen
 * Für Debugging und Übersicht
 */
export const getAllPhaseRanges = () => {
    return {
        phase0: { range: '0%-5% + 160%+', description: 'Logo/Newsletter/Carousel/etc.' },
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
            description: PHASE_CONFIG.phase4.title + ' (Theme + Logo)'
        }
    };
};

// ✅ ERWEITERTE VALIDIERUNGS-FUNKTION für 4 Phasen - Nutzt zentrale PHASE_CONFIG
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
        // ✅ NEU: Phase 4 Tests
        { progress: PHASE_CONFIG.phase4.scrollStart, expectedPhase: 4, description: 'Start Phase 4' },
        { progress: (PHASE_CONFIG.phase4.scrollStart + PHASE_CONFIG.phase4.scrollEnd) / 2, expectedPhase: 4, description: 'Mitte Phase 4' },
        { progress: PHASE_CONFIG.phase4.scrollEnd - 0.01, expectedPhase: 4, description: 'Ende Phase 4' },
        { progress: 1.7, expectedPhase: 0, description: 'Nach allen Phasen' }
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
 * 🎛️ ZENTRALE STEUERUNG - BEREICHE ÄNDERN
 * ✅ HIER kannst du die Bereiche für Titel UND Audio gleichzeitig ändern!
 * 
 * @param {Object} newConfig - Neue Phase-Konfiguration
 * @example
 * updatePhaseConfig({
 *   phase1: { scrollStart: 0.05, scrollEnd: 0.60 }, // "Von Uns" länger
 *   phase2: { scrollStart: 0.60, scrollEnd: 0.80 }, // "Der Weg" später
 *   phase3: { scrollStart: 0.80, scrollEnd: 1.0 },  // "Community" wie vorher
 *   phase4: { scrollStart: 1.0, scrollEnd: 1.4 }    // "AniTune" angepasst
 * });
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

    console.log('🔄 Validiere neue Bereiche...');
    return validatePhaseConsistency();
};

/**
 * 📊 AKTUELLE KONFIGURATION ANZEIGEN für 4 Phasen
 */
export const showCurrentConfig = () => {
    console.log('🎛️ AKTUELLE ZENTRALE KONFIGURATION (4 PHASEN):');
    console.log('===============================================');

    Object.keys(PHASE_CONFIG).forEach(phaseKey => {
        const config = PHASE_CONFIG[phaseKey];
        console.log(`${phaseKey.toUpperCase()}: ${(config.scrollStart * 100).toFixed(0)}%-${(config.scrollEnd * 100).toFixed(0)}%`);
        console.log(`  📝 Titel: "${config.title}"`);
        console.log(`  🎵 Audio: ${config.audioPath}.mp3`);
        console.log(`  📊 Debug: ${config.debugStart}-${config.debugEnd}`);

        // ✅ NEU: Logo-Info für Phase 4
        if (phaseKey === 'phase4') {
            console.log(`  🎨 Logo: ${config.showLogo ? 'Ja' : 'Nein'}`);
            if (config.showLogo) {
                console.log(`       Position: ${config.logoConfig.position.top}/${config.logoConfig.position.left}`);
                console.log(`       Z-Index: ${config.logoConfig.zIndex}`);
                console.log(`       Scale: ${config.logoConfig.scale}`);
            }
        }
        console.log('');
    });

    return getAllPhaseRanges();
};

// ✅ VOLLSTÄNDIGER EXPORT
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

    // ✅ NEU: Logo-Funktionen
    getLogoConfigForPhase,

    // ✅ NEU: Zentrale Steuerung
    updatePhaseConfig,
    showCurrentConfig
};