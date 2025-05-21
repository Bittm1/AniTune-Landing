// src/components/Parallax/config/responsiveHelper.js
import { desktopConfig } from './desktopConfig';
import { mobileConfig } from './mobileConfig';

// Erweiterte Funktion zur Auswahl der Konfiguration mit Unterstützung für verschiedene Breiten
export const getResponsiveConfig = () => {
    if (typeof window === 'undefined') {
        return desktopConfig; // Server-Side Rendering Fallback
    }

    const width = window.innerWidth;

    // Sehr klein (Smartphones)
    if (width < 480) {
        return {
            ...mobileConfig,
            logo: {
                ...mobileConfig.logo,
                size: '120px'
            },
            // Ressourcen für kleine Bildschirme
            imageSources: {
                background: '/Parallax/Himmel.png', // Später durch mobile Versionen ersetzen
                forest: '/Parallax/Erster_Hintergrund.png',  
                leftCloud: '/Parallax/Wolken_Vorne_links.png',
                rightCloud: '/Parallax/Wolken_Vorne_rechts.png',
                logo: '/Parallax/Logo.png'
            }
        };
    }
    // Klein (große Smartphones / kleine Tablets)
    else if (width < 768) {
        return {
            ...mobileConfig,
            // Ressourcen für Smartphones
            imageSources: {
                background: '/Parallax/Himmel.png',
                forest: '/Parallax/Erster_Hintergrund.png',  
                leftCloud: '/Parallax/Wolken_Vorne_links.png',
                rightCloud: '/Parallax/Wolken_Vorne_rechts.png',
                logo: '/Parallax/Logo.png'
            }
        };
    }
    // Mittel (Tablets)
    else if (width < 1024) {
        return {
            ...desktopConfig,
            logo: {
                ...desktopConfig.logo,
                size: '180px'
            },
            // Ressourcen für Tablets
            imageSources: {
                background: '/Parallax/Himmel.png',
                forest: '/Parallax/Erster_Hintergrund.png',  
                leftCloud: '/Parallax/Wolken_Vorne_links.png',
                rightCloud: '/Parallax/Wolken_Vorne_rechts.png',
                logo: '/Parallax/Logo.png'
            }
        };
    }
    // Desktop (Standard)
    else if (width < 1920) {
        return {
            ...desktopConfig,
            // Standard Desktop-Ressourcen
            imageSources: {
                background: '/Parallax/Himmel.png',
                forest: '/Parallax/Erster_Hintergrund.png',  
                leftCloud: '/Parallax/Wolken_Vorne_links.png',
                rightCloud: '/Parallax/Wolken_Vorne_rechts.png',
                logo: '/Parallax/Logo.png'
            }
        };
    }
    // Große Bildschirme (1920px und mehr)
    else {
        return {
            ...desktopConfig,
            // Hier können Sie spezielle Anpassungen für große Bildschirme vornehmen
            background: {
                ...desktopConfig.background,
                startScale: 4.5, // Größerer Zoom-Effekt für große Displays
                endScale: 1.0
            },
            logo: {
                ...desktopConfig.logo,
                size: '250px', // Größeres Logo für große Displays
            },
            // Ressourcen für große Bildschirme (hochauflösend)
            imageSources: {
                background: '/Parallax/Himmel_large.png', // Später durch hochauflösende Versionen ersetzen
                forest: '/Parallax/Erster_Hintergrund.png',  
                leftCloud: '/Parallax/Wolken_Vorne_links.png',
                rightCloud: '/Parallax/Wolken_Vorne_rechts.png',
                logo: '/Parallax/Logo.png'
            }
        };
    }
};