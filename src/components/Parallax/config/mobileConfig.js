// src/components/Parallax/config/mobileConfig.js - COMPLETE MOBILE CONFIGURATION
import { springs, createTitles, createDeviceSpecificTiming } from './baseConfig';
import { zIndices, elementSizes } from './constants';
import { getDesktopLogoConfig } from './logoConfig';

/**
 * 📱 MOBILE-OPTIMIZED PARALLAX CONFIGURATION
 * Vereinfachte Effekte für Touch-Devices und bessere Performance
 */
export const mobileConfig = {
    // ===== DEVICE-SPECIFIC SETTINGS =====
    deviceType: 'mobile',
    optimizations: {
        reducedParallax: true,          // Weniger aggressive Parallax-Effekte
        simplifiedAnimations: true,     // Einfachere Animationen
        touchOptimized: true,           // Touch-friendly Controls
        performanceFocus: true          // Performance > Visual Fidelity
    },

    // ===== BACKGROUND CONFIGURATION =====
    background: {
        startScale: 2.8,               // Reduziert von Desktop (4.0)
        endScale: 1.0,
        spring: springs.responsive,     // Schnellere Response für Touch
        zIndex: zIndices.background,

        // Mobile-spezifische Performance-Optimierungen
        performance: {
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform3d: true
        }
    },

    // ===== LOGO CONFIGURATION =====
    logo: {
        ...getDesktopLogoConfig(),

        // Mobile-Anpassungen
        size: elementSizes.logo.sm,     // Kleinere Größe für Mobile
        position: {
            top: '25%',                 // Höher positioniert
            left: '50%'
        },

        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                scaleStart: 1.1,        // Weniger aggressiv
                scaleEnd: 0.7,          // Kleinerer Endwert
                opacityStart: 1,
                opacityEnd: 0.9
            }
        ],

        spring: springs.responsive,
        zIndex: zIndices.logo
    },

    // ===== STARFIELD LAYER =====
    starfield: {
        enabled: false,                 // Deaktiviert für Mobile Performance
        zIndex: zIndices.stars
    },

    // ===== CLOUD CONFIGURATIONS =====
    leftCloud: {
        segments: [
            {
                scrollStart: 0.9,
                scrollEnd: 1.05,
                posStart: -40,          // Weniger Bewegung
                posEnd: 10,
                opacityStart: 0.9,
                opacityEnd: 1.0,
                scaleStart: 1.4,        // Reduzierte Skalierung
                scaleEnd: 1.4
            }
        ],
        position: {
            bottom: '48%'               // Angepasste Position
        },
        size: elementSizes.cloud.left.sm,
        spring: {
            ...springs.responsive,
            tension: 150,               // Schnellere Reaktion
            friction: 20
        },
        zIndex: zIndices.clouds
    },

    rightCloud: {
        segments: [
            {
                scrollStart: 0.9,
                scrollEnd: 1.05,
                posStart: -35,          // Weniger Bewegung
                posEnd: 10,
                opacityStart: 0.9,
                opacityEnd: 1.0,
                scaleStart: 1.3,        // Reduzierte Skalierung
                scaleEnd: 1.3
            }
        ],
        position: {
            bottom: '48%'
        },
        size: elementSizes.cloud.right.sm,
        spring: {
            ...springs.responsive,
            tension: 150,
            friction: 20
        },
        zIndex: zIndices.clouds
    },

    // ===== BACKGROUND CLOUDS (HINTEN) =====
    leftCloudHinten: {
        segments: [
            {
                scrollStart: 0.9,
                scrollEnd: 1.05,
                posStart: -80,          // Reduzierte Bewegung
                posEnd: 5,
                opacityStart: 1,
                opacityEnd: 1.0,
                scaleStart: 1.1,        // Weniger Skalierung
                scaleEnd: 1.1
            }
        ],
        position: {
            bottom: '70%'
        },
        size: elementSizes.cloud.left.sm,
        zIndex: zIndices.wolkenHinten
    },

    rightCloudHinten: {
        segments: [
            {
                scrollStart: 0.90,
                scrollEnd: 1.05,
                posStart: -80,
                posEnd: 10,
                opacityStart: 1,
                opacityEnd: 1.0,
                scaleStart: 1.2,
                scaleEnd: 1.2
            }
        ],
        position: {
            bottom: '70%'
        },
        size: elementSizes.cloud.right.sm,
        zIndex: zIndices.wolkenHinten
    },

    // ===== LANDSCAPE LAYERS =====
    berge: {
        segments: [
            {
                scrollStart: 0.9,
                scrollEnd: 1.05,
                posStart: -35,          // Reduzierte Bewegung für Mobile
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        ],
        zIndex: zIndices.berge,

        // Mobile Performance-Optimierung
        performance: {
            willChange: 'transform',
            contain: 'layout style'
        }
    },

    tal: {
        segments: [
            {
                scrollStart: 0.60,
                scrollEnd: 1,
                posStart: -40,          // Reduziert
                posEnd: 0,
                opacityStart: 1,
                opacityEnd: 1
            }
        ],
        zIndex: zIndices.tal
    },

    waldHinten: {
        segments: [
            {
                scrollStart: 0.60,
                scrollEnd: 1,
                posStart: -25,          // Weniger Bewegung
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        ],
        zIndex: zIndices.waldHinten
    },

    forest: {
        segments: [
            {
                scrollStart: 0.42,
                scrollEnd: 1,
                posStart: -35,          // Reduziert für Mobile
                posEnd: 0,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        ],
        zIndex: zIndices.forest
    },

    road: {
        segments: [
            {
                scrollStart: 0.30,
                scrollEnd: 1,
                posStart: -30,          // Weniger aggressive Bewegung
                posEnd: 0,
                opacityStart: 0.0,
                opacityEnd: 0.4         // Etwas sichtbarer für Mobile
            }
        ],
        zIndex: zIndices.road
    },

    // ===== CHARACTER LAYERS =====
    dog: {
        segments: [
            {
                scrollStart: 0.30,
                scrollEnd: 1,
                posStart: -20,          // Reduzierte Bewegung
                posEnd: 8,
                opacityStart: 1.0,
                opacityEnd: 1.0
            }
        ],
        position: {
            left: '52%'                 // Leicht angepasst für Mobile
        },
        size: {
            width: '12vw',              // Etwas größer für Mobile
            maxWidth: '180px',
            height: 'auto'
        },
        zIndex: zIndices.dog
    },

    menge: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -120,         // Weniger extreme Bewegung
                posEnd: -15,
                opacityStart: 0.0,
                opacityEnd: 0.9         // Etwas sichtbarer
            }
        ],
        position: {
            left: '58%'                 // Angepasst für Mobile
        },
        size: {
            width: '70vw',              // Angepasst für Mobile Screens
            maxWidth: '600px',
            height: 'auto'
        },
        zIndex: zIndices.menge
    },

    // ===== MOBILE-SPECIFIC TITLE CONFIGURATION =====
    titles: createTitles(
        // Mobile-optimierte Styles
        {
            fontSize: '2rem',           // Kleiner für Mobile
            fontWeight: 600,            // Etwas leichter
            textShadow: '0 0 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.3px',     // Enger für kleine Bildschirme
            lineHeight: '1.1'           // Kompakter
        },
        {
            // Mobile-optimierte Positionen
            positions: [
                { top: '45%', left: '50%' }, // Von Uns Heißt Für Uns
                { top: '45%', left: '50%' }, // Der Weg Ist Das Ziel
                { top: '45%', left: '50%' }, // Die Community Heißt
                { top: '45%', left: '50%' }  // AniTune
            ],

            // Vereinfachte Animationen für bessere Performance
            animations: [
                'fadeScale',            // Einfach und zuverlässig
                'fade',                 // Nur Fade für Performance
                'fadeScale',            // Klassisch
                'fade'                  // AniTune einfach
            ],

            // Mobile-spezifische Timing
            timing: createDeviceSpecificTiming('mobile')
        }
    ),

    // ===== MOBILE TOUCH CONFIGURATION =====
    touch: {
        enabled: true,
        swipeThreshold: 50,             // Minimum swipe distance
        swipeTimeout: 500,              // Maximum swipe time
        snapDuration: 0.8,              // Schneller für Mobile
        lockDelay: 300,                 // Kürzere Sperre

        // Touch-spezifische Einstellungen
        preventScroll: true,            // Verhindere natives Scrolling
        tapThreshold: 10,               // Maximum tap movement
        doubleTapDelay: 300,

        // Gestures
        gestures: {
            swipeUp: 'nextPhase',
            swipeDown: 'prevPhase',
            tap: 'interaction',
            doubleTap: 'quickAction'
        }
    },

    // ===== MOBILE CAROUSEL CONFIGURATION =====
    carousel: {
        type: 'grid',                   // Grid statt 3D für Mobile
        layout: {
            columns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            padding: '20px'
        },

        // Carousel Timing
        segments: [
            {
                scrollStart: 1.2,       // Phase 5 Start
                scrollEnd: 1.6,         // Phase 5 Ende
                posStart: 60,           // Von unten
                posEnd: 10,             // Zur finalen Position
                opacityStart: 0.0,
                opacityEnd: 1.0
            }
        ],

        // Grid-spezifische Einstellungen
        cards: {
            minHeight: '180px',
            borderRadius: '15px',
            padding: '25px 20px',

            // Touch-optimierte Karten
            touchTarget: '44px',        // Minimum Touch-Target
            hoverEffects: false,        // Keine Hover-Effekte
            tapFeedback: true           // Tap-Feedback Animation
        },

        // Performance
        virtualization: false,          // Alle Karten laden (sind nur 9)
        lazyLoading: true,             // Lazy-load Images

        zIndex: 35                     // Über anderen Layern
    },

    // ===== MOBILE NEWSLETTER CONFIGURATION =====
    newsletter: {
        // Phase 0 (Logo-Phase)
        phase0: {
            enabled: true,
            position: {
                top: '60%',             // Unter dem Logo
                left: '50%'
            },
            size: {
                maxWidth: '350px',      // Schmaler für Mobile
                padding: '25px 20px'
            },

            // Eingabefeld-Optimierungen
            input: {
                fontSize: '16px',       // Verhindert iOS-Zoom
                padding: '15px 20px',
                borderRadius: '12px',
                touchTarget: '44px'
            },

            // Button-Optimierungen
            button: {
                padding: '15px 30px',
                minHeight: '52px',      // Touch-friendly
                fontSize: '16px'
            }
        },

        // Phase 6 (Newsletter CTA Phase)
        phase6: {
            enabled: true,
            position: {
                top: '50%',
                right: '5%'             // Rechts positioniert
            },
            size: {
                maxWidth: '320px',      // Kompakter für Mobile
                padding: '20px 15px'
            },

            // Mobile-optimierte Newsletter-Form
            compact: true,
            showImpressum: true,        // Impressum einblenden

            // Blur-Container
            background: {
                blur: '15px',           // Weniger Blur für Performance
                opacity: 0.9
            }
        },

        zIndex: zIndices.newsletter
    },

    // ===== MOBILE ANIMATION TIMING =====
    timing: {
        // Globale Mobile-Timing-Anpassungen
        globalMultiplier: 0.8,          // 20% schneller

        // Spezifische Timing-Overrides
        snapDuration: 1.0,              // Schneller als Desktop
        fadeIn: 0.4,
        fadeOut: 0.3,
        slideIn: 0.5,

        // Touch-responsive Timing
        touchResponse: 0.1,             // Sofortige Response
        feedbackDelay: 0.05,            // Minimale Feedback-Verzögerung

        // Easing für Mobile
        easing: {
            default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            snap: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            touch: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },

    // ===== MOBILE PERFORMANCE SETTINGS =====
    performance: {
        // Rendering-Optimierungen
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform3d: true,

        // Feature-Toggles für Performance
        features: {
            complexAnimations: false,   // Vereinfachte Animationen
            highQualityFilters: false,  // Weniger Filter-Effekte
            particleEffects: false,     // Keine Partikel
            shadowEffects: 'reduced',   // Reduzierte Schatten
            gradients: 'simplified'     // Einfache Gradienten
        },

        // Intersection Observer für Sichtbarkeit
        intersectionObserver: {
            rootMargin: '20px',
            threshold: [0.1, 0.5, 0.9]
        },

        // Debouncing für Events
        debounce: {
            scroll: 16,                 // 60fps
            resize: 150,
            touch: 0                    // Keine Debounce für Touch
        }
    },

    // ===== MOBILE ACCESSIBILITY =====
    accessibility: {
        // Touch-Target-Größen
        minTouchTarget: '44px',

        // Focus-Management
        focusManagement: true,
        keyboardNavigation: true,

        // Reduced Motion Support
        respectsReducedMotion: true,

        // Screen Reader Support
        ariaLabels: true,
        semanticMarkup: true,

        // High Contrast Support
        highContrastMode: true
    },

    // ===== MOBILE DEBUG SETTINGS =====
    debug: {
        enabled: process.env.NODE_ENV === 'development',
        showTouchAreas: false,
        showPerformanceMetrics: true,
        showDeviceInfo: true,

        // Debug-Panel Position
        position: {
            bottom: '10px',
            left: '10px'
        },

        // Debug-Informationen
        metrics: [
            'scrollProgress',
            'currentPhase',
            'touchState',
            'performanceScore',
            'memoryUsage'
        ]
    }
};

export default mobileConfig;