import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      events: "events",
      path: "path-browserify",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      "bittorrent-dht": path.resolve(__dirname, "./src/lib/browser-stubs.ts"),
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
    target: "es2020",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          gun: ["gun"],
          webtorrent: ["webtorrent"],
        },
        format: "es",
      },
    },
    minify: "esbuild",
    sourcemap: mode === "development",
  },
}));