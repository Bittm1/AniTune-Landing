import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { findNearestSnapTarget, findAdjacentTitle, getCurrentActiveTitle } from '../config/baseConfig';

export function useScrollProgress(containerRef, sectionsRef, titles = []) {
    // States
    const [scrollProgress, setScrollProgress] = useState(0); // Jetzt 0-2 statt 0-1
    const [activeSection, setActiveSection] = useState(0);
    const [activeTitle, setActiveTitle] = useState(null);
    const [isSnapping, setIsSnapping] = useState(false);

    // Refs
    const scrollTimeoutRef = useRef(null);
    const snapTimeoutRef = useRef(null);
    const lastScrollTime = useRef(0);
    const scrollDirection = useRef(0);

    // Manuelles Update des Scroll-Fortschritts
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        // HIER IST DIE ÄNDERUNG: Progress geht jetzt von 0-2
        const progress = Math.max(0, Math.min(2, (currentScroll / totalHeight) * 2));

        setScrollProgress(progress);

        // Aktiven Titel finden (NEU)
        if (titles.length > 0) {
            const currentTitle = getCurrentActiveTitle(progress, titles);
            setActiveTitle(currentTitle);
        }

        // Aktiven Abschnitt berechnen - erweitert für 14 Sektionen (0-200%)
        const sectionCount = sectionsRef.current.length;
        if (sectionCount > 0) {
            // Für die ersten 7 Sektionen (0-100%)
            if (progress <= 1) {
                const newSectionIndex = Math.round(progress * (sectionCount / 2 - 1));
                setActiveSection(newSectionIndex);
            }
            // Für die nächsten 7 Sektionen (100%-200%)
            else {
                const extendedProgress = progress - 1; // 0-1 für zweite Hälfte
                const newSectionIndex = Math.round(extendedProgress * (sectionCount / 2 - 1)) + (sectionCount / 2);
                setActiveSection(newSectionIndex);
            }
        }
    }, [containerRef, sectionsRef, titles]);

    // NEU: Snap-to-Title Funktion
    const snapToTitle = useCallback((title, force = false) => {
        if (!title || (isSnapping && !force)) return;

        setIsSnapping(true);

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = title.snapTarget * totalHeight / 2; // /2 wegen 0-2 range

        gsap.to(window, {
            duration: title.snapDuration || 1.2,
            scrollTo: { y: targetScroll },
            ease: title.snapEase || "power2.inOut",
            onComplete: () => {
                setIsSnapping(false);
                setActiveTitle(title);
            }
        });

        // Debug-Log
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 Snapping to: "${title.text}" at ${(title.snapTarget * 100).toFixed(1)}%`);
        }
    }, [isSnapping]);

    // NEU: Auto-Snap nach Scroll-Ende
    const handleScrollEnd = useCallback(() => {
        if (isSnapping || titles.length === 0) return;

        // Debounce um zu verhindern, dass während User scrollt gesnapped wird
        clearTimeout(snapTimeoutRef.current);
        snapTimeoutRef.current = setTimeout(() => {
            const nearestTitle = findNearestSnapTarget(scrollProgress, titles);
            if (nearestTitle) {
                const currentTitle = getCurrentActiveTitle(scrollProgress, titles);

                // Nur snappen wenn User nicht bereits in einem Titel-Bereich ist
                if (!currentTitle) {
                    snapToTitle(nearestTitle);
                }
            }
        }, 800); // 800ms nach letztem Scroll-Event
    }, [scrollProgress, titles, isSnapping, snapToTitle]);

    // NEU: Keyboard-Navigation
    const handleKeyboardNavigation = useCallback((direction) => {
        if (isSnapping || titles.length === 0) return;

        const targetTitle = findAdjacentTitle(scrollProgress, titles, direction);
        if (targetTitle) {
            snapToTitle(targetTitle, true); // Force snap
        }
    }, [scrollProgress, titles, isSnapping, snapToTitle]);

    // NEU: Keyboard-Event-Handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Nur wenn kein Input-Feld fokussiert ist
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
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
                    if (titles[0]) snapToTitle(titles[0], true);
                    break;
                case 'End':
                    e.preventDefault();
                    if (titles[titles.length - 1]) snapToTitle(titles[titles.length - 1], true);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyboardNavigation, snapToTitle, titles]);

    // Scroll-Event-Handler setup mit Auto-Snap
    useEffect(() => {
        if (!containerRef.current) return;

        const handleScroll = () => {
            const now = Date.now();
            scrollDirection.current = now - lastScrollTime.current;
            lastScrollTime.current = now;

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            requestAnimationFrame(updateScrollProgress);

            // Auto-Snap nach Scroll-Ende (nur wenn User scrollt, nicht bei Snap-Animation)
            if (!isSnapping) {
                scrollTimeoutRef.current = setTimeout(handleScrollEnd, 50);
            }
        };

        const handleResize = () => {
            updateScrollProgress();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        updateScrollProgress();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (snapTimeoutRef.current) {
                clearTimeout(snapTimeoutRef.current);
            }
        };
    }, [containerRef, updateScrollProgress, handleScrollEnd, isSnapping]);

    // Funktion zum Scrollen zu einer bestimmten Sektion - ERWEITERT
    const scrollToSection = useCallback((index) => {
        if (typeof window === 'undefined') return;

        const sectionHeight = window.innerHeight;
        const y = index * sectionHeight;

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });

        setTimeout(() => {
            setActiveSection(index);
        }, 800);
    }, []);

    // NEU: Direkte Navigation zu Titel-Index
    const scrollToTitleIndex = useCallback((index) => {
        if (titles[index]) {
            snapToTitle(titles[index], true);
        }
    }, [titles, snapToTitle]);

    // Formatierter Scroll-Progress - ERWEITERT
    const formattedScrollProgress = {
        normalized: (Math.min(2, Math.max(0, scrollProgress)) * 50).toFixed(0), // 0-100%
        absolute: (scrollProgress * 50).toFixed(0), // 0-100% (bei scrollProgress = 2)
        // Neue Werte für bessere Übersicht:
        phase1: Math.min(1, scrollProgress), // 0-1 für bestehende Effekte
        phase2: Math.max(0, scrollProgress - 1), // 0-1 für neue Effekte
        percentage: (scrollProgress * 50).toFixed(0) + '%' // 0%-100%
    };

    return {
        scrollProgress,
        activeSection,
        setActiveSection,
        scrollToSection,
        formattedScrollProgress,
        updateScrollProgress,

        // NEU: Snap-Scroll Features
        activeTitle,
        isSnapping,
        snapToTitle,
        scrollToTitleIndex,
        handleKeyboardNavigation
    };
}