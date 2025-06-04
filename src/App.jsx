// src/App.jsx
import React from 'react';
import SimplePage from './pages/SimplePage'; // ✅ DIESE ZEILE
import './App.css';

function App() {
  return (
    <div className="App">
      <SimplePage /> {/* ✅ UND DIESE ZEILE */}
    </div>
  );
}

export default App;