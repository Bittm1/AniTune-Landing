// src/components/Parallax/ParallaxContainerModular.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getConfig } from './config';
import BackgroundLayer from './Elements/BackgroundLayer';
import CloudLayer from './Elements/CloudLayer';
import WolkenHintenLayer from './Elements/WolkenHintenLayer';
import ForestLayer from './Elements/ForestLayer';
import BergeLayer from './Elements/BergeLayer';
import TalLayer from './Elements/TalLayer';
import WaldHintenLayer from './Elements/WaldHintenLayer';
import RoadLayer from './Elements/RoadLayer';
import DogLayer from './Elements/DogLayer';
import MengeLayer from './Elements/MengeLayer';
import StarfieldLayer from './Elements/StarfieldLayer';
import LogoLayer from './Elements/LogoLayer';
import TitleLayer from './Elements/TitleLayer';
import TitleAudioLayer from './Elements/TitleAudioLayer';
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
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

// Bekannte Probleme mit DevTools beheben
if (typeof window !== 'undefined') {
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

    // ✅ ERWEITERTE SCROLL-PROGRESS mit Phase 0 Support
    const {
        scrollProgress,
        activeSection,
        setActiveSection,
        scrollToSection,
        formattedScrollProgress,
        updateScrollProgress,
        activeTitle,
        isSnapping,
        snapToTitle,
        scrollToTitleIndex,
        handleKeyboardNavigation,
        currentTitleIndex,        // ✅ Jetzt 0-6 (0=Logo, 1-6=Titel)
        isScrollLocked,
        // ✅ NEUE PHASE-HELPER
        isLogoPhase,             // true wenn currentTitleIndex === 0
        isTitlePhase,            // true wenn currentTitleIndex > 0
        currentPhaseDescription, // String-Beschreibung der aktuellen Phase
        timingInfo               // Debug-Info
    } = useScrollProgress(containerRef, sectionsRef, config.titles);

    // ScrollTrigger komplett abbauen - Optimiert
    const destroyScrollTrigger = useCallback(() => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.killTweensOf(window);

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

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.5, 0.9],
        };

        let debounceTimer;
        observerRef.current = new IntersectionObserver((entries) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        const sectionIndex = parseInt(entry.target.dataset.sectionIndex, 10);
                        if (!isResetting) {
                            setActiveSection(sectionIndex);
                        }
                    }
                });
            }, 50);
        }, options);

        sectionsRef.current.forEach(section => {
            if (section) {
                observerRef.current.observe(section);
            }
        });

        if (process.env.NODE_ENV === 'development') {
            console.log("Section Observer eingerichtet");
        }

        return () => {
            clearTimeout(debounceTimer);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isResetting, setActiveSection]);

    // Komponenten-Initialisierung mit optimierten Abhängigkeiten
    useEffect(() => {
        if (isInitialized) return;

        if (process.env.NODE_ENV === 'development') {
            performanceRef.current.startTime = performance.now();
        }

        const initTimer = setTimeout(() => {
            destroyScrollTrigger();
            const cleanupSectionObserver = setupSectionObserver();

            setIsInitialized(true);

            if (process.env.NODE_ENV === 'development') {
                performanceRef.current.lastRenderTime = performance.now() - performanceRef.current.startTime;
                console.log(`Parallax-Container initialisiert in ${performanceRef.current.lastRenderTime.toFixed(2)}ms`);
            }

            const handleResize = () => {
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
        if (isResetting) return;
        setIsResetting(true);

        const currentSection = activeSection;

        destroyScrollTrigger();
        setIsInitialized(false);

        if (containerRef.current) {
            requestAnimationFrame(() => {
                containerRef.current.style.visibility = 'hidden';

                requestAnimationFrame(() => {
                    void containerRef.current.offsetHeight;
                    containerRef.current.style.visibility = 'visible';

                    setResetCount(prev => prev + 1);

                    setTimeout(() => {
                        updateScrollProgress();
                        setupSectionObserver();

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
    }, [resetCount]);

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

    // ✅ ERWEITERTE DEBUG-ANZEIGE: 7 Phasen (0-6)
    const debugIndicator = useMemo(() => (
        <div className="debug-indicator">
            Scroll: {formattedScrollProgress.absolute}% | Section: {activeSection + 1}/14
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
                Phase: {currentTitleIndex}/6 ({currentPhaseDescription})
            </div>
            <div style={{ fontSize: '10px' }}>
                Timing: {timingInfo.preset} | Lock: {isScrollLocked ? '🔒' : '🔓'} | Konfig: ✅
            </div>
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
        </div>
    ), [formattedScrollProgress.absolute, activeSection, resetComponent, scrollProgress, currentTitleIndex, currentPhaseDescription, timingInfo, isScrollLocked]);

    // ✅ ERWEITERTE SECTION-INDIKATOREN: 7 Phasen (0-6)
    const sectionIndicators = useMemo(() => (
        <div className="section-indicators">
            {/* Phase 0: Logo/Newsletter */}
            <button
                className={`section-indicator ${currentTitleIndex === 0 ? 'active logo-phase' : ''}`}
                onClick={() => scrollToTitleIndex(0)}
                aria-label="Go to Logo/Newsletter (Phase 0)"
                title="Phase 0: Logo/Newsletter"
                style={{
                    backgroundColor: currentTitleIndex === 0 ? '#00ff00' : 'rgba(255, 255, 255, 0.5)'
                }}
            />

            {/* Phase 1-6: Titel */}
            {config.titles?.map((title, index) => (
                <button
                    key={index}
                    className={`section-indicator ${currentTitleIndex === index + 1 ? 'active title-phase' : ''}`}
                    onClick={() => scrollToTitleIndex(index + 1)}
                    aria-label={`Go to ${title.text} (Phase ${index + 1})`}
                    title={`Phase ${index + 1}: ${title.text}`}
                    style={{
                        backgroundColor: currentTitleIndex === index + 1 ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'
                    }}
                />
            )) || []}
        </div>
    ), [currentTitleIndex, scrollToTitleIndex, config.titles]);

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

    const bergeLayer = useMemo(() => (
        <BergeLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.berge,
                imageSrc: config.imageSources?.berge || config.berge?.imageSrc
            }}
        />
    ), [scrollProgress, config.berge, config.imageSources?.berge]);

    const talLayer = useMemo(() => (
        <TalLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.tal,
                imageSrc: config.imageSources?.tal || config.tal?.imageSrc
            }}
        />
    ), [scrollProgress, config.tal, config.imageSources?.tal]);

    const waldHintenLayer = useMemo(() => (
        <WaldHintenLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.waldHinten,
                imageSrc: config.imageSources?.waldHinten || config.waldHinten?.imageSrc
            }}
        />
    ), [scrollProgress, config.waldHinten, config.imageSources?.waldHinten]);

    const roadLayer = useMemo(() => (
        <RoadLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.road,
                imageSrc: config.imageSources?.road || config.road?.imageSrc
            }}
        />
    ), [scrollProgress, config.road, config.imageSources?.road]);

    const dogLayer = useMemo(() => (
        <DogLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.dog,
                imageSrc: config.imageSources?.dog || config.dog?.imageSrc
            }}
        />
    ), [scrollProgress, config.dog, config.imageSources?.dog]);

    const mengeLayer = useMemo(() => (
        <MengeLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.menge,
                imageSrc: config.imageSources?.menge || config.menge?.imageSrc
            }}
        />
    ), [scrollProgress, config.menge, config.imageSources?.menge]);

    const wolkenHintenLayer = useMemo(() => (
        <WolkenHintenLayer
            scrollProgress={scrollProgress}
            leftConfig={{
                ...config.leftCloudHinten,
                imageSrc: config.imageSources?.leftCloudHinten
            }}
            rightConfig={{
                ...config.rightCloudHinten,
                imageSrc: config.imageSources?.rightCloudHinten
            }}
        />
    ), [scrollProgress, config.leftCloudHinten, config.rightCloudHinten, config.imageSources?.leftCloudHinten, config.imageSources?.rightCloudHinten]);

    // Logo-Layer: ZURÜCK ZU ORIGINAL (keine Phase-Kontrolle)
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

    // Title-Layer: Nur interne Logik erweitert, visuell wie vorher
    const titleLayer = useMemo(() => (
        <TitleLayer
            scrollProgress={scrollProgress}
            titles={config.titles}
            currentTitleIndex={currentTitleIndex}     // ✅ Interne Phase-Logik
            isScrollLocked={isScrollLocked}
        />
    ), [scrollProgress, config.titles, currentTitleIndex, isScrollLocked]);

    // ✅ KORRIGIERT: Nur EINE TitleAudioLayer mit allen Props
    const audioLayer = useMemo(() => (
        <TitleAudioLayer
            currentTitleIndex={currentTitleIndex}
            isScrollLocked={isScrollLocked}
            scrollToTitleIndex={scrollToTitleIndex}
        />
    ), [currentTitleIndex, isScrollLocked, scrollToTitleIndex]);

    // Newsletter-Layer: ZURÜCK ZU ORIGINAL (keine Phase-Kontrolle)
    const newsletterLayer = useMemo(() => (
        <NewsletterLayer scrollProgress={scrollProgress} />
    ), [scrollProgress]);

    // Scroll-Indicator: ZURÜCK ZU ORIGINAL (nur activeSection-basiert)
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
                        <MemoizedLayer>{bergeLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{talLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{waldHintenLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{forestLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{roadLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{dogLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{mengeLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* Logo: ZURÜCK ZU ORIGINAL */}
                    <ErrorBoundary>
                        <MemoizedLayer>{logoLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{cloudLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{wolkenHintenLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* Titel: Mit interner Phase 0 Logik */}
                    <ErrorBoundary>
                        <MemoizedLayer>{titleLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* ✅ KORRIGIERT: Nur EINE Audio-Layer mit allen Props */}
                    <ErrorBoundary>
                        <MemoizedLayer>{audioLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* Newsletter: ZURÜCK ZU ORIGINAL */}
                    <ErrorBoundary>
                        <MemoizedLayer>{newsletterLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* Scroll-Indicator: ZURÜCK ZU ORIGINAL */}
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