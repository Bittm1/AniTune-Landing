// src/components/Loading/LoadingScreen.jsx - CLEAN mit Asset Preloading
import React, { useState, useEffect, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [resourcesLoaded, setResourcesLoaded] = useState(false);
    const startTimeRef = useRef(Date.now());
    const minDisplayTime = 2500; // Mindestens 2,5 Sekunden anzeigen

    // 📱 Mobile Detection
    const isMobile = window.innerWidth < 768 && 'ontouchstart' in window;

    // 🎨 Asset-Kategorien definieren
    const assetCategories = {
        // 🖼️ DESKTOP PARALLAX IMAGES (nur Desktop)
        desktopImages: !isMobile ? [
            '/Parallax/Himmel.webp',                    // Background
            '/Parallax/Erster_Hintergrund.webp',        // Forest
            '/Parallax/Vierter_Hintergrund.webp',       // Berge
            '/Parallax/Dritter_Hintergrund.webp',       // Tal
            '/Parallax/Zweiter_Hintergrund.webp',       // Wald Hinten
            '/Parallax/Weg.webp',                       // Road
            '/Parallax/Hund.png',                       // Dog
            '/Parallax/Menge.png',                      // Menge
            '/Parallax/Wolken_Vorne_links.png',         // Cloud Left
            '/Parallax/Wolken_Vorne_rechts.png',        // Cloud Right
            '/Parallax/Wolken_Hinten_links.png',        // Cloud Back Left
            '/Parallax/Wolken_Hinten_rechts.png'        // Cloud Back Right
        ] : [],

        // 📱 MOBILE IMAGES (nur Mobile)
        mobileImages: isMobile ? [
            '/Parallax/mobile/Mobile_Hg.webp',          // Mobile Background
            '/Parallax/mobile/Mobile_Vg.webp'           // Mobile Foreground
        ] : [],

        // 🎨 GEMEINSAME IMAGES (Desktop + Mobile)
        sharedImages: [
            '/Parallax/Logo.svg',                       // Standard Logo
            '/Parallax/Logo.png',                       // Logo PNG Fallback
            '/Parallax/AniTune_phaseVier_schwarz.png'   // Phase 4 Logo
        ],

        // 🎵 AUDIO FILES
        audioFiles: [
            '/audio/von-uns-heißt-fuer-uns.mp3',
            '/audio/der-weg-ist-das-ziel.mp3',
            '/audio/die-community-heißt.mp3',
            '/audio/anitune-theme.mp3',
            '/audio/untermalung.mp3'                    // Hintergrundmusik
        ],

        // 🎠 CAROUSEL ICONS
        carouselIcons: [
            '/icons/discord.webp',
            '/icons/podcast.webp',
            '/icons/lizenz.webp',
            '/icons/meilensteine.png',
            '/icons/merch.webp',
            '/icons/dubbing.webp',
            '/icons/vote.webp',
            '/icons/donations.webp',
            '/icons/katalog.webp'
        ]
    };

    // Ressourcen laden
    useEffect(() => {
        console.log(`🚀 LoadingScreen: Starte Preloading für ${isMobile ? 'MOBILE' : 'DESKTOP'}`);

        // Alle Assets sammeln
        const allAssets = [
            ...assetCategories.desktopImages,
            ...assetCategories.mobileImages,
            ...assetCategories.sharedImages,
            ...assetCategories.audioFiles,
            ...assetCategories.carouselIcons
        ];

        let currentLoadedCount = 0;

        // 📊 Progress-Update Funktion
        const updateProgress = (category, assetPath) => {
            currentLoadedCount++;

            // Realtime Progress (0-95%)
            const realProgress = Math.round((currentLoadedCount / allAssets.length) * 95);
            setProgress(realProgress);

            // Debug-Log
            if (process.env.NODE_ENV === 'development') {
                console.log(`✅ ${category}: ${assetPath} (${currentLoadedCount}/${allAssets.length})`);
            }

            // Alle Assets geladen?
            if (currentLoadedCount === allAssets.length) {
                setResourcesLoaded(true);
                // Final Progress auf 100%
                setTimeout(() => setProgress(100), 300);
            }
        };

        // 🖼️ Images preloaden
        const preloadImage = (src, category) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    updateProgress(category, src);
                    resolve(true);
                };
                img.onerror = () => {
                    console.warn(`❌ Image failed: ${src}`);
                    updateProgress(category, src); // Trotzdem weitermachen
                    resolve(false);
                };
                img.src = src;
            });
        };

        // 🎵 Audio preloaden
        const preloadAudio = (src) => {
            return new Promise((resolve) => {
                const audio = new Audio();
                audio.oncanplaythrough = () => {
                    updateProgress('Audio', src);
                    resolve(true);
                };
                audio.onerror = () => {
                    console.warn(`❌ Audio failed: ${src}`);
                    updateProgress('Audio', src); // Trotzdem weitermachen
                    resolve(false);
                };
                audio.src = src;
                audio.load(); // Wichtig für Preloading
            });
        };

        // 🚀 PRELOADING STARTEN
        const startPreloading = async () => {
            try {
                // Alle Assets parallel laden für maximale Geschwindigkeit
                const allPromises = [
                    ...assetCategories.sharedImages.map(src => preloadImage(src, 'Critical')),
                    ...(isMobile ?
                        assetCategories.mobileImages.map(src => preloadImage(src, 'Mobile')) :
                        assetCategories.desktopImages.map(src => preloadImage(src, 'Parallax'))
                    ),
                    ...assetCategories.carouselIcons.map(src => preloadImage(src, 'Icons')),
                    ...assetCategories.audioFiles.map(src => preloadAudio(src))
                ];

                await Promise.allSettled(allPromises);

            } catch (error) {
                console.error('Preloading error:', error);
                // Trotzdem weitermachen
                setResourcesLoaded(true);
                setProgress(100);
            }
        };

        // 🎯 GSAP und Fonts auch preloaden
        const preloadCriticalResources = async () => {
            try {
                // Font preloading
                if (document.fonts && document.fonts.load) {
                    await document.fonts.load('400 16px Lobster');
                    console.log('✅ Font Lobster preloaded');
                }

                // GSAP preloading (falls als separates Bundle)
                if (window.gsap) {
                    console.log('✅ GSAP already loaded');
                } else {
                    console.log('⏳ GSAP loading...');
                }

            } catch (error) {
                console.warn('Font/GSAP preloading failed:', error);
            }
        };

        // Parallel preloading starten
        Promise.all([
            startPreloading(),
            preloadCriticalResources()
        ]);

    }, [isMobile]);

    // Loading Complete Check
    useEffect(() => {
        if (progress === 100 && resourcesLoaded) {
            const elapsedTime = Date.now() - startTimeRef.current;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            console.log(`🎯 Preloading Complete: All Assets loaded (${isMobile ? 'Mobile' : 'Desktop'})`);

            // Warte die Restzeit, um die Mindestanzeigezeit zu gewährleisten
            setTimeout(() => {
                setIsComplete(true);
                if (onLoadingComplete) {
                    setTimeout(onLoadingComplete, 600); // Verzögerung für Animation
                }
            }, remainingTime);
        }
    }, [progress, resourcesLoaded, onLoadingComplete, isMobile]);

    // Langsamer Fortschritt für visuelle Rückmeldung (angepasst)
    useEffect(() => {
        if (progress < 95 && !resourcesLoaded) {
            const timer = setTimeout(() => {
                setProgress(prev => {
                    const increment = prev < 20 ? 2 : (prev < 60 ? 1 : 0.5);
                    return Math.min(prev + increment, 95);
                });
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [progress, resourcesLoaded]);

    // Container-Klassen bestimmen
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