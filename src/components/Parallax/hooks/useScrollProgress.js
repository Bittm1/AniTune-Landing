import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { findNearestSnapTarget, findAdjacentTitle, getCurrentActiveTitle } from '../config/baseConfig';

export function useScrollProgress(containerRef, sectionsRef, titles = []) {
    // States
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);
    const [activeTitle, setActiveTitle] = useState(null);
    const [isSnapping, setIsSnapping] = useState(false);

    // NEU: Lock-Snap Variablen - VERBESSERT
    const [currentTitleIndex, setCurrentTitleIndex] = useState(-1); // ✅ -1 = Logo+Newsletter Phase
    const [isScrollLocked, setIsScrollLocked] = useState(false);

    // Refs
    const scrollTimeoutRef = useRef(null);
    const snapTimeoutRef = useRef(null);
    const lastScrollTime = useRef(0);
    const scrollDirection = useRef(0);
    const lastScrollEventRef = useRef(0); // NEU: Für Scroll-Debouncing

    // Manuelles Update des Scroll-Fortschritts - ZURÜCK ZUM ORIGINAL
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        // ✅ NORMALE PARALLAX-BERECHNUNG für alle Layer außer Titeln
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(2, (currentScroll / totalHeight) * 2));

        setScrollProgress(progress);

        // Aktiven Titel separat setzen (basierend auf currentTitleIndex)
        if (titles.length > 0 && titles[currentTitleIndex]) {
            setActiveTitle(titles[currentTitleIndex]);
        }

        // Aktiven Abschnitt berechnen - erweitert für 14 Sektionen (0-200%)
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

    // NEU: Lock-Snap Funktion für Titel-Navigation - VERBESSERT
    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || targetIndex < 0 || targetIndex >= titles.length) return;

        const targetTitle = titles[targetIndex];
        if (!targetTitle) return;

        console.log(`🔒 Lock-Snap zu Titel ${targetIndex + 1}: "${targetTitle.text}"`);

        // Scroll-Lock aktivieren
        setIsScrollLocked(true);
        setIsSnapping(true);

        // Berechne Ziel-Scroll-Position basierend auf Titel-Position
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = targetTitle.snapTarget * totalHeight / 2;

        // GSAP-Animation zum Ziel
        gsap.to(window, {
            duration: targetTitle.snapDuration || 1.5,
            scrollTo: { y: targetScroll },
            ease: targetTitle.snapEase || "power2.inOut",
            onUpdate: () => {
                // ✅ WÄHREND SNAP: Normale updateScrollProgress aufrufen
                // Das stellt sicher, dass alle anderen Layer sich normal verhalten
                updateScrollProgress();
            },
            onComplete: () => {
                // Titel-Index aktualisieren
                setCurrentTitleIndex(targetIndex);
                setActiveTitle(targetTitle);

                // Lock nach kurzer Verzögerung freigeben
                setTimeout(() => {
                    setIsScrollLocked(false);
                    setIsSnapping(false);
                }, 200);
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress]);

    // NEU: Scroll-Event-Handler mit Lock-Logik - VERBESSERT
    const handleScrollEvent = useCallback((event) => {
        // Ignoriere Scroll-Events wenn gesperrt
        if (isScrollLocked || isSnapping) {
            event.preventDefault();
            return;
        }

        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollEventRef.current;

        // Debounce: Ignoriere sehr schnelle aufeinanderfolgende Scroll-Events
        if (timeSinceLastScroll < 100) return;

        lastScrollEventRef.current = now;

        // Bestimme Scroll-Richtung
        const delta = event.deltaY || event.detail || (event.wheelDelta * -1);

        if (delta > 0) {
            // Nach unten scrollen
            if (currentTitleIndex === -1) {
                // ✅ ERSTER SCROLL: Von Logo+Newsletter zu Titel 0
                snapToTitleIndex(0, 'next');
            } else {
                // Normaler Titel-Wechsel zum nächsten
                const nextIndex = Math.min(currentTitleIndex + 1, titles.length - 1);
                if (nextIndex !== currentTitleIndex) {
                    snapToTitleIndex(nextIndex, 'next');
                }
            }
        } else if (delta < 0) {
            // Nach oben scrollen
            if (currentTitleIndex === 0) {
                // ✅ VON TITEL 0 ZURÜCK: Zu Logo+Newsletter
                setCurrentTitleIndex(-1);
                setActiveTitle(null);
                // Scroll to top
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: 0 },
                    ease: "power2.inOut"
                });
            } else if (currentTitleIndex > 0) {
                // Normaler Titel-Wechsel zum vorherigen
                const prevIndex = Math.max(currentTitleIndex - 1, 0);
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, titles, snapToTitleIndex]);

    // NEU: Touch-Event-Handler für Mobile
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

        // Minimale Swipe-Distanz und maximale Zeit
        if (Math.abs(deltaY) > 30 && deltaTime < 500) {
            if (deltaY > 0) {
                // Nach oben gewischt (Finger bewegt sich nach oben = Inhalt nach unten)
                if (currentTitleIndex === -1) {
                    // ✅ ERSTER SWIPE: Von Logo+Newsletter zu Titel 0
                    snapToTitleIndex(0, 'next');
                } else {
                    // Normaler Titel-Wechsel zum nächsten
                    const nextIndex = Math.min(currentTitleIndex + 1, titles.length - 1);
                    if (nextIndex !== currentTitleIndex) {
                        snapToTitleIndex(nextIndex, 'next');
                    }
                }
            } else {
                // Nach unten gewischt (Finger bewegt sich nach unten = Inhalt nach oben)
                if (currentTitleIndex === 0) {
                    // ✅ VON TITEL 0 ZURÜCK: Zu Logo+Newsletter
                    setCurrentTitleIndex(-1);
                    setActiveTitle(null);
                    // Scroll to top
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: 0 },
                        ease: "power2.inOut"
                    });
                } else if (currentTitleIndex > 0) {
                    // Normaler Titel-Wechsel zum vorherigen
                    const prevIndex = Math.max(currentTitleIndex - 1, 0);
                    snapToTitleIndex(prevIndex, 'prev');
                }
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, titles, snapToTitleIndex]);

    // Erweiterte Keyboard-Navigation - VERBESSERT
    const handleKeyboardNavigation = useCallback((direction) => {
        if (isScrollLocked || isSnapping) return;

        if (direction === 'next') {
            if (currentTitleIndex === -1) {
                // Von Logo+Newsletter zu Titel 0
                snapToTitleIndex(0, 'next');
            } else {
                const nextIndex = Math.min(currentTitleIndex + 1, titles.length - 1);
                if (nextIndex !== currentTitleIndex) {
                    snapToTitleIndex(nextIndex, 'next');
                }
            }
        } else {
            if (currentTitleIndex === 0) {
                // Von Titel 0 zurück zu Logo+Newsletter
                setCurrentTitleIndex(-1);
                setActiveTitle(null);
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: 0 },
                    ease: "power2.inOut"
                });
            } else if (currentTitleIndex > 0) {
                const prevIndex = Math.max(currentTitleIndex - 1, 0);
                snapToTitleIndex(prevIndex, 'prev');
            }
        }
    }, [isScrollLocked, isSnapping, currentTitleIndex, titles, snapToTitleIndex]);

    // Event-Listener Setup
    useEffect(() => {
        if (!containerRef.current || titles.length === 0) return;

        // Scroll-Events (Mausrad)
        const handleWheel = (e) => {
            e.preventDefault();
            handleScrollEvent(e);
        };

        // Touch-Events für Mobile
        const handleTouchStartEvent = (e) => handleTouchStart(e);
        const handleTouchEndEvent = (e) => handleTouchEnd(e);

        // Event-Listener hinzufügen
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
                case ' ': // Leertaste
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

    // Initialisierung: Starte bei Logo+Newsletter (Index -1)
    useEffect(() => {
        if (titles.length > 0) {
            // ✅ Starte immer bei Logo+Newsletter, nicht beim ersten Titel
            updateScrollProgress();
        }
    }, [titles, updateScrollProgress]);

    // Legacy-Funktionen für Kompatibilität
    const scrollToSection = useCallback((index) => {
        // Map section zu title index (falls nötig)
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

        // Snap-Scroll Features
        activeTitle,
        isSnapping,
        snapToTitle: snapToTitleIndex, // Alias für Kompatibilität
        scrollToTitleIndex,
        handleKeyboardNavigation,

        // NEU: Lock-Snap Features
        currentTitleIndex,
        isScrollLocked
    };
}