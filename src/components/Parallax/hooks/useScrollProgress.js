// src/components/Parallax/hooks/useScrollProgress.js - MIT MOBILE URL-BAR FIX

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { findNearestSnapTarget, findAdjacentTitle, getCurrentActiveTitle } from '../config/baseConfig';
import { getSnapTiming, getBackToLogoTiming, getDeviceOptimizedTiming, getActiveScrollSegments } from '../config/timingConfig';

import {
    getSnapDurationForTransition,
    getSnapEasingForTransition,
    getSnapLockDelayForTransition,
    getSnapConfigDebugInfo
} from '../config/snapConfig';

export function useScrollProgress(containerRef, sectionsRef, titles = []) {
    // States
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);
    const [activeTitle, setActiveTitle] = useState(null);
    const [isSnapping, setIsSnapping] = useState(false);
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [isScrollLocked, setIsScrollLocked] = useState(false);

    // Refs
    const scrollTimeoutRef = useRef(null);
    const snapTimeoutRef = useRef(null);
    const lastScrollTime = useRef(0);
    const scrollDirection = useRef(0);
    const lastScrollEventRef = useRef(0);

    const timingConfig = getDeviceOptimizedTiming();
    const snapTiming = getSnapTiming();

    // ⚡ MOBILE URL-BAR FIX: Erweiterte updateScrollProgress Funktion
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        // ⚡ MOBILE DETECTION
        const isMobile = window.innerWidth < 768 && 'ontouchstart' in window;

        // ⚡ VIEWPORT HEIGHT mit URL-Bar Kompensation
        let viewportHeight;
        if (isMobile) {
            // Für Mobile: Versuche verschiedene Höhen-Quellen
            viewportHeight = window.visualViewport?.height ||
                document.documentElement.clientHeight ||
                window.innerHeight;
        } else {
            // Desktop: Normal
            viewportHeight = window.innerHeight;
        }

        const totalHeight = document.documentElement.scrollHeight - viewportHeight; // ⚡ FIX!
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(3.0, (currentScroll / totalHeight) * 3.0));

        // ⚡ DEBUG: Mobile Scroll Debug
        const oldProgress = scrollProgress;
        if (process.env.NODE_ENV === 'development' && Math.abs(progress - oldProgress) > 0.05) {
            console.log(`📱 MOBILE SCROLL-UPDATE: ${oldProgress.toFixed(3)} → ${progress.toFixed(3)}`, {
                isMobile,
                windowHeight: window.innerHeight,
                viewportHeight,
                visualViewport: window.visualViewport?.height,
                totalHeight,
                currentScroll,
                urlBarDiff: window.innerHeight - (window.visualViewport?.height || window.innerHeight)
            });
        }

        setScrollProgress(progress);

        if (currentTitleIndex === 0) {
            setActiveTitle(null);
        } else if (titles.length > 0 && titles[currentTitleIndex - 1]) {
            setActiveTitle(titles[currentTitleIndex - 1]);
        }

        const sectionCount = sectionsRef.current.length;
        if (sectionCount > 0) {
            if (progress <= 1) {
                const newSectionIndex = Math.round(progress * (sectionCount / 2 - 1));
                setActiveSection(newSectionIndex);
            } else {
                const extendedProgress = progress - 1;
                const newSectionIndex = Math.round(extendedProgress * (sectionCount / 2 - 1)) + (sectionCount / 2);
                setActiveSection(newSectionIndex);
            }
        }
    }, [containerRef, sectionsRef, titles, currentTitleIndex, scrollProgress]);

    // ⚡ VISUAL VIEWPORT LISTENER für moderne Browser
    useEffect(() => {
        if (window.visualViewport) {
            const handleVisualViewportChange = () => {
                // Kurze Verzögerung für Stabilität
                setTimeout(updateScrollProgress, 100);

                if (process.env.NODE_ENV === 'development') {
                    console.log('📱 Visual Viewport Changed:', {
                        height: window.visualViewport.height,
                        innerHeight: window.innerHeight,
                        diff: window.innerHeight - window.visualViewport.height
                    });
                }
            };

            window.visualViewport.addEventListener('resize', handleVisualViewportChange);
            return () => window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
        }
    }, [updateScrollProgress]);

    // Enhanced snapToTitleIndex mit doppeltem scrollProgress-Update
    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || isSnapping) return;

        const segmentConfig = getActiveScrollSegments();
        const segments = segmentConfig.segments;
        const maxIndex = 6; // 7 Phasen (0-6)

        if (targetIndex < 0 || targetIndex > maxIndex) return;

        const snapDuration = getSnapDurationForTransition(currentTitleIndex, targetIndex);
        const snapEase = getSnapEasingForTransition(currentTitleIndex, targetIndex);
        const lockDelay = getSnapLockDelayForTransition(currentTitleIndex, targetIndex);

        // DEBUG: Enhanced Snap-Logging
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 ENHANCED SNAP: ${currentTitleIndex}→${targetIndex}`);
            console.log(`⏱️ Dauer: ${snapDuration}s | Easing: ${snapEase} | Lock: ${lockDelay}ms`);

            if (targetIndex === 6) {
                console.log(`📧 NEWSLETTER-SNAP: Ziel Phase 6 (Newsletter CTA)`);
                console.log(`📊 Expected Range: 1.6-2.0 (64%-80% Debug)`);
            }
        }

        setIsScrollLocked(true);
        setIsSnapping(true);

        let targetScroll = 0;
        if (segments[targetIndex]) {
            const targetSegment = segments[targetIndex];

            // ⚡ MOBILE FIX: Verwende kompensierte Höhe auch beim Snapping
            const isMobile = window.innerWidth < 768 && 'ontouchstart' in window;
            let viewportHeight;
            if (isMobile) {
                viewportHeight = window.visualViewport?.height ||
                    document.documentElement.clientHeight ||
                    window.innerHeight;
            } else {
                viewportHeight = window.innerHeight;
            }

            const totalHeight = document.documentElement.scrollHeight - viewportHeight;
            targetScroll = targetSegment.snapTarget * totalHeight / 3.0;

            // DEBUG: Snap-Target Details
            if (process.env.NODE_ENV === 'development') {
                console.log(`📍 Mobile-Aware Snap Details:`);
                console.log(`   Target Segment: scrollStart=${targetSegment.scrollStart}, scrollEnd=${targetSegment.scrollEnd}`);
                console.log(`   Snap Target: ${targetSegment.snapTarget} (${(targetSegment.snapTarget * 40).toFixed(1)}% Debug)`);
                console.log(`   Viewport Height: ${viewportHeight}px (Mobile: ${isMobile})`);
                console.log(`   Target Scroll: ${targetScroll}px`);
                console.log(`   Total Height: ${totalHeight}px`);
            }
        }

        gsap.to(window, {
            duration: snapDuration,
            scrollTo: { y: targetScroll },
            ease: snapEase,
            onUpdate: () => {
                // Update während Animation
                updateScrollProgress();
            },
            onComplete: () => {
                // Doppeltes Update in onComplete
                updateScrollProgress(); // Sofortiges Update

                setTimeout(() => {
                    updateScrollProgress(); // Verzögertes Update für Sicherheit

                    // DEBUG: Post-Snap Validation
                    if (process.env.NODE_ENV === 'development') {
                        const currentScroll = window.scrollY;
                        const isMobile = window.innerWidth < 768 && 'ontouchstart' in window;
                        let viewportHeight;
                        if (isMobile) {
                            viewportHeight = window.visualViewport?.height ||
                                document.documentElement.clientHeight ||
                                window.innerHeight;
                        } else {
                            viewportHeight = window.innerHeight;
                        }
                        const totalHeight = document.documentElement.scrollHeight - viewportHeight;
                        const actualProgress = Math.max(0, Math.min(3.0, (currentScroll / totalHeight) * 3.0));

                        console.log(`✅ MOBILE-AWARE SNAP COMPLETE: Target ${targetIndex}`);
                        console.log(`📊 Final ScrollProgress: ${actualProgress.toFixed(3)} (${(actualProgress * 40).toFixed(1)}% Debug)`);
                        console.log(`📍 Final Scroll Position: ${currentScroll}px`);
                        console.log(`📱 Mobile Compensation: ${window.innerHeight - viewportHeight}px`);

                        if (targetIndex === 6) {
                            console.log(`📧 NEWSLETTER CHECK: Phase 6 erreicht`);
                            console.log(`   Expected: 1.6-2.0 (64%-80% Debug)`);
                            console.log(`   Actual: ${actualProgress.toFixed(3)} (${(actualProgress * 40).toFixed(1)}% Debug)`);
                            console.log(`   In Range: ${actualProgress >= 1.6 && actualProgress <= 2.0 ? '✅' : '❌'}`);
                        }
                    }
                }, 50); // 50ms Verzögerung für DOM-Stabilisierung

                setCurrentTitleIndex(targetIndex);

                if (targetIndex === 0) {
                    setActiveTitle(null);
                } else if (targetIndex <= 4) { // Nur Titel-Phasen 1-4
                    setActiveTitle(titles[targetIndex - 1]);
                } else {
                    setActiveTitle(null); // Phase 5 & 6 haben keine Titel
                }

                setTimeout(() => {
                    setIsScrollLocked(false);
                    setIsSnapping(false);

                    // Finales Update nach Lock-Release
                    updateScrollProgress();

                    if (process.env.NODE_ENV === 'development') {
                        console.log(`🔓 SNAP UNLOCK: Phase ${targetIndex} erreicht`);
                    }
                }, lockDelay);
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress, currentTitleIndex]);

    // handleScrollEvent mit besserer Debouncing
    const handleScrollEvent = useCallback((event) => {
        if (isScrollLocked || isSnapping) {
            event.preventDefault();
            return;
        }

        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollEventRef.current;

        // Reduziertes Debouncing für bessere Responsivität
        if (timeSinceLastScroll < 50) return; // 100ms → 50ms

        lastScrollEventRef.current = now;
        const delta = event.deltaY || event.detail || (event.wheelDelta * -1);
        const maxIndex = 6; // 7 Phasen (0-6)

        if (delta > 0) {
            const nextIndex = Math.min(currentTitleIndex + 1, maxIndex);
            if (nextIndex !== currentTitleIndex) {
                // DEBUG: Scroll Direction
                if (process.env.NODE_ENV === 'development' && nextIndex === 6) {
                    console.log(`⬇️ SCROLL DOWN zu Phase 6 (Newsletter)`);
                }
                snapToTitleIndex(nextIndex, 'next');
            }
        } else if (delta < 0) {
            const prevIndex = Math.max(currentTitleIndex - 1, 0);
            if (prevIndex !== currentTitleIndex) {
                // DEBUG: Scroll Direction
                if (process.env.NODE_ENV === 'development' && currentTitleIndex === 6) {
                    console.log(`⬆️ SCROLL UP von Phase 6 (Newsletter)`);
                }
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, snapToTitleIndex]);

    // Touch Handlers
    const touchStartRef = useRef({ y: 0, time: 0 });
    const handleTouchStart = useCallback((event) => {
        if (event.touches.length === 1) {
            touchStartRef.current = {
                y: event.touches[0].clientY,
                time: Date.now()
            };
        }
    }, []);

    const handleTouchEnd = useCallback((event) => {
        if (isScrollLocked || isSnapping || event.changedTouches.length !== 1) return;

        const touch = event.changedTouches[0];
        const deltaY = touchStartRef.current.y - touch.clientY;
        const deltaTime = Date.now() - touchStartRef.current.time;
        const maxIndex = 6; // 7 Phasen (0-6)

        if (Math.abs(deltaY) > 30 && deltaTime < 500) {
            if (deltaY > 0) {
                const nextIndex = Math.min(currentTitleIndex + 1, maxIndex);
                if (nextIndex !== currentTitleIndex) {
                    if (process.env.NODE_ENV === 'development' && nextIndex === 6) {
                        console.log(`👆 TOUCH DOWN zu Phase 6 (Newsletter)`);
                    }
                    snapToTitleIndex(nextIndex, 'next');
                }
            } else {
                const prevIndex = Math.max(currentTitleIndex - 1, 0);
                if (prevIndex !== currentTitleIndex) {
                    if (process.env.NODE_ENV === 'development' && currentTitleIndex === 6) {
                        console.log(`👇 TOUCH UP von Phase 6 (Newsletter)`);
                    }
                    snapToTitleIndex(prevIndex, 'prev');
                }
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, snapToTitleIndex]);

    // Keyboard Navigation
    const handleKeyboardNavigation = useCallback((direction) => {
        if (isScrollLocked || isSnapping) return;

        const maxIndex = 6; // 7 Phasen (0-6)

        if (direction === 'next') {
            const nextIndex = Math.min(currentTitleIndex + 1, maxIndex);
            if (nextIndex !== currentTitleIndex) {
                snapToTitleIndex(nextIndex, 'next');
            }
        } else {
            const prevIndex = Math.max(currentTitleIndex - 1, 0);
            if (prevIndex !== currentTitleIndex) {
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, snapToTitleIndex]);

    // Event Listeners Setup
    useEffect(() => {
        if (!containerRef.current || titles.length === 0) return;

        const handleWheel = (e) => {
            e.preventDefault();
            handleScrollEvent(e);
        };

        const handleTouchStartEvent = (e) => handleTouchStart(e);
        const handleTouchEndEvent = (e) => handleTouchEnd(e);

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStartEvent, { passive: true });
        window.addEventListener('touchend', handleTouchEndEvent, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStartEvent);
            window.removeEventListener('touchend', handleTouchEndEvent);
        };
    }, [handleScrollEvent, handleTouchStart, handleTouchEnd, titles]);

    // Keyboard Event Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    handleKeyboardNavigation('next');
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    handleKeyboardNavigation('prev');
                    break;
                case 'Home':
                    e.preventDefault();
                    snapToTitleIndex(0);
                    break;
                case 'End':
                    e.preventDefault();
                    snapToTitleIndex(6); // Phase 6
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyboardNavigation, snapToTitleIndex]);

    // Initial Update
    useEffect(() => {
        if (titles.length > 0) {
            updateScrollProgress();
            if (process.env.NODE_ENV === 'development') {
                console.log(`🚀 useScrollProgress initialisiert mit ${titles.length} Titeln`);
                console.log(`📊 7 Phasen verfügbar: 0 (Logo) + 1-4 (Titel) + 5 (Carousel) + 6 (Newsletter)`);
                console.log(`📱 Mobile URL-Bar Fix: Aktiv`);
            }
        }
    }, [titles, updateScrollProgress]);

    // Helper Functions
    const scrollToSection = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    const scrollToTitleIndex = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    // Verbesserte formattedScrollProgress
    const formattedScrollProgress = {
        normalized: (Math.min(3.0, Math.max(0, scrollProgress)) * 40).toFixed(0),
        absolute: (scrollProgress * 40).toFixed(0),
        phase1: Math.min(1, scrollProgress),
        phase2: Math.max(0, Math.min(1, scrollProgress - 1)),
        phase3: Math.max(0, scrollProgress - 2),
        percentage: (scrollProgress * 40).toFixed(0) + '%',
        // Newsletter-spezifische Werte
        isInNewsletterRange: scrollProgress >= 1.6 && scrollProgress <= 2.0,
        newsletterProgress: scrollProgress >= 1.6 ?
            Math.min(1, (scrollProgress - 1.6) / 0.4).toFixed(3) : '0.000'
    };

    return {
        scrollProgress,
        activeSection,
        setActiveSection,
        scrollToSection,
        formattedScrollProgress,
        updateScrollProgress,
        activeTitle,
        isSnapping,
        snapToTitle: snapToTitleIndex,
        scrollToTitleIndex,
        handleKeyboardNavigation,
        currentTitleIndex,
        isScrollLocked,

        isLogoPhase: currentTitleIndex === 0,
        isTitlePhase: currentTitleIndex >= 1 && currentTitleIndex <= 4,
        isCarouselPhase: currentTitleIndex === 5,
        isNewsletterPhase: currentTitleIndex === 6,
        currentPhaseDescription:
            currentTitleIndex === 0 ? 'Logo/Newsletter' :
                currentTitleIndex === 5 ? 'AniTune Carousel' :
                    currentTitleIndex === 6 ? 'Newsletter CTA' :
                        titles[currentTitleIndex - 1]?.text || `Titel ${currentTitleIndex}`,

        timingInfo: {
            preset: timingConfig.name,
            snapDuration: snapTiming.duration,
            snapEase: snapTiming.ease,
            currentPhase: currentTitleIndex === 0 ? 'Logo/Newsletter' :
                currentTitleIndex === 5 ? 'AniTune Carousel' :
                    currentTitleIndex === 6 ? 'Newsletter CTA' :
                        `Titel ${currentTitleIndex}`,
            totalPhases: 7, // 7 Phasen (0-6)
            configurable: true,
            snapConfig: getSnapConfigDebugInfo(),
            mobileOptimized: true // ⚡ NEU: Mobile Flag
        }
    };
}