// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Du kannst diese Fallback-UI nach Bedarf anpassen
            return this.props.fallback || (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h3>Etwas ist schief gelaufen.</h3>
                    <p>Die Komponente konnte nicht geladen werden.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;