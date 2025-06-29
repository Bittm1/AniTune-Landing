// src/components/Enhanced/TitleLayer.jsx - MIT ANIMATION-CALLBACKS
// 🎭 TITEL SYSTEM + Lock-System Integration
// ✅ Sendet Animation-Status für erweiterte Lock-Logik

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

const EnhancedTitleLayer = React.forwardRef(({
    activeSnapPoint = 0,
    scrollProgress = 0,
    isSnapping = false,
    onTitleAnimationChange // ✅ Callback für Animation-Status
}, ref) => {
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

    // ===== REF FOR SKIP FUNCTION =====
    const currentTitleRef = useRef(null);

    // ===== EXPOSE SKIP FUNCTION VIA REF =====
    React.useImperativeHandle(ref, () => ({
        handleSkipAnimation: () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏭️ TITEL SKIP: Animation abbrechen`);
            }

            // Animation sofort beenden
            if (currentTitleRef.current && currentTitleRef.current.skipAnimation) {
                currentTitleRef.current.skipAnimation();
            }

            // Callback senden dass Animation fertig ist
            if (onTitleAnimationChange) {
                onTitleAnimationChange(false, null);
            }
        }
    }), [onTitleAnimationChange]);

    // ===== RESIZE HANDLER =====
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ===== SNAP-POINT ÜBERWACHUNG AUF LAYER-EBENE =====
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 TITLE LAYER: Snap ${activeSnapPoint}, shouldShow: ${shouldShowTitle}, activeTitle: ${activeTitle?.text || 'None'}`);
        }

        // ✅ Animation-Status bei Zone-Wechseln managen
        if (!shouldShowTitle && onTitleAnimationChange) {
            // Verlasse Audio-Zone komplett
            onTitleAnimationChange(false, null);
            if (process.env.NODE_ENV === 'development') {
                console.log(`🚪 TITLE LAYER: Verlasse Audio-Zone bei Snap ${activeSnapPoint}`);
            }
        }
    }, [shouldShowTitle, activeSnapPoint, activeTitle, onTitleAnimationChange]);

    if (!shouldShowTitle || !activeTitle) {
        return null;
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
                {/* ===== LETTER REVEAL TITEL MIT CALLBACKS + REF ===== */}
                <LetterRevealTitle
                    ref={currentTitleRef}
                    title={activeTitle}
                    isActive={true}
                    isSnapping={isSnapping}
                    activeSnapPoint={activeSnapPoint}
                    scrollProgress={scrollProgress}
                    isMobile={isMobile}
                    onAnimationChange={onTitleAnimationChange}
                />
            </div>
        </ErrorBoundary>
    );
});

