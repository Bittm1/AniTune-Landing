// src/components/Parallax/Elements/NewsletterLayer.jsx
import React from 'react';
import Newsletter from '../../Newsletter/Newsletter';
import FadeComponent from '../utils/FadeComponent';

const NewsletterLayer = ({ scrollProgress = 0 }) => {
    return (
        <FadeComponent
            scrollProgress={scrollProgress}
            threshold={0.1}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: '500px',
                zIndex: 10,
            }}
        >
            <Newsletter />
        </FadeComponent>
    );
};

export default NewsletterLayer;