// src/components/Parallax/config/constants/index.js

/**
 * Z-Index-Verwaltung - definiert die Rendering-Reihenfolge der Layer
 * Werte von hinten (0) nach vorne (höhere Werte) angeordnet
 */
export const zIndices = {
    background: 0,        // Himmel/Hintergrund (ganz hinten)
    stars: 1,             // Sternenhimmel
    clouds: 2,            // Wolken
    wolkenHinten: 1,      // Wolken hinten, zwischen stars und tal
    berge: 3,             // Berg-Silhouette
    tal: 4,               // Tal-Silhouette
    waldHinten: 5,      // Wald hinten
    forest: 6,            // Wald-Silhouette
    road: 7,              // Straße
    dog: 8,         // Person zwischen Wald und Road
    menge: 9,          
    logo: 10,             // Logo (über Landschaft)
    titles: 20,           // Titel-Texte
    newsletter: 30,       // Newsletter-Form
    scrollIndicator: 40,  // Scroll-Hinweis
    debug: 1000           // Debug-Elemente (immer ganz vorne)
};

/**
 * Animation Timing Presets - für konsistente Animationsdauern
 */
export const animationTiming = {
    fast: 0.15,
    standard: 0.2,
    medium: 0.3,
    slow: 0.5
};

/**
 * Breakpoints für Responsive Design
 * Zentrale Definition vermeidet harte Codierung in verschiedenen Dateien
 */
export const breakpoints = {
    xs: 480,  // Extra small (kleine Smartphones)
    sm: 768,  // Small (große Smartphones / kleine Tablets)
    md: 1024, // Medium (Tablets / kleine Desktops)
    lg: 1440, // Large (Desktop-Standardgröße)
    xl: 1920  // Extra large (große Bildschirme)
};

/**
 * Element-Größen-Presets für verschiedene Viewport-Größen
 */
export const elementSizes = {
    logo: {
        xs: '120px',
        sm: '140px',
        md: '180px',
        lg: '200px',
        xl: '250px'
    },
    cloud: {
        left: {
            xs: { width: '40vw', maxWidth: '300px' },
            sm: { width: '40vw', maxWidth: '300px' },
            md: { width: '35vw', maxWidth: '450px' },
            lg: { width: '30vw', maxWidth: '500px' },
            xl: { width: '30vw', maxWidth: '600px' }
        },
        right: {
            xs: { width: '35vw', maxWidth: '250px' },
            sm: { width: '35vw', maxWidth: '250px' },
            md: { width: '30vw', maxWidth: '400px' },
            lg: { width: '25vw', maxWidth: '400px' },
            xl: { width: '25vw', maxWidth: '500px' }
        }
    }
};

/**
 * Asset-Pfade mit Fallbacks für fehlende Bilder
 */
export const assetPaths = {
    background: {
        default: '/Parallax/Himmel.png',
        large: '/Parallax/Himmel_large.webp',
        fallback: '/Parallax/fallback-background.png'
    },
    forest: {
        default: '/Parallax/Erster_Hintergrund.webp',
        fallback: '/Parallax/fallback-forest.png'
    },
    berge: {
        default: '/Parallax/Vierter_Hintergrund.webp',
        fallback: '/Parallax/fallback-berge.png'
    },
    tal: {
        default: '/Parallax/Dritter_Hintergrund.webp',
        fallback: '/Parallax/fallback-tal.png'
    },
    waldHinten: {
        default: '/Parallax/Zweiter_Hintergrund.webp',
        fallback: '/Parallax/fallback-wald.png'
    },    
    road: {
        default: '/Parallax/Weg.webp',
        fallback: '/Parallax/fallback-road.png'
    },
    dog: {
        default: '/Parallax/Hund.png',
        fallback: '/Parallax/fallback-Hund.png'
    },
    menge: {
        default: '/Parallax/Menge.png',
        fallback: '/Parallax/fallback-menge.png'
    },
    leftCloud: {
        default: '/Parallax/Wolken_Vorne_links.png',
        fallback: '/Parallax/fallback-cloud.png'
    },
    rightCloud: {
        default: '/Parallax/Wolken_Vorne_rechts.png',
        fallback: '/Parallax/fallback-cloud.png'
    },
    leftCloudHinten: {
        default: '/Parallax/Wolken_Hinten_links.png',
        fallback: '/Parallax/fallback-cloud.png'
    },
    rightCloudHinten: {
        default: '/Parallax/Wolken_Hinten_rechts.png',
        fallback: '/Parallax/fallback-cloud.png'
    },    
    logo: {
        default: '/Parallax/Logo.png',
        fallback: '/Parallax/fallback-logo.png'
    }
};