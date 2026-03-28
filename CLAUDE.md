# CLAUDE.md — Succession Plan App

AI assistant context for the **PNS-PR Succession Planning** web application.

---

## Project Overview

A comprehensive **succession planning SPA** for the Business Intelligence department at Provider Network Solutions (Puerto Rico). HR professionals use it to assess talent readiness, track individual development plans (IDPs), run rubric-based evaluations, and export reports.

**All UI text is in Spanish.** This is intentional — do not translate labels, status values, or user-facing strings unless explicitly asked.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build / Bundling | Vite 8 + `@vitejs/plugin-react` (Oxc compiler) |
| Framework | React 19 (hooks-only, no class components) |
| Styling | Plain CSS + CSS Variables (`src/index.css`) |
| State | `useState` + custom `useData` hook → `localStorage` |
| Routing | Tab-based navigation via `TabBar.jsx` (no React Router used) |
| Charts | Recharts |
| Export | jsPDF + html2canvas (PDF), docx + file-saver (DOCX), JSON |
| AI Backend | Groq API (llama-3.3-70b-versatile) via Vercel serverless (`/api/chat.js`) |
| Linting | ESLint 9 flat config with react-hooks + react-refresh plugins |
| Language | JavaScript + JSX (no TypeScript) |
| Deployment | Vercel (primary) + GitHub Pages (secondary) |

---

## Directory Structure

```
succession-plan-app/
├── api/
│   └── chat.js               # Vercel serverless — Groq AI proxy
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # Static images/SVGs
│   ├── components/
│   │   ├── Shell.jsx         # App header: logo, admin toggle, export/import
│   │   ├── TabBar.jsx        # Two-level nested tab navigation
│   │   ├── StatusBar.jsx     # Footer: plan info, collaborator counts
│   │   └── ValoresChat.jsx   # Groq-powered AI chat component
│   ├── data/
│   │   ├── initialData.js    # Default seed data (5 collaborators + meta)
│   │   └── valoresKB.js      # Knowledge base for AI chatbot (~964 lines)
│   ├── hooks/
│   │   └── useData.js        # localStorage persistence + state helpers
│   ├── pages/
│   │   ├── Home.jsx          # Landing, hero, pipeline overview
│   │   ├── TalentCard.jsx    # View individual profile (9-Box, gaps, IDP)
│   │   ├── TalentCardForm.jsx # Create / edit collaborator profiles
│   │   ├── Rubricas.jsx      # Rubric scoring system (largest file, 1787 lines)
│   │   ├── BancaTalento.jsx  # Talent bank dashboard sorted by priority
│   │   ├── Calidad.jsx       # Quality heatmap & analysis
│   │   ├── Valores.jsx       # Organizational values guide + AI chat
│   │   ├── ClimaLaboral.jsx  # Cultural climate assessment
│   │   ├── EvalLiderazgo.jsx # Leadership evaluation matrix
│   │   └── FeedbackBox.jsx   # Anonymous feedback form
│   ├── utils/
│   │   └── exports.js        # JSON / PDF / DOCX export helpers
│   ├── App.jsx               # Root: mounts useData, renders Shell/TabBar/pages
│   ├── index.css             # Global styles + CSS custom properties
│   └── main.jsx              # React entry point
├── index.html
├── vite.config.js            # base: '/succession-plan-app/'
├── vercel.json               # SPA rewrite rules + build config
├── eslint.config.js          # ESLint 9 flat config
└── package.json
```

---

## Data Model

All state lives in `localStorage` under key `pns-succession-plan-v1`. The shape is defined in `src/data/initialData.js`:

```js
{
  meta: {
    department, organization, period, nextReview,
    responsible, qualityScore,   // 0–100
    criticalPositions
  },
  collaborators: [
    {
      id, code, currentPosition, department,
      readinessStatus,           // 'Listo ahora' | 'Listo pronto' | 'Listo futuro'
      readinessPercentage,       // 0–100
      timelineMonths,
      targetPosition,
      colorCode,
      priority,                  // 1–5
      strengths: string[],
      nineBox: { performance: 1–5, potential: 1–5 },
      gaps: [{ name, detail, severity }],   // severity: 'Crítica'|'Alta'|'Media'
      idp: [                     // 3 phases
        { phase, duration, actions: [{ text, status }] }
      ]
    }
  ],
  heatmap: [{ dimension, [collabId]: score }],  // competency scores 1–5
  recommendations: [{ priority, color, title, detail }],
  values: [{ id, name, color, icon, definition, behaviors }],
  competencies: [{ id, name, category, relatedValue, description,
                   analyst, supervisor, director }]
}
```

**Key rule**: Never introduce a database or backend for core data — localStorage is intentional. Export/import JSON handles data portability.

---

## State Management

The `useData` hook (`src/hooks/useData.js`) is the single source of truth:

```js
const {
  data, setData,
  updateCollaborator(id, updates),
  updateMeta(updates),
  updateHeatmap(newHeatmap),
  updateRubricEvaluation(collabId, rubricData),
  addCollaborator(newCollab),
  importData(jsonData),
  resetData()
} = useData()
```

- Instantiated once in `App.jsx`, then passed down via props (no Context API).
- Persists automatically on every `data` change via `useEffect`.
- To add a new collaborator property, update `initialData.js` **and** document it here.

---

## Tab Navigation

`TabBar.jsx` defines the two-level navigation. Groups and their sub-tabs:

| Group | Sub-tabs / Pages |
|---|---|
| Resumen | Home |
| Evaluación | TalentCard · Rubricas · TalentCardForm |
| Diagnóstico | BancaTalento · Calidad |
| Cultura & Valores | Valores · ClimaLaboral · EvalLiderazgo |
| Feedback | FeedbackBox |

