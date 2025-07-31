// src/pages/ConfirmEmail.jsx - AKTUALISIERT OHNE BUTTON
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './ConfirmEmail.css';

const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();

    // Parameter aus URL lesen
    const email = searchParams.get('email');

    return (
        <div className="confirm-email-page">
            <div className="confirm-container">
                {/* Hauptinhalt */}
                <h1>✅ E-Mail bestätigt!</h1>

                {email && (
                    <p className="email-info">
                        <strong>{email}</strong> wurde erfolgreich bestätigt.
                    </p>
                )}

                {/* Info */}
                <div className="close-info">
                    <p>Du kannst diese Seite jetzt schließen.</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;