// src/components/Newsletter/Newsletter.jsx
import React, { useState } from 'react';
import './Newsletter.css';


function Newsletter() {
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isInputHovered, setIsInputHovered] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('https://newsletter-api.cryptomacki.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (result.success) {
                setMessage(result.message);
                setEmail('');
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('❌ Netzwerk-Fehler. Versuche es nochmal.');
            console.error('Newsletter-Fehler:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="newsletter-container px-4 text-white text-center"
            style={{
                pointerEvents: 'all', // ✅ Sicherstellen dass Container klickbar ist
                position: 'relative',
                zIndex: 1
            }}
        >
            <form
                className="newsletter-form flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xl mx-auto"
                onSubmit={handleSubmit}
                style={{
                    pointerEvents: 'all', // ✅ Form explizit klickbar machen
                }}
            >
                <input
                    type="email"
                    placeholder="Deine E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className={`email-input bg-gray-800/80 backdrop-blur-sm placeholder:italic placeholder:text-gray-300 border-2 border-violet-500 px-4 py-2 rounded w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-300 ${isInputHovered ? 'input-hover' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onMouseEnter={() => !isSubmitting && setIsInputHovered(true)}
                    onMouseLeave={() => setIsInputHovered(false)}
                    style={{
                        pointerEvents: 'all', // ✅ Input explizit klickbar
                        cursor: isSubmitting ? 'not-allowed' : 'text'
                    }}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`cta-button bg-gradient-to-br from-violet-300 to-indigo-400 text-white font-semibold italic px-6 py-2 rounded border-2 border-violet-500 transition ${isButtonHovered && !isSubmitting ? 'button-hover' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onMouseEnter={() => !isSubmitting && setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    style={{
                        pointerEvents: 'all', // ✅ Button explizit klickbar
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        minWidth: '120px' // Verhindert Layout-Sprung beim Laden
                    }}
                >
                    <span className="button-text">
                        {isSubmitting ? '...' : 'Anmelden'}
                    </span>
                </button>
            </form>

            {/* ✅ Status-Nachricht */}
            {message && (
                <div
                    className="mt-3 text-sm"
                    style={{
                        color: message.includes('✅') ? '#4ade80' :
                            message.includes('📧') ? '#fbbf24' : '#ef4444',
                        pointerEvents: 'none' // Nachricht nicht klickbar
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

export default Newsletter;