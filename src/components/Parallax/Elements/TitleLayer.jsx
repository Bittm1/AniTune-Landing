// src/components/Parallax/Elements/TitleLayer.jsx - MOBILE PHASE 4 + DEBUG CLEANUP

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
import { getDeviceOptimizedTiming } from '../config/timingConfig';

import {
    getActivePhaseFromScroll,
    getTitleTextForPhase,
    getPhaseDebugInfo
} from '../utils/phaseUtils';

import './TitleLayer.css';

const TitleLayer = React.memo(({
    scrollProgress,
    titles = [],
    currentTitleIndex = 0,
    isScrollLocked = false
}) => {
    if (!titles || titles.length === 0) return null;

    // ✅ MOBILE DETECTION
    const isMobile = window.innerWidth < 768;
    const activePhase = getActivePhaseFromScroll(scrollProgress);

    // Phase 0 = Logo/Newsletter - zeige keine Titel
    if (activePhase === 0) {
        return (
            <ErrorBoundary>
                <div
                    className="title-layer-container logo-phase"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        pointerEvents: 'none'
                    }}
                >
                    {/* ✅ DEBUG CLEANUP: Nur Desktop */}
                    {process.env.NODE_ENV === 'development' && !isMobile && (
                        <LogoPhaseDebugPanel
                            scrollProgress={scrollProgress}
                            activePhase={activePhase}
                            isScrollLocked={isScrollLocked}
                        />
                    )}
                </div>
            </ErrorBoundary>
        );
    }

    // ✅ FIX: Phase 5 & 6 haben keine Titel - früh beenden
    if (activePhase >= 5) {
        return (
            <ErrorBoundary>
                <div
                    className="title-layer-container no-title-phase"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        pointerEvents: 'none'
                    }}
                >
                    {/* ✅ DEBUG CLEANUP: Nur Desktop */}
                    {process.env.NODE_ENV === 'development' && !isMobile && (
                        <NoTitlePhaseDebugPanel
                            scrollProgress={scrollProgress}
                            activePhase={activePhase}
                            isScrollLocked={isScrollLocked}
                        />
                    )}
                </div>
            </ErrorBoundary>
        );
    }

    // ✅ PHASE 4 MOBILE SPEZIALBEHANDLUNG
    if (activePhase === 4 && isMobile) {
        // Hardcoded "AniTune" Titel für Mobile Phase 4
        const mobilePhase4Title = {
            id: 'mobile-phase4-title',
            text: 'AniTune',
            index: 3,
            position: { top: '50%', left: '50%' },
            style: {
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 0 15px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6)',
                fontFamily: 'Lobster, cursive, sans-serif',
                letterSpacing: '0.5px',
                textAlign: 'center',
                transform: 'translateX(-50%)',
                opacity: 0.95
            }
        };

        return (
            <ErrorBoundary>
                <div
                    className="title-layer-container mobile-phase4"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        pointerEvents: 'none'
                    }}
                >
                    <CentralizedTitle
                        title={mobilePhase4Title}
                        isActive={true}
                        isScrollLocked={isScrollLocked}
                        activePhase={activePhase}
                        titleArrayIndex={3}
                        scrollProgress={scrollProgress}
                        isMobile={true}
                    />
                </div>
            </ErrorBoundary>
        );
    }

    // ✅ PHASE 4 DESKTOP: Kein Titel (Logo bleibt)
    if (activePhase === 4 && !isMobile) {
        return (
            <ErrorBoundary>
                <div
                    className="title-layer-container desktop-phase4"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        pointerEvents: 'none'
                    }}
                >
                    {/* ✅ DEBUG CLEANUP: Nur Desktop */}
                    {process.env.NODE_ENV === 'development' && (
                        <DesktopPhase4DebugPanel
                            scrollProgress={scrollProgress}
                            activePhase={activePhase}
                            isScrollLocked={isScrollLocked}
                        />
                    )}
                </div>
            </ErrorBoundary>
        );
    }

    // Titel-Phasen 1-3 - Zentrale Logik (für alle Geräte)
    const titleArrayIndex = activePhase - 1; // Phase 1 → titles[0]
    const currentTitle = titles[titleArrayIndex];

    if (!currentTitle) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`❌ TITEL-FEHLER: Kein Titel für Phase ${activePhase} gefunden (Array-Index: ${titleArrayIndex})`);
            console.warn(`📊 Verfügbare Titel: ${titles.length}, Erwartet für Phase ${activePhase}: Index ${titleArrayIndex}`);
            const debugInfo = getPhaseDebugInfo(scrollProgress);
            console.warn('📊 Phase Debug Info:', debugInfo);
        }
        return null;
    }

    // Validiere dass Titel und zentrale Definition übereinstimmen
    const expectedTitleText = getTitleTextForPhase(activePhase);
    if (process.env.NODE_ENV === 'development' && currentTitle.text !== expectedTitleText) {
        console.warn(`⚠️ TITEL-MISMATCH: 
            Phase ${activePhase}: 
            Erwartet: "${expectedTitleText}" 
            Gefunden: "${currentTitle.text}"`);
    }

    return (
        <ErrorBoundary>
            <div
                className="title-layer-container title-phase"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 20,
                    pointerEvents: 'none'
                }}
            >
                {/* Titel mit zentraler Phase-Logik */}
                <CentralizedTitle
                    title={currentTitle}
                    isActive={true}
                    isScrollLocked={isScrollLocked}
                    activePhase={activePhase}
                    titleArrayIndex={titleArrayIndex}
                    scrollProgress={scrollProgress}
                    isMobile={isMobile}
                />

                {/* ✅ DEBUG CLEANUP: Nur Desktop */}
                {process.env.NODE_ENV === 'development' && !isMobile && (
                    <CentralizedDebugPanel
                        scrollProgress={scrollProgress}
                        activePhase={activePhase}
                        titleArrayIndex={titleArrayIndex}
                        currentTitle={currentTitle}
                        isScrollLocked={isScrollLocked}
                        currentTitleIndex={currentTitleIndex}
                        expectedTitleText={expectedTitleText}
                        isMobile={isMobile}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
});

