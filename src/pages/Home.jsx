// src/pages/Home.jsx
import React, { useState } from 'react';
import ParallaxContainerModular from '../components/Parallax/ParallaxContainerModular';
import LoadingScreen from '../components/Loading/LoadingScreen';

const Home = () => {
    // 🛡️ FIX: Loading sollte initial TRUE sein
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadingComplete = () => {
        console.log('📸 Loading abgeschlossen, zeige Parallax');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen relative">
            {/* 🛡️ LOADING SCREEN */}
            {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

            {/* 🛡️ PARALLAX: Nur anzeigen wenn NICHT loading */}
            {!isLoading && (
                <div style={{
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out'
                }}>
                    <ParallaxContainerModular />
                </div>
            )}
        </div>
    );
};

export default Home;