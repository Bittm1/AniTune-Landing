// src/components/Parallax/Elements/TitleLayer.jsx - FIX für Phase 5 & 6

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
                    {/* ✅ NUR DEVELOPMENT: Debug-Info für Logo-Phase */}
                    {process.env.NODE_ENV === 'development' && (
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
                    {/* ✅ NUR DEVELOPMENT: Debug-Info für Phase 5 & 6 */}
                    {process.env.NODE_ENV === 'development' && (
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

    // Titel-Phasen 1-4 - Zentrale Logik
    const titleArrayIndex = activePhase - 1; // Phase 1 → titles[0], Phase 4 → titles[3]
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
                />

                {/* ✅ NUR DEVELOPMENT: Erweiterte Debug-Info mit zentraler Validierung */}
                {process.env.NODE_ENV === 'development' && (
                    <CentralizedDebugPanel
                        scrollProgress={scrollProgress}
                        activePhase={activePhase}
                        titleArrayIndex={titleArrayIndex}
                        currentTitle={currentTitle}
                        isScrollLocked={isScrollLocked}
                        currentTitleIndex={currentTitleIndex}
                        expectedTitleText={expectedTitleText}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
});

// Titel-Komponente mit zentraler Phase-Logik (unverändert)
const CentralizedTitle = React.memo(({
    title,
    isActive,
    isScrollLocked,
    activePhase,
    titleArrayIndex,
    scrollProgress
}) => {
    const titleRef = useRef(null);
    const lettersRef = useRef([]);
    const timelineRef = useRef(null);
    const currentStateRef = useRef('hidden');
    const lastActivePhaseRef = useRef(0);

    // Letter-Reveal Konfiguration
    const config = useMemo(() => ({
        duration: 0.5,
        delay: 0.1,
        stagger: 0.2,
        ease: 'power2.out',
        startScale: 0.8,
        startBlur: 5,
    }), []);

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
            console.log(`🎭 CENTRALIZED-REVEAL: "${title.text}" (Phase ${activePhase}) wird eingeblendet`);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'visible';
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ CENTRALIZED-REVEAL fertig: "${title.text}" (Phase ${activePhase})`);
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

    }, [title.text, activePhase, config]);

    const animateOut = useCallback(() => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 CENTRALIZED-HIDE: "${title.text}" (Phase ${activePhase}) wird ausgeblendet`);
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
                console.log(`🔄 CENTRALIZED TITEL Phase-Wechsel: ${lastActivePhaseRef.current} → ${activePhase}`);
                console.log(`📊 Phase Debug:`, getPhaseDebugInfo(scrollProgress));
            }

            if (isActive && activePhase > 0) {
                setTimeout(animateIn, 100);
            } else {
                animateOut();
            }

            lastActivePhaseRef.current = activePhase;
        }
    }, [activePhase, isActive, animateIn, animateOut, scrollProgress]);

    // Initialisierung bei Phase-Wechsel
    useEffect(() => {
        if (titleRef.current && lettersRef.current.length > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 Initialisiere CENTRALIZED-Titel: "${title.text}" (Phase ${activePhase})`);
            }
            gsap.set(lettersRef.current, {
                opacity: 0,
                scale: config.startScale,
                filter: `blur(${config.startBlur}px)`
            });
            currentStateRef.current = 'hidden';
        }
    }, [title.text, activePhase, config]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [title.text, activePhase]);

    // Styles
    const titleStyles = useMemo(() => ({
        position: 'absolute',
        top: title.position.top,
        left: title.position.left,
        transform: 'translate(-50%, -50%)',
        ...title.style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        ...(isScrollLocked && {
            filter: 'brightness(1.1)',
        })
    }), [title.position, title.style, isScrollLocked]);

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

        if (isActive) {
            classes.push('active-title');
        }

        if (isScrollLocked) {
            classes.push('scroll-locked');
        }

        return classes.join(' ');
    }, [title.index, isActive, isScrollLocked, activePhase]);

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
        >
            {letters.map((letter, index) => (
                <span
                    key={`${activePhase}-${title.text}-${index}`}
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
                >
                    {letter.char}
                </span>
            ))}
        </div>
    );
});

// ✅ NUR DEVELOPMENT: Debug-Panel für Logo-Phase (unverändert)
const LogoPhaseDebugPanel = React.memo(({ scrollProgress, activePhase, isScrollLocked }) => {
    if (process.env.NODE_ENV !== 'development') return null;

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
                🏠 Phase 0 - Logo/Newsletter (CENTRALIZED)
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

// ✅ NEU: Debug-Panel für Phase 5 & 6 (keine Titel)
const NoTitlePhaseDebugPanel = React.memo(({ scrollProgress, activePhase, isScrollLocked }) => {
    if (process.env.NODE_ENV !== 'development') return null;

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
                {activePhase === 5 ? '🎠' : '📧'} Phase {activePhase} - {debugInfo.phaseDescription} (CENTRALIZED)
            </div>
            <div>ScrollProgress: {debugInfo.scrollProgress}</div>
            <div>Active Phase: {debugInfo.phase}</div>
            <div>Debug %: {debugInfo.debugPercentage}</div>
            <div>Range: {debugInfo.phaseRange}</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8, color: '#ffff00' }}>
                ✅ KEINE TITEL - Phase {activePhase} korrekt erkannt
            </div>
            <div style={{ marginTop: '2px', fontSize: '9px', color: '#90EE90' }}>
                🎯 Titel-Layer übersprungen (Phase {activePhase} ≥ 5)
            </div>
        </div>
    );
});

// ✅ NUR DEVELOPMENT: Erweiterte Debug-Info mit Validierung (angepasst)
const CentralizedDebugPanel = React.memo(({
    scrollProgress,
    activePhase,
    titleArrayIndex,
    currentTitle,
    isScrollLocked,
    currentTitleIndex,
    expectedTitleText
}) => {
    if (process.env.NODE_ENV !== 'development') return null;

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
                🎭 CENTRALIZED TITEL (FIXED)
            </div>

            {/* Zentrale Debug-Info */}
            <div>ScrollProgress: {debugInfo.scrollProgress}</div>
            <div>Debug %: {debugInfo.debugPercentage}</div>
            <div>Active Phase: {debugInfo.phase}/4 (Array: {titleArrayIndex}/3)</div>
            <div>Range: {debugInfo.phaseRange}</div>
            <div>Snap Index: {currentTitleIndex}/6 (nur Navigation)</div>

            {/* Titel-Validierung */}
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
                ✅ Nutzt zentrale phaseUtils.js
            </div>
            <div style={{ marginTop: '2px', fontSize: '9px', color: '#4CAF50' }}>
                📍 {debugInfo.phaseRange}: {debugInfo.titleText || 'Kein Titel'}
            </div>
            <div style={{ marginTop: '2px', fontSize: '9px', color: '#a880ff' }}>
                🔧 FIX: Phase 5 & 6 übersprungen (≥ 5)
            </div>
        </div>
    );
});

// Display Names
TitleLayer.displayName = 'CentralizedTitleLayer';
CentralizedTitle.displayName = 'CentralizedTitle';
LogoPhaseDebugPanel.displayName = 'LogoPhaseDebugPanel';
NoTitlePhaseDebugPanel.displayName = 'NoTitlePhaseDebugPanel';
CentralizedDebugPanel.displayName = 'CentralizedDebugPanel';

export default TitleLayer;