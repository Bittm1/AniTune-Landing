// src/components/Parallax/config.js

// Desktop-Konfiguration (mit aktualisierten Titeln)
export const desktopConfig = {
    background: {
        startScale: 4.0,
        endScale: 1.0,
        spring: {
            mass: 0.8,
            tension: 120,
            friction: 26,
            clamp: true
        }
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
        spring: {
            mass: 0.8,
            tension: 120,
            friction: 26,
            clamp: true
        }
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
            mass: 0.8,
            tension: 100,
            friction: 24,
            clamp: true
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
            mass: 0.8,
            tension: 100,
            friction: 24,
            clamp: true
        }
    },
    titles: [
        {
            id: 'title-1',
            text: 'Von Uns Ist Für Uns',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-2',
            text: 'Der Weg',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-3',
            text: 'Ist Das Ziel',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-4',
            text: 'Die Community',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-5',
            text: 'Heißt',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-6',
            text: 'AniTune',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        }
    ],
};

// Vollständige Mobile-Konfiguration (ebenfalls mit aktualisierten Titeln)
export const mobileConfig = {
    background: {
        startScale: 3.0,
        endScale: 1.0,
        spring: {
            mass: 0.5,
            tension: 200,
            friction: 20,
            clamp: true
        }
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
        spring: {
            mass: 0.5,
            tension: 200,
            friction: 20,
            clamp: true
        }
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
            mass: 0.5,
            tension: 180,
            friction: 22,
            clamp: true
        }
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
            mass: 0.5,
            tension: 180,
            friction: 22,
            clamp: true
        }
    },
    titles: [
        {
            id: 'title-1',
            text: 'Von Uns Ist Für Uns',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-2',
            text: 'Der Weg',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-3',
            text: 'Ist Das Ziel',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-4',
            text: 'Die Community',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-5',
            text: 'Heißt',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        },
        {
            id: 'title-6',
            text: 'AniTune',
            position: {
                top: '60%',
                left: '50%'
            },
            style: {
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 0 10px rgba(0,0,0,0.7)',
                fontFamily: 'Lobster, cursive'
            },
            animation: {
                inDuration: 0.2,
                outDuration: 0.2,
                type: 'fade-scale'
            }
        }
    ]
};

// Verbesserte Funktion zur Auswahl der Konfiguration mit mehreren Breakpoints
export const getConfig = () => {
    const width = window.innerWidth;

    // Sehr klein (Smartphones)
    if (width < 480) {
        return {
            ...mobileConfig,
            logo: {
                ...mobileConfig.logo,
                size: '120px'
            }
        };
    }
    // Klein (große Smartphones / kleine Tablets)
    else if (width < 768) {
        return mobileConfig;
    }
    // Mittel (Tablets)
    else if (width < 1024) {
        return {
            ...desktopConfig,
            logo: {
                ...desktopConfig.logo,
                size: '180px'
            }
        };
    }
    // Standard (Desktop)
    else {
        return desktopConfig;
    }
};