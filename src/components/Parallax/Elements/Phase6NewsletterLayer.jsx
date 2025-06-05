// src/components/Parallax/Elements/Phase6NewsletterLayer.jsx - EIGENSTÄNDIGE NEWSLETTER FORM

import React, { useMemo, useState } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import { PHASE_CONFIG } from '../utils/phaseUtils';

const Phase6NewsletterLayer = ({
    scrollProgress,
    currentTitleIndex,
    isScrollLocked,
    hasSubscribed,
    onSubscriptionChange
}) => {
    const [showImpressum, setShowImpressum] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Vereinfachte Sichtbarkeitsprüfung
    const isPhase6Active = scrollProgress >= 1.6 && scrollProgress <= 2.1;

    // Einfache Opacity-Berechnung
    let newsletterOpacity = 0;
    if (scrollProgress >= 1.6 && scrollProgress <= 2.0) {
        const progress = (scrollProgress - 1.6) / 0.4;
        newsletterOpacity = Math.min(1, progress * 2);
    }

    // Newsletter Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setMessage('❌ Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        setIsSubmitting(true);
        setMessage('⏳ Wird gesendet...');

        try {
            // Simuliere API-Call zur Newsletter-API
            const response = await fetch('https://newsletter-api.cryptomacki.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (result.success) {
                setMessage('✅ Erfolgreich angemeldet!');
                onSubscriptionChange(true); // Informiere Parent Component
                setEmail('');
            } else {
                setMessage(result.message || '❌ Fehler beim Anmelden.');
            }
        } catch (error) {
            setMessage('❌ Netzwerk-Fehler. Versuche es nochmal.');
            console.error('Newsletter-Fehler:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isPhase6Active) {
        return null;
    }

    return (
        <ErrorBoundary>
            {/* Newsletter Container */}
            <div
                style={{
                    position: 'fixed',
                    top: '25%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '500px',
                    zIndex: 200,
                    pointerEvents: 'all',
                    opacity: Math.max(0.8, newsletterOpacity)
                }}
            >
                {!hasSubscribed && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        {/* Header */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '25px'
                        }}>
                            <h2 style={{
                                margin: '0 0 10px 0',
                                fontFamily: 'Lobster, cursive',
                                fontSize: '1.8rem',
                                color: '#333'
                            }}>
                                📧 Newsletter Anmeldung
                            </h2>
                            <p style={{
                                margin: 0,
                                color: '#666',
                                fontSize: '1rem'
                            }}>
                                Erhalte die neuesten AniTune Updates
                            </p>
                        </div>

                        {/* Newsletter Form */}
                        <form onSubmit={handleSubmit} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            <input
                                type="email"
                                placeholder="Deine E-Mail-Adresse"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                required
                                style={{
                                    padding: '15px 20px',
                                    border: '2px solid #a880ff',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: isSubmitting ? '#f5f5f5' : 'white'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#764ba2';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(168, 128, 255, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#a880ff';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '15px 30px',
                                    background: isSubmitting
                                        ? 'rgba(168, 128, 255, 0.5)'
                                        : 'linear-gradient(135deg, #a880ff 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'inherit'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting) {
                                        e.target.style.transform = 'scale(1.02)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(168, 128, 255, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {isSubmitting ? '⏳ Wird gesendet...' : '🚀 Jetzt anmelden'}
                            </button>
                        </form>

                        {/* Status Message */}
                        {message && (
                            <div style={{
                                marginTop: '15px',
                                padding: '10px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontSize: '14px',
                                backgroundColor: message.includes('✅') ? '#d4edda' :
                                    message.includes('⏳') ? '#fff3cd' : '#f8d7da',
                                color: message.includes('✅') ? '#155724' :
                                    message.includes('⏳') ? '#856404' : '#721c24',
                                border: `1px solid ${message.includes('✅') ? '#c3e6cb' :
                                    message.includes('⏳') ? '#ffeaa7' : '#f5c6cb'}`
                            }}>
                                {message}
                            </div>
                        )}

                        {/* Privacy Note */}
                        <p style={{
                            marginTop: '20px',
                            fontSize: '12px',
                            color: '#888',
                            textAlign: 'center',
                            lineHeight: '1.4'
                        }}>
                            Wir respektieren deine Privatsphäre. Du kannst dich jederzeit abmelden.
                        </p>
                    </div>
                )}

                {/* Success State */}
                {hasSubscribed && (
                    <div style={{
                        textAlign: 'center',
                        background: 'rgba(76, 175, 80, 0.95)',
                        backdropFilter: 'blur(20px)',
                        padding: '30px',
                        borderRadius: '15px',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h3 style={{
                            margin: '0 0 15px 0',
                            fontFamily: 'Lobster, cursive',
                            fontSize: '1.8rem'
                        }}>
                            ✅ Erfolgreich angemeldet!
                        </h3>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>
                            Du erhältst ab sofort unsere Updates.
                        </p>
                    </div>
                )}

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        left: '0',
                        background: 'lime',
                        color: 'black',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                    }}>
                        📧 Phase 6: {(scrollProgress * 40).toFixed(1)}% | Opacity: {newsletterOpacity.toFixed(2)}
                        <br />✉️ Email: "{email}" | Submitting: {isSubmitting ? 'Yes' : 'No'}
                    </div>
                )}
            </div>

            {/* Impressum Button */}
            <button
                onClick={() => setShowImpressum(!showImpressum)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 210,
                    background: 'rgba(0, 18, 53, 0.9)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Lobster, cursive',
                    opacity: Math.max(0.7, newsletterOpacity)
                }}
            >
                📋 Impressum
            </button>

            {/* Impressum Popup */}
            {showImpressum && (
                <div style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '20px',
                    zIndex: 220,
                    background: 'rgba(0, 18, 53, 0.95)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '15px',
                    padding: '20px',
                    minWidth: '280px',
                    maxWidth: '350px',
                    fontSize: '0.8rem'
                }}>
                    <button
                        onClick={() => setShowImpressum(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        ×
                    </button>

                    <h3 style={{ margin: '0 0 15px 0', color: '#a880ff' }}>Impressum</h3>
                    <div>
                        <strong>Michael Schernthaner</strong><br />
                        Bruchsaler Straße 12<br />
                        10715 Berlin<br /><br />
                        <strong>Kontakt:</strong><br />
                        Tel: +49 17636155061<br />
                        E-Mail: admin@anitune.com<br /><br />
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                            Angaben gemäß § 5 DDG
                        </div>
                    </div>
                </div>
            )}
        </ErrorBoundary>
    );
};

export default Phase6NewsletterLayer;