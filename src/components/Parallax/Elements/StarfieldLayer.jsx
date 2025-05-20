// Optimierte StarfieldLayer.jsx
import React, { useRef, useEffect, useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';

const StarfieldLayer = React.memo(() => {
    const canvasRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const shootingStarsRef = useRef([]);
    const timeOfLastStarRef = useRef(0);

    // Konfiguration als useMemo, damit sie nicht bei jedem Render neu erstellt wird
    const config = useMemo(() => ({
        maxStars: 2,
        minInterval: 5000,
        maxInterval: 10000,
        starLengthMin: 30,
        starLengthMax: 110,
        starSpeedMin: 3,
        starSpeedMax: 9,
        angleMin: 30,
        angleMax: 60
    }), []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Canvas an Fenstergröße anpassen - als eigene Funktion für bessere Lesbarkeit
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Funktion zum Erstellen einer neuen Sternschnuppe - optimiert
        const createShootingStar = () => {
            const now = Date.now();
            // Mindestabstand zwischen neuen Sternen einhalten
            if (now - timeOfLastStarRef.current < config.minInterval) return;
            if (shootingStarsRef.current.length >= config.maxStars) return;

            // Zufallswerte mit besserer Lesbarkeit
            const { width, height } = canvas;
            const x = Math.random() * (width * 0.8);
            const y = Math.random() * (height * 0.3);
            const angle = (Math.random() * (config.angleMax - config.angleMin) + config.angleMin) * Math.PI / 180;
            const length = Math.random() * (config.starLengthMax - config.starLengthMin) + config.starLengthMin;
            const speed = Math.random() * (config.starSpeedMax - config.starSpeedMin) + config.starSpeedMin;

            shootingStarsRef.current.push({
                x, y, length, speed, angle,
                opacity: 0.8
            });

            timeOfLastStarRef.current = now;
        };

        // Check für neue Sternschnuppen, jetzt im Render-Loop statt mit setInterval
        const checkForNewStars = () => {
            const now = Date.now();
            const timeSinceLastStar = now - timeOfLastStarRef.current;

            if (timeSinceLastStar > config.maxInterval ||
                (timeSinceLastStar > config.minInterval && Math.random() > 0.6)) {
                createShootingStar();
            }
        };

        // Optimierter Render-Loop
        const render = () => {
            if (!canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Prüfen, ob ein neuer Stern erstellt werden soll
            checkForNewStars();

            // Sternschnuppen bewegen und zeichnen
            for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
                const star = shootingStarsRef.current[i];

                // Bewegung
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;

                // Verblassen am Ende
                if (star.y > canvas.height * 0.7 || star.x > canvas.width * 0.9) {
                    star.opacity -= 0.02;
                }

                // Schweif zeichnen, wenn der Stern sichtbar ist
                if (star.opacity > 0) {
                    const gradient = ctx.createLinearGradient(
                        star.x, star.y,
                        star.x - Math.cos(star.angle) * star.length,
                        star.y - Math.sin(star.angle) * star.length
                    );

                    gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
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

            animationFrameIdRef.current = window.requestAnimationFrame(render);
        };

        // Initialisierung
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animationFrameIdRef.current = window.requestAnimationFrame(render);

        // Aufräumen
        return () => {
            window.cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener('resize', resizeCanvas);
            shootingStarsRef.current = [];
        };
    }, [config]);

    return (
        <ErrorBoundary>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
        </ErrorBoundary>
    );
});

export default StarfieldLayer;