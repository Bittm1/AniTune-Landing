// src/pages/Home.jsx - VEREINFACHT
import React from 'react';
import SimplePage from './SimplePage';
// import LoadingScreen entfernt - nicht mehr nötig

const Home = () => {
    return (
        <div className="min-h-screen relative">
            <SimplePage />
        </div>
    );
};

export default Home;