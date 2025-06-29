// src/components/Enhanced/AudioLayer.jsx - BEREINIGT OHNE DEBUG-PANEL
// 🎯 TITEL-AUDIO: Snap 1-3 | HINTERGRUNDMUSIK: Snap 1-3 | THEME: Snap 4-5 | SNAP 6: Newsletter
// ✅ Alle Debug-Panels entfernt - nutzt jetzt CentralDebugPanel

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import ErrorBoundary from '../ErrorBoundary';

// ===== AUDIO KONFIGURATION (UNVERÄNDERT) =====
const AUDIO_CONFIG = [
    {
        id: 'audio-1',
        snapPoint: 1,
        title: 'Von Uns Heißt Für Uns',
        fileName: 'von-uns-heißt-fuer-uns.mp3',
        path: '/audio/von-uns-heißt-fuer-uns.mp3'
    },
    {
        id: 'audio-2',
        snapPoint: 2,
        title: 'Der Weg Ist Das Ziel',
        fileName: 'der-weg-ist-das-ziel.mp3',
        path: '/audio/der-weg-ist-das-ziel.mp3'
    },
    {
        id: 'audio-3',
        snapPoint: 3,
        title: 'Die Community Heißt',
        fileName: 'die-community-heißt.mp3',
        path: '/audio/die-community-heißt.mp3'
    }
];

const BACKGROUND_MUSIC = {
    id: 'background-music',
    title: 'Untermalung',
    fileName: 'untermalung.mp3',
    path: '/audio/untermalung.mp3'
};

const THEME_MUSIC = {
    id: 'theme-music',
    title: 'AniTune Theme',
    fileName: 'anitune-theme.mp3',
    path: '/audio/anitune-theme.mp3'
};

