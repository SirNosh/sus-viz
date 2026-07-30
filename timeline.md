# Working timeline

## 2026-07-30

- Started from the provided empty workspace and preserved the Sites starter structure.
- Read the two project briefs. Chose the editorial microsite direction: scrollable story mode plus an Explore Data view, with explicit methodology warnings and no unsupported “on track” claims.
- Kept the starter’s Vite/vinext runtime and avoided adding chart libraries; the core visuals can be authored with semantic HTML/CSS and lightweight React state.
- Completed the main implementation in `app/page.tsx` and `app/globals.css`: Story mode, Explore mode, filters, normalized/absolute toggle, source links, CSV/JSON downloads, responsive layouts, focus states, and reduced-motion handling.
- Removed the starter skeleton and `react-loading-skeleton` dependency. Updated the rendered HTML test to assert the finished story shell instead of temporary preview content.
- Production build, ESLint, and server-render smoke test all pass. The Windows shell script’s POSIX env-var prefix is a starter-runtime quirk, so build validation used the equivalent PowerShell environment assignment plus `vinext build`.
