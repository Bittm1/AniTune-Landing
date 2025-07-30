// src/App.jsx - ERWEITERT MIT REACT ROUTER
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ConfirmEmail from './pages/ConfirmEmail'; // ✅ NEU: Bestätigungsseite
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* ✅ Hauptseite - deine bestehende EnhancedSimplePage */}
          <Route path="/" element={<Home />} />

          {/* ✅ NEU: Bestätigungsseite für Double Opt-In */}
          <Route path="/confirm-email" element={<ConfirmEmail />} />

          {/* ✅ OPTIONAL: Weitere Routen falls nötig */}
          <Route path="/success" element={<ConfirmEmail />} />
          <Route path="/newsletter-confirmed" element={<ConfirmEmail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;