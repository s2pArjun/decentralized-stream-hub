import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Node.js polyfills for WebTorrent
      events: "events",
      path: "path-browserify",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
    "process.browser": true,
    "process.version": JSON.stringify(""),
  },
  optimizeDeps: {
    include: ["buffer", "events", "gun", "webtorrent"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          gun: ["gun"],
          webtorrent: ["webtorrent"],
        },
      },
    },
  },
}));
