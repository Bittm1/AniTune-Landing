// src/components/Parallax/Elements/Phase8NewsletterLayer.jsx
import React, { useMemo, useState } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import { getPositionFromSegments } from '../utils/animationUtils';
import './Phase8NewsletterLayer.css';

const Phase8NewsletterLayer = ({
    scrollProgress,
    currentTitleIndex,
    isScrollLocked,
    hasSubscribed,
    onSubscriptionChange
}) => {
    // ✅ Newsletter-Form States
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isInputHovered, setIsInputHovered] = useState(false);

    // ✅ PROFESSIONELL: Segment-Definition wie andere Layer
    const newsletterSegment = useMemo(() => [{
        scrollStart: 1.60,    // Phase 8 startet nach Carousel
        scrollEnd: 2.00,      // Phase 8 endet bei 200%  
        posStart: 100,        // Startet 100vh unten
        posEnd: 0,            // Endet bei normaler Position
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

    // ✅ Newsletter Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || isSubmitting) return;

        setIsSubmitting(true);

        // Simuliere API-Call (ersetze später mit echter Newsletter-API)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`📧 Newsletter-Anmeldung: ${email}`);

            setShowSuccess(true);
            setEmail('');

            // Informiere Parent über erfolgreiche Anmeldung
            if (onSubscriptionChange) {
                onSubscriptionChange(true);
            }

            // Success-Message nach 3 Sekunden ausblenden
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Newsletter-Anmeldung fehlgeschlagen:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ PROFESSIONELL: Container Style wie andere Layer
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
                style={containerStyle}
            >
                {/* Header Section */}
                <div className="newsletter-header">
                    <h2 className="newsletter-title">
                        Noch nicht angemeldet?
                    </h2>
                    <p className="newsletter-subtitle">
                        Verpasse keine Updates von AniTune und erhalte exklusive Inhalte direkt in dein Postfach! 🎌
                    </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="success-message">
                        <div className="success-icon">✅</div>
                        <h3>Perfekt!</h3>
                        <p>Du erhältst bald die erste Mail von uns!</p>
                    </div>
                )}

                {/* Newsletter Form */}
                {!showSuccess && (
                    <div className="newsletter-form-container">
                        <form onSubmit={handleSubmit} className="newsletter-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="deine@email.com"
                                    className={`newsletter-email-input ${isInputHovered ? 'input-hover' : ''}`}
                                    onMouseEnter={() => setIsInputHovered(true)}
                                    onMouseLeave={() => setIsInputHovered(false)}
                                    required
                                    disabled={isSubmitting}
                                />

                                <button
                                    type="submit"
                                    className={`newsletter-submit-button ${isButtonHovered ? 'button-hover' : ''} ${isSubmitting ? 'submitting' : ''}`}
                                    onMouseEnter={() => setIsButtonHovered(true)}
                                    onMouseLeave={() => setIsButtonHovered(false)}
                                    disabled={isSubmitting || !email}
                                >
                                    <span className="button-text">
                                        {isSubmitting ? 'Anmelden...' : 'Jetzt anmelden!'}
                                    </span>
                                </button>
                            </div>
                        </form>

                        {/* Info Text */}
                        <p className="newsletter-info">
                            Keine Sorge, wir spammen nicht! Du kannst dich jederzeit wieder abmelden.
                        </p>
                    </div>
                )}

                {/* Scroll-basierte Sichtbarkeits-Info */}
                <div className="phase-progress-indicator">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${phase8Progress * 100}%`,
                            backgroundColor: showSuccess ? '#4CAF50' : '#a880ff'
                        }}
                    ></div>
                </div>

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="newsletter-debug">
                        <div>ScrollProgress: {scrollProgress.toFixed(2)}</div>
                        <div>Phase8Progress: {(phase8Progress * 100).toFixed(0)}%</div>
                        <div>VerticalPos: {verticalPosition.toFixed(0)}vh</div>
                        <div>Opacity: {opacity.toFixed(2)}</div>
                        <div>Has Subscribed: {hasSubscribed ? '✅' : '❌'}</div>
                        <div>Current Phase: {currentTitleIndex}/8</div>
                        <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
                        <div style={{ color: '#00ff00', fontSize: '10px' }}>
                            ✅ Scroll-basierte Newsletter Animation
                        </div>
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            📧 Conditional auf Subscription-Status
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default Phase8NewsletterLayer;