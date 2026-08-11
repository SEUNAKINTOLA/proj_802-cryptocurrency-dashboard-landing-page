# Remediation Steps — Restore Hero Section Redesign

**Root cause (see `diagnostic-report.md`):** `src/App.jsx` renders the legacy
`src/components/HeroSection.jsx` (gradients + `animate-blob` blobs). The redesign
(TASK-004/005/006/007) was implemented in `src/components/Hero.tsx`, which is **never imported**, so
it is tree-shaken out of the build and never rendered.

**Fix strategy:** connect the redesigned component to the render tree, retire the duplicate, align
tooling with the file extension, and add a guardrail so it cannot silently regress.

**Total estimated time:** ~45–70 minutes including verification.

---

## Step 1 — Render the redesigned hero (P0) — *≈5 min*

**Why:** This is the direct fix. Once `App.jsx` mounts the redesign, all four tasks' changes become
visible immediately.

**File to modify:** `src/App.jsx`

**Exact change:**

```diff
- import HeroSection from './components/HeroSection.jsx';
+ import Hero from './components/Hero.tsx';
```

```diff
      <div className="min-h-screen bg-background text-white">
-       <HeroSection />
+       <Hero />
        <CryptoCarousel />
```

> Note: the import specifier may be written as `'./components/Hero'` (extension-less) if you prefer;
> Vite resolves `.tsx` automatically. Keep it explicit (`Hero.tsx`) until Step 3 renames the file.

**Expected outcome:** The rendered page shows the flat, single-column, three-tier hero with the
staggered fade-in entrance and `<picture>` responsive art — no gradient split, no animated blobs.

**Verification:**
1. `npm run dev`, open `http://localhost:5173`.
2. In DevTools Elements, confirm the hero is `<section class="hero ...">` containing
   `header.hero__content` → `h1#hero-headline.hero__headline`, `p.hero__subheadline`,
   `button.hero__cta`.
3. Confirm there is **no** element with class `animate-blob` and **no** `bg-gradient-to-br` on the
   hero.
4. Confirm the eyebrow → headline → subheadline → CTA play their 0/150/300 ms staggered entrance on
   load (and that the content is visible even with JS disabled).

**Rollback:** revert `src/App.jsx` to re-import and render `HeroSection` (single-file, single-commit
revert).

---

## Step 2 — Retire the legacy hero component (P0) — *≈10 min*

**Why:** Two near-identically named hero components (`Hero` vs `HeroSection`) are exactly what let
the redesign land in the wrong file. Removing the dead legacy component prevents recurrence.

**Files:** delete `src/components/HeroSection.jsx` (and its now-unused legacy-only assets/classes).

**Steps:**
1. Confirm nothing else imports it: search the tree for `HeroSection` — after Step 1 the only match
   should be the file itself.
2. Delete `src/components/HeroSection.jsx`.
3. If any Tailwind color tokens (`gradient-start`, `gradient-end`) or the `animate-blob` keyframes
   were used *only* by the legacy hero, leave the tokens (harmless, may be reused) but note them as
   candidates for cleanup.

**Expected outcome:** A single canonical hero (`Hero`) in the codebase; `grep -r HeroSection src/`
returns nothing.

**Verification:** `npm run build` succeeds; `npm run dev` still renders the redesigned hero.

**Rollback:** restore `HeroSection.jsx` from version control (`git checkout -- src/components/HeroSection.jsx`)
and revert Step 1.

---

## Step 3 — Align the file extension with the toolchain (P1) — *≈10–15 min*

**Why:** `Hero.tsx` is a `.tsx` file, but (a) there is **no `typescript` dependency**, (b) Tailwind's
`content` glob is `./src/**/*.{js,jsx}`, and (c) ESLint runs `--ext js,jsx`. The redesigned file is
outside every tooling scan — it is neither linted nor purge-analyzed. The component uses **no
TypeScript types**, so the simplest correct fix is to rename it to `.jsx`.

**Option A (recommended — no TS in the project):**
1. Rename `src/components/Hero.tsx` → `src/components/Hero.jsx`.
2. Remove the now-unnecessary type annotations if any remain (the helper `cx(...names: Array<...>)`
   and `reveal(delay?: string): string` — drop the `: type` annotations so it is valid `.jsx`).
3. Update the import in `src/App.jsx` to `'./components/Hero.jsx'` (or extension-less `'./components/Hero'`).

**Option B (if TypeScript is desired going forward):**
1. `npm i -D typescript` and add a `tsconfig.json`.
2. Extend Tailwind: `content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}']` in `tailwind.config.js`.
3. Extend ESLint lint script: `eslint . --ext js,jsx,ts,tsx ...` in `package.json`.

