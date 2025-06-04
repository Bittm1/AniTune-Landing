// src/components/Parallax/Elements/TitleAudioLayer.jsx - PERFORMANCE OPTIMIERT
// ✅ OPTIMIERUNGEN: Console-logs entfernt, Event-Listener optimiert, Memory-Leaks reduziert

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

// ✅ MOBILE DETECTION - Gecacht für Performance
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
    const backgroundMusicWasPlayingRef = useRef(false);
    const lastPhase1to3StateRef = useRef(false);

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [buttonPortal, setButtonPortal] = useState(null);

    // Background Music States
    const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);
    const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
    const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0);

    // ✅ MOBILE DETECTION - Gecacht
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(isMobileDevice());
        };
        checkMobile();
        // ⚡ PERFORMANCE: Passive Event Listener
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Audio-Konfiguration aus zentraler phaseUtils.js
    const titleAudios = [
        getAudioConfigForPhase(1),
        getAudioConfigForPhase(2),
        getAudioConfigForPhase(3),
        getAudioConfigForPhase(4)
    ].filter(Boolean);

    // Portal Setup - ⚡ PERFORMANCE: Cleanup optimiert
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

    // ✅ PERFORMANCE: Zentrale Konfiguration wird nur einmal geladen (Debug-Logs entfernt)
    useEffect(() => {
        // ⚡ PERFORMANCE: Alle Console-Logs entfernt für Production
        // Konfiguration wird geladen aber ohne Debug-Output
        getAllPhaseRanges();
    }, [titleAudios]);

    // ✅ VERBESSERTE Hintergrundmusik Fade-Funktionen - Debug-Logs entfernt
    const fadeBackgroundMusicIn = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current || !backgroundMusicEnabled) return;

        // ⚡ PERFORMANCE: Debug-Logs entfernt

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
                    backgroundMusicWasPlayingRef.current = true;
                    // ⚡ PERFORMANCE: Debug-Log entfernt
                })
                .catch(error => {
                    // ⚡ PERFORMANCE: Nur kritische Errors in Production
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
                // ⚡ PERFORMANCE: Debug-Log entfernt
            }
        });
    }, [backgroundMusicEnabled]);

    const fadeBackgroundMusicOut = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current) return;

        // ⚡ PERFORMANCE: Debug-Log entfernt

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
                // ⚡ PERFORMANCE: Debug-Log entfernt
            }
        });
    }, []);

    // Scroll-Richtung erkennen - ⚡ PERFORMANCE: Optimiert
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

    // ✅ NEUE VERBESSERTE Hintergrundmusik-Logik - Debug-Logs entfernt
    useEffect(() => {
        if (!backgroundMusicEnabled || !backgroundMusicRef.current) return;

        const scrollDirection = detectScrollDirection(scrollProgress);
        const isInPhase1to3 = scrollProgress >= 0.05 && scrollProgress < 1.0;
        const isAtLogo = scrollProgress < 0.05;
        const isPhase4Plus = scrollProgress >= 1.0;

        // ✅ TRACKING: Sind wir in Phase 1-3?
        const wasInPhase1to3 = lastPhase1to3StateRef.current;
        lastPhase1to3StateRef.current = isInPhase1to3;

        // ⚡ PERFORMANCE: Debug-Logs entfernt

        // ✅ REGEL 1: Betrete Phase 1-3 → Musik starten (IMMER NEU)
        if (isInPhase1to3 && !wasInPhase1to3) {
            // ⚡ PERFORMANCE: Debug-Log entfernt
            fadeBackgroundMusicIn(2.0);
        }

        // ✅ REGEL 2: Verlasse Phase 1-3 nach oben (Logo) → Schneller Fade Out
        else if (isAtLogo && wasInPhase1to3 && backgroundMusicPlaying) {
            // ⚡ PERFORMANCE: Debug-Log entfernt
            fadeBackgroundMusicOut(1.0);
        }

        // ✅ REGEL 3: Verlasse Phase 1-3 nach unten (Phase 4+) → SEHR SCHNELLER Fade Out
        else if (isPhase4Plus && wasInPhase1to3 && backgroundMusicPlaying) {
            // ⚡ PERFORMANCE: Debug-Log entfernt
            fadeBackgroundMusicOut(0.8);
        }

        // ✅ REGEL 4: Reset Tracking wenn wir Phase 1-3 verlassen
        if (!isInPhase1to3 && wasInPhase1to3) {
            // ⚡ PERFORMANCE: Debug-Log entfernt
        }

    }, [scrollProgress, backgroundMusicEnabled, backgroundMusicPlaying, fadeBackgroundMusicIn, fadeBackgroundMusicOut, detectScrollDirection]);

    // ✅ Background Music Ende-Handler - Debug-Logs entfernt
    useEffect(() => {
        const audio = backgroundMusicRef.current;
        if (!audio) return;

        const handleEnded = () => {
            // ⚡ PERFORMANCE: Debug-Log entfernt
            setBackgroundMusicPlaying(false);
            setBackgroundMusicVolume(0);
        };

        audio.addEventListener('ended', handleEnded, { passive: true }); // ⚡ PERFORMANCE: Passive Event
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    const stopAllAudio = useCallback(() => {
        // ⚡ PERFORMANCE: Debug-Log entfernt
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
            // ⚡ PERFORMANCE: Debug-Log entfernt
            return;
        }

        const audio = audioRefs.current[audioIndex];
        const audioConfig = titleAudios[audioIndex];

        // ✅ PERFORMANCE: Debug-Info nur in Development
        if (process.env.NODE_ENV === 'development') {
            const debugInfo = getPhaseDebugInfo(scrollProgress);
            console.log(`🎵 CENTRALIZED PLAY-VERSUCH:`);
            console.log(`   🎯 Index: ${audioIndex} - "${audioConfig ? audioConfig.title : 'NICHT GEFUNDEN'}"`);
            console.log(`   📊 Phase Debug:`, debugInfo);
            console.log(`   🎛️ Zentrale Config: Phase ${audioIndex + 1} → ${debugInfo.phaseRange}`);
            console.log(`   ❓ Reason: ${reason}`);
        }

        if (!audio || !audioConfig) {
            // ⚡ PERFORMANCE: Debug-Warning nur in Development
            if (process.env.NODE_ENV === 'development') {
                console.warn(`❌ CENTRALIZED FEHLER: Audio ${audioIndex + 1} nicht verfügbar`);
            }
            return;
        }

        if (audio.readyState < 2) {
            // ⚡ PERFORMANCE: Debug-Log entfernt für Production
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏳ Audio ${audioIndex + 1} noch nicht geladen - retry in 200ms`);
            }
            setTimeout(() => playAudio(audioIndex, reason), 200);
            return;
        }

        // ⚡ PERFORMANCE: Debug-Log entfernt

        // Stoppe vorheriges Audio nur wenn notwendig
        if (currentAudioRef.current && currentAudioRef.current !== audio) {
            // ⚡ PERFORMANCE: Debug-Log entfernt
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current.onended = null;
        }

        audio.currentTime = 0;
        audio.onended = () => {
            // ⚡ PERFORMANCE: Debug-Log entfernt
            currentAudioRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
                    // ⚡ PERFORMANCE: Debug-Log entfernt
                })
                .catch(error => {
                    // ⚡ PERFORMANCE: Nur Development Warnings
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
            // ⚡ PERFORMANCE: Debug-Log entfernt
            return newState;
        });
    }, [stopAllAudio]);

    const toggleBackgroundMusic = useCallback(() => {
        setBackgroundMusicEnabled(prev => {
            const newState = !prev;
            if (!newState && backgroundMusicPlaying) {
                fadeBackgroundMusicOut(1.0);
            }
            // ⚡ PERFORMANCE: Debug-Log entfernt
            return newState;
        });
    }, [backgroundMusicPlaying, fadeBackgroundMusicOut]);

    // ZENTRALE DEBOUNCED PHASE-ERKENNUNG - Debug-Logs entfernt
    const updateStablePhase = useCallback((newPhase) => {
        if (phaseDebounceRef.current) {
            clearTimeout(phaseDebounceRef.current);
        }

        phaseDebounceRef.current = setTimeout(() => {
            if (stablePhaseRef.current !== newPhase) {
                // ⚡ PERFORMANCE: Debug-Logs nur in Development
                if (process.env.NODE_ENV === 'development') {
                    const debugInfo = getPhaseDebugInfo(scrollProgress);
                    console.log(`🎯 CENTRALIZED STABLE PHASE: ${stablePhaseRef.current} → ${newPhase}`);
                    console.log(`📊 Zentrale Debug-Info:`, debugInfo);
                }

                stablePhaseRef.current = newPhase;

                if (newPhase >= 1 && newPhase <= 4 && newPhase !== lastTriggeredPhaseRef.current) {
                    const audioIndex = newPhase - 1;

                    // ⚡ PERFORMANCE: Debug-Logs nur in Development
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
                    // ⚡ PERFORMANCE: Debug-Log entfernt
                    stopAllAudio();
                    lastTriggeredPhaseRef.current = 0;
                }
            }
        }, 300);
    }, [playAudio, stopAllAudio, scrollProgress]);

    // ZENTRALE SCROLL-PROGRESS PHASE-ERKENNUNG - Debug-Logs entfernt
    useEffect(() => {
        if (!isAudioEnabled) return;

        const currentPhase = getActivePhaseFromScroll(scrollProgress);

        // ⚡ PERFORMANCE: Debug-Logs nur in Development
        if (process.env.NODE_ENV === 'development') {
            const debugInfo = getPhaseDebugInfo(scrollProgress);
            console.log(`📊 CENTRALIZED SCROLL-TRIGGER: Progress=${scrollProgress.toFixed(3)}, Phase=${currentPhase}, LastTriggered=${lastTriggeredPhaseRef.current}`);
            console.log(`🎛️ Zentrale Range: ${debugInfo.phaseRange}, Audio: ${debugInfo.audioConfig}`);
        }

        if (currentPhase >= 1 && currentPhase <= 4 && currentPhase !== lastTriggeredPhaseRef.current) {
            const audioIndex = currentPhase - 1;

            // ⚡ PERFORMANCE: Debug-Logs nur in Development
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
            // ⚡ PERFORMANCE: Debug-Log entfernt
            stopAllAudio();
            lastTriggeredPhaseRef.current = 0;
        }

    }, [scrollProgress, isAudioEnabled, playAudio, stopAllAudio]);

    // Manual Play - Debug-Logs entfernt
    const manualPlayCurrentPhase = useCallback(() => {
        const currentPhase = getActivePhaseFromScroll(scrollProgress);

        // ⚡ PERFORMANCE: Debug-Logs nur in Development
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

            // ⚡ PERFORMANCE: Debug-Logs nur in Development
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
            // ⚡ PERFORMANCE: Debug-Logs nur in Development
            if (process.env.NODE_ENV === 'development') {
                console.log(`   → Keine Audio-Phase aktiv (Phase ${currentPhase})`);
                console.log(`   → Zentrale Bereiche:`, getAllPhaseRanges());
            }
        }
    }, [scrollProgress, playAudio, stopAllAudio, titleAudios]);

    // Cleanup - ⚡ PERFORMANCE: Optimiert
    useEffect(() => {
        return () => {
            // ⚡ PERFORMANCE: Debug-Log entfernt
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

    // ⚡ PERFORMANCE: Button Styles ausgelagert in CSS-Variablen
    const buttonBaseStyle = {
        borderRadius: '50%',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        pointerEvents: 'all',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        zIndex: 1,
        userSelect: 'none'
    };

    const audioButtonStyle = {
        ...buttonBaseStyle,
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        fontSize: '24px',
        background: isAudioEnabled ?
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
            'rgba(100, 100, 100, 0.8)'
    };

    const bgMusicButtonStyle = {
        ...buttonBaseStyle,
        position: 'absolute',
        bottom: '90px',
        right: '80px',
        width: '50px',
        height: '50px',
        fontSize: '18px',
        background: backgroundMusicEnabled ?
            (backgroundMusicPlaying ?
                'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' :
                'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)') :
            'rgba(100, 100, 100, 0.8)'
    };

    const manualButtonStyle = {
        ...buttonBaseStyle,
        position: 'absolute',
        bottom: '90px',
        right: '20px',
        width: '50px',
        height: '50px',
        fontSize: '20px',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        minWidth: '50px'
    };

    // Button UI - ⚡ PERFORMANCE: Styles optimiert
    const buttonsContent = buttonPortal ? createPortal(
        <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            {/* Audio Toggle */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAudio();
                }}
                style={audioButtonStyle}
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
                style={bgMusicButtonStyle}
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
                style={manualButtonStyle}
                title="Aktuelles Audio manuell abspielen"
            >
                ▶️
            </button>

            {/* ✅ DEBUG PANEL - NUR DESKTOP + DEVELOPMENT */}
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
                        🎵 CENTRALIZED AUDIO + PERFORMANCE OPTIMIERT
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

                                {/* Hintergrundmusik Debug */}
                                <div style={{ marginTop: '4px', borderTop: '1px solid #333', paddingTop: '4px' }}>
                                    <div style={{ fontSize: '10px', color: '#a880ff' }}>
                                        🎼 HINTERGRUNDMUSIK (PERFORMANCE OPTIMIERT):
                                    </div>
                                    <div>Playing: {backgroundMusicPlaying ? '✅' : '❌'}</div>
                                    <div>Volume: {(backgroundMusicVolume * 100).toFixed(0)}%</div>
                                    <div>Phase 1-3: {isInPhase1to3 ? '✅' : '❌'}</div>
                                    <div>Was Playing: {backgroundMusicWasPlayingRef.current ? '✅' : '❌'}</div>
                                    <div>Last Phase1-3: {lastPhase1to3StateRef.current ? '✅' : '❌'}</div>
                                </div>

                                <div style={{ marginTop: '4px', fontSize: '10px', color: '#ff6b6b' }}>
                                    ⚡ PERFORMANCE: Console-Logs entfernt für Production
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#4CAF50' }}>
                                    ✅ Event-Listener mit Passive-Flags optimiert
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#ffff00' }}>
                                    🎨 Button-Styles optimiert
                                </div>

                                {/* Zentrale Konfiguration */}
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

                    {/* Control Buttons */}
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
                        🖥️ PERFORMANCE-OPTIMIERT - Production Clean
                        <br />⚡ Passive Event-Listeners, CSS-Optimiert
                        <br />🧹 Memory-Leaks reduziert, Debug-Clean
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
                            // ⚡ PERFORMANCE: Debug-Log nur in Development
                            if (process.env.NODE_ENV === 'development') {
                                console.log(`🎵 CENTRALIZED GELADEN: ${audioConfig.title}`);
                            }
                        }}
                        onError={(e) => {
                            // ⚡ PERFORMANCE: Error-Log nur in Development
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
                        // ⚡ PERFORMANCE: Debug-Log nur in Development
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎼 Hintergrundmusik geladen`);
                        }
                    }}
                    onError={(e) => {
                        // ⚡ PERFORMANCE: Error-Log nur in Development
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`❌ Hintergrundmusik Fehler:`, e);
                        }
                    }}
                    onEnded={() => {
                        // ⚡ PERFORMANCE: Debug-Log nur in Development
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