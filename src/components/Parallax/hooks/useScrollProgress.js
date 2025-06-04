// src/components/Parallax/hooks/useScrollProgress.js - PERFORMANCE OPTIMIERT
// ✅ OPTIMIERUNGEN: Console-logs entfernt, Event-Listener optimiert, Memory-Leaks reduziert

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

    // ⚡ PERFORMANCE: Optimierter Throttling (erhöht von 32ms auf 50ms für bessere Performance)
    const updateThrottleRef = useRef(0);

    const timingConfig = getDeviceOptimizedTiming();
    const snapTiming = getSnapTiming();

    // ⚡ PERFORMANCE: Throttling optimiert, alle Debug-Logs entfernt
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        // ⚡ PERFORMANCE: Throttling erhöht von 32ms auf 50ms (von ~30fps auf ~20fps)
        const now = performance.now();
        if (now - updateThrottleRef.current < 50) return;
        updateThrottleRef.current = now;

        // ⚡ PERFORMANCE: Mobile Detection gecacht
        const isMobile = window.innerWidth < 768 && 'ontouchstart' in window;

        // ⚡ PERFORMANCE: Viewport Height mit URL-Bar Kompensation
        let viewportHeight;
        if (isMobile) {
            viewportHeight = window.visualViewport?.height ||
                document.documentElement.clientHeight ||
                window.innerHeight;
        } else {
            viewportHeight = window.innerHeight;
        }

        const totalHeight = document.documentElement.scrollHeight - viewportHeight;
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(3.0, (currentScroll / totalHeight) * 3.0));

        // ⚡ PERFORMANCE: Alle Debug-Logs entfernt
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
    }, [containerRef, sectionsRef, titles, currentTitleIndex]);

    // ⚡ PERFORMANCE: Visual Viewport Listener optimiert - Debouncing erhöht
    useEffect(() => {
        if (window.visualViewport) {
            let viewportTimer;
            const handleVisualViewportChange = () => {
                clearTimeout(viewportTimer);
                // ⚡ PERFORMANCE: Debouncing erhöht von 150ms auf 200ms
                viewportTimer = setTimeout(updateScrollProgress, 200);
            };

            // ⚡ PERFORMANCE: Passive Event Listener hinzugefügt
            window.visualViewport.addEventListener('resize', handleVisualViewportChange, { passive: true });
            return () => {
                clearTimeout(viewportTimer);
                window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
            };
        }
    }, [updateScrollProgress]);

    // Enhanced snapToTitleIndex mit optimiertem scrollProgress-Update
    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || isSnapping) return;

        const segmentConfig = getActiveScrollSegments();
        const segments = segmentConfig.segments;
        const maxIndex = 6; // 7 Phasen (0-6)

        if (targetIndex < 0 || targetIndex > maxIndex) return;

        const snapDuration = getSnapDurationForTransition(currentTitleIndex, targetIndex);
        const snapEase = getSnapEasingForTransition(currentTitleIndex, targetIndex);
        const lockDelay = getSnapLockDelayForTransition(currentTitleIndex, targetIndex);

        // ⚡ PERFORMANCE: Alle Debug-Logs entfernt

        setIsScrollLocked(true);
        setIsSnapping(true);

        let targetScroll = 0;
        if (segments[targetIndex]) {
            const targetSegment = segments[targetIndex];

            // ⚡ PERFORMANCE: Mobile Detection gecacht
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
        }

        gsap.to(window, {
            duration: snapDuration,
            scrollTo: { y: targetScroll },
            ease: snapEase,
            onUpdate: () => {
                updateScrollProgress();
            },
            onComplete: () => {
                updateScrollProgress();

                setTimeout(() => {
                    updateScrollProgress();
                    // ⚡ PERFORMANCE: Debug-Logs entfernt
                }, 50);

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
                    updateScrollProgress();
                }, lockDelay);
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress, currentTitleIndex]);

    // handleScrollEvent mit optimierter Debouncing
    const handleScrollEvent = useCallback((event) => {
        if (isScrollLocked || isSnapping) {
            event.preventDefault();
            return;
        }

        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollEventRef.current;

        // ⚡ PERFORMANCE: Debouncing erhöht von 80ms auf 100ms für bessere Performance
        if (timeSinceLastScroll < 100) return;

        lastScrollEventRef.current = now;
        const delta = event.deltaY || event.detail || (event.wheelDelta * -1);
        const maxIndex = 6; // 7 Phasen (0-6)

        if (delta > 0) {
            const nextIndex = Math.min(currentTitleIndex + 1, maxIndex);
            if (nextIndex !== currentTitleIndex) {
                snapToTitleIndex(nextIndex, 'next');
            }
        } else if (delta < 0) {
            const prevIndex = Math.max(currentTitleIndex - 1, 0);
            if (prevIndex !== currentTitleIndex) {
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, snapToTitleIndex]);

    // Touch Handlers - Optimiert
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

        // ⚡ PERFORMANCE: Touch-Schwellenwerte optimiert (weniger versehentliche Triggers)
        if (Math.abs(deltaY) > 50 && deltaTime < 700) { // Erhöht von 40/600 auf 50/700
            if (deltaY > 0) {
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
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, snapToTitleIndex]);

    // Keyboard Navigation - Unverändert (funktioniert optimal)
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

    // Event Listeners Setup - ⚡ PERFORMANCE OPTIMIERT
    useEffect(() => {
        if (!containerRef.current || titles.length === 0) return;

        const handleWheel = (e) => {
            e.preventDefault();
            handleScrollEvent(e);
        };

        const handleTouchStartEvent = (e) => handleTouchStart(e);
        const handleTouchEndEvent = (e) => handleTouchEnd(e);

        // ⚡ PERFORMANCE: Alle Event Listener mit optimalen Flags
        window.addEventListener('wheel', handleWheel, {
            passive: false, // Muss false bleiben für preventDefault
            capture: false
        });
        window.addEventListener('touchstart', handleTouchStartEvent, {
            passive: true, // ⚡ PERFORMANCE: Passive für Touch Events
            capture: false
        });
        window.addEventListener('touchend', handleTouchEndEvent, {
            passive: true, // ⚡ PERFORMANCE: Passive für Touch Events
            capture: false
        });

        // ⚡ PERFORMANCE: Cleanup optimiert
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStartEvent);
            window.removeEventListener('touchend', handleTouchEndEvent);
        };
    }, [handleScrollEvent, handleTouchStart, handleTouchEnd, titles]);

    // Keyboard Event Listeners - ⚡ PERFORMANCE OPTIMIERT
    useEffect(() => {
        const handleKeyDown = (e) => {
            // ⚡ PERFORMANCE: Frühzeitige Return-Optimierung
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
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

        // ⚡ PERFORMANCE: Passive Event Listener für Keyboard
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyboardNavigation, snapToTitleIndex]);

    // Initial Update - ⚡ PERFORMANCE OPTIMIERT
    useEffect(() => {
        if (titles.length > 0) {
            // ⚡ PERFORMANCE: Verzögerter Initial Update für bessere Performance
            const timer = setTimeout(updateScrollProgress, 100);
            return () => clearTimeout(timer);
        }
    }, [titles, updateScrollProgress]);

    // Helper Functions - Unverändert (optimal)
    const scrollToSection = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    const scrollToTitleIndex = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    // ⚡ PERFORMANCE: formattedScrollProgress optimiert - weniger Berechnungen
    const formattedScrollProgress = {
        normalized: Math.round(Math.min(3.0, Math.max(0, scrollProgress)) * 40), // ⚡ Math.round statt toFixed
        absolute: Math.round(scrollProgress * 40), // ⚡ Math.round statt toFixed
        phase1: Math.min(1, scrollProgress),
        phase2: Math.max(0, Math.min(1, scrollProgress - 1)),
        phase3: Math.max(0, scrollProgress - 2),
        percentage: Math.round(scrollProgress * 40) + '%', // ⚡ Math.round statt toFixed
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

        // ⚡ PERFORMANCE: Timing Info nur in Development (für Production entfernt)
        ...(process.env.NODE_ENV === 'development' && {
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
                mobileOptimized: true
            }
        })
    };
}