**Expected outcome:** The hero file is scanned by Tailwind (so any utility classes it uses are
retained, not purged) and linted by ESLint.

**Verification:**
- `npm run lint` completes with the hero file included and 0 warnings.
- `npm run build`; grep the emitted CSS for `hero__headline` — it must be present.

**Rollback:** rename back to `Hero.tsx` / revert the config edits; behavior returns to Step-2 state.

---

## Step 4 — Verify the production build ships the redesign (P1) — *≈5 min*

**Why:** The committed `dist/` currently ships the legacy hero. The fix is only "done" when the
compiled artifact proves the redesign is present and the old design is gone.

**Commands:**
```bash
npm run build
grep -rl "hero__"                dist/        # EXPECT: at least one match (redesign present)
grep -rl "animate-blob\|blob"    dist/        # EXPECT: no match (legacy removed)
grep -rl "gradient-start"        dist/        # EXPECT: no match (unless token reused elsewhere)
```

**Expected outcome:** `hero__*` classes present in `dist/assets/index-*.css`; `animate-blob` absent.

**Verification:** `npm run preview` and load the built site — visual output matches the redesign.

**Rollback:** the previous `dist/` is in version control; `git checkout -- dist/` restores it. (Ideally
`dist/` is a build artifact and not committed — see Step 5.)

---

## Step 5 — Add a regression guardrail (P2) — *≈15–20 min*

**Why:** Nothing failed loudly when the hero became orphaned. Add a cheap check so it cannot recur.

**Choose one (or both):**
1. **Unused-module lint:** add `eslint-plugin-import` and enable `import/no-unused-modules` (with
   `unusedExports: true`) so an orphaned component surfaces in `npm run lint`.
2. **Render smoke test:** add a lightweight test (Vitest + React Testing Library) asserting that
   rendering `<App />` produces a `.hero` landmark and does **not** produce an `.animate-blob`
   element. This pins the contract "the app renders the redesigned hero."
3. **Optional hygiene:** ensure `dist/` is git-ignored and generated in CI rather than committed, so
   the compiled artifact can never drift from source.

**Expected outcome:** CI/lint fails if the redesigned hero is disconnected or the legacy one returns.

**Verification:** temporarily re-point `App.jsx` at `HeroSection` and confirm the guardrail fails;
then revert.

**Rollback:** remove the added plugin/test; no runtime impact.

---

## Priority Summary

| # | Step | Priority | Est. time | Restores visible change? |
|---|------|----------|-----------|--------------------------|
| 1 | Import & render `Hero` in `App.jsx` | **P0** | 5 min | **Yes — fully** |
| 2 | Delete legacy `HeroSection.jsx` | P0 | 10 min | Prevents recurrence |
| 3 | Rename `.tsx`→`.jsx` (or add TS + config) | P1 | 10–15 min | Tooling correctness |
| 4 | Verify `dist/` ships redesign | P1 | 5 min | Confirms fix |
| 5 | Add orphan/regression guardrail | P2 | 15–20 min | Prevents future regress |

---

## Global Rollback Plan

All changes are small and file-scoped. To revert the entire remediation in one shot, restore the
four touched paths from version control:

```bash
git checkout -- src/App.jsx src/components/Hero.tsx src/components/HeroSection.jsx \
                tailwind.config.js package.json
```

This returns the app to rendering the legacy `HeroSection.jsx`. Because Step 1 is the only change
required to make the redesign visible, a partial rollback of Steps 3–5 is safe and leaves the
redesign rendering.

---

## References

- **Vite — static asset & build handling / tree-shaking:** https://vitejs.dev/guide/features.html
  and https://vitejs.dev/config/build-options.html
- **Vite — React plugin & JSX/TSX handling:** https://github.com/vitejs/vite-plugin-react
- **Tailwind CSS — content configuration & class detection (purge):**
  https://tailwindcss.com/docs/content-configuration
- **Tailwind CSS — dark mode / theming tokens:** https://tailwindcss.com/docs/dark-mode
- **React — conditional rendering & component composition:**
  https://react.dev/learn/conditional-rendering and https://react.dev/learn/importing-and-exporting-components
- **ESLint — `--ext` and `eslint-plugin-import` (`no-unused-modules`):**
  https://eslint.org/docs/latest/use/command-line-interface and
  https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unused-modules.md
- *(Task references Next.js/CSS Modules; note this project is a Vite + React SPA using a global
  `hero.css`, not Next.js or `*.module.css` — the equivalent concepts are Vite's module graph and
  Tailwind's content scan.)*
