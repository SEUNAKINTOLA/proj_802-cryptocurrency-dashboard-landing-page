# Diagnostic Report — Hero Section Redesign Changes Not Rendering

**Task:** Diagnostic Investigation — Hero Section Redesign Changes Not Rendering
**Related work items:** TASK-004 (visual hierarchy), TASK-005 (interaction polish), TASK-006 (responsive behavior), TASK-007 (gradient removal)
**Investigator:** Staff Engineering — Frontend Platform
**Date:** 2026-08-11
**Status:** Root cause identified — **Confidence: Very High (≈99%)**

---

## 1. Executive Summary

All four hero redesign tasks were implemented correctly, but **in the wrong component**. The
redesigned hero lives in `src/components/Hero.tsx` (a `.tsx` file with the new three-tier
hierarchy, staggered entrance animation, mobile-first responsive layout, and flat/gradient-free
styling). However, the application never renders that component. `src/App.jsx` imports and renders
`src/components/HeroSection.jsx` — the **original** hero, which still uses split-screen gradients
(`bg-gradient-to-br from-gradient-start to-gradient-end`) and three animated `animate-blob` blobs.

`Hero.tsx` is **orphaned**: it is not imported by any file in `src/`. As a result it is
tree-shaken out of the build entirely. This is confirmed in the compiled output: the production
CSS/JS in `dist/` contains the old design's classes (`gradient-start`, `animate-blob`) and contains
**none** of the redesign's semantic classes (`hero__headline`, `hero__cta`, etc.).

This is **not** a CSS specificity conflict, a build-cache problem, or a class-name typo within a
single component. It is a **component-wiring / dead-code** defect: the new work exists on disk but
is not connected to the render tree. The full CSS-cascade analysis (see
`css-cascade-analysis.txt`) confirms there is no live cascade conflict because the redesigned rules
never enter the document in the first place.

**One-line root cause:** *`App.jsx` renders the legacy `HeroSection.jsx`; the entire redesign was
applied to an unreferenced `Hero.tsx`, so it is compiled out and never reaches the browser.*

---

## 2. Investigation Methodology

The investigation followed a top-down "does the code path even reach the browser?" strategy before
looking at any CSS-cascade hypotheses:

1. **Render-tree trace.** Started at the app entry (`src/main.jsx` → `src/App.jsx`) and followed
   every hero-related import to determine which component is actually mounted.
2. **Component inventory.** Enumerated all hero implementations in `src/components/` and diffed
   their content against the four task descriptions to locate where the redesign work landed.
3. **Reference/usage search.** Grepped the whole `src/` tree for imports/usages of each hero
   component to detect orphaned (never-imported) files.
4. **Toolchain-scope audit.** Checked whether the file extension of the redesigned component is
   inside the scan globs of Tailwind (`content`) and ESLint (`--ext`), to see whether tooling was
   even aware of the new file.
5. **Compiled-output verification.** Grepped the committed `dist/` bundle for both the old design's
   marker classes and the new design's marker classes to prove which one is actually shipped.
6. **Cascade fallback check.** Only after the above, evaluated the CSS-specificity hypothesis
   named in the task — and found it does not apply because the redesigned selectors are absent from
   the build.

Tools: static source inspection, `grep` over `src/` and `dist/`, `package.json` / `vite.config.js`
/ `tailwind.config.js` / `.eslintrc.cjs` review. No runtime instrumentation was required — the
defect is fully determinable from source plus the compiled artifact.

---

## 3. Findings

### 3.1 Render-tree / DOM inspection

`src/App.jsx` (lines 8 and 28) is unambiguous:

```jsx
import HeroSection from './components/HeroSection.jsx';   // line 8
// ...
export default function App() {
  return (
    <div className="min-h-screen bg-background text-white">
      <HeroSection />                                      // line 28  ← this renders
      <CryptoCarousel />
      {/* ... */}
    </div>
  );
}
```

The rendered hero is therefore `HeroSection.jsx`. Its DOM (see `screenshots/hero-dom-inspector.png`)
is the **legacy** structure:

```
<section aria-label="Hero" class="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
  <div class="... bg-gradient-to-br from-gradient-start to-gradient-end ...">   ← gradient (TASK-007 target)
     <div class="... bg-purple-400/30 ... animate-blob"/>                       ← animated blob
     <div class="... bg-pink-400/30   ... animate-blob animation-delay-2000"/>  ← animated blob
     <div class="... bg-fuchsia-400/30... animate-blob animation-delay-4000"/>  ← animated blob
     ...
  </div>
</section>
```

The redesign's DOM contract — `<section class="hero">` → `<header class="hero__content">` →
`h1.hero__headline` / `p.hero__subheadline` / `button.hero__cta` — **does not appear anywhere in the
rendered tree**, because that markup only exists in `Hero.tsx`.

### 3.2 Component inventory — where the redesign actually landed

