// src/components/Parallax/Elements/TitleAudioLayer.jsx - NEUE SEGMENT-AUFTEILUNG

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ErrorBoundary from '../../ErrorBoundary';

const TitleAudioLayer = ({ currentTitleIndex, isScrollLocked, scrollProgress = 0 }) => {
    const audioRefs = useRef([]);
    const currentAudioRef = useRef(null);
    const lastTriggeredPhaseRef = useRef(0); // ✅ NEU: Verfolge letzte getriggerte Phase

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [buttonPortal, setButtonPortal] = useState(null);

    const titleAudios = [
        {
            id: 'von-uns-heißt-fuer-uns',
            basePath: '/audio/von-uns-heißt-fuer-uns',
            title: 'Von Uns Heißt Für Uns',
            phase: 1
        },
        {
            id: 'der-weg-ist-das-ziel',
            basePath: '/audio/der-weg-ist-das-ziel',
            title: 'Der Weg Ist Das Ziel',
            phase: 2
        },
        {
            id: 'die-community-heißt',
            basePath: '/audio/die-community-heißt',
            title: 'Die Community Heißt',
            phase: 3
        }
    ];

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
        if (!audio) {
            console.warn(`❌ Audio ${audioIndex + 1} nicht gefunden`);
            return;
        }

        if (audio.readyState < 2) {
            console.log(`⏳ Audio ${audioIndex + 1} noch nicht geladen - retry in 200ms`);
            setTimeout(() => playAudio(audioIndex, reason), 200);
            return;
        }

        console.log(`🎵 SPIELE Audio ${audioIndex + 1}: ${titleAudios[audioIndex].title} (${reason})`);

        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current.onended = null;
        }

        audio.currentTime = 0;
        audio.onended = () => {
            console.log(`🔚 Audio ${audioIndex + 1} beendet`);
            currentAudioRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
                    console.log(`✅ Audio ${audioIndex + 1} spielt erfolgreich`);
                })
                .catch(error => {
                    console.warn(`❌ Audio ${audioIndex + 1} Play-Fehler:`, error);
                    if (error.name === 'NotAllowedError') {
                        console.log(`🚫 Browser blockiert Autoplay - Benutzer-Interaktion erforderlich`);
                    }
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

    // ✅ NEUE SEGMENT-AUFTEILUNG: Synchronisiert mit TitleLayer
    useEffect(() => {
        if (!isAudioEnabled) return;

        let currentPhase = 0;

        // ✅ NEUE BEREICHE: 16%, 32%, 40% Debug-Werte
        // Umrechnung: Debug-Wert = scrollProgress * 40
        if (scrollProgress >= 0.05 && scrollProgress < 0.4) currentPhase = 1;      // Phase 1: Von Uns Heißt Für Uns (bis 16% Debug)
        else if (scrollProgress >= 0.4 && scrollProgress < 0.8) currentPhase = 2;  // Phase 2: Der Weg Ist Das Ziel (bis 32% Debug)  
        else if (scrollProgress >= 0.8 && scrollProgress < 1.0) currentPhase = 3;  // Phase 3: Die Community Heißt (bis 40% Debug)

        console.log(`🎵 AUDIO-SYNC-CHECK: ScrollProgress=${scrollProgress.toFixed(3)}, Debug=${(scrollProgress * 40).toFixed(1)}%, Phase=${currentPhase}, LastTriggered=${lastTriggeredPhaseRef.current}`);

        // ✅ NUR BEI PHASEN-WECHSEL Audio starten
        if (currentPhase >= 1 && currentPhase <= 3 && currentPhase !== lastTriggeredPhaseRef.current && isScrollLocked) {
            const audioIndex = currentPhase - 1;

            console.log(`🎵 PHASEN-WECHSEL: ${lastTriggeredPhaseRef.current} → ${currentPhase} - Starte Audio ${audioIndex + 1}`);

            // Stoppe aktuelles Audio und starte neues
            stopAllAudio();
            setTimeout(() => {
                playAudio(audioIndex, `phase-change-${lastTriggeredPhaseRef.current}-to-${currentPhase}`);
            }, 100);

            lastTriggeredPhaseRef.current = currentPhase;
        }

        // Stoppe Audio wenn außerhalb Titel-Phasen
        if (currentPhase === 0 && lastTriggeredPhaseRef.current !== 0) {
            console.log(`🛑 PHASE-EXIT: Verlasse Titel-Bereiche - stoppe Audio`);
            stopAllAudio();
            lastTriggeredPhaseRef.current = 0;
        }

    }, [scrollProgress, isAudioEnabled, isScrollLocked, playAudio, stopAllAudio]);

    // ✅ MANUAL PLAY BUTTON mit neuen Bereichen
    const manualPlayCurrentPhase = useCallback(() => {
        let currentPhase = 0;

        // ✅ NEUE BEREICHE verwenden
        if (scrollProgress >= 0.05 && scrollProgress < 0.4) currentPhase = 1;
        else if (scrollProgress >= 0.4 && scrollProgress < 0.8) currentPhase = 2;
        else if (scrollProgress >= 0.8 && scrollProgress < 1.0) currentPhase = 3;

        if (currentPhase >= 1 && currentPhase <= 3) {
            const audioIndex = currentPhase - 1;
            console.log(`👆 MANUELLER PLAY: Phase ${currentPhase}`);
            stopAllAudio();
            setTimeout(() => {
                playAudio(audioIndex, `manual-play-phase-${currentPhase}`);
                lastTriggeredPhaseRef.current = currentPhase; // Update getriggerte Phase
            }, 100);
        } else {
            console.log(`⚠️ Keine Audio-Phase aktiv (Phase ${currentPhase})`);
        }
    }, [scrollProgress, playAudio, stopAllAudio]);

    useEffect(() => {
        return () => {
            console.log(`🧹 Audio Cleanup`);
            stopAllAudio();
        };
    }, [stopAllAudio]);

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
                        minWidth: '250px'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00ff00' }}>
                        🎵 AUDIO (NEUE SEGMENTE)
                    </div>
                    <div>📍 ScrollProgress: {scrollProgress.toFixed(3)}</div>
                    <div>📊 Debug: {(scrollProgress * 40).toFixed(1)}%</div>
                    <div>🎭 Snap Index: {currentTitleIndex}/8</div>
                    <div>🔊 Audio: {isAudioEnabled ? 'An' : 'Aus'}</div>
                    <div>🔒 Scroll Lock: {isScrollLocked ? 'Ja' : 'Nein'}</div>
                    <div>🎯 Last Triggered: {lastTriggeredPhaseRef.current}</div>

                    {/* ✅ NEUE Phase-Erkennung */}
                    {scrollProgress >= 0.05 && scrollProgress < 0.4 && (
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎵 Phase 1: Von Uns Heißt Für Uns (5%-40% = bis 16% Debug)
                        </div>
                    )}
                    {scrollProgress >= 0.4 && scrollProgress < 0.8 && (
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎵 Phase 2: Der Weg Ist Das Ziel (40%-80% = bis 32% Debug)
                        </div>
                    )}
                    {scrollProgress >= 0.8 && scrollProgress < 1.0 && (
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎵 Phase 3: Die Community Heißt (80%-100% = bis 40% Debug)
                        </div>
                    )}

                    <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>
                        🎶 Playing: {currentAudioRef.current ? 'Ja' : 'Nein'}
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
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
                        ✅ NEUE SEGMENTE: 16%, 32%, 40%
                        <br />🚫 Kein Mehrfach-Play innerhalb Phase
                        <br />🎯 LastTriggered verhindert Wiederholung
                    </div>
                </div>
            )}
        </div>,
        buttonPortal
    ) : null;

    return (
        <ErrorBoundary>
            <div style={{ display: 'none' }}>
                {titleAudios.map((audioConfig, index) => (
                    <audio
                        key={audioConfig.id}
                        ref={el => audioRefs.current[index] = el}
                        preload="auto"
                        onLoadedData={() => console.log(`🎵 Audio ${index + 1} geladen: ${audioConfig.title}`)}
                        onError={(e) => console.warn(`❌ Audio ${index + 1} Fehler:`, e)}
                    >
                        <source
                            src={`${audioConfig.basePath}.mp3`}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}
            </div>

            {buttonsContent}
        </ErrorBoundary>
    );
};

export default TitleAudioLayer;