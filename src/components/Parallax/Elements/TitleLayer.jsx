import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
// ✅ IMPORT: Timing-Config
import { getAnimationTiming, getDeviceOptimizedTiming } from '../config/timingConfig';
import './TitleLayer.css';

// ✅ TitleLayer mit korrigiertem Letter-Reveal (funktioniert bei allen Phasen)
const TitleLayer = React.memo(({
    scrollProgress,
    titles = [],
    currentTitleIndex = 0,  // ✅ Interne Logik: 0=Logo-Phase, 1-6=Titel, 7=Carousel
    isScrollLocked = false
}) => {
    if (!titles || titles.length === 0) return null;

    // ✅ PHASE 0: Logo/Newsletter - zeige keine Titel an
    if (currentTitleIndex === 0) {
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
                            currentTitleIndex={currentTitleIndex}
                            isScrollLocked={isScrollLocked}
                        />
                    )}
                </div>
            </ErrorBoundary>
        );
    }

    // ✅ NEU: PHASE 7: Carousel - zeige keine Titel an
    if (currentTitleIndex === 7) {
        return (
            <ErrorBoundary>
                <div
                    className="title-layer-container carousel-phase"
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
                    {/* Debug-Info für Carousel-Phase */}
                    {process.env.NODE_ENV === 'development' && (
                        <CarouselPhaseDebugPanel
                            currentTitleIndex={currentTitleIndex}
                            isScrollLocked={isScrollLocked}
                        />
                    )}
                </div>
            </ErrorBoundary>
        );
    }

    // ✅ TITEL-PHASEN 1-6: Exakt wie vorher
    const titleArrayIndex = currentTitleIndex - 1; // Index 1 → titles[0]
    const currentTitle = titles[titleArrayIndex];

    if (!currentTitle) {
        console.warn(`TitleLayer: Kein Titel für Index ${currentTitleIndex} gefunden (Array-Index: ${titleArrayIndex})`);
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
                {/* ✅ LETTER-REVEAL TITEL (korrigiert für alle Phasen) */}
                <LetterRevealSingleTitle
                    title={currentTitle}
                    isActive={true}
                    isScrollLocked={isScrollLocked}
                    titleIndex={currentTitleIndex}
                    arrayIndex={titleArrayIndex}
                />

                {/* Debug-Info mit Letter-Reveal-Details */}
                {process.env.NODE_ENV === 'development' && (
                    <TitlePhaseDebugPanel
                        currentTitleIndex={currentTitleIndex}
                        arrayIndex={titleArrayIndex}
                        currentTitle={currentTitle}
                        isScrollLocked={isScrollLocked}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
});

// ✅ KORRIGIERTE KOMPONENTE: Letter-Reveal SingleTitle (funktioniert bei allen Phasen)
const LetterRevealSingleTitle = React.memo(({ title, isActive, isScrollLocked, titleIndex, arrayIndex }) => {
    const titleRef = useRef(null);
    const lettersRef = useRef([]);
    const timelineRef = useRef(null);
    const currentStateRef = useRef('hidden');

    // ✅ LETTER-REVEAL KONFIGURATION (wie im Original-Code)
    const config = useMemo(() => ({
        duration: 0.5,        // Dauer pro Buchstabe
        delay: 0.1,           // Kurze Anfangsverzögerung
        stagger: 0.2,         // 0.2s zwischen Buchstaben (wie im Original)
        ease: 'power2.out',   // Entspricht CSS ease-out
        startScale: 0.8,      // Wie im Original
        startBlur: 5,         // 5px Blur wie im Original
    }), []);

    // Buchstaben in Array aufteilen
    const letters = useMemo(() => {
        return title.text.split('').map((char, index) => ({
            char: char === ' ' ? '\u00A0' : char, // Non-breaking space für Leerzeichen
            index
        }));
    }, [title.text]);

    // ✅ KORRIGIERT: Animation für Einblenden (funktioniert bei allen Phasen)
    const animateIn = useCallback(() => {
        if (!titleRef.current) return; // ✅ NUR DOM-Check, kein State-Check

        console.log(`🎭 Letter Reveal: "${title.text}" (Phase ${titleIndex}) wird eingeblendet`);

        // Stoppe vorherige Animation
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        // GSAP Timeline erstellen
        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'visible';
                console.log(`✅ Letter Reveal fertig: "${title.text}" (Phase ${titleIndex})`);
            }
        });

        // ✅ ALLE BUCHSTABEN auf Startwerte setzen (wie im Original)
        tl.set(lettersRef.current, {
            opacity: 0,
            scale: config.startScale,
            filter: `blur(${config.startBlur}px)`,
            force3D: true
        });

        // ✅ BUCHSTABEN NACHEINANDER einblenden (wie im Original)
        tl.to(lettersRef.current, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: config.duration,
            ease: config.ease,
            stagger: config.stagger, // 0.2s Verzögerung zwischen Buchstaben
            force3D: true
        }, config.delay);

        timelineRef.current = tl;

    }, [title.text, titleIndex, config]);

    // ✅ KORRIGIERT: Animation für Ausblenden (funktioniert bei allen Phasen)
    const animateOut = useCallback(() => {
        if (!titleRef.current) return; // ✅ NUR DOM-Check, kein State-Check

        console.log(`🎭 Letter Reveal: "${title.text}" (Phase ${titleIndex}) wird ausgeblendet`);

        // Stoppe vorherige Animation
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        // Schnelleres Ausblenden
        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'hidden';
                console.log(`❌ Letter Reveal ausgeblendet: "${title.text}" (Phase ${titleIndex})`);
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

    }, [title.text, titleIndex, config]);

    // ✅ KORRIGIERT: Reagiere auf isActive UND titleIndex Änderungen
    useEffect(() => {
        if (isActive) {
            // ✅ WICHTIG: Immer animieren wenn aktiv, egal was der State ist
            console.log(`🎯 Phase ${titleIndex}: "${title.text}" wird aktiviert - starte Animation`);
            setTimeout(animateIn, 100);
        } else {
            animateOut();
        }
    }, [isActive, titleIndex, animateIn, animateOut]); // ✅ titleIndex als Dependency

    // ✅ KORRIGIERT: Initialisierung bei jedem Titel-Wechsel
    useEffect(() => {
        if (titleRef.current && lettersRef.current.length > 0) {
            console.log(`🔧 Initialisiere Letter-Reveal für: "${title.text}" (Phase ${titleIndex})`);
            gsap.set(lettersRef.current, {
                opacity: 0,
                scale: config.startScale,
                filter: `blur(${config.startBlur}px)`
            });
            currentStateRef.current = 'hidden';
        }
    }, [title.text, titleIndex, config]); // ✅ Bei jedem Titel-Wechsel neu initialisieren

    // ✅ KORRIGIERT: Cleanup bei Titel-Wechsel
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [title.text, titleIndex]); // ✅ Cleanup bei jedem Titel-Wechsel

    // Memoized styles
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

    // Letter-Styles
    const letterStyles = useMemo(() => ({
        display: 'inline-block',
        opacity: 0,
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        marginRight: '1px' // Minimal spacing zwischen Buchstaben
    }), []);

    // CSS-Klassen
    const cssClasses = useMemo(() => {
        const classes = [
            'letter-reveal-title',
            'lock-snap-title',
            `title-${title.index + 1}`,
            `phase-${titleIndex}`
        ];

        if (isActive) {
            classes.push('active-title');
        }

        if (isScrollLocked) {
            classes.push('scroll-locked');
        }

        return classes.join(' ');
    }, [title.index, isActive, isScrollLocked, titleIndex]);

    return (
        <div
            ref={titleRef}
            className={cssClasses}
            style={titleStyles}
            data-title-id={title.id}
            data-title-index={title.index}
            data-phase-index={titleIndex}
            data-array-index={arrayIndex}
            data-is-active={isActive}
            data-scroll-locked={isScrollLocked}
        >
            {letters.map((letter, index) => (
                <span
                    key={`${titleIndex}-${title.text}-${index}`} // ✅ Eindeutige Keys pro Phase
                    ref={el => {
                        if (el) {
                            lettersRef.current[index] = el;
                        }
                    }}
                    className={`letter letter-${index}`}
                    style={letterStyles}
                    data-letter={letter.char}
                    data-index={index}
                    data-phase={titleIndex}
                >
                    {letter.char}
                </span>
            ))}
        </div>
    );
});

