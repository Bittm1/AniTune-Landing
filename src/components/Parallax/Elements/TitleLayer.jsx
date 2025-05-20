// src/components/Parallax/Elements/TitleLayer.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ErrorBoundary from '../../ErrorBoundary';
import './TitleLayer.css';

const TitleLayer = ({ scrollProgress, titles = [], activeSection }) => {
    if (!titles || titles.length === 0) return null;

    return (
        <ErrorBoundary>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
                {titles.map((title, index) => (
                    <Title
                        key={title.id}
                        title={title}
                        isActive={activeSection === index + 1} // Jeder Titel erscheint in einem anderen Abschnitt
                        sectionIndex={index + 1}
                    />
                ))}
            </div>
        </ErrorBoundary>
    );
};

const Title = ({ title, isActive, sectionIndex }) => {
    const titleRef = useRef(null);
    const animationTypeRef = useRef(title.animation?.type || 'fade-scale');

    // GSAP Animation für die Titel
    useEffect(() => {
        if (!titleRef.current) return;

        const animationType = animationTypeRef.current;

        // Animation basierend auf dem aktiven Status
        if (isActive) {
            // Einblende-Animation
            if (animationType.includes('scale')) {
                gsap.fromTo(titleRef.current,
                    {
                        opacity: 0,
                        scale: 0.8,
                        filter: 'blur(5px)'
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );
            } else if (animationType.includes('slide')) {
                gsap.fromTo(titleRef.current,
                    {
                        opacity: 0,
                        y: 20,
                        filter: 'blur(5px)'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );
            } else {
                gsap.fromTo(titleRef.current,
                    {
                        opacity: 0,
                        filter: 'blur(5px)'
                    },
                    {
                        opacity: 1,
                        filter: 'blur(0px)',
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );
            }
        } else {
            // Ausblende-Animation
            if (titleRef.current.style.opacity !== '0') {
                if (animationType.includes('scale')) {
                    gsap.to(titleRef.current, {
                        opacity: 0,
                        scale: 0.8,
                        filter: 'blur(5px)',
                        duration: 0.4,
                        ease: 'power2.in'
                    });
                } else if (animationType.includes('slide')) {
                    gsap.to(titleRef.current, {
                        opacity: 0,
                        y: -20,
                        filter: 'blur(5px)',
                        duration: 0.4,
                        ease: 'power2.in'
                    });
                } else {
                    gsap.to(titleRef.current, {
                        opacity: 0,
                        filter: 'blur(5px)',
                        duration: 0.4,
                        ease: 'power2.in'
                    });
                }
            }
        }
    }, [isActive]);

    // Transformations-Styles für den Titel
    const getTransformStyle = () => {
        const baseTransform = 'translate(-50%, -50%)';

        if (!isActive) {
            if (animationTypeRef.current.includes('scale')) {
                return `${baseTransform} scale(0.8)`;
            } else if (animationTypeRef.current.includes('slide')) {
                return `${baseTransform} translateY(20px)`;
            }
        }

        return baseTransform;
    };

    return (
        <div
            ref={titleRef}
            className={`title-element gsap-title section-${sectionIndex} ${animationTypeRef.current}`}
            style={{
                position: 'absolute',
                top: title.position.top,
                left: title.position.left,
                opacity: 0, // Start unsichtbar, GSAP wird es animieren
                transform: getTransformStyle(),
                ...title.style,
            }}
        >
            {title.text}
        </div>
    );
};

export default TitleLayer;