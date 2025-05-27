// src/components/Parallax/Elements/AniTuneCarousel.jsx
import React, { useState, useMemo } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import './AniTuneCarousel.css';

const AniTuneCarousel = ({ scrollProgress, currentTitleIndex, isScrollLocked }) => {
    // State für aktive Karte
    const [activeCard, setActiveCard] = useState(2); // Mitte als Standard (Index 2 von 5)

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

    // ✅ ERWEITERT: Karten-Klick Handler - Karte gleitet zur Mitte
    const handleCardClick = (index) => {
        if (index !== activeCard) {
            console.log(`🎠 Karte ${index} (${cards[index].title}) wird zur Mitte bewegt`);
            setActiveCard(index);
        }
    };

    // Navigation Buttons
    const handlePrevious = () => {
        setActiveCard(prev => prev > 0 ? prev - 1 : cards.length - 1);
    };

    const handleNext = () => {
        setActiveCard(prev => prev < cards.length - 1 ? prev + 1 : 0);
    };

    // Zeige nur wenn Phase 7 aktiv ist (currentTitleIndex === 7)
    if (currentTitleIndex !== 7) {
        return null;
    }

    // ✅ KORRIGIERT: Container-Animation - Für Phase 7 IMMER sichtbar
    const containerStyle = {
        // ✅ WICHTIG: In Phase 7 immer sichtbar, unabhängig vom isScrollLocked Status
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

                {/* Karten Container */}
                <div className="cards-container">
                    {[-2, -1, 0, 1, 2].map((position) => {
                        // ✅ MINIMALE ÄNDERUNG: Berechne welcher Inhalt an dieser festen Position gezeigt wird
                        const index = (activeCard + position + cards.length) % cards.length;
                        const card = cards[index];
                        const offset = position;
                        const isActive = position === 0;

                        // ✅ KORREKTE ZENTRIERUNG: -50% für echte Mitte + CSS-Transitions beibehalten
                        const cardStyle = {
                            '--card-offset': offset,
                            '--card-color': card.color,
                            // ✅ ZENTRIERT: translateX(-50% + offset) für echte Mitte
                            transform: `translateX(calc(-50% + ${offset * 60}px)) scale(${isActive ? 1.1 : Math.max(0.8, 1 - Math.abs(offset) * 0.1)}) rotateY(${offset * -15}deg) translateZ(${-Math.abs(offset) * 50}px)`,
                            zIndex: 10 - Math.abs(offset),
                            opacity: Math.max(0.4, 1 - Math.abs(offset) * 0.2)
                            // ✅ KEINE TRANSITION HIER - CSS macht das schon!
                        };

                        return (
                            <div
                                key={card.id} // ✅ ZURÜCK ZU card.id für smooth Transitions!
                                className={`carousel-card ${isActive ? 'active' : 'inactive'}`}
                                style={cardStyle}
                                onClick={() => handleCardClick(index)}
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

                {/* ✅ ERWEITERTE Debug Info - zeigt mehr Details */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="carousel-debug">
                        <div>Phase: {currentTitleIndex}/7</div>
                        <div>Active Card: {activeCard} ({currentCard.title})</div>
                        <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>
                        <div style={{ color: '#00ff00', fontSize: '10px' }}>
                            ✅ Carousel IMMER sichtbar in Phase 7
                        </div>
                        <div style={{ color: '#a880ff', fontSize: '10px' }}>
                            🎠 Feste Positionen, rotierender Inhalt
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AniTuneCarousel;