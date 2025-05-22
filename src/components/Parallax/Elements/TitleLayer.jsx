// src/components/Parallax/Elements/TitleLayer.jsx
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
import './TitleLayer.css';

// Hauptkomponente als memo für bessere Performance
const TitleLayer = React.memo(({ scrollProgress, titles = [], activeSection }) => {
    if (!titles || titles.length === 0) return null;

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
                    zIndex: 20, // zIndices.titles
                    pointerEvents: 'none'
                }}
            >
                {titles.map((title, index) => (
                    <Title
                        key={title.id}
                        title={title}
                        activeSection={activeSection}
                        titleSection={title.section || index + 1}
                    />
                ))}
            </div>
        </ErrorBoundary>
    );
});

// Event-basierte Title-Komponente mit stabiler Logik
const Title = React.memo(({ title, activeSection, titleSection }) => {
    const titleRef = useRef(null);
    const animationRef = useRef(null);
    const isAnimatingRef = useRef(false);
    const currentStateRef = useRef('hidden'); // 'hidden', 'visible', 'animating'

    // Stabile Referenz für activeSection ohne Endlos-Updates
    const stableActiveSectionRef = useRef(activeSection);

    // Nur bei tatsächlicher Änderung von activeSection updaten
    useEffect(() => {
        stableActiveSectionRef.current = activeSection;
    }, [activeSection]);

    // Bestimme den gewünschten Zustand basierend auf activeSection
    const shouldBeVisible = activeSection === titleSection;

    // Animation-Funktion für Einblenden
    const animateIn = useCallback(() => {
        if (!titleRef.current || isAnimatingRef.current || currentStateRef.current === 'visible') return;

        const element = titleRef.current;
        const animation = title.animation || {};

        // Debug-Log
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎬 Titel "${title.text}" wird eingeblendet (Sektion ${titleSection})`);
        }

        // Kill existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        isAnimatingRef.current = true;
        currentStateRef.current = 'animating';

        // Bestimme Animation-Parameter basierend auf Typ
        let animationProps = {
            opacity: 1,
            duration: animation.duration || 0.6,
            ease: animation.ease || 'power2.out',
            delay: animation.delay || 0,
            force3D: true,
            onComplete: () => {
                isAnimatingRef.current = false;
                currentStateRef.current = 'visible';
            }
        };

        // Setze Startwerte und Zielwerte basierend auf Animation-Typ
        switch (animation.type) {
            case 'fadeScale':
                gsap.set(element, { opacity: 0, scale: 0.8, filter: 'blur(5px)' });
                animationProps.scale = 1;
                animationProps.filter = 'blur(0px)';
                break;

            case 'slideUp':
                gsap.set(element, { opacity: 0, y: 30, filter: 'blur(3px)' });
                animationProps.y = 0;
                animationProps.filter = 'blur(0px)';
                break;

            case 'slideDown':
                gsap.set(element, { opacity: 0, y: -30, filter: 'blur(3px)' });
                animationProps.y = 0;
                animationProps.filter = 'blur(0px)';
                break;

            case 'slideLeft':
                gsap.set(element, { opacity: 0, x: 50, filter: 'blur(3px)' });
                animationProps.x = 0;
                animationProps.filter = 'blur(0px)';
                break;

            case 'slideRight':
                gsap.set(element, { opacity: 0, x: -50, filter: 'blur(3px)' });
                animationProps.x = 0;
                animationProps.filter = 'blur(0px)';
                break;

            case 'popIn':
                gsap.set(element, { opacity: 0, scale: 0.5, filter: 'blur(8px)' });
                animationProps.scale = 1;
                animationProps.filter = 'blur(0px)';
                animationProps.ease = animation.ease || 'back.out(1.7)';
                break;

            case 'fade':
            default:
                gsap.set(element, { opacity: 0, filter: 'blur(5px)' });
                animationProps.filter = 'blur(0px)';
                break;
        }

        // Starte Animation
        animationRef.current = gsap.to(element, animationProps);

    }, [title.animation, title.text, titleSection]);

    // Animation-Funktion für Ausblenden
    const animateOut = useCallback(() => {
        if (!titleRef.current || isAnimatingRef.current || currentStateRef.current === 'hidden') return;

        const element = titleRef.current;
        const animation = title.animation || {};

        // Debug-Log
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎬 Titel "${title.text}" wird ausgeblendet (Sektion ${titleSection})`);
        }

        // Kill existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        isAnimatingRef.current = true;
        currentStateRef.current = 'animating';

        // Ausblende-Animation (meist schneller)
        const outDuration = animation.outDuration || (animation.duration || 0.6) * 0.7;
        const outEase = animation.outEase || 'power2.in';

        let animationProps = {
            opacity: 0,
            duration: outDuration,
            ease: outEase,
            force3D: true,
            onComplete: () => {
                isAnimatingRef.current = false;
                currentStateRef.current = 'hidden';
            }
        };

        // Setze Ausblendeeffekte basierend auf Animation-Typ
        switch (animation.type) {
            case 'fadeScale':
                animationProps.scale = 0.8;
                animationProps.filter = 'blur(5px)';
                break;

            case 'slideUp':
                animationProps.y = -20;
                animationProps.filter = 'blur(3px)';
                break;

            case 'slideDown':
                animationProps.y = 20;
                animationProps.filter = 'blur(3px)';
                break;

            case 'slideLeft':
                animationProps.x = -30;
                animationProps.filter = 'blur(3px)';
                break;

            case 'slideRight':
                animationProps.x = 30;
                animationProps.filter = 'blur(3px)';
                break;

            case 'popIn':
                animationProps.scale = 0.5;
                animationProps.filter = 'blur(8px)';
                break;

            case 'fade':
            default:
                animationProps.filter = 'blur(5px)';
                break;
        }

        // Starte Ausblende-Animation
        animationRef.current = gsap.to(element, animationProps);

    }, [title.animation, title.text, titleSection]);

    // Hauptlogik: Bestimme ob Animation gestartet werden soll
    useEffect(() => {
        // Verhindere Animation während einer laufenden Animation
        if (isAnimatingRef.current) return;

        if (shouldBeVisible && currentStateRef.current === 'hidden') {
            // Titel soll sichtbar werden und ist aktuell versteckt
            animateIn();
        } else if (!shouldBeVisible && currentStateRef.current === 'visible') {
            // Titel soll versteckt werden und ist aktuell sichtbar
            animateOut();
        }
    }, [shouldBeVisible, animateIn, animateOut]);

    // Initialisierung: Setze alle Titel initial auf unsichtbar
    useEffect(() => {
        if (titleRef.current && currentStateRef.current === 'hidden') {
            gsap.set(titleRef.current, {
                opacity: 0,
                scale: 0.8,
                x: 0,
                y: 0,
                filter: 'blur(5px)'
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

    // Memoized inline styles
    const titleStyles = useMemo(() => ({
        position: 'absolute',
        top: title.position.top,
        left: title.position.left,
        // Startwerte (unsichtbar)
        opacity: 0,
        transform: 'translate(-50%, -50%)',
        // User-definierte Styles
        ...title.style,
        // Performance-Optimierungen
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        perspective: 1000,
    }), [title.position, title.style]);

    // CSS-Klassen basierend auf Animation und Zustand
    const cssClasses = useMemo(() => {
        const classes = [
            'title-element',
            'stable-animated-title',
            `section-${titleSection}`,
            `animation-${title.animation?.type || 'fadeScale'}`
        ];

        if (shouldBeVisible) {
            classes.push('target-visible');
        }

        if (currentStateRef.current === 'visible') {
            classes.push('currently-visible');
        }

        return classes.join(' ');
    }, [titleSection, title.animation?.type, shouldBeVisible]);

    return (
        <div
            ref={titleRef}
            className={cssClasses}
            style={titleStyles}
            data-title-id={title.id}
            data-section={titleSection}
            data-animation-type={title.animation?.type}
            data-current-state={currentStateRef.current}
        >
            {title.text}
        </div>
    );
});

// Display names für besseres Debugging
TitleLayer.displayName = 'TitleLayer';
Title.displayName = 'Title';

export default TitleLayer;