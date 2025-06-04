// src/hooks/useMobileViewport.js - REACT HOOK FÜR MOBILE VIEWPORT

import { useState, useEffect, useCallback, useRef } from 'react';
import { getViewportManager } from '../utils/ViewportManager';

/**
 * 📱 REACT HOOK für Mobile Viewport Management
 */
export const useMobileViewport = () => {
    const [viewportState, setViewportState] = useState({
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
        urlBarVisible: true,
        isStable: false,
        orientation: 'portrait'
    });

    const stabilityTimeoutRef = useRef(null);
    const lastChangeRef = useRef(Date.now());

    const updateViewportState = useCallback((data) => {
        setViewportState(prev => ({
            ...prev,
            height: data.height,
            urlBarVisible: data.urlBarVisible,
            isStable: false,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        }));

        lastChangeRef.current = Date.now();

        // Stability-Timer
        clearTimeout(stabilityTimeoutRef.current);
        stabilityTimeoutRef.current = setTimeout(() => {
            setViewportState(prev => ({
                ...prev,
                isStable: true
            }));
        }, 500);

    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const manager = getViewportManager();
        const cleanup = manager.onViewportChange(updateViewportState);

        // Initial state
        setViewportState({
            height: manager.getActualHeight(),
            urlBarVisible: manager.isUrlBarCurrentlyVisible(),
            isStable: true,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        });

        return () => {
            cleanup();
            clearTimeout(stabilityTimeoutRef.current);
        };
    }, [updateViewportState]);

    // Utility functions
    const getCompensatedHeight = useCallback(() => {
        return getViewportManager().getCompensatedHeight();
    }, []);

    const getVHUnit = useCallback(() => {
        return viewportState.height / 100;
    }, [viewportState.height]);

    return {
        ...viewportState,
        getCompensatedHeight,
        getVHUnit,
        manager: getViewportManager()
    };
};

// ================================================================
// ENHANCED PARALLAX CONTAINER INTEGRATION
// ================================================================

/**
 * 📱 Mobile-optimierte Scroll Progress Berechnung
 */
