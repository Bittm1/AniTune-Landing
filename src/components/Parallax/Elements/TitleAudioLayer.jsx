// src/components/Parallax/Elements/TitleAudioLayer.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import ErrorBoundary from '../../ErrorBoundary';

const TitleAudioLayer = ({ currentTitleIndex, isScrollLocked }) => {
    // Refs für alle Audio-Elemente
    const audioRefs = useRef([]);
    const currentlyPlayingRef = useRef(null);

    // States
    const [loadingStates, setLoadingStates] = useState({});
    const [errorStates, setErrorStates] = useState({});
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

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
            id: 'heisst',
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

    // Audio-Loading-Handler
    const handleAudioLoad = useCallback((index) => {
        setLoadingStates(prev => ({
            ...prev,
            [index]: false
        }));

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 Audio ${index + 1} (${titleAudios[index].title}) geladen`);
        }
    }, [titleAudios]);

    // Audio-Error-Handler
    const handleAudioError = useCallback((index, error) => {
        setErrorStates(prev => ({
            ...prev,
            [index]: true
        }));

        console.warn(`❌ Audio ${index + 1} (${titleAudios[index].title}) konnte nicht geladen werden:`, error);
    }, [titleAudios]);

    // Audio abspielen
    const playAudio = useCallback((audioIndex) => {
        if (!isAudioEnabled || errorStates[audioIndex]) return;

        const audio = audioRefs.current[audioIndex];
        if (!audio) return;

        // Stoppe aktuell spielendes Audio
        if (currentlyPlayingRef.current && currentlyPlayingRef.current !== audio) {
            currentlyPlayingRef.current.pause();
            currentlyPlayingRef.current.currentTime = 0;
        }

        // Spiele neues Audio ab
        audio.currentTime = 0;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentlyPlayingRef.current = audio;
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`🔊 Spiele Audio: ${titleAudios[audioIndex].title} (Phase ${currentTitleIndex})`);
                    }
                })
                .catch(error => {
                    console.warn(`❌ Audio-Wiedergabe fehlgeschlagen:`, error);
                    // Oft ein User-Interaction-Problem - stille Behandlung
                });
        }
    }, [isAudioEnabled, errorStates, currentTitleIndex, titleAudios]);

    // Audio stoppen
    const stopAudio = useCallback(() => {
        if (currentlyPlayingRef.current) {
            currentlyPlayingRef.current.pause();
            currentlyPlayingRef.current.currentTime = 0;
            currentlyPlayingRef.current = null;

            if (process.env.NODE_ENV === 'development') {
                console.log(`⏹️ Audio gestoppt`);
            }
        }
    }, []);

    // Reagiere auf Phase-Wechsel - KORRIGIERT
    useEffect(() => {
        // Phase 0 (Logo/Newsletter) - kein Audio
        if (currentTitleIndex === 0) {
            stopAudio();
            return;
        }

        // Phase 1-6 - spiele entsprechendes Audio NUR wenn scroll locked
        if (currentTitleIndex >= 1 && currentTitleIndex <= 6 && isScrollLocked) {
            const audioIndex = currentTitleIndex - 1; // Phase 1-6 → Index 0-5
            playAudio(audioIndex);
        }
        // ✅ WICHTIG: KEIN ELSE mit stopAudio() mehr!
        // Audio läuft weiter bis es von selbst endet oder User scrollt

    }, [currentTitleIndex, isScrollLocked, playAudio, stopAudio]);

    // Audio-Toggle für User-Kontrolle
    const toggleAudio = useCallback(() => {
        setIsAudioEnabled(prev => {
            const newState = !prev;
            if (!newState) {
                stopAudio();
            }

            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 Audio ${newState ? 'aktiviert' : 'deaktiviert'}`);
            }

            return newState;
        });
    }, [stopAudio]);

    // Cleanup bei Unmount
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, [stopAudio]);

    // Debug-Panel (nur Development)
    const debugPanel = process.env.NODE_ENV === 'development' ? (
        <div
            style={{
                position: 'fixed',
                top: '120px',
                right: '10px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                pointerEvents: 'all',
                fontFamily: 'monospace',
                lineHeight: '1.4',
                zIndex: 1001
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                🎵 Audio-Debug
            </div>
            <div>Phase: {currentTitleIndex}/6</div>
            <div>Audio: {isAudioEnabled ? '🔊 An' : '🔇 Aus'}</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div>Playing: {currentlyPlayingRef.current ? titleAudios[currentTitleIndex - 1]?.title || 'Unknown' : 'None'}</div>

            <button
                onClick={toggleAudio}
                style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    background: isAudioEnabled ? '#ff4444' : '#44ff44',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {isAudioEnabled ? '🔇 Stumm' : '🔊 Audio'}
            </button>

            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
                Errors: {Object.values(errorStates).filter(Boolean).length}/6
            </div>
        </div>
    ) : null;

    // User-Audio-Control (immer sichtbar)
    const audioControl = (
        <button
            onClick={toggleAudio}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: isAudioEnabled ?
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                    'rgba(100, 100, 100, 0.8)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 1000,
                pointerEvents: 'all',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
            title={isAudioEnabled ? 'Audio stumm schalten' : 'Audio aktivieren'}
        >
            {isAudioEnabled ? '🔊' : '🔇'}
        </button>
    );

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
                        {/* Progressive Enhancement: 3 Formate */}
                        <source
                            src={`${audioConfig.basePath}.mp3`}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}
            </div>

            {/* Audio-Kontrolle für User */}
            {audioControl}

            {/* Debug-Panel (nur Development) */}
            {debugPanel}
        </ErrorBoundary>
    );
};

export default TitleAudioLayer;