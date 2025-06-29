// src/components/Enhanced/CentralDebugPanel.jsx
// 🔍 ZENTRALES DEBUG-PANEL - Erweitert um Titel-Animation Status
// ✅ Zeigt Lock-System basierend auf Audio UND Titel-Animation

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

    // ✅ NEU: Lock-Grund ermitteln
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
                maxWidth: '400px',
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
                🎯 ANITUNE DEBUG - LOCK-SCROLL + TITEL-ANIMATION
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
            </div>

            {/* ===== ERWEITERTE LOCK-SCROLL SYSTEM INFO ===== */}
            <div style={{ marginBottom: '12px', border: '2px solid #ff6b6b', borderRadius: '4px', padding: '8px' }}>
                <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '4px' }}>
                    🔒 LOCK-SCROLL SYSTEM (ERWEITERT):
                </div>
                <div>🎵 Audio Playing: {isAudioPlaying ? <span style={{ color: '#00ff00' }}>YES (Snap {audioPlayingSnapPoint})</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>
                <div>🎭 Titel Animating: {isTitleAnimating ? <span style={{ color: '#ffaa00' }}>YES (Snap {titleAnimatingSnapPoint})</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>
                <div>🔒 Lock Status: {isLocked ? <span style={{ color: '#ff6b6b' }}>🔒 LOCKED</span> : <span style={{ color: '#90EE90' }}>🔓 UNLOCKED</span>}</div>
                <div>❓ Lock Grund: <span style={{ color: isLocked ? '#ff6b6b' : '#90EE90' }}>{lockReason}</span></div>
                <div>👁️ Show Indicator: {showScrollIndicator ? <span style={{ color: '#90EE90' }}>YES</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>

                <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.8, borderTop: '1px solid #444', paddingTop: '4px' }}>
                    <div style={{ color: '#ffaa00' }}>✅ NEUE LOCK-LOGIK:</div>
                    <div>Lock = Audio ODER Titel läuft</div>
                    <div>Unlock = Audio UND Titel fertig</div>
                </div>
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
                    🎯 AKTUELLER ZONE STATUS:
                </div>
                <div>🎵 Audio Zone: {isInAudioZone ? <span style={{ color: '#90EE90' }}>YES (1-3)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                <div>🧭 Nav Zone: {isInNavigationZone ? <span style={{ color: '#87ceeb' }}>YES (4-6)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                <div>🏠 Start Zone: {isInStartZone ? <span style={{ color: '#ffaa00' }}>YES (0)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
            </div>

            {/* ===== LAYER STATUS ===== */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '4px' }}>
                    🌟 LAYER STATUS:
                </div>
                <div>🛣️ Road: {showRoad ? <span style={{ color: '#90EE90' }}>ON</span> : <span style={{ color: '#666' }}>OFF</span>}</div>
                <div>📧 Newsletter Start: {showNewsletterStart ? <span style={{ color: '#90EE90' }}>ON</span> : <span style={{ color: '#666' }}>OFF</span>}</div>
                <div>📧 Newsletter End: {showNewsletterEnd ? <span style={{ color: '#90EE90' }}>ON</span> : <span style={{ color: '#666' }}>OFF</span>}</div>
            </div>

            {/* ===== AKTUELLER SNAP-POINT INFO ===== */}
            <div style={{ marginBottom: '12px', backgroundColor: 'rgba(255, 255, 0, 0.1)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#ffff00', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 SNAP-POINT {activeSnapPoint} - {isLocked ? '🔒 LOCKED' : '🔓 UNLOCKED'}:
                </div>
                {activeSnapPoint === 0 && <div style={{ color: '#ffaa00' }}>🏠 Logo + Newsletter Start</div>}
                {activeSnapPoint === 1 && <div style={{ color: '#00ff00' }}>🎵 "Von Uns Heißt Für Uns" + Audio + Titel</div>}
                {activeSnapPoint === 2 && <div style={{ color: '#00ff00' }}>🎵 "Der Weg Ist Das Ziel" + Audio + Titel</div>}
                {activeSnapPoint === 3 && <div style={{ color: '#00ff00' }}>🎵 "Die Community Heißt" + Audio + Titel</div>}
                {activeSnapPoint === 4 && <div style={{ color: '#ff6b6b' }}>🌟 Parallax Vollansicht + Theme</div>}
                {activeSnapPoint === 5 && <div style={{ color: '#87ceeb' }}>🎠 Carousel Phase (Leer)</div>}
                {activeSnapPoint === 6 && <div style={{ color: '#ffaa00' }}>📧 Newsletter CTA</div>}

                {/* ✅ NEU: Lock-Status für aktuellen Snap-Point */}
                {isInAudioZone && (
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
                gap: '8px',
                marginTop: '12px',
                borderTop: '1px solid #333',
                paddingTop: '8px'
            }}>
                <button
                    onClick={() => {
                        console.log('🔍 LOCK-SYSTEM DEBUG:');
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
                        console.log('🎭 TITEL-ANIMATION DEBUG:');
                        console.log(`Titel läuft: ${isTitleAnimating}`);
                        console.log(`Audio läuft: ${isAudioPlaying}`);
                        console.log(`Lock Grund: ${lockReason}`);
                        console.log(`Snap: ${activeSnapPoint} (Zone: ${isInAudioZone ? 'Audio' : 'Andere'})`);
                    }}
                    style={{
                        padding: '4px 8px',
                        fontSize: '9px',
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    🎭 Titel Debug
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
                ✅ Erweiterte Lock-Logik: Audio ODER Titel → Lock
                <br />🔧 Unlock erst wenn beides fertig
            </div>
        </div>,
        portalContainer
    );
};

export default CentralDebugPanel;