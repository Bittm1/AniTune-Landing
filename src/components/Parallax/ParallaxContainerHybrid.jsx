// src/components/Parallax/ParallaxContainerHybrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useSpring, animated } from '@react-spring/web';
import Newsletter from '../../components/Newsletter/Newsletter';

const ParallaxContainerHybrid = () => {
    // Referenz für die Parallax-Komponente
    const parallaxRef = useRef(null);

    // State für Scroll-Fortschritt
    const [scrollProgress, setScrollProgress] = useState(0);

    // Scroll-Handler
    useEffect(() => {
        const handleScroll = () => {
            if (!parallaxRef.current) return;

            const current = parallaxRef.current.current;
            const total = parallaxRef.current.space;

            const progress = Math.min(1, Math.max(0, current / total));
            setScrollProgress(progress);
        };

        if (parallaxRef.current && parallaxRef.current.container && parallaxRef.current.container.current) {
            parallaxRef.current.container.current.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }

        return () => {
            if (parallaxRef.current && parallaxRef.current.container && parallaxRef.current.container.current) {
                parallaxRef.current.container.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [parallaxRef.current]);

    // Springs für flüssige Animationen mit weniger Nachschwingen
    const bgSpring = useSpring({
        scale: 4.0 - (scrollProgress * 3.0),
        config: {
            mass: 0.8,       // Leichtere Masse
            tension: 120,    // Höhere Tension
            friction: 26,    // Optimal abgestimmte Friction
            clamp: true      // Wichtig: Stoppt die Animation am Zielpunkt
        }
    });

    const logoSpring = useSpring({
        scale: 1.2 - (scrollProgress * 0.4),
        config: {
            mass: 0.8,
            tension: 120,
            friction: 26,
            clamp: true
        }
    });

    const leftCloudSpring = useSpring({
        left: `${-60 + scrollProgress * 60}%`,
        config: {
            mass: 0.8,
            tension: 100,    // Etwas niedrigere Tension für Wolken
            friction: 24,    // Etwas niedrigere Friction für Wolken
            clamp: true
        }
    });

    const rightCloudSpring = useSpring({
        right: `${-60 + scrollProgress * 60}%`,
        config: {
            mass: 0.8,
            tension: 100,
            friction: 24,
            clamp: true
        }
    });

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {/* Debug-Anzeige */}
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
                Scroll: {(scrollProgress * 100).toFixed(0)}%
            </div>

            {/* Hintergrund mit Spring-Animation */}
            <animated.div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundImage: "url('/Parallax/Himmel.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                transform: bgSpring.scale.to(s => `scale(${s})`),
                transformOrigin: 'center top',
                zIndex: 0
            }} />

            {/* Logo mit Spring-Animation */}
            <animated.div style={{
                position: 'fixed',
                top: '33%',
                left: '50%',
                transform: logoSpring.scale.to(s => `translate(-50%, -50%) scale(${s})`),
                zIndex: 10,
                pointerEvents: 'none'
            }}>
                <img
                    src="/Parallax/Logo.png"
                    style={{
                        width: '200px',
                        filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
                    }}
                    alt="Logo"
                />
            </animated.div>

            {/* Wolken mit Spring-Animationen */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100vh', zIndex: 3, pointerEvents: 'none' }}>
                {/* Wolke links */}
                <animated.div style={{
                    position: 'absolute',
                    bottom: '56%',
                    ...leftCloudSpring
                }}>
                    <img
                        src="/Parallax/Wolken_Vorne_links.png"
                        style={{ width: '30vw', maxWidth: '500px' }}
                        alt="Wolken links"
                    />
                </animated.div>

                {/* Wolke rechts */}
                <animated.div style={{
                    position: 'absolute',
                    bottom: '56%',
                    ...rightCloudSpring
                }}>
                    <img
                        src="/Parallax/Wolken_Vorne_rechts.png"
                        style={{ width: '25vw', maxWidth: '400px' }}
                        alt="Wolken rechts"
                    />
                </animated.div>
            </div>

            {/* Newsletter */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: '500px',
                zIndex: 10
            }}>
                <Newsletter />
            </div>

            {/* Parallax nur für den Scrollbereich */}
            <Parallax pages={3} ref={parallaxRef} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                <ParallaxLayer offset={0} speed={0} factor={1} />
                <ParallaxLayer offset={1} speed={0} factor={1} />
                <ParallaxLayer offset={2} speed={0} factor={1} />
            </Parallax>
        </div>
    );
};

export default ParallaxContainerHybrid;