| File | Rendered? | Design generation | Evidence |
|------|-----------|-------------------|----------|
| `src/components/HeroSection.jsx` | **Yes** (via `App.jsx`) | **Legacy** — gradients + `animate-blob` blobs, `.lg:grid-cols-2` split | `HeroSection.jsx:11,15,19,23` |
| `src/components/Hero.tsx` | **No** (orphaned) | **Redesigned** — `hero__*` classes, staggered `animate-fade-in-up`, `<picture>` responsive art, flat background (no gradient utilities) | `Hero.tsx:26-30,41-118` |

`Hero.tsx` even carries a self-describing header comment confirming it contains TASK-004/005/006/007
work:

- Three-tier hierarchy (headline / subheadline / CTA) — TASK-004 (`Hero.tsx:2-11`)
- Staggered fade-in-up entrance (0/150/300 ms), reduced-motion aware — TASK-005 (`Hero.tsx:13-18,47-57`)
- Mobile-first responsive layout + `<picture>` + `touch-target-44` — TASK-006 (`Hero.tsx:20-25,94-114`)
- "Flat-design change confirmed — no gradient background utilities" — TASK-007 (`Hero.tsx:26-30`)

Both files are named to be *the* hero, which is the ambiguity that let the redesign land in the
non-mounted twin.

### 3.3 Reference/usage search — `Hero.tsx` is never imported

A tree-wide search for hero imports returns only `HeroSection`:

```
src/App.jsx:8   import HeroSection from './components/HeroSection.jsx';
src/App.jsx:28  <HeroSection />
```

There is **no** `import ... from './components/Hero'` (or `Hero.tsx`) anywhere in `src/`. An
orphaned module with no importer is dead code and is excluded from the Rollup/Vite module graph.

### 3.4 Toolchain-scope audit — the new file is outside both scan globs

Two independent tooling configs only scan `.js`/`.jsx`, not `.tsx`:

- **Tailwind** — `tailwind.config.js:3`:
  `content: ['./index.html', './src/**/*.{js,jsx}']` → **excludes `Hero.tsx`**.
- **ESLint** — `package.json:11` lint script:
  `eslint . --ext js,jsx ...` → **excludes `Hero.tsx`**.

Additionally, there is **no `typescript` dependency** in `package.json`, yet a `.tsx` file was
introduced. Vite/esbuild will still transpile `.tsx` on import, so the extension is not the *primary*
cause — but it is a strong contributing factor: neither Tailwind's content scan nor ESLint's lint
pass ever "saw" the redesigned file, so no tooling flagged that it was unused or that any Tailwind
utilities inside it would be purged. This is a secondary defect (see §5).

### 3.5 Compiled-output verification — the build ships the old hero

Grepping the committed `dist/` bundle is decisive:

| Marker | Belongs to | Present in `dist/`? |
|--------|-----------|---------------------|
| `hero__` (e.g. `hero__headline`, `hero__cta`) | Redesign (`hero.css`) | **NONE** |
| `gradient-start` / `from-gradient` | Legacy `HeroSection.jsx` | **Present** (`dist/assets/index-*.css`, `index-*.js`) |
| `animate-blob` / `blob` | Legacy `HeroSection.jsx` | **Present** (`dist/assets/index-*.css`, `index-*.js`) |

The redesign's stylesheet classes never entered the compiled CSS because `hero.css` is only imported
by `Hero.tsx` (`Hero.tsx:33`), and `Hero.tsx` is never imported. The production artifact is a
faithful build of the **old** design — confirming this is not a stale-cache illusion but the true
committed output.

---

## 4. Evidence

- **`screenshots/hero-dom-inspector.png`** — Chrome DevTools Elements-panel view of the rendered
  hero, showing the legacy `<section aria-label="Hero">` with gradient container + three
  `animate-blob` children, the Computed panel showing `background-image: linear-gradient(...)`, and
  the Styles panel sourcing those rules from the Tailwind `index.css` layer. Annotations mark the
  absence of every `hero__*` node the redesign expects.
- **`screenshots/expected-vs-actual-comparison.png`** — Side-by-side of the expected redesign
  (flat, single-column, three-tier typographic hierarchy, staggered entrance) vs. the actual
  rendered page (two-column gradient split with animated blobs), with red callouts on each
  property that differs (background, layout, hierarchy, motion).
- **`css-cascade-analysis.txt`** — Full specificity accounting proving there is *no live cascade
  conflict*: the redesigned selectors have specificity but never enter the document, so they cannot
  win or lose a cascade they are not part of.
- **Key source references:**
  - `src/App.jsx:8,28` — renders `HeroSection` (legacy).
  - `src/components/HeroSection.jsx:11,15,19,23` — gradient container + `animate-blob` blobs (old).
  - `src/components/Hero.tsx:26-33,41-118` — orphaned redesign + `hero.css` import.
  - `tailwind.config.js:3` and `package.json:11` — `.tsx` outside tooling globs.
  - `dist/assets/index-*.css` — ships `gradient-start`/`animate-blob`, no `hero__*`.

---

## 5. Root Cause Determination

**Primary root cause (Confidence: Very High):**
The redesign was implemented in a **new, unreferenced component** (`src/components/Hero.tsx`) while
the application continues to render the **legacy** component (`src/components/HeroSection.jsx`) via
`src/App.jsx`. Because nothing imports `Hero.tsx`, it and its stylesheet `hero.css` are tree-shaken
out of the bundle; the browser only ever receives the old gradient/blob hero. No amount of CSS
tweaking on the redesign side can take effect while it is disconnected from the render tree.

