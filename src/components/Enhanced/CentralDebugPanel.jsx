// src/components/Enhanced/CentralDebugPanel.jsx
// 🔍 ZENTRALES DEBUG-PANEL - Mit Development Mode Toggle
// ✅ Zeigt Lock-System + Development Mode Control

import React from 'react';
import { createPortal } from 'react-dom';

const CentralDebugPanel = ({
    // Scroll & Navigation
    activeSnapPoint = 0,
    scrollProgress = 0,
    isAnimating = false,
    fps = 60,

    // Audio System
    isAudioPlaying = false,
    audioPlayingSnapPoint = null,
    currentlyPlayingAudio = null,
    isTitleAnimating = false,
    titleAnimatingSnapPoint = null,
    backgroundMusicPlaying = false,
    backgroundMusicVolume = 0,
    themeMusicPlaying = false,
    themeMusicVolume = 0,

    // Lock-Scroll System
    isLocked = false,
    showScrollIndicator = false,

    // ✅ Development Mode
    developmentMode = true,
    onToggleDevelopmentMode = null,

    // Portal Container
    portalContainer = null
}) => {

    if (!portalContainer || process.env.NODE_ENV !== 'development') {
        return null;
    }

    // ===== STATUS BERECHNUNGEN =====
    const isInAudioZone = activeSnapPoint >= 1 && activeSnapPoint <= 3;
    const isInNavigationZone = activeSnapPoint >= 4 && activeSnapPoint <= 6;
    const isInStartZone = activeSnapPoint === 0;

    const showNewsletterStart = scrollProgress <= 0.15;
    const showNewsletterEnd = scrollProgress >= 0.90;
    const showRoad = scrollProgress >= 0.30;

    // ✅ Lock-Grund ermitteln
    const lockReason = isLocked ?
        (isAudioPlaying && isTitleAnimating ? 'Audio + Titel' :
            isAudioPlaying ? 'Audio' :
                isTitleAnimating ? 'Titel' : 'Unbekannt') : 'Nicht gelocked';

    return createPortal(
        <div
            className="central-debug-panel"
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.95)',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                lineHeight: '1.4',
                zIndex: 999999,
                pointerEvents: 'all',
                minWidth: '320px',
                maxWidth: '420px',
                border: '2px solid #00ff88',
                boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
                backdropFilter: 'blur(10px)'
            }}
        >
            {/* ===== HEADER ===== */}
            <div style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#00ff88',
                fontSize: '12px',
                borderBottom: '1px solid #333',
                paddingBottom: '8px'
            }}>
                🎯 ANITUNE DEBUG - DEVELOPMENT MODE CONTROL
            </div>

            {/* ===== 🔧 DEVELOPMENT MODE TOGGLE (PROMINENT) ===== */}
            <div style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '6px',
                border: `2px solid ${developmentMode ? '#ff6b6b' : '#00ff88'}`,
                backgroundColor: developmentMode ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 255, 136, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <div style={{
                        fontWeight: 'bold',
                        color: developmentMode ? '#ff6b6b' : '#00ff88',
                        fontSize: '12px'
                    }}>
                        🔧 DEVELOPMENT MODE
                    </div>
                    <button
                        onClick={onToggleDevelopmentMode}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            background: developmentMode ? '#ff6b6b' : '#00ff88',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = '0.8';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {developmentMode ? '🔧 DEV: ON' : '🎯 NORMAL: ON'}
                    </button>
                </div>

                <div style={{
                    fontSize: '10px',
                    color: developmentMode ? '#ff6b6b' : '#00ff88'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {developmentMode ? '🔧 Development Mode aktiv:' : '🎯 Normal Mode aktiv:'}
                    </div>
                    <div>
                        {developmentMode ? (
                            <>
                                ✅ Freies Scrollen (kein Snap)<br />
                                ✅ Kein Lock-System<br />
                                ✅ Layer-Positionierung möglich
                            </>
                        ) : (
                            <>
                                ✅ Snap-Navigation aktiv<br />
                                ✅ Lock-System funktional<br />
                                ✅ Guided Experience
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== NAVIGATION & SCROLL ===== */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '4px' }}>
                    🧭 NAVIGATION & SCROLL:
                </div>
                <div>📍 Active Snap: <span style={{ color: '#ffff00' }}>{activeSnapPoint}/6</span></div>
                <div>📊 Scroll Progress: <span style={{ color: '#ffff00' }}>{(scrollProgress * 100).toFixed(1)}%</span></div>
                <div>🎬 Animating: {isAnimating ? <span style={{ color: '#ff6b6b' }}>🔒 YES</span> : <span style={{ color: '#90EE90' }}>🔓 NO</span>}</div>
                <div>⚡ FPS: <span style={{ color: fps >= 55 ? '#90EE90' : '#ff6b6b' }}>{fps}</span></div>
                <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px' }}>
                    Snap-Navigation: {developmentMode ? <span style={{ color: '#ff6b6b' }}>🔧 DEAKTIVIERT</span> : <span style={{ color: '#90EE90' }}>✅ AKTIV</span>}
                </div>
            </div>

            {/* ===== LOCK-SCROLL SYSTEM (Conditional basierend auf Dev Mode) ===== */}
            <div style={{
                marginBottom: '12px',
                border: `2px solid ${developmentMode ? '#666' : '#ff6b6b'}`,
                borderRadius: '4px',
                padding: '8px',
                opacity: developmentMode ? 0.5 : 1
            }}>
                <div style={{
                    color: developmentMode ? '#666' : '#ff6b6b',
                    fontWeight: 'bold',
                    marginBottom: '4px'
                }}>
                    🔒 LOCK-SCROLL SYSTEM {developmentMode ? '(DEAKTIVIERT)' : '(AKTIV)'}:
                </div>

                {!developmentMode ? (
                    <>
                        <div>🎵 Audio Playing: {isAudioPlaying ? <span style={{ color: '#00ff00' }}>YES (Snap {audioPlayingSnapPoint})</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>
                        <div>🎭 Titel Animating: {isTitleAnimating ? <span style={{ color: '#ffaa00' }}>YES (Snap {titleAnimatingSnapPoint})</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>
                        <div>🔒 Lock Status: {isLocked ? <span style={{ color: '#ff6b6b' }}>🔒 LOCKED</span> : <span style={{ color: '#90EE90' }}>🔓 UNLOCKED</span>}</div>
                        <div>❓ Lock Grund: <span style={{ color: isLocked ? '#ff6b6b' : '#90EE90' }}>{lockReason}</span></div>
                        <div>👁️ Show Indicator: {showScrollIndicator ? <span style={{ color: '#90EE90' }}>YES</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>

                        <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.8, borderTop: '1px solid #444', paddingTop: '4px' }}>
                            <div style={{ color: '#ffaa00' }}>✅ LOCK-LOGIK:</div>
                            <div>Lock = Audio ODER Titel läuft</div>
                            <div>Unlock = Audio UND Titel fertig</div>
                        </div>
                    </>
                ) : (
                    <div style={{ color: '#666', fontSize: '10px', fontStyle: 'italic' }}>
                        Lock-System im Development Mode deaktiviert.<br />
                        Aktiviere Normal Mode zum Testen.
                    </div>
                )}
            </div>

            {/* ===== AUDIO SYSTEM ===== */}
            <div style={{ marginBottom: '12px', border: '1px solid #9C27B0', borderRadius: '4px', padding: '8px' }}>
                <div style={{ color: '#9C27B0', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎵 AUDIO + TITEL SYSTEM:
                </div>
                <div>🎭 Current Audio: <span style={{ color: '#90EE90' }}>{currentlyPlayingAudio || 'None'}</span></div>
                <div>🎼 Background: {backgroundMusicPlaying ? <span style={{ color: '#00ff00' }}>Playing ({(backgroundMusicVolume * 100).toFixed(0)}%)</span> : <span style={{ color: '#ccc' }}>Stopped</span>}</div>
                <div>🎸 Theme: {themeMusicPlaying ? <span style={{ color: '#ff6b6b' }}>Playing ({(themeMusicVolume * 100).toFixed(0)}%)</span> : <span style={{ color: '#ccc' }}>Stopped</span>}</div>

                <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.8 }}>
                    <div>Snap 1-3: Titel-Audio + Hintergrund + Titel-Animation</div>
                    <div>Snap 4-5: Theme (ersetzt Hintergrund)</div>
                    <div>Snap 0,6: Silent</div>
                </div>
            </div>

            {/* ===== ZONES INFO ===== */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 AKTUELLE ZONE:
                </div>
                <div>🎵 Audio Zone: {isInAudioZone ? <span style={{ color: '#90EE90' }}>YES (1-3)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                <div>🧭 Nav Zone: {isInNavigationZone ? <span style={{ color: '#87ceeb' }}>YES (4-6)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                <div>🏠 Start Zone: {isInStartZone ? <span style={{ color: '#ffaa00' }}>YES (0)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
            </div>

            {/* ===== AKTUELLER SNAP-POINT INFO ===== */}
            <div style={{
                marginBottom: '12px',
                backgroundColor: 'rgba(255, 255, 0, 0.1)',
                padding: '8px',
                borderRadius: '4px'
            }}>
                <div style={{ color: '#ffff00', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 SNAP-POINT {activeSnapPoint} - {developmentMode ? '🔧 DEV MODE' : (isLocked ? '🔒 LOCKED' : '🔓 UNLOCKED')}:
                </div>
                {activeSnapPoint === 0 && <div style={{ color: '#ffaa00' }}>🏠 Logo + Newsletter Start</div>}
                {activeSnapPoint === 1 && <div style={{ color: '#00ff00' }}>🎵 "Von Uns Heißt Für Uns" + Audio + Titel</div>}
                {activeSnapPoint === 2 && <div style={{ color: '#00ff00' }}>🎵 "Der Weg Ist Das Ziel" + Audio + Titel</div>}
                {activeSnapPoint === 3 && <div style={{ color: '#00ff00' }}>🎵 "Die Community Heißt" + Audio + Titel</div>}
                {activeSnapPoint === 4 && <div style={{ color: '#ff6b6b' }}>🌟 Parallax Vollansicht + Theme</div>}
                {activeSnapPoint === 5 && <div style={{ color: '#87ceeb' }}>🎠 Carousel Phase (Leer)</div>}
                {activeSnapPoint === 6 && <div style={{ color: '#ffaa00' }}>📧 Newsletter CTA</div>}

                {/* Lock-Status für aktuellen Snap-Point */}
                {isInAudioZone && !developmentMode && (
                    <div style={{ marginTop: '4px', fontSize: '9px', color: isLocked ? '#ff6b6b' : '#90EE90' }}>
                        Lock-Status: {isLocked ?
                            `Aktiv (${lockReason})` :
                            'Bereit für nächsten Scroll'
                        }
                    </div>
                )}
            </div>

            {/* ===== QUICK ACTION BUTTONS ===== */}
            <div style={{
                display: 'flex',
                gap: '6px',
                marginTop: '12px',
                borderTop: '1px solid #333',
                paddingTop: '8px',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => {
                        console.log('🔧 DEVELOPMENT MODE DEBUG:');
                        console.log('Development Mode:', developmentMode);
                        console.log('Snap Navigation:', developmentMode ? 'DEAKTIVIERT' : 'AKTIV');
                        console.log('Lock System:', developmentMode ? 'DEAKTIVIERT' : 'AKTIV');
                        console.log('Current Status:', { activeSnapPoint, scrollProgress, isLocked });
                    }}
                    style={{
                        padding: '4px 8px',
                        fontSize: '9px',
                        background: developmentMode ? '#ff6b6b' : '#00ff88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    🔧 Dev Debug
                </button>

                <button
                    onClick={() => {
                        console.log('🔒 LOCK-SYSTEM DEBUG:');
                        console.log('Lock Status:', { isLocked, lockReason });
                        console.log('Audio:', { isAudioPlaying, audioPlayingSnapPoint, currentlyPlayingAudio });
                        console.log('Titel:', { isTitleAnimating, titleAnimatingSnapPoint });
                        console.log('Zones:', { isInAudioZone, isInNavigationZone, isInStartZone });
                    }}
                    style={{
                        padding: '4px 8px',
                        fontSize: '9px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    🔒 Lock Debug
                </button>

                <button
                    onClick={() => {
                        console.log('📊 SCROLL & NAVIGATION DEBUG:');
                        console.log(`Scroll: ${(scrollProgress * 100).toFixed(1)}% (${scrollProgress.toFixed(3)})`);
                        console.log(`Snap: ${activeSnapPoint}/6`);
                        console.log(`Animating: ${isAnimating}`);
                        console.log(`Navigation: ${developmentMode ? 'DEAKTIVIERT (Dev Mode)' : 'AKTIV'}`);
                    }}
                    style={{
                        padding: '4px 8px',
                        fontSize: '9px',
                        background: '#9C27B0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    📊 Scroll Debug
                </button>
            </div>

            {/* ===== FOOTER ===== */}
            <div style={{
                marginTop: '8px',
                fontSize: '8px',
                opacity: 0.7,
                borderTop: '1px solid #333',
                paddingTop: '6px',
                color: '#90EE90'
            }}>
                ✅ Development Mode: {developmentMode ? 'Layer-Positionierung' : 'Guided Experience'}
                <br />🔧 Toggle für Live-Testing zwischen Modi
            </div>
        </div>,
        portalContainer
    );
};

export default CentralDebugPanel;