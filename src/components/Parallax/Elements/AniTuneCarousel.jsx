// src/components/Parallax/Elements/AniTuneCarousel.jsx
import React, { useState, useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import './AniTuneCarousel.css';

const AniTuneCarousel = ({ scrollProgress, currentTitleIndex, isScrollLocked }) => {
    // State für aktive Karte
    const [activeCard, setActiveCard] = useState(2); // Mitte als Standard (Index 2 von 5)
    // ✅ NEU: State für Transition-Richtung
    const [transitionDirection, setTransitionDirection] = useState(null);

    // 5 Test-Karten Daten
    const cards = useMemo(() => [
        {
            id: 'discord',
            title: 'Discord',
            icon: '💬',
            color: '#5865F2',
            description: 'Community Chat'
        },
        {
            id: 'podcast',
            title: 'Podcast',
            icon: '🎙️',
            color: '#FF6B6B',
            description: 'Anime Talks'
        },
        {
            id: 'lizenzen',
            title: 'Lizenzen',
            icon: '📄',
            color: '#4ECDC4',
            description: 'Rights & Licenses'
        },
        {
            id: 'events',
            title: 'Events',
            icon: '🎉',
            color: '#45B7D1',
            description: 'Community Events'
        },
        {
            id: 'shop',
            title: 'Shop',
            icon: '🛍️',
            color: '#96CEB4',
            description: 'Merchandise'
        }
    ], []);

    // Aktuelle Karte für Titel
    const currentCard = cards[activeCard];

    // ✅ NEU: Intelligente Position-Berechnung
    const getSmartCardPosition = (cardIndex, activeIndex, direction) => {
        const totalCards = cards.length;
        let position = cardIndex - activeIndex;

        // Bei Links-Navigation: Spezielle Logik für Wrap-around
        if (direction === 'left' && activeIndex === 0 && cardIndex === totalCards - 1) {
            return -1; // Zeige die letzte Karte links neben der ersten
        }

        // Bei Rechts-Navigation: Spezielle Logik für Wrap-around  
        if (direction === 'right' && activeIndex === totalCards - 1 && cardIndex === 0) {
            return 1; // Zeige die erste Karte rechts neben der letzten
        }

        // Standard-Wrap-around für andere Fälle
        if (position > totalCards / 2) {
            position -= totalCards;
        } else if (position < -totalCards / 2) {
            position += totalCards;
        }

        return position;
    };

    // ✅ GEÄNDERT: Karten-Klick Handler mit intelligenter Richtung
    const handleCardClick = (index) => {
        if (index !== activeCard) {
            // Berechne kürzesten Weg
            const totalCards = cards.length;
            const currentPos = activeCard;
            const targetPos = index;

            let distance = targetPos - currentPos;

            // Optimiere für kürzesten Weg (Wrap-around berücksichtigen)
            if (distance > totalCards / 2) {
                distance -= totalCards;
                setTransitionDirection('left');
            } else if (distance < -totalCards / 2) {
                distance += totalCards;
                setTransitionDirection('right');
            } else {
                setTransitionDirection(distance > 0 ? 'right' : 'left');
            }

            console.log(`🎠 Karte ${index} (${cards[index].title}) wird zur Mitte bewegt`);
            setActiveCard(index);

            // Reset direction nach Animation
            setTimeout(() => setTransitionDirection(null), 600);
        }
    };

    // ✅ GEÄNDERT: Navigation Buttons mit Richtungs-Detection
    const handlePrevious = () => {
        setTransitionDirection('left');
        setActiveCard(prev => {
            const newIndex = prev > 0 ? prev - 1 : cards.length - 1;
            console.log(`🎠 Previous: ${prev} → ${newIndex}`);
            return newIndex;
        });
        setTimeout(() => setTransitionDirection(null), 600);
    };

    const handleNext = () => {
        setTransitionDirection('right');
        setActiveCard(prev => {
            const newIndex = prev < cards.length - 1 ? prev + 1 : 0;
            console.log(`🎠 Next: ${prev} → ${newIndex}`);
            return newIndex;
        });
        setTimeout(() => setTransitionDirection(null), 600);
    };

    // Zeige nur wenn Phase 7 aktiv ist (currentTitleIndex === 7)
    if (currentTitleIndex !== 7) {
        return null;
    }

    // Container-Animation - Für Phase 7 IMMER sichtbar
    const containerStyle = {
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return (
        <ErrorBoundary>
            <div
                className="anitune-carousel-container"
                style={containerStyle}
            >
                {/* Fixer AniTune Titel */}
                <div className="carousel-title-section">
                    <h1 className="fixed-title">AniTune</h1>

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

                {/* ✅ KOMPLETT NEUES Karten Container - Intelligentes Rendering */}
                <div className="cards-container">
                    {cards.map((card, cardIndex) => {
                        // Intelligente Position basierend auf Richtung
                        const smartPosition = getSmartCardPosition(cardIndex, activeCard, transitionDirection);

                        // Nur Karten in sichtbarem Bereich rendern (-2 bis +2)
                        if (Math.abs(smartPosition) > 2) {
                            return null;
                        }

                        const isActive = smartPosition === 0;
                        const distance = Math.abs(smartPosition);

                        // Bessere Transform-Berechnung
                        const cardStyle = {
                            '--card-color': card.color,
                            transform: `translateX(calc(-50% + ${smartPosition * 60}px)) scale(${isActive ? 1.1 : Math.max(0.8, 1 - distance * 0.1)}) rotateY(${smartPosition * -15}deg) translateZ(${-distance * 50}px)`,
                            zIndex: 10 - distance,
                            opacity: Math.max(0.4, 1 - distance * 0.2),
                            // WICHTIG: Smooth transition für alle Richtungen
                            transition: transitionDirection ? 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.3s ease'
                        };

                        return (
                            <div
                                key={card.id}
                                className={`carousel-card ${isActive ? 'active' : 'inactive'}`}
                                style={cardStyle}
                                onClick={() => handleCardClick(cardIndex)}
                            >
                                <div className="card-content">
                                    <div className="card-icon">{card.icon}</div>
                                    <h3 className="card-title">{card.title}</h3>
                                    <p className="card-description">{card.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="carousel-debug">
                        <div>Phase: {currentTitleIndex}/7</div>
                        <div>Active Card: {activeCard} ({currentCard.title})</div>
                        <div>Direction: {transitionDirection || 'none'}</div>
                        <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
                        <div style={{ color: '#00ff00', fontSize: '10px' }}>
                            ✅ Smart Direction Fix Active
                        </div>
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎠 Links/Rechts beide smooth
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AniTuneCarousel;