import { defineConfig } from 'vite';
import * as path from "node:path";
import react from '@vitejs/plugin-react';
import checker from "vite-plugin-checker";

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
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
