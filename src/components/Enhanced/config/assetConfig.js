// src/components/Enhanced/config/assetConfig.js
// 🎯 ZENTRALE ASSET-KONFIGURATION für AniTune Enhanced SimplePage
// ✅ Responsive Assets: Mobile/Desktop/Large + Fallbacks

// ===== RESPONSIVE BREAKPOINTS =====
export const ASSET_BREAKPOINTS = {
    mobile: { max: 767 },
    desktop: { min: 768, max: 1439 },
    large: { min: 1440 }
};

// ===== IMAGE ASSETS =====
export const IMAGE_ASSETS = {
    // ===== BACKGROUND LAYER =====
    background: {
        mobile: '/Parallax/mobile/Himmel-800w.webp',
        desktop: '/Parallax/Himmel.webp',
        large: '/Parallax/1920/Himmel_large.webp',
        fallback: '/Parallax/Logo.png',
        alt: 'AniTune Hintergrund Himmel'
    },

    // ===== LOGO LAYER =====
    logo: {
        mobile: '/Parallax/mobile/Logo-120px.svg',
        desktop: '/Parallax/Logo.svg',
        large: '/Parallax/4k/Logo-400px.svg',
        fallback: '/Parallax/Logo.png',
        alt: 'AniTune Logo'
    },

    // ===== PARALLAX ELEMENTS =====
    berge: {
        mobile: '/Parallax/mobile/Berg-600w.webp',
        desktop: '/Parallax/Berg.webp',
        large: '/Parallax/1920/Berg.webp',
        fallback: '/Parallax/Berg.jpg',
        alt: 'Berge im Hintergrund'
    },

    tal: {
        mobile: '/Parallax/mobile/Tal-600w.webp',
        desktop: '/Parallax/Tal.webp',
        large: '/Parallax/1920/Tal.webp',
        fallback: '/Parallax/Tal.jpg',
        alt: 'Tal-Landschaft'
    },

    waldHinten: {
        mobile: '/Parallax/mobile/WaldHinten-600w.webp',
        desktop: '/Parallax/WaldHinten.webp',
        large: '/Parallax/1920/WaldHinten.webp',
        fallback: '/Parallax/WaldHinten.jpg',
        alt: 'Wald im Hintergrund'
    },

    forest: {
        mobile: '/Parallax/mobile/Forest-600w.webp',
        desktop: '/Parallax/Forest.webp',
        large: '/Parallax/1920/Wald.webp',
        fallback: '/Parallax/Forest.jpg',
        alt: 'Wald-Szene'
    },

    road: {
        mobile: '/Parallax/mobile/Road-600w.webp',
        desktop: '/Parallax/Road.webp',
        large: '/Parallax/1920/Weg.webp',
        fallback: '/Parallax/Road.jpg',
        alt: 'Straße durch die Landschaft'
    },

    dog: {
        mobile: '/Parallax/mobile/Dog-200w.webp',
        desktop: '/Parallax/Dog.webp',
        large: '/Parallax/4k/Dog-800w.webp',
        fallback: '/Parallax/Dog.jpg',
        alt: 'Hund auf der Straße'
    },

    menge: {
        mobile: '/Parallax/mobile/Menge-800w.webp',
        desktop: '/Parallax/Menge.webp',
        large: '/Parallax/4k/Menge-4k.webp',
        fallback: '/Parallax/Menge.jpg',
        alt: 'Menschenmenge'
    },

    // ===== CLOUD ELEMENTS =====
    leftCloud: {
        mobile: '/Parallax/mobile/CloudLeft-400w.webp',
        desktop: '/Parallax/CloudLeft.webp',
        large: '/Parallax/4k/CloudLeft-2k.webp',
        fallback: '/Parallax/CloudLeft.png',
        alt: 'Wolke links'
    },

    rightCloud: {
        mobile: '/Parallax/mobile/CloudRight-400w.webp',
        desktop: '/Parallax/CloudRight.webp',
        large: '/Parallax/4k/CloudRight-2k.webp',
        fallback: '/Parallax/CloudRight.png',
        alt: 'Wolke rechts'
    },

    leftCloudHinten: {
        mobile: '/Parallax/mobile/CloudLeftBack-400w.webp',
        desktop: '/Parallax/CloudLeftBack.webp',
        large: '/Parallax/4k/CloudLeftBack-2k.webp',
        fallback: '/Parallax/CloudLeftBack.png',
        alt: 'Hintergrund-Wolke links'
    },

    rightCloudHinten: {
        mobile: '/Parallax/mobile/CloudRightBack-400w.webp',
        desktop: '/Parallax/CloudRightBack.webp',
        large: '/Parallax/4k/CloudRightBack-2k.webp',
        fallback: '/Parallax/CloudRightBack.png',
        alt: 'Hintergrund-Wolke rechts'
    }
};

