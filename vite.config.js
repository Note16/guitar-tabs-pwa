import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sw: resolve(__dirname, "src/service-worker.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "sw" ? "sw.js" : "assets/[name]-[hash].js";
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});
