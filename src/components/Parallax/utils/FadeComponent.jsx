// src/components/Parallax/utils/FadeComponent.jsx
import React from 'react';

const FadeComponent = ({
    scrollProgress,
    threshold = 0.42,
    children,
    style = {},
    enablePointerEvents = false // ✅ Neuer Prop für Newsletter
}) => {
    // Stelle sicher, dass scrollProgress ein gültiger Wert ist
    const safeScrollProgress = typeof scrollProgress === 'number' && !isNaN(scrollProgress)
        ? scrollProgress
        : 0;

    // Berechne die Opacity basierend auf dem scrollProgress
    const opacity = Math.max(0, 1 - (safeScrollProgress / threshold));

    // Wenn vollständig unsichtbar, nicht rendern
    if (opacity <= 0.01) return null;

    return (
        <div
            style={{
                ...style,
                opacity: opacity,
                transition: 'opacity 800ms ease-out', // Längere, sanftere Überblendung
                // ✅ WICHTIG: Pointer-events basierend auf enablePointerEvents
                pointerEvents: enablePointerEvents ? 'all' : style.pointerEvents || 'auto',
            }}
        >
            {children}
        </div>
    );
};

export default FadeComponent;