// ===== AUDIO ASSETS =====
export const AUDIO_ASSETS = {
    // ===== TITEL-AUDIOS =====
    titles: [
        {
            id: 'audio-1',
            snapPoint: 1,
            title: 'Von Uns Heißt Für Uns',
            fileName: 'von-uns-heißt-fuer-uns.mp3',
            mobile: '/audio/mobile/von-uns-heißt-fuer-uns-96k.mp3',
            desktop: '/audio/von-uns-heißt-fuer-uns.mp3',
            large: '/audio/hq/von-uns-heißt-fuer-uns-320k.mp3',
            fallback: '/audio/von-uns-heißt-fuer-uns.mp3'
        },
        {
            id: 'audio-2',
            snapPoint: 2,
            title: 'Der Weg Ist Das Ziel',
            fileName: 'der-weg-ist-das-ziel.mp3',
            mobile: '/audio/mobile/der-weg-ist-das-ziel-96k.mp3',
            desktop: '/audio/der-weg-ist-das-ziel.mp3',
            large: '/audio/hq/der-weg-ist-das-ziel-320k.mp3',
            fallback: '/audio/der-weg-ist-das-ziel.mp3'
        },
        {
            id: 'audio-3',
            snapPoint: 3,
            title: 'Die Community Heißt',
            fileName: 'die-community-heißt.mp3',
            mobile: '/audio/mobile/die-community-heißt-96k.mp3',
            desktop: '/audio/die-community-heißt.mp3',
            large: '/audio/hq/die-community-heißt-320k.mp3',
            fallback: '/audio/die-community-heißt.mp3'
        }
    ],

    // ===== HINTERGRUNDMUSIK =====
    background: {
        id: 'background-music',
        title: 'Untermalung',
        fileName: 'untermalung.mp3',
        mobile: '/audio/mobile/untermalung-96k.mp3',
        desktop: '/audio/untermalung.mp3',
        large: '/audio/hq/untermalung-320k.mp3',
        fallback: '/audio/untermalung.mp3'
    },

    // ===== THEME MUSIC =====
    theme: {
        id: 'theme-music',
        title: 'AniTune Theme',
        fileName: 'anitune-theme.mp3',
        mobile: '/audio/mobile/anitune-theme-96k.mp3',
        desktop: '/audio/anitune-theme.mp3',
        large: '/audio/hq/anitune-theme-320k.mp3',
        fallback: '/audio/anitune-theme.mp3'
    }
};

// ===== DEVICE DETECTION =====
export function getDeviceType() {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    const isTouchDevice = 'ontouchstart' in window;

    if (width <= ASSET_BREAKPOINTS.mobile.max && isTouchDevice) {
        return 'mobile';
    } else if (width >= ASSET_BREAKPOINTS.large.min) {
        return 'large';
    } else {
        return 'desktop';
    }
}

// ===== ASSET SELECTION HELPERS =====

/**
 * Wählt den passenden Asset-Pfad basierend auf Device-Type
 * @param {Object} assetConfig - Asset-Konfiguration (z.B. IMAGE_ASSETS.background)
 * @param {string} deviceType - 'mobile' | 'desktop' | 'large'
 * @returns {string} - Asset-Pfad
 */
