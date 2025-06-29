// src/components/Enhanced/EnhancedSimplePage.jsx - 7 SNAP-POINTS AUF BASIS FUNKTIONIERENDEM CODE

import React, { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedTitleLayer from './TitleLayer';
import EnhancedAudioLayer from './AudioLayer';
import BackgroundLayer from './layers/BackgroundLayer';
import RoadLayer from './layers/RoadLayer';
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
    // ===== STATES =====
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSnapPoint, setActiveSnapPoint] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [fps, setFps] = useState(60);

    // ===== REFS =====
    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    // ===== MOBILE DETECTION =====
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768 && 'ontouchstart' in window;
    });

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
        // ✅ ERWEITERT: 0-6 statt 0-5
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
        const nextPoint = getNextSnapPoint(activeSnapPoint);
        animateToSnapPoint(nextPoint.index);
    }, [activeSnapPoint, animateToSnapPoint]);

    const goPrev = useCallback(() => {
        const prevPoint = getPrevSnapPoint(activeSnapPoint);
        animateToSnapPoint(prevPoint.index);
    }, [activeSnapPoint, animateToSnapPoint]);

    // ===== EVENT LISTENERS =====
    useEffect(() => {
        const handleWheel = (e) => {
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
        return () => window.removeEventListener('wheel', handleWheel, { capture: true });
    }, [goNext, goPrev, isAnimating]);

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

    // ===== NEWSLETTER VISIBILITY (ANGEPASST FÜR 7 SNAP-POINTS) =====
    const showNewsletterStart = scrollProgress <= 0.15; // Bleibt gleich
    const showNewsletterEnd = scrollProgress >= 0.90; // ✅ ANGEPASST: 0.85 → 0.90 (für Snap 6 bei 95%)

    const newsletterStartOpacity = showNewsletterStart
        ? (scrollProgress > 0.1 ? Math.max(0, 1 - (scrollProgress - 0.1) / 0.05) : 1)
        : 0;

    const newsletterEndOpacity = showNewsletterEnd
        ? Math.min(1, (scrollProgress - 0.90) / 0.05) // ✅ ANGEPASST: schnellere Einblendung ab 90%
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
            {/* ===== BACKGROUND (ORIGINAL LOGIK BEIBEHALTEN) ===== */}
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
            {scrollProgress >= 0.30 && ( // ✅ ANGEPASST: 0.30 statt 0.30 (war 0.35, jetzt bei Snap 2)
                <RoadLayer
                    scrollProgress={scrollProgress}
                    config={LAYER_CONFIG.road}
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

            {/* ===== NEWSLETTER END (ANGEPASST FÜR SNAP 6) ===== */}
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

            {/* ===== TITLES ===== */}
            <EnhancedTitleLayer
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isSnapping={isAnimating}
            />

            {/* ===== AUDIO ===== */}
            <EnhancedAudioLayer
                activeSnapPoint={activeSnapPoint}
                scrollProgress={scrollProgress}
                isSnapping={isAnimating}
            />

            {/* ===== SCROLL SPACER ===== */}
            <div style={{ height: '500vh', opacity: 0, pointerEvents: 'none' }} />

            {/* ===== DEBUG (ERWEITERT FÜR 7 SNAP-POINTS) ===== */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: 'white',
                    zIndex: 1000
                }}>
                    <div>Snap: {activeSnapPoint}/6</div> {/* ✅ ANGEPASST: /6 statt /5 */}
                    <div>Progress: {(scrollProgress * 100).toFixed(0)}%</div>
                    <div>FPS: {fps}</div>
                    <div>🛣️ Road: {scrollProgress >= 0.30 ? 'ON' : 'OFF'}</div>
                    <div>📧 Newsletter Start: {showNewsletterStart ? 'ON' : 'OFF'}</div>
                    <div>📧 Newsletter End: {showNewsletterEnd ? 'ON' : 'OFF'}</div>
                    {/* ✅ NEU: Snap-Point Info */}
                    <div style={{ marginTop: '5px', fontSize: '9px', color: '#ffff00' }}>
                        {getSnapPointByIndex(activeSnapPoint).label}
                    </div>
                    {activeSnapPoint === 5 && (
                        <div style={{ fontSize: '8px', color: '#ff6b6b' }}>
                            🎠 Carousel Ready
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedSimplePage;