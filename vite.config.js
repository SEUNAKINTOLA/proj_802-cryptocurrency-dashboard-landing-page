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
    sourcemap: true,
  },
});