// Titel-Komponente mit zentraler Phase-Logik
const CentralizedTitle = React.memo(({
    title,
    isActive,
    isScrollLocked,
    activePhase,
    titleArrayIndex,
    scrollProgress,
    isMobile = false
}) => {
    const titleRef = useRef(null);
    const lettersRef = useRef([]);
    const timelineRef = useRef(null);
    const currentStateRef = useRef('hidden');
    const lastActivePhaseRef = useRef(0);

    // Letter-Reveal Konfiguration (angepasst für Mobile)
    const config = useMemo(() => ({
        duration: isMobile ? 0.4 : 0.5,
        delay: isMobile ? 0.08 : 0.1,
        stagger: isMobile ? 0.15 : 0.2,
        ease: 'power2.out',
        startScale: 0.8,
        startBlur: 5,
    }), [isMobile]);

    // Buchstaben aufteilen
    const letters = useMemo(() => {
        return title.text.split('').map((char, index) => ({
            char: char === ' ' ? '\u00A0' : char,
            index
        }));
    }, [title.text]);

    // Animation Funktionen
    const animateIn = useCallback(() => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 CENTRALIZED-REVEAL: "${title.text}" (Phase ${activePhase}) wird eingeblendet${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'visible';
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ CENTRALIZED-REVEAL fertig: "${title.text}" (Phase ${activePhase})${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
                }
            }
        });

        tl.set(lettersRef.current, {
            opacity: 0,
            scale: config.startScale,
            filter: `blur(${config.startBlur}px)`,
            force3D: true
        });

        tl.to(lettersRef.current, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: config.duration,
            ease: config.ease,
            stagger: config.stagger,
            force3D: true
        }, config.delay);

        timelineRef.current = tl;

    }, [title.text, activePhase, config, isMobile]);

    const animateOut = useCallback(() => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 CENTRALIZED-HIDE: "${title.text}" (Phase ${activePhase}) wird ausgeblendet${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'hidden';
                if (process.env.NODE_ENV === 'development') {
                    console.log(`❌ CENTRALIZED-HIDE ausgeblendet: "${title.text}"`);
                }
            }
        });

        tl.to(lettersRef.current, {
            opacity: 0,
            scale: config.startScale * 0.9,
            filter: `blur(${config.startBlur * 1.5}px)`,
            duration: config.duration * 0.7,
            ease: 'power2.in',
            stagger: config.stagger * 0.5,
            force3D: true
        });

        timelineRef.current = tl;

    }, [title.text, activePhase, config]);

    // Reagiere auf zentrale Phase-Änderungen
    useEffect(() => {
        if (activePhase !== lastActivePhaseRef.current) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 CENTRALIZED TITEL Phase-Wechsel: ${lastActivePhaseRef.current} → ${activePhase}${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
                console.log(`📊 Phase Debug:`, getPhaseDebugInfo(scrollProgress));
            }

            if (isActive && activePhase > 0) {
                setTimeout(animateIn, 100);
            } else {
                animateOut();
            }

            lastActivePhaseRef.current = activePhase;
        }
    }, [activePhase, isActive, animateIn, animateOut, scrollProgress, isMobile]);

    // Initialisierung bei Phase-Wechsel
    useEffect(() => {
        if (titleRef.current && lettersRef.current.length > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 Initialisiere CENTRALIZED-Titel: "${title.text}" (Phase ${activePhase})${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
            }
            gsap.set(lettersRef.current, {
                opacity: 0,
                scale: config.startScale,
                filter: `blur(${config.startBlur}px)`
            });
            currentStateRef.current = 'hidden';
        }
    }, [title.text, activePhase, config, isMobile]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [title.text, activePhase]);

    // Styles (angepasst für Mobile)
    const titleStyles = useMemo(() => ({
        position: 'absolute',
        top: title.position.top,
        left: title.position.left,
        transform: 'translate(-50%, -50%)',
        ...title.style,
        // Mobile-spezifische Anpassungen
        ...(isMobile && {
            fontSize: '1.8rem', // Kleiner für Mobile
            letterSpacing: '0.3px'
        }),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        ...(isScrollLocked && {
            filter: 'brightness(1.1)',
        })
    }), [title.position, title.style, isScrollLocked, isMobile]);

    const letterStyles = useMemo(() => ({
        display: 'inline-block',
        opacity: 0,
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        marginRight: '1px'
    }), []);

    const cssClasses = useMemo(() => {
        const classes = [
            'centralized-title',
            'letter-reveal-title',
            `title-${title.index + 1}`,
            `centralized-phase-${activePhase}`
        ];

        if (isMobile) {
            classes.push('mobile-title');
        }

        if (isActive) {
            classes.push('active-title');
        }

        if (isScrollLocked) {
            classes.push('scroll-locked');
        }

        return classes.join(' ');
    }, [title.index, isActive, isScrollLocked, activePhase, isMobile]);

    return (
        <div
            ref={titleRef}
            className={cssClasses}
            style={titleStyles}
            data-title-id={title.id}
            data-title-index={title.index}
            data-active-phase={activePhase}
            data-array-index={titleArrayIndex}
            data-scroll-progress={scrollProgress.toFixed(3)}
            data-is-active={isActive}
            data-is-mobile={isMobile}
        >
            {letters.map((letter, index) => (
                <span
                    key={`${activePhase}-${title.text}-${index}-${isMobile ? 'mobile' : 'desktop'}`}
                    ref={el => {
                        if (el) {
                            lettersRef.current[index] = el;
                        }
                    }}
                    className={`letter letter-${index}`}
                    style={letterStyles}
                    data-letter={letter.char}
                    data-index={index}
                    data-phase={activePhase}
                    data-mobile={isMobile}
                >
                    {letter.char}
                </span>
            ))}
        </div>
    );
});

