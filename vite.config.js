import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      strategies: "generateSW",
      manifest: {
        name: "Guitar Tabs PWA",
        short_name: "Guitar Tabs",
        description: "A mobile-first PWA for reading guitar song tabs",
        start_url: "/",
        display: "standalone",
        background_color: "#f2f2f8",
        theme_color: "#4d6dfa",
        icons: [
          {
            src: "/icon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 3000,
  },
});
