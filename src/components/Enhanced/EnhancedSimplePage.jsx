// src/components/Enhanced/EnhancedSimplePage.jsx - CLEAN PERFORMANCE SOLUTION

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import EnhancedTitleLayer from './TitleLayer'; // ✅ STUFE 2: Titel System
import EnhancedAudioLayer from './AudioLayer'; // ✅ STUFE 3: Audio System
import BackgroundLayer from './layers/BackgroundLayer';
import {
    SNAP_POINTS,
    getSnapPointByIndex,
    getSnapPointByProgress,
    getNextSnapPoint,
    getPrevSnapPoint,
    getSnapPointDebugInfo
} from './utils/snapPoints';

const EnhancedSimplePage = () => {
    // ===== CORE STATES =====
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSnapPoint, setActiveSnapPoint] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // ===== PERFORMANCE MONITORING =====
    const [fps, setFps] = useState(60);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    // ===== REFS =====
    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    // ===== MOBILE DETECTION =====
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768 && 'ontouchstart' in window;
    });

    // ===== SCROLL PROGRESS BERECHNUNG =====
    const calculateScrollProgress = useCallback(() => {
        if (typeof window === 'undefined') return 0;

        let viewportHeight;
        if (isMobile) {
            viewportHeight = window.visualViewport?.height ||
                document.documentElement.clientHeight ||
                window.innerHeight;
        } else {
            viewportHeight = window.innerHeight;
        }

        const totalHeight = document.documentElement.scrollHeight - viewportHeight;
        const currentScroll = window.scrollY;
        return Math.max(0, Math.min(1, currentScroll / totalHeight));
    }, [isMobile]);

    // ===== AKTIVEN SNAP-PUNKT ERMITTELN =====
    const findActiveSnapPoint = useCallback((progress) => {
        const snapPoint = getSnapPointByProgress(progress);
        return snapPoint.index;
    }, []);

    // ===== 🎯 EINE SAUBERE ANIMATION-FUNKTION =====
    const animateToSnapPoint = useCallback((targetIndex) => {
        if (isAnimating || targetIndex < 0 || targetIndex >= SNAP_POINTS.length) return;
        if (targetIndex === activeSnapPoint) return;

        const snapPoint = getSnapPointByIndex(targetIndex);
        const startProgress = scrollProgress;
        const targetProgress = snapPoint.progress;

        const viewportHeight = isMobile ?
            (window.visualViewport?.height || window.innerHeight) :
            window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight - viewportHeight;
        const startScroll = window.scrollY;
        const targetScroll = targetProgress * totalHeight;

        // ✅ KRITISCH: Audio/Titel starten SOFORT
        setActiveSnapPoint(targetIndex);
        setIsAnimating(true);

        // ✅ EINE Animation für ALLES
        const startTime = performance.now();
        const duration = 800; // Kürzer für Performance

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Performance easing (einfacher)
            const eased = 1 - Math.pow(1 - progress, 2);

            // Beide Werte gleichzeitig animieren
            const currentProgress = startProgress + (targetProgress - startProgress) * eased;
            const currentScroll = startScroll + (targetScroll - startScroll) * eased;

            // State Update (für Background-Zoom)
            setScrollProgress(currentProgress);

            // Echte Scroll-Position (für andere Komponenten)
            window.scrollTo({
                top: currentScroll,
                behavior: 'auto'
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 CLEAN ANIMATION: ${activeSnapPoint} → ${targetIndex} ("${snapPoint.label}")`);
        }

        requestAnimationFrame(animate);
    }, [isAnimating, activeSnapPoint, scrollProgress, isMobile]);

    // ===== SCROLL UPDATE - NUR WENN NICHT ANIMIERT =====
    const updateScrollProgress = useCallback(() => {
        if (isAnimating) return; // Skip während Animation

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

            if (process.env.NODE_ENV === 'development') {
                const snapPoint = getSnapPointByIndex(newActivePoint);
                console.log(`🎯 SNAP-POINT WECHSEL: ${newActivePoint} → "${snapPoint.label}"`);
            }
        }
    }, [calculateScrollProgress, findActiveSnapPoint, activeSnapPoint, isAnimating]);

    // ===== NAVIGATION FUNKTIONEN =====
    const goNext = useCallback(() => {
        const nextPoint = getNextSnapPoint(activeSnapPoint);
        animateToSnapPoint(nextPoint.index);
    }, [activeSnapPoint, animateToSnapPoint]);

    const goPrev = useCallback(() => {
        const prevPoint = getPrevSnapPoint(activeSnapPoint);
        animateToSnapPoint(prevPoint.index);
    }, [activeSnapPoint, animateToSnapPoint]);

    const goToSnapPoint = useCallback((targetIndex) => {
        animateToSnapPoint(targetIndex);
    }, [animateToSnapPoint]);

    // ===== WHEEL NAVIGATION =====
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isAnimating) return;

            const delta = e.deltaY;

            if (delta > 0) {
                goNext();
            } else {
                goPrev();
            }
        };

        window.addEventListener('wheel', handleWheel, {
            passive: false,
            capture: true
        });

        return () => {
            window.removeEventListener('wheel', handleWheel, { capture: true });
        };
    }, [goNext, goPrev, isAnimating]);

    // ===== KEYBOARD NAVIGATION =====
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    goNext();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    goPrev();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSnapPoint(0);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSnapPoint(SNAP_POINTS.length - 1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goNext, goPrev, goToSnapPoint]);

    // ===== TOUCH NAVIGATION =====
    const touchStartRef = useRef({ y: 0, time: 0 });

    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            touchStartRef.current = {
                y: e.touches[0].clientY,
                time: Date.now()
            };
        }
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (isAnimating || e.changedTouches.length !== 1) return;

        const touch = e.changedTouches[0];
        const deltaY = touchStartRef.current.y - touch.clientY;
        const deltaTime = Date.now() - touchStartRef.current.time;

        if (Math.abs(deltaY) > 50 && deltaTime < 500) {
            e.preventDefault();

            if (deltaY > 0) {
                goNext();
            } else {
                goPrev();
            }
        }
    }, [isAnimating, goNext, goPrev]);

    useEffect(() => {
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchEnd]);

    // ===== SCROLL EVENT SETUP =====
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

    // ===== RESIZE HANDLER =====
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768 && 'ontouchstart' in window;
            if (mobile !== isMobile) {
                setIsMobile(mobile);
            }
            setTimeout(updateScrollProgress, 100);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile, updateScrollProgress]);

    // ===== CURRENT SNAP POINT DATA =====
    const currentSnapPoint = getSnapPointByIndex(activeSnapPoint);

    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                className="enhanced-simple-page"
                style={{
                    width: '100%',
                    minHeight: '500vh',
                    background: '#000',
                    color: 'white',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    position: 'relative'
                }}
            >
                {/* ===== 🌌 BACKGROUND LAYER - ZOOM STOPPT BEI PHASE 4 ===== */}
                <BackgroundLayer
                    scrollProgress={scrollProgress}
                    position={{
                        scale: (() => {
                            const zoomEndProgress = 0.75; // Phase 4 (75%) - Zoom abgeschlossen
                            const clampedProgress = Math.min(scrollProgress, zoomEndProgress);
                            return 4.0 - (clampedProgress / zoomEndProgress * 3.0);
                        })(),
                        opacity: 1.0
                    }}
                    config={{
                        zIndex: 1
                    }}
                    deviceConfig={{
                        multiplier: isMobile ? 0.7 : 1.0
                    }}
                />

                {/* ===== 🎭 TITEL LAYER (STUFE 2) ===== */}
                <EnhancedTitleLayer
                    activeSnapPoint={activeSnapPoint}
                    scrollProgress={scrollProgress}
                    isSnapping={isAnimating}
                />

                {/* ===== 🎵 AUDIO LAYER (STUFE 3) ===== */}
                <EnhancedAudioLayer
                    activeSnapPoint={activeSnapPoint}
                    scrollProgress={scrollProgress}
                    isSnapping={isAnimating}
                />

                {/* ===== DEBUG PANEL (NUR DEVELOPMENT) ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(0, 0, 0, 0.9)',
                            border: '2px solid #4CAF50',
                            borderRadius: '12px',
                            padding: '20px',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            zIndex: 1000,
                            minWidth: '300px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div style={{
                            fontWeight: 'bold',
                            marginBottom: '15px',
                            color: '#4CAF50',
                            fontSize: '16px'
                        }}>
                            🎯 CLEAN PERFORMANCE SOLUTION
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Active Snap-Point:</strong> {activeSnapPoint}/5
                        </div>

                        <div style={{ marginBottom: '10px', color: '#ffff00' }}>
                            <strong>"{currentSnapPoint.label}"</strong>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Scroll Progress:</strong> {(scrollProgress * 100).toFixed(1)}%
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Background Scale:</strong> {(() => {
                                const zoomEndProgress = 0.75;
                                const clampedProgress = Math.min(scrollProgress, zoomEndProgress);
                                const scale = 4.0 - (clampedProgress / zoomEndProgress * 3.0);
                                return scale.toFixed(2);
                            })()} {scrollProgress >= 0.75 ? '(konstant)' : '(zoomend)'}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Target Progress:</strong> {(currentSnapPoint.progress * 100).toFixed(0)}%
                        </div>

                        <div style={{
                            marginBottom: '10px',
                            color: isAnimating ? '#ff6b6b' : '#4CAF50'
                        }}>
                            <strong>Animation Status:</strong> {
                                isAnimating
                                    ? '🎬 Animating'
                                    : '✅ Ready'
                            }
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Performance:</strong> {fps} FPS
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Device:</strong> {isMobile ? '📱 Mobile' : '🖥️ Desktop'}
                        </div>

                        <div style={{
                            marginTop: '15px',
                            paddingTop: '15px',
                            borderTop: '1px solid #333',
                            fontSize: '12px',
                            color: '#aaa'
                        }}>
                            <div>📱 Navigation:</div>
                            <div>• 🖱️ Mouse Wheel → Snap</div>
                            <div>• ↑↓ Arrows / Page Up/Down</div>
                            <div>• 👆 Touch Swipe (Mobile)</div>
                            <div>• Home/End Keys</div>
                        </div>

                        <div style={{
                            marginTop: '10px',
                            fontSize: '10px',
                            color: '#4CAF50'
                        }}>
                            ✅ CLEAN: Eine Animation, kein Ruckeln, performant
                        </div>

                        <div style={{
                            marginTop: '8px',
                            fontSize: '9px',
                            color: '#ffff00'
                        }}>
                            🎭 Audio/Titel: SOFORT | 🌌 Zoom: 0→75% dann konstant
                        </div>
                    </div>
                )}

                {/* ===== SNAP-POINT INDICATORS ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'fixed',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            zIndex: 1000
                        }}
                    >
                        {SNAP_POINTS.map((point, index) => {
                            const hasTitle = index >= 1 && index <= 3;
                            const hasTitleAudio = index >= 1 && index <= 3;
                            const hasTheme = index >= 4 && index <= 5;
                            const isActive = activeSnapPoint === index;

                            return (
                                <div
                                    key={point.index}
                                    onClick={() => goToSnapPoint(point.index)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: isActive
                                            ? (hasTheme ? '#ffaa00' : hasTitleAudio ? '#ff6b6b' : hasTitle ? '#4CAF50' : '#ffff00')
                                            : 'rgba(255,255,255,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: isActive ? '#000' : '#fff',
                                        border: `2px solid ${isActive
                                            ? (hasTheme ? '#ffaa00' : hasTitleAudio ? '#ff6b6b' : hasTitle ? '#4CAF50' : '#ffff00')
                                            : (hasTheme ? '#ffaa00' : hasTitleAudio ? '#ff6b6b' : hasTitle ? '#4CAF50' : 'transparent')
                                            }`,
                                        transition: 'all 0.3s ease',
                                        userSelect: 'none',
                                        position: 'relative'
                                    }}
                                    title={`${point.label}${hasTitle ? ' (mit Titel)' : ''}${hasTitleAudio ? ' (mit Audio+BG)' : ''}${hasTheme ? ' (mit Theme)' : ''}`}
                                >
                                    {index}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ===== CONTENT AREA ===== */}
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                        padding: '20px'
                    }}
                >
                    <h1 style={{
                        fontSize: isMobile ? '3rem' : '4rem',
                        marginBottom: '20px',
                        color: '#4CAF50'
                    }}>
                        AniTune Clean
                    </h1>

                    <h2 style={{
                        fontSize: isMobile ? '1.5rem' : '2rem',
                        marginBottom: '30px',
                        color: '#ffff00'
                    }}>
                        🎯 EINE SAUBERE ANIMATION-LOGIK
                    </h2>

                    <div style={{
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        marginBottom: '30px'
                    }}>
                        📍 {currentSnapPoint.label}
                        {isAnimating && (
                            <span style={{ color: '#ff6b6b', marginLeft: '10px' }}>
                                🎬
                            </span>
                        )}
                    </div>

                    <div style={{
                        fontSize: '1rem',
                        maxWidth: '600px',
                        opacity: 0.8,
                        lineHeight: 1.6
                    }}>
                        {currentSnapPoint.description}
                    </div>

                    <div style={{
                        marginTop: '40px',
                        padding: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '0.9rem'
                    }}>
                        <div>🎯 <strong>Smooth Progress:</strong> {(scrollProgress * 100).toFixed(1)}%</div>
                        <div>🎪 <strong>Snap-Point:</strong> {activeSnapPoint}/5</div>
                        <div>⚡ <strong>Performance:</strong> {fps} FPS</div>
                        <div style={{ color: '#4CAF50', marginTop: '10px' }}>
                            ✅ <strong>CLEAN:</strong> Eine Animation, kein Ruckeln
                        </div>
                        <div style={{ color: '#ffff00', marginTop: '5px' }}>
                            🎭 <strong>Audio/Titel:</strong> Starten sofort beim Wheel-Event
                        </div>
                        <div style={{ color: '#87CEEB', marginTop: '5px' }}>
                            🌌 <strong>Background:</strong> Zoom bis Phase 4 (75%), dann konstant
                        </div>
                    </div>
                </div>

                {/* ===== SPACER SECTIONS (für Scroll-Verhalten) ===== */}
                {Array.from({ length: 5 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.5,
                            fontSize: '1.2rem'
                        }}
                    >
                        Clean Sektion {i + 2}
                        <span style={{
                            color: '#4CAF50',
                            marginLeft: '15px',
                            fontSize: '2rem'
                        }}>
                            ⚡
                        </span>
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    );
};

export default EnhancedSimplePage;