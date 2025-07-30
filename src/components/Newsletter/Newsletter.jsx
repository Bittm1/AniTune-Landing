// src/components/Newsletter/Newsletter.jsx
import React, { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'REMOVED', // <-- Trage hier deinen echten API-Key lokal ein
                },
                body: JSON.stringify({
                    email,
                    listIds: [3],
                    updateEnabled: false,
                    doubleOptIn: true,
                }),
            });

            if (response.status === 204 || response.status === 201) {
                setMessage('📧 Bitte bestätige deine Anmeldung in der E-Mail.');
                setEmail('');
            } else {
                const result = await response.json();
                setMessage(`❌ Fehler: ${result.message || 'Unbekannter Fehler'}`);
            }
        } catch (error) {
            console.error('Newsletter-Fehler:', error);
            setMessage('❌ Netzwerkfehler. Bitte später erneut versuchen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <input
                type="email"
                placeholder="Erhalte unseren Newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-gray-800/80 text-white placeholder:text-gray-400 px-4 py-2 rounded w-full sm:w-auto border-2 border-violet-500"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-2 rounded"
            >
                {isSubmitting ? '...' : 'Anmelden'}
            </button>
            {message && <p className="mt-2 text-sm text-center w-full">{message}</p>}
        </form>
    );
};

export default Newsletter;
