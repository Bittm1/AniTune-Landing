// Optimierte TitleLayer.jsx mit GSAP
import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
import './TitleLayer.css';

// Hauptkomponente als memo für bessere Performance
const TitleLayer = React.memo(({ scrollProgress, titles = [], activeSection }) => {
    if (!titles || titles.length === 0) return null;

    return (
        <ErrorBoundary>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 5,
                pointerEvents: 'none'
            }}>
                {titles.map((title, index) => (
                    <Title
                        key={title.id}
                        title={title}
                        isActive={activeSection === index + 1}
                        sectionIndex={index + 1}
                    />
                ))}
            </div>
        </ErrorBoundary>
    );
});

// Title-Komponente effizient gestaltet
const Title = React.memo(({ title, isActive, sectionIndex }) => {
    const titleRef = useRef(null);
    const animationTypeRef = useRef(title.animation?.type || 'fade-scale');
    const animationStateRef = useRef('inactive');

    // Animation-Funktion mit useCallback, um unnötige Neuberechnungen zu vermeiden
    const animateTitle = useCallback(() => {
        if (!titleRef.current) return;

        const element = titleRef.current;
        const animationType = animationTypeRef.current;

        // Animation nur durchführen, wenn sich der Status geändert hat
        if (isActive && animationStateRef.current !== 'active') {
            // Animation definieren basierend auf dem Typ
            let animationProps = {};

            if (animationType.includes('scale')) {
                animationProps = {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'power2.out'
                };

                // Zurücksetzen vor der Animation
                gsap.set(element, {
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(5px)'
                });
            } else if (animationType.includes('slide')) {
                animationProps = {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'power2.out'
                };

                // Zurücksetzen vor der Animation
                gsap.set(element, {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(5px)'
                });
            } else {
                animationProps = {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'power2.out'
                };

                // Zurücksetzen vor der Animation
                gsap.set(element, {
                    opacity: 0,
                    filter: 'blur(5px)'
                });
            }

            // Animation ausführen
            gsap.to(element, animationProps);
            animationStateRef.current = 'active';
        }
        else if (!isActive && animationStateRef.current !== 'inactive') {
            // Ausblende-Animation
            let animationProps = {};

            if (animationType.includes('scale')) {
                animationProps = {
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(5px)',
                    duration: 0.4,
                    ease: 'power2.in'
                };
            } else if (animationType.includes('slide')) {
                animationProps = {
                    opacity: 0,
                    y: -20,
                    filter: 'blur(5px)',
                    duration: 0.4,
                    ease: 'power2.in'
                };
            } else {
                animationProps = {
                    opacity: 0,
                    filter: 'blur(5px)',
                    duration: 0.4,
                    ease: 'power2.in'
                };
            }

            // Animation ausführen
            gsap.to(element, animationProps);
            animationStateRef.current = 'inactive';
        }
    }, [isActive]);

    // useEffect für die Animation
    useEffect(() => {
        animateTitle();
    }, [isActive, animateTitle]);

    // Style mit CSS-Variablen für bessere Performance
    return (
        <div
            ref={titleRef}
            className={`title-element gsap-title section-${sectionIndex} ${animationTypeRef.current}`}
            style={{
                position: 'absolute',
                top: title.position.top,
                left: title.position.left,
                opacity: 0, // Start unsichtbar
                transform: 'translate(-50%, -50%)',
                ...title.style,
            }}
        >
            {title.text}
        </div>
    );
});

export default TitleLayer;