// src/components/Enhanced/EnhancedSimplePage.jsx - FIXED LAYER SYSTEM + CAROUSEL 3-SEGMENT
// ✅ 7 SNAP-POINTS + LAYER BLEIBEN SICHTBAR + LOCK-SCROLL SYSTEM + CAROUSEL EIN/AUS ANIMATION
// 🔧 Development Mode + Snap-Point basierte Layer-Logik + Layer Debug Panels Toggle

import React, { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedTitleLayer from './TitleLayer';
import EnhancedAudioLayer from './AudioLayer';
import LockScrollLayer from './LockScrollLayer';
import CentralDebugPanel from './CentralDebugPanel';
import EnhancedAniTuneCarousel from './layers/AniTuneCarousel';
import BackgroundLayer from './layers/BackgroundLayer';
import RoadLayer from './layers/RoadLayer';
import DogLayer from './layers/DogLayer';
import ForestLayer from './layers/ForestLayer';
import TalLayer from './layers/TalLayer';
import BergeLayer from './layers/BergeLayer';
import LogoLayer from './layers/LogoLayer';
import StarfieldLayer from './layers/StarfieldLayer';
import WaldHintenLayer from './layers/WaldHintenLayer';
import CloudLayer from './layers/CloudLayer';
import WolkenHintenLayer from './layers/WolkenHintenLayer';
import MengeLayer from './layers/MengeLayer';
import Newsletter from '../Newsletter/Newsletter';
import { LAYER_CONFIG, isLayerActiveAtSnapPoint } from './config/parallaxConfig';
import {
    SNAP_POINTS,
    getSnapPointByIndex,
    getSnapPointByProgress,
    getNextSnapPoint,
    getPrevSnapPoint
} from './utils/snapPoints';

const EnhancedSimplePage = () => {
    // ===== 🔧 DEVELOPMENT MODE CONTROL =====
    const [developmentMode, setDevelopmentMode] = useState(false);
    const [showLayerDebugPanels, setShowLayerDebugPanels] = useState(false);

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

    // ===== 🔧 DEVELOPMENT MODE TOGGLE =====
    const toggleDevelopmentMode = useCallback(() => {
        setDevelopmentMode(prev => {
            const newMode = !prev;
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 DEVELOPMENT MODE: ${newMode ? 'ON (Freies Scrollen)' : 'OFF (Snap & Lock aktiv)'}`);
            }
            return newMode;
        });
    }, []);

    // ===== LAYER DEBUG PANELS TOGGLE =====
    const toggleLayerDebugPanels = useCallback(() => {
        setShowLayerDebugPanels(prev => {
            const newState = !prev;
            window.__SHOW_LAYER_DEBUG_PANELS = newState;

            if (process.env.NODE_ENV === 'development') {
                console.log(`🔍 LAYER DEBUG PANELS: ${newState ? 'ON' : 'OFF'}`);
            }

            return newState;
        });
    }, []);

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

            // Setze initial die globale Variable
            window.__SHOW_LAYER_DEBUG_PANELS = false;

            return () => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            };
        }
    }, []);

    // ===== SCROLL CALCULATIONS =====
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

    // ===== ANIMATION =====
    const animateToSnapPoint = useCallback((targetIndex) => {
        if (developmentMode) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 DEV MODE: Snap-Animation zu Index ${targetIndex} ignoriert`);
            }
            return;
        }

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
        const targetSnap = getSnapPointByIndex(targetIndex);
        const duration = ((targetSnap?.snapDuration ?? 1.0) * 1000);

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
    }, [isAnimating, activeSnapPoint, scrollProgress, isMobile, developmentMode]);

    // ===== LOCK-SCROLL SYSTEM FUNCTIONS =====
    const audioLayerRef = useRef(null);
    const titleLayerRef = useRef(null);

    const skipAudio = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`⏭️ SKIP AUDIO + TITEL: User überspringt bei Snap ${activeSnapPoint}`);
        }

        if (audioLayerRef.current && audioLayerRef.current.handleSkipAudio) {
            audioLayerRef.current.handleSkipAudio();
        }

        if (titleLayerRef.current && titleLayerRef.current.handleSkipAnimation) {
            titleLayerRef.current.handleSkipAnimation();
        }

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

    // ===== STATUS HANDLERS =====
    const handleTitleAnimationChange = useCallback((animating, snapPoint = null) => {
        setIsTitleAnimating(animating);
        setTitleAnimatingSnapPoint(animating ? snapPoint : null);
    }, []);

    const handleAudioPlayingChange = useCallback((playing, snapPoint = null) => {
        setIsAudioPlaying(playing);
        setAudioPlayingSnapPoint(playing ? snapPoint : null);
    }, []);

    const handleCurrentAudioChange = useCallback((audioTitle) => {
        setCurrentlyPlayingAudio(audioTitle);
    }, []);

    const handleBackgroundMusicChange = useCallback((playing, volume = 0) => {
        setBackgroundMusicPlaying(playing);
        setBackgroundMusicVolume(volume);
    }, []);

    const handleThemeMusicChange = useCallback((playing, volume = 0) => {
        setThemeMusicPlaying(playing);
        setThemeMusicVolume(volume);
    }, []);

    const handleLockStatusChange = useCallback((locked, showIndicator = false) => {
        setIsLocked(locked);
        setShouldShowScrollIndicator(showIndicator);
    }, []);

    // ===== SCROLL UPDATE =====
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

    // ===== NAVIGATION =====
    const goNext = useCallback(() => {
        if (developmentMode) return;
        const nextPoint = getNextSnapPoint(activeSnapPoint);
        animateToSnapPoint(nextPoint.index);
    }, [activeSnapPoint, animateToSnapPoint, developmentMode]);

    const goPrev = useCallback(() => {
        if (developmentMode) return;
        const prevPoint = getPrevSnapPoint(activeSnapPoint);
        animateToSnapPoint(prevPoint.index);
    }, [activeSnapPoint, animateToSnapPoint, developmentMode]);

    // ===== EVENT LISTENERS =====
    useEffect(() => {
        if (developmentMode) return;

        const handleWheel = (e) => {
            if (isLocked) return;
            e.preventDefault();
            e.stopPropagation();
            if (isAnimating) return;

            if (e.deltaY > 0) {
                goNext();
            } else {
                goPrev();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

        return () => {
            window.removeEventListener('wheel', handleWheel, { capture: true });
        };
    }, [goNext, goPrev, isAnimating, isLocked, developmentMode]);

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

    // ===== NEWSLETTER VISIBILITY =====
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
                    scale: scrollProgress <= 0.60
                        ? 4.0 - (scrollProgress / 0.60 * 3.0)
                        : 1.0,
                    opacity: 1.0
                }}
                config={{ zIndex: 1 }}
                deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
            />

            {/* ===== STARFIELD LAYER ===== */}
            {isLayerActiveAtSnapPoint('starfield', activeSnapPoint) && (
                <StarfieldLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.starfield}
                    deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
                />
            )}

            {/* ===== ROAD LAYER ===== */}
            {isLayerActiveAtSnapPoint('road', activeSnapPoint) && (
                <RoadLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.road}
                />
            )}

            {/* ===== DOG LAYER ===== */}
            {isLayerActiveAtSnapPoint('dog', activeSnapPoint) && (
                <DogLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.dog}
                />
            )}

            {/* ===== FOREST LAYER ===== */}
            {isLayerActiveAtSnapPoint('forest', activeSnapPoint) && (
                <ForestLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.forest}
                />
            )}

            {/* ===== WALD HINTEN LAYER ===== */}
            {isLayerActiveAtSnapPoint('waldHinten', activeSnapPoint) && (
                <WaldHintenLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.waldHinten}
                    deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
                />
            )}

            {/* ===== TAL LAYER ===== */}
            {isLayerActiveAtSnapPoint('tal', activeSnapPoint) && (
                <TalLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.tal}
                />
            )}

            {/* ===== BERGE LAYER ===== */}
            {isLayerActiveAtSnapPoint('berge', activeSnapPoint) && (
                <BergeLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.berge}
                />
            )}

            {/* ===== WOLKEN HINTEN LAYER ===== */}
            {(isLayerActiveAtSnapPoint('leftCloudHinten', activeSnapPoint) || isLayerActiveAtSnapPoint('rightCloudHinten', activeSnapPoint)) && (
                <WolkenHintenLayer
                    scrollProgress={scrollProgress}
                    leftConfig={LAYER_CONFIG.leftCloudHinten}
                    rightConfig={LAYER_CONFIG.rightCloudHinten}
                    deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
                />
            )}

            {/* ===== CLOUD LAYER ===== */}
            {(isLayerActiveAtSnapPoint('leftCloud', activeSnapPoint) || isLayerActiveAtSnapPoint('rightCloud', activeSnapPoint)) && (
                <CloudLayer
                    scrollProgress={scrollProgress}
                    leftConfig={LAYER_CONFIG.leftCloud}
                    rightConfig={LAYER_CONFIG.rightCloud}
                    deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
                />
            )}

            {/* ===== MENGE LAYER ===== */}
            {isLayerActiveAtSnapPoint('menge', activeSnapPoint) && (
                <MengeLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.menge}
                    deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
                />
            )}

            {/* ===== LOGO ===== */}
            {isLayerActiveAtSnapPoint('logo', activeSnapPoint) && (
                <LogoLayer
                    scrollProgress={scrollProgress}
                    position={{ visible: scrollProgress <= 0.15 }}
                    config={LAYER_CONFIG.logo}
                    deviceConfig={{ multiplier: isMobile ? 0.7 : 1.0 }}
                />
            )}

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
                    top: '45%',
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

            {/* ===== ANITUNE CAROUSEL ===== */}
            {(activeSnapPoint === 5 || (scrollProgress >= 0.78 && scrollProgress <= 0.92)) && (
                <EnhancedAniTuneCarousel
                    scrollProgress={scrollProgress}
                    activeSnapPoint={activeSnapPoint}
                    isSnapping={isAnimating}
                />
            )}

            {/* ===== TITLES ===== */}
            <EnhancedTitleLayer
                ref={titleLayerRef}
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isSnapping={isAnimating}
                onTitleAnimationChange={handleTitleAnimationChange}
            />

            {/* ===== AUDIO ===== */}
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

            {/* ===== LOCK-SCROLL LAYER ===== */}
            {!developmentMode && (
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
            )}

            {/* ===== ZENTRALES DEBUG-PANEL ===== */}
            <CentralDebugPanel
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isAnimating={isAnimating}
                fps={fps}
                isAudioPlaying={isAudioPlaying}
                audioPlayingSnapPoint={audioPlayingSnapPoint}
                currentlyPlayingAudio={currentlyPlayingAudio}
                isTitleAnimating={isTitleAnimating}
                titleAnimatingSnapPoint={titleAnimatingSnapPoint}
                backgroundMusicPlaying={backgroundMusicPlaying}
                backgroundMusicVolume={backgroundMusicVolume}
                themeMusicPlaying={themeMusicPlaying}
                themeMusicVolume={themeMusicVolume}
                isLocked={isLocked}
                showScrollIndicator={shouldShowScrollIndicator}
                developmentMode={developmentMode}
                onToggleDevelopmentMode={toggleDevelopmentMode}
                showLayerDebugPanels={showLayerDebugPanels}
                onToggleLayerDebugPanels={toggleLayerDebugPanels}
                portalContainer={debugPortal}
            />

            {/* ===== SCROLL SPACER ===== */}
            <div style={{ height: '500vh', opacity: 0, pointerEvents: 'none' }} />
        </div>
    );
};

export default EnhancedSimplePage;