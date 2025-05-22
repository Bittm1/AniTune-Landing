// src/components/Parallax/ParallaxContainerModular.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getConfig } from './config';
import BackgroundLayer from './Elements/BackgroundLayer';
import ForestLayer from './Elements/ForestLayer';
import StarfieldLayer from './Elements/StarfieldLayer';
import LogoLayer from './Elements/LogoLayer';
import CloudLayer from './Elements/CloudLayer';
import TitleLayer from './Elements/TitleLayer';
import NewsletterLayer from './Elements/NewsletterLayer';
import ScrollIndicator from './Elements/ScrollIndicator';
import ErrorBoundary from '../ErrorBoundary';
import gsap from 'gsap';

// Hooks Import
import { useScrollProgress } from './hooks/useScrollProgress';
import { useResponsiveConfig } from './hooks/useResponsiveConfig';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './gsap-scroll.css';

// GSAP-Plugins registrieren
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Optimierte GSAP-Cache-Optionen setzen
gsap.config({
    autoSleep: 60,
    force3D: "auto",
    nullTargetWarn: false,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load", // Reduzierte Events für bessere Performance
});

// Bekannte Probleme mit DevTools beheben
if (typeof window !== 'undefined') {
    // Scroll-Event-Listener bei Seiten-Reload entfernen
    window.addEventListener('beforeunload', () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.killTweensOf(window);
    });
}

// Layer-Komponente mit Memo umwickeln für bessere Performance
const MemoizedLayer = React.memo(({ children }) => children);