// ✅ DEBUG PANELS - NUR DESKTOP

// Debug-Panel für Logo-Phase (nur Desktop)
const LogoPhaseDebugPanel = React.memo(({ scrollProgress, activePhase, isScrollLocked }) => {
    const debugInfo = getPhaseDebugInfo(scrollProgress);

    return (
        <div
            style={{
                position: 'absolute',
                top: '60px',
                left: '10px',
                background: 'rgba(0,100,0,0.8)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                pointerEvents: 'all',
                fontFamily: 'monospace',
                lineHeight: '1.4'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                🏠 Phase 0 - Logo/Newsletter (DESKTOP ONLY)
            </div>
            <div>ScrollProgress: {debugInfo.scrollProgress}</div>
            <div>Active Phase: {debugInfo.phase}</div>
            <div>Debug %: {debugInfo.debugPercentage}</div>
            <div>Range: {debugInfo.phaseRange}</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8, color: '#90EE90' }}>
                ✅ Nutzt zentrale phaseUtils.js
            </div>
        </div>
    );
});

// Debug-Panel für Phase 5 & 6 (nur Desktop)
const NoTitlePhaseDebugPanel = React.memo(({ scrollProgress, activePhase, isScrollLocked }) => {
    const debugInfo = getPhaseDebugInfo(scrollProgress);

    return (
        <div
            style={{
                position: 'absolute',
                top: '60px',
                left: '10px',
                background: 'rgba(168, 128, 255, 0.8)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                pointerEvents: 'all',
                fontFamily: 'monospace',
                lineHeight: '1.4'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {activePhase === 5 ? '🎠' : '📧'} Phase {activePhase} - {debugInfo.phaseDescription} (DESKTOP ONLY)
            </div>
            <div>ScrollProgress: {debugInfo.scrollProgress}</div>
            <div>Active Phase: {debugInfo.phase}</div>
            <div>Debug %: {debugInfo.debugPercentage}</div>
            <div>Range: {debugInfo.phaseRange}</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8, color: '#ffff00' }}>
                ✅ KEINE TITEL - Phase {activePhase} korrekt erkannt
            </div>
        </div>
    );
});

