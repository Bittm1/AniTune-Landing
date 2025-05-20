// src/components/Parallax/ParallaxContainer.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useSpring, animated } from '@react-spring/web';
import Newsletter from '../../components/Newsletter/Newsletter'; // Pfad anpassen

const ParallaxContainer = () => {
    // State für die Scroll-Position
    const [scrollProgress, setScrollProgress] = useState(0);
    const parallaxRef = useRef(null);

    // Genauerer Scroll-Handler mit Throttling
    useEffect(() => {
        const throttle = (func, delay) => {
            let lastCall = 0;
            return function (...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) return;
                lastCall = now;
                return func(...args);
            };
        };

        const handleScroll = throttle(() => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Berechne Scroll-Fortschritt (0 bis 1)
            const scrollPercent = Math.min(scrollTop / (docHeight - windowHeight), 1);

            // Setze den Fortschritt im State
            setScrollProgress(scrollPercent);

            // Debug-Ausgabe
            console.log(`Scroll Progress: ${scrollPercent.toFixed(3)}`);
        }, 10); // Aktualisiere 100x pro Sekunde für flüssigen Effekt

        // Event-Listener hinzufügen
        window.addEventListener('scroll', handleScroll);

        // Initialer Aufruf
        handleScroll();

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Spring für den Hintergrund-Zoom mit manuellem Update
    const backgroundSpring = useSpring({
        scale: 4.0 - (scrollProgress * 3.0), // Von 4.0 bis 1.0
        config: {
            mass: 0.5,      // Leichteres Gewicht für schnellere Reaktion
            tension: 350,   // Höhere Spannung für direktere Reaktion
            friction: 20,   // Weniger Reibung für flüssigere Animation
            clamp: false    // Erlaube Überschwingen für natürlichere Bewegung
        }
    });

    // Spring für das Logo
    const logoSpring = useSpring({
        scale: 1.2 - (scrollProgress * 0.4), // Von 1.2 bis 0.8
        config: {
            mass: 0.5,
            tension: 350,
            friction: 20
        }
    });

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Debug-Info */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                fontSize: '12px',
                zIndex: 1000
            }}>
                Scroll: {(scrollProgress * 100).toFixed(1)}% |
                Zoom: {backgroundSpring.scale.get().toFixed(2)}x
            </div>

            <Parallax pages={3} ref={parallaxRef}>
                {/* Hintergrund mit Zoom */}
                <ParallaxLayer
                    offset={0}
                    speed={0}
                    factor={3}
                >
                    <animated.div
                        style={{
                            backgroundImage: "url('/Parallax/Himmel.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            width: '100%',
                            height: '100%',
                            transformOrigin: 'center top',
                            transform: backgroundSpring.scale.to(s => `scale(${s})`)
                        }}
                    />
                </ParallaxLayer>

                {/* Wolke links */}
                <ParallaxLayer
                    offset={0.2}
                    speed={0.8}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <img
                        src="/Parallax/Wolken_Vorne_links.png"
                        style={{
                            width: '30%',
                            marginLeft: '-10%'
                        }}
                        alt="Wolken links"
                    />
                </ParallaxLayer>

                {/* Wolke rechts */}
                <ParallaxLayer
                    offset={0.2}
                    speed={0.5}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <img
                        src="/Parallax/Wolken_Vorne_rechts.png"
                        style={{
                            width: '25%',
                            marginRight: '-5%'
                        }}
                        alt="Wolken rechts"
                    />
                </ParallaxLayer>

                {/* Logo */}
                <ParallaxLayer
                    offset={0}
                    speed={0.3}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <animated.img
                        src="/Parallax/Logo.png"
                        style={{
                            width: '15%',
                            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))',
                            transform: logoSpring.scale.to(s => `scale(${s})`)
                        }}
                        alt="Logo"
                    />
                </ParallaxLayer>

                {/* Newsletter */}
                <ParallaxLayer
                    offset={0.5}
                    speed={0.1}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <div style={{ width: '80%', maxWidth: '500px' }}>
                        <Newsletter />
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    );
};

export default ParallaxContainer;