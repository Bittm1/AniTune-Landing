// src/components/Parallax/Elements/AniTuneCarousel.jsx - KORRIGIERT Position + Meilensteine

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import { getPositionFromSegments } from '../utils/animationUtils';
import { PHASE_CONFIG, getPhaseDebugInfo } from '../utils/phaseUtils';
import './AniTuneCarousel.css';

const AniTuneCarousel = ({ scrollProgress, currentTitleIndex, isScrollLocked }) => {
    const [activeCard, setActiveCard] = useState(5); // ✅ ANGEPASST: Mittlere Karte bei 10 Karten (Index 5)
    const [transitionDirection, setTransitionDirection] = useState(null);

    // ✅ KORRIGIERT: Mehrstufiges Segment-System für bessere Kontrolle
    const carouselSegments = useMemo(() => [
        // Segment 1: Einfahren (120%-140% scrollProgress)
        {
            scrollStart: PHASE_CONFIG.phase5.scrollStart, // 1.2
            scrollEnd: 1.35, // ✅ GEÄNDERT: Kürzer für Einfahren
            posStart: 60,     // Startet unten
            posEnd: 10,       // ✅ KORRIGIERT: Stoppt bei 10vh (sichtbar)
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        // Segment 2: Bleiben (140%-150% scrollProgress)
        {
            scrollStart: 1.35,
            scrollEnd: 1.5,
            posStart: 10,     // ✅ BLEIBT bei 10vh
            posEnd: 10,       // ✅ KEINE weitere Bewegung
            opacityStart: 1.0,
            opacityEnd: 1.0
        },
        // Segment 3: Ausfahren (150%-160% scrollProgress)
        {
            scrollStart: 1.5,
            scrollEnd: PHASE_CONFIG.phase5.scrollEnd, // 1.6
            posStart: 10,     // Startet bei 10vh
            posEnd: -50,      // ✅ KORRIGIERT: Sanftes Ausfahren (-50vh statt -150vh)
            opacityStart: 1.0,
            opacityEnd: 0.3   // ✅ FADE OUT beim Ausfahren
        }
    ], []);

    // 10 AniTune-Karten Daten (mit Meilensteine, ohne descriptions)
    const cards = useMemo(() => [
        {
            id: 'discord',
            title: 'Discord',
            icon: '/icons/discord.webp',
            color: '#5865F2'
        },
        {
            id: 'podcast',
            title: 'Podcast',
            icon: '/icons/podcast.webp',
            color: '#FF6B6B'
        },
        {
            id: 'lizenzen',
            title: 'Lizenzen',
            icon: '/icons/lizenz.webp',
            color: '#4ECDC4'
        },
        {
            id: 'events',
            title: 'Events',
            icon: '/icons/events.webp',
            color: '#45B7D1'
        },
        {
            id: 'meilensteine',
            title: 'Meilensteine',
            icon: '/icons/meilensteine.webp',
            color: '#8B5CF6'
        },
        {
            id: 'shop',
            title: 'Merch',
            icon: '/icons/merch.webp',
            color: '#96CEB4'
        },
        {
            id: 'dubbing',
            title: 'Dubbing',
            icon: '/icons/dubbing.webp',
            color: '#9B59B6'
        },
        {
            id: 'vote',
            title: 'Vote',
            icon: '/icons/vote.webp',
            color: '#F39C12'
        },
        {
            id: 'donations',
            title: 'Donations',
            icon: '/icons/donations.webp',
            color: '#E74C3C'
        },
        {
            id: 'katalog',
            title: 'Katalog',
            icon: '/icons/katalog.webp',
            color: '#2ECC71'
        }
    ], []);

    // Image Preloading
    useEffect(() => {
        cards.forEach(card => {
            const img = new Image();
            img.src = card.icon;
        });
    }, [cards]);

    // ✅ KORRIGIERT: Multi-Segment Position und Opacity
    const verticalPosition = getPositionFromSegments(carouselSegments, scrollProgress, 'posStart', 'posEnd');
    const opacity = getPositionFromSegments(carouselSegments, scrollProgress, 'opacityStart', 'opacityEnd');

    // Aktuelle Karte für Titel
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

    // Navigation Handlers (unverändert)
    const handleCardClick = (index) => {
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

            if (process.env.NODE_ENV === 'development') {
                console.log(`🎠 Karte ${index} (${cards[index].title}) wird zur Mitte bewegt`);
            }
            setActiveCard(index);

            setTimeout(() => setTransitionDirection(null), 400);
        }
    };

    const handlePrevious = () => {
        setTransitionDirection('left');
        setActiveCard(prev => {
            const newIndex = prev > 0 ? prev - 1 : cards.length - 1;
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎠 Previous: ${prev} → ${newIndex}`);
            }
            return newIndex;
        });
        setTimeout(() => setTransitionDirection(null), 400);
    };

    const handleNext = () => {
        setTransitionDirection('right');
        setActiveCard(prev => {
            const newIndex = prev < cards.length - 1 ? prev + 1 : 0;
            if (process.env.NODE_ENV === 'development') {
                console.log(`🎠 Next: ${prev} → ${newIndex}`);
            }
            return newIndex;
        });
        setTimeout(() => setTransitionDirection(null), 400);
    };

    // Container Style
    const containerStyle = {
        transform: `translateY(${verticalPosition}vh)`,
        opacity: Math.max(0, Math.min(1, opacity)),
        transition: isScrollLocked ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
    };

    // ✅ ERWEITERT: Bessere Sichtbarkeitsprüfung
    if (scrollProgress < PHASE_CONFIG.phase5.scrollStart ||
        scrollProgress > PHASE_CONFIG.phase5.scrollEnd + 0.1) { // ✅ Kleine Pufferzone
        return null;
    }

    // ✅ ERMITTLE AKTUELLES SEGMENT für Debug
    let currentSegment = 'unknown';
    if (scrollProgress >= 1.2 && scrollProgress < 1.35) currentSegment = '1 (Einfahren)';
    else if (scrollProgress >= 1.35 && scrollProgress < 1.5) currentSegment = '2 (Bleiben)';
    else if (scrollProgress >= 1.5 && scrollProgress < 1.6) currentSegment = '3 (Ausfahren)';

    return (
        <ErrorBoundary>
            <div
                className="anitune-carousel-container"
                style={containerStyle}
            >
                {/* Coming Soon Titel */}
                <div className="carousel-title-section">
                    <h1 className="fixed-title">Coming Soon</h1>

                    {/* Wechselnder Untertitel */}
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

                {/* Navigation Buttons */}
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

                {/* Karten */}
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
                            transform: `translateX(calc(-50% + ${smartPosition * 60}px)) scale(${isActive ? 1.1 : Math.max(0.8, 1 - distance * 0.1)}) rotateY(${smartPosition * -15}deg) translateZ(${-distance * 50}px)`,
                            zIndex: 10 - distance,
                            opacity: showCard ? Math.max(0.4, 1 - distance * 0.2) : 0,
                            transition: transitionDirection ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.3s ease',
                            visibility: showCard ? 'visible' : 'hidden'
                        };

                        return (
                            <div
                                key={card.id}
                                className={`carousel-card ${isActive ? 'active' : 'inactive'}`}
                                style={cardStyle}
                                onClick={() => handleCardClick(cardIndex)}
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
                                            {card.id === 'meilensteine' && '🏆'}
                                            {card.id === 'shop' && '🛍️'}
                                            {card.id === 'dubbing' && '🎭'}
                                            {card.id === 'vote' && '⭐'}
                                            {card.id === 'donations' && '💝'}
                                            {card.id === 'katalog' && '🎤'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ✅ ERWEITERT: Debug mit Multi-Segment Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        position: 'absolute',
                        bottom: '-100px',
                        left: '0',
                        background: 'rgba(168, 128, 255, 0.9)',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        lineHeight: '1.3',
                        pointerEvents: 'all',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minWidth: '280px'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            🎠 Phase 5: AniTune Carousel (10 Karten + Meilensteine)
                        </div>
                        <div>ScrollProgress: {scrollProgress.toFixed(3)}</div>
                        <div>Debug %: {(scrollProgress * 40).toFixed(1)}%</div>
                        <div>Current Segment: {currentSegment}</div>
                        <div>VerticalPos: {verticalPosition.toFixed(1)}vh</div>
                        <div>Opacity: {opacity.toFixed(2)}</div>
                        <div>Active Card: {activeCard} ({currentCard.title})</div>

                        <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '4px' }}>
                            <div style={{ fontSize: '9px', color: '#ffff00' }}>
                                📍 Segment Details:
                            </div>
                            <div style={{ fontSize: '8px', color: '#ccc' }}>
                                1.2-1.35: Einfahren (60vh → 10vh)
                            </div>
                            <div style={{ fontSize: '8px', color: '#ccc' }}>
                                1.35-1.5: Bleiben (10vh)
                            </div>
                            <div style={{ fontSize: '8px', color: '#ccc' }}>
                                1.5-1.6: Ausfahren (10vh → -50vh)
                            </div>
                        </div>

                        <div style={{ color: '#00ff00', fontSize: '9px', marginTop: '4px' }}>
                            ✅ 3-Segment System | 10 Karten inkl. Meilensteine
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AniTuneCarousel;