// ✅ DEBUG-PANEL FÜR LOGO-PHASE (unverändert)
const LogoPhaseDebugPanel = React.memo(({ currentTitleIndex, isScrollLocked }) => {
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
                🏠 Phase 0 - Logo/Newsletter
            </div>
            <div>Phase: {currentTitleIndex}/7</div>
            <div>Status: Logo + Newsletter sichtbar</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8 }}>
                Scroll nach unten → Titel 1
            </div>
        </div>
    );
});

// ✅ NEU: DEBUG-PANEL FÜR CAROUSEL-PHASE
const CarouselPhaseDebugPanel = React.memo(({ currentTitleIndex, isScrollLocked }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '60px',
                left: '10px',
                background: 'rgba(168,128,255,0.8)',
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
                🎠 Phase 7 - AniTune Carousel
            </div>
            <div>Phase: {currentTitleIndex}/7</div>
            <div>Status: Carousel aktiv</div>
            <div>Kein Titel erforderlich</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8 }}>
                ↑ Phase 6 | Carousel Navigation über Karten
            </div>
            <div style={{ marginTop: '4px', fontSize: '9px', color: '#FFD700' }}>
                🎨 Carousel läuft unabhängig von Titel-System
            </div>
        </div>
    );
});

// ✅ DEBUG-PANEL FÜR TITEL-PHASE
const TitlePhaseDebugPanel = React.memo(({
    currentTitleIndex,
    arrayIndex,
    currentTitle,
    isScrollLocked
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
                🎭 Phase {currentTitleIndex} - Letter Reveal ({timingConfig.name})
            </div>
            <div>Titel: {currentTitleIndex}/7 (Array: {arrayIndex}/5)</div>
            <div>Text: "{currentTitle.text}" ({letterCount} Buchstaben)</div>
            <div>Effekt: Standard Reveal (wie Original)</div>
            <div>Stagger: 0.2s pro Buchstabe</div>
            <div>Total Zeit: ~{(letterCount * 0.2 + 0.6).toFixed(1)}s</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
            <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.8 }}>
                ↑ Phase {currentTitleIndex - 1} | ↓ Phase {currentTitleIndex + 1}
            </div>
            <div style={{ marginTop: '4px', fontSize: '9px', color: '#4CAF50' }}>
                🎨 Scale: 0.8→1 | Blur: 5px→0 | Opacity: 0→1 | Stagger: 0.2s
            </div>
        </div>
    );
});

TitleLayer.displayName = 'LetterRevealTitleLayer';
LetterRevealSingleTitle.displayName = 'LetterRevealSingleTitle';
LogoPhaseDebugPanel.displayName = 'LogoPhaseDebugPanel';
CarouselPhaseDebugPanel.displayName = 'CarouselPhaseDebugPanel';
TitlePhaseDebugPanel.displayName = 'TitlePhaseDebugPanel';

export default TitleLayer;