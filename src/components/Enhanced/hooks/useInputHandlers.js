// src/components/Parallax/Enhanced/hooks/useInputHandlers.js
// 🎮 LAYER 1: INPUT HANDLERS - Touch, Wheel, Keyboard Events

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 🎯 INPUT HANDLERS HOOK
 * Verwaltet alle Eingabe-Events und konvertiert sie zu Navigation-Calls
 * 
 * @param {Object} params
 * @param {Function} params.goToNext - Funktion für nächsten Snap-Point
 * @param {Function} params.goToPrev - Funktion für vorherigen Snap-Point  
 * @param {boolean} params.isSnapping - Snap-Animation läuft
 * @param {number} params.activeSnapPoint - Aktueller Snap-Point
 * @param {number} params.maxSnapPoints - Maximale Anzahl Snap-Points
 */
export const useInputHandlers = ({
    goToNext,
    goToPrev,
    isSnapping = false,
    activeSnapPoint = 0,
    maxSnapPoints = 5
}) => {
    // ===== STATES =====
    const [isInputLocked, setIsInputLocked] = useState(false);
    const [lastInputTime, setLastInputTime] = useState(0);
    const [inputCooldown, setInputCooldown] = useState(false);

    // ===== REFS =====
    const touchStartRef = useRef({ y: 0, time: 0, x: 0 });
    const wheelAccumulatorRef = useRef(0);
    const lastWheelTimeRef = useRef(0);
    const debounceTimeoutRef = useRef(null);

    // ===== MOBILE DETECTION =====
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // ===== CONFIGURATION =====
    const config = {
        // Wheel Input
        wheelThreshold: 100,
        wheelDebounce: 300,
        wheelAccumulationReset: 150,

        // Touch Input
        touchThreshold: 50,
        touchTimeLimit: 700,
        touchMinTime: 100,

        // Keyboard Input
        keyboardDebounce: 200,

        // General
        inputCooldownTime: 400,
        lockDuration: 300
    };

    // ===== INPUT COOLDOWN MANAGEMENT =====
    const startInputCooldown = useCallback(() => {
        setInputCooldown(true);
        setTimeout(() => {
            setInputCooldown(false);
        }, config.inputCooldownTime);
    }, [config.inputCooldownTime]);

    const isInputBlocked = useCallback(() => {
        return isSnapping || isInputLocked || inputCooldown;
    }, [isSnapping, isInputLocked, inputCooldown]);

    // ===== NAVIGATION HELPERS =====
    const executeNavigation = useCallback((direction) => {
        if (isInputBlocked()) return false;

        const now = Date.now();
        if (now - lastInputTime < config.inputCooldownTime) return false;

        setLastInputTime(now);
        startInputCooldown();

        if (direction === 'next' && activeSnapPoint < maxSnapPoints) {
            goToNext();
            return true;
        } else if (direction === 'prev' && activeSnapPoint > 0) {
            goToPrev();
            return true;
        }

        return false;
    }, [
        isInputBlocked,
        lastInputTime,
        config.inputCooldownTime,
        startInputCooldown,
        activeSnapPoint,
        maxSnapPoints,
        goToNext,
        goToPrev
    ]);

    // ===== WHEEL INPUT HANDLER =====
    const handleWheel = useCallback((event) => {
        event.preventDefault();

        if (isInputBlocked()) return;

        const now = Date.now();
        const delta = event.deltaY;

        // Reset accumulator if too much time passed
        if (now - lastWheelTimeRef.current > config.wheelAccumulationReset) {
            wheelAccumulatorRef.current = 0;
        }

        wheelAccumulatorRef.current += delta;
        lastWheelTimeRef.current = now;

        // Check if threshold is reached
        if (Math.abs(wheelAccumulatorRef.current) >= config.wheelThreshold) {
            const direction = wheelAccumulatorRef.current > 0 ? 'next' : 'prev';

            if (executeNavigation(direction)) {
                wheelAccumulatorRef.current = 0;

                if (process.env.NODE_ENV === 'development') {
                    console.log(`🖱️ Input: Wheel ${direction} (delta: ${delta.toFixed(0)})`);
                }
            }
        }

        // Clear debounce timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Reset accumulator after debounce period
        debounceTimeoutRef.current = setTimeout(() => {
            wheelAccumulatorRef.current = 0;
        }, config.wheelDebounce);

    }, [
        isInputBlocked,
        config.wheelThreshold,
        config.wheelAccumulationReset,
        config.wheelDebounce,
        executeNavigation
    ]);

    // ===== TOUCH INPUT HANDLERS =====
    const handleTouchStart = useCallback((event) => {
        if (isInputBlocked() || event.touches.length !== 1) return;

        const touch = event.touches[0];
        touchStartRef.current = {
            y: touch.clientY,
            x: touch.clientX,
            time: Date.now()
        };
    }, [isInputBlocked]);

    const handleTouchEnd = useCallback((event) => {
        if (isInputBlocked() || event.changedTouches.length !== 1) return;

        const touch = event.changedTouches[0];
        const touchEnd = {
            y: touch.clientY,
            x: touch.clientX,
            time: Date.now()
        };

        const deltaY = touchStartRef.current.y - touchEnd.y;
        const deltaX = Math.abs(touchStartRef.current.x - touchEnd.x);
        const deltaTime = touchEnd.time - touchStartRef.current.time;

        // Validate touch gesture
        const isValidGesture =
            Math.abs(deltaY) >= config.touchThreshold &&
            deltaX < Math.abs(deltaY) * 0.5 && // More vertical than horizontal
            deltaTime >= config.touchMinTime &&
            deltaTime <= config.touchTimeLimit;

        if (isValidGesture) {
            const direction = deltaY > 0 ? 'next' : 'prev';

            if (executeNavigation(direction)) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`👆 Input: Touch ${direction} (δY: ${deltaY.toFixed(0)}px, t: ${deltaTime}ms)`);
                }
            }
        }
    }, [
        isInputBlocked,
        config.touchThreshold,
        config.touchMinTime,
        config.touchTimeLimit,
        executeNavigation
    ]);

    // ===== KEYBOARD INPUT HANDLER =====
    const handleKeyboard = useCallback((event) => {
        // Skip if input elements are focused
        const activeElement = document.activeElement;
        if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
            return;
        }

        if (isInputBlocked()) return;

        let direction = null;

        switch (event.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // Space bar
                direction = 'next';
                break;

            case 'ArrowUp':
            case 'PageUp':
                direction = 'prev';
                break;

            case 'Home':
                // Special case: Go to start
                if (activeSnapPoint > 0) {
                    event.preventDefault();
                    // Multiple prev calls to get to start
                    let currentPoint = activeSnapPoint;
                    const goToStart = () => {
                        if (currentPoint > 0) {
                            goToPrev();
                            currentPoint--;
                            setTimeout(goToStart, config.inputCooldownTime);
                        }
                    };
                    goToStart();
                }
                return;

            case 'End':
                // Special case: Go to end
                if (activeSnapPoint < maxSnapPoints) {
                    event.preventDefault();
                    // Multiple next calls to get to end
                    let currentPoint = activeSnapPoint;
                    const goToEnd = () => {
                        if (currentPoint < maxSnapPoints) {
                            goToNext();
                            currentPoint++;
                            setTimeout(goToEnd, config.inputCooldownTime);
                        }
                    };
                    goToEnd();
                }
                return;

            default:
                return; // Ignore other keys
        }

        if (direction) {
            event.preventDefault();

            if (executeNavigation(direction)) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`⌨️ Input: Keyboard ${direction} (${event.key})`);
                }
            }
        }
    }, [
        isInputBlocked,
        activeSnapPoint,
        maxSnapPoints,
        executeNavigation,
        goToNext,
        goToPrev,
        config.inputCooldownTime
    ]);

    // ===== INPUT LOCK MANAGEMENT =====
    const lockInput = useCallback((duration = config.lockDuration) => {
        setIsInputLocked(true);
        setTimeout(() => {
            setIsInputLocked(false);
        }, duration);
    }, [config.lockDuration]);

    const unlockInput = useCallback(() => {
        setIsInputLocked(false);
    }, []);

    // ===== AUTO-UNLOCK WHEN SNAPPING ENDS =====
    useEffect(() => {
        if (!isSnapping && isInputLocked) {
            // Auto-unlock when snapping animation ends
            setTimeout(unlockInput, 100);
        }
    }, [isSnapping, isInputLocked, unlockInput]);

    // ===== CLEANUP =====
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    // ===== DEBUG INFO =====
    const getDebugInfo = useCallback(() => {
        if (process.env.NODE_ENV !== 'development') return null;

        return {
            isInputLocked,
            inputCooldown,
            isSnapping,
            activeSnapPoint,
            maxSnapPoints,
            lastInputTime,
            timeSinceLastInput: Date.now() - lastInputTime,
            wheelAccumulator: wheelAccumulatorRef.current,
            touchStart: touchStartRef.current,
            isBlocked: isInputBlocked(),
            isMobile,
            config,
            canGoNext: activeSnapPoint < maxSnapPoints,
            canGoPrev: activeSnapPoint > 0,
            inputTypes: {
                wheel: !isMobile,
                touch: isMobile,
                keyboard: true
            }
        };
    }, [
        isInputLocked,
        inputCooldown,
        isSnapping,
        activeSnapPoint,
        maxSnapPoints,
        lastInputTime,
        isInputBlocked,
        isMobile,
        config
    ]);

    // ===== MANUAL CONTROLS =====
    const manualNext = useCallback(() => {
        return executeNavigation('next');
    }, [executeNavigation]);

    const manualPrev = useCallback(() => {
        return executeNavigation('prev');
    }, [executeNavigation]);

    const resetInput = useCallback(() => {
        wheelAccumulatorRef.current = 0;
        setInputCooldown(false);
        setIsInputLocked(false);
        setLastInputTime(0);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    }, []);

    // ===== RETURN API =====
    return {
        // Event Handlers (for attaching to DOM elements)
        handleWheel,
        handleTouchStart,
        handleTouchEnd,
        handleKeyboard,

        // States
        isInputLocked,
        inputCooldown,
        isInputBlocked: isInputBlocked(),

        // Manual Controls
        manualNext,
        manualPrev,
        lockInput,
        unlockInput,
        resetInput,

        // Navigation Status
        canGoNext: activeSnapPoint < maxSnapPoints,
        canGoPrev: activeSnapPoint > 0,

        // Utilities
        getDebugInfo,

        // Configuration
        config,
        isMobile
    };
};

export default useInputHandlers;