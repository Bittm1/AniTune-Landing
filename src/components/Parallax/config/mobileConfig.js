// src/components/Parallax/config/mobileConfig.js
import { springs, createTitles } from './baseConfig';
import { zIndices } from './constants/index';

export const mobileConfig = {
    // Basiswerte für Mobile - vereinfachte Version der Desktop-Konfiguration
    background: {
        startScale: 3.0,
        endScale: 1.0,
        spring: springs.responsive,
        zIndex: zIndices.background
    },
    logo: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                scaleStart: 1.0,
                scaleEnd: 0.6
            }
        ],
        position: {
            top: '30%',
            left: '50%'
        },
        size: '140px',
        spring: springs.responsive,
        zIndex: zIndices.logo
    },
    leftCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -90,
                posEnd: -30
            },
        ],
        position: {
            bottom: '52%'
        },
        size: {
            width: '40vw',
            maxWidth: '300px'
        },
        spring: {
            ...springs.responsive,
            tension: 180,
            friction: 22
        },
        zIndex: zIndices.clouds
    },
    rightCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -90,
                posEnd: -30
            },
        ],
        position: {
            bottom: '52%'
        },
        size: {
            width: '35vw',
            maxWidth: '250px'
        },
        spring: {
            ...springs.responsive,
            tension: 180,
            friction: 22
        },
        zIndex: zIndices.clouds
    },
    forest: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 0.3,
                posStart: -50,
                posEnd: 0
            }
        ],
        zIndex: zIndices.forest,
        imageSrc: '/Parallax/Erster_Hintergrund.png'
    },
    titles: createTitles({
        fontSize: '1.8rem'
    })
};