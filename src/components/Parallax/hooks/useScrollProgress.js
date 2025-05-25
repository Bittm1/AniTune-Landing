import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { findNearestSnapTarget, findAdjacentTitle, getCurrentActiveTitle } from '../config/baseConfig';
// ✅ NEUE IMPORT: Timing-Config
import { getSnapTiming, getBackToLogoTiming, getDeviceOptimizedTiming } from '../config/timingConfig';

export function useScrollProgress(containerRef, sectionsRef, titles = []) {
    // States
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);
    const [activeTitle, setActiveTitle] = useState(null);
    const [isSnapping, setIsSnapping] = useState(false);
    const [currentTitleIndex, setCurrentTitleIndex] = useState(-1);
    const [isScrollLocked, setIsScrollLocked] = useState(false);

    // Refs
    const scrollTimeoutRef = useRef(null);
    const snapTimeoutRef = useRef(null);
    const lastScrollTime = useRef(0);
    const scrollDirection = useRef(0);
    const lastScrollEventRef = useRef(0);

    // ✅ TIMING-CONFIG LADEN
    const timingConfig = getDeviceOptimizedTiming();
    const snapTiming = getSnapTiming();
    const backToLogoTiming = getBackToLogoTiming();

    // Manuelles Update des Scroll-Fortschritts
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(2, (currentScroll / totalHeight) * 2));

        setScrollProgress(progress);

        if (titles.length > 0 && titles[currentTitleIndex]) {
            setActiveTitle(titles[currentTitleIndex]);
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

    // ✅ SNAP-FUNKTION MIT CONFIG-TIMING
    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || targetIndex < 0 || targetIndex >= titles.length) return;

        const targetTitle = titles[targetIndex];
        if (!targetTitle) return;

        console.log(`🔒 Lock-Snap zu Titel ${targetIndex + 1}: "${targetTitle.text}"`);

        setIsScrollLocked(true);
        setIsSnapping(true);

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = targetTitle.snapTarget * totalHeight / 2;

        // ✅ VERWENDE CONFIG-WERTE STATT HART-KODIERTE
        gsap.to(window, {
            duration: snapTiming.duration,        // ← Aus timingConfig.js
            scrollTo: { y: targetScroll },
            ease: snapTiming.ease,                // ← Aus timingConfig.js
            onUpdate: () => {
                updateScrollProgress();
            },
            onComplete: () => {
                setCurrentTitleIndex(targetIndex);
                setActiveTitle(targetTitle);

                // ✅ LOCK-DELAY AUS CONFIG
                setTimeout(() => {
                    setIsScrollLocked(false);
                    setIsSnapping(false);
                }, snapTiming.lockDelay);         // ← Aus timingConfig.js
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress, snapTiming]);

    // Scroll-Event-Handler mit Lock-Logik
    const handleScrollEvent = useCallback((event) => {
        if (isScrollLocked || isSnapping) {
            event.preventDefault();
            return;
        }

        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollEventRef.current;

        if (timeSinceLastScroll < 100) return;

        lastScrollEventRef.current = now;
        const delta = event.deltaY || event.detail || (event.wheelDelta * -1);

        if (delta > 0) {
            if (currentTitleIndex === -1) {
                snapToTitleIndex(0, 'next');
            } else {
                const nextIndex = Math.min(currentTitleIndex + 1, titles.length - 1);
                if (nextIndex !== currentTitleIndex) {
                    snapToTitleIndex(nextIndex, 'next');
                }
            }
        } else if (delta < 0) {
            if (currentTitleIndex === 0) {
                setCurrentTitleIndex(-1);
                setActiveTitle(null);

                // ✅ BACK-TO-LOGO MIT CONFIG-TIMING
                gsap.to(window, {
                    duration: backToLogoTiming.duration,    // ← Aus timingConfig.js
                    scrollTo: { y: 0 },
                    ease: backToLogoTiming.ease             // ← Aus timingConfig.js
                });
            } else if (currentTitleIndex > 0) {
                const prevIndex = Math.max(currentTitleIndex - 1, 0);
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, titles, snapToTitleIndex, backToLogoTiming]);

    // Touch-Event-Handler für Mobile
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

        if (Math.abs(deltaY) > 30 && deltaTime < 500) {
            if (deltaY > 0) {
                if (currentTitleIndex === -1) {
                    snapToTitleIndex(0, 'next');
                } else {
                    const nextIndex = Math.min(currentTitleIndex + 1, titles.length - 1);
                    if (nextIndex !== currentTitleIndex) {
                        snapToTitleIndex(nextIndex, 'next');
                    }
                }
            } else {
                if (currentTitleIndex === 0) {
                    setCurrentTitleIndex(-1);
                    setActiveTitle(null);

                    // ✅ BACK-TO-LOGO MIT CONFIG-TIMING (auch für Touch)
                    gsap.to(window, {
                        duration: backToLogoTiming.duration,
                        scrollTo: { y: 0 },
                        ease: backToLogoTiming.ease
                    });
                } else if (currentTitleIndex > 0) {
                    const prevIndex = Math.max(currentTitleIndex - 1, 0);
                    snapToTitleIndex(prevIndex, 'prev');
                }
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, titles, snapToTitleIndex, backToLogoTiming]);

    // Keyboard-Navigation
    const handleKeyboardNavigation = useCallback((direction) => {
        if (isScrollLocked || isSnapping) return;

        if (direction === 'next') {
            if (currentTitleIndex === -1) {
                snapToTitleIndex(0, 'next');
            } else {
                const nextIndex = Math.min(currentTitleIndex + 1, titles.length - 1);
                if (nextIndex !== currentTitleIndex) {
                    snapToTitleIndex(nextIndex, 'next');
                }
            }
        } else {
            if (currentTitleIndex === 0) {
                setCurrentTitleIndex(-1);
                setActiveTitle(null);

                // ✅ BACK-TO-LOGO MIT CONFIG-TIMING (auch für Keyboard)
                gsap.to(window, {
                    duration: backToLogoTiming.duration,
                    scrollTo: { y: 0 },
                    ease: backToLogoTiming.ease
                });
            } else if (currentTitleIndex > 0) {
                const prevIndex = Math.max(currentTitleIndex - 1, 0);
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, titles, snapToTitleIndex, backToLogoTiming]);

    // Event-Listener Setup
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

    // Keyboard-Events
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
                    snapToTitleIndex(0, 'next');
                    break;
                case 'End':
                    e.preventDefault();
                    snapToTitleIndex(titles.length - 1, 'prev');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyboardNavigation, snapToTitleIndex, titles]);

    // Initialisierung
    useEffect(() => {
        if (titles.length > 0) {
            updateScrollProgress();
        }
    }, [titles, updateScrollProgress]);

    // Legacy-Funktionen für Kompatibilität
    const scrollToSection = useCallback((index) => {
        const titleIndex = Math.min(index, titles.length - 1);
        snapToTitleIndex(titleIndex);
    }, [snapToTitleIndex, titles]);

    const scrollToTitleIndex = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    // Formatierter Progress
    const formattedScrollProgress = {
        normalized: (Math.min(2, Math.max(0, scrollProgress)) * 50).toFixed(0),
        absolute: (scrollProgress * 50).toFixed(0),
        phase1: Math.min(1, scrollProgress),
        phase2: Math.max(0, scrollProgress - 1),
        percentage: (scrollProgress * 50).toFixed(0) + '%'
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

        // ✅ NEU: Timing-Debug-Info
        timingInfo: {
            preset: timingConfig.name,
            snapDuration: snapTiming.duration,
            snapEase: snapTiming.ease
        }
    };
}