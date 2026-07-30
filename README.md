# The Distance Remaining

An independent student visualization of Johns Hopkins sustainability progress and institutional commitments in the 2024 public-data snapshot. It is an editorial data story: current measures, future commitments, and the boundaries between what can and cannot be compared.

Live deployment: [sirnosh.github.io/sus-viz](https://sirnosh.github.io/sus-viz/)

## Purpose

The site helps a reader move from the 2022 baseline and 2024 measurement to the 2030 and 2040 commitments without implying that every metric is on a known trajectory. Story mode provides the narrative reading; Explore Data exposes the metric definitions, comparisons, and source links.

## Data sources

The metric values and commitments are drawn from Johns Hopkins’ public 2025 Progress Report, including:

- [Climate Action](https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/climate-action/)
- [Responsible Consumption](https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/responsible-consumption/)
- [Built & Natural Environments](https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/built-natural-environments/)
- [Transportation & Mobility](https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/transportation-mobility/)
- [Research, Teaching & Scholarship](https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/research-teaching-scholarship/)

## Visualization design decisions

- D3 builds the target horizon, climate line chart, waste-flow chart, food sourcing instrument, and mobility route.
- The food view uses only two geographic circles—25 miles and 250 miles. The 8% hyperlocal, 22% additional local, and 70% outside-local shares are shown in a separate labeled strip.
- Three.js renders the 19 LEED-certified buildings and the 39% canopy measure as a spatial field. A D3 isometric fallback supports environments without WebGL.
- The climate chart draws the observed reduction first, then reveals the dashed commitment path as explicitly unobserved.
- Section-entry motion uses one-time IntersectionObserver reveals and CSS transitions. There is no looping motion or spring simulation.

## Methodological categories

- **Comparable** — current and target share the same or directly compatible definition.
- **Partial comparison** — the definitions overlap, but a single progress score would overstate what the data establishes.
- **Context only** — the cited material does not publish a universitywide numeric target for the measure.

Net-zero is treated as an institutional endpoint, not as a linear zero-emissions quantity. The carbon chart can show the observed 21% reduction from baseline, but Explore Data does not calculate a percentage of the net-zero path. Built-environment counts and canopy coverage remain context measures.

## Accessibility

- Skip link, semantic regions, chart roles, and concise accessible chart labels.
- Story/Explore controls, topic filters, and value-view controls expose their active state with `aria-pressed`.
- The 3D canvas is keyboard focusable and supports arrow-key rotation.
- Reduced-motion users receive the completed visual state without authored transitions.
- Focus outlines, readable contrast, and responsive layouts are preserved across desktop and narrow screens.

## Technology stack

- React 19 + TypeScript
- Vite 8
- D3 7
- Three.js 0.185
- GitHub Actions + GitHub Pages

## Project structure

```text
app/page.tsx              Story, Explore Data, metric model, and controls
app/visualizations.tsx    D3 charts, Three.js scene, and fallback geometry
app/globals.css           Editorial layout, responsive styles, and motion
src/main.tsx              Static Vite entry point
tests/                    Built-artifact validation
docs/screenshots/         README preview images
.github/workflows/        GitHub Pages deployment
```

## Known limitations

- Most measures have only one primary measurement year, so the site cannot establish whether the university is on schedule.
- The dashed target path in the climate view is a commitment path, not an observed forecast.
- Food sourcing percentages and distance bands describe different dimensions and are intentionally kept separate.
- The 3D campus field is an explanatory spatial encoding, not a geographic campus map or building-by-building location dataset.
- The screenshots document the project’s review state and are not a substitute for the live interactive experience.

## Independent-project disclaimer

This is an independent student visualization concept using publicly available Johns Hopkins data. It is not an official university report or product of the Johns Hopkins Office of Climate and Sustainability.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm test
```

The production build uses `/sus-viz/` as its base path. Pushing to `main` deploys the static site through `.github/workflows/deploy-pages.yml`.