const ParallaxContainerModular = React.memo(() => {
    // Statusvariablen
    const [isInitialized, setIsInitialized] = useState(false);
    const [resetCount, setResetCount] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    // Refs
    const containerRef = useRef(null);
    const sectionsRef = useRef([]);
    const observerRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    // Konfiguration
    const config = useResponsiveConfig();

    // Performance-Messung im Entwicklungsmodus
    const performanceRef = useRef({
        startTime: 0,
        lastRenderTime: 0
    });

    const {
        scrollProgress,
        activeSection,
        setActiveSection,
        scrollToSection,
        formattedScrollProgress,
        updateScrollProgress
    } = useScrollProgress(containerRef, sectionsRef);

    // ScrollTrigger komplett abbauen - Optimiert
    const destroyScrollTrigger = useCallback(() => {
        // Alle ScrollTrigger bereinigen
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        // Alle GSAP-Animationen stoppen
        gsap.killTweensOf(window);

        // ScrollTrigger-Events vom Window entfernen
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', ScrollTrigger.update);
            window.removeEventListener('resize', ScrollTrigger.update);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log("ScrollTrigger abgebaut");
        }
    }, []);

    // Optimierter Intersection Observer für das Snap-Verhalten
    const setupSectionObserver = useCallback(() => {
        if (typeof IntersectionObserver === 'undefined' || !containerRef.current) return;

        // Bestehenden Observer bereinigen
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Optionen für den Observer - Optimierte Threshold-Werte
        const options = {
            root: null, // Viewport
            rootMargin: '0px',
            threshold: [0.1, 0.5, 0.9], // Mehrere Schwellenwerte für präzisere Kontrolle
        };

        // Intersection Observer erstellen mit Debounce
        let debounceTimer;
        observerRef.current = new IntersectionObserver((entries) => {
            // Debounce implementieren um zu häufige Updates zu vermeiden
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        const sectionIndex = parseInt(entry.target.dataset.sectionIndex, 10);
                        // Nur aktiven Abschnitt setzen, kein automatisches Scrollen
                        if (!isResetting) {
                            setActiveSection(sectionIndex);
                        }
                    }
                });
            }, 50);
        }, options);

        // Alle Abschnitte beobachten
        sectionsRef.current.forEach(section => {
            if (section) {
                observerRef.current.observe(section);
            }
        });

        if (process.env.NODE_ENV === 'development') {
            console.log("Section Observer eingerichtet");
        }

        // Aufräumen
        return () => {
            clearTimeout(debounceTimer);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isResetting, setActiveSection]);

    // Komponenten-Initialisierung mit optimierten Abhängigkeiten
    useEffect(() => {
        // Nur einmal initialisieren
        if (isInitialized) return;

        // Performancemessung im Development
        if (process.env.NODE_ENV === 'development') {
            performanceRef.current.startTime = performance.now();
        }

        // Verzögerte Initialisierung für bessere Zuverlässigkeit
        const initTimer = setTimeout(() => {
            // ScrollTrigger bereinigen und Observer einrichten
            destroyScrollTrigger();
            const cleanupSectionObserver = setupSectionObserver();

            setIsInitialized(true);

            if (process.env.NODE_ENV === 'development') {
                performanceRef.current.lastRenderTime = performance.now() - performanceRef.current.startTime;
                console.log(`Parallax-Container initialisiert in ${performanceRef.current.lastRenderTime.toFixed(2)}ms`);
            }

            // Optimierte Window-Resize-Behandlung
            const handleResize = () => {
                // Debounce the resize handler
                if (resizeTimeoutRef.current) {
                    clearTimeout(resizeTimeoutRef.current);
                }

                resizeTimeoutRef.current = setTimeout(() => {
                    updateScrollProgress();
                    if (process.env.NODE_ENV === 'development') {
                        console.log("Window resized - scroll progress updated");
                    }
                }, 200);
            };

            window.addEventListener('resize', handleResize);

            // Aufräumen bei Komponenten-Unmount
            return () => {
                if (cleanupSectionObserver && typeof cleanupSectionObserver === 'function') {
                    cleanupSectionObserver();
                }
                destroyScrollTrigger();
                clearTimeout(resizeTimeoutRef.current);
                window.removeEventListener('resize', handleResize);
            };
        }, 200);

        return () => clearTimeout(initTimer);
    }, [destroyScrollTrigger, setupSectionObserver, isInitialized, updateScrollProgress]);

    // Kompletter Reset der Komponente - Optimiert für Performance
    const resetComponent = useCallback(() => {
        // Verhindere mehrfache Resets
        if (isResetting) return;
        setIsResetting(true);

        // Aktuellen Zustand speichern
        const currentSection = activeSection;

        // Komponente zurücksetzen
        destroyScrollTrigger();
        setIsInitialized(false);

        // Force reflow - Optimiert mit requestAnimationFrame
        if (containerRef.current) {
            requestAnimationFrame(() => {
                containerRef.current.style.visibility = 'hidden';

                // Force reflow in einem separaten Frame
                requestAnimationFrame(() => {
                    void containerRef.current.offsetHeight;
                    containerRef.current.style.visibility = 'visible';

                    // Zähler erhöhen, um einen Re-Mount zu erzwingen
                    setResetCount(prev => prev + 1);

                    // Nach einer kurzen Verzögerung neu initialisieren
                    setTimeout(() => {
                        updateScrollProgress();
                        setupSectionObserver();

                        // Zur vorherigen Sektion zurückkehren
                        const sectionHeight = window.innerHeight;
                        window.scrollTo({
                            top: currentSection * sectionHeight,
                            behavior: 'auto'
                        });

                        setIsInitialized(true);
                        setIsResetting(false);

                        if (process.env.NODE_ENV === 'development') {
                            console.log("Komponenten-Reset abgeschlossen");
                        }
                    }, 100);
                });
            });
        }
    }, [activeSection, destroyScrollTrigger, updateScrollProgress, setupSectionObserver, isResetting]);

    // Keyboard-Shortcut für Reset - Optimiert
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Alt+R für Komponenten-Reset
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                resetComponent();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [resetComponent]);

    // Referenzen für die Abschnitte einrichten - Optimiert mit useCallback
    const setSectionRef = useCallback((el, index) => {
        sectionsRef.current[index] = el;
    }, []);

    // Performance-Tracking im Entwicklungsmodus
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const startTime = performance.now();

            return () => {
                const endTime = performance.now();
                console.log(`Parallax component render time: ${endTime - startTime}ms`);
            };
        }
    }, [resetCount]); // Nur bei grundlegenden Änderungen messen

    // Memoize the fallback component to prevent unnecessary re-renders
    const errorFallback = useMemo(() => (
        <div style={{
            padding: '20px',
            textAlign: 'center',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            color: 'white'
        }}>
            <div>
                <h2>Es gab ein Problem beim Laden der Parallax-Effekte</h2>
                <p>Bitte versuche die Seite neu zu laden</p>
                <button
                    onClick={resetComponent}
                    style={{
                        padding: '10px 15px',
                        margin: '10px',
                        background: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Animations neu laden
                </button>
            </div>
        </div>
    ), [resetComponent]);

    // Memoize the debug indicator to prevent unnecessary re-renders
    // Debug-Anzeige (ca. Zeile 200-220):
    const debugIndicator = useMemo(() => (
        <div className="debug-indicator">
            Scroll: {formattedScrollProgress.absolute}% | Section: {activeSection + 1}/14
            <button
                onClick={resetComponent}
                style={{
                    marginLeft: '10px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    background: '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                ↻
            </button>
            <span style={{ marginLeft: '10px', fontSize: '11px', color: '#aaa' }}>
                Phase: {scrollProgress <= 1 ? '1 (0-100%)' : '2 (100-200%)'}
            </span>
        </div>
    ), [formattedScrollProgress.absolute, activeSection, resetComponent, scrollProgress]);

    // Memoize the section indicators to prevent unnecessary re-renders
    const sectionIndicators = useMemo(() => (
        <div className="section-indicators">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((index) => (
                <button
                    key={index}
                    className={`section-indicator ${activeSection === index ? 'active' : ''}`}
                    onClick={() => scrollToSection(index)}
                    aria-label={`Go to section ${index + 1}`}
                />
            ))}
        </div>
    ), [activeSection, scrollToSection]);
    

    // Memoize the layers to prevent unnecessary re-renders
    const backgroundLayer = useMemo(() => (
        <BackgroundLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.background,
                imageSrc: config.imageSources?.background
            }}
        />
    ), [scrollProgress, config.background, config.imageSources?.background]);

    const starfieldLayer = useMemo(() => (
        <StarfieldLayer scrollProgress={scrollProgress} />
    ), [scrollProgress]);

    const forestLayer = useMemo(() => (
        <ForestLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.forest,
                imageSrc: config.imageSources?.forest || config.forest?.imageSrc
            }}
        />
    ), [scrollProgress, config.forest, config.imageSources?.forest]);

    const logoLayer = useMemo(() => (
        <LogoLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.logo,
                imageSrc: config.imageSources?.logo
            }}
        />
    ), [scrollProgress, config.logo, config.imageSources?.logo]);

    const cloudLayer = useMemo(() => (
        <CloudLayer
            scrollProgress={scrollProgress}
            leftConfig={{
                ...config.leftCloud,
                imageSrc: config.imageSources?.leftCloud
            }}
            rightConfig={{
                ...config.rightCloud,
                imageSrc: config.imageSources?.rightCloud
            }}
        />
    ), [scrollProgress, config.leftCloud, config.rightCloud, config.imageSources?.leftCloud, config.imageSources?.rightCloud]);

    const titleLayer = useMemo(() => (
        <TitleLayer
            scrollProgress={scrollProgress}
            titles={config.titles}
            activeSection={activeSection}
        />
    ), [scrollProgress, config.titles, activeSection]);

    const newsletterLayer = useMemo(() => (
        <NewsletterLayer scrollProgress={scrollProgress} />
    ), [scrollProgress]);

    const scrollIndicator = useMemo(() => (
        <ScrollIndicator scrollProgress={scrollProgress} />
    ), [scrollProgress]);

    return (
        <ErrorBoundary fallback={errorFallback}>
            <div className="gsap-parallax-container" ref={containerRef} key={`container-${resetCount}`}>
                {/* Debug-Anzeige */}
                {debugIndicator}

                {/* Section-Indikatoren (Navigation) */}
                {sectionIndicators}

                {/* Hintergrund-Layer (fixiert) */}
                <div className="fixed-layers">
                    <ErrorBoundary>
                        <MemoizedLayer>{backgroundLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{starfieldLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{forestLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{logoLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{cloudLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{titleLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{newsletterLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {activeSection === 0 && (
                        <ErrorBoundary>
                            <MemoizedLayer>{scrollIndicator}</MemoizedLayer>
                        </ErrorBoundary>
                    )}
                </div>

                {/* Scroll-Abschnitte */}
                <div className="gsap-sections-container">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((index) => (
                        <section
                            key={`section-${index}-${resetCount}`}
                            ref={(el) => setSectionRef(el, index)}
                            className="gsap-section"
                            data-section-index={index}
                        ></section>
                    ))}
                </div>
            </div>
        </ErrorBoundary>
    );
});

export default ParallaxContainerModular;