export function getAssetPath(assetConfig, deviceType = null) {
    if (!assetConfig) {
        console.warn('assetConfig: No asset configuration provided');
        return '';
    }

    const device = deviceType || getDeviceType();

    // Versuche device-spezifischen Pfad
    if (assetConfig[device]) {
        return assetConfig[device];
    }

    // Fallback-Kette: large -> desktop -> mobile -> fallback
    const fallbackChain = ['large', 'desktop', 'mobile', 'fallback'];

    for (const fallbackDevice of fallbackChain) {
        if (assetConfig[fallbackDevice]) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 Asset Fallback: ${device} -> ${fallbackDevice} for asset`);
            }
            return assetConfig[fallbackDevice];
        }
    }

    console.warn('assetConfig: No valid asset path found', assetConfig);
    return '';
}

/**
 * Holt Image-Asset mit Alt-Text
 * @param {string} imageName - Name aus IMAGE_ASSETS
 * @param {string} deviceType - Optional: Device-Type
 * @returns {Object} - { src, alt, fallback }
 */
export function getImageAsset(imageName, deviceType = null) {
    const imageConfig = IMAGE_ASSETS[imageName];

    if (!imageConfig) {
        console.warn(`assetConfig: Image "${imageName}" not found`);
        return { src: '', alt: '', fallback: '' };
    }

    return {
        src: getAssetPath(imageConfig, deviceType),
        alt: imageConfig.alt || '',
        fallback: imageConfig.fallback || ''
    };
}

/**
 * Holt Audio-Asset 
 * @param {string} audioType - 'titles' | 'background' | 'theme'
 * @param {number} snapPoint - Für titles: snapPoint (1-3)
 * @param {string} deviceType - Optional: Device-Type
 * @returns {Object} - Audio-Konfiguration mit Pfad
 */
export function getAudioAsset(audioType, snapPoint = null, deviceType = null) {
    let audioConfig;

    if (audioType === 'titles' && snapPoint) {
        audioConfig = AUDIO_ASSETS.titles.find(audio => audio.snapPoint === snapPoint);
    } else {
        audioConfig = AUDIO_ASSETS[audioType];
    }

    if (!audioConfig) {
        console.warn(`assetConfig: Audio "${audioType}" not found`);
        return null;
    }

    return {
        ...audioConfig,
        path: getAssetPath(audioConfig, deviceType)
    };
}

// ===== PRELOADING HELPERS =====

/**
 * Generiert Preload-Liste für kritische Assets
 * @param {string} deviceType - Device-Type
 * @returns {Array} - Array von Asset-URLs zum Preloaden
 */
export function getCriticalAssets(deviceType = null) {
    const device = deviceType || getDeviceType();

    const criticalAssets = [
        // Sofort sichtbare Assets
        getAssetPath(IMAGE_ASSETS.background, device),
        getAssetPath(IMAGE_ASSETS.logo, device),

        // Erstes Audio
        getAssetPath(AUDIO_ASSETS.titles[0], device),
        getAssetPath(AUDIO_ASSETS.background, device)
    ];

    return criticalAssets.filter(asset => asset); // Leere entfernen
}

/**
 * Generiert alle Asset-URLs für einen Snap-Point
 * @param {number} snapPoint - Snap-Point (0-6)
 * @param {string} deviceType - Device-Type
 * @returns {Array} - Asset-URLs für diesen Snap-Point
 */
export function getSnapPointAssets(snapPoint, deviceType = null) {
    const device = deviceType || getDeviceType();
    const assets = [];

    // Immer: Background
    assets.push(getAssetPath(IMAGE_ASSETS.background, device));

    // Snap-Point spezifische Assets
    switch (snapPoint) {
        case 0:
            assets.push(getAssetPath(IMAGE_ASSETS.logo, device));
            break;
        case 1:
            assets.push(getAssetPath(IMAGE_ASSETS.road, device));
            assets.push(getAssetPath(IMAGE_ASSETS.dog, device));
            break;
        case 2:
            assets.push(getAssetPath(IMAGE_ASSETS.forest, device));
            break;
        case 3:
            assets.push(getAssetPath(IMAGE_ASSETS.tal, device));
            assets.push(getAssetPath(IMAGE_ASSETS.waldHinten, device));
            break;
        case 4:
            assets.push(getAssetPath(IMAGE_ASSETS.berge, device));
            assets.push(getAssetPath(IMAGE_ASSETS.leftCloud, device));
            assets.push(getAssetPath(IMAGE_ASSETS.rightCloud, device));
            break;
        case 6:
            assets.push(getAssetPath(IMAGE_ASSETS.menge, device));
            break;
    }

    return assets.filter(asset => asset);
}

// ===== ENVIRONMENT SUPPORT =====
export const ENVIRONMENT_ASSETS = {
    development: {
        baseUrl: '',
        cacheBusting: false
    },
    staging: {
        baseUrl: 'https://staging-assets.anitune.com',
        cacheBusting: true
    },
    production: {
        baseUrl: 'https://assets.anitune.com',
        cacheBusting: true
    }
};

/**
 * Wendet Environment-spezifische Asset-Transformationen an
 * @param {string} assetPath - Asset-Pfad
 * @returns {string} - Transformierter Pfad
 */
export function getEnvironmentAssetPath(assetPath) {
    const env = process.env.NODE_ENV || 'development';
    const envConfig = ENVIRONMENT_ASSETS[env] || ENVIRONMENT_ASSETS.development;

    let finalPath = assetPath;

    // Base URL hinzufügen
    if (envConfig.baseUrl) {
        finalPath = envConfig.baseUrl + assetPath;
    }

    // Cache Busting
    if (envConfig.cacheBusting) {
        const timestamp = Date.now();
        finalPath += `?v=${timestamp}`;
    }

    return finalPath;
}

// ===== DEBUG & VALIDATION =====

/**
 * Validiert alle Asset-Konfigurationen
 * @returns {Object} - Validation Report
 */
export function validateAssets() {
    const report = {
        valid: true,
        errors: [],
        warnings: [],
        stats: {}
    };

    // Prüfe Image Assets
    Object.keys(IMAGE_ASSETS).forEach(imageName => {
        const config = IMAGE_ASSETS[imageName];
        if (!config.desktop && !config.fallback) {
            report.errors.push(`Image "${imageName}" missing desktop and fallback`);
            report.valid = false;
        }
        if (!config.alt) {
            report.warnings.push(`Image "${imageName}" missing alt text`);
        }
    });

    // Prüfe Audio Assets
    if (!AUDIO_ASSETS.titles || AUDIO_ASSETS.titles.length !== 3) {
        report.errors.push('Expected exactly 3 title audios');
        report.valid = false;
    }

    // Stats
    report.stats = {
        totalImages: Object.keys(IMAGE_ASSETS).length,
        totalAudios: AUDIO_ASSETS.titles.length + 2, // +2 für background + theme
        deviceTypes: ['mobile', 'desktop', 'large'].length
    };

    return report;
}

// ===== DEVELOPMENT DEBUG =====
if (process.env.NODE_ENV === 'development') {
    const validation = validateAssets();

    console.log('🎯 ZENTRALE ASSET-KONFIGURATION GELADEN:');
    console.log('📊 Stats:', validation.stats);
    console.log('🖥️ Device Type:', getDeviceType());
    console.log('🔍 Validation:', validation.valid ? '✅ Valid' : '❌ Errors found');

    if (validation.errors.length > 0) {
        console.error('❌ Asset Errors:', validation.errors);
    }

    if (validation.warnings.length > 0) {
        console.warn('⚠️ Asset Warnings:', validation.warnings);
    }

    // Zeige kritische Assets
    console.log('🚀 Critical Assets:', getCriticalAssets());
}

// ===== EXPORTS =====
export default {
    IMAGE_ASSETS,
    AUDIO_ASSETS,
    ASSET_BREAKPOINTS,
    getDeviceType,
    getAssetPath,
    getImageAsset,
    getAudioAsset,
    getCriticalAssets,
    getSnapPointAssets,
    validateAssets
};