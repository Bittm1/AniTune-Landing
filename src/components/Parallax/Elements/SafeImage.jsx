// src/components/Parallax/Elements/SafeImage.jsx
import React, { useState, useEffect } from 'react';

const SafeImage = ({
    src,
    alt,
    style = {},
    fallbackSrc = '/Parallax/Logo.png',
    onLoad = () => { },
    onError = () => { },
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setLoading(true);
        setError(false);
    }, [src]);

    const handleError = () => {
        console.warn(`Failed to load image: ${src}`);
        setImgSrc(fallbackSrc);
        setError(true);
        setLoading(false);
        onError();
    };

    const handleLoad = () => {
        setLoading(false);
        onLoad();
    };

    return (
        <>
            {loading && (
                <div
                    style={{
                        ...style,
                        backgroundColor: 'rgba(200, 200, 200, 0.2)',
                    }}
                />
            )}
            <img
                src={imgSrc}
                alt={alt}
                style={{
                    ...style,
                    display: loading ? 'none' : 'block',
                }}
                onError={handleError}
                onLoad={handleLoad}
                {...props}
            />
        </>
    );
};

export default SafeImage;