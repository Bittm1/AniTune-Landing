// src/components/Parallax/ParallaxContainerModular.jsx - PERFORMANCE OPTIMIERT

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getConfig } from './config';

// ✅ Mobile Background Layer
import MobileBackgroundLayer from './Elements/MobileBackgroundLayer';

// Desktop Background Layer Imports
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

// Gemeinsame Layer (Desktop + Mobile)
import LogoLayer from './Elements/LogoLayer';
import TitleLayer from './Elements/TitleLayer';
import TitleAudioLayer from './Elements/TitleAudioLayer';
import Newsletter from '../Newsletter/Newsletter';
import AniTuneCarousel from './Elements/AniTuneCarousel';
import Phase6NewsletterLayer from './Elements/Phase6NewsletterLayer';
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

    // ⚡ PERFORMANCE: Mobile Detection optimiert
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768;
    });

    // Refs
    const containerRef = useRef(null);
    const sectionsRef = useRef([]);
    const observerRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    // Konfiguration
    const config = useResponsiveConfig();

    // ⚡ PERFORMANCE: Entfernt - Performance-Messung nur bei Bedarf
    // const performanceRef = useRef({});

    // ⚡ PERFORMANCE: Optimierte Mobile Detection mit Throttling
    useEffect(() => {
        let resizeTimer;
        const checkMobile = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const mobile = window.innerWidth < 768;
                if (mobile !== isMobile) {
                    setIsMobile(mobile);
                }
            }, 150); // Throttled für Performance
        };

        window.addEventListener('resize', checkMobile, { passive: true });
        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    // SCROLL-PROGRESS mit Phase 0-6 Support
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
                // ⚡ PERFORMANCE: Entfernt console.warn für Production
                // Silent fail für bessere Performance
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
                    }
                }
            } catch (error) {
                // ⚡ PERFORMANCE: Silent fail
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
            }, 100); // ⚡ PERFORMANCE: Erhöht von 50ms auf 100ms
        }, options);

        sectionsRef.current.forEach(section => {
            if (section) {
                observerRef.current.observe(section);
            }
        });

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

        const initTimer = setTimeout(() => {
            destroyScrollTrigger();
            const cleanupSectionObserver = setupSectionObserver();

            setIsInitialized(true);

            const handleResize = () => {
                if (resizeTimeoutRef.current) {
                    clearTimeout(resizeTimeoutRef.current);
                }

                resizeTimeoutRef.current = setTimeout(() => {
                    updateScrollProgress();
                }, 250); // ⚡ PERFORMANCE: Erhöht von 200ms auf 250ms
            };

            window.addEventListener('resize', handleResize, { passive: true });

            return () => {
                if (cleanupSectionObserver && typeof cleanupSectionObserver === 'function') {
                    cleanupSectionObserver();
                }
                destroyScrollTrigger();
                clearTimeout(resizeTimeoutRef.current);
                window.removeEventListener('resize', handleResize);
            };
        }, 300); // ⚡ PERFORMANCE: Erhöht von 200ms auf 300ms

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
                    }, 150); // ⚡ PERFORMANCE: Erhöht von 100ms auf 150ms
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

    // ⚡ PERFORMANCE: Entfernt - Performance-Tracking nur bei Bedarf
    // useEffect(() => { ... performance tracking ... }, [resetCount]);

    // ⚡ PERFORMANCE: Snap-Config Debug nur bei Bedarf laden
    useEffect(() => {
        // Snap-Config wird nur geladen, Debug-Ausgabe entfernt
        const debugInfo = getSnapConfigDebugInfo();
        const warnings = validateSnapConfig();

        // Silent validation - keine Console-Ausgabe
    }, []);

    // Desktop Background Layers (unverändert)
    const desktopBackgroundLayers = useMemo(() => {
        if (isMobile) return null;

        return (
            <>
                <ErrorBoundary>
                    <MemoizedLayer>
                        <BackgroundLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.background,
                                imageSrc: config.imageSources?.background
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <StarfieldLayer scrollProgress={scrollProgress} />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <BergeLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.berge,
                                imageSrc: config.imageSources?.berge || config.berge?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <TalLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.tal,
                                imageSrc: config.imageSources?.tal || config.tal?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <WaldHintenLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.waldHinten,
                                imageSrc: config.imageSources?.waldHinten || config.waldHinten?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <ForestLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.forest,
                                imageSrc: config.imageSources?.forest || config.forest?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <RoadLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.road,
                                imageSrc: config.imageSources?.road || config.road?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <DogLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.dog,
                                imageSrc: config.imageSources?.dog || config.dog?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
                        <MengeLayer
                            scrollProgress={scrollProgress}
                            config={{
                                ...config.menge,
                                imageSrc: config.imageSources?.menge || config.menge?.imageSrc
                            }}
                        />
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
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
                    </MemoizedLayer>
                </ErrorBoundary>

                <ErrorBoundary>
                    <MemoizedLayer>
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
                    </MemoizedLayer>
                </ErrorBoundary>
            </>
        );
    }, [isMobile, scrollProgress, config]);

    // Mobile Background Layer (nur für Mobile)
    const mobileBackgroundLayer = useMemo(() => {
        if (!isMobile) return null;

        return (
            <ErrorBoundary>
                <MemoizedLayer>
                    <MobileBackgroundLayer scrollProgress={scrollProgress} />
                </MemoizedLayer>
            </ErrorBoundary>
        );
    }, [isMobile, scrollProgress]);

    // ✅ ALLE GEMEINSAMEN LAYER bleiben für Desktop UND Mobile
    const logoLayer = useMemo(() => (
        <LogoLayer
            scrollProgress={scrollProgress}
            config={{
                ...config.logo,
                imageSrc: config.imageSources?.logo
            }}
        />
    ), [scrollProgress, config.logo, config.imageSources?.logo]);

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

    const phase6NewsletterLayer = useMemo(() => (
        <Phase6NewsletterLayer
            scrollProgress={scrollProgress}
            currentTitleIndex={currentTitleIndex}
            isScrollLocked={isScrollLocked}
            hasSubscribed={hasSubscribed}
            onSubscriptionChange={(subscribed) => handleSubscriptionChange(subscribed, 'phase6')}
        />
    ), [scrollProgress, currentTitleIndex, isScrollLocked, hasSubscribed, handleSubscriptionChange]);

    const scrollIndicator = useMemo(() => (
        <ScrollIndicator scrollProgress={scrollProgress} />
    ), [scrollProgress]);

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

    // ⚡ PERFORMANCE: Debug-Komponenten komplett deaktiviert für Production
    const mobileDebugDot = null;
    const desktopDebugIndicator = null;
    const sectionIndicators = null;

    return (
        <ErrorBoundary fallback={errorFallback}>
            <div className="gsap-parallax-container" ref={containerRef} key={`container-${resetCount}`}>
                {/* ⚡ PERFORMANCE: Debug-Elemente entfernt */}

                {/* Responsive Background Layers */}
                <div className="fixed-layers">
                    {/* MOBILE: Nur Composite Background */}
                    {mobileBackgroundLayer}

                    {/* DESKTOP: Alle einzelnen Background Layer */}
                    {desktopBackgroundLayers}

                    {/* ✅ ALLE GEMEINSAMEN LAYER: Funktionieren auf Desktop UND Mobile */}
                    <ErrorBoundary>
                        <MemoizedLayer>{logoLayer}</MemoizedLayer>
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
                        <MemoizedLayer>{phase6NewsletterLayer}</MemoizedLayer>
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

                {/* ⚡ PERFORMANCE: Sections reduziert von 50 auf 30 für bessere Performance */}
                <div className="gsap-sections-container">
                    {Array.from({ length: 30 }, (_, i) => i).map((index) => (
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