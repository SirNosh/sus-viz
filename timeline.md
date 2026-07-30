# Working timeline

## 2026-07-30

- Started from the provided empty workspace and preserved the Sites starter structure.
- Read the two project briefs. Chose the editorial microsite direction: scrollable story mode plus an Explore Data view, with explicit methodology warnings and no unsupported “on track” claims.
- Kept the starter’s Vite/vinext runtime and avoided adding chart libraries; the core visuals can be authored with semantic HTML/CSS and lightweight React state.
- Completed the main implementation in `app/page.tsx` and `app/globals.css`: Story mode, Explore mode, filters, normalized/absolute toggle, source links, CSV/JSON downloads, responsive layouts, focus states, and reduced-motion handling.
- Removed the starter skeleton and `react-loading-skeleton` dependency. Updated the rendered HTML test to assert the finished story shell instead of temporary preview content.
- Production build, ESLint, and server-render smoke test all pass. The Windows shell script’s POSIX env-var prefix is a starter-runtime quirk, so build validation used the equivalent PowerShell environment assignment plus `vinext build`.
- Created the private Sites project, pushed the validated source, saved version 1, and deployed it successfully. The deployment is owner-only and live at the private Sites URL returned in the final handoff.
- Reworked the screenshot-reported visualization failures with responsive D3 geometry: the target horizon now alternates mobile labels, climate annotations share the chart scale, and food sourcing uses external callouts instead of stacked center labels.
- Added D3-driven waste flow and mobility route visualizations. Added a Three.js 3D campus field encoding 19 LEED buildings and a 39-of-100 canopy field, plus a D3 isometric 3D fallback for WebGL-restricted browsers.
- Ran desktop and mobile browser QA. Fixed a ResizeObserver feedback loop and a runaway canvas height discovered during that pass; verified no label collisions, error overlays, or horizontal overflow at the tested breakpoints.
- Generated and wired a project-specific social preview card using the finished editorial and isometric visual language. Production build, lint, and server-render tests pass after the update.
- Applied the final visual refinements: moved the Climate “−21 points” annotation right and above the observed line, colored “8% hyperlocal” Heritage Blue, and distributed all 19 LEED buildings across the full 3D field in both WebGL and isometric fallback views.
- Replaced the Codex Sites/vinext worker scaffold with a static Vite entry using the `/sus-viz/` base path. Added a GitHub Pages Actions workflow and updated metadata for `https://sirnosh.github.io/sus-viz/`.
- Removed the now-unused Codex/Cloudflare/Next/Drizzle deployment files and dependencies. The static build, TypeScript check, ESLint, and built-artifact test pass.
