// src/components/Enhanced/EnhancedSimplePage.jsx - MIT ERWEITERTEN LOCK-SCROLL PROPS
// ✅ 7 SNAP-POINTS + LOCK-SCROLL SYSTEM + Aufgeräumtes Debug

// ÄNDERUNG: LockScrollLayer bekommt jetzt auch isTitleAnimating + titleAnimatingSnapPoint Props

import React, { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedTitleLayer from './TitleLayer';
import EnhancedAudioLayer from './AudioLayer';
import LockScrollLayer from './LockScrollLayer';
import CentralDebugPanel from './CentralDebugPanel';
import BackgroundLayer from './layers/BackgroundLayer';
import RoadLayer from './layers/RoadLayer';
import DogLayer from './layers/DogLayer';
import ForestLayer from './layers/ForestLayer';
import LogoLayer from './layers/LogoLayer';
import Newsletter from '../Newsletter/Newsletter';
import { LAYER_CONFIG } from './config/parallaxConfig';
import {
    SNAP_POINTS,
    getSnapPointByIndex,
    getSnapPointByProgress,
    getNextSnapPoint,
    getPrevSnapPoint
} from './utils/snapPoints';

const EnhancedSimplePage = () => {
    // ===== EXISTING STATES =====
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSnapPoint, setActiveSnapPoint] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [fps, setFps] = useState(60);

    // ===== NEW STATES FÜR ERWEITERTE LOCK-LOGIK =====
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [audioPlayingSnapPoint, setAudioPlayingSnapPoint] = useState(null);
    const [isTitleAnimating, setIsTitleAnimating] = useState(false);
    const [titleAnimatingSnapPoint, setTitleAnimatingSnapPoint] = useState(null);

    // ===== ADDITIONAL STATES FÜR DEBUG =====
    const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
    const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0);
    const [themeMusicPlaying, setThemeMusicPlaying] = useState(false);
    const [themeMusicVolume, setThemeMusicVolume] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [shouldShowScrollIndicator, setShouldShowScrollIndicator] = useState(false);
    const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState(null);

    // ===== DEBUG PORTAL =====
    const [debugPortal, setDebugPortal] = useState(null);

    // ===== EXISTING REFS =====
    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    // ===== MOBILE DETECTION =====
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768 && 'ontouchstart' in window;
    });

    // ===== DEBUG PORTAL SETUP =====
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const container = document.createElement('div');
            container.id = 'central-debug-portal';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999999;
            `;
            document.body.appendChild(container);
            setDebugPortal(container);

            return () => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            };
        }
    }, []);

    // ===== SCROLL CALCULATIONS (UNVERÄNDERT) =====
    const calculateScrollProgress = useCallback(() => {
        if (typeof window === 'undefined') return 0;

        const viewportHeight = isMobile
            ? (window.visualViewport?.height || window.innerHeight)
            : window.innerHeight;

        const totalHeight = document.documentElement.scrollHeight - viewportHeight;
        const currentScroll = window.scrollY;
        return Math.max(0, Math.min(1, currentScroll / totalHeight));
    }, [isMobile]);

    const findActiveSnapPoint = useCallback((progress) => {
        const snapPoint = getSnapPointByProgress(progress);
        return snapPoint.index;
    }, []);

    // ===== ANIMATION (UNVERÄNDERT) =====
    const animateToSnapPoint = useCallback((targetIndex) => {
        if (isAnimating || targetIndex < 0 || targetIndex >= SNAP_POINTS.length) return;
        if (targetIndex === activeSnapPoint) return;

        const snapPoint = getSnapPointByIndex(targetIndex);
        const startProgress = scrollProgress;
        const targetProgress = snapPoint.progress;

        const viewportHeight = isMobile
            ? (window.visualViewport?.height || window.innerHeight)
            : window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight - viewportHeight;
        const startScroll = window.scrollY;
        const targetScroll = targetProgress * totalHeight;

        setActiveSnapPoint(targetIndex);
        setIsAnimating(true);

        const startTime = performance.now();
        const duration = 800;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);

            const currentProgress = startProgress + (targetProgress - startProgress) * eased;
            const currentScroll = startScroll + (targetScroll - startScroll) * eased;

            setScrollProgress(currentProgress);
            window.scrollTo({ top: currentScroll, behavior: 'auto' });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [isAnimating, activeSnapPoint, scrollProgress, isMobile]);

    // ===== NEW FUNCTIONS FÜR ERWEITERTE LOCK-SCROLL SYSTEM =====
    const audioLayerRef = useRef(null);
    const titleLayerRef = useRef(null);

    const skipAudio = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`⏭️ SKIP AUDIO + TITEL: User überspringt bei Snap ${activeSnapPoint}`);
        }

        // ✅ Audio stoppen
        if (audioLayerRef.current && audioLayerRef.current.handleSkipAudio) {
            audioLayerRef.current.handleSkipAudio();
        }

        // ✅ Titel-Animation sofort beenden (falls möglich)
        if (titleLayerRef.current && titleLayerRef.current.handleSkipAnimation) {
            titleLayerRef.current.handleSkipAnimation();
        }

        // Optional: Zum nächsten Snap-Point springen
        if (activeSnapPoint >= 1 && activeSnapPoint < 3) {
            const nextPoint = getNextSnapPoint(activeSnapPoint);
            setTimeout(() => {
                animateToSnapPoint(nextPoint.index);
            }, 200);
        }
    }, [activeSnapPoint, animateToSnapPoint]);

    const goToTop = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`⬆️ GO TO TOP: User springt zurück zum Start`);
        }
        animateToSnapPoint(0);
    }, [animateToSnapPoint]);

    // ===== TITLE ANIMATION STATUS HANDLER =====
    const handleTitleAnimationChange = useCallback((animating, snapPoint = null) => {
        setIsTitleAnimating(animating);
        setTitleAnimatingSnapPoint(animating ? snapPoint : null);

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 TITLE ANIMATION STATUS: ${animating ? 'Playing' : 'Finished'} - Snap ${snapPoint || 'N/A'}`);
        }
    }, []);

    // ===== AUDIO STATUS HANDLER =====
    const handleAudioPlayingChange = useCallback((playing, snapPoint = null) => {
        setIsAudioPlaying(playing);
        setAudioPlayingSnapPoint(playing ? snapPoint : null);

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎵 AUDIO STATUS CHANGE: ${playing ? 'Playing' : 'Stopped'} - Snap ${snapPoint || 'N/A'}`);
        }
    }, []);

    // ===== CURRENT AUDIO HANDLER =====
    const handleCurrentAudioChange = useCallback((audioTitle) => {
        setCurrentlyPlayingAudio(audioTitle);
    }, []);

    // ===== BACKGROUND MUSIC STATUS HANDLER =====
    const handleBackgroundMusicChange = useCallback((playing, volume = 0) => {
        setBackgroundMusicPlaying(playing);
        setBackgroundMusicVolume(volume);
    }, []);

    // ===== THEME MUSIC STATUS HANDLER =====
    const handleThemeMusicChange = useCallback((playing, volume = 0) => {
        setThemeMusicPlaying(playing);
        setThemeMusicVolume(volume);
    }, []);

    // ===== LOCK STATUS HANDLER =====
    const handleLockStatusChange = useCallback((locked, showIndicator = false) => {
        setIsLocked(locked);
        setShouldShowScrollIndicator(showIndicator);
    }, []);

    // ===== SCROLL UPDATE (UNVERÄNDERT) =====
    const updateScrollProgress = useCallback(() => {
        if (isAnimating) return;

        frameCountRef.current++;
        const now = performance.now();
        if (now - lastTimeRef.current >= 1000) {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
            lastTimeRef.current = now;
        }

        const newProgress = calculateScrollProgress();
        const newActivePoint = findActiveSnapPoint(newProgress);

        setScrollProgress(newProgress);

        if (newActivePoint !== activeSnapPoint) {
            setActiveSnapPoint(newActivePoint);
        }
    }, [calculateScrollProgress, findActiveSnapPoint, activeSnapPoint, isAnimating]);

    // ===== NAVIGATION (UNVERÄNDERT) =====
    const goNext = useCallback(() => {
        const nextPoint = getNextSnapPoint(activeSnapPoint);
        animateToSnapPoint(nextPoint.index);
    }, [activeSnapPoint, animateToSnapPoint]);

    const goPrev = useCallback(() => {
        const prevPoint = getPrevSnapPoint(activeSnapPoint);
        animateToSnapPoint(prevPoint.index);
    }, [activeSnapPoint, animateToSnapPoint]);

    // ===== EVENT LISTENERS (FIX: Nur wenn NICHT gelocked) =====
    useEffect(() => {
        const handleWheel = (e) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎡 NAVIGATION WHEEL EVENT: isLocked=${isLocked}, isAnimating=${isAnimating}`);
            }

            // ✅ FIX: Wenn gelocked, komplett ignorieren - KEIN preventDefault!
            if (isLocked) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🚫 NAVIGATION BLOCKIERT: System ist gelocked`);
                }
                return; // Lässt Lock-System das Event handhaben
            }

            e.preventDefault();
            e.stopPropagation();
            if (isAnimating) return;

            if (process.env.NODE_ENV === 'development') {
                console.log(`🎡 NAVIGATION AUSFÜHREN: ${e.deltaY > 0 ? 'goNext()' : 'goPrev()'}`);
            }

            if (e.deltaY > 0) {
                goNext();
            } else {
                goPrev();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎡 NAVIGATION EVENT-LISTENER REGISTRIERT: isLocked=${isLocked}`);
        }

        return () => {
            window.removeEventListener('wheel', handleWheel, { capture: true });
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎡 NAVIGATION EVENT-LISTENER ENTFERNT`);
            }
        };
    }, [goNext, goPrev, isAnimating, isLocked]);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(updateScrollProgress, 16);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateScrollProgress();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [updateScrollProgress]);

    // ===== NEWSLETTER VISIBILITY (UNVERÄNDERT) =====
    const showNewsletterStart = scrollProgress <= 0.15;
    const showNewsletterEnd = scrollProgress >= 0.90;

    const newsletterStartOpacity = showNewsletterStart
        ? (scrollProgress > 0.1 ? Math.max(0, 1 - (scrollProgress - 0.1) / 0.05) : 1)
        : 0;

    const newsletterEndOpacity = showNewsletterEnd
        ? Math.min(1, (scrollProgress - 0.90) / 0.05)
        : 0;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                minHeight: '500vh',
                background: '#000',
                position: 'relative'
            }}
        >
            {/* ===== BACKGROUND ===== */}
            <BackgroundLayer
                scrollProgress={scrollProgress}
                position={{
                    scale: scrollProgress <= 0.75
                        ? 4.0 - (scrollProgress / 0.75 * 3.0)
                        : 1.0,
                    opacity: 1.0
                }}
                config={{ zIndex: 1 }}
                deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
            />

            {/* ===== ROAD LAYER ===== */}
            {scrollProgress >= 0.30 && (
                <RoadLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.road}
                />
            )}

            {/* ===== 🐕 DOG LAYER (NEU HINZUFÜGEN) ===== */}
            {scrollProgress >= 0.15 && (
                <DogLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.dog}
                />
            )}

            {/* ===== 🌲 FOREST LAYER (NEU) ===== */}
            {scrollProgress >= 0.30 && (
                <ForestLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.forest}
                />
            )}

            {/* ===== LOGO ===== */}
            <LogoLayer
                scrollProgress={scrollProgress}
                position={{ visible: scrollProgress <= 0.15 }}
                config={LAYER_CONFIG.logo}
                deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
            />

            {/* ===== NEWSLETTER START ===== */}
            {showNewsletterStart && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: newsletterStartOpacity,
                    zIndex: 60,
                    width: '80%',
                    maxWidth: '500px',
                    pointerEvents: newsletterStartOpacity > 0.1 ? 'all' : 'none'
                }}>
                    <Newsletter />
                </div>
            )}

            {/* ===== NEWSLETTER END ===== */}
            {showNewsletterEnd && (
                <div style={{
                    position: 'fixed',
                    top: '15%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: newsletterEndOpacity,
                    zIndex: 60,
                    width: '80%',
                    maxWidth: '500px',
                    pointerEvents: newsletterEndOpacity > 0.1 ? 'all' : 'none'
                }}>
                    <Newsletter />
                </div>
            )}

            {/* ===== TITLES (ERWEITERT MIT CALLBACK + REF) ===== */}
            <EnhancedTitleLayer
                ref={titleLayerRef}
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isSnapping={isAnimating}
                onTitleAnimationChange={handleTitleAnimationChange}
            />

            {/* ===== AUDIO (ERWEITERT MIT CALLBACKS) ===== */}
            <EnhancedAudioLayer
                ref={audioLayerRef}
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isSnapping={isAnimating}
                onAudioPlayingChange={handleAudioPlayingChange}
                onCurrentAudioChange={handleCurrentAudioChange}
                onBackgroundMusicChange={handleBackgroundMusicChange}
                onThemeMusicChange={handleThemeMusicChange}
            />

            {/* ===== 🔒 LOCK-SCROLL LAYER (ERWEITERTE PROPS) ===== */}
            <LockScrollLayer
                activeSnapPoint={activeSnapPoint}
                isAudioPlaying={isAudioPlaying}
                audioPlayingSnapPoint={audioPlayingSnapPoint}
                isTitleAnimating={isTitleAnimating}
                titleAnimatingSnapPoint={titleAnimatingSnapPoint}
                onSkip={skipAudio}
                onGoToTop={goToTop}
                onLockStatusChange={handleLockStatusChange}
            />

            {/* ===== 🔍 ZENTRALES DEBUG-PANEL (ERSETZT ALLE ANDEREN) ===== */}
            <CentralDebugPanel
                // Navigation & Scroll
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isAnimating={isAnimating}
                fps={fps}

                // Audio System
                isAudioPlaying={isAudioPlaying}
                audioPlayingSnapPoint={audioPlayingSnapPoint}
                currentlyPlayingAudio={currentlyPlayingAudio}
                isTitleAnimating={isTitleAnimating}
                titleAnimatingSnapPoint={titleAnimatingSnapPoint}
                backgroundMusicPlaying={backgroundMusicPlaying}
                backgroundMusicVolume={backgroundMusicVolume}
                themeMusicPlaying={themeMusicPlaying}
                themeMusicVolume={themeMusicVolume}

                // Lock-Scroll System
                isLocked={isLocked}
                showScrollIndicator={shouldShowScrollIndicator}

                // Portal Container
                portalContainer={debugPortal}
            />

            {/* ===== SCROLL SPACER ===== */}
            <div style={{ height: '500vh', opacity: 0, pointerEvents: 'none' }} />
        </div>
    );
};

export default EnhancedSimplePage;