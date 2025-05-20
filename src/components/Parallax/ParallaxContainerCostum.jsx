import React, { useState, useEffect, useMemo } from 'react';

// Eigene Throttle-Funktion
function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId = null;

    return function (...args) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);

        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            return func.apply(this, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

const ParallaxContainer = () => {
    // States für Animation
    const [scrollY, setScrollY] = useState(0);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    // Responsive Werte mit useMemo cachen
    const values = useMemo(() => {
        const { width } = windowSize;

        if (width < 640) {
            return {
                scrollDistance: 4000,
                bgZoomStart: 3.0,
                bgZoomEnd: 1.0,
                logoScaleStart: 1.8,
                logoScaleEnd: 1.0,
                logoYStart: 33,
                logoYEnd: 15
            };
        } else if (width < 1024) {
            return {
                scrollDistance: 5000,
                bgZoomStart: 3.2,
                bgZoomEnd: 1.0,
                logoScaleStart: 2.0,
                logoScaleEnd: 1.0,
                logoYStart: 33,
                logoYEnd: 15
            };
        } else if (width < 1440) {
            return {
                scrollDistance: 6000,
                bgZoomStart: 3.5,
                bgZoomEnd: 1.0,
                logoScaleStart: 2.0,
                logoScaleEnd: 0.9,
                logoYStart: 33,
                logoYEnd: 12
            };
        } else {
            return {
                // Reduzierte Scroll-Distanz für bessere Performance
                scrollDistance: 8000,
                bgZoomStart: 4.0,
                bgZoomEnd: 1.0,
                logoScaleStart: 2.0,
                logoScaleEnd: 0.8,
                logoYStart: 33,
                logoYEnd: 10
            };
        }
    }, [windowSize.width]);

    // Resize-Handler für responsive Anpassungen
    useEffect(() => {
        const handleResize = throttle(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, 100);

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Initial call
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    // Scroll-Handler
    useEffect(() => {
        const handleScroll = throttle(() => {
            setScrollY(window.scrollY);
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial call
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Vorberechnete Werte mit useMemo cachen
    const animations = useMemo(() => {
        // Berechne Progress
        let scrollProgress;
        if (windowSize.width >= 1440) {
            scrollProgress = Math.min(1, (scrollY * 1.5) / values.scrollDistance);
        } else {
            scrollProgress = Math.min(1, scrollY / values.scrollDistance);
        }

        // Zoom-Berechnung
        const zoomRange = values.bgZoomStart - values.bgZoomEnd;
        const bgScale = Math.max(values.bgZoomEnd, values.bgZoomStart - (scrollProgress * zoomRange));

        // Logo-Skalierung
        const logoRange = values.logoScaleStart - values.logoScaleEnd;
        const logoScale = values.logoScaleStart - (scrollProgress * logoRange);

        // Logo-Position
        const logoYRange = values.logoYStart - values.logoYEnd;
        const logoY = values.logoYStart - (scrollProgress * logoYRange);

        return {
            scrollProgress,
            bgScale,
            logoScale,
            logoY
        };
    }, [scrollY, values, windowSize.width]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Debug-Anzeige */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                fontSize: '12px',
                zIndex: 100
            }}>
                {windowSize.width}x{windowSize.height} |
                Scroll: {Math.round(scrollY)}px |
                Progress: {Math.round(animations.scrollProgress * 100)}% |
                Zoom: {animations.bgScale.toFixed(2)}x
            </div>

            {/* Hintergrundbild */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh'
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: "url('/Parallax/Himmel.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        transform: `scale(${animations.bgScale})`,
                        transformOrigin: 'center top'
                    }} />
                </div>
            </div>

            {/* Wolken-Layer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 5
            }}>
                {/* Wolke links - bewegt sich nur auf der X-Achse */}
                <div style={{
                    position: 'absolute',
                    left: `${-25 + animations.scrollProgress * 40}%`, // Nur horizontale Bewegung
                    bottom: '45%', // Fixe vertikale Position in der Mitte
                    transform: 'translateX(-50%)',
                }}>
                    <img
                        src="/Parallax/Wolken_Vorne_links.png"
                        alt="Wolken links"
                        style={{
                            maxWidth: '623px',
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </div>

                {/* Wolke rechts - bewegt sich nur auf der X-Achse */}
                <div style={{
                    position: 'absolute',
                    right: `${-25 + animations.scrollProgress * 40}%`, // Nur horizontale Bewegung
                    bottom: '45%', // Fixe vertikale Position in der Mitte
                    transform: 'translateX(50%)',
                }}>
                    <img
                        src="/Parallax/Wolken_Vorne_rechts.png"
                        alt="Wolken rechts"
                        style={{
                            maxWidth: '446px',
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </div>
            </div>

            {/* Logo */}
            <div style={{
                position: 'fixed',
                top: `${animations.logoY}%`,
                left: '50%',
                transform: `translate(-50%, -50%) scale(${animations.logoScale})`,
                zIndex: 10
            }}>
                <img
                    src="/Parallax/Logo.png"
                    alt="Logo"
                    style={{
                        filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
                    }}
                />
            </div>

            {/* Scroll-Bereich */}
            <div style={{ height: `${values.scrollDistance}px` }}></div>
        </div>
    );
};

export default ParallaxContainer;