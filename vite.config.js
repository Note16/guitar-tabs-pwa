import { defineConfig } from "vite";
import { resolve } from "path";
import songs from "./mocks/songs.json";
import login from "./mocks/login.json";

// Keep a local copy to allow mutations during the dev session
let mockSongs = [...songs];
let mockLoginStatus = { ...login };

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
    proxy: {
      "/api/login": {
        target: "http://localhost:3000",
        bypass: async (req, res) => {
          if (!req.url.startsWith("/api/login")) return;
          res.setHeader("Content-Type", "application/json");

          const getBody = () =>
            new Promise((resolve) => {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", () => resolve(JSON.parse(body || "{}")));
            });

          if (req.method === "GET") {
            if (req.url.includes("logout")) {
              mockLoginStatus.status = "false";
              mockLoginStatus.user = "";
            }
            res.end(JSON.stringify(mockLoginStatus));
            return false;
          }

          if (req.method === "POST") {
            const data = await getBody();
            mockLoginStatus.status = "true";
            mockLoginStatus.user = data["username"];

            res.statusCode = 201;
            res.end(JSON.stringify(mockLoginStatus));
            return false;
          }
        },
      },
      "/api/songs": {
        target: "http://localhost:3000",
        bypass: async (req, res) => {
          if (!req.url.startsWith("/api/songs")) return;
          res.setHeader("Content-Type", "application/json");

          const getBody = () =>
            new Promise((resolve) => {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", () => resolve(JSON.parse(body || "{}")));
            });

          if (req.method === "GET") {
            res.end(JSON.stringify(mockSongs));
            return false;
          }

          if (req.method === "POST") {
            const data = await getBody();
            const newSong = {
              ...data,
              id: Date.now().toString(), // Generate a simple unique ID
            };
            mockSongs.push(newSong);
            res.statusCode = 201;
            res.end(JSON.stringify(newSong));
            return false;
          }

          if (req.method === "PUT") {
            const data = await getBody();
            const index = mockSongs.findIndex((s) => s.id === data.id);
            if (index !== -1) {
              mockSongs[index] = { ...mockSongs[index], ...data };
              res.end(JSON.stringify(mockSongs[index]));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "Song not found" }));
            }
            return false;
          }

          // --- DELETE ---
          if (req.method === "DELETE") {
            const data = await getBody();
            mockSongs = mockSongs.filter((s) => s.id !== data.id);
            res.statusCode = 204;
            res.end();
            return false;
          }
        },
      },
    },
  },
});
