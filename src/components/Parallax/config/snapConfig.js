// src/components/Parallax/config/snapConfig.js

/**
 * 🎯 SNAP-SPEED KONFIGURATION
 * Zentrale Verwaltung aller Scroll-Übergangs-Geschwindigkeiten
 * 
 * Rationale:
 * - Phase 1-2: Mehr Scroll-Raum → moderate Geschwindigkeit  
 * - Phase 3-4: Weniger Scroll-Raum → langsamere Übergänge für bessere UX
 * - Mobile: Generell schneller für Touch-Optimierung
 */

// ===== DEVICE DETECTION =====
export const detectDevice = () => {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Mobile Detection: Touch + kleine Bildschirme
    if (isTouchDevice && width < 768) return 'mobile';
    if (width < 480) return 'mobile';

    return 'desktop';
};

// ===== SNAP-GESCHWINDIGKEITEN =====
export const SNAP_SPEED_CONFIG = {

    // 🖥️ DESKTOP KONFIGURATION
    desktop: {
        // Standard-Phasen (mehr Scroll-Raum)
        phase1: 2.8,     // Von Uns Heißt Für Uns - moderate Speed
        phase2: 2.8,     // Der Weg Ist Das Ziel - moderate Speed

        // Kompakte Phasen (weniger Scroll-Raum) 
        phase3: 2.8,     // Die Community Heißt - langsamer für bessere UX
        phase4: 2.8,     // AniTune - langsamer für bessere UX
        phase5: 2.5,     // Weitere Titel (falls hinzugefügt)
        phase6: 2.2,     // Carousel-Phase

        // Spezielle Übergänge
        phase0to1: 3.5,  // Logo → Erster Titel (Zoom-Effekt, extra langsam)
        phase6to7: 2.5,  // Carousel → Newsletter
        phase1to0: 2.8,  // Zurück zum Logo (etwas langsamer)

        // Standard-Fallbacks
        default: 2.25,   // Wenn keine spezifische Konfiguration gefunden
        backToLogo: 3.0, // Alle → Logo Übergänge

        // Easing-Konfiguration
        easing: {
            default: 'power2.inOut',
            zoom: 'power2.inOut',      // Für phase0to1
            smooth: 'power1.inOut',    // Für phase3-4 (sanfter)
            quick: 'power3.out'        // Für schnelle Übergänge
        }
    },

    // 📱 MOBILE KONFIGURATION
    mobile: {
        // Globaler Multiplikator für Mobile (20% schneller)
        globalMultiplier: 0.8,

        // TBD: Später bei Mobile-Optimierung definieren
        // Basis-Werte für jetzt:
        phase1: 1.6,     // 2.0 * 0.8
        phase2: 1.6,     // 2.0 * 0.8  
        phase3: 2.2,     // 2.8 * 0.8
        phase4: 2.2,     // 2.8 * 0.8
        phase5: 2.0,     // 2.5 * 0.8
        phase6: 1.8,     // 2.2 * 0.8

        phase0to1: 2.8,  // 3.5 * 0.8
        phase6to7: 2.0,  // 2.5 * 0.8
        phase1to0: 2.2,  // 2.8 * 0.8

        default: 1.8,    // 2.25 * 0.8
        backToLogo: 2.4, // 3.0 * 0.8

        easing: {
            default: 'power2.out',     // Mobile: Schnappiger
            zoom: 'power2.inOut',
            smooth: 'power1.out',
            quick: 'power3.out'
        }
    }
};

// ===== LOCK-DELAYS (Zeit die Scroll gesperrt bleibt) =====
export const SNAP_LOCK_CONFIG = {
    desktop: {
        default: 450,    // 50% länger als vorher (300ms)
        zoom: 600,       // Phase 0→1 länger gesperrt
        quick: 300       // Schnelle Übergänge weniger gesperrt
    },
    mobile: {
        default: 360,    // Mobile: 20% kürzer 
        zoom: 480,
        quick: 240
    }
};

// ===== HELPER FUNCTIONS =====

/**
 * Ermittelt die optimale Snap-Dauer für einen Phasen-Übergang
 * @param {number} fromPhase - Aktuelle Phase (0-8)
 * @param {number} toPhase - Ziel-Phase (0-8)
 * @param {string} device - 'desktop' oder 'mobile' (optional, wird automatisch erkannt)
 * @returns {number} Dauer in Sekunden
 */
export const getSnapDurationForTransition = (fromPhase, toPhase, device = null) => {
    const detectedDevice = device || detectDevice();
    const config = SNAP_SPEED_CONFIG[detectedDevice];

    if (!config) {
        console.warn(`Snap-Config für Device '${detectedDevice}' nicht gefunden. Nutze Desktop-Fallback.`);
        return SNAP_SPEED_CONFIG.desktop.default;
    }

    // Spezielle Übergangs-Regeln
    const transitionKey = `phase${fromPhase}to${toPhase}`;
    if (config[transitionKey]) {
        return config[transitionKey];
    }

    // Zurück zum Logo (von jeder Phase)
    if (toPhase === 0) {
        return config.backToLogo || config.default;
    }

    // Phase-spezifische Geschwindigkeit (Ziel-Phase bestimmt)
    const phaseKey = `phase${toPhase}`;
    if (config[phaseKey]) {
        return config[phaseKey];
    }

    // Fallback
    return config.default;
};

