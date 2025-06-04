// src/components/Loading/LoadingScreen.jsx - NUR PERFORMANCE-FIX, KEINE UI-ÄNDERUNGEN
import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [resourcesLoaded, setResourcesLoaded] = useState(false);
    const startTimeRef = useRef(Date.now());

    // ⚡ PERFORMANCE: Device-spezifische Ladezeiten (INTERNAL ONLY)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const minDisplayTime = isMobile ? 1200 : 1800; // Schneller, aber unsichtbar

    // Ressourcen laden - BEREITS OPTIMIERT
    useEffect(() => {
        const imagesToLoad = [
            '/Parallax/Logo.svg',
        ];

        let loadedCount = 0;

        const checkAllLoaded = () => {
            loadedCount++;
            // ⚡ PERFORMANCE: Echte Progress ohne künstliche Verlangsamung
            const realProgress = Math.round((loadedCount / imagesToLoad.length) * 100);
            setProgress(realProgress);

            if (loadedCount === imagesToLoad.length) {
                setResourcesLoaded(true);
                // ⚡ PERFORMANCE: Sofort auf 100%
                setProgress(100);
            }
        };

        imagesToLoad.forEach(src => {
            const img = new Image();
            img.onload = checkAllLoaded;
            img.onerror = checkAllLoaded;
            img.src = src;
        });
    }, []);

    // ⚡ PERFORMANCE: Schnellere Completion
    useEffect(() => {
        if (progress === 100 && resourcesLoaded) {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                setIsComplete(true);
                if (onLoadingComplete) {
                    // ⚡ PERFORMANCE: 600ms → 300ms
                    setTimeout(onLoadingComplete, 300);
                }
            }, remainingTime);
        }
    }, [progress, resourcesLoaded, onLoadingComplete, minDisplayTime]);

    // ⚡ ENTFERNT: Die künstliche Progress-Animation ist komplett weg
    // Progress zeigt jetzt echten Lade-Status

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