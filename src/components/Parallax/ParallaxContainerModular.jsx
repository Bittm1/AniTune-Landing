// src/components/Parallax/ParallaxContainerModular.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getConfig } from './config';
import BackgroundLayer from './Elements/BackgroundLayer';
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

// Wichtig: GSAP-Cache-Optionen setzen
gsap.config({
    autoSleep: 60,
    force3D: "auto",
    nullTargetWarn: false,
});

// Bekannte Probleme mit DevTools beheben
if (typeof window !== 'undefined') {
    // Scroll-Event-Listener bei Seiten-Reload entfernen
    window.addEventListener('beforeunload', () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.killTweensOf(window);
    });
}

const ParallaxContainerModular = () => {
    // Statusvariablen
    const [isInitialized, setIsInitialized] = useState(false);
    const [resetCount, setResetCount] = useState(0);

    // Refst
    const containerRef = useRef(null);
    const sectionsRef = useRef([]);
    const observerRef = useRef(null);

    // Konfiguration
    const config = useResponsiveConfig();

    const {
        scrollProgress,
        activeSection,
        setActiveSection,
        scrollToSection,
        formattedScrollProgress,
        updateScrollProgress
    } = useScrollProgress(containerRef, sectionsRef);    

    // ScrollTrigger komplett abbauen
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

        console.log("ScrollTrigger abgebaut");
    }, []);

    // Intersection Observer für das Snap-Verhalten
    const setupSectionObserver = useCallback(() => {
        if (typeof IntersectionObserver === 'undefined' || !containerRef.current) return;

        // Bestehenden Observer bereinigen
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Optionen für den Observer
        const options = {
            root: null, // Viewport
            rootMargin: '0px',
            threshold: 0.5, // 50% des Elements im Viewport
        };

        // Intersection Observer erstellen
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = parseInt(entry.target.dataset.sectionIndex, 10);
                    // Nur aktiven Abschnitt setzen, kein automatisches Scrollen
                    setActiveSection(sectionIndex);
                }
            });
        }, options);

        // Alle Abschnitte beobachten
        sectionsRef.current.forEach(section => {
            if (section) {
                observerRef.current.observe(section);
            }
        });

        console.log("Section Observer eingerichtet");

        // Aufräumen
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Komponenten-Initialisierung
    useEffect(() => {
        // Nur einmal initialisieren
        if (isInitialized) return;

        // Verzögerte Initialisierung für bessere Zuverlässigkeit
        const initTimer = setTimeout(() => {
            // ScrollTrigger bereinigen und Observer einrichten
            destroyScrollTrigger();
            const cleanupSectionObserver = setupSectionObserver();

            setIsInitialized(true);
            console.log("Parallax-Container initialisiert");

            // Aufräumen bei Komponenten-Unmount
            return () => {
                cleanupSectionObserver();
                destroyScrollTrigger();
            };
        }, 200);

        return () => clearTimeout(initTimer);
    }, [destroyScrollTrigger, setupSectionObserver, isInitialized]);

    // Kompletter Reset der Komponente
    const resetComponent = useCallback(() => {
        // Aktuellen Zustand speichern
        const currentSection = activeSection;

        // Komponente zurücksetzen
        destroyScrollTrigger();
        setIsInitialized(false);

        // Force reflow
        if (containerRef.current) {
            containerRef.current.style.display = 'none';
            void containerRef.current.offsetHeight;
            containerRef.current.style.display = '';
        }

        // Zähler erhöhen, um einen Re-Mount zu erzwingen
        setResetCount(prev => prev + 1);

        // Nach einer kurzen Verzögerung neu initialisieren
        setTimeout(() => {
            updateScrollProgress();
            setupSectionObserver();

            // Zur vorherigen Sektion zurückkehren
            const sectionHeight = window.innerHeight;
            window.scrollTo(0, currentSection * sectionHeight);

            setIsInitialized(true);
        }, 100);
    }, [activeSection, destroyScrollTrigger, updateScrollProgress, setupSectionObserver]);

    // Keyboard-Shortcut für Reset
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Alt+R für Komponenten-Reset
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                resetComponent();
                console.log("Komponenten-Reset durchgeführt");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [resetComponent]);

    // Referenzen für die Abschnitte einrichten
    const setSectionRef = (el, index) => {
        sectionsRef.current[index] = el;
    };

    return (
        <ErrorBoundary fallback={
            <div style={{ padding: '20px', textAlign: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        }>
            <div className="gsap-parallax-container" ref={containerRef} key={`container-${resetCount}`}>
                {/* Debug-Anzeige */}
                <div className="debug-indicator">
                    Scroll: {formattedScrollProgress.absolute}% | Section: {activeSection + 1}/7
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
                        Mode: Manual
                    </span>
                </div>

                {/* Section-Indikatoren (Navigation) */}
                <div className="section-indicators">
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                        <button
                            key={index}
                            className={`section-indicator ${activeSection === index ? 'active' : ''}`}
                            onClick={() => scrollToSection(index)}
                            aria-label={`Go to section ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Hintergrund-Layer (fixiert) */}
                <div className="fixed-layers">
                    <ErrorBoundary>
                        <BackgroundLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.background,
                                imageSrc: config.imageSources?.background
                            }}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <StarfieldLayer scrollProgress={scrollProgress} />
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <LogoLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.logo,
                                imageSrc: config.imageSources?.logo
                            }}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary>
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
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <TitleLayer
                            scrollProgress={scrollProgress}
                            titles={config.titles}
                            activeSection={activeSection}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <NewsletterLayer scrollProgress={scrollProgress} />
                    </ErrorBoundary>

                    {activeSection === 0 && (
                        <ErrorBoundary>
                            <ScrollIndicator scrollProgress={scrollProgress} />
                        </ErrorBoundary>
                    )}
                </div>

                {/* Scroll-Abschnitte */}
                <div className="gsap-sections-container">
                    {[0, 1, 2, 3, 4, 5, 6].map((index) => (
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
};

export default ParallaxContainerModular;