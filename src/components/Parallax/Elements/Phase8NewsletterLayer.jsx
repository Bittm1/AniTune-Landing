// src/components/Parallax/Elements/Phase8NewsletterLayer.jsx
import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import Newsletter from '../../Newsletter/Newsletter';
import { getPositionFromSegments } from '../utils/animationUtils';

const Phase8NewsletterLayer = ({
    scrollProgress,
    currentTitleIndex,
    isScrollLocked,
    hasSubscribed,
    onSubscriptionChange
}) => {
    // ✅ PROFESSIONELL: Segment-Definition wie Carousel, aber zur Mitte
    const newsletterSegment = useMemo(() => [{
        scrollStart: 1.60,    // Phase 8 startet nach Carousel
        scrollEnd: 2.00,      // Phase 8 endet bei 200%  
        posStart: 100,        // Startet 100vh unten
        posEnd: -50,          // ✅ GEÄNDERT: Endet in der Mitte (-50vh = Index 6)
        opacityStart: 0.2,    // Startet wenig sichtbar
        opacityEnd: 1.0       // Endet voll sichtbar
    }], []);

    // ✅ PROFESSIONELL: Scroll-basierte Position wie andere Layer
    const verticalPosition = getPositionFromSegments(newsletterSegment, scrollProgress, 'posStart', 'posEnd');
    const opacity = getPositionFromSegments(newsletterSegment, scrollProgress, 'opacityStart', 'opacityEnd');

    // ✅ Animation Progress für Newsletter-Sichtbarkeit (0-1 innerhalb Phase 8)
    const phase8Progress = scrollProgress >= 1.60 && scrollProgress <= 2.00
        ? (scrollProgress - 1.60) / 0.4  // 0-1 innerhalb der Phase 8
        : scrollProgress > 2.00 ? 1 : 0; // 1 wenn darüber, 0 wenn darunter

    // ✅ VEREINFACHT: Container Style wie Carousel
    const containerStyle = {
        transform: `translateY(${verticalPosition}vh)`,
        opacity: Math.max(0, Math.min(1, opacity)),
        transition: isScrollLocked ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
    };

    // Nur anzeigen wenn in Phase 8 und noch nicht angemeldet
    if (scrollProgress < 1.60 || scrollProgress > 2.20 || hasSubscribed) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                className="phase8-newsletter-container"
                style={{
                    position: 'fixed',
                    top: '20%', // ✅ GEÄNDERT: Zentriert wie in Phase 0
                    left: '50%',
                    transform: `translate(-50%, -50%) translateY(${verticalPosition}vh)`, // ✅ GEÄNDERT: Kombiniert zentriert + scroll
                    width: '80%',
                    maxWidth: '500px',
                    zIndex: 6,
                    pointerEvents: 'all',
                    opacity: Math.max(0, Math.min(1, opacity)),
                    transition: isScrollLocked ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
                }}
            >
                {/* ✅ VEREINFACHT: Nur Überschrift + Original Newsletter */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        fontFamily: 'Lobster, cursive, sans-serif',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0 0 15px rgba(0, 0, 0, 0.8), 0 3px 6px rgba(0, 0, 0, 0.6)',
                        margin: '0 0 10px 0',
                        letterSpacing: '1px'
                    }}>
                        Noch nicht angemeldet?
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                        margin: 0,
                        lineHeight: '1.4'
                    }}>
                        Verpasse keine Updates von AniTune! 🎌
                    </p>
                </div>

                {/* ✅ ORIGINAL NEWSLETTER KOMPONENTE (exakt wie Phase 0) */}
                <Newsletter
                    onSubscriptionChange={onSubscriptionChange}
                />

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '0',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        lineHeight: '1.2',
                        pointerEvents: 'all',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div>📧 Phase 8: Newsletter CTA</div>
                        <div>ScrollProgress: {scrollProgress.toFixed(2)}</div>
                        <div>Phase8Progress: {(phase8Progress * 100).toFixed(0)}%</div>
                        <div>VerticalPos: {verticalPosition.toFixed(0)}vh</div>
                        <div>Opacity: {opacity.toFixed(2)}</div>
                        <div>Position: Mitte (Index 6)</div>
                        <div>Has Subscribed: {hasSubscribed ? '✅' : '❌'}</div>
                        <div style={{ color: '#00ff00', fontSize: '9px' }}>
                            ✅ Wie Carousel, Design wie Phase 0
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default Phase8NewsletterLayer;