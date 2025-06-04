// src/utils/ViewportManager.js - MOBILE VIEWPORT FIX

/**
 * 📱 MOBILE VIEWPORT MANAGER
 * Löst das Problem der verschwindenden URL-Leiste
 */

class ViewportManager {
    constructor() {
        this.actualHeight = window.innerHeight;
        this.initialHeight = window.innerHeight;
        this.isUrlBarVisible = true;
        this.callbacks = new Set();

        // CSS Custom Properties für dynamische Höhen
        this.updateCSSProperties();

        // Event Listeners
        this.setupEventListeners();

        // Initial Check
        this.checkViewportChange();

        if (process.env.NODE_ENV === 'development') {
            console.log('📱 ViewportManager initialisiert:', {
                initialHeight: this.initialHeight,
                actualHeight: this.actualHeight
            });
        }
    }

    setupEventListeners() {
        // Resize Event (wichtigster)
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });

        // Orientation Change
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));

        // Visual Viewport API (moderne Browser)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', this.handleVisualViewportResize.bind(this));
        }

        // Scroll Events für zusätzliche Checks
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Focus Events (für Keyboard)
        window.addEventListener('focusin', this.handleFocusIn.bind(this));
        window.addEventListener('focusout', this.handleFocusOut.bind(this));
    }

    handleResize() {
        // Debounce für Performance
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.checkViewportChange();
        }, 100);
    }

    handleVisualViewportResize() {
        if (window.visualViewport) {
            this.actualHeight = window.visualViewport.height;
            this.updateCSSProperties();
            this.notifyCallbacks('visualViewport');
        }
    }

    handleOrientationChange() {
        // Warte auf Orientation-Stabilisierung
        setTimeout(() => {
            this.checkViewportChange();
        }, 500);
    }

    handleScroll() {
        // Throttle Scroll-Checks
        if (!this.scrollThrottle) {
            this.scrollThrottle = true;
            requestAnimationFrame(() => {
                this.checkViewportChange();
                this.scrollThrottle = false;
            });
        }
    }

    handleFocusIn() {
        // Keyboard erscheint möglicherweise
        setTimeout(() => this.checkViewportChange(), 300);
    }

    handleFocusOut() {
        // Keyboard verschwindet möglicherweise
        setTimeout(() => this.checkViewportChange(), 300);
    }

    checkViewportChange() {
        const newHeight = window.innerHeight;
        const heightDiff = Math.abs(newHeight - this.actualHeight);

        // Signifikante Änderung?
        if (heightDiff > 50) {
            const wasUrlBarVisible = this.isUrlBarVisible;

            // URL-Bar Status bestimmen
            this.isUrlBarVisible = newHeight <= this.initialHeight - 30;
            this.actualHeight = newHeight;

            // CSS Properties aktualisieren
            this.updateCSSProperties();

            // Callbacks benachrichtigen
            this.notifyCallbacks('heightChange', {
                height: newHeight,
                urlBarVisible: this.isUrlBarVisible,
                changed: wasUrlBarVisible !== this.isUrlBarVisible
            });

            if (process.env.NODE_ENV === 'development') {
                console.log('📱 Viewport-Änderung:', {
                    height: newHeight,
                    diff: heightDiff,
                    urlBarVisible: this.isUrlBarVisible,
                    changed: wasUrlBarVisible !== this.isUrlBarVisible
                });
            }
        }
    }

    updateCSSProperties() {
        const root = document.documentElement;

        // Standard Höhen setzen
        root.style.setProperty('--vh', `${this.actualHeight * 0.01}px`);
        root.style.setProperty('--vh-full', `${this.actualHeight}px`);

        // Visual Viewport (falls verfügbar)
        if (window.visualViewport) {
            root.style.setProperty('--vvh', `${window.visualViewport.height * 0.01}px`);
            root.style.setProperty('--vvh-full', `${window.visualViewport.height}px`);
        }

        // URL-Bar kompensierte Höhe
        const compensatedHeight = this.isUrlBarVisible ? this.actualHeight : this.actualHeight + 60;
        root.style.setProperty('--vh-compensated', `${compensatedHeight * 0.01}px`);
        root.style.setProperty('--vh-compensated-full', `${compensatedHeight}px`);

        // Status-Indikatoren
        root.style.setProperty('--url-bar-visible', this.isUrlBarVisible ? '1' : '0');
        root.style.setProperty('--url-bar-offset', this.isUrlBarVisible ? '0px' : '60px');
    }

    // Callback-System für externe Komponenten
    onViewportChange(callback) {
        this.callbacks.add(callback);

        // Cleanup-Funktion zurückgeben
        return () => {
            this.callbacks.delete(callback);
        };
    }

    notifyCallbacks(event, data = {}) {
        this.callbacks.forEach(callback => {
            try {
                callback({
                    event,
                    height: this.actualHeight,
                    urlBarVisible: this.isUrlBarVisible,
                    ...data
                });
            } catch (error) {
                console.error('ViewportManager callback error:', error);
            }
        });
    }

    // Utility-Funktionen
    getActualHeight() {
        return this.actualHeight;
    }

    getCompensatedHeight() {
        return this.isUrlBarVisible ? this.actualHeight : this.actualHeight + 60;
    }

    isUrlBarCurrentlyVisible() {
        return this.isUrlBarVisible;
    }

    // Cleanup
    destroy() {
        clearTimeout(this.resizeTimeout);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('focusin', this.handleFocusIn);
        window.removeEventListener('focusout', this.handleFocusOut);

        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this.handleVisualViewportResize);
        }

        this.callbacks.clear();
    }
}

// Singleton Instance
let viewportManagerInstance = null;

export const getViewportManager = () => {
    if (!viewportManagerInstance) {
        viewportManagerInstance = new ViewportManager();
    }
    return viewportManagerInstance;
};

// React Hook für einfache Verwendung
export const useViewportHeight = () => {
    const [height, setHeight] = React.useState(window.innerHeight);
    const [urlBarVisible, setUrlBarVisible] = React.useState(true);

    React.useEffect(() => {
        const manager = getViewportManager();

        const cleanup = manager.onViewportChange(({ height, urlBarVisible }) => {
            setHeight(height);
            setUrlBarVisible(urlBarVisible);
        });

        return cleanup;
    }, []);

    return { height, urlBarVisible };
};

// Utility-Funktionen für direkte Verwendung
export const getActualViewportHeight = () => {
    return getViewportManager().getActualHeight();
};

export const getCompensatedViewportHeight = () => {
    return getViewportManager().getCompensatedHeight();
};

export const isUrlBarVisible = () => {
    return getViewportManager().isUrlBarCurrentlyVisible();
};

export default ViewportManager;