# Paronia - Ethereum 2.0 Gateway Landing Page

A single-page marketing site for **Paronia**, a cryptocurrency dashboard product
positioned as your gateway into the Ethereum 2.0 ecosystem. This is a **static
marketing page** (not the full application) featuring a dark, visually striking
design with live-style cryptocurrency price previews, market trend
visualizations, and a clear value proposition.

## Tech Stack

- **[Vite](https://vitejs.dev/)** — lightning-fast dev server and build tooling
- **[React](https://react.dev/)** — component-based UI
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling with a
  custom dark, gradient-rich theme

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
