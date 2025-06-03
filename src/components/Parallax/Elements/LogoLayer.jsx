// src/components/Parallax/Elements/LogoLayer.jsx - KORRIGIERT für automatische Asset-Auswahl

import React from 'react';
import { getScaleFromSegments } from '../utils/animationUtils';

import {
    getActiveLogoPhase,
    generateLogoStyle,
    getLogoDebugInfo,
    validateLogoConfig,
    LOGO_ASSETS
} from '../config/logoConfig';

import { zIndices } from '../config/constants/index';

const LogoLayer = ({ scrollProgress, config }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!config) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('LogoLayer: Missing configuration - using central config only');
        }
    }

    // ZENTRALE LOGO-LOGIK: Bestimme aktive Logo-Phase
    const activeLogoPhase = getActiveLogoPhase(scrollProgress);
    const debugInfo = getLogoDebugInfo(scrollProgress);

    // FALLBACK für alte Konfiguration (Phase 0)
    // Falls die alte config noch verwendet wird, nutze sie für Phase 0
    let phase0LogoScale = 1;
    let phase0Opacity = 0;

    if (config && config.segments) {
        phase0LogoScale = getScaleFromSegments(config.segments, scrollProgress);
        phase0Opacity = Math.max(0, 1 - ((scrollProgress || 0) / 0.1));
    } else {
        // Nutze zentrale Berechnung
        phase0LogoScale = parseFloat(debugInfo.phases.phase0?.scale || 1);
        phase0Opacity = parseFloat(debugInfo.phases.phase0?.opacity || 0);
    }

    // ✅ KORREKTUR: Lass generateLogoStyle automatisch das richtige Asset wählen
    // Übergebe KEIN imageSrc, damit die automatische Auswahl funktioniert

    return (
        <>
            {/* PHASE 0 LOGO - Kompatibilität mit alter und neuer Konfiguration */}
            {(phase0Opacity > 0.01 || debugInfo.phases.phase0?.visible) && (
                <div
                    style={config && config.segments ? {
                        // FALLBACK: Alte Konfiguration
                        position: 'fixed',
                        top: config.position?.top || '33%',
                        left: config.position?.left || '50%',
                        transform: `translate(-50%, -50%) scale(${phase0LogoScale})`,
                        zIndex: config.zIndex || zIndices.logo,
                        pointerEvents: 'none',
                        opacity: phase0Opacity,
                        transition: 'opacity 800ms ease-out',
                        width: config.size || '200px',
                        height: config.size || '200px',
                        backgroundImage: `url(${config.imageSrc || LOGO_ASSETS.default})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'opacity',
                    } : generateLogoStyle('phase0', scrollProgress)} // ✅ KEIN imageSrc übergeben
                    data-logo-phase="0"
                    data-scroll-progress={scrollProgress.toFixed(3)}
                    data-opacity={config && config.segments ? phase0Opacity.toFixed(3) : debugInfo.phases.phase0?.opacity}
                    data-scale={config && config.segments ? phase0LogoScale.toFixed(3) : debugInfo.phases.phase0?.scale}
                    data-config-source={config && config.segments ? 'legacy' : 'central'}
                />
            )}

            {/* PHASE 4 LOGO - Nur zentrale Konfiguration */}
            {debugInfo.phases.phase4?.visible && (
                <div
                    style={generateLogoStyle('phase4', scrollProgress)} // ✅ KEIN imageSrc übergeben - automatische Auswahl!
                    data-logo-phase="4"
                    data-scroll-progress={scrollProgress.toFixed(3)}
                    data-opacity={debugInfo.phases.phase4.opacity}
                    data-scale={debugInfo.phases.phase4.scale}
                    data-config-source="central"
                    data-asset={debugInfo.phases.phase4.asset} // ✅ NEU: Zeigt welches Asset verwendet wird
                />
            )}

            {/* ✅ NUR DEVELOPMENT: DEBUG-INFO */}
            {process.env.NODE_ENV === 'development' && (
                <>
                    {/* Phase 0 Logo Debug */}
                    {(phase0Opacity > 0.01 || debugInfo.phases.phase0?.visible) && (
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
                                🏠 PHASE 0 LOGO {config && config.segments ? '(LEGACY)' : '(ZENTRAL)'}
                            </div>
                            <div>Scale: {config && config.segments ? phase0LogoScale.toFixed(2) : debugInfo.phases.phase0?.scale}</div>
                            <div>Opacity: {config && config.segments ? phase0Opacity.toFixed(2) : debugInfo.phases.phase0?.opacity}</div>
                            <div>Progress: {(scrollProgress * 100).toFixed(1)}%</div>
                            <div>Asset: {debugInfo.phases.phase0?.asset || 'default'}</div>
                            <div>Config: {config && config.segments ? 'Legacy' : 'Central'}</div>
                            {config && config.segments && (
                                <div style={{ fontSize: '9px', color: '#ffff00' }}>
                                    ⚠️ Nutzt alte Konfiguration
                                </div>
                            )}
                        </div>
                    )}

                    {/* Phase 4 Logo Debug */}
                    {debugInfo.phases.phase4?.visible && (
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
                                🎨 PHASE 4 LOGO (ZENTRAL)
                            </div>
                            <div>Scale: {debugInfo.phases.phase4.scale}</div>
                            <div>Opacity: {debugInfo.phases.phase4.opacity}</div>
                            <div>Range: {debugInfo.phases.phase4.range}</div>
                            <div>Asset: {debugInfo.phases.phase4.asset}</div> {/* ✅ NEU: Asset-Info */}
                            <div>Progress: {debugInfo.debugPercentage}</div>
                            <div style={{ marginTop: '4px', fontSize: '10px', color: '#ffff00' }}>
                                🔧 AUTOMATISCHE ASSET-AUSWAHL
                            </div>
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
                        ✅ LOGO-IMPORTS KORRIGIERT |
                        Active: {activeLogoPhase || 'none'} |
                        Progress: {debugInfo.debugPercentage} |
                        Phase0: {(phase0Opacity > 0.01 || debugInfo.phases.phase0?.visible) ? '✅' : '❌'} |
                        Phase4: {debugInfo.phases.phase4?.visible ? '✅' : '❌'} |
                        Asset Fix: ✅
                    </div>

                    {/* Asset-Status */}
                    <div
                        style={{
                            position: 'fixed',
                            bottom: '35px',
                            left: '10px',
                            background: 'rgba(76, 175, 80, 0.9)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontFamily: 'monospace',
                            zIndex: 9998,
                            pointerEvents: 'none'
                        }}
                    >
                        📦 ASSETS: Phase0={debugInfo.phases.phase0?.asset || 'default'} | Phase4={debugInfo.phases.phase4?.asset || 'none'}
                    </div>

                    {/* Konfiguration-Validierung */}
                    {(() => {
                        const warnings = validateLogoConfig();
                        return warnings.length > 0 && (
                            <div
                                style={{
                                    position: 'fixed',
                                    bottom: '60px',
                                    left: '10px',
                                    background: 'rgba(255, 69, 0, 0.9)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '9px',
                                    fontFamily: 'monospace',
                                    zIndex: 9998,
                                    pointerEvents: 'none'
                                }}
                            >
                                ⚠️ LOGO-CONFIG WARNUNGEN: {warnings.length}
                                <br />
                                {warnings.slice(0, 2).join(' | ')}
                            </div>
                        );
                    })()}
                </>
            )}
        </>
    );
};

export default LogoLayer;