const EnhancedAudioLayer = React.forwardRef(({
    activeSnapPoint = 0,
    scrollProgress = 0,
    isSnapping = false,
    onAudioPlayingChange, // ✅ Callback für Lock-System
    onCurrentAudioChange, // ✅ NEU: Callback für aktuelles Audio
    onBackgroundMusicChange, // ✅ Callback für Debug-Panel
    onThemeMusicChange // ✅ Callback für Debug-Panel
}, ref) => {
    // ===== REFS =====
    const audioRefs = useRef([]);
    const backgroundMusicRef = useRef(null);
    const themeMusicRef = useRef(null);
    const currentAudioRef = useRef(null);
    const backgroundTweenRef = useRef(null);
    const themeTweenRef = useRef(null);
    const lastTriggeredSnapPointRef = useRef(0);
    const snapPointDebounceRef = useRef(null);
    const stableSnapPointRef = useRef(0);

    // ===== STATES =====
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);
    const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
    const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0);
    const [themeMusicPlaying, setThemeMusicPlaying] = useState(false);
    const [themeMusicVolume, setThemeMusicVolume] = useState(0);
    const [buttonPortal, setButtonPortal] = useState(null);
    const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState(null); // ✅ NEU: Reactive State

    // ===== SCROLL TRACKING =====
    const lastScrollProgressRef = useRef(0);
    const scrollDirectionRef = useRef('none');
    const backgroundMusicStartedRef = useRef(false);

    // ===== ✅ LOCK-SYSTEM: Audio Status überwachen (REACTIVE) =====
    useEffect(() => {
        const isPlaying = currentlyPlayingAudio !== null;
        const playingSnapPoint = isPlaying ? activeSnapPoint : null;

        if (onAudioPlayingChange) {
            onAudioPlayingChange(isPlaying, playingSnapPoint);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 AUDIO STATUS → LOCK: Playing=${isPlaying}, Snap=${playingSnapPoint}, Audio=${currentlyPlayingAudio || 'none'}`);
        }
    }, [currentlyPlayingAudio, activeSnapPoint, onAudioPlayingChange]); // ✅ Hört auf reactive State

    // ===== ✅ BACKGROUND MUSIC STATUS ÜBERWACHEN =====
    useEffect(() => {
        if (onBackgroundMusicChange) {
            onBackgroundMusicChange(backgroundMusicPlaying, backgroundMusicVolume);
        }
    }, [backgroundMusicPlaying, backgroundMusicVolume, onBackgroundMusicChange]);

    // ===== ✅ CURRENT AUDIO STATUS ÜBERWACHEN =====
    useEffect(() => {
        if (onCurrentAudioChange) {
            onCurrentAudioChange(currentlyPlayingAudio);
        }
    }, [currentlyPlayingAudio, onCurrentAudioChange]);

    // ===== ✅ THEME MUSIC STATUS ÜBERWACHEN =====
    useEffect(() => {
        if (onThemeMusicChange) {
            onThemeMusicChange(themeMusicPlaying, themeMusicVolume);
        }
    }, [themeMusicPlaying, themeMusicVolume, onThemeMusicChange]);

    // ===== PORTAL SETUP =====
    useEffect(() => {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'enhanced-audio-controls-portal';
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

    // ===== SCROLL DIRECTION DETECTION =====
    const detectScrollDirection = useCallback((currentProgress) => {
        const lastProgress = lastScrollProgressRef.current;

        if (currentProgress > lastProgress) {
            scrollDirectionRef.current = 'down';
        } else if (currentProgress < lastProgress) {
            scrollDirectionRef.current = 'up';
        }

        lastScrollProgressRef.current = currentProgress;
        return scrollDirectionRef.current;
    }, []);

    // ===== BACKGROUND MUSIC FUNCTIONS =====
    const fadeBackgroundMusicIn = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current || !backgroundMusicEnabled) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎼 BACKGROUND: Fade In (${duration}s) - VON NEUEM`);
        }

        if (backgroundTweenRef.current) {
            backgroundTweenRef.current.kill();
        }

        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current.volume = 0;
        setBackgroundMusicVolume(0);

        if (backgroundMusicRef.current.paused) {
            const playPromise = backgroundMusicRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setBackgroundMusicPlaying(true);
                        backgroundMusicStartedRef.current = true;
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`✅ BACKGROUND: Spielt VON NEUEM erfolgreich`);
                        }
                    })
                    .catch(error => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`❌ BACKGROUND: Play-Fehler:`, error);
                        }
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
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ BACKGROUND: Fade In komplett`);
                }
            }
        });
    }, [backgroundMusicEnabled]);

    const fadeBackgroundMusicOut = useCallback((duration = 2.0) => {
        if (!backgroundMusicRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎼 BACKGROUND: Fade Out (${duration}s)`);
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
                    console.log(`✅ BACKGROUND: Fade Out komplett`);
                }
            }
        });
    }, []);

    // ===== THEME MUSIC FUNCTIONS =====
    const fadeThemeMusicIn = useCallback((duration = 2.0) => {
        if (!themeMusicRef.current || !backgroundMusicEnabled) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎸 THEME: Fade In (${duration}s) - VON NEUEM`);
        }

        if (themeTweenRef.current) {
            themeTweenRef.current.kill();
        }

        themeMusicRef.current.currentTime = 0;
        themeMusicRef.current.volume = 0;
        setThemeMusicVolume(0);

        if (themeMusicRef.current.paused) {
            const playPromise = themeMusicRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setThemeMusicPlaying(true);
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`✅ THEME: Spielt VON NEUEM erfolgreich`);
                        }
                    })
                    .catch(error => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`❌ THEME: Play-Fehler:`, error);
                        }
                    });
            }
        }

        themeTweenRef.current = gsap.to(themeMusicRef.current, {
            volume: 0.5,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                setThemeMusicVolume(themeMusicRef.current.volume);
            },
            onComplete: () => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ THEME: Fade In komplett`);
                }
            }
        });
    }, [backgroundMusicEnabled]);

    const fadeThemeMusicOut = useCallback((duration = 2.0) => {
        if (!themeMusicRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎸 THEME: Fade Out (${duration}s)`);
        }

        if (themeTweenRef.current) {
            themeTweenRef.current.kill();
        }

        themeTweenRef.current = gsap.to(themeMusicRef.current, {
            volume: 0,
            duration: duration,
            ease: 'power2.in',
            onUpdate: () => {
                setThemeMusicVolume(themeMusicRef.current.volume);
            },
            onComplete: () => {
                themeMusicRef.current.pause();
                setThemeMusicPlaying(false);
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ THEME: Fade Out komplett`);
                }
            }
        });
    }, []);

    // ===== HINTERGRUNDMUSIK + THEME LOGIK (ANGEPASST FÜR 7 SNAP-POINTS) =====
    useEffect(() => {
        if (!backgroundMusicEnabled) return;

        const scrollDirection = detectScrollDirection(scrollProgress);
        const isFirstScrollDown = scrollDirection === 'down' && !backgroundMusicStartedRef.current;
        const isInSnapPoints1to3 = activeSnapPoint >= 1 && activeSnapPoint <= 3;
        const isInSnapPoints4to5 = activeSnapPoint >= 4 && activeSnapPoint <= 5;
        const isInSnapPoint0 = activeSnapPoint === 0;
        const isInSnapPoint6 = activeSnapPoint === 6;

        // ===== ERSTES SCROLLEN =====
        if (isFirstScrollDown && scrollProgress > 0.05) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎼 ERSTES SCROLLEN: Starte Audio-System`);
            }

            if (isInSnapPoints1to3) {
                fadeBackgroundMusicIn(2.0);
            } else if (isInSnapPoints4to5) {
                fadeThemeMusicIn(2.0);
            }
        }

        // ===== SNAP 1-3: HINTERGRUNDMUSIK =====
        if (isInSnapPoints1to3) {
            if (themeMusicPlaying) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔄 SNAP 1-3: Theme → Hintergrundmusik (SAUBERE ÜBERBLENDUNG)`);
                }
                fadeThemeMusicOut(0.3);
                fadeBackgroundMusicIn(0.3);
            } else if (!backgroundMusicPlaying && backgroundMusicStartedRef.current) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🎼 ZURÜCK ZU SNAP 1-3: Starte Hintergrundmusik`);
                }
                fadeBackgroundMusicIn(0.5);
            }
        }

        // ===== SNAP 4-5: THEME MUSIC =====
        if (isInSnapPoints4to5) {
            if (backgroundMusicPlaying) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔄 SNAP 4-5: Hintergrundmusik → Theme (SAUBERE ÜBERBLENDUNG)`);
                }
                fadeBackgroundMusicOut(0.3);
                fadeThemeMusicIn(0.3);
            } else if (!themeMusicPlaying && backgroundMusicStartedRef.current) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🎸 ZURÜCK ZU SNAP 4-5: Starte Theme`);
                }
                fadeThemeMusicIn(0.5);
            }
        }

        // ===== SNAP 0 & 6: ALLES STOPPEN =====
        if (isInSnapPoint0 || isInSnapPoint6) {
            if (backgroundMusicPlaying) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🛑 SNAP ${activeSnapPoint}: Stoppe Hintergrundmusik`);
                }
                fadeBackgroundMusicOut(2.0);
            }
            if (themeMusicPlaying) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🛑 SNAP ${activeSnapPoint}: Stoppe Theme`);
                }
                fadeThemeMusicOut(2.0);
            }
        }

    }, [scrollProgress, activeSnapPoint, backgroundMusicEnabled, backgroundMusicPlaying, themeMusicPlaying, fadeBackgroundMusicIn, fadeBackgroundMusicOut, fadeThemeMusicIn, fadeThemeMusicOut, detectScrollDirection]);

    // ===== AUDIO FUNCTIONS =====
    const stopAllAudio = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🛑 Stoppe alle Titel-Audios`);
        }

        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.onended = null;
            }
        });
        currentAudioRef.current = null;
        setCurrentlyPlayingAudio(null); // ✅ NEU: Reactive State update
    }, []);

    const playAudio = useCallback((snapPoint, reason = 'unknown') => {
        if (!isAudioEnabled) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔇 Audio deaktiviert - kein Play für Snap-Point ${snapPoint}`);
            }
            return;
        }

        const audioConfig = AUDIO_CONFIG.find(config => config.snapPoint === snapPoint);
        const audioIndex = AUDIO_CONFIG.findIndex(config => config.snapPoint === snapPoint);
        const audio = audioRefs.current[audioIndex];

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 PLAY-VERSUCH:`);
            console.log(`   🎯 Snap-Point: ${snapPoint}/6`);
            console.log(`   🎭 Titel: "${audioConfig ? audioConfig.title : 'NICHT GEFUNDEN'}"`);
            console.log(`   📁 Datei: ${audioConfig ? audioConfig.fileName : 'NICHT GEFUNDEN'}`);
            console.log(`   ❓ Reason: ${reason}`);
        }

        if (!audio || !audioConfig) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`❌ FEHLER: Audio für Snap-Point ${snapPoint} nicht verfügbar`);
            }
            return;
        }

        if (audio.readyState < 2) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏳ Audio Snap-Point ${snapPoint} noch nicht geladen - retry in 200ms`);
            }
            setTimeout(() => playAudio(snapPoint, reason), 200);
            return;
        }

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
                console.log(`🔓 AUDIO ENDE: currentAudioRef wird auf NULL gesetzt`);
            }
            currentAudioRef.current = null;
            setCurrentlyPlayingAudio(null); // ✅ NEU: Reactive State update
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
                    setCurrentlyPlayingAudio(audioConfig.title); // ✅ NEU: Reactive State update
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ SPIELT: "${audioConfig.title}" (${audio.duration.toFixed(1)}s)`);
                    }
                })
                .catch(error => {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`❌ PLAY-FEHLER für "${audioConfig.title}":`, error);
                    }
                });
        }
    }, [isAudioEnabled]);

    // ===== DEBOUNCED SNAP-POINT HANDLING =====
    const updateStableSnapPoint = useCallback((newSnapPoint) => {
        if (snapPointDebounceRef.current) {
            clearTimeout(snapPointDebounceRef.current);
        }

        snapPointDebounceRef.current = setTimeout(() => {
            if (stableSnapPointRef.current !== newSnapPoint) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🎯 STABLE SNAP-POINT: ${stableSnapPointRef.current} → ${newSnapPoint}/6`);
                }

                stableSnapPointRef.current = newSnapPoint;

                // Snap-Points 1-3 haben Audio
                if (newSnapPoint >= 1 && newSnapPoint <= 3 && newSnapPoint !== lastTriggeredSnapPointRef.current) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`🎵 STABLE SNAP-POINT-WECHSEL: → Snap ${newSnapPoint} - Starte Audio`);
                    }

                    if (currentAudioRef.current) {
                        stopAllAudio();
                    }

                    setTimeout(() => {
                        playAudio(newSnapPoint, `stable-snap-${newSnapPoint}`);
                    }, 50);

                    lastTriggeredSnapPointRef.current = newSnapPoint;
                }

                // Snap-Points 0, 4, 5, 6 haben kein Titel-Audio
                if ((newSnapPoint === 0 || newSnapPoint >= 4) && lastTriggeredSnapPointRef.current !== newSnapPoint) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`🛑 STABLE SNAP-EXIT: Verlasse Audio-Bereiche (Snap ${newSnapPoint})`);
                    }
                    stopAllAudio();
                    lastTriggeredSnapPointRef.current = newSnapPoint;
                }
            }
        }, 300);
    }, [playAudio, stopAllAudio]);

    // ===== SNAP-POINT CHANGE HANDLING =====
    useEffect(() => {
        if (!isAudioEnabled) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 SNAP-POINT TRIGGER: Active=${activeSnapPoint}/6, LastTriggered=${lastTriggeredSnapPointRef.current}, Scroll=${(scrollProgress * 100).toFixed(1)}%`);
        }

        // Sofortiger Trigger für Snap-Point Änderungen (1-3)
        if (activeSnapPoint >= 1 && activeSnapPoint <= 3 && activeSnapPoint !== lastTriggeredSnapPointRef.current) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎵 SOFORTIGER SNAP-POINT-WECHSEL: → Snap ${activeSnapPoint} - Starte Titel-Audio SOFORT`);
            }

            if (currentAudioRef.current) {
                stopAllAudio();
            }

            playAudio(activeSnapPoint, `immediate-snap-${activeSnapPoint}`);
            lastTriggeredSnapPointRef.current = activeSnapPoint;
        }

        // Snap-Points 4-6: Nur Theme/kein Audio, kein Titel-Audio
        if ((activeSnapPoint >= 4 && activeSnapPoint <= 6) && lastTriggeredSnapPointRef.current !== activeSnapPoint) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎸 SNAP ${activeSnapPoint}: Nur Theme/Silent, stoppe Titel-Audio`);
            }
            stopAllAudio();
            lastTriggeredSnapPointRef.current = activeSnapPoint;
        }

        // Snap-Point 0 ohne Audio
        if (activeSnapPoint === 0 && lastTriggeredSnapPointRef.current !== activeSnapPoint) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🛑 SNAP-EXIT: Verlasse Audio-Bereiche (Snap ${activeSnapPoint})`);
            }
            stopAllAudio();
            lastTriggeredSnapPointRef.current = activeSnapPoint;
        }

        updateStableSnapPoint(activeSnapPoint);

    }, [activeSnapPoint, isAudioEnabled, playAudio, stopAllAudio, scrollProgress, updateStableSnapPoint]);

    // ===== MANUAL FUNCTIONS =====
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
            if (!newState) {
                if (backgroundMusicPlaying) {
                    fadeBackgroundMusicOut(1.0);
                }
                if (themeMusicPlaying) {
                    fadeThemeMusicOut(1.0);
                }
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎼 Hintergrund-/Theme-Musik ${newState ? 'aktiviert' : 'deaktiviert'}`);
            }
            return newState;
        });
    }, [backgroundMusicPlaying, themeMusicPlaying, fadeBackgroundMusicOut, fadeThemeMusicOut]);

    const manualPlayCurrentSnapPoint = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`👆 MANUAL PLAY:`);
            console.log(`   Active Snap-Point: ${activeSnapPoint}/6`);
            console.log(`   Scroll Progress: ${(scrollProgress * 100).toFixed(1)}%`);
        }

        if (activeSnapPoint >= 1 && activeSnapPoint <= 3) {
            const audioConfig = AUDIO_CONFIG.find(config => config.snapPoint === activeSnapPoint);

            if (process.env.NODE_ENV === 'development') {
                console.log(`   → Spiele Titel-Audio für Snap ${activeSnapPoint}: ${audioConfig.title}`);
                console.log(`   → Datei: ${audioConfig.fileName}`);
            }

            stopAllAudio();
            setTimeout(() => {
                playAudio(activeSnapPoint, `manual-snap-${activeSnapPoint}`);
                lastTriggeredSnapPointRef.current = activeSnapPoint;
                stableSnapPointRef.current = activeSnapPoint;
            }, 50);
        } else if (activeSnapPoint >= 4 && activeSnapPoint <= 6) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`   → Snap ${activeSnapPoint}: Nur Theme/Silent läuft (kein Titel-Audio)`);
                if (activeSnapPoint <= 5) {
                    console.log(`   → Theme: ${THEME_MUSIC.title}`);
                } else {
                    console.log(`   → Newsletter: Silent`);
                }
            }
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.log(`   → Kein Audio für Snap-Point ${activeSnapPoint}`);
                console.log(`   → Titel-Audio nur für Snap-Points 1-3`);
            }
        }
    }, [activeSnapPoint, scrollProgress, playAudio, stopAllAudio]);

    // ===== ✅ SKIP FUNCTION FÜR LOCK-SYSTEM =====
    const handleSkipAudio = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`⏭️ SKIP FUNCTION: Stoppe aktuelles Audio`);
        }
        stopAllAudio();
    }, [stopAllAudio]);

    // ===== EXPOSE FUNCTIONS VIA REF =====
    React.useImperativeHandle(ref, () => ({
        handleSkipAudio
    }), [handleSkipAudio]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🧹 Enhanced Audio Cleanup`);
            }
            stopAllAudio();
            if (backgroundTweenRef.current) {
                backgroundTweenRef.current.kill();
            }
            if (themeTweenRef.current) {
                themeTweenRef.current.kill();
            }
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
            }
            if (themeMusicRef.current) {
                themeMusicRef.current.pause();
            }
            if (snapPointDebounceRef.current) {
                clearTimeout(snapPointDebounceRef.current);
            }
        };
    }, [stopAllAudio]);

    // ===== UI CONTROLS (KOMPAKTER - OHNE DEBUG-PANEL) =====
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
                    manualPlayCurrentSnapPoint();
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
        </div>,
        buttonPortal
    ) : null;

    return (
        <ErrorBoundary>
            {/* ===== AUDIO ELEMENTS ===== */}
            <div style={{ display: 'none' }}>
                {/* Titel-Audios */}
                {AUDIO_CONFIG.map((audioConfig, index) => (
                    <audio
                        key={audioConfig.id}
                        ref={el => audioRefs.current[index] = el}
                        preload="auto"
                        onLoadedData={() => {
                            if (process.env.NODE_ENV === 'development') {
                                console.log(`🎵 GELADEN: ${audioConfig.title} (${audioConfig.fileName})`);
                            }
                        }}
                        onError={(e) => {
                            if (process.env.NODE_ENV === 'development') {
                                console.warn(`❌ FEHLER: ${audioConfig.title} (${audioConfig.fileName})`, e);
                            }
                        }}
                    >
                        <source
                            src={audioConfig.path}
                            type="audio/mpeg"
                        />
                    </audio>
                ))}

                {/* Hintergrundmusik */}
                <audio
                    ref={backgroundMusicRef}
                    preload="auto"
                    loop={false}
                    onLoadedData={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎼 GELADEN: Hintergrundmusik (${BACKGROUND_MUSIC.fileName})`);
                        }
                    }}
                    onError={(e) => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`❌ FEHLER: Hintergrundmusik (${BACKGROUND_MUSIC.fileName})`, e);
                        }
                    }}
                    onEnded={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎼 Hintergrundmusik beendet`);
                        }
                        setBackgroundMusicPlaying(false);
                        setBackgroundMusicVolume(0);
                    }}
                >
                    <source
                        src={BACKGROUND_MUSIC.path}
                        type="audio/mpeg"
                    />
                </audio>

                {/* Theme Music */}
                <audio
                    ref={themeMusicRef}
                    preload="auto"
                    loop={false}
                    onLoadedData={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎸 GELADEN: Theme Music (${THEME_MUSIC.fileName})`);
                        }
                    }}
                    onError={(e) => {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn(`❌ FEHLER: Theme Music (${THEME_MUSIC.fileName})`, e);
                        }
                    }}
                    onEnded={() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎸 Theme Music beendet`);
                        }
                        setThemeMusicPlaying(false);
                        setThemeMusicVolume(0);
                    }}
                >
                    <source
                        src={THEME_MUSIC.path}
                        type="audio/mpeg"
                    />
                </audio>
            </div>

            {/* ===== UI CONTROLS ===== */}
            {buttonsContent}
        </ErrorBoundary>
    );
});

EnhancedAudioLayer.displayName = 'EnhancedAudioLayer';

export default EnhancedAudioLayer;