// Debug-Panel für Desktop Phase 4 (nur Desktop)
const DesktopPhase4DebugPanel = React.memo(({ scrollProgress, activePhase, isScrollLocked }) => {
    const debugInfo = getPhaseDebugInfo(scrollProgress);

    return (
        <div
            style={{
                position: 'absolute',
                top: '60px',
                left: '10px',
                background: 'rgba(76, 175, 80, 0.8)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                pointerEvents: 'all',
                fontFamily: 'monospace',
                lineHeight: '1.4'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                🖥️ Phase 4 - Desktop (KEIN TITEL, LOGO BLEIBT)
            </div>
            <div>ScrollProgress: {debugInfo.scrollProgress}</div>
            <div>Active Phase: {debugInfo.phase}</div>
            <div>Debug %: {debugInfo.debugPercentage}</div>
            <div>Range: {debugInfo.phaseRange}</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8, color: '#ffff00' }}>
                🖥️ DESKTOP: Logo Phase 4 bleibt aktiv
            </div>
        </div>
    );
});

// Hauptdebug-Panel für Titel-Phasen (nur Desktop)
const CentralizedDebugPanel = React.memo(({
    scrollProgress,
    activePhase,
    titleArrayIndex,
    currentTitle,
    isScrollLocked,
    currentTitleIndex,
    expectedTitleText,
    isMobile = false
}) => {
    const debugInfo = getPhaseDebugInfo(scrollProgress);
    const isValidMapping = currentTitle.text === expectedTitleText;

    return (
        <div
            style={{
                position: 'absolute',
                top: '60px',
                left: '10px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                pointerEvents: 'all',
                fontFamily: 'monospace',
                lineHeight: '1.4'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00ff00' }}>
                🎭 CENTRALIZED TITEL (MOBILE CLEAN)
            </div>

            <div>ScrollProgress: {debugInfo.scrollProgress}</div>
            <div>Debug %: {debugInfo.debugPercentage}</div>
            <div>Active Phase: {debugInfo.phase}/4 (Array: {titleArrayIndex}/3)</div>
            <div>Range: {debugInfo.phaseRange}</div>
            <div>Device: {isMobile ? '📱 Mobile' : '🖥️ Desktop'}</div>

            <div style={{
                marginTop: '4px',
                color: isValidMapping ? '#4CAF50' : '#ff6b6b',
                fontSize: '10px'
            }}>
                {isValidMapping ? '✅' : '❌'} Titel-Mapping: "{currentTitle.text}"
            </div>

            {!isValidMapping && (
                <div style={{ fontSize: '9px', color: '#ff6b6b' }}>
                    Erwartet: "{expectedTitleText}"
                </div>
            )}

            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>

            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8 }}>
                ✅ Mobile Debug Panels entfernt
            </div>
            <div style={{ marginTop: '2px', fontSize: '9px', color: '#4CAF50' }}>
                📱 Mobile Phase 4: "AniTune" Titel
            </div>
            <div style={{ marginTop: '2px', fontSize: '9px', color: '#a880ff' }}>
                🖥️ Desktop Phase 4: Kein Titel (Logo)
            </div>
        </div>
    );
});

// Display Names
TitleLayer.displayName = 'CentralizedTitleLayer';
CentralizedTitle.displayName = 'CentralizedTitle';
LogoPhaseDebugPanel.displayName = 'LogoPhaseDebugPanel';
NoTitlePhaseDebugPanel.displayName = 'NoTitlePhaseDebugPanel';
DesktopPhase4DebugPanel.displayName = 'DesktopPhase4DebugPanel';
CentralizedDebugPanel.displayName = 'CentralizedDebugPanel';

export default TitleLayer;