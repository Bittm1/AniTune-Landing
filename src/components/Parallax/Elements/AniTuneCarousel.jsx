// src/components/Parallax/Elements/AniTuneCarousel.jsx - MATH FIX VERSION
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import './AniTuneCarousel.css';

const AniTuneCarousel = ({ scrollProgress, currentTitleIndex, isScrollLocked }) => {
    console.log("🧮 AniTuneCarousel loaded - Math Fix Version");

    // State für aktive Karte
    const [activeCard, setActiveCard] = useState(2); // Mitte als Standard

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

    // ✅ MATH-FIX: Beide Richtungen nutzen die gleiche mathematische Operation
    const handlePrevious = useCallback(() => {
        console.log("🧮 MATH-FIX: Links-Klick nutzt +4 (= -1 aber gleiche Richtung)");
        // Statt activeCard - 1, nutze +4 für gleiche Animation-Richtung
        setActiveCard(prev => (prev + 4) % cards.length);
    }, [cards.length]);

    const handleNext = useCallback(() => {
        console.log("🧮 MATH-FIX: Rechts-Klick nutzt +1");
        setActiveCard(prev => (prev + 1) % cards.length);
    }, [cards.length]);

    // Karten-Klick Handler
    const handleCardClick = useCallback((index) => {
        if (index !== activeCard) {
            console.log(`🎯 Karte ${index} (${cards[index].title}) angeklickt`);
            setActiveCard(index);
        }
    }, [activeCard, cards]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (currentTitleIndex !== 7) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentTitleIndex, handlePrevious, handleNext]);

    // Zeige nur wenn Phase 7 aktiv ist
    if (currentTitleIndex !== 7) {
        return null;
    }

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

                    <div className="sliding-title-container">
                        <h2
                            key={`${currentCard.id}-${activeCard}`}
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
                        const index = (activeCard + position + cards.length) % cards.length;
                        const card = cards[index];
                        const offset = position;
                        const isActive = position === 0;

                        const cardStyle = {
                            '--card-offset': offset,
                            '--card-color': card.color,
                            transform: `translateX(calc(-50% + ${offset * 60}px)) scale(${isActive ? 1.1 : Math.max(0.8, 1 - Math.abs(offset) * 0.1)}) rotateY(${offset * -15}deg) translateZ(${-Math.abs(offset) * 50}px)`,
                            zIndex: 10 - Math.abs(offset),
                            opacity: Math.max(0.4, 1 - Math.abs(offset) * 0.2)
                        };

                        return (
                            <div
                                key={card.id}
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

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="carousel-debug">
                        <div style={{ color: '#FFD700', fontWeight: 'bold' }}>🧮 Math Fix</div>
                        <div>Phase: {currentTitleIndex}/7</div>
                        <div>Active: {activeCard} ({currentCard.title})</div>
                        <div>Links: +4 | Rechts: +1</div>
                        <div>Scroll Lock: {isScrollLocked ? '🔒' : '🔓'}</div>

                        <div style={{ marginTop: '8px', fontSize: '10px', color: '#888' }}>
                            🎯 Beide nutzen "positive" Animation
                        </div>

                        <div style={{ marginTop: '8px' }}>
                            <button
                                onClick={handlePrevious}
                                style={{ padding: '2px 6px', margin: '2px', fontSize: '10px' }}
                            >
                                ← +4
                            </button>
                            <button
                                onClick={handleNext}
                                style={{ padding: '2px 6px', margin: '2px', fontSize: '10px' }}
                            >
                                → +1
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default AniTuneCarousel;