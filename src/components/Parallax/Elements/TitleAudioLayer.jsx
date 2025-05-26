// src/components/Parallax/Elements/TitleAudioLayer.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ErrorBoundary from '../../ErrorBoundary';

const TitleAudioLayer = ({ currentTitleIndex, isScrollLocked, scrollToTitleIndex }) => {
    // Refs für alle Audio-Elemente
    const audioRefs = useRef([]);
    const currentlyPlayingRef = useRef(null);
    const audioTimeoutRef = useRef(null); // ✅ NEU: Timeout-Tracking
    const isPlayingAudioRef = useRef(false); // ✅ NEU: Audio-Status-Lock

    // States
    const [loadingStates, setLoadingStates] = useState({});
    const [errorStates, setErrorStates] = useState({});
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    // ✅ ROBUSTE REF-BASIERTE LÖSUNG
    const isAutoPlayingRef = useRef(false);
    const isAutoPlayStartingRef = useRef(false);
    const [autoPlayUIState, setAutoPlayUIState] = useState(false); // Nur für UI-Updates

    const lastManualPhaseRef = useRef(0);

    // ✅ NEU: Portal für Buttons außerhalb der Component-Hierarchie
    const [buttonPortal, setButtonPortal] = useState(null);

    // Audio-Konfiguration mit allen 6 Titeln
    const titleAudios = [
        {
            id: 'von-uns-heißt-fuer-uns',
            basePath: '/audio/von-uns-heißt-fuer-uns',
            title: 'Von Uns Ist Für Uns',
            phase: 1
        },
        {
            id: 'der-weg',
            basePath: '/audio/der-weg',
            title: 'Der Weg',
            phase: 2
        },
        {
            id: 'ist-das-ziel',
            basePath: '/audio/ist-das-ziel',
            title: 'Ist Das Ziel',
            phase: 3
        },
        {
            id: 'die-community',
            basePath: '/audio/die-community',
            title: 'Die Community',
            phase: 4
        },
        {
            id: 'heißt',
            basePath: '/audio/heißt',
            title: 'Heißt',
            phase: 5
        },
        {
            id: 'anitune-theme',
            basePath: '/audio/anitune-theme',
            title: 'AniTune',
            phase: 6
        }
    ];

    // ✅ Portal für Buttons erstellen
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

    // Audio-Loading-Handler
    const handleAudioLoad = useCallback((index) => {
        setLoadingStates(prev => ({
            ...prev,
            [index]: false
        }));

        console.log(`🎵 Audio ${index + 1} (${titleAudios[index].title}) geladen`);
    }, [titleAudios]);

    // Audio-Error-Handler
    const handleAudioError = useCallback((index, error) => {
        setErrorStates(prev => ({
            ...prev,
            [index]: true
        }));

        console.warn(`❌ Audio ${index + 1} (${titleAudios[index].title}) konnte nicht geladen werden:`, error);
    }, [titleAudios]);

    // ✅ ROBUSTE REF-BASIERTE: Audio-Ende Handler für Auto-Play
    const handleAudioEnded = useCallback((audioIndex) => {
        console.log(`🔚 Audio ${audioIndex + 1} beendet - Auto-Play Status: ${isAutoPlayingRef.current}`);

        // Doppelt prüfen ob Auto-Play noch aktiv ist
        if (!isAutoPlayingRef.current) {
            console.log(`⏹️ Auto-Play ist gestoppt - keine weitere Aktion`);
            return;
        }

        const currentPhase = audioIndex + 1; // audioIndex 0-5 → Phase 1-6
        const nextPhase = currentPhase + 1;   // Nächste Phase

        console.log(`⏭️ Auto-Play: Von Phase ${currentPhase} zu Phase ${nextPhase}`);

        if (nextPhase <= 6) {
            // Längere Verzögerung für zuverlässigere Übergänge
            setTimeout(() => {
                // Nochmal prüfen ob Auto-Play noch aktiv ist
                if (isAutoPlayingRef.current && scrollToTitleIndex) {
                    console.log(`🎯 Navigiere zu Phase ${nextPhase} (Auto-Play aktiv)`);
                    scrollToTitleIndex(nextPhase);
                } else {
                    console.log(`❌ Auto-Play gestoppt oder scrollToTitleIndex nicht verfügbar`);
                }
            }, 800); // Längere Pause für bessere UX
        } else {
            console.log(`🏁 Auto-Play Sequenz beendet - alle Phasen abgespielt`);
            isAutoPlayingRef.current = false;
            setAutoPlayUIState(false);
        }
    }, [scrollToTitleIndex]); // ✅ KEINE DEPENDENCIES AUF STATES!

    // ✅ ROBUSTE REF-BASIERTE: Audio abspielen mit Anti-Stotter-Schutz
    const playAudio = useCallback((audioIndex) => {
        // ✅ SCHUTZ: Verhindere mehrfache gleichzeitige Aufrufe
        if (isPlayingAudioRef.current) {
            console.log(`⏸️ Audio ${audioIndex + 1} - bereits am Abspielen, überspringe`);
            return;
        }

        if (!isAudioEnabled || errorStates[audioIndex]) {
            console.log(`❌ Audio ${audioIndex} kann nicht abgespielt werden - disabled: ${!isAudioEnabled}, error: ${errorStates[audioIndex]}`);
            return;
        }

        const audio = audioRefs.current[audioIndex];
        if (!audio) {
            console.log(`❌ Audio Element ${audioIndex} nicht gefunden`);
            return;
        }

        // ✅ SCHUTZ: Prüfe ob Audio geladen ist
        if (audio.readyState < 2) { // HAVE_CURRENT_DATA
            console.log(`⏳ Audio ${audioIndex + 1} noch nicht geladen - warte...`);
            setTimeout(() => playAudio(audioIndex), 200);
            return;
        }

        console.log(`🎵 Starte Audio ${audioIndex + 1}: ${titleAudios[audioIndex].title}`);
        isPlayingAudioRef.current = true; // ✅ LOCK setzen

        // ✅ CLEANUP: Stoppe aktuell spielendes Audio vollständig
        if (currentlyPlayingRef.current && currentlyPlayingRef.current !== audio) {
            const oldAudio = currentlyPlayingRef.current;
            oldAudio.pause();
            oldAudio.currentTime = 0;
            oldAudio.onended = null;

            // Clear alter Timer
            if (oldAudio.fallbackTimer) {
                clearTimeout(oldAudio.fallbackTimer);
                oldAudio.fallbackTimer = null;
            }
        }

        // ✅ Clear bestehende Timeout falls vorhanden
        if (audioTimeoutRef.current) {
            clearTimeout(audioTimeoutRef.current);
            audioTimeoutRef.current = null;
        }

        // ✅ Audio-Ende Event hinzufügen (nur einmal!)
        audio.onended = () => {
            console.log(`🔚 Audio ${audioIndex + 1} beendet (onended Event)`);
            isPlayingAudioRef.current = false; // ✅ LOCK entfernen

            // Clear Timer da Audio natürlich beendet
            if (audio.fallbackTimer) {
                clearTimeout(audio.fallbackTimer);
                audio.fallbackTimer = null;
            }

            handleAudioEnded(audioIndex);
        };

        // ✅ FALLBACK: Timer als Backup (robuster)
        const audioDuration = audio.duration || 5; // Kürzerer Fallback
        audio.fallbackTimer = setTimeout(() => {
            if (currentlyPlayingRef.current === audio && isAutoPlayingRef.current) {
                console.log(`⏰ Fallback-Timer: Audio ${audioIndex + 1} sollte beendet sein`);
                isPlayingAudioRef.current = false; // ✅ LOCK entfernen
                handleAudioEnded(audioIndex);
            }
        }, (audioDuration + 0.5) * 1000); // Kürzerer Puffer

        // ✅ Spiele Audio ab
        audio.currentTime = 0;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentlyPlayingRef.current = audio;
                    console.log(`✅ Audio ${audioIndex + 1} wird abgespielt - Dauer: ${audio.duration}s`);
                })
                .catch(error => {
                    console.warn(`❌ Audio-Wiedergabe fehlgeschlagen:`, error);
                    isPlayingAudioRef.current = false; // ✅ LOCK entfernen bei Fehler

                    // Clear Timer bei Fehler
                    if (audio.fallbackTimer) {
                        clearTimeout(audio.fallbackTimer);
                        audio.fallbackTimer = null;
                    }

                    // Bei Auto-Play: Versuche nächste Phase nach Verzögerung
                    if (isAutoPlayingRef.current) {
                        console.log(`🔄 Audio-Fehler - versuche nächste Phase in 1s`);
                        audioTimeoutRef.current = setTimeout(() => {
                            handleAudioEnded(audioIndex);
                        }, 1000);
                    }
                });
        }
    }, [isAudioEnabled, errorStates, titleAudios, handleAudioEnded]); // ✅ KEINE AUTO-PLAY DEPENDENCY!

    // ✅ ROBUSTE: Audio stoppen mit vollständigem Cleanup
    const stopAudio = useCallback(() => {
        console.log(`⏹️ Audio gestoppt - vollständiges Cleanup`);

        // ✅ CLEANUP: Alle Timer clearen
        if (audioTimeoutRef.current) {
            clearTimeout(audioTimeoutRef.current);
            audioTimeoutRef.current = null;
        }

        if (currentlyPlayingRef.current) {
            const audio = currentlyPlayingRef.current;

            // Clear Audio-spezifische Timer
            if (audio.fallbackTimer) {
                clearTimeout(audio.fallbackTimer);
                audio.fallbackTimer = null;
            }

            // Audio stoppen
            audio.pause();
            audio.currentTime = 0;
            audio.onended = null;

            currentlyPlayingRef.current = null;
        }

        // ✅ LOCKS zurücksetzen
        isPlayingAudioRef.current = false;
    }, []);

    // ✅ REF-BASIERT: Auto-Play starten mit Start-Flag
    const startAutoPlay = useCallback(() => {
        if (!scrollToTitleIndex) {
            console.warn('❌ scrollToTitleIndex function not available');
            alert('Auto-Play nicht verfügbar - scrollToTitleIndex fehlt');
            return;
        }

        console.log(`▶️ Auto-Play gestartet von Phase ${currentTitleIndex}`);
        isAutoPlayingRef.current = true;
        isAutoPlayStartingRef.current = true;
        setAutoPlayUIState(true); // UI-Update

        // Starte immer mit Phase 1, unabhängig von aktueller Phase
        if (currentTitleIndex !== 1) {
            console.log(`🎯 Gehe zu Phase 1 um Auto-Play zu starten`);
            scrollToTitleIndex(1);
        } else {
            // Schon in Phase 1, starte Audio direkt
            console.log(`🎵 Starte Audio für Phase 1 direkt`);
            isAutoPlayStartingRef.current = false; // Start-Phase beendet
            setTimeout(() => playAudio(0), 300); // Phase 1 = Index 0
        }
    }, [currentTitleIndex, scrollToTitleIndex, playAudio]);

    // ✅ REF-BASIERT: Auto-Play stoppen/pausieren
    const stopAutoPlay = useCallback(() => {
        console.log(`⏸️ Auto-Play gestoppt`);
        isAutoPlayingRef.current = false;
        isAutoPlayStartingRef.current = false;
        setAutoPlayUIState(false); // UI-Update
        stopAudio();
    }, [stopAudio]);

    // ✅ REF-BASIERT: Detect manueller Scroll - Ignoriert Auto-Play Start
    useEffect(() => {
        if (currentTitleIndex !== lastManualPhaseRef.current) {
            console.log(`🔄 Phase change: ${lastManualPhaseRef.current} → ${currentTitleIndex}, Auto-Play: ${isAutoPlayingRef.current}, Starting: ${isAutoPlayStartingRef.current}`);

            // ✅ WICHTIG: Ignoriere Phase-Wechsel während Auto-Play Start
            if (isAutoPlayStartingRef.current) {
                console.log(`🚀 Auto-Play Start-Phase - ignoriere manueller-Scroll-Check`);
                isAutoPlayStartingRef.current = false; // Start-Phase beendet
                lastManualPhaseRef.current = currentTitleIndex;
                return;
            }

            // Nur stoppen wenn es ein GROSSER Sprung ist oder wenn zu Phase 0 zurückgegangen wird
            if (isAutoPlayingRef.current) {
                const phaseDifference = Math.abs(currentTitleIndex - lastManualPhaseRef.current);

                // Stoppe Auto-Play nur bei:
                // 1. Sprung zu Phase 0 (zurück zum Anfang)
                // 2. Sprung von mehr als 1 Phase (z.B. 2 → 5)
                if (currentTitleIndex === 0 || phaseDifference > 1) {
                    console.log(`👆 Manueller Scroll erkannt (Sprung: ${phaseDifference}) - Auto-Play gestoppt`);
                    isAutoPlayingRef.current = false;
                    setAutoPlayUIState(false); // UI-Update
                } else {
                    console.log(`✅ Normale Auto-Play Progression (${lastManualPhaseRef.current} → ${currentTitleIndex})`);
                }
            }

            lastManualPhaseRef.current = currentTitleIndex;
        }
    }, [currentTitleIndex]); // ✅ KEINE AUTO-PLAY DEPENDENCY!

    // ✅ ANTI-STOTTER: Reagiere auf Phase-Wechsel (mit Verzögerung)
    useEffect(() => {
        console.log(`📍 Phase gewechselt zu: ${currentTitleIndex}, Auto-Play: ${isAutoPlayingRef.current}, Scroll-Lock: ${isScrollLocked}`);

        // ✅ CLEANUP: Clear bestehende Audio-Timeouts bei Phase-Wechsel
        if (audioTimeoutRef.current) {
            clearTimeout(audioTimeoutRef.current);
            audioTimeoutRef.current = null;
        }

        if (currentTitleIndex === 0) {
            // Phase 0: Logo/Newsletter - stoppe alles NUR wenn Auto-Play nicht läuft
            if (!isAutoPlayingRef.current) {
                console.log(`🏠 Phase 0 erreicht - stoppe Audio`);
                stopAudio();
            } else {
                console.log(`🏠 Phase 0 erreicht - aber Auto-Play läuft, behalte Einstellungen`);
            }
            return;
        }

        // Phase 1-6: Spiele Audio ab (mit Anti-Stotter-Verzögerung)
        if (currentTitleIndex >= 1 && currentTitleIndex <= 6) {
            const audioIndex = currentTitleIndex - 1; // Phase 1-6 → Index 0-5

            // ✅ ANTI-STOTTER: Verzögerung nur bei Auto-Play (für sanfte Übergänge)
            if (isAutoPlayingRef.current) {
                console.log(`🎵 Auto-Play: Starte Audio für Phase ${currentTitleIndex} in 1s (Index ${audioIndex})`);
                audioTimeoutRef.current = setTimeout(() => {
                    // Doppelt prüfen ob Auto-Play noch aktiv ist
                    if (isAutoPlayingRef.current) {
                        playAudio(audioIndex);
                    }
                }, 1000); // 1 Sekunde Verzögerung für sanfte Übergänge
            }
            // Bei manuellem Scroll: Sofort, nur wenn scroll locked
            else if (isScrollLocked) {
                console.log(`🎵 Manuell: Starte Audio für Phase ${currentTitleIndex} sofort (Index ${audioIndex})`);
                // Kurze Verzögerung auch hier für bessere UX
                audioTimeoutRef.current = setTimeout(() => {
                    playAudio(audioIndex);
                }, 300);
            }
        }
    }, [currentTitleIndex, isScrollLocked, playAudio, stopAudio]); // ✅ KEINE AUTO-PLAY DEPENDENCY!

    // ✅ REF-BASIERT: Audio-Toggle für User-Kontrolle
    const toggleAudio = useCallback(() => {
        setIsAudioEnabled(prev => {
            const newState = !prev;
            if (!newState) {
                stopAudio();
                isAutoPlayingRef.current = false;
                isAutoPlayStartingRef.current = false;
                setAutoPlayUIState(false); // UI-Update
            }

            console.log(`🎵 Audio ${newState ? 'aktiviert' : 'deaktiviert'}`);
            return newState;
        });
    }, [stopAudio]);

    // ✅ VOLLSTÄNDIGES Cleanup bei Unmount
    useEffect(() => {
        return () => {
            console.log(`🧹 TitleAudioLayer Cleanup - stoppe alles`);

            // Clear alle Timer
            if (audioTimeoutRef.current) {
                clearTimeout(audioTimeoutRef.current);
            }

            // Clear alle Audio-Timer
            audioRefs.current.forEach(audio => {
                if (audio && audio.fallbackTimer) {
                    clearTimeout(audio.fallbackTimer);
                }
            });

            stopAudio();
        };
    }, [stopAudio]);

    // ✅ BUTTONS VIA PORTAL - Garantiert außerhalb der Layer-Hierarchie
    const buttonsContent = buttonPortal ? createPortal(
        <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            {/* ✅ AUTO-PLAY BUTTON (nur in Phase 0) */}
            {currentTitleIndex === 0 && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 Auto-Play Button geklickt!');
                        autoPlayUIState ? stopAutoPlay() : startAutoPlay();
                    }}
                    disabled={!scrollToTitleIndex}
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: autoPlayUIState ?
                            'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' :
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        color: 'white',
                        fontSize: '28px',
                        cursor: scrollToTitleIndex ? 'pointer' : 'not-allowed',
                        pointerEvents: 'all',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                        opacity: scrollToTitleIndex ? 1 : 0.5,
                        zIndex: 1,
                        // Anti-Selection
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                    }}
                    title={
                        !scrollToTitleIndex
                            ? 'Auto-Play nicht verfügbar'
                            : autoPlayUIState
                                ? 'Auto-Play pausieren'
                                : 'Auto-Play starten (komplette Sequenz)'
                    }
                >
                    {autoPlayUIState ? '⏸️' : '▶️'}
                </button>
            )}

            {/* ✅ AUDIO CONTROL (immer sichtbar) */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔊 Audio Toggle geklickt!');
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
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                }}
                title={isAudioEnabled ? 'Audio stumm schalten' : 'Audio aktivieren'}
            >
                {isAudioEnabled ? '🔊' : '🔇'}
            </button>

            {/* ✅ ERWEITERTES DEBUG PANEL */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'absolute',
                        top: '120px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '12px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        pointerEvents: 'all',
                        fontFamily: 'monospace',
                        lineHeight: '1.4',
                        border: '1px solid #333',
                        backdropFilter: 'blur(10px)',
                        zIndex: 1,
                        minWidth: '200px'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
                        🎵 Audio-Debug (Portal)
                    </div>
                    <div>📍 Phase: {currentTitleIndex}/6</div>
                    <div>🔊 Audio: {isAudioEnabled ? 'An' : 'Aus'}</div>
                    <div style={{ color: autoPlayUIState ? '#4CAF50' : '#ff9800' }}>
                        ▶️ Auto-Play: {autoPlayUIState ? '✅ LÄUFT' : '❌ GESTOPPT'}
                        {isAutoPlayStartingRef.current && ' 🚀'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#888' }}>
                        └ Starting: {isAutoPlayStartingRef.current ? 'JA' : 'NEIN'} | Letzte Phase: {lastManualPhaseRef.current}
                    </div>
                    <div style={{ fontSize: '9px', color: '#4CAF50' }}>
                        🔧 Ref-Status: {isAutoPlayingRef.current ? 'TRUE' : 'FALSE'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#888' }}>
                        🔒 Audio-Lock: {isPlayingAudioRef.current ? 'LOCKED' : 'FREE'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#888' }}>
                        ⏱️ Timer: {audioTimeoutRef.current ? 'AKTIV' : 'IDLE'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#888' }}>
                        🎯 scrollToTitleIndex: {scrollToTitleIndex ? '✅' : '❌'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#888' }}>
                        🌐 Portal: {buttonPortal ? '✅' : '❌'}
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '10px', color: '#888' }}>
                        🎶 Playing: {currentlyPlayingRef.current ?
                            titleAudios[currentTitleIndex - 1]?.title || 'Unknown' :
                            'None'
                        }
                    </div>

                    <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <button
                            onClick={toggleAudio}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: isAudioEnabled ? '#ff4444' : '#44ff44',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                pointerEvents: 'all',
                                marginRight: '4px'
                            }}
                        >
                            {isAudioEnabled ? '🔇' : '🔊'}
                        </button>

                        <button
                            onClick={() => {
                                console.log('🐛 Manual Debug Info:');
                                console.log('currentTitleIndex:', currentTitleIndex);
                                console.log('autoPlayUIState:', autoPlayUIState);
                                console.log('isAutoPlayingRef.current:', isAutoPlayingRef.current);
                                console.log('isAutoPlayStartingRef.current:', isAutoPlayStartingRef.current);
                                console.log('isPlayingAudioRef.current:', isPlayingAudioRef.current);
                                console.log('audioTimeoutRef.current:', audioTimeoutRef.current);
                                console.log('isScrollLocked:', isScrollLocked);
                                console.log('currentlyPlaying:', currentlyPlayingRef.current);
                                console.log('scrollToTitleIndex available:', !!scrollToTitleIndex);

                                // Audio-Status für alle Elemente
                                audioRefs.current.forEach((audio, index) => {
                                    if (audio) {
                                        console.log(`Audio ${index + 1} - readyState: ${audio.readyState}, duration: ${audio.duration}, currentTime: ${audio.currentTime}`);
                                    }
                                });
                            }}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                pointerEvents: 'all'
                            }}
                        >
                            📊 Log
                        </button>
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
                        ❌ Errors: {Object.values(errorStates).filter(Boolean).length}/6
                    </div>

                    {autoPlayUIState && (
                        <div style={{
                            marginTop: '4px',
                            fontSize: '9px',
                            color: '#4CAF50',
                            animation: 'pulse 2s infinite'
                        }}>
                            🎬 Auto-Play läuft...
                        </div>
                    )}
                </div>
            )}
        </div>,
        buttonPortal
    ) : null;

    return (
        <ErrorBoundary>
            {/* Audio-Elemente (versteckt) */}
            <div style={{ display: 'none' }}>
                {titleAudios.map((audioConfig, index) => (
                    <audio
                        key={audioConfig.id}
                        ref={el => audioRefs.current[index] = el}
                        preload="auto"
                        onLoadedData={() => handleAudioLoad(index)}
                        onError={(e) => handleAudioError(index, e)}
                        onLoadStart={() => setLoadingStates(prev => ({ ...prev, [index]: true }))}
                    >
                        <source
                            src={`${audioConfig.basePath}.mp3`}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}
            </div>

            {/* ✅ BUTTONS VIA PORTAL - Garantiert klickbar */}
            {buttonsContent}
        </ErrorBoundary>
    );
};

export default TitleAudioLayer;