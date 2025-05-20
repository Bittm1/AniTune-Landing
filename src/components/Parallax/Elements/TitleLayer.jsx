// src/components/Parallax/Elements/TitleLayer.jsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import './TitleLayer.css';

const TitleLayer = ({ scrollProgress, titles = [] }) => {
    if (!titles || titles.length === 0) return null;

    // Stelle sicher, dass scrollProgress ein gültiger Wert ist
    const safeScrollProgress = typeof scrollProgress === 'number' && !isNaN(scrollProgress)
        ? scrollProgress
        : 0;

    return (
        <ErrorBoundary>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
                {titles.map((title) => (
                    <Title
                        key={title.id}
                        title={title}
                        scrollProgress={safeScrollProgress}
                    />
                ))}
            </div>
        </ErrorBoundary>
    );
};

const Title = ({ title, scrollProgress }) => {
    const [animationState, setAnimationState] = useState('hidden');
    const [prevScrollProgress, setPrevScrollProgress] = useState(scrollProgress);

    useEffect(() => {
        const { scrollStart, scrollEnd, animation } = title;
        const inDuration = animation?.inDuration || 0.2;
        const outDuration = animation?.outDuration || 0.2;

        // Berechne die prozentualen Grenzen für Ein- und Ausblenden
        const fadeInStart = scrollStart;
        const fadeInEnd = scrollStart + inDuration;
        const fadeOutStart = scrollEnd - outDuration;
        const fadeOutEnd = scrollEnd;

        let newState = 'hidden';

        if (scrollProgress >= fadeInStart && scrollProgress <= fadeOutEnd) {
            if (scrollProgress >= fadeInStart && scrollProgress < fadeInEnd) {
                newState = 'title-fade-in';
            } else if (scrollProgress >= fadeInEnd && scrollProgress <= fadeOutStart) {
                newState = 'visible';
            } else if (scrollProgress > fadeOutStart && scrollProgress <= fadeOutEnd) {
                newState = 'title-fade-out';
            }
        }

        setAnimationState(newState);
        setPrevScrollProgress(scrollProgress);
    }, [title, scrollProgress]);

    // Wenn versteckt, nicht rendern
    if (animationState === 'hidden') return null;

    // Klassenname für die Animation basierend auf dem Typ
    const animationClass = title.animation?.type || 'fade';

    return (
        <div
            className={`title-element ${animationState} ${animationClass}`}
            style={{
                position: 'absolute',
                top: title.position.top,
                left: title.position.left,
                ...title.style
            }}
        >
            {title.text}
        </div>
    );
};

export default TitleLayer;