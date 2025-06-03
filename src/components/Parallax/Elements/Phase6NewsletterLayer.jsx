// src/components/Parallax/Elements/Phase6NewsletterLayer.jsx - KORRIGIERT mit Blur Container

import React, { useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import Newsletter from '../../Newsletter/Newsletter';
import { getPositionFromSegments } from '../utils/animationUtils';
import { PHASE_CONFIG, getPhaseDebugInfo } from '../utils/phaseUtils';

const Phase6NewsletterLayer = ({
    scrollProgress,
    currentTitleIndex,
    isScrollLocked,
    hasSubscribed,
    onSubscriptionChange
}) => {
    // ✅ KORRIGIERT: Newsletter soll über Phase 4 Logo enden
    const newsletterSegment = useMemo(() => [{
        scrollStart: PHASE_CONFIG.phase6.scrollStart, // 1.6 (64% Debug)
        scrollEnd: PHASE_CONFIG.phase6.scrollEnd,     // 2.0 (80% Debug)
        posStart: 100,       // Startet weit unten (off-screen)
        posEnd: -10,         // ✅ ENDET über Phase 4 Logo (-10vh = über Mitte)
        opacityStart: 0.0,   // Startet unsichtbar
        opacityEnd: 1.0      // Endet voll sichtbar
    }], []);

    // Scroll-basierte Position
    const verticalPosition = getPositionFromSegments(newsletterSegment, scrollProgress, 'posStart', 'posEnd');
    const opacity = getPositionFromSegments(newsletterSegment, scrollProgress, 'opacityStart', 'opacityEnd');

    // ✅ KORRIGIERT: Newsletter zeigen auch wenn subscribed (für Demo/Testing)
    if (scrollProgress < PHASE_CONFIG.phase6.scrollStart ||
        scrollProgress > PHASE_CONFIG.phase6.scrollEnd + 0.1) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                className="phase6-newsletter-container"
                style={{
                    position: 'fixed',
                    top: '50%',
                    right: '5%', // ✅ RECHTS im Bild positioniert
                    transform: `translateY(-50%) translateY(${verticalPosition}vh)`,
                    width: '380px', // ✅ Etwas breiter für Impressum
                    maxWidth: '90vw', // ✅ Responsive
                    zIndex: 35, // ✅ Über Logo (Logo hat zIndex 30)
                    pointerEvents: 'all',
                    opacity: Math.max(0, Math.min(1, opacity)),
                    transition: isScrollLocked ? 'none' : 'all 0.4s ease-out'
                }}
            >
                {/* ✅ NEUER: Blur Container mit Impressum */}
                <div style={{
                    background: 'rgba(0, 18, 53, 0.85)', // Dunkles Blau mit Transparenz
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '20px', // ✅ Etwas weniger Padding für mehr Platz
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    textAlign: 'center'
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{
                            fontFamily: 'Lobster, cursive, sans-serif',
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 0 15px rgba(168, 128, 255, 0.8)',
                            margin: '0 0 8px 0',
                            letterSpacing: '1px'
                        }}>
                            {hasSubscribed ? '✅ Bereits angemeldet!' : 'Noch nicht angemeldet?'}
                        </h2>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                            margin: 0,
                            lineHeight: '1.4'
                        }}>
                            {hasSubscribed ? 'Du erhältst bereits Updates! 🎌' : 'Verpasse keine Updates! 🎌'}
                        </p>
                    </div>

                    {/* Newsletter Komponente - nur zeigen wenn nicht subscribed */}
                    {!hasSubscribed && (
                        <div style={{ marginBottom: '15px' }}>
                            <Newsletter onSubscriptionChange={onSubscriptionChange} />
                        </div>
                    )}

                    {/* Wenn bereits subscribed, zeige Bestätigung */}
                    {hasSubscribed && (
                        <div style={{
                            marginBottom: '15px',
                            padding: '12px',
                            background: 'rgba(76, 175, 80, 0.2)',
                            borderRadius: '8px',
                            border: '1px solid rgba(76, 175, 80, 0.4)'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(76, 175, 80, 1)' }}>
                                ✅ Newsletter-Anmeldung erfolgreich!
                            </div>
                        </div>
                    )}

                    {/* ✅ ECHTES IMPRESSUM */}
                    <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        paddingTop: '12px',
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        lineHeight: '1.3',
                        textAlign: 'left'
                    }}>
                        <div style={{ marginBottom: '6px', textAlign: 'center' }}>
                            <strong style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.7rem' }}>
                                Impressum
                            </strong>
                        </div>

                        <div style={{ marginBottom: '3px' }}>
                            <strong>Michael Schernthaner</strong>
                        </div>
                        <div style={{ marginBottom: '2px' }}>
                            Bruchsaler Straße 12
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                            10715 Berlin
                        </div>

                        <div style={{ marginBottom: '2px' }}>
                            <strong>Kontakt:</strong>
                        </div>
                        <div style={{ marginBottom: '1px' }}>
                            Tel: <a href="tel:+4917636155061" style={{ color: 'rgba(168, 128, 255, 0.8)', textDecoration: 'none' }}>
                                +49 17636155061
                            </a>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                            E-Mail: <a href="mailto:admin@anitune.com" style={{ color: 'rgba(168, 128, 255, 0.8)', textDecoration: 'none' }}>
                                admin@anitune.com
                            </a>
                        </div>

                        <div style={{ fontSize: '0.6rem', opacity: 0.7, textAlign: 'center' }}>
                            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
                        </div>
                    </div>
                </div>

                {/* ✅ DEVELOPMENT: Enhanced Debug mit Position-Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'absolute',
                        left: '-350px', // ✅ Angepasst für breiteren Newsletter
                        top: '0',
                        background: 'rgba(255, 107, 107, 0.9)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        lineHeight: '1.3',
                        pointerEvents: 'all',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minWidth: '280px'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            📧 Phase 6: Newsletter + ECHTES Impressum
                        </div>
                        <div>ScrollProgress: {scrollProgress.toFixed(3)}</div>
                        <div>Debug %: {(scrollProgress * 40).toFixed(1)}%</div>
                        <div>Range: 64%-80% Debug (1.6-2.0 scrollProgress)</div>
                        <div>VerticalPos: {verticalPosition.toFixed(1)}vh</div>
                        <div>Opacity: {opacity.toFixed(2)}</div>
                        <div>Position: Rechts (5% from right)</div>
                        <div>Target: Über Phase 4 Logo (-10vh)</div>

                        <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '4px' }}>
                            <div style={{ fontSize: '9px', color: '#ffff00' }}>
                                📍 Movement: 100vh → -10vh
                            </div>
                            <div style={{ fontSize: '8px', color: '#ccc' }}>
                                Start: Off-screen unten
                            </div>
                            <div style={{ fontSize: '8px', color: '#ccc' }}>
                                End: Über Phase 4 Logo
                            </div>
                        </div>

                        <div style={{ color: '#00ff00', fontSize: '9px', marginTop: '4px' }}>
                            ✅ Blur Container + ECHTES Impressum | Rechts positioniert
                        </div>

                        {(() => {
                            const debugInfo = getPhaseDebugInfo(scrollProgress);
                            return (
                                <div style={{ fontSize: '9px', color: '#ffff00', marginTop: '2px' }}>
                                    Central Phase: {debugInfo.phase} ({debugInfo.phaseDescription})
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default Phase6NewsletterLayer;