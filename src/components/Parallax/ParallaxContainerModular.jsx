// src/components/Parallax/ParallaxContainerModular.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { getConfig } from './config';
import BackgroundLayer from './Elements/BackgroundLayer';
import StarfieldLayer from './Elements/StarfieldLayer';
import LogoLayer from './Elements/LogoLayer';
import CloudLayer from './Elements/CloudLayer';
import TitleLayer from './Elements/TitleLayer';
import NewsletterLayer from './Elements/NewsletterLayer';
import ScrollIndicator from './Elements/ScrollIndicator';
import ErrorBoundary from '../ErrorBoundary';

const ParallaxContainerModular = () => {
    const parallaxRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [config, setConfig] = useState(() => {
        try {
            return getConfig();
        } catch (error) {
            console.error('Failed to load configuration:', error);
            // Grundlegende Fallback-Konfiguration
            return {
                background: { startScale: 1.5, endScale: 1.0 },
                logo: { segments: [{ scrollStart: 0, scrollEnd: 1, scaleStart: 1, scaleEnd: 1 }] },
                leftCloud: { segments: [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }] },
                rightCloud: { segments: [{ scrollStart: 0, scrollEnd: 1, posStart: 0, posEnd: 0 }] }
            };
        }
    });

    // Optimierter Scroll-Handler mit useCallback
    const handleScroll = useCallback(() => {
        if (!parallaxRef.current) return;

        try {
            const current = parallaxRef.current.current;
            const total = parallaxRef.current.space;

            if (typeof current === 'number' && typeof total === 'number') {
                const rawProgress = current / total;
                let slowedProgress;

                if (rawProgress < 0.35) {
                    // Erste 35%: Normal
                    slowedProgress = rawProgress;
                } else {
                    // Rest: 100x langsamer
                    // Offset berechnen: 0.35 (normaler Bereich endet hier)
                    slowedProgress = 0.35 + (rawProgress - 0.35) * 0.05; // Faktor 0.01 = 100x langsamer
                }

                console.log(`Raw: ${rawProgress.toFixed(3)}, Slowed: ${slowedProgress.toFixed(3)}`);
                setScrollProgress(slowedProgress);
            }
        } catch (error) {
            console.error('Error in scroll handler:', error);
        }
    }, []);

    // Optimierter Resize-Handler mit useCallback
    const handleResize = useCallback(() => {
        try {
            setConfig(getConfig());
        } catch (error) {
            console.error('Error updating configuration on resize:', error);
        }
    }, []);

    // Optimierte Scroll-Event-Registrierung
    useEffect(() => {
        try {
            const container = parallaxRef.current?.container?.current;
            if (container) {
                container.addEventListener('scroll', handleScroll, { passive: true });
                handleScroll(); // Initial call
            }

            return () => {
                if (container) {
                    container.removeEventListener('scroll', handleScroll);
                }
            };
        } catch (error) {
            console.error('Error setting up scroll listener:', error);
        }
    }, [handleScroll]);

    // Optimierte Resize-Event-Registrierung
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // Formatierter Scroll-Progress mit useMemo
    const formattedScrollProgress = useMemo(() => {
        // Normalisierter Wert für Komponenten (0-100%)
        const normalizedProgress = Math.min(1, Math.max(0, scrollProgress)) * 100;
        // Absoluter Seitenwert (kann über 100% gehen)
        const absolutePageValue = (scrollProgress * 100);

        return {
            normalized: normalizedProgress.toFixed(0),
            absolute: absolutePageValue.toFixed(0)
        };
    }, [scrollProgress]);

    return (
        <ErrorBoundary fallback={
            <div style={{ padding: '20px', textAlign: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <h2>Es gab ein Problem beim Laden der Parallax-Effekte</h2>
                    <p>Bitte versuche die Seite neu zu laden</p>
                </div>
            </div>
        }>
            <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                {/* Debug-Anzeige - Jetzt mit memoisiertem Wert */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px',
                    zIndex: 1000
                }}>
                    Scroll: {formattedScrollProgress.absolute}% | Seite: {(parseFloat(formattedScrollProgress.absolute) / 100 + 1).toFixed(2)}
                </div>

                {/* Einzelne Komponenten mit ErrorBoundary */}
                <ErrorBoundary>
                    <BackgroundLayer
                        scrollProgress={Math.min(1, Math.max(0, scrollProgress))}
                        config={config.background}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <StarfieldLayer scrollProgress={Math.min(1, Math.max(0, scrollProgress))} />
                </ErrorBoundary>

                <ErrorBoundary>
                    <LogoLayer
                        scrollProgress={Math.min(1, Math.max(0, scrollProgress))}
                        config={config.logo}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <CloudLayer
                        scrollProgress={Math.min(1, Math.max(0, scrollProgress))}
                        leftConfig={config.leftCloud}
                        rightConfig={config.rightCloud}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <TitleLayer
                        scrollProgress={Math.min(1, Math.max(0, scrollProgress))}
                        titles={config.titles}
                    />
                </ErrorBoundary>

                <ErrorBoundary>
                    <NewsletterLayer scrollProgress={Math.min(1, Math.max(0, scrollProgress))} />
                </ErrorBoundary>

                <ErrorBoundary>
                    <ScrollIndicator scrollProgress={Math.min(1, Math.max(0, scrollProgress))} />
                </ErrorBoundary>

                {/* Parallax nur für den Scrollbereich - keine Änderung */}
                <Parallax pages={20} ref={parallaxRef} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <ParallaxLayer key={index} offset={index} speed={0} factor={1} />
                    ))}
                </Parallax>
            </div>
        </ErrorBoundary>
    );
};

export default ParallaxContainerModular;