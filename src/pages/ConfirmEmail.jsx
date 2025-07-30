// src/pages/ConfirmEmail.jsx - EINFACHE BESTÄTIGUNGSSEITE
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ConfirmEmail.css';

const ConfirmEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Parameter aus URL lesen
    const email = searchParams.get('email');

    const handleGoHome = () => {
        navigate('/');
    };

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

                <p>Du erhältst ab sofort unsere Newsletter mit Updates zu AniTune.</p>

                {/* Button */}
                <button
                    onClick={handleGoHome}
                    className="btn-primary"
                >
                    Zurück zu AniTune
                </button>

                {/* Info */}
                <div className="close-info">
                    <p>Du kannst diese Seite jetzt schließen.</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;