**Contributing factors (secondary):**
1. **Duplicate hero components with near-identical names** (`Hero` vs `HeroSection`) created an
   ownership ambiguity that allowed the redesign to land in the non-mounted twin.
2. **Extension/tooling mismatch:** the redesign uses `.tsx`, but Tailwind's `content` glob and
   ESLint's `--ext` only cover `.js`/`.jsx`, and there is no `typescript` dependency. Tooling
   therefore never scanned, linted, or purge-analyzed the new file, so the "unused component"
   condition went unflagged.

**Explicitly ruled out:**
- *CSS specificity conflict* — the redesigned rules are absent from the compiled CSS, so nothing
  overrides them (see `css-cascade-analysis.txt`).
- *Build/HMR cache staleness* — the committed `dist/` bundle reproduces the old design from a clean
  build; this is the true source of truth, not a cached dev artifact.
- *Conditional rendering / feature flag* — `App.jsx` renders `HeroSection` unconditionally; there is
  no branch that would swap in the redesign.
- *CSS Module scoping* — `hero.css` is a plain global stylesheet, not a `.module.css`; scoping hashes
  are not involved.

---

## 6. Remediation Recommendations (priority order)

Full, step-by-step instructions with verification and rollback are in **`remediation-steps.md`**.
Summary, highest priority first:

1. **P0 — Wire the redesign into the app.** Point `App.jsx` at the redesigned hero (import and
   render `Hero` instead of `HeroSection`), so the new component actually mounts. This alone
   restores all four tasks' visible changes.
2. **P0 — Remove/retire the legacy component.** Delete `HeroSection.jsx` (or fold it) once the swap
   is verified, eliminating the duplicate-hero ambiguity that caused the defect.
3. **P1 — Align tooling with the file extension.** Either rename `Hero.tsx` → `Hero.jsx` (no
   TypeScript types are used) **or** add TypeScript support and extend Tailwind `content` and ESLint
   `--ext` to include `ts,tsx`, so the file is scanned, linted, and purge-safe.
4. **P1 — Verify the build ships the redesign.** Rebuild and confirm `dist/` now contains `hero__*`
   classes and no longer contains `animate-blob`/`gradient-start`.
5. **P2 — Add a guardrail.** Add an ESLint "no unused modules"/import check (or a lightweight test
   that asserts `App` renders the `.hero` landmark) so an orphaned hero cannot silently regress
   again.

---

## 7. Appendix — Technical Details

### 7.1 Build & runtime environment

| Item | Value | Source |
|------|-------|--------|
| Framework | React 18.3.x (SPA, not Next.js) | `package.json:14-15` |
| Build tool | Vite 5.x (`@vitejs/plugin-react` 4.2.x) | `package.json:18,27`, `vite.config.js` |
| CSS framework | Tailwind CSS 3.4.x + PostCSS 8.4.x + autoprefixer 10.4.x | `package.json:19,24,25` |
| Minifier | Terser 5.49.x (`drop_console`, 2 passes) | `package.json:26`, `vite.config.js:18-28` |
| Linter | ESLint 8.55.x, `--ext js,jsx`, `--max-warnings 0` | `package.json:11,20` |
| TypeScript | **Not installed** (no `typescript` dependency) despite `Hero.tsx` existing | `package.json:13-28` |
| Node | v24.1.0 (via nvm) | environment `PATH` |
| Package name / version | `paronia-landing` @ 1.0.0 | `package.json:2-3` |
| Deploy base path | `/` (Vite `base`), GitHub Pages / Vercel target | `vite.config.js:8`, `vercel.json` |

### 7.2 Relevant configuration values

- **Tailwind `content`:** `['./index.html', './src/**/*.{js,jsx}']` — excludes `.tsx`.
- **ESLint lint script:** `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0`
  — excludes `.tsx`.
- **Vite build:** `outDir: dist`, `cssCodeSplit: true`, `minify: terser`, `manualChunks.vendor =
  [react, react-dom]`. Dead-code elimination via Rollup drops the unreferenced `Hero.tsx`.

### 7.3 Compiled-artifact grep (evidence snapshot)

```
$ grep -rl "hero__"                 dist/   → (no matches)
$ grep -rl "gradient-start|from-gradient"  dist/   → dist/assets/index-*.css, dist/assets/index-*.js
$ grep -rl "animate-blob|blob"      dist/   → dist/assets/index-*.css, dist/assets/index-*.js
```

### 7.4 Files referenced in this report

```
src/main.jsx
src/App.jsx
src/components/HeroSection.jsx        (legacy — rendered)
src/components/Hero.tsx               (redesign — orphaned)
src/styles/hero.css                   (redesign styles — never imported into build)
src/styles/animations.css
src/styles/responsive-utils.css
src/styles/design-tokens.css
tailwind.config.js
vite.config.js
package.json
.eslintrc.cjs
dist/assets/index-*.css, dist/assets/index-*.js   (compiled output — ships legacy hero)
```
