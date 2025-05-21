// src/components/Parallax/config/index.js
import { desktopConfig } from './desktopConfig';
import { mobileConfig } from './mobileConfig';
import { getResponsiveConfig } from './responsiveHelper';

// Exportiere die Basis-Konfigurationen
export { desktopConfig, mobileConfig };

// Exportiere die Hilfsfunktion für responsive Anpassungen als Hauptfunktion
export const getConfig = getResponsiveConfig;