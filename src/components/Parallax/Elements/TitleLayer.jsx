import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
import './TitleLayer.css';

// NEU: Lock-Snap TitleLayer - zeigt nur einen Titel zur Zeit
const TitleLayer = React.memo(({ scrollProgress, titles = [], currentTitleIndex = -1, isScrollLocked = false }) => {
    if (!titles || titles.length === 0) return null;

    // ✅ SPECIAL CASE: currentTitleIndex = -1 bedeutet Logo+Newsletter Phase
    if (currentTitleIndex === -1) {
        return null; // Kein Titel sichtbar, nur Logo+Newsletter
    }

    // Aktueller Titel basierend auf Index
    const currentTitle = titles[currentTitleIndex];
    if (!currentTitle) return null;

    return (
        <ErrorBoundary>
            <div
                className="title-layer-container"
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
                {/* Zeige nur den aktuellen Titel */}
                <SingleTitle
                    title={currentTitle}
                    isActive={true}
                    isScrollLocked={isScrollLocked}
                />

                {/* Debug-Info (nur in Development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '60px',
                            left: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '8px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            pointerEvents: 'all'
                        }}
                    >
                        <div>Aktueller Titel: {currentTitleIndex + 1}/6</div>
                        <div>"{currentTitle.text}"</div>
                        <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

// Einzelner Titel mit Ein-/Ausblende-Animation
const SingleTitle = React.memo(({ title, isActive, isScrollLocked }) => {
    const titleRef = useRef(null);
    const animationRef = useRef(null);
    const currentStateRef = useRef('hidden'); // 'hidden', 'visible', 'animating'

    // Animation für Einblenden
    const animateIn = useCallback(() => {
        if (!titleRef.current || currentStateRef.current === 'visible') return;

        const element = titleRef.current;
        const animation = title.animation || {};

        console.log(`🎬 Titel "${title.text}" wird eingeblendet`);

        // Kill existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        currentStateRef.current = 'animating';

        // Animation-Parameter
        let animationProps = {
            opacity: 1,
            duration: animation.duration || 0.8,
            ease: animation.ease || 'power2.out',
            delay: animation.delay || 0,
            force3D: true,
            onComplete: () => {
                currentStateRef.current = 'visible';
            }
        };

        // Setze Startwerte und Animation basierend auf Typ
        switch (animation.type) {
            case 'fadeScale':
                gsap.set(element, { opacity: 0, scale: 0.8, filter: 'blur(8px)' });
                animationProps.scale = 1;
                animationProps.filter = 'blur(0px)';
                break;

            case 'slideUp':
                gsap.set(element, { opacity: 0, y: 40, filter: 'blur(5px)' });
                animationProps.y = 0;
                animationProps.filter = 'blur(0px)';
                break;

            case 'slideDown':
                gsap.set(element, { opacity: 0, y: -40, filter: 'blur(5px)' });
                animationProps.y = 0;
                animationProps.filter = 'blur(0px)';
                break;

            case 'popIn':
                gsap.set(element, { opacity: 0, scale: 0.3, filter: 'blur(10px)' });
                animationProps.scale = 1;
                animationProps.filter = 'blur(0px)';
                animationProps.ease = 'back.out(1.7)';
                break;

            case 'fade':
            default:
                gsap.set(element, { opacity: 0, filter: 'blur(8px)' });
                animationProps.filter = 'blur(0px)';
                break;
        }

        // Starte Animation
        animationRef.current = gsap.to(element, animationProps);

    }, [title.animation, title.text]);

    // Animation für Ausblenden
    const animateOut = useCallback(() => {
        if (!titleRef.current || currentStateRef.current === 'hidden') return;

        const element = titleRef.current;
        const animation = title.animation || {};

        console.log(`🎬 Titel "${title.text}" wird ausgeblendet`);

        // Kill existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        currentStateRef.current = 'animating';

        // Ausblende-Animation (schneller)
        const outDuration = (animation.duration || 0.8) * 0.6;

        let animationProps = {
            opacity: 0,
            duration: outDuration,
            ease: 'power2.in',
            force3D: true,
            onComplete: () => {
                currentStateRef.current = 'hidden';
            }
        };

        // Ausblende-Effekte basierend auf Typ
        switch (animation.type) {
            case 'fadeScale':
                animationProps.scale = 0.7;
                animationProps.filter = 'blur(10px)';
                break;

            case 'slideUp':
                animationProps.y = -30;
                animationProps.filter = 'blur(8px)';
                break;

            case 'slideDown':
                animationProps.y = 30;
                animationProps.filter = 'blur(8px)';
                break;

            case 'popIn':
                animationProps.scale = 0.3;
                animationProps.filter = 'blur(12px)';
                break;

            case 'fade':
            default:
                animationProps.filter = 'blur(10px)';
                break;
        }

        // Starte Ausblende-Animation
        animationRef.current = gsap.to(element, animationProps);

    }, [title.animation, title.text]);

    // Reagiere auf isActive-Änderungen
    useEffect(() => {
        if (isActive && currentStateRef.current === 'hidden') {
            // Titel soll eingeblendet werden
            setTimeout(animateIn, 100); // Kurze Verzögerung für sanfteren Übergang
        } else if (!isActive && currentStateRef.current === 'visible') {
            // Titel soll ausgeblendet werden
            animateOut();
        }
    }, [isActive, animateIn, animateOut]);

    // Initialisierung: Setze Titel initial auf unsichtbar
    useEffect(() => {
        if (titleRef.current && currentStateRef.current === 'hidden') {
            gsap.set(titleRef.current, {
                opacity: 0,
                scale: 0.8,
                x: 0,
                y: 0,
                filter: 'blur(8px)'
            });
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    // Memoized styles
    const titleStyles = useMemo(() => ({
        position: 'absolute',
        top: title.position.top,
        left: title.position.left,
        opacity: 0, // Startet unsichtbar
        transform: 'translate(-50%, -50%)',
        ...title.style,
        // Performance-Optimierungen
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        // Lock-Feedback (optional)
        ...(isScrollLocked && {
            filter: 'brightness(1.1)', // Leichtes Highlight während Lock
        })
    }), [title.position, title.style, isScrollLocked]);

    // CSS-Klassen
    const cssClasses = useMemo(() => {
        const classes = [
            'title-element',
            'lock-snap-title',
            `title-${title.index + 1}`,
            `animation-${title.animation?.type || 'fadeScale'}`
        ];

        if (isActive) {
            classes.push('active-title');
        }

        if (isScrollLocked) {
            classes.push('scroll-locked');
        }

        return classes.join(' ');
    }, [title.index, title.animation?.type, isActive, isScrollLocked]);

    return (
        <div
            ref={titleRef}
            className={cssClasses}
            style={titleStyles}
            data-title-id={title.id}
            data-title-index={title.index}
            data-animation-type={title.animation?.type}
            data-is-active={isActive}
            data-scroll-locked={isScrollLocked}
        >
            {title.text}
        </div>
    );
});

// Display names für besseres Debugging
TitleLayer.displayName = 'LockSnapTitleLayer';
SingleTitle.displayName = 'SingleTitle';

export default TitleLayer;