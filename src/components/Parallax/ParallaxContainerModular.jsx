// src/components/Parallax/ParallaxContainerModular.jsx - ERWEITERT für Phase 8 - DEBUG NUR LOKAL

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
import Newsletter from '../Newsletter/Newsletter';
import AniTuneCarousel from './Elements/AniTuneCarousel';
import Phase8NewsletterLayer from './Elements/Phase8NewsletterLayer';
import ScrollIndicator from './Elements/ScrollIndicator';
import ErrorBoundary from '../ErrorBoundary';
import gsap from 'gsap';
import { getSnapConfigDebugInfo, validateSnapConfig } from './config/snapConfig';

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

    // Newsletter Subscription Tracking
    const [hasSubscribed, setHasSubscribed] = useState(false);
    const [subscriptionSource, setSubscriptionSource] = useState(null);

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

    // SCROLL-PROGRESS mit Phase 8 Support
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
        currentTitleIndex,
        isScrollLocked,
        isLogoPhase,
        isTitlePhase,
        isCarouselPhase,
        isNewsletterPhase,
        currentPhaseDescription,
        timingInfo
    } = useScrollProgress(containerRef, sectionsRef, config.titles);

    // Newsletter Subscription Handler
    const handleSubscriptionChange = useCallback((subscribed, source = 'unknown') => {
        // ✅ NUR DEVELOPMENT: Console-Log
        if (process.env.NODE_ENV === 'development') {
            console.log(`📧 Newsletter-Anmeldung: ${subscribed} (Quelle: ${source})`);
        }
        setHasSubscribed(subscribed);
        setSubscriptionSource(source);

        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem('anitune_newsletter_subscribed', JSON.stringify({
                    subscribed,
                    source,
                    timestamp: Date.now()
                }));
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('LocalStorage nicht verfügbar:', error);
                }
            }
        }
    }, []);

    // Newsletter Status aus LocalStorage laden
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = window.localStorage.getItem('anitune_newsletter_subscribed');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.subscribed) {
                        setHasSubscribed(true);
                        setSubscriptionSource(parsed.source);
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`📧 Newsletter-Status geladen: ${parsed.source} (${new Date(parsed.timestamp).toLocaleString()})`);
                        }
                    }
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Fehler beim Laden des Newsletter-Status:', error);
                }
            }
        }
    }, []);

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

    // ✅ NUR DEVELOPMENT: Snap-Config Debug
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const debugInfo = getSnapConfigDebugInfo();
            const warnings = validateSnapConfig();

            console.log('🎯 Snap-Config Geladen:', debugInfo);

            if (warnings.length > 0) {
                console.warn('⚠️ Snap-Config Warnungen:', warnings);
            } else {
                console.log('✅ Snap-Config vollständig validiert');
            }
        }
    }, []);

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

    // ✅ NUR DEVELOPMENT: Debug-Anzeige
    const debugIndicator = useMemo(() => {
        if (process.env.NODE_ENV !== 'development') return null;

        const snapDebug = getSnapConfigDebugInfo();
        const snapWarnings = validateSnapConfig();

        return (
            <div className="debug-indicator">
                <div style={{ borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '4px' }}>
                    Scroll: {formattedScrollProgress.absolute}% | Section: {activeSection + 1}/50
                </div>

                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                    Phase: {currentTitleIndex}/8 ({currentPhaseDescription})
                </div>

                <div style={{ fontSize: '10px' }}>
                    Newsletter: {hasSubscribed ? '✅' : '❌'} | Lock: {isScrollLocked ? '🔒' : '🔓'}
                </div>

                <div style={{ fontSize: '9px', color: '#a880ff', marginTop: '2px' }}>
                    📱 Device: {snapDebug.device} | Next Speed:
                </div>
                <div style={{ fontSize: '8px', color: '#4CAF50' }}>
                    {currentTitleIndex < 7 && `${currentTitleIndex}→${currentTitleIndex + 1}: ${Object.values(snapDebug.exampleTransitions)[Math.min(currentTitleIndex, 4)] || 'N/A'}`}
                </div>

                {snapWarnings.length > 0 && (
                    <div style={{ fontSize: '8px', color: '#ff6b6b', marginTop: '2px' }}>
                        Config Issues: {snapWarnings.length}
                    </div>
                )}

                <div style={{ fontSize: '9px', marginTop: '2px' }}>
                    Original: {timingInfo.preset} | Quelle: {subscriptionSource || 'none'}
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
        );
    }, [
        formattedScrollProgress.absolute,
        activeSection,
        resetComponent,
        scrollProgress,
        currentTitleIndex,
        currentPhaseDescription,
        timingInfo,
        isScrollLocked,
        hasSubscribed,
        subscriptionSource
    ]);

    // ✅ NUR DEVELOPMENT: Section-Indikatoren
    const sectionIndicators = useMemo(() => {
        if (process.env.NODE_ENV !== 'development') return null;

        return (
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

                {/* Phase 7: Carousel */}
                <button
                    className={`section-indicator ${currentTitleIndex === 7 ? 'active carousel-phase' : ''}`}
                    onClick={() => scrollToTitleIndex(7)}
                    aria-label="Go to AniTune Carousel (Phase 7)"
                    title="Phase 7: AniTune Carousel"
                    style={{
                        backgroundColor: currentTitleIndex === 7 ? '#a880ff' : 'rgba(255, 255, 255, 0.5)'
                    }}
                />

                {/* Phase 8: Newsletter CTA */}
                <button
                    className={`section-indicator ${currentTitleIndex === 8 ? 'active newsletter-phase' : ''} ${hasSubscribed ? 'subscribed' : ''}`}
                    onClick={() => scrollToTitleIndex(8)}
                    aria-label="Go to Newsletter CTA (Phase 8)"
                    title={hasSubscribed ? "Phase 8: Bereits angemeldet ✅" : "Phase 8: Newsletter CTA"}
                    style={{
                        backgroundColor: currentTitleIndex === 8 ? '#ff6b6b' :
                            hasSubscribed ? '#4CAF50' :
                                'rgba(255, 255, 255, 0.5)',
                        opacity: hasSubscribed ? 0.5 : 1
                    }}
                />
            </div>
        );
    }, [currentTitleIndex, scrollToTitleIndex, config.titles, hasSubscribed]);

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
            currentTitleIndex={currentTitleIndex}
            isScrollLocked={isScrollLocked}
        />
    ), [scrollProgress, config.titles, currentTitleIndex, isScrollLocked]);

    const audioLayer = useMemo(() => (
        <TitleAudioLayer
            currentTitleIndex={currentTitleIndex}
            isScrollLocked={isScrollLocked}
            scrollProgress={scrollProgress}
            scrollToTitleIndex={scrollToTitleIndex}
        />
    ), [currentTitleIndex, isScrollLocked, scrollProgress, scrollToTitleIndex]);

    const carouselLayer = useMemo(() => (
        <AniTuneCarousel
            scrollProgress={scrollProgress}
            currentTitleIndex={currentTitleIndex}
            isScrollLocked={isScrollLocked}
        />
    ), [scrollProgress, currentTitleIndex, isScrollLocked]);

    const phase8NewsletterLayer = useMemo(() => (
        <Phase8NewsletterLayer
            scrollProgress={scrollProgress}
            currentTitleIndex={currentTitleIndex}
            isScrollLocked={isScrollLocked}
            hasSubscribed={hasSubscribed}
            onSubscriptionChange={(subscribed) => handleSubscriptionChange(subscribed, 'phase8')}
        />
    ), [scrollProgress, currentTitleIndex, isScrollLocked, hasSubscribed, handleSubscriptionChange]);

    const scrollIndicator = useMemo(() => (
        <ScrollIndicator scrollProgress={scrollProgress} />
    ), [scrollProgress]);

    return (
        <ErrorBoundary fallback={errorFallback}>
            <div className="gsap-parallax-container" ref={containerRef} key={`container-${resetCount}`}>
                {/* ✅ NUR DEVELOPMENT: Debug-Anzeige */}
                {debugIndicator}

                {/* ✅ NUR DEVELOPMENT: Section-Indikatoren */}
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

                    <ErrorBoundary>
                        <MemoizedLayer>{titleLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{audioLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{carouselLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <MemoizedLayer>{phase8NewsletterLayer}</MemoizedLayer>
                    </ErrorBoundary>

                    {activeSection === 0 && (
                        <ErrorBoundary>
                            <MemoizedLayer>{scrollIndicator}</MemoizedLayer>
                        </ErrorBoundary>
                    )}
                </div>

                {/* Newsletter mit Subscription-Tracking */}
                <ErrorBoundary>
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '500px',
                        zIndex: 25,
                        pointerEvents: 'all',
                        opacity: scrollProgress < 0.1 ? Math.max(0, 1 - (scrollProgress / 0.1)) : 0,
                        transition: 'opacity 800ms ease-out'
                    }}>
                        {scrollProgress < 0.1 && !hasSubscribed && (
                            <Newsletter
                                onSubscriptionChange={(subscribed) => handleSubscriptionChange(subscribed, 'phase0')}
                            />
                        )}

                        {scrollProgress < 0.1 && hasSubscribed && (
                            <div style={{
                                textAlign: 'center',
                                background: 'rgba(76, 175, 80, 0.9)',
                                padding: '20px',
                                borderRadius: '15px',
                                color: 'white',
                                backdropFilter: 'blur(20px)'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', fontFamily: 'Lobster, cursive' }}>
                                    ✅ Bereits angemeldet!
                                </h3>
                                <p style={{ margin: 0, fontSize: '1rem' }}>
                                    Du erhältst bereits unsere Updates.
                                </p>
                            </div>
                        )}
                    </div>
                </ErrorBoundary>

                {/* Scroll-Abschnitte */}
                <div className="gsap-sections-container">
                    {Array.from({ length: 50 }, (_, i) => i).map((index) => (
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