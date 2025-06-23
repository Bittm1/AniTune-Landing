// src/components/Enhanced/layers/BackgroundLayer.jsx - ENHANCED BACKGROUND LAYER

import React from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SafeImage from '../../Parallax/Elements/SafeImage';

const BackgroundLayer = ({
    scrollProgress,
    position,
    config,
    deviceConfig
}) => {
    // ===== FEHLERBEHANDLUNG =====
    if (!config) {
        console.warn('BackgroundLayer: Missing configuration');
        return null;
    }

    if (!position) {
        console.warn('BackgroundLayer: Missing position data');
        return null;
    }

    // ===== KONFIGURATION =====
    const imageSrc = '/Parallax/Himmel.webp'; // Direkter Pfad erstmal
    const fallbackSrc = '/Parallax/Logo.png';
    const zIndex = config.zIndex || 1;

    // ===== POSITION & TRANSFORM =====
    const scale = position.scale || 1.0;
    const opacity = position.opacity !== undefined ? position.opacity : 1.0;

    // ===== RESPONSIVE ANPASSUNGEN =====
    const responsiveMultiplier = deviceConfig?.multiplier || 1.0;
    const finalScale = scale * responsiveMultiplier;

    return (
        <ErrorBoundary>
            <div
                className="enhanced-background-layer"
                style={{
                    position: 'fixed',
                    top: '-9%',
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    zIndex: zIndex,
                    pointerEvents: 'none',

                    // ===== ENHANCED TRANSFORM =====
                    transform: `scale(${finalScale})`,
                    transformOrigin: 'center top',
                    opacity: opacity,

                    // ===== PERFORMANCE =====
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    transition: 'opacity 0.3s ease-out'
                }}
            >
                <SafeImage
                    src={imageSrc}
                    fallbackSrc={fallbackSrc}
                    alt="AniTune Hintergrund Himmel"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        display: 'block'
                    }}
                    onError={() => console.warn('Background image failed to load:', imageSrc)}
                />

                {/* ===== DEBUG INFO (NUR DEVELOPMENT) ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            background: 'rgba(0, 100, 200, 0.9)',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            lineHeight: '1.4',
                            zIndex: 1000,
                            pointerEvents: 'all',
                            border: '2px solid #0066cc',
                            minWidth: '220px'
                        }}
                    >
                        <div style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#87ceeb'
                        }}>
                            🌌 ENHANCED BACKGROUND LAYER
                        </div>

                        <div>📊 Scroll Progress: {(scrollProgress * 100).toFixed(1)}%</div>
                        <div>🔍 Scale: {finalScale.toFixed(3)}</div>
                        <div>👁️ Opacity: {opacity.toFixed(2)}</div>
                        <div>📱 Device Multiplier: {responsiveMultiplier}</div>

                        <div style={{
                            marginTop: '8px',
                            borderTop: '1px solid #333',
                            paddingTop: '8px',
                            fontSize: '10px',
                            color: '#add8e6'
                        }}>
                            <div>📂 Image: {imageSrc.split('/').pop()}</div>
                            <div>🎯 Z-Index: {zIndex}</div>
                            <div>⚡ Performance: GPU Accelerated</div>
                        </div>

                        <div style={{
                            marginTop: '6px',
                            fontSize: '9px',
                            opacity: 0.8,
                            color: '#87ceeb'
                        }}>
                            ✅ Enhanced: parallaxConfig.js Integration
                            <br />🎛️ Position: calculateLayerPosition()
                            <br />📱 Responsive: deviceConfig Support
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default BackgroundLayer;