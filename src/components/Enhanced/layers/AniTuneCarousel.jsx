// src/components/Enhanced/layers/AniTuneCarousel.jsx - MIT 3-SEGMENT ANIMATION
// 🎠 VON UNTEN HOCH → ZENTRAL → NACH OBEN WEG (78%-90% ScrollProgress)
// ✅ MINIMAL FIX: Nur Clickability-Probleme behoben

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';

const AniTuneCarousel = ({
    scrollProgress,
    activeSnapPoint,
    isSnapping = false
}) => {
    const [activeCard, setActiveCard] = useState(4);
    const [transitionDirection, setTransitionDirection] = useState(null);

    // 9 AniTune-Karten Daten (unverändert)
    const cards = useMemo(() => [
        {
            id: 'discord',
            title: 'Discord',
            icon: '/icons/discord.webp',
            color: '#5865F2',
            description: 'Community Chat'
        },
        {
            id: 'podcast',
            title: 'Podcast',
            icon: '/icons/podcast.webp',
            color: '#FF6B6B',
            description: 'Anime Talks'
        },
        {
            id: 'lizenzen',
            title: 'Lizenzen',
            icon: '/icons/lizenz.webp',
            color: '#4ECDC4',
            description: 'Rights & Licenses'
        },
        {
            id: 'events',
            title: 'Events',
            icon: '/icons/meilensteine.png',
            color: '#45B7D1',
            description: 'Community Events'
        },
        {
            id: 'shop',
            title: 'Shop',
            icon: '/icons/merch.webp',
            color: '#96CEB4',
            description: 'Merchandise'
        },
        {
            id: 'dubbing',
            title: 'Dubbing',
            icon: '/icons/dubbing.webp',
            color: '#9B59B6',
            description: 'Voice Acting'
        },
        {
            id: 'vote',
            title: 'Vote',
            icon: '/icons/vote.webp',
            color: '#F39C12',
            description: 'Voting'
        },
        {
            id: 'donations',
            title: 'Donations',
            icon: '/icons/donations.webp',
            color: '#E74C3C',
            description: 'Spenden'
        },
        {
            id: 'katalog',
            title: 'Katalog',
            icon: '/icons/katalog.webp',
            color: '#2ECC71',
            description: 'StimmKatalog'
        }
    ], []);

    // Image Preloading
    useEffect(() => {
        cards.forEach(card => {
            const img = new Image();
            img.src = card.icon;
        });
    }, [cards]);

    // ✅ 3-SEGMENT ANIMATION: Hochfahren → Zentral → Nach oben wegfahren
    const getCarouselPosition = () => {
        // Segment 1: Hochfahren (78%-80%)
        const segment1Start = 0.78;
        const segment1End = 0.80;

        // Segment 2: Zentral bleiben (80%-85%) 
        const segment2Start = 0.80;
        const segment2End = 0.85;

        // Segment 3: Nach oben wegfahren (85%-90%)
        const segment3Start = 0.85;
        const segment3End = 0.90;

        if (scrollProgress < segment1Start) {
            return { translateY: 100, opacity: 0, phase: 'hidden' };
        } else if (scrollProgress >= segment1Start && scrollProgress <= segment1End) {
            const progress = (scrollProgress - segment1Start) / (segment1End - segment1Start);
            const eased = 1 - Math.pow(1 - progress, 2);
            return {
                translateY: 100 - (100 * eased),
                opacity: eased,
                phase: 'entering'
            };
        } else if (scrollProgress >= segment2Start && scrollProgress <= segment2End) {
            return {
                translateY: 0,
                opacity: 1,
                phase: 'active'
            };
        } else if (scrollProgress >= segment3Start && scrollProgress <= segment3End) {
            const progress = (scrollProgress - segment3Start) / (segment3End - segment3Start);
            const eased = Math.pow(progress, 2);
            return {
                translateY: -100 * eased,
                opacity: 1 - eased,
                phase: 'exiting'
            };
        } else if (scrollProgress > segment3End) {
            return { translateY: -100, opacity: 0, phase: 'exited' };
        }

        return { translateY: 0, opacity: 1, phase: 'active' };
    };

    const carouselPosition = getCarouselPosition();
    const currentCard = cards[activeCard];

    // Intelligente Position-Berechnung (unverändert)
    const getSmartCardPosition = (cardIndex, activeIndex, direction) => {
        const totalCards = cards.length;
        let position = cardIndex - activeIndex;

        if (direction === 'left' && activeIndex === 0 && cardIndex === totalCards - 1) {
            return -1;
        }

        if (direction === 'right' && activeIndex === totalCards - 1 && cardIndex === 0) {
            return 1;
        }

        if (position > totalCards / 2) {
            position -= totalCards;
        } else if (position < -totalCards / 2) {
            position += totalCards;
        }

        return position;
    };

    // ✅ FIX: Verbesserte Navigation Handlers mit Event-Handling
    const handleCardClick = (index, event) => {
        // ✅ FIX: Event richtig behandeln
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`🎠 CARD CLICK: ${index} (${cards[index].title})`);
        }

        if (index !== activeCard) {
            const totalCards = cards.length;
            const currentPos = activeCard;
            const targetPos = index;

            let distance = targetPos - currentPos;

            if (distance > totalCards / 2) {
                distance -= totalCards;
                setTransitionDirection('left');
            } else if (distance < -totalCards / 2) {
                distance += totalCards;
                setTransitionDirection('right');
            } else {
                setTransitionDirection(distance > 0 ? 'right' : 'left');
            }

            setActiveCard(index);
            setTimeout(() => setTransitionDirection(null), 400);
        }
    };

    const handlePrevious = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setTransitionDirection('left');
        setActiveCard(prev => {
            const newIndex = prev > 0 ? prev - 1 : cards.length - 1;
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎠 PREVIOUS: ${prev} → ${newIndex}`);
            }
            return newIndex;
        });
        setTimeout(() => setTransitionDirection(null), 400);
    };

    const handleNext = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setTransitionDirection('right');
        setActiveCard(prev => {
            const newIndex = prev < cards.length - 1 ? prev + 1 : 0;
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎠 NEXT: ${prev} → ${newIndex}`);
            }
            return newIndex;
        });
        setTimeout(() => setTransitionDirection(null), 400);
    };

    // ✅ FIX: Container Style mit höherem Z-Index
    const containerStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100vh',
        transform: `translateY(${carouselPosition.translateY}vh)`,
        opacity: carouselPosition.opacity,
        pointerEvents: carouselPosition.opacity > 0.1 ? 'all' : 'none',
        zIndex: 150, // ✅ FIX: Von 40 auf 150 erhöht
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        transition: isSnapping ? 'none' : 'transform 0.8s ease-out, opacity 0.8s ease-out'
    };

    // Sichtbarkeitsprüfung
    if (scrollProgress < 0.78 || scrollProgress > 0.92) {
        return null;
    }

    return (
        <ErrorBoundary>
            {/* ===== CAROUSEL CSS INJECTION ===== */}
            <style jsx>{`
                .anitune-carousel-container {
                    /* Container wird via containerStyle gesetzt */
                }

                .carousel-title-section {
                    text-align: center;
                    margin-bottom: 3rem;
                    z-index: 10;
                    pointer-events: none; /* ✅ FIX: Titel nicht klickbar */
                }

                .fixed-title {
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                    margin: 0 0 1rem 0;
                    font-family: 'Lobster', cursive, sans-serif;
                }

                .sliding-title-container {
                    height: 60px;
                    overflow: hidden;
                    position: relative;
                }

                .sliding-title {
                    font-size: 2rem;
                    font-weight: 600;
                    margin: 0;
                    color: var(--title-color, #FF6B6B);
                    text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
                    animation: slideInFromBottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    font-family: 'Arial', sans-serif;
                }

                @keyframes slideInFromBottom {
                    0% {
                        transform: translateY(60px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .carousel-navigation {
                    position: absolute;
                    top: 50%;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 2rem;
                    z-index: 15;
                    pointer-events: none; /* ✅ FIX: Container nicht klickbar */
                }

                .nav-button {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    font-size: 2rem;
                    font-weight: 300;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    pointer-events: all; /* ✅ FIX: Buttons explizit klickbar */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    user-select: none; /* ✅ FIX: Text-Selektion verhindern */
                }

                .nav-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.4);
                    transform: scale(1.1);
                }

                .nav-button:active {
                    transform: scale(0.95);
                }

                .cards-container {
                    position: relative;
                    width: 100%;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-style: preserve-3d;
                    pointer-events: none; /* ✅ FIX: Container nicht klickbar */
                    /* ✅ FIX: Bessere Zentrierung */
                    margin: 0 auto;
                }

                .carousel-card {
                    position: absolute;
                    width: 200px;
                    height: 280px;
                    background: linear-gradient(135deg, var(--card-color, #667eea) 0%, rgba(255,255,255,0.1) 100%);
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    transform-style: preserve-3d;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    pointer-events: all; /* ✅ FIX: Karten explizit klickbar */
                    user-select: none; /* ✅ FIX: Text-Selektion verhindern */
                    /* ✅ FIX: Verbesserte Clickability */
                    z-index: inherit;
                }

                .carousel-card:hover {
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                }

                .carousel-card.active {
                    border-color: rgba(255, 255, 255, 0.4);
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
                }

                .card-content {
                    padding: 2rem 1.5rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    pointer-events: none; /* ✅ FIX: Content nicht klickbar, Clicks gehen zur Karte */
                }

                .card-icon {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 1.5rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none; /* ✅ FIX */
                }

                .card-icon-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 12px;
                    pointer-events: none; /* ✅ FIX */
                }

                .card-icon-fallback {
                    font-size: 3rem;
                    opacity: 0.8;
                    pointer-events: none; /* ✅ FIX */
                }

                .card-description {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 500;
                    margin: 0;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
                    line-height: 1.4;
                    pointer-events: none; /* ✅ FIX */
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .fixed-title {
                        font-size: 2rem;
                    }
                    
                    .sliding-title {
                        font-size: 1.5rem;
                    }
                    
                    .carousel-card {
                        width: 160px;
                        height: 220px;
                    }
                    
                    .card-content {
                        padding: 1.5rem 1rem;
                    }
                    
                    .card-icon {
                        width: 60px;
                        height: 60px;
                        margin-bottom: 1rem;
                    }
                    
                    .card-description {
                        font-size: 0.9rem;
                    }
                    
                    .nav-button {
                        width: 50px;
                        height: 50px;
                        font-size: 1.5rem;
                    }
                }
            `}</style>

            <div
                className="anitune-carousel-container"
                style={containerStyle}
            >
                {/* Coming Soon Titel */}
                <div className="carousel-title-section">
                    <h1 className="fixed-title">Coming Soon</h1>

                    <div className="sliding-title-container">
                        <h2
                            key={currentCard.id}
                            className="sliding-title"
                            style={{ '--title-color': currentCard.color }}
                        >
                            {currentCard.title}
                        </h2>
                    </div>
                </div>

                {/* ✅ FIX: Navigation Buttons mit Event-Handling */}
                <div className="carousel-navigation">
                    <button
                        className="nav-button nav-prev"
                        onClick={handlePrevious}
                        aria-label="Previous card"
                    >
                        ‹
                    </button>

                    <button
                        className="nav-button nav-next"
                        onClick={handleNext}
                        aria-label="Next card"
                    >
                        ›
                    </button>
                </div>

                {/* ✅ FIX: Karten mit verbessertem Event-Handling */}
                <div className="cards-container">
                    {cards.map((card, cardIndex) => {
                        const smartPosition = getSmartCardPosition(cardIndex, activeCard, transitionDirection);

                        if (Math.abs(smartPosition) > 3) {
                            return null;
                        }

                        const isActive = smartPosition === 0;
                        const distance = Math.abs(smartPosition);
                        const showCard = Math.abs(smartPosition) <= 3;

                        const cardStyle = {
                            '--card-color': card.color,
                            transform: `translate(-50%, -50%) translateX(${smartPosition * 60}px) scale(${isActive ? 1.1 : Math.max(0.8, 1 - distance * 0.1)}) rotateY(${smartPosition * -15}deg) translateZ(${-distance * 50}px)`,
                            zIndex: 10 - distance,
                            opacity: showCard ? Math.max(0.4, 1 - distance * 0.2) : 0,
                            transition: transitionDirection ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.3s ease',
                            visibility: showCard ? 'visible' : 'hidden',
                            left: '50%', // ✅ FIX: Explizite Zentrierung
                            top: '50%'   // ✅ FIX: Vertikale Zentrierung
                        };

                        return (
                            <div
                                key={card.id}
                                className={`carousel-card ${isActive ? 'active' : 'inactive'}`}
                                style={cardStyle}
                                onClick={(e) => {
                                    // ✅ FIX: Verbesserte Click-Behandlung
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (process.env.NODE_ENV === 'development') {
                                        console.log(`🎠 KARTE GEKLICKT: ${cardIndex} (${card.title})`);
                                    }
                                    handleCardClick(cardIndex, e);
                                }}
                                onMouseDown={(e) => {
                                    // ✅ FIX: Zusätzliche Sicherheit
                                    e.preventDefault();
                                }}
                                data-card-index={cardIndex} // ✅ FIX: Für Debug
                                data-card-title={card.title} // ✅ FIX: Für Debug
                            >
                                <div className="card-content">
                                    <div className="card-icon">
                                        <img
                                            src={card.icon}
                                            alt={`${card.title} Icon`}
                                            className="card-icon-image"
                                            loading="eager"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="card-icon-fallback" style={{ display: 'none' }}>
                                            {card.id === 'discord' && '💬'}
                                            {card.id === 'podcast' && '🎙️'}
                                            {card.id === 'lizenzen' && '📄'}
                                            {card.id === 'events' && '🎉'}
                                            {card.id === 'shop' && '🛍️'}
                                            {card.id === 'dubbing' && '🎭'}
                                            {card.id === 'vote' && '⭐'}
                                            {card.id === 'donations' && '💝'}
                                            {card.id === 'katalog' && '🎤'}
                                        </div>
                                    </div>
                                    <p className="card-description">{card.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ===== ✅ DIRECT CARD CLICK TEST (Development Only) ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <button
                            onClick={() => {
                                console.log('🎠 CLICK-TEST: Carousel ist klickbar!');
                                console.log('Active Card:', activeCard);
                                console.log('Opacity:', carouselPosition.opacity);
                                console.log('Z-Index: 150');
                            }}
                            style={{
                                background: 'lime',
                                color: 'black',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                pointerEvents: 'all',
                                zIndex: 200
                            }}
                        >
                            🎠 TEST
                        </button>

                        <button
                            onClick={() => {
                                // ✅ TEST: Simuliere Klick auf erste Karte
                                console.log('🎯 SIMULIERE KARTEN-KLICK: Karte 0');
                                handleCardClick(0);
                            }}
                            style={{
                                background: 'orange',
                                color: 'white',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                pointerEvents: 'all',
                                zIndex: 200
                            }}
                        >
                            🎯 KLICK KARTE 0
                        </button>
                    </div>
                )}

                {/* ===== DEBUG für Layer System ===== */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(168, 128, 255, 0.95)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        lineHeight: '1.4',
                        pointerEvents: 'all',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid #a880ff',
                        minWidth: '280px',
                        zIndex: 50
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffff00' }}>
                            🎠 CAROUSEL - CLICKABILITY FIXED
                        </div>
                        <div>📍 Active Snap: {activeSnapPoint}/6</div>
                        <div>📊 ScrollProgress: {(scrollProgress * 100).toFixed(1)}%</div>
                        <div>📐 TranslateY: {carouselPosition.translateY.toFixed(1)}vh</div>
                        <div>👁️ Opacity: {carouselPosition.opacity.toFixed(2)}</div>
                        <div>🎭 Phase: <span style={{ color: '#00ff00' }}>{carouselPosition.phase}</span></div>
                        <div>🎯 Active Card: {activeCard} ({currentCard.title})</div>
                        <div>🔍 Z-Index: <span style={{ color: '#00ff00' }}>150 (erhöht)</span></div>
                        <div>🖱️ Pointer Events: <span style={{ color: carouselPosition.opacity > 0.1 ? '#00ff00' : '#ff0000' }}>
                            {carouselPosition.opacity > 0.1 ? 'ALL' : 'NONE'}
                        </span></div>

                        <div style={{ color: '#00ff00', fontSize: '9px', marginTop: '6px' }}>
                            ✅ Z-Index: 40 → 150 | Pointer Events: Explizit
                            <br />✅ Event-Handling verbessert | Direktes Karten-Klicken aktiviert
                            <br />🎯 Klicke direkt auf Karten zum Wechseln
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AniTuneCarousel;