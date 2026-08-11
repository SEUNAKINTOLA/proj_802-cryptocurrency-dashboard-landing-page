# Paronia - Ethereum 2.0 Gateway Landing Page

A single-page marketing site for **Paronia**, a cryptocurrency dashboard product
positioned as your gateway into the Ethereum 2.0 ecosystem. This is a **static
marketing page** (not the full application) featuring a dark, visually striking
design with live-style cryptocurrency price previews, market trend
visualizations, and a clear value proposition.

## Tech Stack

- **[Vite](https://vitejs.dev/)** — lightning-fast dev server and build tooling
- **[React](https://react.dev/)** — component-based UI with `React.lazy` /
  `Suspense` code splitting
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling with a
  custom dark, gradient-rich theme

### Performance Tooling

- **[Terser](https://terser.org/)** — aggressive JS minification (console/debugger
  stripping, multi-pass compression) via Vite's `build.minify`
- **Rollup manual chunks** — a long-lived `vendor` chunk isolates the React
  runtime for better browser caching across deploys
- **PostCSS + Autoprefixer** — vendor-prefixed, optimized CSS output

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (bundled with Node.js)

### Setup

Install dependencies:

```bash
npm install
```

Start the development server (defaults to http://localhost:5173):

```bash
npm run dev
```

## Available Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reload |
| `npm run build`   | Produce an optimized production build in `dist/`  |
| `npm run preview` | Preview the production build locally              |
| `npm run lint`    | Lint the project with ESLint                      |

## Performance Optimizations

This landing page is tuned for a fast, production-grade first load:

- **Lazy loading** — below-the-fold sections (`MarketTrendTable`,
  `QuickTransferPreview`, `Footer`) are loaded on demand with `React.lazy` and
  `Suspense`, each showing an `animate-pulse` skeleton fallback while its chunk
  streams in. `HeroSection` and `CryptoCarousel` stay eager as they render above
  the fold.
- **Code splitting** — Rollup emits a separate long-lived `vendor` chunk
  (`react`, `react-dom`) plus per-section async chunks, so returning visitors
  re-download only what changed.
- **Bundle optimization** — Terser minification with `drop_console`,
  `drop_debugger`, and a 2-pass compress; source maps are disabled in
  production; `chunkSizeWarningLimit` is set to 500 KB as a budget signal.
- **Image optimization** — the hero illustration uses `loading="lazy"`,
  `decoding="async"`, explicit `width`/`height` to avoid layout shift, and a
  gradient placeholder while it loads.
- **Resource hints** — `dns-prefetch` / `preconnect` for the CoinGecko API and
  Unsplash origins warm up connections before the app requests data.
- **Asset inlining** — assets under 4 KB are inlined as base64
  (`assetsInlineLimit: 4096`) to save extra round trips.

### Performance Targets

| Metric                          | Target        |
| ------------------------------- | ------------- |
| Lighthouse Performance          | ≥ 90          |
| Lighthouse Accessibility        | ≥ 90          |
| Largest Contentful Paint (LCP)  | < 2.5 s       |
| Cumulative Layout Shift (CLS)   | < 0.1         |
| Initial JS (gzipped, app chunk) | < 100 KB      |
| Total page weight               | < 3 MB        |

## Production Build

Produce the optimized bundle:

```bash
npm run build
```

Expected output (written to `dist/`):

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css      # split, minified styles
│   ├── index-[hash].js       # app entry
│   └── vendor-[hash].js      # cached React runtime chunk
```

Preview the built site locally before deploying:

```bash
npm run preview
```

## Deployment (GitHub Pages)

The build is configured for GitHub Pages via the `base` path in
`vite.config.js` and the `homepage` field in `package.json`.

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Publish the contents of the `dist/` directory to the `gh-pages` branch (for
   example with the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package
   or a GitHub Actions workflow).

3. Ensure the repository's Pages settings point at the published branch.

If you deploy under a different repository name, update the `base` value in
`vite.config.js` and the `homepage` field in `package.json` to match.

### Deployment Verification

After publishing, confirm the deployment is healthy:

1. Open `https://<username>.github.io/proj_802-cryptocurrency-dashboard-landing-page/`.
2. Verify assets load (no 404s in the Network tab) — a broken `base` path is the
   most common cause of missing CSS/JS.
3. Scroll through the page and confirm the lazy sections resolve without errors.
4. Run Lighthouse (Chrome DevTools) and compare against the targets above.

### Troubleshooting

| Symptom                                   | Likely cause / fix                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Blank page, 404s for `/assets/*`          | `base` in `vite.config.js` does not match the repo name — update and rebuild.       |
| `terser not found` during `npm run build` | Terser is required for `minify: 'terser'`; install it: `npm install -D terser`.     |
| Lazy section shows the error fallback     | A chunk failed to load — check the console; a hard refresh usually recovers it.      |
| Live prices show a timeout/error message  | CoinGecko rate limit or network issue; the fetch retries with backoff and recovers. |

## Project Structure

```
.
├── index.html            # Vite entry HTML
├── package.json          # Scripts and dependencies
├── vite.config.js        # Vite + React + GitHub Pages config
├── tailwind.config.js    # Tailwind theme (dark, brand colors)
├── postcss.config.js     # Tailwind + Autoprefixer
├── .eslintrc.cjs         # ESLint configuration
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Root application component
    └── index.css         # Global styles + Tailwind directives
```

## License

Proprietary — all rights reserved.
