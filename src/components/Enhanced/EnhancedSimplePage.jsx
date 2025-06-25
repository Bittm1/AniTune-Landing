// src/components/Enhanced/EnhancedSimplePage.jsx - COMPLETE MIT NEWSLETTER (SIMPLE INTEGRATION)

import React, { useState, useEffect, useRef, useCallback } from 'react';
// import ErrorBoundary from '../ErrorBoundary'; // Temporarily disabled
import EnhancedTitleLayer from './TitleLayer'; // ✅ STUFE 2: Titel System
import EnhancedAudioLayer from './AudioLayer'; // ✅ STUFE 3: Audio System
import BackgroundLayer from './layers/BackgroundLayer';
import LogoLayer from './layers/LogoLayer'; // ✅ Logo Layer
import Newsletter from '../Newsletter/Newsletter'; // ✅ DIREKTE NEWSLETTER INTEGRATION
import { LAYER_CONFIG } from './config/parallaxConfig'; // ✅ Konfiguration
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

    // ===== 📧 NEWSLETTER VISIBILITY CALCULATIONS =====
    // Simple & Robust - kann nie brechen
    const showNewsletterStart = scrollProgress <= 0.15; // Bei Snap 0 (mit Logo)
    const showNewsletterEnd = scrollProgress >= 0.85;   // ✅ FRÜHER: Ab 85% statt 95%

    // Newsletter Opacity Calculations
    const newsletterStartOpacity = showNewsletterStart
        ? (scrollProgress > 0.1 ? Math.max(0, 1 - (scrollProgress - 0.1) / 0.05) : 1)
        : 0;

    const newsletterEndOpacity = showNewsletterEnd
        ? Math.min(1, (scrollProgress - 0.85) / 0.10)  // ✅ LÄNGERER FADE: 10% statt 5%
        : 0;

    return (
        <React.Fragment>
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
                {/* ===== 🌌 BACKGROUND LAYER ===== */}
                <BackgroundLayer
                    scrollProgress={scrollProgress}
                    position={{
                        scale: (() => {
                            const zoomEndProgress = 0.75; // Phase 4 (75%) - Zoom-Ende

                            if (scrollProgress <= zoomEndProgress) {
                                // Normal zoom: 0% → 75%  
                                return 4.0 - (scrollProgress / zoomEndProgress * 3.0);
                            } else {
                                // Anti-Ruckler: Konstant bei genau 1.0
                                return 1.0;
                            }
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

                {/* ===== 🏠 LOGO LAYER ===== */}
                <LogoLayer
                    scrollProgress={scrollProgress}
                    position={{
                        visible: scrollProgress <= 0.15 // Logo aktiv von 0% bis 15%
                    }}
                    config={LAYER_CONFIG.logo}
                    deviceConfig={{
                        multiplier: isMobile ? 0.7 : 1.0
                    }}
                />

                {/* ===== 📧 NEWSLETTER BEI SNAP 0 (mit Logo) ===== */}
                {showNewsletterStart && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: newsletterStartOpacity,
                            zIndex: 60, // Über Logo (50)
                            width: '80%',
                            maxWidth: '500px',
                            pointerEvents: newsletterStartOpacity > 0.1 ? 'all' : 'none',
                            transition: 'opacity 0.3s ease-out'
                        }}
                    >
                        <Newsletter />
                    </div>
                )}

                {/* ===== 📧 NEWSLETTER BEI SNAP 5 (Ende - "hoch in der Sonne") ===== */}
                {showNewsletterEnd && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '15%', // "Hoch in der Sonne" - wie Phase6
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: newsletterEndOpacity,
                            zIndex: 60,
                            width: '80%',
                            maxWidth: '500px',
                            pointerEvents: newsletterEndOpacity > 0.1 ? 'all' : 'none',
                            transition: 'opacity 0.3s ease-out'
                        }}
                    >
                        <Newsletter />
                    </div>
                )}

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
                            🎯 ENHANCED + NEWSLETTER (SIMPLE)
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
                            <strong>Logo Visible:</strong> {scrollProgress <= 0.15 ? '✅ Yes' : '❌ No'}
                        </div>

                        <div style={{
                            marginBottom: '10px',
                            color: showNewsletterStart ? '#00ff00' : '#999'
                        }}>
                            <strong>📧 Newsletter Start:</strong> {showNewsletterStart ? `✅ ${(newsletterStartOpacity * 100).toFixed(0)}%` : '❌ Hidden'}
                        </div>

                        <div style={{
                            marginBottom: '10px',
                            color: showNewsletterEnd ? '#8B5CF6' : '#999'
                        }}>
                            <strong>📧 Newsletter End:</strong> {showNewsletterEnd ? `✅ ${(newsletterEndOpacity * 100).toFixed(0)}%` : '❌ Hidden'} (ab 85%)
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Background Scale:</strong> {(() => {
                                const zoomEndProgress = 0.75;
                                if (scrollProgress <= zoomEndProgress) {
                                    const scale = 4.0 - (scrollProgress / zoomEndProgress * 3.0);
                                    return scale.toFixed(2) + ' (zooming)';
                                } else {
                                    return '1.00 (konstant)';
                                }
                            })()}
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
                            ✅ Newsletter: Simple Integration (kann nie brechen)
                            <br />📧 Snap 0 (mit Logo) + Snap 5 (Ende)
                            <br />🛡️ Robust: Keine Abhängigkeiten
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
                            const hasLogo = index === 0;
                            const hasTitle = index >= 1 && index <= 3;
                            const hasTitleAudio = index >= 1 && index <= 3;
                            const hasTheme = index === 4;
                            const hasNewsletterStart = index === 0; // Snap 0
                            const hasNewsletterEnd = index === 5;   // Snap 5 (Newsletter startet bei 85%)
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
                                            ? (hasNewsletterEnd ? '#8B5CF6' : hasNewsletterStart ? '#ff9500' : hasLogo ? '#ffaa00' : hasTheme ? '#ff6b6b' : hasTitleAudio ? '#4CAF50' : hasTitle ? '#4CAF50' : '#ffff00')
                                            : 'rgba(255,255,255,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: isActive ? '#000' : '#fff',
                                        border: `2px solid ${isActive
                                            ? (hasNewsletterEnd ? '#8B5CF6' : hasNewsletterStart ? '#ff9500' : hasLogo ? '#ffaa00' : hasTheme ? '#ff6b6b' : hasTitleAudio ? '#4CAF50' : hasTitle ? '#4CAF50' : '#ffff00')
                                            : (hasNewsletterEnd ? '#8B5CF6' : hasNewsletterStart ? '#ff9500' : hasLogo ? '#ffaa00' : hasTheme ? '#ff6b6b' : hasTitleAudio ? '#4CAF50' : hasTitle ? '#4CAF50' : 'transparent')
                                            }`,
                                        transition: 'all 0.3s ease',
                                        userSelect: 'none',
                                        position: 'relative'
                                    }}
                                    title={`${point.label}${hasNewsletterEnd ? ' (Newsletter ab 85%)' : ''}${hasNewsletterStart ? ' (Newsletter Start)' : ''}${hasLogo ? ' (mit Logo)' : ''}${hasTitle ? ' (mit Titel)' : ''}${hasTitleAudio ? ' (mit Audio+BG)' : ''}${hasTheme ? ' (mit Theme)' : ''}`}
                                >
                                    {index}
                                    {/* Newsletter Indicators */}
                                    {hasNewsletterStart && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            fontSize: '12px'
                                        }}>📧</div>
                                    )}
                                    {hasNewsletterEnd && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            fontSize: '12px'
                                        }}>📧</div>
                                    )}
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
                        AniTune Enhanced
                    </h1>

                    <h2 style={{
                        fontSize: isMobile ? '1.5rem' : '2rem',
                        marginBottom: '30px',
                        color: '#8B5CF6'
                    }}>
                        🏠📧 MIT SIMPLE NEWSLETTER
                    </h2>

                    <div style={{
                        fontSize: isMobile ? '1.2rem' : '1.5rem',
                        marginBottom: '30px'
                    }}>
                        📍 {currentSnapPoint.label}
                        {showNewsletterStart && (
                            <span style={{ color: '#ff9500', marginLeft: '10px' }}>
                                📧🏠
                            </span>
                        )}
                        {showNewsletterEnd && (
                            <span style={{ color: '#8B5CF6', marginLeft: '10px' }}>
                                📧☀️
                            </span>
                        )}
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
                        <div style={{ color: '#ffaa00', marginTop: '10px' }}>
                            🏠 <strong>Logo:</strong> {scrollProgress <= 0.15 ? 'Sichtbar (Snap 0)' : 'Ausgeblendet'}
                        </div>
                        <div style={{ color: '#ff9500', marginTop: '5px' }}>
                            📧 <strong>Newsletter Start:</strong> {showNewsletterStart ? `Sichtbar (${(newsletterStartOpacity * 100).toFixed(0)}%)` : 'Ausgeblendet'}
                        </div>
                        <div style={{ color: '#8B5CF6', marginTop: '5px' }}>
                            📧 <strong>Newsletter Ende:</strong> {showNewsletterEnd ? `Sichtbar (${(newsletterEndOpacity * 100).toFixed(0)}%) - ab 85%` : 'Ausgeblendet (ab 85%)'}
                        </div>
                        <div style={{ color: '#4CAF50', marginTop: '5px' }}>
                            ✅ <strong>Integration:</strong> Simple & Robust (kann nie brechen)
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
                        Enhanced Sektion {i + 2}
                        <span style={{
                            color: i === 3 ? '#8B5CF6' : '#ff9500', // Newsletter Ende bei ca. 85% (Section 5)
                            marginLeft: '15px',
                            fontSize: '2rem'
                        }}>
                            {i === 3 ? '📧☀️' : '🏠📧'}
                        </span>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};

export default EnhancedSimplePage;