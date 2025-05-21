// src/components/Parallax/hooks/useScrollProgress.js
import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollProgress(containerRef, sectionsRef) {
    // States
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);

    // Refs
    const scrollTimeoutRef = useRef(null);

    // Manuelles Update des Scroll-Fortschritts
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));

        setScrollProgress(progress);

        // Aktiven Abschnitt berechnen
        const sectionCount = sectionsRef.current.length;
        if (sectionCount > 0) {
            const newSectionIndex = Math.round(progress * (sectionCount - 1));
            setActiveSection(newSectionIndex);
        }
    }, [containerRef, sectionsRef]);

    // Scroll-Event-Handler setup
    useEffect(() => {
        if (!containerRef.current) return;

        // Handler für Scroll-Events
        const handleScroll = () => {
            // Debounce für bessere Performance
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Direkt aktualisieren für flüssiges Gefühl
            requestAnimationFrame(updateScrollProgress);

            // Verzögert nochmal aktualisieren für akkurate End-Position
            scrollTimeoutRef.current = setTimeout(updateScrollProgress, 50);
        };

        // Resize-Handler
        const handleResize = () => {
            updateScrollProgress();
        };

        // Event-Listener registrieren
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Initiale Aktualisierung
        updateScrollProgress();

        // Aufräumen
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [containerRef, updateScrollProgress]);

    // Funktion zum Scrollen zu einer bestimmten Sektion
    const scrollToSection = useCallback((index) => {
        if (typeof window === 'undefined') return;

        const sectionHeight = window.innerHeight;
        const y = index * sectionHeight;

        // Sanftes Scrollen zur Sektion
        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });

        // Nach dem Scrollen manuell den aktiven Abschnitt setzen
        setTimeout(() => {
            setActiveSection(index);
        }, 800);
    }, []);

    // Formatierter Scroll-Progress
    const formattedScrollProgress = {
        normalized: (Math.min(1, Math.max(0, scrollProgress)) * 100).toFixed(0),
        absolute: (scrollProgress * 100).toFixed(0)
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