// src/components/Parallax/Elements/Phase6NewsletterLayer.jsx - Newsletter + Impressum

import React, { useMemo, useState } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import Newsletter from '../../Newsletter/Newsletter';
import { getPositionFromSegments } from '../utils/animationUtils';
import { PHASE_CONFIG } from '../utils/phaseUtils';

const Phase6NewsletterLayer = ({
    scrollProgress,
    currentTitleIndex,
    isScrollLocked,
    hasSubscribed,
    onSubscriptionChange
}) => {
    const [showImpressum, setShowImpressum] = useState(false);

    // Newsletter-Segment - IN DER SONNE
    const newsletterSegment = useMemo(() => [{
        scrollStart: PHASE_CONFIG.phase6.scrollStart, // 1.6 (64% Debug)
        scrollEnd: PHASE_CONFIG.phase6.scrollEnd,     // 2.0 (80% Debug)
        posStart: 100,       // Startet unten
        posEnd: -40,         // ✅ HOCH IN DER SONNE (-40vh = weit über Logo)
        opacityStart: 0.0,   // Startet unsichtbar
        opacityEnd: 1.0      // Endet voll sichtbar
    }], []);

    // Impressum-Segment - ERSCHEINT FRÜHER
    const impressumSegment = useMemo(() => [{
        scrollStart: 1.5,    // ✅ NOCH FRÜHER: bei Phase 5 Ende (60% Debug)
        scrollEnd: PHASE_CONFIG.phase6.scrollEnd,     // 2.0 (80% Debug)
        posStart: 50,        // ✅ WENIGER off-screen
        posEnd: 0,           // ✅ NORMAL Position (0vh = an richtiger Stelle)
        opacityStart: 0.0,   // Startet unsichtbar
        opacityEnd: 1.0      // Endet voll sichtbar
    }], []);

    // Newsletter Position
    const newsletterVerticalPosition = getPositionFromSegments(newsletterSegment, scrollProgress, 'posStart', 'posEnd');
    const newsletterOpacity = getPositionFromSegments(newsletterSegment, scrollProgress, 'opacityStart', 'opacityEnd');

    // Impressum Position
    const impressumVerticalPosition = getPositionFromSegments(impressumSegment, scrollProgress, 'posStart', 'posEnd');
    const impressumOpacity = getPositionFromSegments(impressumSegment, scrollProgress, 'opacityStart', 'opacityEnd');

    // Sichtbarkeitsprüfung
    const showNewsletter = scrollProgress >= PHASE_CONFIG.phase6.scrollStart &&
        scrollProgress <= PHASE_CONFIG.phase6.scrollEnd + 0.1;
    const showImpressumContainer = scrollProgress >= 1.5 &&
        scrollProgress <= impressumSegment[0].scrollEnd + 0.1;

    if (!showNewsletter && !showImpressumContainer) {
        return null;
    }

    return (
        <ErrorBoundary>
            {/* ✅ NEWSLETTER - HOCH IN DER SONNE - KLICKBAR FIX */}
            {showNewsletter && (
                <div
                    className="phase6-newsletter-container"
                    style={{
                        position: 'fixed',
                        top: '15%',           // ✅ HÖHER - weit in der Sonne
                        left: '50%',          // ✅ ZENTRAL horizontal  
                        transform: `translate(-50%, -50%) translateY(${newsletterVerticalPosition}vh)`, // ✅ ZENTRAL + Movement
                        width: '80%',         // ✅ WIE PHASE 0
                        maxWidth: '500px',    // ✅ WIE PHASE 0
                        zIndex: 60,           // ✅ HÖHER: Über allem
                        pointerEvents: 'all', // ✅ EXPLIZIT
                        opacity: Math.max(0, Math.min(1, newsletterOpacity)),
                        transition: isScrollLocked ? 'none' : 'all 0.4s ease-out'
                    }}
                >
                    {/* ✅ NEWSLETTER-WRAPPER - KLICKBAR */}
                    <div style={{
                        pointerEvents: 'all',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* ✅ IDENTISCHES DESIGN WIE PHASE 0 */}
                        {!hasSubscribed && (
                            <div style={{ pointerEvents: 'all' }}>
                                <Newsletter onSubscriptionChange={onSubscriptionChange} />
                            </div>
                        )}

                        {/* ✅ EINFACHE SUCCESS MESSAGE wie Phase 0 */}
                        {hasSubscribed && (
                            <div style={{
                                textAlign: 'center',
                                background: 'rgba(76, 175, 80, 0.9)',
                                padding: '20px',
                                borderRadius: '15px',
                                color: 'white',
                                backdropFilter: 'blur(20px)',
                                pointerEvents: 'all'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', fontFamily: 'Lobster, cursive' }}>
                                    ✅ Bereits angemeldet!
                                </h3>
                                <p style={{ margin: 0, fontSize: '1rem' }}>
                                    Du erhältst bereits unsere Updates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ IMPRESSUM-CONTAINER - UNTEN RECHTS - VEREINFACHT */}
            {showImpressumContainer && (
                <div
                    className="impressum-container"
                    style={{
                        position: 'fixed',
                        bottom: '20px',       // ✅ FESTE POSITION
                        right: '20px',        // ✅ FESTE POSITION
                        // KEIN transform mehr - direkte Position
                        zIndex: 50,           // ✅ HÖHER: Über allem
                        pointerEvents: 'all',
                        opacity: Math.max(0, Math.min(1, impressumOpacity)),
                        transition: isScrollLocked ? 'none' : 'opacity 0.4s ease-out'
                    }}
                >
                    {/* ✅ IMPRESSUM BUTTON */}
                    <button
                        onClick={() => setShowImpressum(!showImpressum)}
                        style={{
                            background: 'rgba(0, 18, 53, 0.85)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: 'white',
                            padding: '12px 20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            fontFamily: 'Lobster, cursive, sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 20px rgba(168, 128, 255, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                        }}
                    >
                        📋 Impressum
                    </button>

                    {/* ✅ IMPRESSUM POPUP - LEGAL KONFORM */}
                    {showImpressum && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '60px',
                                right: '0',
                                background: 'rgba(0, 18, 53, 0.95)',
                                backdropFilter: 'blur(25px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '15px',
                                padding: '20px',
                                color: 'white',
                                fontSize: '0.8rem',
                                lineHeight: '1.4',
                                minWidth: '280px',
                                maxWidth: '350px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                                animation: showImpressum ? 'fadeInUp 0.3s ease-out' : 'none'
                            }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowImpressum(false)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '0',
                                    width: '24px',
                                    height: '24px'
                                }}
                            >
                                ×
                            </button>

                            {/* Header */}
                            <div style={{
                                marginBottom: '15px',
                                paddingBottom: '10px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontFamily: 'Lobster, cursive',
                                    fontSize: '1.2rem',
                                    color: 'rgba(168, 128, 255, 1)'
                                }}>
                                    Impressum
                                </h3>
                            </div>

                            {/* ✅ ECHTES IMPRESSUM - LEGAL KONFORM */}
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <strong>Michael Schernthaner</strong>
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    Bruchsaler Straße 12
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    10715 Berlin
                                </div>

                                <div style={{ marginBottom: '4px' }}>
                                    <strong>Kontakt:</strong>
                                </div>
                                <div style={{ marginBottom: '2px' }}>
                                    Tel: <a
                                        href="tel:+4917636155061"
                                        style={{
                                            color: 'rgba(168, 128, 255, 0.9)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        +49 17636155061
                                    </a>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    E-Mail: <a
                                        href="mailto:admin@anitune.com"
                                        style={{
                                            color: 'rgba(168, 128, 255, 0.9)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        admin@anitune.com
                                    </a>
                                </div>

                                <div style={{
                                    fontSize: '0.7rem',
                                    opacity: 0.8,
                                    textAlign: 'center',
                                    paddingTop: '10px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ✅ CSS Animation für Impressum Popup */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </ErrorBoundary>
    );
};

export default Phase6NewsletterLayer;