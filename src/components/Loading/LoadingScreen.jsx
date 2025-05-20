// src/components/Loading/LoadingScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [resourcesLoaded, setResourcesLoaded] = useState(false);
    const startTimeRef = useRef(Date.now());
    const minDisplayTime = 2500; // Mindestens 2,5 Sekunden anzeigen

    // Ressourcen laden
    useEffect(() => {
        const imagesToLoad = [
            '/Parallax/Logo.png',
            '/Parallax/Himmel.png',
            '/Parallax/Wolken_Vorne_links.png',
            '/Parallax/Wolken_Vorne_rechts.png'
        ];

        let loadedCount = 0;

        const checkAllLoaded = () => {
            loadedCount++;
            // Setze den Fortschritt basierend auf geladenen Bildern
            const realProgress = Math.round((loadedCount / imagesToLoad.length) * 100);
            // Verhindere, dass der Fortschritt zu schnell fortschreitet
            setProgress(prev => Math.max(prev, Math.min(realProgress, 95)));

            if (loadedCount === imagesToLoad.length) {
                setResourcesLoaded(true);
                // Setze erst jetzt auf 100%
                setTimeout(() => setProgress(100), 300);
            }
        };

        imagesToLoad.forEach(src => {
            const img = new Image();
            img.onload = checkAllLoaded;
            img.onerror = checkAllLoaded; // Auch bei Fehler weitermachen
            img.src = src;
        });
    }, []);

    // Überprüfe, ob die Ladezeit und die Ressourcen bereit sind
    useEffect(() => {
        if (progress === 100 && resourcesLoaded) {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            // Warte die Restzeit, um die Mindestanzeigezeit zu gewährleisten
            setTimeout(() => {
                setIsComplete(true);
                if (onLoadingComplete) {
                    setTimeout(onLoadingComplete, 600); // Verzögerung für Animation
                }
            }, remainingTime);
        }
    }, [progress, resourcesLoaded, onLoadingComplete]);

    // Langsamer Fortschritt für visuelle Rückmeldung
    useEffect(() => {
        // Simuliere nur bis 95% - die letzten 5% kommen von den tatsächlichen Ressourcen
        if (progress < 95 && !resourcesLoaded) {
            const timer = setTimeout(() => {
                setProgress(prev => {
                    // Verlangsame den Fortschritt je näher wir an 95% kommen
                    const increment = prev < 50 ? 5 : (prev < 80 ? 3 : 1);
                    return Math.min(prev + increment, 95);
                });
            }, 200); // Langsamer (erhöht von 150ms auf 200ms)

            return () => clearTimeout(timer);
        }
    }, [progress, resourcesLoaded]);

    // Bestimme die Klassen basierend auf dem Status
    const screenClass = `loading-screen ${isComplete ? 'loading-complete' : ''}`;
    const contentClass = `loading-content ${isComplete ? 'fade-out' : ''}`;

    return (
        <div className={screenClass}>
            <div className={contentClass}>
                <div className="loading-logo"></div>
                <div className="loading-stars">
                    <div className="loading-star star1"></div>
                    <div className="loading-star star2"></div>
                    <div className="loading-star star3"></div>
                    <div className="loading-star star4"></div>
                    <div className="loading-star star5"></div>
                </div>
                <div className="loading-text">Willkommen</div>
                <div className="loading-progress-bar">
                    <div
                        className="loading-progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="loading-percentage">{progress}%</div>
            </div>
        </div>
    );
};

export default LoadingScreen;