// src/components/Enhanced/AudioLayer.jsx - REPARIERT FÜR 7 SNAP-POINTS
// 🎯 TITEL-AUDIO: Snap 1-3 | HINTERGRUNDMUSIK: Snap 1-3 | THEME: Snap 4-5 | SNAP 6: Newsletter

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

const EnhancedAudioLayer = ({
    activeSnapPoint = 0,
    scrollProgress = 0,
    isSnapping = false
}) => {
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

    // ===== SCROLL TRACKING =====
    const lastScrollProgressRef = useRef(0);
    const scrollDirectionRef = useRef('none');
    const backgroundMusicStartedRef = useRef(false);

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
        const isInSnapPoints4to5 = activeSnapPoint >= 4 && activeSnapPoint <= 5; // ✅ BLEIBT 4-5
        const isInSnapPoint0 = activeSnapPoint === 0;
        const isInSnapPoint6 = activeSnapPoint === 6; // ✅ NEU: Newsletter Snap

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

        // ===== SNAP 0 & 6: ALLES STOPPEN ===== ✅ ERWEITERT für Snap 6
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
            console.log(`   🎯 Snap-Point: ${snapPoint}/6`); // ✅ ANGEPASST /6
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
            }
            currentAudioRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    currentAudioRef.current = audio;
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
                    console.log(`🎯 STABLE SNAP-POINT: ${stableSnapPointRef.current} → ${newSnapPoint}/6`); // ✅ /6
                }

                stableSnapPointRef.current = newSnapPoint;

                // Snap-Points 1-3 haben Audio (UNVERÄNDERT)
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

                // ✅ ERWEITERT: Snap-Points 0, 4, 5, 6 haben kein Titel-Audio
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

    // ===== SNAP-POINT CHANGE HANDLING (ANGEPASST FÜR 7 SNAP-POINTS) =====
    useEffect(() => {
        if (!isAudioEnabled) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`📊 SNAP-POINT TRIGGER: Active=${activeSnapPoint}/6, LastTriggered=${lastTriggeredSnapPointRef.current}, Scroll=${(scrollProgress * 100).toFixed(1)}%`); // ✅ /6
        }

        // Sofortiger Trigger für Snap-Point Änderungen (UNVERÄNDERT: 1-3)
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

        // ✅ ERWEITERT: Snap-Points 4-6: Nur Theme/kein Audio, kein Titel-Audio
        if ((activeSnapPoint >= 4 && activeSnapPoint <= 6) && lastTriggeredSnapPointRef.current !== activeSnapPoint) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎸 SNAP ${activeSnapPoint}: Nur Theme/Silent, stoppe Titel-Audio`);
            }
            stopAllAudio();
            lastTriggeredSnapPointRef.current = activeSnapPoint;
        }

        // Snap-Point 0 ohne Audio (UNVERÄNDERT)
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
            console.log(`   Active Snap-Point: ${activeSnapPoint}/6`); // ✅ /6
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
        } else if (activeSnapPoint >= 4 && activeSnapPoint <= 6) { // ✅ ERWEITERT auf 6
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

    // ===== UI CONTROLS =====
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

            {/* ===== DEBUG PANEL (ANGEPASST FÜR 7 SNAP-POINTS) ===== */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '400px',
                        background: 'rgba(0,0,0,0.9)',
                        color: 'white',
                        padding: '12px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        pointerEvents: 'all',
                        fontFamily: 'monospace',
                        lineHeight: '1.4',
                        border: '2px solid #ff6b6b',
                        zIndex: 1,
                        minWidth: '350px'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ff6b6b' }}>
                        🎵 AUDIO SYSTEM - 7 SNAP-POINTS REPARIERT
                    </div>

                    <div>📍 Active Snap-Point: {activeSnapPoint}/6</div> {/* ✅ /6 */}
                    <div>📊 Scroll Progress: {(scrollProgress * 100).toFixed(1)}%</div>
                    <div>🎯 Stable Snap-Point: {stableSnapPointRef.current}</div>
                    <div>🎯 Last Triggered: {lastTriggeredSnapPointRef.current}</div>
                    <div>🔊 Audio Enabled: {isAudioEnabled ? 'Ja' : 'Nein'}</div>
                    <div>🎶 Currently Playing: {currentAudioRef.current ? 'Ja' : 'Nein'}</div>
                    <div>🎼 Background Music: {backgroundMusicPlaying ? `Ja (${(backgroundMusicVolume * 100).toFixed(0)}%)` : 'Nein'}</div>
                    <div>🎸 Theme Music: {themeMusicPlaying ? `Ja (${(themeMusicVolume * 100).toFixed(0)}%)` : 'Nein'}</div>
                    <div>🎼 Music System Enabled: {backgroundMusicEnabled ? 'Ja' : 'Nein'}</div>
                    <div>🎼 Music Started: {backgroundMusicStartedRef.current ? 'Ja' : 'Nein'}</div>

                    <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#ffff00' }}>
                            🎵 AUDIO MAPPING (7 SNAP-POINTS): {/* ✅ Hinweis */}
                        </div>
                        {AUDIO_CONFIG.map((config) => (
                            <div key={config.id} style={{
                                fontSize: '9px',
                                color: activeSnapPoint === config.snapPoint ? '#00ff00' : '#ccc'
                            }}>
                                Snap {config.snapPoint}: "{config.title}" + Hintergrundmusik
                            </div>
                        ))}
                        <div style={{
                            fontSize: '9px',
                            color: (activeSnapPoint === 4 || activeSnapPoint === 5) ? '#ff6b6b' : '#ccc'
                        }}>
                            Snap 4-5: "{THEME_MUSIC.title}" (ersetzt Hintergrundmusik)
                        </div>
                        <div style={{
                            fontSize: '9px',
                            color: activeSnapPoint === 6 ? '#ffaa00' : '#ccc'
                        }}>
                            Snap 6: Newsletter (Silent)
                        </div>
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
                            🛑 Stop All
                        </button>

                        <button
                            onClick={manualPlayCurrentSnapPoint}
                            style={{
                                padding: '4px 8px',
                                fontSize: '10px',
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '4px'
                            }}
                        >
                            ▶️ Play Current
                        </button>

                        <button
                            onClick={() => {
                                console.log('🎵 AUDIO DEBUG (7 SNAP-POINTS):');
                                console.log('Active Snap-Point:', activeSnapPoint + '/6');
                                console.log('Titel-Audio Config:', AUDIO_CONFIG);
                                console.log('Background Music:', BACKGROUND_MUSIC);
                                console.log('Theme Music:', THEME_MUSIC);
                                console.log('States:', {
                                    isAudioEnabled,
                                    backgroundMusicEnabled,
                                    backgroundMusicPlaying,
                                    backgroundMusicVolume,
                                    themeMusicPlaying,
                                    themeMusicVolume
                                });
                                console.log('Audio-System (7 Snap-Points):', {
                                    'Snap 0': 'Kein Audio',
                                    'Snap 1-3': 'Titel-Audio + Hintergrundmusik',
                                    'Snap 4-5': 'Theme (ersetzt Hintergrundmusik)',
                                    'Snap 6': 'Newsletter (Silent)'
                                });
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
                            🔍 Debug
                        </button>
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
                        ✅ AUDIO SYSTEM REPARIERT FÜR 7 SNAP-POINTS
                        <br />🎼 Hintergrundmusik: Snap 1-3
                        <br />🎸 Theme: Snap 4-5
                        <br />🎵 Titel-Audio: Nur Snap 1-3
                        <br />📧 Newsletter: Snap 6 (Silent)
                        <br />⏱️ Smooth Fades + Debounce
                    </div>
                </div>
            )}
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
};

export default EnhancedAudioLayer;