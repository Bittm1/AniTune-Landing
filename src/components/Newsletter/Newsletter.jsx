// src/components/Newsletter/Newsletter.jsx
import React, { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isInputHovered, setIsInputHovered] = useState(false);

    return (
        <div className="px-4 text-white text-center">
            <form className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xl mx-auto">
                <input
                    type="email"
                    placeholder="Deine E-Mail"
                    className={`email-input bg-gray-800/80 backdrop-blur-sm placeholder:italic placeholder:text-gray-300 border-2 border-violet-500 px-4 py-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-300 ${isInputHovered ? 'input-hover' : ''}`}
                    onMouseEnter={() => setIsInputHovered(true)}
                    onMouseLeave={() => setIsInputHovered(false)}
                />
                <button
                    type="submit"
                    className={`cta-button bg-gradient-to-br from-violet-300 to-indigo-400 text-white font-semibold italic px-6 py-2 rounded border-2 border-violet-500 transition ${isButtonHovered ? 'button-hover' : ''}`}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                >
                    <span className="button-text">Anmelden</span>
                </button>
            </form>
        </div>
    );
}

export default Newsletter;