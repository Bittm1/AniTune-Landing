// src/components/Parallax/Elements/TitleAudioLayer.jsx - MIT ZENTRALER PHASE-DEFINITION

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';

// ✅ SCHRITT 4: Import der zentralen Phase-Definition
import {
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getPhaseDebugInfo,
    PHASE_CONFIG,
    getAllPhaseRanges
} from '../utils/phaseUtils';

const TitleAudioLayer = ({ currentTitleIndex, isScrollLocked, scrollProgress = 0 }) => {
    const audioRefs = useRef([]);
    const currentAudioRef = useRef(null);
    const lastTriggeredPhaseRef = useRef(0);

    // Debouncing für Phase-Stabilität
    const phaseDebounceRef = useRef(null);
    const stablePhaseRef = useRef(0);

    // Hintergrundmusik Refs und States
    const backgroundMusicRef = useRef(null);
    const backgroundTweenRef = useRef(null);
    const lastScrollDirectionRef = useRef('none');
    const lastScrollProgressRef = useRef(0);
    const backgroundMusicPlayedOnceRef = useRef(false);

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [buttonPortal, setButtonPortal] = useState(null);

    // Background Music States
    const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);
    const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
    const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0);

    // ✅ SCHRITT 4A: Audio-Konfiguration aus zentraler phaseUtils.js
    const titleAudios = [
        getAudioConfigForPhase(1), // Phase 1: "Von Uns Heißt Für Uns"
        getAudioConfigForPhase(2), // Phase 2: "Der Weg Ist Das Ziel"  
        getAudioConfigForPhase(3),  // Phase 3: "Die Community Heißt"
        getAudioConfigForPhase(4)  // ✅ NEU: Phase 4: AniTune Theme
    ].filter(Boolean); // Entferne null-Werte

    // Portal Setup (unverändert)
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

    // ✅ SCHRITT 4B: Zeige zentrale Konfiguration beim Start
    useEffect(() => {
        console.log('🎛️ AUDIO-SYSTEM: Nutzt zentrale phaseUtils.js');
        console.log('📊 Zentrale Bereiche:', getAllPhaseRanges());
        console.log('🎵 Audio-Konfigurationen:');
        titleAudios.forEach((audio, index) => {
            console.log(`  Phase ${index + 1}: "${audio.title}" → ${audio.basePath}.mp3`);
        });
    }, [titleAudios]);

    // Hintergrundmusik Fade-Funktionen (unverändert)
    const fadeBackgroundMusicIn = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current || !backgroundMusicEnabled) return;

        console.log(`🎵 BACKGROUND: Fade In (${duration}s)`);

        if (backgroundTweenRef.current) {
            backgroundTweenRef.current.kill();
        }

        backgroundMusicRef.current.volume = 0;
        setBackgroundMusicVolume(0);

        if (backgroundMusicRef.current.paused) {
            const playPromise = backgroundMusicRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setBackgroundMusicPlaying(true);
                        console.log(`✅ BACKGROUND: Spielt erfolgreich`);
                    })
                    .catch(error => {
                        console.warn(`❌ BACKGROUND: Play-Fehler:`, error);
                    });
            }
        }

        backgroundTweenRef.current = gsap.to(backgroundMusicRef.current, {
            volume: 0.3,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                setBackgroundMusicVolume(backgroundMusicRef.current.volume);
            },
            onComplete: () => {
                console.log(`✅ BACKGROUND: Fade In komplett`);
            }
        });
    }, [backgroundMusicEnabled]);

    const fadeBackgroundMusicOut = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current) return;

        console.log(`🎵 BACKGROUND: Fade Out (${duration}s)`);

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
                console.log(`✅ BACKGROUND: Fade Out komplett`);
            }
        });
    }, []);

    // Scroll-Richtung erkennen (unverändert)
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

    // Hintergrundmusik-Logik (unverändert)
    useEffect(() => {
        if (!backgroundMusicEnabled || !backgroundMusicRef.current) return;

        const scrollDirection = detectScrollDirection(scrollProgress);
        const isInPhase1to3 = scrollProgress >= 0.05 && scrollProgress < 1.0;
        const isAtLogo = scrollProgress < 0.05;
        const isPhase4Plus = scrollProgress >= 1.0;

        if (isInPhase1to3 && scrollDirection === 'down' && !backgroundMusicPlaying) {
            fadeBackgroundMusicIn(2.0);
        }
        else if (isPhase4Plus && scrollDirection === 'down' && backgroundMusicPlaying) {
            fadeBackgroundMusicOut(3.0);
        }
        else if (isInPhase1to3 && scrollDirection === 'up' && !backgroundMusicPlaying && !backgroundMusicPlayedOnceRef.current) {
            fadeBackgroundMusicIn(2.0);
        }
        else if (isAtLogo && scrollDirection === 'up' && backgroundMusicPlaying) {
            fadeBackgroundMusicOut(2.0);
        }

    }, [scrollProgress, backgroundMusicEnabled, backgroundMusicPlaying, fadeBackgroundMusicIn, fadeBackgroundMusicOut, detectScrollDirection]);

    // Background Music Ende-Handler (unverändert)
    useEffect(() => {
        const audio = backgroundMusicRef.current;
        if (!audio) return;

        const handleEnded = () => {
            console.log(`🎵 BACKGROUND: Song beendet - wird nicht wiederholt`);
            backgroundMusicPlayedOnceRef.current = true;
            setBackgroundMusicPlaying(false);
            setBackgroundMusicVolume(0);
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    const stopAllAudio = useCallback(() => {
        console.log(`🛑 Stoppe alle Audio`);
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
            console.log(`🔇 Audio deaktiviert - kein Play für ${audioIndex + 1}`);
            return;
        }

        const audio = audioRefs.current[audioIndex];
        const audioConfig = titleAudios[audioIndex];

        // ✅ SCHRITT 4C: Erweiterte Debug-Info mit zentraler Konfiguration
        const debugInfo = getPhaseDebugInfo(scrollProgress);
        console.log(`🎵 CENTRALIZED PLAY-VERSUCH:`);
        console.log(`   🎯 Index: ${audioIndex} - "${audioConfig ? audioConfig.title : 'NICHT GEFUNDEN'}"`);
        console.log(`   📊 Phase Debug:`, debugInfo);
        console.log(`   🎛️ Zentrale Config: Phase ${audioIndex + 1} → ${debugInfo.phaseRange}`);
        console.log(`   ❓ Reason: ${reason}`);

        if (!audio || !audioConfig) {
            console.warn(`❌ CENTRALIZED FEHLER: Audio ${audioIndex + 1} nicht verfügbar`);
            return;
        }

        if (audio.readyState < 2) {
            console.log(`⏳ Audio ${audioIndex + 1} noch nicht geladen - retry in 200ms`);
            setTimeout(() => playAudio(audioIndex, reason), 200);
            return;
        }

        console.log(`🎵 CENTRALIZED SPIELE: "${audioConfig.title}"`);

        // Stoppe vorheriges Audio nur wenn notwendig
        if (currentAudioRef.current && currentAudioRef.current !== audio) {
            console.log(`🛑 Stoppe vorheriges Audio`);
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current.onended = null;
        }

        audio.currentTime = 0;
        audio.onended = () => {
            console.log(`🔚 Audio "${audioConfig.title}" beendet`);
            currentAudioRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
                    console.log(`✅ CENTRALIZED SPIELT: "${audioConfig.title}" (${audio.duration}s)`);
                })
                .catch(error => {
                    console.warn(`❌ CENTRALIZED PLAY-FEHLER für "${audioConfig.title}":`, error);
                });
        }
    }, [isAudioEnabled, titleAudios, scrollProgress]);

    const toggleAudio = useCallback(() => {
        setIsAudioEnabled(prev => {
            const newState = !prev;
            if (!newState) {
                stopAllAudio();
            }
            console.log(`🎵 Audio ${newState ? 'aktiviert' : 'deaktiviert'}`);
            return newState;
        });
    }, [stopAllAudio]);

    const toggleBackgroundMusic = useCallback(() => {
        setBackgroundMusicEnabled(prev => {
            const newState = !prev;
            if (!newState && backgroundMusicPlaying) {
                fadeBackgroundMusicOut(1.0);
            }
            console.log(`🎵 Hintergrundmusik ${newState ? 'aktiviert' : 'deaktiviert'}`);
            return newState;
        });
    }, [backgroundMusicPlaying, fadeBackgroundMusicOut]);

    // ✅ SCHRITT 4D: ZENTRALE DEBOUNCED PHASE-ERKENNUNG
    const updateStablePhase = useCallback((newPhase) => {
        // Clearer vorheriger Timeout
        if (phaseDebounceRef.current) {
            clearTimeout(phaseDebounceRef.current);
        }

        // Setze neuen Timeout für Phase-Stabilisierung
        phaseDebounceRef.current = setTimeout(() => {
            if (stablePhaseRef.current !== newPhase) {
                const debugInfo = getPhaseDebugInfo(scrollProgress);
                console.log(`🎯 CENTRALIZED STABLE PHASE: ${stablePhaseRef.current} → ${newPhase}`);
                console.log(`📊 Zentrale Debug-Info:`, debugInfo);

                stablePhaseRef.current = newPhase;

                // ✅ AUDIO-TRIGGER: NUR bei stabiler Phase-Änderung
                if (newPhase >= 1 && newPhase <= 4 && newPhase !== lastTriggeredPhaseRef.current) {
                    const audioIndex = newPhase - 1;

                    console.log(`🎵 CENTRALIZED STABLE PHASE-WECHSEL: → Phase ${newPhase} - Starte Audio ${audioIndex + 1}`);
                    console.log(`🎛️ Zentrale Bereiche: ${debugInfo.phaseRange}`);

                    // Stoppe nur wenn wirklich neues Audio gespielt wird
                    if (currentAudioRef.current) {
                        stopAllAudio();
                    }

                    setTimeout(() => {
                        playAudio(audioIndex, `centralized-stable-phase-${newPhase}`);
                    }, 50);

                    lastTriggeredPhaseRef.current = newPhase;
                }

                // Stoppe Audio wenn außerhalb Titel-Phasen
                if (newPhase === 0 && lastTriggeredPhaseRef.current !== 0) {
                    console.log(`🛑 CENTRALIZED STABLE PHASE-EXIT: Verlasse Titel-Bereiche`);
                    stopAllAudio();
                    lastTriggeredPhaseRef.current = 0;
                }
            }
        }, 300); // 300ms Debounce
    }, [playAudio, stopAllAudio, scrollProgress]);

    // ✅ SCHRITT 4E: ZENTRALE SCROLL-PROGRESS PHASE-ERKENNUNG - OHNE DEBOUNCING
    useEffect(() => {
        if (!isAudioEnabled) return;

        // ✅ NUTZE ZENTRALE PHASE-FUNKTION statt lokaler Definition
        const currentPhase = getActivePhaseFromScroll(scrollProgress);
        const debugInfo = getPhaseDebugInfo(scrollProgress);

        console.log(`📊 CENTRALIZED SCROLL-TRIGGER: Progress=${scrollProgress.toFixed(3)}, Phase=${currentPhase}, LastTriggered=${lastTriggeredPhaseRef.current}`);
        console.log(`🎛️ Zentrale Range: ${debugInfo.phaseRange}, Audio: ${debugInfo.audioConfig}`);

        // ✅ DIREKTER TRIGGER - SYNCHRON MIT TITELN!
        // ✅ KEINE isScrollLocked ABHÄNGIGKEIT!
        // ✅ KEINE currentTitleIndex ABHÄNGIGKEIT!
        // ✅ KEIN DEBOUNCING - startet sofort wie Titel!

        if (currentPhase >= 1 && currentPhase <= 4 && currentPhase !== lastTriggeredPhaseRef.current) {
            const audioIndex = currentPhase - 1;

            console.log(`🎵 SYNC PHASE-WECHSEL: → Phase ${currentPhase} - Starte Audio ${audioIndex + 1} SOFORT`);
            console.log(`🎛️ Zentrale Bereiche: ${debugInfo.phaseRange}`);

            // Stoppe nur wenn wirklich neues Audio gespielt wird
            if (currentAudioRef.current) {
                stopAllAudio();
            }

            // ✅ KEIN setTimeout - startet sofort wie Titel!
            playAudio(audioIndex, `sync-phase-${currentPhase}`);
            lastTriggeredPhaseRef.current = currentPhase;
        }

        // Stoppe Audio wenn außerhalb Titel-Phasen
        if (currentPhase === 0 && lastTriggeredPhaseRef.current !== 0) {
            console.log(`🛑 SYNC PHASE-EXIT: Verlasse Titel-Bereiche`);
            stopAllAudio();
            lastTriggeredPhaseRef.current = 0;
        }

    }, [scrollProgress, isAudioEnabled, playAudio, stopAllAudio]);

    // ✅ SCHRITT 4F: ZENTRALE Manual Play
    const manualPlayCurrentPhase = useCallback(() => {
        const currentPhase = getActivePhaseFromScroll(scrollProgress);
        const debugInfo = getPhaseDebugInfo(scrollProgress);

        console.log(`👆 CENTRALIZED MANUAL PLAY:`);
        console.log(`   Progress: ${scrollProgress.toFixed(3)}, Phase: ${currentPhase}`);
        console.log(`   Zentrale Range: ${debugInfo.phaseRange}`);
        console.log(`   Audio Config: ${debugInfo.audioConfig}`);

        if (currentPhase >= 1 && currentPhase <= 3) {
            const audioIndex = currentPhase - 1;
            const audioConfig = titleAudios[audioIndex];

            console.log(`   → Spiele Audio ${audioIndex + 1}: ${audioConfig.title}`);
            console.log(`   → Pfad: ${audioConfig.basePath}.mp3`);

            stopAllAudio();
            setTimeout(() => {
                playAudio(audioIndex, `centralized-manual-phase-${currentPhase}`);
                lastTriggeredPhaseRef.current = currentPhase;
                stablePhaseRef.current = currentPhase;
            }, 50);
        } else {
            console.log(`   → Keine Audio-Phase aktiv (Phase ${currentPhase})`);
            console.log(`   → Zentrale Bereiche:`, getAllPhaseRanges());
        }
    }, [scrollProgress, playAudio, stopAllAudio, titleAudios]);

    // Cleanup
    useEffect(() => {
        return () => {
            console.log(`🧹 Centralized Audio Cleanup`);
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

            {/* ✅ SCHRITT 4G: Erweiterte Debug-Info mit zentraler Konfiguration */}
            {process.env.NODE_ENV === 'development' && (
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
                        🎵 CENTRALIZED AUDIO (SCHRITT 4)
                    </div>

                    {(() => {
                        const debugInfo = getPhaseDebugInfo(scrollProgress);
                        const currentPhase = getActivePhaseFromScroll(scrollProgress);

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
                                <div>🎼 Background: {backgroundMusicPlaying ? 'Ja' : 'Nein'}</div>

                                <div style={{ marginTop: '4px', fontSize: '10px', color: '#ff6b6b' }}>
                                    🚫 KEINE isScrollLocked Abhängigkeit!
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#4CAF50' }}>
                                    ✅ Nutzt zentrale phaseUtils.js Bereiche
                                </div>
                                <div style={{ marginTop: '2px', fontSize: '9px', color: '#ffff00' }}>
                                    ⏱️ 300ms Debounce verhindert Phase-Hopping
                                </div>

                                {/* Zentrale Konfiguration anzeigen */}
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
                        ✅ SCHRITT 4: Audio folgt zentraler phaseUtils.js
                        <br />🎛️ Bereiche zentral steuerbar in PHASE_CONFIG
                        <br />🎯 Titel + Audio perfekt synchron
                    </div>
                </div>
            )}
        </div>,
        buttonPortal
    ) : null;

    return (
        <ErrorBoundary>
            {/* ✅ SCHRITT 4H: Audio Elements mit zentraler Konfiguration */}
            <div style={{ display: 'none' }}>
                {titleAudios.map((audioConfig, index) => (
                    <audio
                        key={audioConfig.id}
                        ref={el => audioRefs.current[index] = el}
                        preload="auto"
                        onLoadedData={() => console.log(`🎵 CENTRALIZED GELADEN: ${audioConfig.title}`)}
                        onError={(e) => console.warn(`❌ CENTRALIZED FEHLER: ${audioConfig.title}`, e)}
                    >
                        <source
                            src={`${audioConfig.basePath}.mp3`}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}

                {/* Hintergrundmusik */}
                <audio
                    ref={backgroundMusicRef}
                    preload="auto"
                    loop={false}
                    onLoadedData={() => console.log(`🎼 Hintergrundmusik geladen`)}
                    onError={(e) => console.warn(`❌ Hintergrundmusik Fehler:`, e)}
                    onEnded={() => {
                        console.log(`🎼 Hintergrundmusik beendet`);
                        backgroundMusicPlayedOnceRef.current = true;
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