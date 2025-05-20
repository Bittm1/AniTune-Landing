export default {
  server: {
    hmr: { overlay: false }, // Deaktiviert Overlay für bessere Performance
    watch: {
      usePolling: false,
      interval: 1000,
    },
  },
  optimizeDeps: {
    force: true // Zwingt Vite, alle Abhängigkeiten zu optimieren
  }
}