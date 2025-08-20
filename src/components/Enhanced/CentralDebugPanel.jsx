// src/components/Enhanced/CentralDebugPanel.jsx
// 🔍 ZENTRALES DEBUG-PANEL - Mit Layer Debug Toggle
// ✅ FIXED: Minimized View kann wieder geöffnet werden

import React, { useState, useEffect } from 'react';
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

    // Development Mode
    developmentMode = true,
    onToggleDevelopmentMode = null,

    // Layer Debug Panels Toggle
    showLayerDebugPanels = false,
    onToggleLayerDebugPanels = null,

    // Portal Container
    portalContainer = null
}) => {

    const [isMinimized, setIsMinimized] = useState(false);

    const getDeviceDebugInfo = () => {
        if (typeof window === 'undefined') {
            return {
                type: 'desktop',
                width: 1920,
                height: 1080,
                touch: false,
                multiplier: 1.0,
                emoji: '🖥️'
            };
        }

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isTouchDevice = 'ontouchstart' in window;

        let deviceType, multiplier, emoji;

        if (width <= 767 && isTouchDevice) {
            deviceType = 'mobile';
            multiplier = 0.7;
            emoji = '📱';
        } else if (width >= 1440) {
            deviceType = 'large';
            multiplier = 1.2;
            emoji = '🖥️+';
        } else {
            deviceType = 'desktop';
            multiplier = 1.0;
            emoji = '🖥️';
        }

        return { type: deviceType, width, height, touch: isTouchDevice, multiplier, emoji };
    };

    const [deviceInfo, setDeviceInfo] = useState(() => getDeviceDebugInfo());

    useEffect(() => {
        const updateDeviceInfo = () => {
            setDeviceInfo(getDeviceDebugInfo());
        };

        window.addEventListener('resize', updateDeviceInfo, { passive: true });
        return () => window.removeEventListener('resize', updateDeviceInfo);
    }, []);

    if (!portalContainer || process.env.NODE_ENV !== 'development') {
        return null;
    }

    // Status Berechnungen
    const isInAudioZone = activeSnapPoint >= 1 && activeSnapPoint <= 3;
    const isInNavigationZone = activeSnapPoint >= 4 && activeSnapPoint <= 6;
    const isInStartZone = activeSnapPoint === 0;

    const showNewsletterStart = scrollProgress <= 0.15;
    const showNewsletterEnd = scrollProgress >= 0.90;
    const showRoad = scrollProgress >= 0.30;

    const getDeviceColor = (type) => {
        switch (type) {
            case 'mobile': return '#ff6b6b';
            case 'desktop': return '#4dabf7';
            case 'large': return '#51cf66';
            default: return '#868e96';
        }
    };

    // Minimized View - FIXED
    if (isMinimized) {
        return createPortal(
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.95)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'monospace',
                zIndex: 999999,
                pointerEvents: 'all',  // FIXED: Jetzt klickbar
                cursor: 'pointer',
                border: '2px solid #00ff88',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(0, 255, 136, 0.3)'
            }}
                onClick={() => setIsMinimized(false)}
            >
                <span>Debug</span>
                <span style={{ color: '#ffff00' }}>Snap {activeSnapPoint}</span>
                <span style={{ color: '#87ceeb' }}>{(scrollProgress * 100).toFixed(0)}%</span>
                <span style={{ fontSize: '14px' }}>▼</span>
            </div>,
            portalContainer
        );
    }

    // Full View
    return createPortal(
        <div style={{
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
        }}>
            {/* Header with Minimize */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid #333',
                paddingBottom: '8px'
            }}>
                <div style={{ fontWeight: 'bold', color: '#00ff88', fontSize: '12px' }}>
                    🎯 ANITUNE DEBUG CENTRAL
                </div>
                <button
                    onClick={() => setIsMinimized(true)}
                    style={{
                        background: 'transparent',
                        border: '1px solid #666',
                        color: '#999',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        cursor: 'pointer',
                        fontSize: '10px'
                    }}
                >
                    ▲
                </button>
            </div>

            {/* Device Debug Fender */}
            <div style={{
                marginBottom: '12px',
                border: `2px solid ${getDeviceColor(deviceInfo.type)}`,
                borderRadius: '6px',
                padding: '10px',
                background: `linear-gradient(135deg, ${getDeviceColor(deviceInfo.type)}22 0%, ${getDeviceColor(deviceInfo.type)}11 100%)`
            }}>
                <div style={{
                    color: getDeviceColor(deviceInfo.type),
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {deviceInfo.emoji} DEVICE DEBUG FENDER:
                    <span style={{
                        background: getDeviceColor(deviceInfo.type),
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        {deviceInfo.type}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px' }}>
                    <div>
                        <div>📐 Größe: <span style={{ color: '#ffff00' }}>{deviceInfo.width}×{deviceInfo.height}</span></div>
                        <div>🎛️ Multiplier: <span style={{ color: '#ffff00' }}>{deviceInfo.multiplier}x</span></div>
                    </div>
                    <div>
                        <div>👆 Touch: {deviceInfo.touch ?
                            <span style={{ color: '#90EE90' }}>✅ YES</span> :
                            <span style={{ color: '#ff6b6b' }}>❌ NO</span>
                        }</div>
                        <div>🎯 Type: <span style={{ color: getDeviceColor(deviceInfo.type) }}>{deviceInfo.type.toUpperCase()}</span></div>
                    </div>
                </div>
            </div>

            {/* Development Mode & Layer Debug Toggle */}
            <div style={{ marginBottom: '12px', border: '1px solid #ffaa00', borderRadius: '4px', padding: '8px' }}>
                <div style={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '4px' }}>
                    🔧 CONTROLS:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
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
                            fontWeight: 'bold',
                            flex: 1
                        }}
                    >
                        Dev Mode: {developmentMode ? 'ON' : 'OFF'}
                    </button>

                    <button
                        onClick={onToggleLayerDebugPanels}
                        style={{
                            background: showLayerDebugPanels ? '#9C27B0' : '#666',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            flex: 1
                        }}
                    >
                        Layer Debug: {showLayerDebugPanels ? 'ON' : 'OFF'}
                    </button>
                </div>
                {developmentMode && (
                    <div style={{ fontSize: '9px', color: '#ffaa00', marginTop: '4px' }}>
                        ⚠️ Snap-Navigation + Lock-System deaktiviert
                    </div>
                )}
                {showLayerDebugPanels && (
                    <div style={{ fontSize: '9px', color: '#9C27B0', marginTop: '4px' }}>
                        🔍 Layer Debug Panels werden angezeigt
                    </div>
                )}
            </div>

            {/* Navigation & Scroll */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ color: '#87ceeb', fontWeight: 'bold', marginBottom: '4px' }}>
                    🧭 NAVIGATION & SCROLL:
                </div>
                <div>📍 Active Snap: <span style={{ color: '#ffff00' }}>{activeSnapPoint}/6</span></div>
                <div>📊 Scroll Progress: <span style={{ color: '#ffff00' }}>{(scrollProgress * 100).toFixed(1)}%</span></div>
                <div>🎬 Animating: {isAnimating ? <span style={{ color: '#ff6b6b' }}>🔒 YES</span> : <span style={{ color: '#90EE90' }}>🔓 NO</span>}</div>
                <div>⚡ FPS: <span style={{ color: fps >= 55 ? '#90EE90' : '#ff6b6b' }}>{fps}</span></div>
            </div>

            {/* Lock-Scroll System */}
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

            {/* Audio System */}
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

            {/* Layer Status */}
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
                </div>
            </div>

            {/* Current Snap-Point Info */}
            <div style={{ marginBottom: '12px', backgroundColor: 'rgba(255, 255, 0, 0.1)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#ffff00', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 AKTUELLER SNAP-POINT {activeSnapPoint}:
                </div>
                {activeSnapPoint === 0 && <div style={{ color: '#ffaa00' }}>🏠 Logo + Newsletter Start</div>}
                {activeSnapPoint === 1 && <div style={{ color: '#00ff00' }}>🎵 "Von Uns Heißt Für Uns" + Audio</div>}
                {activeSnapPoint === 2 && <div style={{ color: '#00ff00' }}>🎵 "Der Weg Ist Das Ziel" + Audio</div>}
                {activeSnapPoint === 3 && <div style={{ color: '#00ff00' }}>🎵 "Die Community Heißt" + Audio</div>}
                {activeSnapPoint === 4 && <div style={{ color: '#ff6b6b' }}>🌟 Parallax Vollansicht + Theme</div>}
                {activeSnapPoint === 5 && <div style={{ color: '#a880ff' }}>🎠 AniTune Carousel</div>}
                {activeSnapPoint === 6 && <div style={{ color: '#ffaa00' }}>📧 Newsletter CTA</div>}
            </div>

            {/* Quick Action Buttons */}
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
                        console.log('Device:', deviceInfo);
                        console.log('Navigation:', { activeSnapPoint, scrollProgress, isAnimating, fps });
                        console.log('Lock-Scroll:', { isLocked, showScrollIndicator, isAudioPlaying, audioPlayingSnapPoint });
                        console.log('Audio:', { backgroundMusicPlaying, backgroundMusicVolume, themeMusicPlaying, themeMusicVolume });
                        console.log('Development Mode:', developmentMode);
                        console.log('Layer Debug Panels:', showLayerDebugPanels);
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
                        console.log('Layer Debug:', showLayerDebugPanels);
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

            {/* Footer */}
            <div style={{
                marginTop: '8px',
                fontSize: '8px',
                opacity: 0.7,
                borderTop: '1px solid #333',
                paddingTop: '6px',
                color: '#90EE90'
            }}>
                ✅ 7-Snap-Point System + Lock-Scroll + Layer Debug Toggle
                <br />🔧 Development Mode + Device Debug + Zentrales Debug-Panel
            </div>
        </div>,
        portalContainer
    );
};

export default CentralDebugPanel;