export const useMobileScrollProgress = (containerRef, sectionsRef, titles = []) => {
    const { height, urlBarVisible, isStable } = useMobileViewport();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [compensatedProgress, setCompensatedProgress] = useState(0);

    const updateScrollProgress = useCallback(() => {
        if (!containerRef.current || typeof window === 'undefined') return;

        // Basis-Berechnung
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const basicProgress = Math.max(0, Math.min(3.0, (currentScroll / totalHeight) * 3.0));

        // Mobile-Kompensation für URL-Bar
        const manager = getViewportManager();
        const compensatedHeight = manager.getCompensatedHeight();
        const compensatedTotal = document.documentElement.scrollHeight - compensatedHeight;
        const compensatedProgress = Math.max(0, Math.min(3.0, (currentScroll / compensatedTotal) * 3.0));

        setScrollProgress(basicProgress);
        setCompensatedProgress(compensatedProgress);

        if (process.env.NODE_ENV === 'development') {
            console.log('📱 Mobile Scroll:', {
                basic: basicProgress.toFixed(3),
                compensated: compensatedProgress.toFixed(3),
                urlBar: urlBarVisible,
                height: height
            });
        }

    }, [height, urlBarVisible, containerRef]);

    useEffect(() => {
        const handleScroll = () => {
            updateScrollProgress();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateScrollProgress(); // Initial call

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [updateScrollProgress]);

    return {
        scrollProgress: compensatedProgress, // Verwende kompensierte Version
        basicProgress: scrollProgress,       // Original für Debugging
        isStable,
        updateScrollProgress
    };
};

// ================================================================
// PARALLAX CONTAINER ENHANCEMENT
// ================================================================

/**
 * 📱 Enhanced ParallaxContainerModular Integration
 * Füge dies in deine ParallaxContainerModular.jsx ein:
 */

// 1. Import am Anfang der Datei:
// import { useMobileViewport, useMobileScrollProgress } from '../hooks/useMobileViewport';
// import '../styles/mobileViewport.css';

// 2. Ersetze den useScrollProgress Hook:
/*
const ParallaxContainerModular = React.memo(() => {
    // Andere States...
    
    // ✅ MOBILE-OPTIMIERTE Scroll Progress
    const isMobile = window.innerWidth < 768;
    const mobileViewport = useMobileViewport();
    
    const scrollProgressHook = isMobile 
        ? useMobileScrollProgress(containerRef, sectionsRef, config.titles)
        : useScrollProgress(containerRef, sectionsRef, config.titles);
    
    const {
        scrollProgress,
        activeSection,
        // ... andere properties
    } = scrollProgressHook;
    
    // ✅ VIEWPORT DEBUGGING (nur Development)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && isMobile) {
            const debugEl = document.createElement('div');
            debugEl.className = 'viewport-debug';
            debugEl.setAttribute('data-vh', mobileViewport.height);
            debugEl.setAttribute('data-compensated', mobileViewport.getCompensatedHeight());
            debugEl.setAttribute('data-url-bar', mobileViewport.urlBarVisible ? 'visible' : 'hidden');
            
            document.body.appendChild(debugEl);
            
            return () => {
                if (document.body.contains(debugEl)) {
                    document.body.removeChild(debugEl);
                }
            };
        }
    }, [mobileViewport, isMobile]);
    
    // Rest der Komponente bleibt gleich...
});
*/

// ================================================================
// UTILITY FUNCTIONS FÜR MOBILE
// ================================================================

/**
 * 📱 Mobile-spezifische Berechnungen
 */
export const mobileUtils = {
    // Berechne sichere Höhe ohne URL-Bar Interference
    getSafeHeight: () => {
        const manager = getViewportManager();
        return manager.getCompensatedHeight();
    },

    // Berechne Position mit URL-Bar Kompensation
    getCompensatedPosition: (basePosition, compensation = 0.5) => {
        const manager = getViewportManager();
        const offset = manager.isUrlBarCurrentlyVisible() ? 0 : 60 * compensation;
        return `calc(${basePosition} + ${offset}px)`;
    },

    // Check ob URL-Bar gerade versteckt wird
    isUrlBarHiding: () => {
        const manager = getViewportManager();
        return !manager.isUrlBarCurrentlyVisible();
    },

    // Viewport-Info für Debugging
    getViewportInfo: () => {
        const manager = getViewportManager();
        return {
            actual: manager.getActualHeight(),
            compensated: manager.getCompensatedHeight(),
            urlBarVisible: manager.isUrlBarCurrentlyVisible(),
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
    }
};

// ================================================================
// CSS-IN-JS HELPER FÜR DYNAMISCHE STYLES
// ================================================================

/**
 * 📱 Dynamische Mobile Styles
 */
export const getMobileStyles = (viewport) => {
    return {
        // Container mit kompensierter Höhe
        mobileContainer: {
            minHeight: `${viewport.getCompensatedHeight()}px`,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'none'
        },

        // Fixed Layer mit aktueller Viewport-Höhe
        mobileFixedLayer: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: `${viewport.height}px`,
            pointerEvents: 'none',
            zIndex: 1
        },

        // Newsletter mit URL-Bar Kompensation
        mobileNewsletter: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(-50% + ${viewport.urlBarVisible ? '0' : '30'}px))`,
            transition: 'transform 0.3s ease',
            width: '80%',
            maxWidth: '500px',
            zIndex: 25
        },

        // Debug-Indicator
        mobileDebug: {
            position: 'fixed',
            top: viewport.urlBarVisible ? '10px' : '0px',
            right: '0px',
            transform: `translateY(${viewport.urlBarVisible ? '0' : '-30'}px)`,
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 12px',
            fontSize: '11px',
            zIndex: 1000,
            borderBottomLeftRadius: '8px'
        }
    };
};

// ================================================================
// EXPORT
// ================================================================

export default {
    useMobileViewport,
    useMobileScrollProgress,
    mobileUtils,
    getMobileStyles
};