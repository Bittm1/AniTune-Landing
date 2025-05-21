// src/components/Parallax/config/index.js
import { desktopConfig } from './desktopConfig';
import { mobileConfig } from './mobileConfig';
import { getResponsiveConfig } from './responsiveHelper';
import { zIndices } from './constants/index'; // Aktualisierter Import

// Exportiere die Basis-Konfigurationen
export { desktopConfig, mobileConfig, zIndices };

// Exportiere die Hilfsfunktion für responsive Anpassungen als Hauptfunktion
export const getConfig = getResponsiveConfig;