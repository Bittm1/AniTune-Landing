// src/components/Parallax/Elements/LogoLayer.jsx
import React from 'react';
import { getScaleFromSegments } from '../utils/animationUtils';
import { getActivePhaseFromScroll, getLogoConfigForPhase } from '../utils/phaseUtils';
import { zIndices } from '../config/constants/index';

const LogoLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        console.warn('LogoLayer: Missing configuration');
        return null;
    }

    // ✅ PHASE 0 LOGO (Original-Logik, unverändert)
    const phase0LogoScale = getScaleFromSegments(config.segments, scrollProgress);
    const phase0Opacity = Math.max(0, 1 - ((scrollProgress || 0) / 0.1));
    const phase0ImageSrc = config.imageSrc || "/Parallax/Logo.png";
    const phase0ZIndex = config.zIndex || zIndices.logo;

    // ✅ PHASE 4 LOGO (Neue Logik)
    const currentPhase = getActivePhaseFromScroll(scrollProgress);
    const phase4LogoConfig = getLogoConfigForPhase(currentPhase);

    // ✅ Phase 4 Progress für smooth fade-in (0-1 innerhalb Phase 4)
    const phase4Progress = currentPhase === 4 ?
        Math.min(1, Math.max(0, (scrollProgress - 1.0) / (1.2 - 1.0))) : 0;

    // ✅ Phase 4 Logo Opacity (kombiniert config + progress)
    const phase4Opacity = phase4LogoConfig ?
        phase4LogoConfig.style.opacity * phase4Progress : 0;

    return (
        <>
            {/* ✅ PHASE 0 LOGO - ORIGINAL (bei Scroll 0-10%) */}
            {phase0Opacity > 0.01 && (
                <div
                    style={{
                        position: 'fixed',
                        top: config.position.top,
                        left: config.position.left,
                        transform: `translate(-50%, -50%) scale(${phase0LogoScale})`,
                        zIndex: phase0ZIndex,
                        pointerEvents: 'none',
                        opacity: phase0Opacity,
                        transition: 'opacity 800ms ease-out',
                        width: config.size,
                        height: config.size,
                        backgroundImage: `url(${phase0ImageSrc})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'opacity',
                    }}
                    data-logo-phase="0"
                    data-scroll-progress={scrollProgress.toFixed(3)}
                    data-opacity={phase0Opacity.toFixed(3)}
                />
            )}

            {/* ✅ PHASE 4 LOGO - NEU (bei Scroll 120%-160%) */}
            {phase4LogoConfig && phase4LogoConfig.show && currentPhase === 4 && phase4Opacity > 0.01 && (
                <div
                    style={{
                        position: 'fixed',
                        top: phase4LogoConfig.position.top,
                        left: phase4LogoConfig.position.left,
                        transform: `${phase4LogoConfig.position.transform} scale(${phase4LogoConfig.scale})`,
                        width: phase4LogoConfig.width,
                        height: phase4LogoConfig.height,
                        zIndex: phase4LogoConfig.zIndex,
                        opacity: phase4Opacity,
                        filter: phase4LogoConfig.filter,
                        transition: phase4LogoConfig.transition,
                        backgroundImage: `url(${phase0ImageSrc})`, // ✅ Gleiches Logo wie Phase 0
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',

                        // ✅ Performance-Optimierung
                        willChange: 'opacity, transform',
                        backfaceVisibility: 'hidden'
                    }}
                    data-logo-phase="4"
                    data-scroll-progress={scrollProgress.toFixed(3)}
                    data-phase4-progress={phase4Progress.toFixed(3)}
                    data-opacity={phase4Opacity.toFixed(3)}
                />
            )}

            {/* ✅ DEBUG-INFO für Development */}
            {process.env.NODE_ENV === 'development' && (
                <>
                    {/* Phase 0 Logo Debug */}
                    {phase0Opacity > 0.01 && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '10px',
                                left: '10px',
                                background: 'rgba(0, 200, 0, 0.9)',
                                color: 'white',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                zIndex: 9999,
                                pointerEvents: 'none',
                                lineHeight: '1.3'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                                🏠 PHASE 0 LOGO
                            </div>
                            <div>Scale: {phase0LogoScale.toFixed(2)}</div>
                            <div>Opacity: {phase0Opacity.toFixed(2)}</div>
                            <div>Progress: {(scrollProgress * 100).toFixed(1)}%</div>
                            <div>Pos: {config.position.top}/{config.position.left}</div>
                            <div>Z-Index: {phase0ZIndex}</div>
                        </div>
                    )}

                    {/* Phase 4 Logo Debug */}
                    {phase4LogoConfig && phase4LogoConfig.show && currentPhase === 4 && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(168, 128, 255, 0.9)',
                                color: 'white',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                zIndex: 9999,
                                pointerEvents: 'none',
                                lineHeight: '1.3'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                                🎨 PHASE 4 LOGO
                            </div>
                            <div>Phase Progress: {(phase4Progress * 100).toFixed(0)}%</div>
                            <div>Opacity: {phase4Opacity.toFixed(2)}</div>
                            <div>Scroll: {(scrollProgress * 100).toFixed(1)}%</div>
                            <div>Pos: {phase4LogoConfig.position.top}/{phase4LogoConfig.position.left}</div>
                            <div>Z-Index: {phase4LogoConfig.zIndex}</div>
                            <div>Scale: {phase4LogoConfig.scale}</div>
                            <div>Size: {phase4LogoConfig.width}×{phase4LogoConfig.height}</div>
                        </div>
                    )}

                    {/* Allgemeine Debug-Info */}
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '10px',
                            left: '10px',
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            zIndex: 9998,
                            pointerEvents: 'none'
                        }}
                    >
                        Current Phase: {currentPhase} |
                        Scroll: {(scrollProgress * 100).toFixed(1)}% |
                        Phase 0 Logo: {phase0Opacity > 0.01 ? '✅' : '❌'} |
                        Phase 4 Logo: {(phase4LogoConfig && phase4LogoConfig.show && currentPhase === 4) ? '✅' : '❌'}
                    </div>
                </>
            )}
        </>
    );
};

export default LogoLayer;