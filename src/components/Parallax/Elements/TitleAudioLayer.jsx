// src/components/Parallax/Elements/TitleAudioLayer.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ErrorBoundary from '../../ErrorBoundary';

const TitleAudioLayer = ({ currentTitleIndex, isScrollLocked }) => {
    // ✅ MINIMALE REFS (ohne Auto-Play)
    const audioRefs = useRef([]);
    const currentAudioRef = useRef(null);
    const playedPhasesRef = useRef(new Set()); // Verhindert doppeltes Abspielen nur für manuell

    // ✅ MINIMALE STATES (ohne Auto-Play)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [buttonPortal, setButtonPortal] = useState(null);

    // Audio-Konfiguration
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

    // ✅ Portal Setup
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

    // ✅ EINFACHE AUDIO-FUNKTIONEN (ohne Auto-Play)
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
        if (!isAudioEnabled) return;

        const audio = audioRefs.current[audioIndex];
        if (!audio) return;

        if (audio.readyState < 2) {
            setTimeout(() => playAudio(audioIndex, reason), 200);
            return;
        }

        console.log(`🎵 SPIELE Audio ${audioIndex + 1}: ${titleAudios[audioIndex].title} (${reason})`);

        // Stoppe vorheriges Audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current.onended = null;
        }

        // Spiele neues Audio
        audio.currentTime = 0;
        audio.onended = () => {
            console.log(`🔚 Audio ${audioIndex + 1} beendet`);
            currentAudioRef.current = null;
            // Kein Auto-Play mehr - Audio endet einfach
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
                })
                .catch(error => {
                    console.warn(`❌ Audio ${audioIndex + 1} Fehler:`, error);
                    // Keine Auto-Play Fehlerbehandlung mehr
                });
        }
    }, [isAudioEnabled, titleAudios]);

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

    // ✅ KORRIGIERT: USEEFFECT - NUR MANUELLER MODUS + PHASE 7 UNTERSTÜTZUNG
    useEffect(() => {
        console.log(`📍 Phase: ${currentTitleIndex}, ScrollLocked: ${isScrollLocked}`);

        // Phase 0: Kein Audio
        if (currentTitleIndex === 0) {
            stopAllAudio();
            return;
        }

        // ✅ NEU: Phase 7: Carousel - Kein Audio, keine Blockierung
        if (currentTitleIndex === 7) {
            console.log(`🎠 Phase 7 (Carousel): Kein Audio erforderlich`);
            stopAllAudio(); // Stoppe eventuell laufendes Audio
            return; // ✅ WICHTIG: Keine weitere Logik, die blockieren könnte
        }

        // Phase 1-6: Nur manueller Audio-Modus
        if (currentTitleIndex >= 1 && currentTitleIndex <= 6 && isScrollLocked && isAudioEnabled) {
            const audioIndex = currentTitleIndex - 1;
            const manualPhaseKey = `manual-${currentTitleIndex}`;

            // Set verhindert Dopplung für manuellen Modus
            if (playedPhasesRef.current.has(manualPhaseKey)) {
                console.log(`⏭️ Manuelle Phase ${currentTitleIndex} kürzlich gespielt - kurze Pause`);
                // Nach 2 Sekunden aus Set entfernen
                setTimeout(() => {
                    playedPhasesRef.current.delete(manualPhaseKey);
                }, 2000);
                return;
            }

            playedPhasesRef.current.add(manualPhaseKey);

            console.log(`👆 Manuell: Spiele Phase ${currentTitleIndex}`);
            if (currentTitleIndex === 1) {
                setTimeout(() => {
                    playAudio(audioIndex, 'manual-phase1');
                }, 200);
            } else {
                setTimeout(() => {
                    playAudio(audioIndex, 'manual-delayed');
                }, 300);
            }
        }

    }, [currentTitleIndex, isScrollLocked, isAudioEnabled, playAudio, stopAllAudio]);

    // ✅ CLEANUP
    useEffect(() => {
        return () => {
            console.log(`🧹 Cleanup`);
            stopAllAudio();
        };
    }, [stopAllAudio]);

    // ✅ NUR AUDIO TOGGLE BUTTON (kein Auto-Play Button)
    const buttonsContent = buttonPortal ? createPortal(
        <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
            {/* AUDIO TOGGLE */}
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

            {/* ERWEITERTE DEBUG PANEL - PHASE 7 UNTERSTÜTZUNG */}
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
                        zIndex: 1,
                        minWidth: '160px'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00ff00' }}>
                        🎵 NUR MANUELL
                    </div>
                    <div>📍 Phase: {currentTitleIndex}/7</div>
                    <div>🔊 Audio: {isAudioEnabled ? 'An' : 'Aus'}</div>
                    <div>🔒 Scroll Lock: {isScrollLocked ? 'Ja' : 'Nein'}</div>

                    {/* ✅ NEU: Phase 7 Indikator */}
                    {currentTitleIndex === 7 && (
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎠 Carousel-Phase (Kein Audio)
                        </div>
                    )}

                    <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>
                        🎶 Playing: {currentAudioRef.current ? 'Ja' : 'Nein'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#888' }}>
                        📝 Gespielt: {playedPhasesRef.current.size} Phasen
                    </div>

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
                            onClick={() => {
                                console.log('🐛 Manueller Modus Debug:');
                                console.log('currentTitleIndex:', currentTitleIndex);
                                console.log('isScrollLocked:', isScrollLocked);
                                console.log('isAudioEnabled:', isAudioEnabled);
                                console.log('playedPhasesRef.current:', Array.from(playedPhasesRef.current));
                                console.log('currentAudioRef.current:', currentAudioRef.current);
                            }}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            📊 Log
                        </button>
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
                        👆 Nur manueller Modus
                        <br />✅ Set verhindert Doppel-Play
                        <br />✅ Clean & Einfach
                        <br />🚫 Kein Auto-Play
                        {currentTitleIndex === 7 && (
                            <>
                                <br />🎠 Phase 7: Carousel OK
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>,
        buttonPortal
    ) : null;

    return (
        <ErrorBoundary>
            {/* Audio-Elemente */}
            <div style={{ display: 'none' }}>
                {titleAudios.map((audioConfig, index) => (
                    <audio
                        key={audioConfig.id}
                        ref={el => audioRefs.current[index] = el}
                        preload="auto"
                        onLoadedData={() => console.log(`🎵 Audio ${index + 1} geladen`)}
                        onError={(e) => console.warn(`❌ Audio ${index + 1} Fehler:`, e)}
                    >
                        <source
                            src={`${audioConfig.basePath}.mp3`}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}
            </div>

            {/* Buttons */}
            {buttonsContent}
        </ErrorBoundary>
    );
};

export default TitleAudioLayer;