// ===== LETTER REVEAL TITEL KOMPONENTE MIT CALLBACKS + REF =====
const LetterRevealTitle = React.forwardRef(({
    title,
    isActive,
    isSnapping,
    activeSnapPoint,
    scrollProgress,
    isMobile = false,
    onAnimationChange // ✅ Callback für Animation-Status
}, ref) => {
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

    // ===== SKIP FUNCTION =====
    const skipAnimation = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`⏭️ LETTER-REVEAL SKIP: "${title.text}"`);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        // Sofort alle Buchstaben einblenden
        if (lettersRef.current.length > 0) {
            gsap.set(lettersRef.current, {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)'
            });
        }

        currentStateRef.current = 'visible';

        // Callback dass Animation fertig ist
        if (onAnimationChange) {
            onAnimationChange(false, activeSnapPoint);
        }
    }, [title.text, activeSnapPoint, onAnimationChange]);

    // ===== EXPOSE SKIP FUNCTION VIA REF =====
    React.useImperativeHandle(ref, () => ({
        skipAnimation
    }), [skipAnimation]);

    // ===== ANIMATION FUNKTIONEN MIT CALLBACKS =====
    const animateIn = useCallback((sendStartCallback = true) => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 LETTER-REVEAL START: "${title.text}" (Snap-Point ${activeSnapPoint}) - sendCallback: ${sendStartCallback}`);
        }

        // ✅ CALLBACK: Animation startet (nur wenn gewünscht)
        if (sendStartCallback && onAnimationChange) {
            onAnimationChange(true, activeSnapPoint);
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎭 ANIMATION-START-CALLBACK GESENDET: onAnimationChange(true, ${activeSnapPoint})`);
            }
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'visible';

                // ✅ CALLBACK: Animation fertig (immer senden)
                if (onAnimationChange) {
                    onAnimationChange(false, activeSnapPoint);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`✅ ANIMATION-ENDE-CALLBACK GESENDET: onAnimationChange(false, ${activeSnapPoint})`);
                    }
                }

                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ LETTER-REVEAL FERTIG: "${title.text}" (Snap-Point ${activeSnapPoint})`);
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

    }, [title.text, activeSnapPoint, config, isMobile, onAnimationChange]);

    const animateOut = useCallback((isSnapPointChange = false) => {
        if (!titleRef.current) return;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎭 LETTER-HIDE: "${title.text}" (Snap-Point ${activeSnapPoint}) - SnapChange: ${isSnapPointChange}`);
        }

        // ✅ Nur bei echtem Verlassen der Audio-Zone Callback senden
        if (!isSnapPointChange && onAnimationChange) {
            onAnimationChange(true, activeSnapPoint);
        }

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        currentStateRef.current = 'animating';

        const tl = gsap.timeline({
            onComplete: () => {
                currentStateRef.current = 'hidden';

                // ✅ Nur bei echtem Verlassen Callback senden
                if (!isSnapPointChange && onAnimationChange) {
                    onAnimationChange(false, null);
                }

                if (process.env.NODE_ENV === 'development') {
                    console.log(`❌ LETTER-HIDE FERTIG: "${title.text}" - SnapChange: ${isSnapPointChange}`);
                }
            }
        });

        // Buchstaben ausblenden
        tl.to(lettersRef.current, {
            opacity: 0,
            scale: config.startScale * 0.9,
            filter: `blur(${config.startBlur * 1.5}px)`,
            duration: config.duration * 0.5, // ✅ Schneller für Snap-Wechsel
            ease: 'power2.in',
            stagger: config.stagger * 0.3, // ✅ Weniger Stagger
            force3D: true
        });

        timelineRef.current = tl;

    }, [title.text, activeSnapPoint, config, onAnimationChange]);

    // ===== SNAP-POINT ÄNDERUNGEN (KOMPLETT NEU - SAUBERE CALLBACKS) =====
    useEffect(() => {
        if (activeSnapPoint !== lastActiveSnapPointRef.current) {
            const oldSnap = lastActiveSnapPointRef.current;
            const newSnap = activeSnapPoint;

            if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 TITEL Snap-Point-Wechsel: ${oldSnap} → ${newSnap}`);
            }

            // ✅ IMMER zuerst Timeline stoppen und Animation als "beendet" melden
            if (timelineRef.current) {
                timelineRef.current.kill();
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🛑 GESTOPPTE TIMELINE für Snap-Wechsel ${oldSnap} → ${newSnap}`);
                }
            }

            // ✅ Bei Wechsel INNERHALB Audio-Zone (1-3): Sofort neue Animation starten
            if (newSnap >= 1 && newSnap <= 3) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🎭 NEUE ANIMATION für Snap ${newSnap}: "${title.text}"`);
                }

                // ✅ CALLBACK: Neue Animation startet SOFORT
                if (onAnimationChange) {
                    onAnimationChange(true, newSnap);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`📢 ANIMATION-START-CALLBACK: onAnimationChange(true, ${newSnap})`);
                    }
                }

                // Animation sofort starten (ohne doppelten Start-Callback)
                setTimeout(() => {
                    animateIn(false); // ✅ sendStartCallback = false
                }, 50); // Nur kurze Verzögerung für DOM-Update

            } else {
                // ✅ Verlassen der Audio-Zone: Animation beenden
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🚪 VERLASSE AUDIO-ZONE: Snap ${newSnap}`);
                }

                if (onAnimationChange) {
                    onAnimationChange(false, null);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`📢 ANIMATION-ENDE-CALLBACK: onAnimationChange(false, null)`);
                    }
                }

                animateOut(false);
            }

            lastActiveSnapPointRef.current = newSnap;
        }
    }, [activeSnapPoint, animateIn, animateOut, onAnimationChange, title.text]);

    // ===== INITIALISIERUNG (FIX FÜR ERSTE ANIMATION) =====
    useEffect(() => {
        if (titleRef.current && lettersRef.current.length > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔧 Initialisiere LETTER-REVEAL-Titel: "${title.text}" (Snap-Point ${activeSnapPoint})`);
            }

            // Buchstaben initial verstecken
            gsap.set(lettersRef.current, {
                opacity: 0,
                scale: config.startScale,
                filter: `blur(${config.startBlur}px)`
            });
            currentStateRef.current = 'hidden';

            // ✅ Erste Animation direkt starten wenn wir in Audio-Zone sind
            if (activeSnapPoint >= 1 && activeSnapPoint <= 3) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🎬 ERSTE ANIMATION starten für Snap ${activeSnapPoint}`);
                }

                // Start-Callback senden
                if (onAnimationChange) {
                    onAnimationChange(true, activeSnapPoint);
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`📢 ERSTE ANIMATION-START-CALLBACK: onAnimationChange(true, ${activeSnapPoint})`);
                    }
                }

                // Animation starten (ohne zusätzlichen Start-Callback)
                setTimeout(() => {
                    animateIn(false);
                }, 100);
            }
        }
    }, [title.text, activeSnapPoint, config, onAnimationChange, animateIn]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }

            // ✅ Cleanup: Animation beendet
            if (onAnimationChange) {
                onAnimationChange(false, null);
            }
        };
    }, [title.text, activeSnapPoint, onAnimationChange]);

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

// Display Names
EnhancedTitleLayer.displayName = 'EnhancedTitleLayer';
LetterRevealTitle.displayName = 'LetterRevealTitle';

export default EnhancedTitleLayer;