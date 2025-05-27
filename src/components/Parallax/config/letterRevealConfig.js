// src/components/Parallax/config/letterRevealConfig.js

/**
 * 🎭 LETTER-REVEAL EFFEKT-KONFIGURATIONEN
 * Basierend auf dem AniTune Letter-Reveal HTML
 */

// ===== VERFÜGBARE EFFEKTE =====
export const LETTER_REVEAL_EFFECTS = {
    // 🎭 Standard Reveal - Exakt wie im Original-Code
    standard: {
        name: 'Standard Reveal',
        description: 'Fade-in mit Scale und Blur (exakt wie im Original)',
        config: {
            duration: 0.5,        // Wie im Original
            delay: 0.1,           // Kurze Anfangsverzögerung
            stagger: 0.2,         // 0.2s zwischen Buchstaben (wie im Original)
            ease: 'power2.out',   // Entspricht CSS ease-out
            startScale: 0.8,      // Wie im Original
            endScale: 1,          // Wie im Original
            startBlur: 5,         // 5px Blur wie im Original
            endBlur: 0,           // Kein Blur am Ende
            startOpacity: 0,      // Unsichtbar am Anfang
            endOpacity: 1         // Vollständig sichtbar am Ende
        }
    },

    // ➡️ Slide In - Erweiterte Variante
    slide: {
        name: 'Slide In',
        description: 'Slide von links mit Scale-Effekt',
        config: {
            duration: 0.6,
            delay: 0.2,
            stagger: 0.12,
            ease: 'power2.out',
            startScale: 0.7,
            endScale: 1,
            startBlur: 8,
            endBlur: 0,
            startOpacity: 0,
            endOpacity: 1,
            startX: -30, // Zusätzliche X-Bewegung
            endX: 0
        }
    },

    // 🎾 Bounce In - Wie im Original
    bounce: {
        name: 'Bounce In',
        description: 'Elastischer Bounce-Effekt',
        config: {
            duration: 0.8,
            delay: 0.1,
            stagger: 0.1,
            ease: 'back.out(2)', // Starker Bounce
            startScale: 0,
            endScale: 1,
            startBlur: 0, // Kein Blur für cleanen Bounce
            endBlur: 0,
            startOpacity: 0,
            endOpacity: 1,
            overshoot: 1.15 // Bounce über Zielgröße hinaus
        }
    },

    // ✨ Glow Effect - Mit Leucht-Animation
    glow: {
        name: 'Glow Effect',
        description: 'Standard + kontinuierlicher Glow-Effekt',
        config: {
            duration: 0.7,
            delay: 0.4,
            stagger: 0.18,
            ease: 'power2.out',
            startScale: 0.8,
            endScale: 1,
            startBlur: 5,
            endBlur: 0,
            startOpacity: 0,
            endOpacity: 1,
            glow: true, // Aktiviert kontinuierlichen Glow
            glowColor: 'rgba(102, 126, 234, 0.6)',
            glowDuration: 2.0
        }
    },

    // 🌊 Wave - Wellenförmiger Effekt
    wave: {
        name: 'Wave Effect',
        description: 'Schnelle Welle durch die Buchstaben',
        config: {
            duration: 0.4,
            delay: 0.1,
            stagger: 0.08, // Schnellerer Stagger für Welleneffekt
            ease: 'power3.out',
            startScale: 0.9,
            endScale: 1,
            startBlur: 3,
            endBlur: 0,
            startOpacity: 0,
            endOpacity: 1,
            startY: 20, // Zusätzliche Y-Bewegung
            endY: 0
        }
    },

    // 🎬 Cinematic - Langsam und dramatisch
    cinematic: {
        name: 'Cinematic',
        description: 'Langsamer, dramatischer Aufbau',
        config: {
            duration: 1.2,
            delay: 0.8,
            stagger: 0.25,
            ease: 'power1.inOut',
            startScale: 0.6,
            endScale: 1,
            startBlur: 10,
            endBlur: 0,
            startOpacity: 0,
            endOpacity: 1,
            startY: 40,
            endY: 0
        }
    }
};

