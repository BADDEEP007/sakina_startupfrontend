import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      ".ngrok-free.dev",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Proxy API calls to the Express backend in development.
    // This avoids CORS issues — the browser sees everything on the same origin.
    proxy: {
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/cart": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/orders": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/sellers": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/reviews": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/addresses": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
});
