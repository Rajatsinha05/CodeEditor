import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Automatically opens the report in the browser
      filename: 'stats.html', // Output file for the report
      gzipSize: true, // Include gzip size in the report
      brotliSize: true, // Include Brotli size in the report
    }),
  ],
});
