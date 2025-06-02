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
        const progress = Math.max(0, Math.min(2, (currentScroll / totalHeight) * 2));

        setScrollProgress(progress);

        // Phase-Logik
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

    // ✅ ERWEITERTE SNAP-FUNKTION: Verwendet jetzt Segments aus timingConfig
    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || isSnapping) return;

        // ✅ NEU: Lade segments aus timingConfig
        const segmentConfig = getActiveScrollSegments();
        const segments = segmentConfig.segments;

        const maxIndex = 14; // 0-14 = 15 Phasen (professionell skaliert)
        if (targetIndex < 0 || targetIndex > maxIndex) return;

        console.log(`🔒 Lock-Snap zu Phase ${targetIndex}: ${targetIndex === 0 ? 'Logo/Newsletter' : titles[targetIndex - 1]?.text || 'Titel ' + targetIndex}`);

        setIsScrollLocked(true);
        setIsSnapping(true);

        // ✅ NEUE SCROLL-ZIEL-BERECHNUNG: Aus timingConfig segments
        let targetScroll = 0;
        let animationDuration = snapTiming.duration;
        let animationEase = snapTiming.ease;

        if (segments[targetIndex]) {
            const targetSegment = segments[targetIndex];
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            targetScroll = targetSegment.snapTarget * totalHeight / 2;

            // ✅ SPEZIALFALL: Phase 0 → Phase 1 (langsame Animation für Zoom)
            if (currentTitleIndex === 0 && targetIndex === 1) {
                animationDuration = 2.5; // Langsamer für Zoom-Effekt
                animationEase = 'power2.inOut';
                console.log('🎬 Phase 0→1: Langsame Animation für Zoom-Effekt');
            } else {
                // Verwende Segment-spezifische Einstellungen
                animationDuration = targetSegment.snapDuration || snapTiming.duration;
                animationEase = targetSegment.snapEase || snapTiming.ease;
            }
        }

        // GSAP-Animation mit konfigurierten Parametern
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
                } else {
                    setActiveTitle(titles[targetIndex - 1]);
                }

                setTimeout(() => {
                    setIsScrollLocked(false);
                    setIsSnapping(false);
                }, snapTiming.lockDelay);
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress, snapTiming, currentTitleIndex]);

    // ✅ KORRIGIERT: SCROLL-EVENT-BEHANDLUNG
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

        const maxIndex = 14; // 0-14 = 15 Phasen (professionell skaliert)

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

    // ✅ KORRIGIERT: TOUCH-EVENT-BEHANDLUNG
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
        const maxIndex = 14; // 0-14 = 15 Phasen (professionell skaliert)

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

    // ✅ KORRIGIERT: KEYBOARD-NAVIGATION
    const handleKeyboardNavigation = useCallback((direction) => {
        if (isScrollLocked || isSnapping) return;

        const maxIndex = 14; // 0-14 = 15 Phasen (professionell skaliert)

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

    // Keyboard-Events (unverändert)
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
                    snapToTitleIndex(7); // ✅ KORRIGIERT: Phase 7
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
        normalized: (Math.min(2, Math.max(0, scrollProgress)) * 50).toFixed(0),
        absolute: (scrollProgress * 50).toFixed(0),
        phase1: Math.min(1, scrollProgress),
        phase2: Math.max(0, scrollProgress - 1),
        percentage: (scrollProgress * 50).toFixed(0) + '%'
    };

    // Return-Werte
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

        // Helper für Phase-Erkennung
        isLogoPhase: currentTitleIndex === 0,
        isTitlePhase: currentTitleIndex > 0,
        currentPhaseDescription: currentTitleIndex === 0 ? 'Logo/Newsletter' : titles[currentTitleIndex - 1]?.text || `Titel ${currentTitleIndex}`,

        // ✅ ERWEITERTE Timing-Debug-Info
        timingInfo: {
            preset: timingConfig.name,
            snapDuration: snapTiming.duration,
            snapEase: snapTiming.ease,
            currentPhase: currentTitleIndex === 0 ? 'Logo/Newsletter' : `Titel ${currentTitleIndex}`,
            totalPhases: 8, // ✅ KORRIGIERT: 0-7 = 8 Phasen
            configurable: true // Alle Phasen sind jetzt konfigurierbar
        }
    };
}