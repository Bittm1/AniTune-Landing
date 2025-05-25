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
import TitleLayer from './Elements/TitleLayer'; // ✅ WIEDER AKTIVIERT
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

    // ✅ ERWEITERT: useScrollProgress mit Lock-Snap Features
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
        currentTitleIndex,        // ✅ NEU
        isScrollLocked           // ✅ NEU
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

    // Komponenten-Initialisierung
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

    // Kompletter Reset der Komponente
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

    // Keyboard-Shortcut für Reset
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

    // Referenzen für die Abschnitte einrichten
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

    // Memoized components
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

    // ✅ ERWEITERTE Debug-Anzeige mit Lock-Snap Info
    const debugIndicator = useMemo(() => {
        const titleInfo = currentTitleIndex === -1
            ? "Logo+Newsletter"
            : `${currentTitleIndex + 1}/6 - "${config.titles?.[currentTitleIndex]?.text || 'N/A'}"`;

        return (
            <div className="debug-indicator">
                Phase: {titleInfo} | {isScrollLocked ? '🔒' : '🔓'}
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
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                    Scroll: {formattedScrollProgress.percentage} | Snap: {isSnapping ? '✨' : '-'}
                </div>
            </div>
        );
    }, [currentTitleIndex, isScrollLocked, config.titles, resetComponent, formattedScrollProgress.percentage, isSnapping]);

    // ✅ ERWEITERTE Section-Indikatoren - jetzt für Titel-Navigation + Logo Phase
    const sectionIndicators = useMemo(() => (
        <div className="section-indicators">
            <div style={{ fontSize: '10px', color: 'white', marginBottom: '5px', textAlign: 'center' }}>
                Navigation
            </div>
            {/* Logo+Newsletter Button */}
            <button
                className={`section-indicator ${currentTitleIndex === -1 ? 'active' : ''} ${isScrollLocked ? 'locked' : ''}`}
                onClick={() => {
                    if (!isScrollLocked) {
                        setCurrentTitleIndex(-1);
                        setActiveTitle(null);
                        gsap.to(window, {
                            duration: 1.5,
                            scrollTo: { y: 0 },
                            ease: "power2.inOut"
                        });
                    }
                }}
                aria-label="Go to Logo+Newsletter"
                disabled={isScrollLocked}
                style={{
                    opacity: isScrollLocked && currentTitleIndex !== -1 ? 0.3 : 1,
                    cursor: isScrollLocked ? 'not-allowed' : 'pointer',
                    backgroundColor: currentTitleIndex === -1 ? 'white' : 'rgba(255, 255, 255, 0.5)'
                }}
                title="Logo + Newsletter"
            />
            {/* Titel-Buttons */}
            {config.titles && config.titles.map((title, index) => (
                <button
                    key={index}
                    className={`section-indicator ${currentTitleIndex === index ? 'active' : ''} ${isScrollLocked ? 'locked' : ''}`}
                    onClick={() => !isScrollLocked && snapToTitle(index)}
                    aria-label={`Go to title: ${title.text}`}
                    disabled={isScrollLocked}
                    style={{
                        opacity: isScrollLocked && currentTitleIndex !== index ? 0.3 : 1,
                        cursor: isScrollLocked ? 'not-allowed' : 'pointer'
                    }}
                    title={title.text}
                />
            ))}
        </div>
    ), [currentTitleIndex, isScrollLocked, config.titles, snapToTitle]);

    // Alle Layer-Komponenten bleiben gleich
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

    // ✅ NEUER TitleLayer mit Lock-Snap Props
    const titleLayer = useMemo(() => (
        <TitleLayer
            scrollProgress={scrollProgress}
            titles={config.titles}
            currentTitleIndex={currentTitleIndex}  // ✅ NEU
            isScrollLocked={isScrollLocked}        // ✅ NEU
        />
    ), [scrollProgress, config.titles, currentTitleIndex, isScrollLocked]);

    const newsletterLayer = useMemo(() => {
        // ✅ Newsletter nur in Logo+Newsletter Phase (Index -1) sichtbar
        if (currentTitleIndex !== -1) return null;

        return <NewsletterLayer scrollProgress={scrollProgress} />;
    }, [scrollProgress, currentTitleIndex]);

    const scrollIndicator = useMemo(() => (
        <ScrollIndicator scrollProgress={scrollProgress} />
    ), [scrollProgress]);

    return (
        <ErrorBoundary fallback={errorFallback}>
            <div className="gsap-parallax-container" ref={containerRef} key={`container-${resetCount}`}>
                {/* Debug-Anzeige */}
                {debugIndicator}

                {/* Section-Indikatoren (jetzt für Titel-Navigation) */}
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

                    <ErrorBoundary>
                        <MemoizedLayer>{logoLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{cloudLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{wolkenHintenLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* ✅ TITEL-LAYER WIEDER AKTIVIERT */}
                    <ErrorBoundary>
                        <MemoizedLayer>{titleLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{newsletterLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {/* ✅ SCROLL-INDICATOR: Nur in Logo+Newsletter Phase */}
                    {currentTitleIndex === -1 && (
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