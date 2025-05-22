// src/components/Parallax/hooks/useScrollProgress.js
import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollProgress(containerRef, sectionsRef) {
    // States
    const [scrollProgress, setScrollProgress] = useState(0); // Jetzt 0-2 statt 0-1
    const [activeSection, setActiveSection] = useState(0);

    // Refs
    const scrollTimeoutRef = useRef(null);

    // Manuelles Update des Scroll-Fortschritts
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        // HIER IST DIE ÄNDERUNG: Progress geht jetzt von 0-2
        const progress = Math.max(0, Math.min(2, (currentScroll / totalHeight) * 2));

        setScrollProgress(progress);

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
    }, [containerRef, sectionsRef]);

    // Scroll-Event-Handler setup (bleibt gleich)
    useEffect(() => {
        if (!containerRef.current) return;

        const handleScroll = () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            requestAnimationFrame(updateScrollProgress);
            scrollTimeoutRef.current = setTimeout(updateScrollProgress, 50);
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
        };
    }, [containerRef, updateScrollProgress]);

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
        updateScrollProgress
    };
}