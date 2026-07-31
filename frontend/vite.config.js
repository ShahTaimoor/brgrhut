import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      filename: 'manifest.webmanifest',
      strategies: 'generateSW',
      injectRegister: 'auto',
      includeAssets: ["robots.txt", "favicon-32.png", "favicon-192.png", "apple-touch-icon.png"],
      workbox: {
        // Don't cache index.html - exclude it from precaching
        globPatterns: ['**/*.{js,css,ico,png,svg,webmanifest,woff,woff2}'],
        // Exclude index.html from precaching - this ensures it's always fetched fresh
        navigateFallback: null,
        // Use network-first strategy for navigation requests (index.html)
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 0, // Don't cache HTML pages
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
        // Skip waiting and claim clients immediately on update
        skipWaiting: true,
        clientsClaim: true,
        // Clean up outdated caches
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "brgrhut",
        short_name: "brgrhut",
        start_url: "/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#EA580C",
        icons: [
          {
            src: "favicon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "favicon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      devOptions: {
        enabled: false,
        type: 'module',
      },
    })

  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Dev-only: lets `npm run dev` be reachable through an ngrok tunnel for
    // demos. A leading "." matches any subdomain, so this covers a fresh
    // random ngrok URL every time without needing to update this file.
    // Doesn't affect the production build - this only applies to the dev server.
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev'],
    // Proxies API calls to the local backend so a remote demo viewer's
    // browser only ever talks to the one tunneled origin (the ngrok URL) -
    // same-origin, so no CORS and no HTTPS-page-calling-plain-HTTP mixed
    // content issue. The proxy forwards to the real backend server-side,
    // where none of that browser-security machinery applies.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    sourcemap: false
  }
});
