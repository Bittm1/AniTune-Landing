// src/components/Enhanced/TitleLayer.jsx - STUFE 2: TITEL SYSTEM

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../ErrorBoundary';

// ===== TITEL KONFIGURATION =====
const TITLE_CONFIG = [
    {
        id: 'title-1',
        text: 'Von Uns Heißt Für Uns',
        snapPoint: 1,
        index: 0,
        position: { top: '50%', left: '50%' },
        style: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'white',
            textShadow: '0 0 20px rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.8)',
            fontFamily: 'Lobster, cursive, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center'
        }
    },
    {
        id: 'title-2',
        text: 'Der Weg Ist Das Ziel',
        snapPoint: 2,
        index: 1,
        position: { top: '50%', left: '50%' },
        style: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'white',
            textShadow: '0 0 20px rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.8)',
            fontFamily: 'Lobster, cursive, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center'
        }
    },
    {
        id: 'title-3',
        text: 'Die Community Heißt',
        snapPoint: 3,
        index: 2,
        position: { top: '50%', left: '50%' },
        style: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'white',
            textShadow: '0 0 20px rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.8)',
            fontFamily: 'Lobster, cursive, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center'
        }
    }
];

const EnhancedTitleLayer = React.memo(({
    activeSnapPoint = 0,
    scrollProgress = 0,
    isSnapping = false
}) => {
    // ===== MOBILE DETECTION =====
    const [isMobile, setIsMobile] = React.useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768;
    });

    // ===== AKTIVEN TITEL ERMITTELN =====
    const activeTitle = useMemo(() => {
        // Nur Snap-Points 1, 2, 3 haben Titel
        return TITLE_CONFIG.find(title => title.snapPoint === activeSnapPoint) || null;
    }, [activeSnapPoint]);

    const shouldShowTitle = useMemo(() => {
        return activeSnapPoint >= 1 && activeSnapPoint <= 3;
    }, [activeSnapPoint]);

    // ===== RESIZE HANDLER =====
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Wenn kein Titel aktiv, zeige nur Debug-Info
    if (!shouldShowTitle || !activeTitle) {
        return (
            <ErrorBoundary>
                <div
                    className="enhanced-title-layer no-title"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 30,
                        pointerEvents: 'none'
                    }}
                >
                    {/* ===== DEBUG INFO (NUR DEVELOPMENT) ===== */}
                    {process.env.NODE_ENV === 'development' && (
                        <NoTitleDebugPanel
                            activeSnapPoint={activeSnapPoint}
                            scrollProgress={scrollProgress}
                            isSnapping={isSnapping}
                            shouldShowTitle={shouldShowTitle}
                        />
                    )}
                </div>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <div
                className="enhanced-title-layer with-title"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 30,
                    pointerEvents: 'none'
                }}
            >
                {/* ===== LETTER REVEAL TITEL ===== */}
                <LetterRevealTitle
                    title={activeTitle}
                    isActive={true}
                    isSnapping={isSnapping}
                    activeSnapPoint={activeSnapPoint}
                    scrollProgress={scrollProgress}
                    isMobile={isMobile}
                />

                {/* ===== DEBUG INFO (NUR DEVELOPMENT) ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <TitleDebugPanel
                        activeTitle={activeTitle}
                        activeSnapPoint={activeSnapPoint}
                        scrollProgress={scrollProgress}
                        isSnapping={isSnapping}
                        isMobile={isMobile}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
});

// ===== LETTER REVEAL TITEL KOMPONENTE =====
const LetterRevealTitle = React.memo(({
    title,
    isActive,
    isSnapping,
    activeSnapPoint,
    scrollProgress,
    isMobile = false
}) => {
    const titleRef = useRef(null);
    const lettersRef = useRef([]);
    const timelineRef = useRef(null);
    const currentStateRef = useRef('hidden');
    const lastActiveSnapPointRef = useRef(0);

    // ===== ANIMATION KONFIGURATION =====
    const config = useMemo(() => ({
        duration: isMobile ? 0.4 : 0.5,
        delay: isMobile ? 0.08 : 0.1,
        stagger: isMobile ? 0.15 : 0.2,
        ease: 'power2.out',
        startScale: 0.8,
        startBlur: 5,
    }), [isMobile]);

    // ===== BUCHSTABEN AUFTEILEN =====
    const letters = useMemo(() => {
        return title.text.split('').map((char, index) => ({
            char: char === ' ' ? '\u00A0' : char, // Non-breaking space
            index
        }));
    }, [title.text]);

    // ===== ANIMATION FUNKTIONEN =====
    const animateIn = useCallback(() => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 LETTER-REVEAL: "${title.text}" (Snap-Point ${activeSnapPoint}) wird eingeblendet${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'visible';
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ LETTER-REVEAL fertig: "${title.text}" (Snap-Point ${activeSnapPoint})`);
                }
            }
        });

        // Buchstaben initial verstecken
        tl.set(lettersRef.current, {
            opacity: 0,
            scale: config.startScale,
            filter: `blur(${config.startBlur}px)`,
            force3D: true
        });

        // Buchstaben einzeln einblenden
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

    }, [title.text, activeSnapPoint, config, isMobile]);

    const animateOut = useCallback(() => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 LETTER-HIDE: "${title.text}" (Snap-Point ${activeSnapPoint}) wird ausgeblendet${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'hidden';
                if (process.env.NODE_ENV === 'development') {
                    console.log(`❌ LETTER-HIDE fertig: "${title.text}"`);
                }
            }
        });

        // Buchstaben ausblenden
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

    }, [title.text, activeSnapPoint, config]);

    // ===== SNAP-POINT ÄNDERUNGEN =====
    useEffect(() => {
        if (activeSnapPoint !== lastActiveSnapPointRef.current) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 TITEL Snap-Point-Wechsel: ${lastActiveSnapPointRef.current} → ${activeSnapPoint}${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
            }

            if (isActive && activeSnapPoint >= 1 && activeSnapPoint <= 3) {
                // Kurze Verzögerung für sanften Übergang
                setTimeout(animateIn, 100);
            } else {
                animateOut();
            }

            lastActiveSnapPointRef.current = activeSnapPoint;
        }
    }, [activeSnapPoint, isActive, animateIn, animateOut, isMobile]);

    // ===== INITIALISIERUNG =====
    useEffect(() => {
        if (titleRef.current && lettersRef.current.length > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 Initialisiere LETTER-REVEAL-Titel: "${title.text}" (Snap-Point ${activeSnapPoint})${isMobile ? ' [MOBILE]' : ' [DESKTOP]'}`);
            }

            // Buchstaben initial verstecken
            gsap.set(lettersRef.current, {
                opacity: 0,
                scale: config.startScale,
                filter: `blur(${config.startBlur}px)`
            });
            currentStateRef.current = 'hidden';
        }
    }, [title.text, activeSnapPoint, config, isMobile]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [title.text, activeSnapPoint]);

    // ===== STYLES =====
    const titleStyles = useMemo(() => ({
        position: 'absolute',
        top: title.position.top,
        left: title.position.left,
        transform: 'translate(-50%, -50%)',
        ...title.style,
        // Mobile-spezifische Anpassungen
        ...(isMobile && {
            fontSize: '1.8rem',
            letterSpacing: '0.5px'
        }),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        ...(isSnapping && {
            filter: 'brightness(1.1)',
        })
    }), [title.position, title.style, isSnapping, isMobile]);

    const letterStyles = useMemo(() => ({
        display: 'inline-block',
        opacity: 0,
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        marginRight: '1px'
    }), []);

    const cssClasses = useMemo(() => {
        const classes = [
            'enhanced-letter-reveal-title',
            `title-${title.index + 1}`,
            `snap-point-${activeSnapPoint}`
        ];

        if (isMobile) {
            classes.push('mobile-title');
        }

        if (isActive) {
            classes.push('active-title');
        }

        if (isSnapping) {
            classes.push('snapping');
        }

        return classes.join(' ');
    }, [title.index, isActive, isSnapping, activeSnapPoint, isMobile]);

    return (
        <div
            ref={titleRef}
            className={cssClasses}
            style={titleStyles}
            data-title-id={title.id}
            data-title-index={title.index}
            data-snap-point={activeSnapPoint}
            data-scroll-progress={scrollProgress.toFixed(3)}
            data-is-active={isActive}
            data-is-mobile={isMobile}
        >
            {letters.map((letter, index) => (
                <span
                    key={`${activeSnapPoint}-${title.text}-${index}-${isMobile ? 'mobile' : 'desktop'}`}
                    ref={el => {
                        if (el) {
                            lettersRef.current[index] = el;
                        }
                    }}
                    className={`letter letter-${index}`}
                    style={letterStyles}
                    data-letter={letter.char}
                    data-index={index}
                    data-snap-point={activeSnapPoint}
                    data-mobile={isMobile}
                >
                    {letter.char}
                </span>
            ))}
        </div>
    );
});

// ===== DEBUG PANELS (NUR DEVELOPMENT) =====

// Debug-Panel für Snap-Points ohne Titel
const NoTitleDebugPanel = React.memo(({
    activeSnapPoint,
    scrollProgress,
    isSnapping,
    shouldShowTitle
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '120px',
                left: '20px',
                background: 'rgba(128, 128, 128, 0.9)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                lineHeight: '1.4',
                border: '2px solid #888'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ddd' }}>
                🚫 KEIN TITEL - Snap-Point {activeSnapPoint}
            </div>
            <div>Scroll Progress: {(scrollProgress * 100).toFixed(1)}%</div>
            <div>Active Snap-Point: {activeSnapPoint}/5</div>
            <div>Should Show Title: {shouldShowTitle ? 'Yes' : 'No'}</div>
            <div>Snapping: {isSnapping ? '🔒' : '🔓'}</div>

            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.8 }}>
                📍 Titel nur bei Snap-Points 1, 2, 3
            </div>
        </div>
    );
});

// Debug-Panel für aktive Titel
const TitleDebugPanel = React.memo(({
    activeTitle,
    activeSnapPoint,
    scrollProgress,
    isSnapping,
    isMobile
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '120px',
                left: '20px',
                background: 'rgba(0, 150, 0, 0.9)',
                color: 'white',
                padding: '12px',
                fontSize: '11px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                lineHeight: '1.4',
                border: '2px solid #00ff00'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#00ff00' }}>
                🎭 TITEL AKTIV - Snap-Point {activeSnapPoint}
            </div>

            <div>Titel: "{activeTitle.text}"</div>
            <div>Titel-Index: {activeTitle.index}</div>
            <div>Scroll Progress: {(scrollProgress * 100).toFixed(1)}%</div>
            <div>Active Snap-Point: {activeSnapPoint}/5</div>
            <div>Device: {isMobile ? '📱 Mobile' : '🖥️ Desktop'}</div>
            <div>Snapping: {isSnapping ? '🔒' : '🔓'}</div>

            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.8 }}>
                ✅ Letter-Reveal Animation aktiv
            </div>
            <div style={{ fontSize: '9px', color: '#90EE90' }}>
                🎬 GSAP Timeline mit Stagger-Effekt
            </div>
        </div>
    );
});

// Display Names
EnhancedTitleLayer.displayName = 'EnhancedTitleLayer';
LetterRevealTitle.displayName = 'LetterRevealTitle';
NoTitleDebugPanel.displayName = 'NoTitleDebugPanel';
TitleDebugPanel.displayName = 'TitleDebugPanel';

export default EnhancedTitleLayer;