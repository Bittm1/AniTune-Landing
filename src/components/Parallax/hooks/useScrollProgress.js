// src/components/Parallax/hooks/useScrollProgress.js - NUR Phase 4 scrollProgress Erweiterung

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

    // ✅ NUR DIESE ÄNDERUNG: 2.5 auf 3.0 für Phase 4
    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = Math.max(0, Math.min(3.0, (currentScroll / totalHeight) * 3.0));

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

    const snapToTitleIndex = useCallback((targetIndex, direction = 'next') => {
        if (isScrollLocked || isSnapping) return;

        const segmentConfig = getActiveScrollSegments();
        const segments = segmentConfig.segments;
        const maxIndex = 7;

        if (targetIndex < 0 || targetIndex > maxIndex) return;

        const snapDuration = getSnapDurationForTransition(currentTitleIndex, targetIndex);
        const snapEase = getSnapEasingForTransition(currentTitleIndex, targetIndex);
        const lockDelay = getSnapLockDelayForTransition(currentTitleIndex, targetIndex);

        console.log(`🎯 PROFESSIONELLER SNAP: ${currentTitleIndex}→${targetIndex}`);
        console.log(`⏱️ Dauer: ${snapDuration}s | Easing: ${snapEase} | Lock: ${lockDelay}ms`);

        setIsScrollLocked(true);
        setIsSnapping(true);

        let targetScroll = 0;
        if (segments[targetIndex]) {
            const targetSegment = segments[targetIndex];
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
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
                setCurrentTitleIndex(targetIndex);

                if (targetIndex === 0) {
                    setActiveTitle(null);
                } else if (targetIndex <= 5) {
                    setActiveTitle(titles[targetIndex - 1]);
                } else {
                    setActiveTitle(null);
                }

                setTimeout(() => {
                    setIsScrollLocked(false);
                    setIsSnapping(false);
                }, lockDelay);
            }
        });
    }, [isScrollLocked, isSnapping, titles, updateScrollProgress, currentTitleIndex]);

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
        const maxIndex = 7;

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
        const maxIndex = 7;

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

    const handleKeyboardNavigation = useCallback((direction) => {
        if (isScrollLocked || isSnapping) return;

        const maxIndex = 7;

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
                    snapToTitleIndex(7);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyboardNavigation, snapToTitleIndex]);

    useEffect(() => {
        if (titles.length > 0) {
            updateScrollProgress();
        }
    }, [titles, updateScrollProgress]);

    const scrollToSection = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    const scrollToTitleIndex = useCallback((index) => {
        snapToTitleIndex(index);
    }, [snapToTitleIndex]);

    // ✅ NUR DIESE ÄNDERUNG: 3.0 statt 2.5
    const formattedScrollProgress = {
        normalized: (Math.min(3.0, Math.max(0, scrollProgress)) * 40).toFixed(0),
        absolute: (scrollProgress * 40).toFixed(0),
        phase1: Math.min(1, scrollProgress),
        phase2: Math.max(0, Math.min(1, scrollProgress - 1)),
        phase3: Math.max(0, scrollProgress - 2),
        percentage: (scrollProgress * 40).toFixed(0) + '%'
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
        isTitlePhase: currentTitleIndex >= 1 && currentTitleIndex <= 5,
        isCarouselPhase: currentTitleIndex === 6,
        isNewsletterPhase: currentTitleIndex === 7,
        currentPhaseDescription:
            currentTitleIndex === 0 ? 'Logo/Newsletter' :
                currentTitleIndex === 6 ? 'AniTune Carousel' :
                    currentTitleIndex === 7 ? 'Newsletter CTA' :
                        titles[currentTitleIndex - 1]?.text || `Titel ${currentTitleIndex}`,

        timingInfo: {
            preset: timingConfig.name,
            snapDuration: snapTiming.duration,
            snapEase: snapTiming.ease,
            currentPhase: currentTitleIndex === 0 ? 'Logo/Newsletter' :
                currentTitleIndex === 6 ? 'AniTune Carousel' :
                    currentTitleIndex === 7 ? 'Newsletter CTA' :
                        `Titel ${currentTitleIndex}`,
            totalPhases: 8,
            configurable: true,
            snapConfig: getSnapConfigDebugInfo()
        }
    };
}