/**
 * Ermittelt das optimale Easing für einen Übergang
 * @param {number} fromPhase - Aktuelle Phase
 * @param {number} toPhase - Ziel-Phase  
 * @param {string} device - Device-Type
 * @returns {string} GSAP-Easing String
 */
export const getSnapEasingForTransition = (fromPhase, toPhase, device = null) => {
    const detectedDevice = device || detectDevice();
    const config = SNAP_SPEED_CONFIG[detectedDevice];

    if (!config?.easing) {
        return 'power2.inOut'; // Sicherer Fallback
    }

    // Spezielle Easing-Regeln
    if (fromPhase === 0 && toPhase === 1) {
        return config.easing.zoom;  // Zoom-Effekt
    }

    if (toPhase >= 3 && toPhase <= 4) {
        return config.easing.smooth; // Kompakte Phasen sanfter
    }

    if (Math.abs(toPhase - fromPhase) === 1) {
        return config.easing.default; // Benachbarte Phasen
    }

    return config.easing.quick; // Sprung über mehrere Phasen
};

/**
 * Ermittelt die Lock-Delay für einen Übergang
 * @param {number} fromPhase - Aktuelle Phase
 * @param {number} toPhase - Ziel-Phase
 * @param {string} device - Device-Type
 * @returns {number} Lock-Delay in Millisekunden
 */
export const getSnapLockDelayForTransition = (fromPhase, toPhase, device = null) => {
    const detectedDevice = device || detectDevice();
    const config = SNAP_LOCK_CONFIG[detectedDevice];

    if (!config) {
        return SNAP_LOCK_CONFIG.desktop.default;
    }

    // Zoom-Übergang braucht längere Sperre
    if (fromPhase === 0 && toPhase === 1) {
        return config.zoom;
    }

    // Schnelle Übergänge (1 Phase) brauchen weniger Sperre
    if (Math.abs(toPhase - fromPhase) === 1) {
        return config.quick;
    }

    return config.default;
};

// ===== DEBUG FUNCTIONS =====

/**
 * Debug-Info für aktuelle Snap-Konfiguration
 * @returns {Object} Debug-Informationen
 */
export const getSnapConfigDebugInfo = () => {
    const device = detectDevice();
    const config = SNAP_SPEED_CONFIG[device];

    return {
        device,
        config: config || 'Nicht gefunden',
        isConfigured: !!config,
        exampleTransitions: {
            'Logo → Titel 1': getSnapDurationForTransition(0, 1) + 's',
            'Titel 1 → Titel 2': getSnapDurationForTransition(1, 2) + 's',
            'Titel 2 → Titel 3': getSnapDurationForTransition(2, 3) + 's',
            'Titel 3 → Titel 4': getSnapDurationForTransition(3, 4) + 's',
            'Carousel → Newsletter': getSnapDurationForTransition(6, 7) + 's'
        },
        easingExamples: {
            'Logo → Titel 1': getSnapEasingForTransition(0, 1),
            'Titel 1 → Titel 2': getSnapEasingForTransition(1, 2),
            'Titel 2 → Titel 3': getSnapEasingForTransition(2, 3)
        }
    };
};

/**
 * Validiert die Snap-Konfiguration auf Vollständigkeit
 * @returns {Array} Array von Warnungen/Fehlern
 */
export const validateSnapConfig = () => {
    const warnings = [];

    ['desktop', 'mobile'].forEach(device => {
        const config = SNAP_SPEED_CONFIG[device];
        if (!config) {
            warnings.push(`❌ Keine Konfiguration für ${device}`);
            return;
        }

        // Prüfe wichtige Phasen
        [1, 2, 3, 4].forEach(phase => {
            if (!config[`phase${phase}`]) {
                warnings.push(`⚠️ ${device}: Keine Konfiguration für Phase ${phase}`);
            }
        });

        // Prüfe spezielle Übergänge
        if (!config.phase0to1) {
            warnings.push(`⚠️ ${device}: Kein phase0to1 (Zoom-Übergang)`);
        }

        if (!config.default) {
            warnings.push(`❌ ${device}: Kein Default-Wert`);
        }
    });

    return warnings;
};

// ===== EXPORT DEFAULT =====
export default {
    SNAP_SPEED_CONFIG,
    SNAP_LOCK_CONFIG,
    detectDevice,
    getSnapDurationForTransition,
    getSnapEasingForTransition,
    getSnapLockDelayForTransition,
    getSnapConfigDebugInfo,
    validateSnapConfig
};