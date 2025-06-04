// src/components/Parallax/Elements/TitleAudioLayer.jsx - VERBESSERTE HINTERGRUNDMUSIK

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';

import {
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getPhaseDebugInfo,
    PHASE_CONFIG,
    getAllPhaseRanges
} from '../utils/phaseUtils';

// ✅ MOBILE DETECTION IMPORT
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    const isMobileViewport = window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isMobileViewport && isTouchDevice;
};

const TitleAudioLayer = ({ currentTitleIndex, isScrollLocked, scrollProgress = 0 }) => {
    const audioRefs = useRef([]);
    const currentAudioRef = useRef(null);
    const lastTriggeredPhaseRef = useRef(0);

    // Debouncing für Phase-Stabilität
    const phaseDebounceRef = useRef(null);
    const stablePhaseRef = useRef(0);

    // ✅ VERBESSERTE Hintergrundmusik Refs und States
    const backgroundMusicRef = useRef(null);
    const backgroundTweenRef = useRef(null);
    const lastScrollDirectionRef = useRef('none');
    const lastScrollProgressRef = useRef(0);
    const backgroundMusicWasPlayingRef = useRef(false); // ✅ GEÄNDERT: Tracking ob Musik gespielt wurde
    const lastPhase1to3StateRef = useRef(false); // ✅ NEU: Tracking ob wir in Phase 1-3 sind

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [buttonPortal, setButtonPortal] = useState(null);

    // Background Music States
    const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);
    const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
    const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0);

    // ✅ MOBILE DETECTION
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(isMobileDevice());
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Audio-Konfiguration aus zentraler phaseUtils.js
    const titleAudios = [
        getAudioConfigForPhase(1),
        getAudioConfigForPhase(2),
        getAudioConfigForPhase(3),
        getAudioConfigForPhase(4)
    ].filter(Boolean);

    // Portal Setup
    useEffect(() => {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'audio-controls-portal';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
        `;
        document.body.appendChild(buttonContainer);
        setButtonPortal(buttonContainer);

        return () => {
            if (document.body.contains(buttonContainer)) {
                document.body.removeChild(buttonContainer);
            }
        };
    }, []);

    // ✅ NUR DEVELOPMENT: Zeige zentrale Konfiguration beim Start
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🎛️ AUDIO-SYSTEM: Nutzt zentrale phaseUtils.js');
            console.log('📊 Zentrale Bereiche:', getAllPhaseRanges());
            console.log('🎵 Audio-Konfigurationen:');
            titleAudios.forEach((audio, index) => {
                console.log(`  Phase ${index + 1}: "${audio.title}" → ${audio.basePath}.mp3`);
            });
        }
    }, [titleAudios]);

    // ✅ VERBESSERTE Hintergrundmusik Fade-Funktionen
    const fadeBackgroundMusicIn = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current || !backgroundMusicEnabled) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 BACKGROUND: Fade In (${duration}s) - NEU STARTEN`);
        }

        if (backgroundTweenRef.current) {
            backgroundTweenRef.current.kill();
        }

        // ✅ WICHTIG: Immer von vorne starten
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current.volume = 0;
        setBackgroundMusicVolume(0);

        const playPromise = backgroundMusicRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setBackgroundMusicPlaying(true);
                    backgroundMusicWasPlayingRef.current = true; // ✅ TRACKING
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ BACKGROUND: Spielt erfolgreich (von Anfang)`);
                    }
                })
                .catch(error => {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`❌ BACKGROUND: Play-Fehler:`, error);
                    }
                });
        }

        backgroundTweenRef.current = gsap.to(backgroundMusicRef.current, {
            volume: 0.3,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                setBackgroundMusicVolume(backgroundMusicRef.current.volume);
            },
            onComplete: () => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ BACKGROUND: Fade In komplett`);
                }
            }
        });
    }, [backgroundMusicEnabled]);

    const fadeBackgroundMusicOut = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 BACKGROUND: Fade Out (${duration}s)`);
        }

        if (backgroundTweenRef.current) {
            backgroundTweenRef.current.kill();
        }

        backgroundTweenRef.current = gsap.to(backgroundMusicRef.current, {
            volume: 0,
            duration: duration,
            ease: 'power2.in',
            onUpdate: () => {
                setBackgroundMusicVolume(backgroundMusicRef.current.volume);
            },
            onComplete: () => {
                backgroundMusicRef.current.pause();
                setBackgroundMusicPlaying(false);
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ BACKGROUND: Fade Out komplett - GESTOPPT`);
                }
            }
        });
    }, []);

    // Scroll-Richtung erkennen
    const detectScrollDirection = useCallback((currentProgress) => {
        const lastProgress = lastScrollProgressRef.current;

        if (currentProgress > lastProgress) {
            lastScrollDirectionRef.current = 'down';
        } else if (currentProgress < lastProgress) {
            lastScrollDirectionRef.current = 'up';
        }

        lastScrollProgressRef.current = currentProgress;
        return lastScrollDirectionRef.current;
    }, []);

    // ✅ NEUE VERBESSERTE Hintergrundmusik-Logik
    useEffect(() => {
        if (!backgroundMusicEnabled || !backgroundMusicRef.current) return;

        const scrollDirection = detectScrollDirection(scrollProgress);
        const isInPhase1to3 = scrollProgress >= 0.05 && scrollProgress < 1.0;
        const isAtLogo = scrollProgress < 0.05;
        const isPhase4Plus = scrollProgress >= 1.0;

        // ✅ TRACKING: Sind wir in Phase 1-3?
        const wasInPhase1to3 = lastPhase1to3StateRef.current;
        lastPhase1to3StateRef.current = isInPhase1to3;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 BACKGROUND-LOGIC: Phase1-3=${isInPhase1to3}, Direction=${scrollDirection}, Playing=${backgroundMusicPlaying}, WasPlaying=${backgroundMusicWasPlayingRef.current}`);
        }

        // ✅ REGEL 1: Betrete Phase 1-3 → Musik starten (IMMER NEU)
        if (isInPhase1to3 && !wasInPhase1to3) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 BACKGROUND: BETRETE Phase 1-3 → Musik NEU starten`);
            }
            fadeBackgroundMusicIn(2.0);
        }

        // ✅ REGEL 2: Verlasse Phase 1-3 nach oben (Logo) → Schneller Fade Out
        else if (isAtLogo && wasInPhase1to3 && backgroundMusicPlaying) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 BACKGROUND: VERLASSE Phase 1-3 → Logo (SCHNELL)`);
            }
            fadeBackgroundMusicOut(1.0); // ✅ SCHNELLER: 1s statt 2s
        }

        // ✅ REGEL 3: Verlasse Phase 1-3 nach unten (Phase 4+) → SEHR SCHNELLER Fade Out
        else if (isPhase4Plus && wasInPhase1to3 && backgroundMusicPlaying) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 BACKGROUND: VERLASSE Phase 1-3 → Phase 4+ (SEHR SCHNELL)`);
            }
            fadeBackgroundMusicOut(0.8); // ✅ SEHR SCHNELL: 0.8s statt 3s
        }

        // ✅ REGEL 4: Reset Tracking wenn wir Phase 1-3 verlassen
        if (!isInPhase1to3 && wasInPhase1to3) {
            // Reset erfolgt automatisch beim nächsten Betreten von Phase 1-3
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 BACKGROUND: Phase 1-3 verlassen - bereit für Neustart`);
            }
        }

    }, [scrollProgress, backgroundMusicEnabled, backgroundMusicPlaying, fadeBackgroundMusicIn, fadeBackgroundMusicOut, detectScrollDirection]);

    // ✅ GEÄNDERT: Background Music Ende-Handler (keine "playedOnce" Sperre mehr)
    useEffect(() => {
        const audio = backgroundMusicRef.current;
        if (!audio) return;

        const handleEnded = () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 BACKGROUND: Song beendet - kann erneut gespielt werden`);
            }
            setBackgroundMusicPlaying(false);
            setBackgroundMusicVolume(0);
            // ✅ ENTFERNT: backgroundMusicPlayedOnceRef.current = true;
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    const stopAllAudio = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🛑 Stoppe alle Audio`);
        }
        audioRefs.current.forEach((audio, index) => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.onended = null;
            }
        });
        currentAudioRef.current = null;
    }, []);

    const playAudio = useCallback((audioIndex, reason = 'unknown') => {
        if (!isAudioEnabled) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔇 Audio deaktiviert - kein Play für ${audioIndex + 1}`);
            }
            return;
        }

        const audio = audioRefs.current[audioIndex];
        const audioConfig = titleAudios[audioIndex];

        // ✅ NUR DEVELOPMENT: Erweiterte Debug-Info mit zentraler Konfiguration
        if (process.env.NODE_ENV === 'development') {
            const debugInfo = getPhaseDebugInfo(scrollProgress);
            console.log(`🎵 CENTRALIZED PLAY-VERSUCH:`);
            console.log(`   🎯 Index: ${audioIndex} - "${audioConfig ? audioConfig.title : 'NICHT GEFUNDEN'}"`);
            console.log(`   📊 Phase Debug:`, debugInfo);
            console.log(`   🎛️ Zentrale Config: Phase ${audioIndex + 1} → ${debugInfo.phaseRange}`);
            console.log(`   ❓ Reason: ${reason}`);
        }

        if (!audio || !audioConfig) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`❌ CENTRALIZED FEHLER: Audio ${audioIndex + 1} nicht verfügbar`);
            }
            return;
        }

        if (audio.readyState < 2) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏳ Audio ${audioIndex + 1} noch nicht geladen - retry in 200ms`);
            }
            setTimeout(() => playAudio(audioIndex, reason), 200);
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 CENTRALIZED SPIELE: "${audioConfig.title}"`);
        }

        // Stoppe vorheriges Audio nur wenn notwendig
        if (currentAudioRef.current && currentAudioRef.current !== audio) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🛑 Stoppe vorheriges Audio`);
            }
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current.onended = null;
        }

        audio.currentTime = 0;
        audio.onended = () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔚 Audio "${audioConfig.title}" beendet`);
            }
            currentAudioRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ CENTRALIZED SPIELT: "${audioConfig.title}" (${audio.duration}s)`);
                    }
                })
                .catch(error => {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`❌ CENTRALIZED PLAY-FEHLER für "${audioConfig.title}":`, error);
                    }
                });
        }
    }, [isAudioEnabled, titleAudios, scrollProgress]);

    const toggleAudio = useCallback(() => {
        setIsAudioEnabled(prev => {
            const newState = !prev;
            if (!newState) {
                stopAllAudio();
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 Audio ${newState ? 'aktiviert' : 'deaktiviert'}`);
            }
            return newState;
        });
    }, [stopAllAudio]);

    const toggleBackgroundMusic = useCallback(() => {
        setBackgroundMusicEnabled(prev => {
            const newState = !prev;
            if (!newState && backgroundMusicPlaying) {
                fadeBackgroundMusicOut(1.0);
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 Hintergrundmusik ${newState ? 'aktiviert' : 'deaktiviert'}`);
            }
            return newState;
        });
    }, [backgroundMusicPlaying, fadeBackgroundMusicOut]);

    // ZENTRALE DEBOUNCED PHASE-ERKENNUNG
    const updateStablePhase = useCallback((newPhase) => {
        if (phaseDebounceRef.current) {
            clearTimeout(phaseDebounceRef.current);
        }

        phaseDebounceRef.current = setTimeout(() => {
            if (stablePhaseRef.current !== newPhase) {
                if (process.env.NODE_ENV === 'development') {
                    const debugInfo = getPhaseDebugInfo(scrollProgress);
                    console.log(`🎯 CENTRALIZED STABLE PHASE: ${stablePhaseRef.current} → ${newPhase}`);
                    console.log(`📊 Zentrale Debug-Info:`, debugInfo);
                }

                stablePhaseRef.current = newPhase;

                if (newPhase >= 1 && newPhase <= 4 && newPhase !== lastTriggeredPhaseRef.current) {
                    const audioIndex = newPhase - 1;

                    if (process.env.NODE_ENV === 'development') {
                        const debugInfo = getPhaseDebugInfo(scrollProgress);
                        console.log(`🎵 CENTRALIZED STABLE PHASE-WECHSEL: → Phase ${newPhase} - Starte Audio ${audioIndex + 1}`);
                        console.log(`🎛️ Zentrale Bereiche: ${debugInfo.phaseRange}`);
                    }

                    if (currentAudioRef.current) {
                        stopAllAudio();
                    }

                    setTimeout(() => {
                        playAudio(audioIndex, `centralized-stable-phase-${newPhase}`);
                    }, 50);

                    lastTriggeredPhaseRef.current = newPhase;
                }

                if (newPhase === 0 && lastTriggeredPhaseRef.current !== 0) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`🛑 CENTRALIZED STABLE PHASE-EXIT: Verlasse Titel-Bereiche`);
                    }
                    stopAllAudio();
                    lastTriggeredPhaseRef.current = 0;
                }
            }
        }, 300);
    }, [playAudio, stopAllAudio, scrollProgress]);

    // ZENTRALE SCROLL-PROGRESS PHASE-ERKENNUNG
    useEffect(() => {
        if (!isAudioEnabled) return;

        const currentPhase = getActivePhaseFromScroll(scrollProgress);

        if (process.env.NODE_ENV === 'development') {
            const debugInfo = getPhaseDebugInfo(scrollProgress);
            console.log(`📊 CENTRALIZED SCROLL-TRIGGER: Progress=${scrollProgress.toFixed(3)}, Phase=${currentPhase}, LastTriggered=${lastTriggeredPhaseRef.current}`);
            console.log(`🎛️ Zentrale Range: ${debugInfo.phaseRange}, Audio: ${debugInfo.audioConfig}`);
        }

        if (currentPhase >= 1 && currentPhase <= 4 && currentPhase !== lastTriggeredPhaseRef.current) {
            const audioIndex = currentPhase - 1;

            if (process.env.NODE_ENV === 'development') {
                const debugInfo = getPhaseDebugInfo(scrollProgress);
                console.log(`🎵 SYNC PHASE-WECHSEL: → Phase ${currentPhase} - Starte Audio ${audioIndex + 1} SOFORT`);
                console.log(`🎛️ Zentrale Bereiche: ${debugInfo.phaseRange}`);
            }

            if (currentAudioRef.current) {
                stopAllAudio();
            }

            playAudio(audioIndex, `sync-phase-${currentPhase}`);
            lastTriggeredPhaseRef.current = currentPhase;
        }

        if (currentPhase === 0 && lastTriggeredPhaseRef.current !== 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🛑 SYNC PHASE-EXIT: Verlasse Titel-Bereiche`);
            }
            stopAllAudio();
            lastTriggeredPhaseRef.current = 0;
        }

    }, [scrollProgress, isAudioEnabled, playAudio, stopAllAudio]);

    // Manual Play
    const manualPlayCurrentPhase = useCallback(() => {
        const currentPhase = getActivePhaseFromScroll(scrollProgress);

        if (process.env.NODE_ENV === 'development') {
            const debugInfo = getPhaseDebugInfo(scrollProgress);
            console.log(`👆 CENTRALIZED MANUAL PLAY:`);
            console.log(`   Progress: ${scrollProgress.toFixed(3)}, Phase: ${currentPhase}`);
            console.log(`   Zentrale Range: ${debugInfo.phaseRange}`);
            console.log(`   Audio Config: ${debugInfo.audioConfig}`);
        }

        if (currentPhase >= 1 && currentPhase <= 3) {
            const audioIndex = currentPhase - 1;
            const audioConfig = titleAudios[audioIndex];

            if (process.env.NODE_ENV === 'development') {
                console.log(`   → Spiele Audio ${audioIndex + 1}: ${audioConfig.title}`);
                console.log(`   → Pfad: ${audioConfig.basePath}.mp3`);
            }

            stopAllAudio();
            setTimeout(() => {
                playAudio(audioIndex, `centralized-manual-phase-${currentPhase}`);
                lastTriggeredPhaseRef.current = currentPhase;
                stablePhaseRef.current = currentPhase;
            }, 50);
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.log(`   → Keine Audio-Phase aktiv (Phase ${currentPhase})`);
                console.log(`   → Zentrale Bereiche:`, getAllPhaseRanges());
            }
        }
    }, [scrollProgress, playAudio, stopAllAudio, titleAudios]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🧹 Centralized Audio Cleanup`);
            }
            stopAllAudio();
            if (backgroundTweenRef.current) {
                backgroundTweenRef.current.kill();
            }
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
            }
            if (phaseDebounceRef.current) {
                clearTimeout(phaseDebounceRef.current);
            }
        };
    }, [stopAllAudio]);

    // Button UI
    const buttonsContent = buttonPortal ? createPortal(
        <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            {/* Audio Toggle */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAudio();
                }}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isAudioEnabled ?
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                        'rgba(100, 100, 100, 0.8)',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    pointerEvents: 'all',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1,
                    userSelect: 'none'
                }}
                title={isAudioEnabled ? 'Audio stumm schalten' : 'Audio aktivieren'}
            >
                {isAudioEnabled ? '🔊' : '🔇'}
            </button>

            {/* Background Music Toggle */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBackgroundMusic();
                }}
                style={{
                    position: 'absolute',
                    bottom: '90px',
                    right: '80px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: backgroundMusicEnabled ?
                        (backgroundMusicPlaying ?
                            'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' :
                            'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)') :
                        'rgba(100, 100, 100, 0.8)',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    pointerEvents: 'all',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1,
                    userSelect: 'none'
                }}
                title={`Hintergrundmusik ${backgroundMusicEnabled ? 'deaktivieren' : 'aktivieren'}`}
            >
                🎼
            </button>

            {/* Manual Play Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    manualPlayCurrentPhase();
                }}
                style={{
                    position: 'absolute',
                    bottom: '90px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    pointerEvents: 'all',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1,
                    userSelect: 'none'
                }}
                title="Aktuelles Audio manuell abspielen"
            >
                ▶️
            </button>

            {/* ✅ DEBUG PANEL - NUR DESKTOP */}
            {process.env.NODE_ENV === 'development' && !isMobile && (
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '12px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        pointerEvents: 'all',
                        fontFamily: 'monospace',
                        lineHeight: '1.4',
                        border: '1px solid #333',
                        zIndex: 1,
                        minWidth: '350px'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00ff00' }}>
                        🎵 CENTRALIZED AUDIO + VERBESSERTE HINTERGRUNDMUSIK
                    </div>

                    {(() => {
                        const debugInfo = getPhaseDebugInfo(scrollProgress);
                        const currentPhase = getActivePhaseFromScroll(scrollProgress);
                        const isInPhase1to3 = scrollProgress >= 0.05 && scrollProgress < 1.0;

                        return (
                            <>
                                <div>📍 ScrollProgress: {debugInfo.scrollProgress}</div>
                                <div>📊 Debug %: {debugInfo.debugPercentage}</div>
                                <div>🎯 Current Phase: {debugInfo.phase}</div>
                                <div>🎯 Stable Phase: {stablePhaseRef.current}</div>
                                <div>🎯 Last Triggered: {lastTriggeredPhaseRef.current}</div>
                                <div>🎛️ Range: {debugInfo.phaseRange}</div>
                                <div>🎵 Expected Audio: {debugInfo.audioConfig}</div>
                                <div>🔊 Audio Enabled: {isAudioEnabled ? 'Ja' : 'Nein'}</div>
                                <div>🎶 Currently Playing: {currentAudioRef.current ? 'Ja' : 'Nein'}</div>

                                {/* ✅ ERWEITERTE HINTERGRUNDMUSIK DEBUG */}
                                <div style={{ marginTop: '4px', borderTop: '1px solid #333', paddingTop: '4px' }}>
                                    <div style={{ fontSize: '10px', color: '#a880ff' }}>
                                        🎼 HINTERGRUNDMUSIK (VERBESSERT):
                                    </div>
                                    <div>Playing: {backgroundMusicPlaying ? '✅' : '❌'}</div>
                                    <div>Volume: {(backgroundMusicVolume * 100).toFixed(0)}%</div>
                                    <div>Phase 1-3: {isInPhase1to3 ? '✅' : '❌'}</div>
                                    <div>Was Playing: {backgroundMusicWasPlayingRef.current ? '✅' : '❌'}</div>
                                    <div>Last Phase1-3: {lastPhase1to3StateRef.current ? '✅' : '❌'}</div>
                                </div>

                                <div style={{ marginTop: '4px', fontSize: '10px', color: '#ff6b6b' }}>
                                    🚫 KEINE isScrollLocked Abhängigkeit!
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#4CAF50' }}>
                                    ✅ Nutzt zentrale phaseUtils.js Bereiche
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#ffff00' }}>
                                    ⚡ VERBESSERT: Schnellerer Fade-out (0.8s zu Phase 4+)
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#ff6b6b' }}>
                                    🔄 IMMER NEUSTART: Musik startet immer von vorne
                                </div>

                                <div style={{ marginTop: '4px', borderTop: '1px solid #333', paddingTop: '4px' }}>
                                    <div style={{ fontSize: '10px', color: '#a880ff' }}>
                                        🎛️ ZENTRALE KONFIGURATION:
                                    </div>
                                    {Object.entries(PHASE_CONFIG).map(([phaseKey, config]) => (
                                        <div key={phaseKey} style={{ fontSize: '9px', color: '#ccc' }}>
                                            {phaseKey}: {(config.scrollStart * 100).toFixed(0)}%-{(config.scrollEnd * 100).toFixed(0)}% → "{config.title}"
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}

                    <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <button
                            onClick={stopAllAudio}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '4px'
                            }}
                        >
                            🛑 Stop
                        </button>

                        <button
                            onClick={manualPlayCurrentPhase}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            ▶️ Play
                        </button>

                        <button
                            onClick={() => {
                                console.log('🎛️ AKTUELLE ZENTRALE KONFIGURATION:');
                                console.log(getAllPhaseRanges());
                                console.log('🔍 DEBUG für aktuelle Position:');
                                console.log(getPhaseDebugInfo(scrollProgress));
                            }}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginLeft: '4px'
                            }}
                        >
                            🔍 Debug
                        </button>
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
                        🖥️ DESKTOP DEBUG - Mobile Clean
                        <br />🎛️ Bereiche zentral steuerbar in PHASE_CONFIG
                        <br />🎯 Titel + Audio perfekt synchron
                        <br />⚡ Hintergrundmusik: 0.8s Fade-out, immer Neustart
                    </div>
                </div>
            )}
        </div>,
        buttonPortal
    ) : null;

    return (
        <ErrorBoundary>
            {/* Audio Elements mit zentraler Konfiguration */}
            <div style={{ display: 'none' }}>
                {titleAudios.map((audioConfig, index) => (
                    <audio
                        key={audioConfig.id}
                        ref={el => audioRefs.current[index] = el}
                        preload="auto"
                        onLoadedData={() => {
                            if (process.env.NODE_ENV === 'development') {
                                console.log(`🎵 CENTRALIZED GELADEN: ${audioConfig.title}`);
                            }
                        }}
                        onError={(e) => {
                            if (process.env.NODE_ENV === 'development') {
                                console.warn(`❌ CENTRALIZED FEHLER: ${audioConfig.title}`, e);
                            }
                        }}
                    >
                        <source
                            src={`${audioConfig.basePath}.mp3`}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}

                {/* ✅ VERBESSERTE Hintergrundmusik */}
                <audio
                    ref={backgroundMusicRef}
                    preload="auto"
                    loop={false}
                    onLoadedData={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎼 Hintergrundmusik geladen`);
                        }
                    }}
                    onError={(e) => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`❌ Hintergrundmusik Fehler:`, e);
                        }
                    }}
                    onEnded={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎼 Hintergrundmusik beendet - kann erneut gespielt werden`);
                        }
                        setBackgroundMusicPlaying(false);
                    }}
                >
                    <source
                        src="/audio/untermalung.mp3"
                        type="audio/mpeg"
                    />
                </audio>
            </div>

            {buttonsContent}
        </ErrorBoundary>
    );
};

export default TitleAudioLayer;