// ===== TIMING-GESCHWINDIGKEITEN =====
export const LETTER_REVEAL_SPEEDS = {
    slow: {
        name: 'Langsam',
        multiplier: 2.0,
        description: 'Doppelt so langsam'
    },
    normal: {
        name: 'Normal',
        multiplier: 1.0,
        description: 'Standard-Geschwindigkeit'
    },
    fast: {
        name: 'Schnell',
        multiplier: 0.5,
        description: 'Doppelt so schnell'
    },
    instant: {
        name: 'Sofort',
        multiplier: 0.1,
        description: 'Sehr schnell für Tests'
    }
};

// ===== TITEL-SPEZIFISCHE KONFIGURATIONEN =====
// ✅ ALLE TITEL MIT STANDARD-EFFEKT (wie im Original-Code)
export const TITLE_SPECIFIC_CONFIGS = {
    // Phase 1: "Von Uns Ist Für Uns"
    phase1: {
        effect: 'standard',
        speed: 'normal'
    },

    // Phase 2: "Der Weg"  
    phase2: {
        effect: 'standard',
        speed: 'normal'
    },

    // Phase 3: "Ist Das Ziel"
    phase3: {
        effect: 'standard',
        speed: 'normal'
    },

    // Phase 4: "Die Community"
    phase4: {
        effect: 'standard',
        speed: 'normal'
    },

    // Phase 5: "Heißt"
    phase5: {
        effect: 'standard',
        speed: 'normal'
    },

    // Phase 6: "AniTune"
    phase6: {
        effect: 'standard',
        speed: 'normal'
    }
};

// ===== UTILITY-FUNKTIONEN =====

/**
 * Erstelle Animationskonfiguration für einen spezifischen Titel
 */
export function getLetterRevealConfig(titleIndex, effectName = null, speedName = 'normal') {
    // Hole titel-spezifische Konfiguration
    const titleConfig = TITLE_SPECIFIC_CONFIGS[`phase${titleIndex}`] || {};

    // Bestimme Effekt (Parameter > titel-spezifisch > Standard)
    const effectKey = effectName || titleConfig.effect || 'standard';
    const effect = LETTER_REVEAL_EFFECTS[effectKey] || LETTER_REVEAL_EFFECTS.standard;

    // Bestimme Geschwindigkeit
    const speedKey = speedName || titleConfig.speed || 'normal';
    const speed = LETTER_REVEAL_SPEEDS[speedKey] || LETTER_REVEAL_SPEEDS.normal;

    // Kombiniere Konfigurationen
    const baseConfig = { ...effect.config };
    const customConfig = titleConfig.customConfig || {};

    // Wende Geschwindigkeits-Multiplikator an
    const finalConfig = {
        ...baseConfig,
        ...customConfig,
        duration: (customConfig.duration || baseConfig.duration) * speed.multiplier,
        delay: (customConfig.delay || baseConfig.delay) * speed.multiplier,
        stagger: (customConfig.stagger || baseConfig.stagger) * speed.multiplier
    };

    return {
        effectName: effect.name,
        speedName: speed.name,
        config: finalConfig
    };
}

/**
 * Hole alle verfügbaren Effekt-Namen
 */
export function getAvailableEffects() {
    return Object.keys(LETTER_REVEAL_EFFECTS).map(key => ({
        key,
        name: LETTER_REVEAL_EFFECTS[key].name,
        description: LETTER_REVEAL_EFFECTS[key].description
    }));
}

/**
 * Hole alle verfügbaren Geschwindigkeiten
 */
export function getAvailableSpeeds() {
    return Object.keys(LETTER_REVEAL_SPEEDS).map(key => ({
        key,
        name: LETTER_REVEAL_SPEEDS[key].name,
        description: LETTER_REVEAL_SPEEDS[key].description,
        multiplier: LETTER_REVEAL_SPEEDS[key].multiplier
    }));
}

/**
 * Debug-Funktion: Zeige Konfiguration für alle Titel
 */
export function getDebugTitleConfigs() {
    const configs = {};

    for (let i = 1; i <= 6; i++) {
        configs[`phase${i}`] = getLetterRevealConfig(i);
    }

    return configs;
}

// ===== STANDARD-EXPORT =====
export default {
    effects: LETTER_REVEAL_EFFECTS,
    speeds: LETTER_REVEAL_SPEEDS,
    titleConfigs: TITLE_SPECIFIC_CONFIGS,
    getConfig: getLetterRevealConfig,
    getEffects: getAvailableEffects,
    getSpeeds: getAvailableSpeeds,
    debug: getDebugTitleConfigs
};