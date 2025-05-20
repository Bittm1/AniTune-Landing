// src/components/Parallax/Elements/StarfieldLayer.jsx
import React, { useRef, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';

const StarfieldLayer = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Canvas an Fenstergröße anpassen
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Sternschnuppen-Array
        const shootingStars = [];

        // Funktion zum Erstellen einer neuen Sternschnuppe
        const createShootingStar = () => {
            // Zufällige Startposition im oberen Bereich
            const x = Math.random() * (canvas.width * 0.8);
            const y = Math.random() * (canvas.height * 0.3);

            // Zufälliger Winkel zwischen 30° und 60°
            const angle = (Math.random() * 30 + 30) * Math.PI / 180;

            // Länge und Geschwindigkeit variieren
            const length = Math.random() * 80 + 30;
            const speed = Math.random() * 6 + 3;

            shootingStars.push({
                x: x,
                y: y,
                length: length,
                speed: speed,
                angle: angle,
                opacity: 0.8 // Etwas dezenter
            });
        };

        // Seltener Sternschnuppen erstellen (alle 5-10 Sekunden)
        const shootingStarInterval = setInterval(() => {
            if (Math.random() > 0.6 && shootingStars.length < 2) { // Maximal 2 gleichzeitig
                createShootingStar();
            }
        }, Math.random() * 5000 + 5000); // 5-10 Sekunden Abstand

        // Animation-Loop
        const render = () => {
            // Canvas leeren
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Sternschnuppen bewegen und zeichnen
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const star = shootingStars[i];

                // Bewegung
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;

                // Verblassen am Ende
                if (star.y > canvas.height * 0.7 || star.x > canvas.width * 0.9) {
                    star.opacity -= 0.02;
                }

                // Gradient für Schweif
                const gradient = ctx.createLinearGradient(
                    star.x, star.y,
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );

                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5; // Etwas dünner für dezentere Wirkung
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(
                    star.x - Math.cos(star.angle) * star.length,
                    star.y - Math.sin(star.angle) * star.length
                );
                ctx.stroke();

                // Sternschnuppe entfernen, wenn sie verblasst ist
                if (star.opacity <= 0) {
                    shootingStars.splice(i, 1);
                }
            }

            animationFrameId = window.requestAnimationFrame(render);
        };

        let animationFrameId = window.requestAnimationFrame(render);

        // Aufräumen
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            clearInterval(shootingStarInterval);
        };
    }, []);

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
                    zIndex: 0 // Unter allen anderen Elementen
                }}
            />
        </ErrorBoundary>
    );
};

export default StarfieldLayer;