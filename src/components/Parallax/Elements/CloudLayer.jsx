// src/components/Parallax/Elements/CloudLayer.jsx
import React from 'react';
import { getPositionFromSegments } from '../utils/animationUtils';
import SafeImage from './SafeImage';
import { zIndices } from '../config/constants/index';
import ErrorBoundary from '../../ErrorBoundary';

const CloudLayer = ({ scrollProgress, leftConfig, rightConfig }) => {
    // Fehlerbehandlung für fehlende Konfiguration
    if (!leftConfig || !rightConfig) {
        console.warn('CloudLayer: Missing configuration');
        return null;
    }

    // Sichere Zugriffe auf Config-Werte mit Fallbacks
    const leftCloudSegments = leftConfig.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];
    const rightCloudSegments = rightConfig.segments || [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }];

    // Bildquellen mit Fallbacks
    const leftCloudSrc = leftConfig.imageSrc || "/Parallax/Wolken_Vorne_links.png";
    const rightCloudSrc = rightConfig.imageSrc || "/Parallax/Wolken_Vorne_rechts.png";

    // Z-Index mit Fallback (nutze leftConfig, dann rightConfig, dann zIndices)
    const zIndex = leftConfig.zIndex || rightConfig.zIndex || zIndices.clouds;

    // Berechne die aktuelle Position basierend auf den Segmenten
    const leftCloudPosition = getPositionFromSegments(leftCloudSegments, scrollProgress);
    const rightCloudPosition = getPositionFromSegments(rightCloudSegments, scrollProgress);

    return (
        <ErrorBoundary>
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: zIndex, // Verwende den konfigurierten Z-Index
                pointerEvents: 'none'
            }}>
                {/* Wolke links */}
                <div style={{
                    position: 'absolute',
                    bottom: leftConfig.position?.bottom || '50%',
                    left: `${leftCloudPosition}%`,
                    transition: 'left 0.3s ease-out'
                }}>
                    <SafeImage
                        src={leftCloudSrc}
                        style={{
                            width: leftConfig.size?.width || '30vw',
                            maxWidth: leftConfig.size?.maxWidth || '500px'
                        }}
                        alt="Wolken links"
                        onError={() => console.warn('Left cloud image failed to load')}
                    />
                </div>

                {/* Wolke rechts */}
                <div style={{
                    position: 'absolute',
                    bottom: rightConfig.position?.bottom || '50%',
                    right: `${rightCloudPosition}%`,
                    transition: 'right 0.3s ease-out'
                }}>
                    <SafeImage
                        src={rightCloudSrc}
                        style={{
                            width: rightConfig.size?.width || '25vw',
                            maxWidth: rightConfig.size?.maxWidth || '400px'
                        }}
                        alt="Wolken rechts"
                        onError={() => console.warn('Right cloud image failed to load')}
                    />
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default CloudLayer;