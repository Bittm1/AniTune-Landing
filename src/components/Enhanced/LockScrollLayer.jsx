// src/components/Enhanced/LockScrollLayer.jsx - BEREINIGT OHNE DEBUG-PANEL
// 🔒 LOCK-SCROLL SYSTEM für Snap-Points 1-3 mit Audio
// ✅ Guided Experience: Scroll → Lock → Audio vollständig → Unlock → Repeat
// ✅ Debug-Panel entfernt - nutzt jetzt CentralDebugPanel

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ErrorBoundary from '../ErrorBoundary';

const LockScrollLayer = ({
    activeSnapPoint = 0,
    isAudioPlaying = false,
    onSkip,
    onGoToTop,
    onLockStatusChange // ✅ NEU: Callback für Status-Updates an Parent
}) => {
    // ===== STATES =====
    const [isLocked, setIsLocked] = useState(false);
    const [portalContainer, setPortalContainer] = useState(null);

    // ===== REFS =====
    const lockTimeoutRef = useRef(null);

    // ===== ZONE DETECTION =====
    const isInAudioZone = activeSnapPoint >= 1 && activeSnapPoint <= 3;
    const isInNavigationZone = activeSnapPoint >= 4 && activeSnapPoint <= 6;
    const isInStartZone = activeSnapPoint === 0;

    // ✅ VEREINFACHT: Indicator nur zeigen wenn in relevanter Zone UND nicht gelocked
    const shouldShowScrollIndicator = (isInAudioZone || isInStartZone) && !isLocked;

    // ===== ✅ STATUS UPDATES AN PARENT WEITERLEITEN =====
    useEffect(() => {
        if (onLockStatusChange) {
            onLockStatusChange(isLocked, shouldShowScrollIndicator);
        }
    }, [isLocked, shouldShowScrollIndicator, onLockStatusChange]);

    // ===== LOCK LOGIC (VEREINFACHT) =====
    useEffect(() => {
        if (isInAudioZone && isAudioPlaying) {
            // Audio spielt → LOCK aktivieren
            setIsLocked(true);

            if (process.env.NODE_ENV === 'development') {
                console.log(`🔒 LOCK AKTIVIERT: Snap ${activeSnapPoint} - Audio spielt`);
            }
        } else {
            // Audio fertig oder außerhalb Audio-Zone → UNLOCK
            setIsLocked(false);

            if (process.env.NODE_ENV === 'development' && isLocked) {
                console.log(`🔓 LOCK DEAKTIVIERT: Snap ${activeSnapPoint} - Audio fertig oder Zone verlassen`);
            }
        }
    }, [isInAudioZone, isAudioPlaying, activeSnapPoint, isLocked]);

    // ===== SCROLL-BLOCKIERUNG (VERSTÄRKT) =====
    useEffect(() => {
        if (!isLocked) return;

        const handleWheel = (e) => {
            // ✅ VERSTÄRKT: Sofort stoppen, bevor andere Listener greifen
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // ✅ NEU: Stoppt auch andere Listener

            if (process.env.NODE_ENV === 'development') {
                console.log(`🚫 SCROLL BLOCKIERT: Snap ${activeSnapPoint} - Audio läuft noch`);
            }
        };

        const handleKeydown = (e) => {
            // Blockiere auch Keyboard-Navigation während Lock
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space'].includes(e.code)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // ✅ NEU: Auch hier verstärkt

                if (process.env.NODE_ENV === 'development') {
                    console.log(`⌨️ KEYBOARD BLOCKIERT: ${e.code} während Lock`);
                }
            }
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // ✅ NEU: Touch auch verstärkt

            if (process.env.NODE_ENV === 'development') {
                console.log(`📱 TOUCH BLOCKIERT: Snap ${activeSnapPoint} - Audio läuft noch`);
            }
        };

        // ✅ WICHTIG: capture: true + höchste Priorität
        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
        window.addEventListener('keydown', handleKeydown, { passive: false, capture: true });

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔒 LOCK EVENT-LISTENERS AKTIVIERT: Snap ${activeSnapPoint}`);
        }

        return () => {
            window.removeEventListener('wheel', handleWheel, { capture: true });
            window.removeEventListener('touchmove', handleTouchMove, { capture: true });
            window.removeEventListener('keydown', handleKeydown, { capture: true });

            if (process.env.NODE_ENV === 'development') {
                console.log(`🔓 LOCK EVENT-LISTENERS ENTFERNT: Snap ${activeSnapPoint}`);
            }
        };
    }, [isLocked, activeSnapPoint]);

    // ===== PORTAL SETUP =====
    useEffect(() => {
        const container = document.createElement('div');
        container.id = 'lock-scroll-portal';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
        `;
        document.body.appendChild(container);
        setPortalContainer(container);

        return () => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        };
    }, []);

    // ===== EVENT HANDLERS =====
    const handleSkip = useCallback(() => {
        if (onSkip) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`⏭️ SKIP: User überspringt Audio bei Snap ${activeSnapPoint}`);
            }
            onSkip();
        }
    }, [onSkip, activeSnapPoint]);

    const handleGoToTop = useCallback(() => {
        if (onGoToTop) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`⬆️ GO TO TOP: User springt zurück zum Start`);
            }
            onGoToTop();
        }
    }, [onGoToTop]);

    // ===== RENDER GUARD =====
    if (!portalContainer) return null;

    return createPortal(
        <ErrorBoundary>
            <div className="lock-scroll-layer" data-testid="lock-scroll-layer">

                {/* ===== SCROLL INDICATOR - SAUBER & SIMPEL ===== */}
                {shouldShowScrollIndicator && (
                    <div
                        className="scroll-indicator"
                        style={{
                            position: 'fixed',
                            bottom: '40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            fontSize: '14px',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: '500',
                            pointerEvents: 'none',
                            zIndex: 1000,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            opacity: 1 // ✅ Konstante Opacity, kein Blinken
                        }}
                        data-testid="scroll-indicator"
                    >
                        {isInStartZone
                            ? '🖱️ Scroll to start'
                            : '🖱️ Scroll to continue'
                        }
                    </div>
                )}

                {/* ===== WÄHREND LOCK: KOMPLETT LEER - EINFACH NICHTS ZEIGEN ===== */}

                {/* ===== SKIP BUTTON - OBEN RECHTS WÄHREND LOCK ===== */}
                {isLocked && (
                    <button
                        onClick={handleSkip}
                        className="skip-button"
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(100, 100, 100, 0.9)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            pointerEvents: 'all',
                            zIndex: 1001,
                            transition: 'all 0.3s ease',
                            fontFamily: 'Arial, sans-serif',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(150, 150, 150, 0.9)';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(100, 100, 100, 0.9)';
                            e.target.style.transform = 'scale(1)';
                        }}
                        title="Skip current audio"
                        data-testid="skip-button"
                    >
                        ⏭️ Skip
                    </button>
                )}

                {/* ===== NACH OBEN BUTTON - BEI SNAP 4-6 ===== */}
                {isInNavigationZone && (
                    <button
                        onClick={handleGoToTop}
                        className="go-to-top-button"
                        style={{
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(50, 150, 250, 0.9)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            pointerEvents: 'all',
                            zIndex: 1001,
                            transition: 'all 0.3s ease',
                            fontFamily: 'Arial, sans-serif',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(70, 170, 255, 0.9)';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(50, 150, 250, 0.9)';
                            e.target.style.transform = 'scale(1)';
                        }}
                        title="Go to start"
                        data-testid="go-to-top-button"
                    >
                        ⬆️ Nach oben
                    </button>
                )}

                {/* ===== CSS ANIMATIONS (NUR BUTTON HOVER) ===== */}
                <style jsx>{`
                    .skip-button:active {
                        transform: scale(0.95) !important;
                    }
                    
                    .go-to-top-button:active {
                        transform: scale(0.95) !important;
                    }
                `}</style>
            </div>
        </ErrorBoundary>,
        portalContainer
    );
};

export default LockScrollLayer;