// src/components/Enhanced/ParallaxLayer.jsx - HAUPTKOMPONENTE

import React, { useMemo, useState, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';

// ===== CONFIG IMPORTS =====
import {
    LAYER_CONFIG,
    SNAP_POINT_LAYERS,
    RESPONSIVE_CONFIG,
    calculateLayerPosition,
    getActiveLayersForSnapPoint,
    isLayerActiveAtSnapPoint
} from './config/parallaxConfig';

// ===== LAYER IMPORTS =====
import BackgroundLayer from './layers/BackgroundLayer';
import StarfieldLayer from './layers/StarfieldLayer';
import BergeLayer from './layers/BergeLayer';
import TalLayer from './layers/TalLayer';
import WaldHintenLayer from './layers/WaldHintenLayer';
import ForestLayer from './layers/ForestLayer';
import RoadLayer from './layers/RoadLayer';
import DogLayer from './layers/DogLayer';
import MengeLayer from './layers/MengeLayer';
import LogoLayer from './layers/LogoLayer';
import CloudLayer from './layers/CloudLayer';
import WolkenHintenLayer from './layers/WolkenHintenLayer';

const EnhancedParallaxLayer = ({
    scrollProgress = 0,
    activeSnapPoint = 0,
    isSnapping = false
}) => {
    // ===== MOBILE DETECTION =====
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768;
    });

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ===== RESPONSIVE CONFIG =====
    const deviceConfig = useMemo(() => {
        return isMobile ? RESPONSIVE_CONFIG.mobile : RESPONSIVE_CONFIG.desktop;
    }, [isMobile]);

    // ===== AKTIVE LAYER BERECHNUNG =====
    const activeLayerNames = useMemo(() => {
        return getActiveLayersForSnapPoint(activeSnapPoint);
    }, [activeSnapPoint]);

    // ===== LAYER POSITIONEN BERECHNUNG =====
    const layerPositions = useMemo(() => {
        const positions = {};

        Object.keys(LAYER_CONFIG).forEach(layerName => {
            const layerConfig = LAYER_CONFIG[layerName];
            if (layerConfig.active) {
                positions[layerName] = calculateLayerPosition(scrollProgress, layerConfig);
            }
        });

        return positions;
    }, [scrollProgress]);

    // ===== LAYER KOMPONENTEN MEMOIZATION =====

    // Background Layer (immer aktiv)
    const backgroundLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('background', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.background;
        const position = layerPositions.background;

        return (
            <BackgroundLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Starfield Layer
    const starfieldLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('starfield', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.starfield;
        const position = layerPositions.starfield;

        return (
            <StarfieldLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Logo Layer (nur Snap-Point 0)
    const logoLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('logo', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.logo;
        const position = layerPositions.logo;

        return (
            <LogoLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Road Layer (ab Snap-Point 1)
    const roadLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('road', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.road;
        const position = layerPositions.road;

        return (
            <RoadLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Dog Layer (ab Snap-Point 1)
    const dogLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('dog', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.dog;
        const position = layerPositions.dog;

        return (
            <DogLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Forest Layer (ab Snap-Point 2)
    const forestLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('forest', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.forest;
        const position = layerPositions.forest;

        return (
            <ForestLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Tal Layer (ab Snap-Point 3)
    const talLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('tal', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.tal;
        const position = layerPositions.tal;

        return (
            <TalLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Wald Hinten Layer (ab Snap-Point 3)
    const waldHintenLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('waldHinten', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.waldHinten;
        const position = layerPositions.waldHinten;

        return (
            <WaldHintenLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Berge Layer (ab Snap-Point 4)
    const bergeLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('berge', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.berge;
        const position = layerPositions.berge;

        return (
            <BergeLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Cloud Layers (ab Snap-Point 4)
    const cloudLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('leftCloud', activeSnapPoint) &&
            !isLayerActiveAtSnapPoint('rightCloud', activeSnapPoint)) return null;

        const leftConfig = LAYER_CONFIG.leftCloud;
        const rightConfig = LAYER_CONFIG.rightCloud;
        const leftPosition = layerPositions.leftCloud;
        const rightPosition = layerPositions.rightCloud;

        return (
            <CloudLayer
                scrollProgress={scrollProgress}
                leftPosition={leftPosition}
                rightPosition={rightPosition}
                leftConfig={leftConfig}
                rightConfig={rightConfig}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Wolken Hinten Layer (ab Snap-Point 4)
    const wolkenHintenLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('leftCloudHinten', activeSnapPoint) &&
            !isLayerActiveAtSnapPoint('rightCloudHinten', activeSnapPoint)) return null;

        const leftConfig = LAYER_CONFIG.leftCloudHinten;
        const rightConfig = LAYER_CONFIG.rightCloudHinten;
        const leftPosition = layerPositions.leftCloudHinten;
        const rightPosition = layerPositions.rightCloudHinten;

        return (
            <WolkenHintenLayer
                scrollProgress={scrollProgress}
                leftPosition={leftPosition}
                rightPosition={rightPosition}
                leftConfig={leftConfig}
                rightConfig={rightConfig}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    // Menge Layer (Snap-Point 5)
    const mengeLayer = useMemo(() => {
        if (!isLayerActiveAtSnapPoint('menge', activeSnapPoint)) return null;

        const config = LAYER_CONFIG.menge;
        const position = layerPositions.menge;

        return (
            <MengeLayer
                scrollProgress={scrollProgress}
                position={position}
                config={config}
                deviceConfig={deviceConfig}
            />
        );
    }, [scrollProgress, activeSnapPoint, layerPositions, deviceConfig]);

    return (
        <ErrorBoundary>
            <div
                className="enhanced-parallax-layer"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10, // Unter Titel und Audio Layer (20, 30)
                    pointerEvents: 'none',
                    overflow: 'hidden'
                }}
            >
                {/* ===== DEBUG INFO (NUR DEVELOPMENT) ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '380px',
                            left: '20px',
                            background: 'rgba(138, 43, 226, 0.9)',
                            color: 'white',
                            padding: '12px',
                            fontSize: '11px',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            lineHeight: '1.4',
                            border: '2px solid #8a2be2',
                            zIndex: 1,
                            minWidth: '300px',
                            pointerEvents: 'all'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#dda0dd' }}>
                            🌟 ENHANCED PARALLAX LAYER - STUFE 4
                        </div>

                        <div>📍 Active Snap-Point: {activeSnapPoint}/5</div>
                        <div>📊 Scroll Progress: {(scrollProgress * 100).toFixed(1)}%</div>
                        <div>📱 Device: {isMobile ? '📱 Mobile' : '🖥️ Desktop'}</div>
                        <div>🎪 Snapping: {isSnapping ? '🔒 Yes' : '🔓 No'}</div>

                        <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#ffff00' }}>
                                🌟 AKTIVE LAYER ({activeLayerNames.length}):
                            </div>
                            {activeLayerNames.map((layerName) => (
                                <div key={layerName} style={{
                                    fontSize: '9px',
                                    color: '#90EE90'
                                }}>
                                    • {layerName}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#ffaa00' }}>
                                🎛️ LAYER POSITIONS (erste 3):
                            </div>
                            {Object.entries(layerPositions).slice(0, 3).map(([layerName, pos]) => (
                                <div key={layerName} style={{
                                    fontSize: '8px',
                                    color: '#ccc'
                                }}>
                                    {layerName}: pos={pos.position?.toFixed(1) || 'N/A'}, opacity={pos.opacity?.toFixed(2) || 'N/A'}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '6px', fontSize: '9px', opacity: 0.7 }}>
                            ✅ STUFE 4: Modulares Parallax System
                            <br />🎛️ Anpassbare Bewegungen in parallaxConfig.js
                            <br />📱 Responsive & Performance-optimiert
                            <br />🌟 {Object.keys(LAYER_CONFIG).length} Layer verfügbar
                        </div>
                    </div>
                )}

                {/* ===== LAYER RENDERING (Z-INDEX SORTIERT) ===== */}

                {/* Background Layer (Z-Index: 1) */}
                <ErrorBoundary>
                    {backgroundLayer}
                </ErrorBoundary>

                {/* Starfield Layer (Z-Index: 2) */}
                <ErrorBoundary>
                    {starfieldLayer}
                </ErrorBoundary>

                {/* Berge Layer (Z-Index: 3) */}
                <ErrorBoundary>
                    {bergeLayer}
                </ErrorBoundary>

                {/* Tal Layer (Z-Index: 4) */}
                <ErrorBoundary>
                    {talLayer}
                </ErrorBoundary>

                {/* Wald Hinten Layer (Z-Index: 5) */}
                <ErrorBoundary>
                    {waldHintenLayer}
                </ErrorBoundary>

                {/* Forest Layer (Z-Index: 6) */}
                <ErrorBoundary>
                    {forestLayer}
                </ErrorBoundary>

                {/* Road Layer (Z-Index: 7) */}
                <ErrorBoundary>
                    {roadLayer}
                </ErrorBoundary>

                {/* Dog Layer (Z-Index: 8) */}
                <ErrorBoundary>
                    {dogLayer}
                </ErrorBoundary>

                {/* Menge Layer (Z-Index: 9) */}
                <ErrorBoundary>
                    {mengeLayer}
                </ErrorBoundary>

                {/* Wolken Hinten Layer (Z-Index: 12) */}
                <ErrorBoundary>
                    {wolkenHintenLayer}
                </ErrorBoundary>

                {/* Cloud Layer (Z-Index: 15) */}
                <ErrorBoundary>
                    {cloudLayer}
                </ErrorBoundary>

                {/* Logo Layer (Z-Index: 20) */}
                <ErrorBoundary>
                    {logoLayer}
                </ErrorBoundary>
            </div>
        </ErrorBoundary>
    );
};

export default EnhancedParallaxLayer;