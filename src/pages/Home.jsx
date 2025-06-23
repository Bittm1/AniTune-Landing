// src/pages/Home.jsx - ENHANCED SIMPLE PAGE INTEGRATION
import React, { useState } from 'react';
import EnhancedSimplePage from '../components/Enhanced/EnhancedSimplePage';
import LoadingScreen from '../components/Loading/LoadingScreen';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false); // Optional: Start with false für direkten Zugang

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    // Optional: Lade Enhanced Simple Page ohne Loading Screen für Development
    const skipLoading = process.env.NODE_ENV === 'development';

    return (
        <div className="min-h-screen relative">
            {/* ===== LOADING SCREEN (Optional) ===== */}
            {isLoading && !skipLoading && (
                <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            )}

            {/* ===== ENHANCED SIMPLE PAGE ===== */}
            <div style={{
                display: (isLoading && !skipLoading) ? 'none' : 'block',
                width: '100%',
                height: '100%'
            }}>
                <EnhancedSimplePage />
            </div>

            {/* ===== DEBUG INFO (Development Only) ===== */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    position: 'fixed',
                    bottom: '10px',
                    left: '10px',
                    background: 'rgba(76, 175, 80, 0.9)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    zIndex: 1002,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    🎯 Enhanced Simple Page Active
                    <br />
                    Loading: {skipLoading ? 'Skipped' : (isLoading ? 'Active' : 'Complete')}
                </div>
            )}
        </div>
    );
};

export default Home;