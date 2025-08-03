// src/components/Enhanced/CentralDebugPanel.jsx
// 🔍 ZENTRALES DEBUG-PANEL - Alles auf einen Blick + Development Mode
// ✅ Ersetzt alle anderen Debug-Panels + Dev Mode Toggle
// ⚠️ KEIN CAROUSEL IMPORT - Debug Panel importiert keine anderen Komponenten!

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
                🎯 ANITUNE DEBUG CENTRAL - 7 SNAP-POINTS + CAROUSEL
            </div>

            {/* ===== 🔧 DEVELOPMENT MODE TOGGLE ===== */}
            <div style={{ marginBottom: '12px', border: '1px solid #ffaa00', borderRadius: '4px', padding: '8px' }}>
                <div style={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '4px' }}>
                    🔧 DEVELOPMENT MODE:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={onToggleDevelopmentMode}
                        style={{
                            background: developmentMode ? '#4CAF50' : '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {developmentMode ? 'ON' : 'OFF'}
                    </button>
                    <span style={{ fontSize: '10px', color: '#ccc' }}>
                        {developmentMode ? 'Freies Scrollen' : 'Snap & Lock aktiv'}
                    </span>
                </div>
                {developmentMode && (
                    <div style={{ fontSize: '9px', color: '#ffaa00', marginTop: '4px' }}>
                        ⚠️ Snap-Navigation + Lock-System deaktiviert
                    </div>
                )}
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

            {/* ===== LOCK-SCROLL SYSTEM ===== */}
            <div style={{ marginBottom: '12px', border: '1px solid #ff6b6b', borderRadius: '4px', padding: '8px' }}>
                <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '4px' }}>
                    🔒 LOCK-SCROLL SYSTEM:
                </div>
                <div>🎵 Audio Playing: {isAudioPlaying ? <span style={{ color: '#00ff00' }}>YES</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>
                <div>🎯 Audio Snap: <span style={{ color: '#ffff00' }}>{audioPlayingSnapPoint || 'N/A'}</span></div>
                <div>🎭 Current Audio: <span style={{ color: '#90EE90' }}>{currentlyPlayingAudio || 'None'}</span></div>
                <div>🔒 Is Locked: {isLocked ? <span style={{ color: '#ff6b6b' }}>🔒 YES</span> : <span style={{ color: '#90EE90' }}>🔓 NO</span>}</div>
                <div>👁️ Show Indicator: {showScrollIndicator ? <span style={{ color: '#90EE90' }}>YES</span> : <span style={{ color: '#ccc' }}>NO</span>}</div>

                <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.8 }}>
                    <div>🎵 Audio Zone: {isInAudioZone ? <span style={{ color: '#90EE90' }}>YES (1-3)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                    <div>🧭 Nav Zone: {isInNavigationZone ? <span style={{ color: '#87ceeb' }}>YES (4-6)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                    <div>🏠 Start Zone: {isInStartZone ? <span style={{ color: '#ffaa00' }}>YES (0)</span> : <span style={{ color: '#666' }}>NO</span>}</div>
                </div>
            </div>

            {/* ===== AUDIO SYSTEM ===== */}
            <div style={{ marginBottom: '12px', border: '1px solid #9C27B0', borderRadius: '4px', padding: '8px' }}>
                <div style={{ color: '#9C27B0', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎵 AUDIO SYSTEM:
                </div>
                <div>🎼 Background: {backgroundMusicPlaying ? <span style={{ color: '#00ff00' }}>Playing ({(backgroundMusicVolume * 100).toFixed(0)}%)</span> : <span style={{ color: '#ccc' }}>Stopped</span>}</div>
                <div>🎸 Theme: {themeMusicPlaying ? <span style={{ color: '#ff6b6b' }}>Playing ({(themeMusicVolume * 100).toFixed(0)}%)</span> : <span style={{ color: '#ccc' }}>Stopped</span>}</div>

                <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.8 }}>
                    <div>Snap 1-3: Titel-Audio + Hintergrund</div>
                    <div>Snap 4-5: Theme (ersetzt Hintergrund)</div>
                    <div>Snap 0,6: Silent</div>
                </div>
            </div>

            {/* ===== LAYER STATUS ===== */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '4px' }}>
                    🌟 LAYER STATUS:
                </div>
                <div>🛣️ Road: {showRoad ? <span style={{ color: '#90EE90' }}>ON</span> : <span style={{ color: '#666' }}>OFF</span>}</div>
                <div>📧 Newsletter Start: {showNewsletterStart ? <span style={{ color: '#90EE90' }}>ON</span> : <span style={{ color: '#666' }}>OFF</span>}</div>
                <div>📧 Newsletter End: {showNewsletterEnd ? <span style={{ color: '#90EE90' }}>ON</span> : <span style={{ color: '#666' }}>OFF</span>}</div>
                <div>🎠 Carousel: {
                    (scrollProgress >= 0.78 && scrollProgress <= 0.92) ? (
                        <span style={{ color: '#a880ff' }}>✅ AKTIV</span>
                    ) : (
                        <span style={{ color: '#666' }}>❌ INAKTIV</span>
                    )
                }
                    {scrollProgress >= 0.78 && scrollProgress < 0.80 && <span style={{ color: '#ffaa00' }}> (Von unten)</span>}
                    {scrollProgress >= 0.80 && scrollProgress < 0.85 && <span style={{ color: '#00ff00' }}> (Zentral)</span>}
                    {scrollProgress >= 0.85 && scrollProgress <= 0.90 && <span style={{ color: '#ff6b6b' }}> (Nach oben weg)</span>}
                </div>
            </div>

            {/* ===== AKTUELLER SNAP-POINT INFO ===== */}
            <div style={{ marginBottom: '12px', backgroundColor: 'rgba(255, 255, 0, 0.1)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#ffff00', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 AKTUELLER SNAP-POINT {activeSnapPoint}:
                </div>
                {activeSnapPoint === 0 && <div style={{ color: '#ffaa00' }}>🏠 Logo + Newsletter Start</div>}
                {activeSnapPoint === 1 && <div style={{ color: '#00ff00' }}>🎵 "Von Uns Heißt Für Uns" + Audio</div>}
                {activeSnapPoint === 2 && <div style={{ color: '#00ff00' }}>🎵 "Der Weg Ist Das Ziel" + Audio</div>}
                {activeSnapPoint === 3 && <div style={{ color: '#00ff00' }}>🎵 "Die Community Heißt" + Audio</div>}
                {activeSnapPoint === 4 && <div style={{ color: '#ff6b6b' }}>🌟 Parallax Vollansicht + Theme</div>}
                {activeSnapPoint === 5 && <div style={{ color: '#a880ff' }}>🎠 AniTune Carousel (Von unten hochfahrend)</div>}
                {activeSnapPoint === 6 && <div style={{ color: '#ffaa00' }}>📧 Newsletter CTA</div>}
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
                        console.log('🔍 FULL DEBUG DUMP:');
                        console.log('Navigation:', { activeSnapPoint, scrollProgress, isAnimating, fps });
                        console.log('Lock-Scroll:', { isLocked, showScrollIndicator, isAudioPlaying, audioPlayingSnapPoint });
                        console.log('Audio:', { backgroundMusicPlaying, backgroundMusicVolume, themeMusicPlaying, themeMusicVolume });
                        console.log('Zones:', { isInAudioZone, isInNavigationZone, isInStartZone });
                        console.log('Development Mode:', developmentMode);
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
                    🔍 Full Debug
                </button>

                <button
                    onClick={() => {
                        console.log('🎯 SNAP-POINT ANALYSE:');
                        console.log(`Aktuell: Snap ${activeSnapPoint} (${(scrollProgress * 100).toFixed(1)}%)`);
                        console.log('Audio Zone (1-3):', isInAudioZone);
                        console.log('Lock aktiv:', isLocked);
                        console.log('Audio spielt:', isAudioPlaying);
                        console.log('Dev Mode:', developmentMode);
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
                    🎯 Lock Analyse
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
                ✅ 7-Snap-Point System + Lock-Scroll + Carousel Integration
                <br />🔧 Development Mode + Zentrales Debug-Panel
            </div>
        </div>,
        portalContainer
    );
};

export default CentralDebugPanel;