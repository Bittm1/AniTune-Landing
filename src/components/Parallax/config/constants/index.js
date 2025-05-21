/**
 * Z-Index-Verwaltung - definiert die Rendering-Reihenfolge der Layer
 * Werte von hinten (0) nach vorne (höhere Werte) angeordnet
 */
export const zIndices = {
    background: 0,        // Himmel/Hintergrund (ganz hinten)
    stars: 1,             // Sternenhimmel
    forest: 2,            // Wald-Silhouette
    clouds: 3,            // Wolken
    logo: 10,             // Logo (über Landschaft)
    titles: 20,           // Titel-Texte
    newsletter: 30,       // Newsletter-Form
    scrollIndicator: 40,  // Scroll-Hinweis
    debug: 1000           // Debug-Elemente (immer ganz vorne)
};