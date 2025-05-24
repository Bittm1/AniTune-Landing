// src/pages/Home.jsx
import React, { useState } from 'react';
import ParallaxContainerModular from '../components/Parallax/ParallaxContainerModular';
import LoadingScreen from '../components/Loading/LoadingScreen';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen relative">
            {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
            {/* Vorladen des Parallax-Containers, aber erst anzeigen, wenn geladen */}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <ParallaxContainerModular />
            </div>
        </div>
    );
};

export default Home;