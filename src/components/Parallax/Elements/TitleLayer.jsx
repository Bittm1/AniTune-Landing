import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
// ✅ NEUE IMPORT: Timing-Config
import { getAnimationTiming, getDeviceOptimizedTiming } from '../config/timingConfig';
import './TitleLayer.css';

const TitleLayer = React.memo(({ scrollProgress, titles = [], currentTitleIndex = -1, isScrollLocked = false }) => {
    if (!titles || titles.length === 0) return null;

    if (currentTitleIndex === -1) {
        return null; // Logo+Newsletter Phase
    }

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
                <SingleTitle
                    title={currentTitle}
                    isActive={true}
                    isScrollLocked={isScrollLocked}
                />

                {/* Debug-Info mit Timing-Details */}
                {process.env.NODE_ENV === 'development' && (
                    <TimingDebugPanel
                        currentTitleIndex={currentTitleIndex}
                        currentTitle={currentTitle}
                        isScrollLocked={isScrollLocked}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
});

// ✅ DEBUG-PANEL MIT TIMING-INFO
const TimingDebugPanel = React.memo(({ currentTitleIndex, currentTitle, isScrollLocked }) => {
    const timingConfig = getDeviceOptimizedTiming();
    const animationTiming = getAnimationTiming(currentTitle.animation?.type || 'fadeScale');

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
                🎬 Titel-Debug ({timingConfig.name})
            </div>
            <div>Titel: {currentTitleIndex + 1}/6 - "{currentTitle.text}"</div>
            <div>Animation: {currentTitle.animation?.type || 'fadeScale'}</div>
            <div>Duration: {animationTiming.duration}s</div>
            <div>Delay: {animationTiming.delay}s</div>
            <div>Out Duration: {animationTiming.outDuration}s</div>
            <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
        </div>
    );
});

// Einzelner Titel mit Config-basierter Animation
const SingleTitle = React.memo(({ title, isActive, isScrollLocked }) => {
    const titleRef = useRef(null);
    const animationRef = useRef(null);
    const currentStateRef = useRef('hidden');

    // ✅ TIMING AUS CONFIG LADEN
    const animationTiming = useMemo(() => {
        return getAnimationTiming(title.animation?.type || 'fadeScale');
    }, [title.animation?.type]);

    // Animation für Einblenden - MIT CONFIG-TIMING
    const animateIn = useCallback(() => {
        if (!titleRef.current || currentStateRef.current === 'visible') return;

        const element = titleRef.current;
        const animation = title.animation || {};

        console.log(`🎬 Titel "${title.text}" wird eingeblendet (${animation.type || 'fadeScale'})`);

        if (animationRef.current) {
            animationRef.current.kill();
        }

        currentStateRef.current = 'animating';

        // ✅ VERWENDE CONFIG-WERTE STATT HART-KODIERTE
        let animationProps = {
            opacity: 1,
            duration: animationTiming.duration,        // ← Aus timingConfig.js
            ease: animation.ease || 'power2.out',
            delay: animationTiming.delay,              // ← Aus timingConfig.js
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

        animationRef.current = gsap.to(element, animationProps);

    }, [title.animation, title.text, animationTiming]);

    // Animation für Ausblenden - MIT CONFIG-TIMING
    const animateOut = useCallback(() => {
        if (!titleRef.current || currentStateRef.current === 'hidden') return;

        const element = titleRef.current;
        const animation = title.animation || {};

        console.log(`🎬 Titel "${title.text}" wird ausgeblendet`);

        if (animationRef.current) {
            animationRef.current.kill();
        }

        currentStateRef.current = 'animating';

        // ✅ AUSBLENDE-DAUER AUS CONFIG
        let animationProps = {
            opacity: 0,
            duration: animationTiming.outDuration,     // ← Aus timingConfig.js
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

        animationRef.current = gsap.to(element, animationProps);

    }, [title.animation, title.text, animationTiming]);

    // Reagiere auf isActive-Änderungen
    useEffect(() => {
        if (isActive && currentStateRef.current === 'hidden') {
            setTimeout(animateIn, 100);
        } else if (!isActive && currentStateRef.current === 'visible') {
            animateOut();
        }
    }, [isActive, animateIn, animateOut]);

    // Initialisierung
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

    // Cleanup
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
        opacity: 0,
        transform: 'translate(-50%, -50%)',
        ...title.style,
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        ...(isScrollLocked && {
            filter: 'brightness(1.1)',
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
            data-timing-duration={animationTiming.duration}
            data-timing-delay={animationTiming.delay}
        >
            {title.text}
        </div>
    );
});

TitleLayer.displayName = 'LockSnapTitleLayer';
SingleTitle.displayName = 'SingleTitle';
TimingDebugPanel.displayName = 'TimingDebugPanel';

export default TitleLayer;