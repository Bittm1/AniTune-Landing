// src/components/Enhanced/layers/StarfieldLayer.jsx
// 🌟 STARFIELD LAYER - Animierte 3D Sterne + gelegentliche Sternschnuppen

import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import ErrorBoundary from '../../ErrorBoundary';

const StarfieldLayer = React.memo(({ scrollProgress, config, deviceConfig }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const starsRef = useRef([]);
    const lastTimeRef = useRef(0);

    // ===== STERNSCHNUPPEN REFS =====
    const shootingStarsRef = useRef([]);
    const timeOfLastStarRef = useRef(0);

    // ===== LAYER DATA BERECHNUNG =====
    const layerData = useMemo(() => {
        if (!config?.active || !config?.movement) {
            if (process.env.NODE_ENV === 'development') {
                console.warn('🚨 StarfieldLayer: Invalid config', { config });
            }
            return { visible: false };
        }

        const { scrollStart, scrollEnd, opacity, speed } = config.movement;
        const visible = scrollProgress >= scrollStart && scrollProgress <= scrollEnd;

        if (!visible) return { visible: false };

        // Berechne lokalen Progress
        const localProgress = scrollEnd > scrollStart
            ? Math.max(0, Math.min(1, (scrollProgress - scrollStart) / (scrollEnd - scrollStart)))
            : 0;

        // Starfield-Intensität ändert sich mit Scroll
        const finalOpacity = opacity * (0.3 + 0.7 * Math.sin(localProgress * Math.PI * 0.5));
        const animationSpeed = speed * (0.5 + localProgress * 0.5);

        return {
            opacity: Math.max(0, Math.min(1, finalOpacity)),
            speed: animationSpeed,
            visible: true
        };
    }, [scrollProgress, config]);

    // ===== RESPONSIVE MULTIPLIER =====
    const multiplier = deviceConfig?.multiplier || 1.0;
    const isMobile = multiplier < 1;

    // ===== STERNSCHNUPPEN KONFIGURATION =====
    const shootingStarConfig = useMemo(() => ({
        maxStars: isMobile ? 1 : 2,
        minInterval: isMobile ? 8000 : 5000,
        maxInterval: 15000,
        starLengthMin: isMobile ? 20 : 30,
        starLengthMax: isMobile ? 80 : 110,
        starSpeedMin: isMobile ? 2 : 3,
        starSpeedMax: isMobile ? 6 : 9,
        angleMin: 30,
        angleMax: 60
    }), [isMobile]);

    // ===== 3D STERNE INITIALISIERUNG =====
    const initializeStars = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const numStars = isMobile ? 80 : 150; // Weniger Sterne auf Mobile
        const stars = [];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 1000,
                originalZ: Math.random() * 1000,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.8 + 0.2,
                twinkleOffset: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        starsRef.current = stars;

        if (process.env.NODE_ENV === 'development') {
            console.log('🌟 StarfieldLayer: Initialized', {
                numStars,
                canvasSize: `${canvas.width}x${canvas.height}`,
                isMobile
            });
        }
    }, [isMobile]);

    // ===== STERNSCHNUPPEN FUNKTIONEN =====
    const createShootingStar = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const now = Date.now();
        // Mindestabstand zwischen neuen Sternen einhalten
        if (now - timeOfLastStarRef.current < shootingStarConfig.minInterval) return;
        if (shootingStarsRef.current.length >= shootingStarConfig.maxStars) return;

        // Zufallswerte
        const { width, height } = canvas;
        const x = Math.random() * (width * 0.8);
        const y = Math.random() * (height * 0.3);
        const angle = (Math.random() * (shootingStarConfig.angleMax - shootingStarConfig.angleMin) + shootingStarConfig.angleMin) * Math.PI / 180;
        const length = Math.random() * (shootingStarConfig.starLengthMax - shootingStarConfig.starLengthMin) + shootingStarConfig.starLengthMin;
        const speed = Math.random() * (shootingStarConfig.starSpeedMax - shootingStarConfig.starSpeedMin) + shootingStarConfig.starSpeedMin;

        shootingStarsRef.current.push({
            x, y, length, speed, angle,
            opacity: 0.8
        });

        timeOfLastStarRef.current = now;
    }, [shootingStarConfig]);

    const checkForNewStars = useCallback(() => {
        const now = Date.now();
        const timeSinceLastStar = now - timeOfLastStarRef.current;

        if (timeSinceLastStar > shootingStarConfig.maxInterval ||
            (timeSinceLastStar > shootingStarConfig.minInterval && Math.random() > 0.6)) {
            createShootingStar();
        }
    }, [createShootingStar, shootingStarConfig]);

    // ===== CANVAS RESIZE =====
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;

        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Re-initialize stars for new canvas size
        initializeStars();
    }, [initializeStars]);

    // ===== ANIMATION LOOP (ERWEITERT) =====
    const animate = useCallback((currentTime) => {
        const canvas = canvasRef.current;
        if (!canvas || !layerData.visible) return;

        const ctx = canvas.getContext('2d');
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

        // ===== 3D STERNE ZEICHNEN =====
        starsRef.current.forEach((star, index) => {
            // Update star position (slow movement)
            star.z -= layerData.speed * deltaTime * 0.01;
            if (star.z <= 0) {
                star.z = star.originalZ;
                star.x = Math.random() * canvas.width / window.devicePixelRatio;
                star.y = Math.random() * canvas.height / window.devicePixelRatio;
            }

            // 3D to 2D projection
            const x = (star.x - canvas.width / window.devicePixelRatio / 2) * (1000 / star.z) + canvas.width / window.devicePixelRatio / 2;
            const y = (star.y - canvas.height / window.devicePixelRatio / 2) * (1000 / star.z) + canvas.height / window.devicePixelRatio / 2;

            // Skip stars outside canvas
            if (x < 0 || x > canvas.width / window.devicePixelRatio || y < 0 || y > canvas.height / window.devicePixelRatio) {
                return;
            }

            // Calculate star properties
            const size = star.size * (1000 / star.z) * multiplier;
            const twinkle = Math.sin(currentTime * 0.002 + star.twinkleOffset) * 0.3 + 0.7;
            const brightness = star.brightness * twinkle * layerData.opacity;

            // Draw star
            ctx.beginPath();
            ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fill();

            // Add glow for brighter stars
            if (brightness > 0.6) {
                ctx.beginPath();
                ctx.arc(x, y, size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.1})`;
                ctx.fill();
            }
        });

        // ===== STERNSCHNUPPEN PRÜFEN UND ZEICHNEN =====
        checkForNewStars();

        // Sternschnuppen bewegen und zeichnen
        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
            const star = shootingStarsRef.current[i];

            // Bewegung
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;

            // Verblassen am Ende
            if (star.y > canvas.height / window.devicePixelRatio * 0.7 || star.x > canvas.width / window.devicePixelRatio * 0.9) {
                star.opacity -= 0.02;
            }

            // Schweif zeichnen, wenn der Stern sichtbar ist
            if (star.opacity > 0) {
                const gradient = ctx.createLinearGradient(
                    star.x, star.y,
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );

                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * layerData.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );
                ctx.stroke();
            }

            // Sternschnuppe entfernen, wenn sie verblasst ist
            if (star.opacity <= 0) {
                shootingStarsRef.current.splice(i, 1);
            }
        }

        // Continue animation
        if (layerData.visible) {
            animationRef.current = requestAnimationFrame(animate);
        }
    }, [layerData, multiplier, checkForNewStars]);

    // ===== EFFECTS =====

    // Canvas setup
    useEffect(() => {
        resizeCanvas();

        const handleResize = () => {
            resizeCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [resizeCanvas]);

    // Animation control
    useEffect(() => {
        if (layerData.visible) {
            lastTimeRef.current = performance.now();
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [layerData.visible, animate]);

    // Performance Debug (Development only)
    if (process.env.NODE_ENV === 'development' && layerData.visible) {
        console.log('🌟 StarfieldLayer Active:', {
            scrollProgress: (scrollProgress * 100).toFixed(1) + '%',
            opacity: layerData.opacity.toFixed(2),
            speed: layerData.speed.toFixed(2),
            numStars: starsRef.current.length,
            shootingStars: shootingStarsRef.current.length,
            multiplier
        });
    }

    // Nicht rendern wenn nicht sichtbar
    if (!layerData.visible) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                className="starfield-layer"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: config?.zIndex || 2,
                    pointerEvents: 'none',
                    opacity: layerData.opacity
                }}
                data-layer="starfield"
                data-scroll-progress={(scrollProgress * 100).toFixed(1)}
                data-opacity={layerData.opacity.toFixed(2)}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block'
                    }}
                />

                {/* ===== DEVELOPMENT DEBUG INFO ===== */}
                {process.env.NODE_ENV === 'development' && layerData.opacity > 0.3 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(0, 0, 139, 0.9)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            lineHeight: '1.3',
                            zIndex: 1,
                            border: '1px solid #4169e1',
                            maxWidth: '200px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            🌟 STARFIELD LAYER
                        </div>
                        <div>3D Stars: {starsRef.current.length}</div>
                        <div>Shooting Stars: {shootingStarsRef.current.length}/{shootingStarConfig.maxStars}</div>
                        <div>Opacity: {layerData.opacity.toFixed(2)}</div>
                        <div>Speed: {layerData.speed.toFixed(2)}</div>
                        <div>Device: {isMobile ? '📱' : '🖥️'}</div>
                        <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px' }}>
                            3D starfield + shooting stars<br />
                            Responsive • Performance optimized
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
});

StarfieldLayer.displayName = 'StarfieldLayer';

export default StarfieldLayer;