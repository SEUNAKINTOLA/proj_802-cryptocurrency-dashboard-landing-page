import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// The `base` path matches the GitHub Pages repository name so that asset URLs
// resolve correctly when the site is served from a project subpath.
export default defineConfig({
  base: '/proj_802-cryptocurrency-dashboard-landing-page/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // Disable source maps in production to shrink the deployed footprint.
    sourcemap: false,
    // Aggressive minification with Terser for the smallest possible bundles.
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    // Split CSS per async chunk so lazy sections only load their own styles.
    cssCodeSplit: true,
    // Inline assets smaller than 4 KB as base64 to save extra requests.
    assetsInlineLimit: 4096,
    // Warn earlier so we notice bundles creeping past our performance budget.
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Keep the React runtime in a long-lived vendor chunk that browsers
        // can cache across deploys independently of our app code.
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
