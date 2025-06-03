// src/components/Parallax/Elements/AniTuneCarousel.jsx - ERWEITERT auf 9 Karten mit Bild-Icons
import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import { getPositionFromSegments } from '../utils/animationUtils';
import './AniTuneCarousel.css';

const AniTuneCarousel = ({ scrollProgress, currentTitleIndex, isScrollLocked }) => {
    // NUR die notwendigen States - keine Animation States!
    const [activeCard, setActiveCard] = useState(4); // ✅ ANGEPASST: Mittlere Karte bei 9 Karten (Index 4)
    const [transitionDirection, setTransitionDirection] = useState(null);

    // PROFESSIONELL: Segment-Definition wie andere Layer
    const carouselSegment = useMemo(() => [{
        scrollStart: 1.20,    // Phase 7 startet jetzt bei 124%
        scrollEnd: 1.80,      // Phase 7 endet bei 144%  
        posStart: 60,        // Startet 100vh unten
        posEnd: -150,        // ✅ DEINE ANPASSUNG: -150 statt -100
        opacityStart: 1.0, // Startet voll sichtbar
        opacityEnd: 1.0
    }], []);

    // 9 AniTune-Karten Daten - MIT BILD-ICONS
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

    // ✅ NEU: Image Preloading für bessere Performance
    useEffect(() => {
        cards.forEach(card => {
            const img = new Image();
            img.src = card.icon;
        });
    }, [cards]);

    // PROFESSIONELL: Scroll-basierte Position wie andere Layer
    const verticalPosition = getPositionFromSegments(carouselSegment, scrollProgress, 'posStart', 'posEnd');
    const opacity = getPositionFromSegments(carouselSegment, scrollProgress, 'opacityStart', 'opacityEnd');

    // Animation Progress für Karten-Sichtbarkeit (0-1 innerhalb Phase 7)
    const phase7Progress = scrollProgress >= 1.24 && scrollProgress <= 1.44
        ? (scrollProgress - 1.24) / 0.2  // 0-1 innerhalb der Phase 7
        : scrollProgress > 1.44 ? 1 : 0; // 1 wenn darüber, 0 wenn darunter

    // Aktuelle Karte für Titel
    const currentCard = cards[activeCard];

    // Intelligente Position-Berechnung (erweitert für 9 Karten)
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

    // Navigation Handlers (unverändert - funktionieren gut)
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

            setTimeout(() => setTransitionDirection(null), 400); // ✅ BESCHLEUNIGT: 400ms statt 600ms
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
        setTimeout(() => setTransitionDirection(null), 400); // ✅ BESCHLEUNIGT
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
        setTimeout(() => setTransitionDirection(null), 400); // ✅ BESCHLEUNIGT
    };

    // PROFESSIONELL: Container Style wie andere Layer
    const containerStyle = {
        transform: `translateY(${verticalPosition}vh)`,
        opacity: Math.max(0, Math.min(1, opacity)),
        transition: isScrollLocked ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
    };

    if (scrollProgress < 1.20 || scrollProgress > 1.50) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div
                className="anitune-carousel-container"
                style={containerStyle}
            >
                {/* ✅ GEÄNDERT: Coming Soon statt AniTune */}
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

                {/* PROFESSIONELL: Karten mit scroll-basierter Sichtbarkeit */}
                <div className="cards-container">
                    {cards.map((card, cardIndex) => {
                        const smartPosition = getSmartCardPosition(cardIndex, activeCard, transitionDirection);

                        if (Math.abs(smartPosition) > 3) {
                            return null; // ✅ ERWEITERT: 3 Karten links/rechts bei 9 Karten total
                        }

                        const isActive = smartPosition === 0;
                        const distance = Math.abs(smartPosition);

                        // PROFESSIONELL: Karten sofort sichtbar für bessere Performance
                        // Alle Karten innerhalb des Sichtbereichs werden sofort angezeigt
                        const showCard = Math.abs(smartPosition) <= 3; // ✅ GEÄNDERT: Sofort sichtbar

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
                                            loading="eager" // ✅ NEU: Sofortiges Laden
                                            onError={(e) => {
                                                // Fallback zu Emoji falls Bild nicht lädt
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
                                    {/* ✅ ENTFERNT: card-title */}
                                    <p className="card-description">{card.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ✅ NUR DEVELOPMENT: Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="carousel-debug">
                        <div>ScrollProgress: {scrollProgress.toFixed(2)}</div>
                        <div>Phase7Progress: {(phase7Progress * 100).toFixed(0)}%</div>
                        <div>VerticalPos: {verticalPosition.toFixed(0)}vh</div>
                        <div>Opacity: {opacity.toFixed(2)}</div>
                        <div>Active Card: {activeCard} ({currentCard.title})</div>
                        <div>Total Cards: {cards.length}</div>
                        <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
                        <div style={{ color: '#00ff00', fontSize: '10px' }}>
                            ✅ 9 Karten mit Bild-Icons
                        </div>
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎠 Ring-Animation optimiert
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AniTuneCarousel;