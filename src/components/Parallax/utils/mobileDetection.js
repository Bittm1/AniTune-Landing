// src/utils/mobileDetection.js - Mobile Detection Utility

/**
 * 📱 MOBILE DETECTION UTILITY
 * Zentrale Funktion zur Erkennung von Mobile-Geräten
 */

export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;

    // Kombinierte Detection: Viewport-Breite + Touch-Support
    const isMobileViewport = window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isMobileViewport && isTouchDevice;
};

/**
 * 🎯 REACT HOOK für Mobile Detection
 */
import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(isMobileDevice());
        };

        // Initial check
        checkMobile();

        // Listen for resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

/**
 * 🔧 DEBUG PANEL WRAPPER
 * Wrapper-Component die Debug-Panels nur auf Desktop zeigt
 */
export const DebugPanel = ({ children, forceShow = false }) => {
    const isMobile = useMobileDetection();

    // Zeige Debug-Panel nur wenn:
    // 1. Development Mode UND
    // 2. (Nicht Mobile ODER Force-Show)
    if (process.env.NODE_ENV !== 'development') return null;
    if (isMobile && !forceShow) return null;

    return children;
};