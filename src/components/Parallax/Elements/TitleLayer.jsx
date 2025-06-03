// src/components/Parallax/Elements/TitleLayer.jsx - SYNCHRONISIERT mit Audio-Bereichen

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
import { getAnimationTiming, getDeviceOptimizedTiming } from '../config/timingConfig';
import './TitleLayer.css';

const TitleLayer = React.memo(({
    scrollProgress,
    titles = [],
    currentTitleIndex = 0,  // ✅ Nur noch für Snap-Navigation
    isScrollLocked = false
}) => {
    if (!titles || titles.length === 0) return null;

    // ✅ SYNCHRONISIERTE BEREICHE mit Audio-System
    const getActivePhaseFromScroll = useCallback((progress) => {
        // ✅ EXAKT GLEICHE BEREICHE wie TitleAudioLayer - 3 Titel
        if (progress >= 0.05 && progress < 0.38) return 1;      // Phase 1: Von Uns Heißt Für Uns
        else if (progress >= 0.38 && progress < 0.71) return 2; // Phase 2: Der Weg Ist Das Ziel  
        else if (progress >= 0.71 && progress < 1.0) return 3;  // Phase 3: Die Community Heißt
        return 0; // Logo-Phase oder andere
    }, []);

    const activePhase = getActivePhaseFromScroll(scrollProgress);

    // ✅ PHASE 0: Logo/Newsletter - zeige keine Titel an
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
                    {/* Debug-Info für Logo-Phase */}
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

    // ✅ TITEL-PHASEN 1-3: Basierend auf scrollProgress
    const titleArrayIndex = activePhase - 1; // Phase 1 → titles[0]
    const currentTitle = titles[titleArrayIndex];

    if (!currentTitle) {
        console.warn(`TitleLayer: Kein Titel für Phase ${activePhase} gefunden (Array-Index: ${titleArrayIndex})`);
        return null;
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
                {/* ✅ SCROLL-BASIERTER TITEL */}
                <ScrollBasedTitle
                    title={currentTitle}
                    isActive={true}
                    isScrollLocked={isScrollLocked}
                    activePhase={activePhase}
                    titleArrayIndex={titleArrayIndex}
                    scrollProgress={scrollProgress}
                />

                {/* Debug-Info */}
                {process.env.NODE_ENV === 'development' && (
                    <ScrollTitleDebugPanel
                        scrollProgress={scrollProgress}
                        activePhase={activePhase}
                        titleArrayIndex={titleArrayIndex}
                        currentTitle={currentTitle}
                        isScrollLocked={isScrollLocked}
                        currentTitleIndex={currentTitleIndex}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
});

// ✅ SCROLL-BASIERTE TITEL-KOMPONENTE
const ScrollBasedTitle = React.memo(({
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

    // ✅ LETTER-REVEAL KONFIGURATION (wie im Original)
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

    // ✅ SCROLL-BASIERTE ANIMATION
    const animateIn = useCallback(() => {
        if (!titleRef.current) return;

        console.log(`🎭 SCROLL-REVEAL: "${title.text}" (Phase ${activePhase}) wird eingeblendet`);

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'visible';
                console.log(`✅ SCROLL-REVEAL fertig: "${title.text}" (Phase ${activePhase})`);
            }
        });

        // ✅ Startwerte setzen
        tl.set(lettersRef.current, {
            opacity: 0,
            scale: config.startScale,
            filter: `blur(${config.startBlur}px)`,
            force3D: true
        });

        // ✅ Einblenden
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

        console.log(`🎭 SCROLL-HIDE: "${title.text}" (Phase ${activePhase}) wird ausgeblendet`);

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'hidden';
                console.log(`❌ SCROLL-HIDE ausgeblendet: "${title.text}"`);
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

    // ✅ REAGIERE AUF PHASE-ÄNDERUNGEN (scroll-basiert)
    useEffect(() => {
        if (activePhase !== lastActivePhaseRef.current) {
            console.log(`🔄 TITEL Phase-Wechsel: ${lastActivePhaseRef.current} → ${activePhase}`);

            if (isActive && activePhase > 0) {
                setTimeout(animateIn, 100);
            } else {
                animateOut();
            }

            lastActivePhaseRef.current = activePhase;
        }
    }, [activePhase, isActive, animateIn, animateOut]);

    // ✅ INITIALISIERUNG bei Phase-Wechsel
    useEffect(() => {
        if (titleRef.current && lettersRef.current.length > 0) {
            console.log(`🔧 Initialisiere SCROLL-Titel: "${title.text}" (Phase ${activePhase})`);
            gsap.set(lettersRef.current, {
                opacity: 0,
                scale: config.startScale,
                filter: `blur(${config.startBlur}px)`
            });
            currentStateRef.current = 'hidden';
        }
    }, [title.text, activePhase, config]);

    // ✅ CLEANUP
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
            'scroll-reveal-title',
            'letter-reveal-title',
            `title-${title.index + 1}`,
            `scroll-phase-${activePhase}`
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

// ✅ DEBUG-PANEL FÜR LOGO-PHASE
const LogoPhaseDebugPanel = React.memo(({ scrollProgress, activePhase, isScrollLocked }) => {
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
                🏠 Phase 0 - Logo/Newsletter (SCROLL-BASIERT)
            </div>
            <div>ScrollProgress: {scrollProgress.toFixed(3)}</div>
            <div>Active Phase: {activePhase}</div>
            <div>Debug: {(scrollProgress * 40).toFixed(1)}%</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8 }}>
                ✅ Titel folgen scrollProgress, nicht Snaps
            </div>
        </div>
    );
});

// ✅ DEBUG-PANEL FÜR SCROLL-TITEL
const ScrollTitleDebugPanel = React.memo(({
    scrollProgress,
    activePhase,
    titleArrayIndex,
    currentTitle,
    isScrollLocked,
    currentTitleIndex
}) => {
    const timingConfig = getDeviceOptimizedTiming();
    const letterCount = currentTitle.text.length;

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
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                🎭 SCROLL-BASIERTE TITEL (SYNCHRONISIERT)
            </div>
            <div>ScrollProgress: {scrollProgress.toFixed(3)}</div>
            <div>Debug: {(scrollProgress * 40).toFixed(1)}%</div>
            <div>Active Phase: {activePhase}/3 (Array: {titleArrayIndex}/2)</div>
            <div>Snap Index: {currentTitleIndex}/8 (nur Navigation)</div>
            <div>Text: "{currentTitle.text}" ({letterCount} Buchstaben)</div>
            <div>Stagger: 0.2s pro Buchstabe</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>

            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8 }}>
                ✅ SYNCHRON mit Audio-System
            </div>
            <div style={{ marginTop: '4px', fontSize: '9px', color: '#4CAF50' }}>
                🎵 Bereiche: 5%-38%, 38%-71%, 71%-100%
            </div>
            <div style={{ marginTop: '2px', fontSize: '9px', color: '#a880ff' }}>
                📍 Phase {activePhase}: {
                    activePhase === 1 ? '5%-38% (Von Uns Heißt Für Uns)' :
                        activePhase === 2 ? '38%-71% (Der Weg Ist Das Ziel)' :
                            activePhase === 3 ? '71%-100% (Die Community Heißt)' :
                                'Unbekannt'
                }
            </div>
        </div>
    );
});

// Display Names
TitleLayer.displayName = 'ScrollBasedTitleLayer';
ScrollBasedTitle.displayName = 'ScrollBasedTitle';
LogoPhaseDebugPanel.displayName = 'LogoPhaseDebugPanel';
ScrollTitleDebugPanel.displayName = 'ScrollTitleDebugPanel';

export default TitleLayer;