When adding a new page: (1) create `src/pages/NewPage.jsx`, (2) add it to the `GROUPS` array in `TabBar.jsx`, (3) wire it into the render switch in `App.jsx`.

---

## AI Chat (Groq)

- **Endpoint**: `POST /api/chat.js` (Vercel serverless)
- **Model**: `llama-3.3-70b-versatile`, temperature 0.65, max_tokens 900
- **Scope**: Organizational values, leadership psychology, team dynamics (Spanish)
- **Required env var**: `GROQ_API_KEY` (set in Vercel project settings; never commit)
- Fallback knowledge base in `src/data/valoresKB.js` for offline/test contexts

The chat component (`ValoresChat.jsx`) is embedded inside `Valores.jsx` only.

---

## Export System

`src/utils/exports.js` provides:

| Function | Output |
|---|---|
| `exportJSON(data)` | `plan-sucesion-pns-YYYY-MM-DD.json` |
| `importJSON(file, cb)` | Parses JSON → calls `importData()` |
| `exportPDF(elementId)` | Screenshot of a DOM element → PDF |
| `exportFullPDF(data)` | Multi-page structured PDF |
| `exportDocx(data, collabId?)` | DOCX report (whole plan or single collaborator) |

PDF generation uses `html2canvas` + `jsPDF`. DOCX uses the `docx` npm package directly.

---

## Styling Conventions

All global styles are in `src/index.css`. CSS variables are defined on `:root`:

```css
--navy:    #1a2e3b   /* primary dark */
--teal:    #1D9E75   /* primary accent / CTA */
--purple:  #534AB7   /* secondary */
--amber:   #BA7517   /* warning */
--blue:    #185FA5   /* info */
--coral:   #993C1D   /* tertiary */
--red:     #A32D2D   /* danger */
--gray-1 → --gray-4  /* grayscale scale */
```

- Use CSS classes from `index.css` before adding inline styles.
- Component-specific overrides are acceptable as inline styles for dynamic values.
- Class names use **kebab-case**. Section separators in CSS: `/* ─── Section ─── */`.
- Fonts: Inter (body), DM Mono (code/monospace) — loaded from Google Fonts in `index.html`.

---

## Code Conventions

- **Components**: PascalCase filenames (`Shell.jsx`)
- **Functions / variables**: camelCase
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS classes**: `kebab-case`
- Arrow functions are the default; avoid class components
- Conditional rendering: ternary operators or `&&` short-circuit
- List rendering: `.map()` with a stable `key` prop
- Section comments: `// ─── Section Name ──────────────────`
- Error handling: `try/catch` for JSON parsing; `alert()` for user-facing errors; `console.error` for developer errors

---

## Development Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build → dist/
npm run lint      # ESLint check
npm run preview   # Preview production build locally
npm run deploy    # Build + deploy to GitHub Pages (gh-pages)
```

No test runner is configured. ESLint is the primary code-quality gate.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Vercel project settings | Groq LLM API access |

For local development, create `.env.local` (already in `.gitignore`):
```
GROQ_API_KEY=gsk_...
```

---

## Deployment

### Vercel (primary)
- `vercel.json` configures build command, output dir, and SPA rewrites.
- All non-`/api/` routes rewrite to `/index.html`.
- Push to `main` triggers automatic deployment.

### GitHub Pages (secondary)
- `npm run deploy` runs `vite build` then `gh-pages -d dist`.
- `vite.config.js` sets `base: '/succession-plan-app/'` for sub-path hosting.

---

## Key Files to Know

| File | Why it matters |
|---|---|
| `src/data/initialData.js` | Canonical data schema + seed data |
| `src/hooks/useData.js` | All state mutations go through here |
| `src/App.jsx` | Top-level layout, route switch, prop distribution |
| `src/components/TabBar.jsx` | Navigation structure — edit here to add/remove tabs |
| `src/pages/Rubricas.jsx` | Most complex page (1787 lines); rubric evaluation engine |
| `src/index.css` | All shared styles and design tokens |
| `api/chat.js` | Only backend code; Groq proxy |

---

## Common Tasks

### Add a new collaborator field
1. Add the field with a default value in `initialData.js` (both the schema and sample data).
2. Render/edit it in `TalentCard.jsx` and/or `TalentCardForm.jsx`.
3. Update `exportDocx` / `exportFullPDF` in `exports.js` if it should appear in reports.

### Add a new tab/page
1. Create `src/pages/NewPage.jsx`.
2. Add an entry to the `GROUPS` constant in `TabBar.jsx`.
3. Add a case to the page-render switch in `App.jsx`.
4. Pass required `data` / updater props from `App.jsx`.

### Add a new export format
1. Implement the function in `src/utils/exports.js`.
2. Add a trigger button in `Shell.jsx`.

### Change AI behavior
- Edit the system prompt in `api/chat.js`.
- Extend the knowledge base in `src/data/valoresKB.js` for keyword-matched fallbacks.

---

## Constraints & Anti-patterns to Avoid

- **Do not** add a backend database or server-side session — localStorage is by design.
- **Do not** use React Router — navigation is tab-based via component state.
- **Do not** introduce TypeScript without discussing it first — the project is intentionally JS-only.
- **Do not** add a test framework unless the user explicitly requests it.
- **Do not** commit `.env` or `.env.local` files.
- **Do not** translate Spanish UI strings to English.
- **Do not** use React Context or Redux — props from `App.jsx` are sufficient for this app's scale.
- **Do not** add memoization (`React.memo`, `useMemo`, `useCallback`) preemptively.
