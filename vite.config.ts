import { defineConfig } from 'vite';
import * as path from "node:path";
import react from '@vitejs/plugin-react';
import checker from "vite-plugin-checker";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
      VitePWA({
        // Automatically registers the service worker
        registerType: 'autoUpdate',
        // Injects the manifest link into the head.
        injectRegister: 'auto',
        // Caches assets and resources used by the PWA
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        // Generates a manifest.json file
        manifest: {
          name: 'My Awesome App',
          short_name: 'MyApp',
          description: 'My Awesome App description',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'images/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'images/web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
          "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  }
});
