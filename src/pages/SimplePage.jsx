// src/pages/SimplePage.jsx - VEREINFACHTE ANITUNE SEITE - DESKTOP COMPOSITE
import React, { useState, useEffect } from 'react';
import Newsletter from '../components/Newsletter/Newsletter';
import AniTuneCarousel from '../components/Parallax/Elements/AniTuneCarousel';
import ErrorBoundary from '../components/ErrorBoundary';
import './SimplePage.css';

const SimplePage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [hasSubscribed, setHasSubscribed] = useState(false);

    // Mobile Detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Newsletter Status aus LocalStorage laden
    useEffect(() => {
        try {
            const stored = localStorage.getItem('anitune_newsletter_subscribed');
            if (stored) {
                const parsed = JSON.parse(stored);
                setHasSubscribed(parsed.subscribed || false);
            }
        } catch (error) {
            console.warn('LocalStorage error:', error);
        }
    }, []);

    // Newsletter Subscription Handler
    const handleSubscriptionChange = (subscribed) => {
        setHasSubscribed(subscribed);

        try {
            localStorage.setItem('anitune_newsletter_subscribed', JSON.stringify({
                subscribed,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('LocalStorage save error:', error);
        }
    };

    return (
        <div className="simple-page">
            {/* STATIC BACKGROUND */}
            <div className="background-container">
                {isMobile ? (
                    // Mobile: Composite Background
                    <>
                        <div
                            className="mobile-background"
                            style={{
                                backgroundImage: "url('/Parallax/mobile/Mobile_Hg.webp')",
                            }}
                        />
                        <div
                            className="mobile-foreground"
                            style={{
                                backgroundImage: "url('/Parallax/mobile/Mobile_Vg.webp')",
                            }}
                        />
                    </>
                ) : (
                    // Desktop: Complete Composite Background
                    <div
                        className="desktop-background"
                        style={{
                            backgroundImage: "url('/Parallax/Hintergrund_komplett.png')",
                        }}
                    />
                )}
            </div>

            {/* CONTENT CONTAINER - ZWEI FULL-HEIGHT SECTIONS */}
            <div className="content-container">

                {/* SECTION 1: LOGO + NEWSLETTER (100vh) */}
                <section className="hero-section">

                    {/* LOGO */}
                    <div className="logo-container">
                        <div
                            className="logo"
                            style={{
                                backgroundImage: "url('/Parallax/Logo.svg')",
                            }}
                        />
                    </div>

                    {/* TITEL */}
                    <div className="title-container">
                        <h1 className="main-title">Werde Ein AniTuner</h1>
                    </div>

                    {/* NEWSLETTER */}
                    <div className="newsletter-container">
                        <ErrorBoundary>
                            {!hasSubscribed ? (
                                <Newsletter onSubscriptionChange={handleSubscriptionChange} />
                            ) : (
                                <div className="subscription-success">
                                    <h3>✅ Bereits angemeldet!</h3>
                                    <p>Du erhältst bereits unsere Updates.</p>
                                </div>
                            )}
                        </ErrorBoundary>
                    </div>

                    {/* DATENSCHUTZ TEXT */}
                    <div className="privacy-text">
                        <p>Wir respektieren deine Privatsphäre. Du kannst dich jederzeit abmelden.</p>
                    </div>

                    {/* SCROLL HINWEIS */}
                    <div className="scroll-hint">
                        <div className="scroll-arrow">↓</div>
                        <span>Scroll für mehr</span>
                    </div>

                </section>

                {/* SECTION 2: CAROUSEL (100vh) */}
                <section className="carousel-section">
                    <ErrorBoundary>
                        <div className="carousel-wrapper">
                            {/* Fake scrollProgress für das Carousel - es braucht einen Wert zwischen 1.2-1.6 */}
                            <AniTuneCarousel
                                scrollProgress={1.3}
                                currentTitleIndex={5}
                                isScrollLocked={false}
                            />
                        </div>
                    </ErrorBoundary>
                </section>

            </div>

        </div>
    );
};

export default SimplePage;