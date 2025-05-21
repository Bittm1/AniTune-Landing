// src/components/Parallax/config/desktopConfig.js
import { springs, createTitles } from './baseConfig';

export const desktopConfig = {
    background: {
        startScale: 4.0,
        endScale: 1.0,
        spring: springs.smooth
    },
    logo: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                scaleStart: 1.2,
                scaleEnd: 0.8
            }
        ],
        position: {
            top: '33%',
            left: '50%'
        },
        size: '200px',
        spring: springs.smooth
    },
    leftCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0
            },
        ],
        position: {
            bottom: '56%'
        },
        size: {
            width: '30vw',
            maxWidth: '500px'
        },
        spring: {
            ...springs.smooth,
            tension: 100,
            friction: 24
        }
    },
    rightCloud: {
        segments: [
            {
                scrollStart: 0,
                scrollEnd: 1,
                posStart: -60,
                posEnd: 0
            },
        ],
        position: {
            bottom: '56%'
        },
        size: {
            width: '25vw',
            maxWidth: '400px'
        },
        spring: {
            ...springs.smooth,
            tension: 100,
            friction: 24
        }
    },
    // Generiere Titel mit der Hilfsfunktion
    titles: createTitles({
        fontSize: '2.5rem'
    })
};