# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Spanish-language succession-planning portal ("Plan de Sucesión") for an organization. Single-page React app with purely client-side state (localStorage). One serverless endpoint backs an AI chatbot on the `Valores` page.

UI text is in Spanish. When editing or adding copy, keep it in Spanish to match the rest of the app.

## Commands

```bash
npm run dev         # Vite dev server on port 5173
npm run build       # production build into dist/
npm run preview     # serve built dist/
npm run lint        # eslint . (flat config in eslint.config.js)
npm run deploy      # runs build, then gh-pages -d dist
```

No test framework is configured; there are no tests in this repo.

## Deployment — two targets, both wired up

- **GitHub Pages** via `gh-pages` (`npm run deploy`). `vite.config.js` sets `base: '/succession-plan-app/'` for this path. `package.json` `homepage` is `https://gpope777.github.io/succession-plan-app`.
- **Vercel** via `vercel.json` (build → `dist`, SPA rewrite for anything not under `/api/`). The `api/` folder is picked up as Vercel serverless functions.

The `/api/chat` endpoint only works on Vercel (not GitHub Pages), so the AI chatbot is Vercel-only. `GROQ_API_KEY` must be set in Vercel env vars.

## Architecture

### State model — localStorage-backed, multi-department

All persistence happens in `src/hooks/useData.js`. There is no backend database.

- A list of departments lives at `localStorage["pns-depts-v1"]` (default: one dept with id `bi` — Business Intelligence).
- Each dept's data lives at `localStorage["pns-dept-<id>-v1"]`, shaped like `src/data/initialData.js`.
- Legacy key `pns-succession-plan-v1` is auto-migrated into the `bi` dept on first load.
- The `bi` dept is the seed/default and is **protected from deletion** (`deleteDepartment` is a no-op for `id === 'bi'`).

`useData()` returns both multi-dept helpers and single-dept helpers (`data`, `updateCollaborator`, etc.) that act on the currently active dept. Pages receive the active-dept slice via props spread as `pageProps` from `App.jsx` — pages should not read localStorage directly.

Deleting a department is a soft delete: it's removed from UI state and kept in `pendingDelete` until the user confirms or undoes via the toast (`UndoToast` in `App.jsx`). Only `confirmDelete` actually removes the localStorage entry.

### Evaluation-history side effect

`updateCollaborator(id, updates)` in `useData.js` automatically appends a snapshot to `collaborator.evaluationHistory` whenever `updates.rubricScores` or `updates.potentialScores` is present. This is how `HistorialEval.jsx` gets populated — do not duplicate this behavior elsewhere; just call `updateCollaborator` with `rubricScores`/`potentialScores` and the history entry is created for you.

### Navigation — two-level tabs, not react-router

`src/components/TabBar.jsx` exports `GROUPS`, a two-level structure (top-level groups → sub-tabs). `App.jsx` renders the page with a plain `switch(activeTab)` and tracks `activeTab` in state. The "next step" button at the bottom-right (`NextTabButton`) walks a flattened `TAB_ORDER` derived from `GROUPS`.

`react-router-dom` is a dependency but is **not used for navigation** in the main flow.

**Adding a new page** requires three coordinated changes:
1. Create `src/pages/YourPage.jsx`.
2. Import it in `App.jsx` and add a `case` in the `switch(activeTab)` inside `renderPage()`.
3. Add an entry (with `id` matching the case) to the appropriate group in `GROUPS` in `TabBar.jsx`.

### Dept-level vs. cross-dept views

`DeptBar` includes a special `general` view that short-circuits `renderPage()` to render `PlanGeneral` (cross-dept roll-up using `deptDataMap`) and hides `TabBar`/`NextTabButton`. Normal tab pages render only when a specific dept is active.

### HR/Admin mode

`adminMode` (toggled from `Shell.jsx`) is a boolean threaded through `pageProps`. Pages gate edit controls / destructive actions on this flag. Read-only views should still render without it.

### Orphan page files

`src/pages/Marco.jsx`, `HPO.jsx`, and `EstandaresTalento.jsx` are **not imported by `App.jsx`** — they are historical artifacts from tab reorganizations (see git log: "Merge Marco + HPO tabs…", "remove Estándares tab"). Don't wire new features into them; use the active pages listed in `App.jsx`'s switch.

### AI chatbot — Groq via Vercel serverless

`api/chat.js` is a Vercel serverless function that proxies Groq's OpenAI-compatible chat completions API (model `llama-3.3-70b-versatile`). It has a hard-coded Spanish system prompt focused on organizational values/leadership literature. The front-end caller is `src/components/ValoresChat.jsx` used by the `Valores` page. If you change the request/response shape in one, update the other.

### Exports

`src/utils/exports.js` handles:
- `exportJSON` / `importJSON` — full dept data round-trip.
- `exportPDF` / `exportFullPDF` — via `jsPDF` + `html2canvas`.
- `exportDocx` — via the `docx` library.

These are wired into the `Shell` header buttons and operate on the **active dept's** `data`.

### Charts

`recharts` is used throughout (`ROI`, `Calidad`, `Desarrollo`, etc.). There are no wrapper abstractions — import directly.

## Conventions

- JavaScript + JSX (no TypeScript). Types packages are installed only so editors resolve JSX.
- ESLint's `no-unused-vars` is configured with `varsIgnorePattern: '^[A-Z_]'`, so unused imports starting with an uppercase letter or underscore won't flag.
- Most styles are in `src/index.css` (CSS variables like `--navy`, `--teal`) with a lot of inline `style={{…}}` objects on JSX — match the existing style rather than introducing a CSS-in-JS library.
