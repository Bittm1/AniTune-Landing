// src/components/Parallax/Elements/ScrollIndicator.jsx
import React, { useState, useEffect } from 'react';
import './ScrollIndicator.css';

const ScrollIndicator = ({ scrollProgress }) => {
    // Verstecke den Indikator, wenn der Nutzer bereits gescrollt hat
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Verstecke den Indikator, wenn der Nutzer über 10% gescrollt hat
        if (scrollProgress > 0.1) {
            setIsVisible(false);
        } else if (scrollProgress === 0) {
            // Zeige ihn wieder an, wenn der Nutzer ganz oben ist
            setIsVisible(true);
        }
    }, [scrollProgress]);

    if (!isVisible) return null;

    return (
        <div className={`scroll-indicator-container ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="scroll-indicator">
                <div className="arrow-down">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p className="scroll-text">Scroll</p>
            </div>
        </div>
    );
};

export default ScrollIndicator;