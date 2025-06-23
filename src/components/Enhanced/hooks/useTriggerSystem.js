// src/components/Parallax/Enhanced/hooks/useTriggerSystem.js
// 🎵 LAYER 4: TRIGGER SYSTEM - Audio & Animation Coordination

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';

// Import centralized phase configuration
import {
    getActivePhaseFromScroll,
    getAudioConfigForPhase,
    getPhaseDebugInfo
} from '../../utils/phaseUtils';

/**
 * 🎯 TRIGGER SYSTEM HOOK
 * Koordiniert Audio-Playback und GSAP-Animationen basierend auf Snap-Points
 * 
 * @param {Object} params
 * @param {number} params.activeSnapPoint - Aktueller Snap-Point (0-5)
 * @param {number} params.scrollProgress - Scroll-Progress (0-1)
 * @param {boolean} params.isSnapping - Snap-Animation läuft
 * @param {string} params.phaseType - Art der Phase ('logo', 'title', 'carousel', 'newsletter')
 */
export const useTriggerSystem = ({
    activeSnapPoint = 0,
    scrollProgress = 0,
    isSnapping = false,
    phaseType = 'logo'
}) => {
    // ===== AUDIO STATES =====
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [currentAudioPhase, setCurrentAudioPhase] = useState(0);
    const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);

    // ===== REFS =====
    const audioRefs = useRef({});
    const currentAudioRef = useRef(null);
    const backgroundMusicRef = useRef(null);
    const animationRefs = useRef({});
    const lastTriggeredPhaseRef = useRef(0);

    // ===== MOBILE DETECTION =====
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // ===== AUDIO CONFIGURATION =====
    const audioConfigs = [
        { phase: 1, path: '/audio/von-uns-heißt-fuer-uns.mp3', title: 'Von Uns Heißt Für Uns' },
        { phase: 2, path: '/audio/der-weg-ist-das-ziel.mp3', title: 'Der Weg Ist Das Ziel' },
        { phase: 3, path: '/audio/die-community-heißt.mp3', title: 'Die Community Heißt' },
        { phase: 4, path: '/audio/anitune-theme.mp3', title: 'AniTune Theme' }
    ];

    // ===== AUDIO PRELOADING =====
    useEffect(() => {
        audioConfigs.forEach(config => {
            if (!audioRefs.current[config.phase]) {
                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = config.path;
                audioRefs.current[config.phase] = audio;
            }
        });

        // Background Music
        if (!backgroundMusicRef.current) {
            const bgAudio = new Audio();
            bgAudio.preload = 'auto';
            bgAudio.src = '/audio/untermalung.mp3';
            bgAudio.loop = false;
            backgroundMusicRef.current = bgAudio;
        }
    }, []);

    // ===== AUDIO CONTROL FUNCTIONS =====
    const stopAllAudio = useCallback(() => {
        // Stop phase audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }

        // Stop background music
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause();
            setIsBackgroundMusicPlaying(false);
        }
    }, []);

    const playPhaseAudio = useCallback((phase) => {
        if (!isAudioEnabled || !audioRefs.current[phase]) return;

        // Stop current audio
        if (currentAudioRef.current && currentAudioRef.current !== audioRefs.current[phase]) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
        }

        const audio = audioRefs.current[phase];
        if (audio.readyState >= 2) {
            audio.currentTime = 0;
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        currentAudioRef.current = audio;
                        setCurrentAudioPhase(phase);

                        if (process.env.NODE_ENV === 'development') {
                            console.log(`🎵 Trigger: Playing phase ${phase} audio`);
                        }
                    })
                    .catch(error => {
                        console.warn(`Audio play failed for phase ${phase}:`, error);
                    });
            }
        }
    }, [isAudioEnabled]);

    const startBackgroundMusic = useCallback(() => {
        if (!isAudioEnabled || !backgroundMusicRef.current || isBackgroundMusicPlaying) return;

        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current.volume = 0.3;

        const playPromise = backgroundMusicRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsBackgroundMusicPlaying(true);
                })
                .catch(error => {
                    console.warn('Background music play failed:', error);
                });
        }
    }, [isAudioEnabled, isBackgroundMusicPlaying]);

    const stopBackgroundMusic = useCallback(() => {
        if (backgroundMusicRef.current && isBackgroundMusicPlaying) {
            gsap.to(backgroundMusicRef.current, {
                volume: 0,
                duration: 1.0,
                onComplete: () => {
                    backgroundMusicRef.current.pause();
                    setIsBackgroundMusicPlaying(false);
                }
            });
        }
    }, [isBackgroundMusicPlaying]);

    // ===== ANIMATION TRIGGERS =====
    const triggerAnimation = useCallback((type, target, config = {}) => {
        if (!target) return;

        const animationId = `${type}_${Date.now()}`;

        // Kill existing animation if any
        if (animationRefs.current[animationId]) {
            animationRefs.current[animationId].kill();
        }

        // Default animation configs
        const defaults = {
            fadeIn: { opacity: 1, duration: 0.8, ease: 'power2.out' },
            fadeOut: { opacity: 0, duration: 0.5, ease: 'power2.in' },
            slideUp: { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            slideDown: { y: 50, opacity: 0, duration: 0.5, ease: 'power2.in' },
            scaleIn: { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
            scaleOut: { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.in' }
        };

        const animationConfig = { ...defaults[type], ...config };

        const animation = gsap.to(target, {
            ...animationConfig,
            onComplete: () => {
                delete animationRefs.current[animationId];
            }
        });

        animationRefs.current[animationId] = animation;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎬 Trigger: Animation ${type} triggered`);
        }

        return animation;
    }, []);

    // ===== MAIN TRIGGER LOGIC =====
    const triggerAudio = useCallback((phase) => {
        if (phase >= 1 && phase <= 4 && phase !== lastTriggeredPhaseRef.current) {
            playPhaseAudio(phase);
            lastTriggeredPhaseRef.current = phase;
        } else if (phase === 0) {
            stopAllAudio();
            lastTriggeredPhaseRef.current = 0;
        }
    }, [playPhaseAudio, stopAllAudio]);

    // ===== BACKGROUND MUSIC LOGIC =====
    useEffect(() => {
        const isInTitlePhases = activeSnapPoint >= 1 && activeSnapPoint <= 3;

        if (isInTitlePhases && !isBackgroundMusicPlaying) {
            setTimeout(() => startBackgroundMusic(), 500);
        } else if (!isInTitlePhases && isBackgroundMusicPlaying) {
            stopBackgroundMusic();
        }
    }, [activeSnapPoint, isBackgroundMusicPlaying, startBackgroundMusic, stopBackgroundMusic]);

    // ===== SNAP POINT AUDIO TRIGGERS =====
    useEffect(() => {
        if (isSnapping) return; // Don't trigger during snap animations

        // Convert snap points to phases
        const phaseMap = {
            0: 0, // Logo
            1: 1, // Von Uns Heißt Für Uns  
            2: 2, // Der Weg Ist Das Ziel
            3: 3, // Die Community Heißt
            4: 4, // AniTune Theme (only desktop)
            5: 0, // Carousel (no audio)
            6: 0  // Newsletter (no audio)
        };

        const targetPhase = phaseMap[activeSnapPoint] || 0;

        // Only trigger audio for desktop phase 4, skip for mobile
        if (activeSnapPoint === 4 && isMobile) {
            return;
        }

        triggerAudio(targetPhase);
    }, [activeSnapPoint, isSnapping, triggerAudio, isMobile]);

    // ===== AUDIO CONTROL FUNCTIONS =====
    const toggleAudio = useCallback(() => {
        setIsAudioEnabled(prev => {
            const newState = !prev;
            if (!newState) {
                stopAllAudio();
            }
            return newState;
        });
    }, [stopAllAudio]);

    const playCurrentPhaseAudio = useCallback(() => {
        const phaseMap = {
            1: 1, 2: 2, 3: 3, 4: 4
        };

        const targetPhase = phaseMap[activeSnapPoint];
        if (targetPhase && (!isMobile || activeSnapPoint !== 4)) {
            playPhaseAudio(targetPhase);
        }
    }, [activeSnapPoint, playPhaseAudio, isMobile]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            stopAllAudio();
            Object.values(animationRefs.current).forEach(animation => {
                if (animation && animation.kill) {
                    animation.kill();
                }
            });
        };
    }, [stopAllAudio]);

    // ===== DEBUG INFO =====
    const getDebugInfo = useCallback(() => {
        if (process.env.NODE_ENV !== 'development') return null;

        return {
            activeSnapPoint,
            currentAudioPhase,
            isAudioEnabled,
            isBackgroundMusicPlaying,
            lastTriggeredPhase: lastTriggeredPhaseRef.current,
            audioStates: Object.keys(audioRefs.current).map(phase => ({
                phase,
                loaded: audioRefs.current[phase]?.readyState >= 2,
                playing: audioRefs.current[phase] === currentAudioRef.current
            })),
            backgroundMusicState: {
                loaded: backgroundMusicRef.current?.readyState >= 2,
                playing: isBackgroundMusicPlaying,
                volume: backgroundMusicRef.current?.volume || 0
            },
            activeAnimations: Object.keys(animationRefs.current).length,
            phaseType,
            isMobile,
            triggerMapping: {
                0: 'Logo (No Audio)',
                1: 'Von Uns Heißt Für Uns',
                2: 'Der Weg Ist Das Ziel',
                3: 'Die Community Heißt',
                4: isMobile ? 'AniTune (Mobile: No Audio)' : 'AniTune Theme',
                5: 'Carousel (No Audio)',
                6: 'Newsletter (No Audio)'
            }
        };
    }, [
        activeSnapPoint,
        currentAudioPhase,
        isAudioEnabled,
        isBackgroundMusicPlaying,
        phaseType,
        isMobile
    ]);

    // ===== RETURN API =====
    return {
        // Audio Controls
        triggerAudio,
        playCurrentPhaseAudio,
        stopAllAudio,
        toggleAudio,
        startBackgroundMusic,
        stopBackgroundMusic,

        // Animation Controls  
        triggerAnimation,

        // States
        isAudioEnabled,
        currentAudioPhase,
        isBackgroundMusicPlaying,

        // Utilities
        getDebugInfo,

        // Manual Controls
        playPhaseAudio,

        // Audio States for UI
        audioConfigs,
        hasLoadedAudio: Object.values(audioRefs.current).some(audio => audio?.readyState >= 2)
    };
};

export default useTriggerSystem;