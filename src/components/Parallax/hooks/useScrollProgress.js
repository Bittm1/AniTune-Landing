// src/components/Parallax/hooks/useScrollProgress.js - ANGEPASST für 5 Titel-Phasen (0-7 total)

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { findNearestSnapTarget, findAdjacentTitle, getCurrentActiveTitle } from '../config/baseConfig';
import { getSnapTiming, getBackToLogoTiming, getDeviceOptimizedTiming, getActiveScrollSegments } from '../config/timingConfig';

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

    // ✅ TIMING-CONFIG LADEN
    const timingConfig = getDeviceOptimizedTiming();
    const snapTiming = getSnapTiming();

    // Manuelles Update des Scroll-Fortschritts
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(2.5, (currentScroll / totalHeight) * 2.5)); // 0-2.5 für 8 Phasen

        setScrollProgress(progress);

        // Phase-Logik für 8 Phasen (0-7)
        if (currentTitleIndex === 0) {
            setActiveTitle(null); // Phase 0 = Logo/Newsletter
        } else if (titles.length > 0 && titles[currentTitleIndex - 1]) {
            setActiveTitle(titles[currentTitleIndex - 1]); // Index 1+ → titles[0+]
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

    // ✅ SNAP-FUNKTION: Für 8 Phasen (0-7)
    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || isSnapping) return;

        // ✅ NEU: Lade segments aus timingConfig
        const segmentConfig = getActiveScrollSegments();
        const segments = segmentConfig.segments;

        const maxIndex = 7; // ✅ ANGEPASST: 0-7 = 8 Phasen (0=Logo, 1-5=Titel, 6=Carousel, 7=Newsletter)
        if (targetIndex < 0 || targetIndex > maxIndex) return;

        console.log(`🔒 Lock-Snap zu Phase ${targetIndex}: ${targetIndex === 0 ? 'Logo/Newsletter' :
            targetIndex === 6 ? 'AniTune Carousel' :
                targetIndex === 7 ? 'Newsletter CTA' :
                    titles[targetIndex - 1]?.text || 'Titel ' + targetIndex
            }`);

        setIsScrollLocked(true);
        setIsSnapping(true);

        // ✅ SCROLL-ZIEL-BERECHNUNG: Aus timingConfig segments
        let targetScroll = 0;
        let animationDuration = snapTiming.duration;
        let animationEase = snapTiming.ease;

        if (segments[targetIndex]) {
            const targetSegment = segments[targetIndex];
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            targetScroll = targetSegment.snapTarget * totalHeight / 2.5;

            // ✅ SPEZIALFALL: Phase 0 → Phase 1 (langsame Animation für Zoom)
            if (currentTitleIndex === 0 && targetIndex === 1) {
                animationDuration = 2.5;
                animationEase = 'power2.inOut';
                console.log('🎬 Phase 0→1: Langsame Animation für Zoom-Effekt');
            }
            // ✅ NEU: Phase 6 → Phase 7 (sanfter Übergang)
            else if (currentTitleIndex === 6 && targetIndex === 7) {
                animationDuration = 1.8;
                animationEase = 'power2.inOut';
                console.log('📧 Phase 6→7: Sanfter Übergang zu Newsletter');
            } else {
                animationDuration = targetSegment.snapDuration || snapTiming.duration;
                animationEase = targetSegment.snapEase || snapTiming.ease;
            }
        }

        // GSAP-Animation
        gsap.to(window, {
            duration: animationDuration,
            scrollTo: { y: targetScroll },
            ease: animationEase,
            onUpdate: () => {
                updateScrollProgress();
            },
            onComplete: () => {
                setCurrentTitleIndex(targetIndex);

                if (targetIndex === 0) {
                    setActiveTitle(null);
                } else if (targetIndex <= 5) {
                    setActiveTitle(titles[targetIndex - 1]);
                } else {
                    setActiveTitle(null); // Phase 6 (Carousel) und 7 (Newsletter) haben keine Titel
                }

                setTimeout(() => {
                    setIsScrollLocked(false);
                    setIsSnapping(false);
                }, snapTiming.lockDelay);
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress, snapTiming, currentTitleIndex]);

    // ✅ SCROLL-EVENT-BEHANDLUNG mit 8 Phasen (0-7)
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

        const maxIndex = 7; // ✅ ANGEPASST: 0-7 = 8 Phasen

        if (delta > 0) {
            // Scroll nach unten
            const nextIndex = Math.min(currentTitleIndex + 1, maxIndex);
            if (nextIndex !== currentTitleIndex) {
                snapToTitleIndex(nextIndex, 'next');
            }
        } else if (delta < 0) {
            // Scroll nach oben
            const prevIndex = Math.max(currentTitleIndex - 1, 0);
            if (prevIndex !== currentTitleIndex) {
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, snapToTitleIndex]);

    // ✅ TOUCH-EVENT-BEHANDLUNG mit 8 Phasen
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
        const maxIndex = 7; // ✅ ANGEPASST: 0-7 = 8 Phasen

        if (Math.abs(deltaY) > 30 && deltaTime < 500) {
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

    // ✅ KEYBOARD-NAVIGATION mit 8 Phasen
    const handleKeyboardNavigation = useCallback((direction) => {
        if (isScrollLocked || isSnapping) return;

        const maxIndex = 7; // ✅ ANGEPASST: 0-7 = 8 Phasen

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

    // Event-Listener Setup (unverändert)
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

    // Keyboard-Events mit 8 Phasen Support
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
                    snapToTitleIndex(0); // Phase 0
                    break;
                case 'End':
                    e.preventDefault();
                    snapToTitleIndex(7); // ✅ ANGEPASST: Phase 7
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyboardNavigation, snapToTitleIndex]);

    // Initialisierung (unverändert)
    useEffect(() => {
        if (titles.length > 0) {
            updateScrollProgress();
        }
    }, [titles, updateScrollProgress]);

    // Legacy-Funktionen für Kompatibilität
    const scrollToSection = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    const scrollToTitleIndex = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    // Formatierter Progress
    const formattedScrollProgress = {
        normalized: (Math.min(2.5, Math.max(0, scrollProgress)) * 40).toFixed(0),
        absolute: (scrollProgress * 40).toFixed(0),
        phase1: Math.min(1, scrollProgress),
        phase2: Math.max(0, Math.min(1, scrollProgress - 1)),
        phase3: Math.max(0, scrollProgress - 2),
        percentage: (scrollProgress * 40).toFixed(0) + '%'
    };

    // Return-Werte - ANGEPASST für 8 Phasen
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

        // Helper für Phase-Erkennung - ANGEPASST für 8 Phasen
        isLogoPhase: currentTitleIndex === 0,
        isTitlePhase: currentTitleIndex >= 1 && currentTitleIndex <= 5, // ✅ 1-5 statt 1-6
        isCarouselPhase: currentTitleIndex === 6, // ✅ Phase 6 statt 7
        isNewsletterPhase: currentTitleIndex === 7, // ✅ Phase 7 statt 8
        currentPhaseDescription:
            currentTitleIndex === 0 ? 'Logo/Newsletter' :
                currentTitleIndex === 6 ? 'AniTune Carousel' :
                    currentTitleIndex === 7 ? 'Newsletter CTA' :
                        titles[currentTitleIndex - 1]?.text || `Titel ${currentTitleIndex}`,

        // ✅ ANGEPASSTE Timing-Debug-Info
        timingInfo: {
            preset: timingConfig.name,
            snapDuration: snapTiming.duration,
            snapEase: snapTiming.ease,
            currentPhase: currentTitleIndex === 0 ? 'Logo/Newsletter' :
                currentTitleIndex === 6 ? 'AniTune Carousel' :
                    currentTitleIndex === 7 ? 'Newsletter CTA' :
                        `Titel ${currentTitleIndex}`,
            totalPhases: 8, // ✅ ANGEPASST: 0-7 = 8 Phasen
            configurable: true
        }
    };
}