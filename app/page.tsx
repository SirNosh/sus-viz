"use client";

import { useMemo, useState } from "react";
import {
  BuiltEnvironment3D,
  ClimateD3,
  FoodD3,
  HorizonVisualization,
  MobilityD3,
  WasteD3,
} from "./visualizations";

type Category =
  | "Climate"
  | "Materials"
  | "Food"
  | "Built & nature"
  | "Mobility"
  | "Research";

type Metric = {
  id: string;
  category: Category;
  label: string;
  shortLabel: string;
  currentValue: number;
  currentDisplay: string;
  unit: string;
  baseline?: string;
  target?: string;
  targetDisplay?: string;
  targetYear?: number;
  direction?: "increase" | "decrease";
  normalizedProgress?: number;
  normalizedNote?: string;
  comparison: "comparable" | "partial" | "context";
  definition: string;
  targetDefinition?: string;
  sourceTitle: string;
  sourceUrl: string;
};

const sourceProgress = "https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/";
const sourceClimate = "https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/climate-action/";
const sourceConsumption = "https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/responsible-consumption/";
const sourceBuilt = "https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/built-natural-environments/";
const sourceMobility = "https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/transportation-mobility/";
const sourceResearch = "https://sustainability.jhu.edu/who-we-are/our-progress/progressreport-2025/research-teaching-scholarship/";

const metrics: Metric[] = [
  {
    id: "ghg-reduction",
    category: "Climate",
    label: "Scope 1 and 2 emissions reduction",
    shortLabel: "Scope 1 & 2 reduction",
    currentValue: 21,
    currentDisplay: "21% reduction",
    unit: "% reduction",
    baseline: "2022 baseline: ~152,000 metric tons CO₂e",
    target: "Net zero",
    targetDisplay: "Net zero",
    targetYear: 2040,
    direction: "increase",
    normalizedNote: "Net zero is not equivalent to a linear zero-emissions endpoint in the cited snapshot.",
    comparison: "partial",
    definition: "Reduction relative to the updated 2022 Scope 1 and 2 baseline.",
    targetDefinition: "Net zero is an institutional endpoint, not a 2040 emissions quantity published in this snapshot.",
    sourceTitle: "Climate Action — JHU Climate & Sustainability",
    sourceUrl: sourceClimate,
  },
  {
    id: "renewable-electricity",
    category: "Climate",
    label: "Purchased electricity from renewable and carbon-free sources",
    shortLabel: "Clean electricity",
    currentValue: 77,
    currentDisplay: "77%",
    unit: "%",
    target: "100% renewable",
    targetDisplay: "100% renewable",
    targetYear: 2030,
    comparison: "partial",
    definition: "The current figure combines renewable and other carbon-free purchased electricity.",
    targetDefinition: "The 2030 commitment refers specifically to renewable purchased electricity.",
    sourceTitle: "Climate Action — JHU Climate & Sustainability",
    sourceUrl: sourceClimate,
  },
  {
    id: "waste-diversion",
    category: "Materials",
    label: "Waste diverted from incineration and landfill",
    shortLabel: "Waste diversion",
    currentValue: 37,
    currentDisplay: "37%",
    unit: "%",
    baseline: "2024 measurement",
    target: "50%",
    targetDisplay: "50%",
    targetYear: 2030,
    direction: "increase",
    comparison: "comparable",
    definition: "Share of waste diverted from incineration and landfill in 2024.",
    targetDefinition: "The stated 2030 diversion target is 50%.",
    sourceTitle: "Responsible Consumption — JHU Climate & Sustainability",
    sourceUrl: sourceConsumption,
  },
  {
    id: "waste-per-capita",
    category: "Materials",
    label: "Per-capita waste reduction",
    shortLabel: "Per-capita waste",
    currentValue: 8.1,
    currentDisplay: "8.1% below 2022",
    unit: "% reduction",
    baseline: "2022 baseline: 0% reduction",
    target: "10% below 2022",
    targetDisplay: "10% reduction",
    targetYear: 2030,
    direction: "increase",
    normalizedProgress: 81,
    comparison: "comparable",
    definition: "Per-capita waste is 8.1% lower than the 2022 baseline, or almost 23 pounds less per affiliate.",
    targetDefinition: "The commitment is a 10% reduction below 2022 per-capita waste.",
    sourceTitle: "Responsible Consumption — JHU Climate & Sustainability",
    sourceUrl: sourceConsumption,
  },
  {
    id: "food-spend",
    category: "Food",
    label: "Hopkins Dining spend meeting sustainability standards",
    shortLabel: "Sustainable dining spend",
    currentValue: 20,
    currentDisplay: "20%",
    unit: "%",
    target: "35%",
    targetDisplay: "35%",
    targetYear: 2030,
    direction: "increase",
    comparison: "comparable",
    definition: "Share of Hopkins Dining spend meeting the program’s sustainability standards.",
    targetDefinition: "The 2030 target is 35% of dining spend.",
    sourceTitle: "Responsible Consumption — JHU Climate & Sustainability",
    sourceUrl: sourceConsumption,
  },
  {
    id: "local-food",
    category: "Food",
    label: "Locally sourced Hopkins Dining food",
    shortLabel: "Local food",
    currentValue: 30,
    currentDisplay: "30% local",
    unit: "%",
    target: "40%",
    targetDisplay: "40% local",
    targetYear: 2030,
    direction: "increase",
    comparison: "comparable",
    definition: "Local means sourced within 250 miles; 8% of the total is hyperlocal, within 25 miles.",
    targetDefinition: "The 2030 target is 40% locally sourced food.",
    sourceTitle: "Responsible Consumption — JHU Climate & Sustainability",
    sourceUrl: sourceConsumption,
  },
  {
    id: "food-emissions",
    category: "Food",
    label: "Food procurement emissions",
    shortLabel: "Food emissions",
    currentValue: 5690,
    currentDisplay: "5,690 metric tons CO₂e/year",
    unit: "metric tons CO₂e/year",
    baseline: "2024 baseline",
    target: "25% reduction",
    targetDisplay: "4,267.5 metric tons",
    targetYear: 2030,
    direction: "decrease",
    normalizedProgress: 0,
    comparison: "comparable",
    definition: "The 2024 baseline for food-procurement emissions.",
    targetDefinition: "A 25% reduction from the 2024 baseline means a target level of 4,267.5 metric tons CO₂e/year.",
    sourceTitle: "Responsible Consumption — JHU Climate & Sustainability",
    sourceUrl: sourceConsumption,
  },
  {
    id: "composting",
    category: "Food",
    label: "Dining and retail locations with back-of-house composting",
    shortLabel: "Back-of-house composting",
    currentValue: 61,
    currentDisplay: "61% of locations",
    unit: "% of locations",
    target: "100%",
    targetDisplay: "100%",
    direction: "increase",
    comparison: "comparable",
    definition: "Share of dining and retail locations eliminating pre-consumer food waste through back-of-house composting.",
    targetDefinition: "The target is all dining and retail locations.",
    sourceTitle: "Responsible Consumption — JHU Climate & Sustainability",
    sourceUrl: sourceConsumption,
  },
  {
    id: "tree-canopy",
    category: "Built & nature",
    label: "Campus tree-canopy coverage",
    shortLabel: "Tree canopy",
    currentValue: 39,
    currentDisplay: "39% coverage",
    unit: "% coverage",
    comparison: "context",
    definition: "Universitywide campus tree-canopy coverage in the 2024 snapshot.",
    sourceTitle: "Built & Natural Environments — JHU Climate & Sustainability",
    sourceUrl: sourceBuilt,
  },
  {
    id: "leed-buildings",
    category: "Built & nature",
    label: "LEED-certified buildings",
    shortLabel: "LEED buildings",
    currentValue: 19,
    currentDisplay: "19 buildings",
    unit: "buildings",
    comparison: "context",
    definition: "19 certified buildings: 9 Silver, 9 Gold, and 1 Platinum.",
    sourceTitle: "Built & Natural Environments — JHU Climate & Sustainability",
    sourceUrl: sourceBuilt,
  },
  {
    id: "alternative-commuting",
    category: "Mobility",
    label: "Employees using alternative commuting",
    shortLabel: "Alternative commuting",
    currentValue: 25,
    currentDisplay: "25% of employees",
    unit: "% of employees",
    baseline: "More than 3,000 survey responses",
    comparison: "partial",
    definition: "Share of employees reporting alternative commuting in the available survey response set.",
    targetDefinition: "The 2030 objective is a 10% increase in the number of employees, not necessarily 10 percentage points of survey share.",
    sourceTitle: "Transportation & Mobility — JHU Climate & Sustainability",
    sourceUrl: sourceMobility,
  },
  {
    id: "electric-purchases",
    category: "Mobility",
    label: "New light-duty purchases that were electric or hybrid",
    shortLabel: "Electric or hybrid purchases",
    currentValue: 24,
    currentDisplay: "24%",
    unit: "% of purchases",
    target: "100% all-electric",
    targetDisplay: "100% all-electric",
    targetYear: 2030,
    comparison: "partial",
    definition: "Share of new light-duty/passenger purchases that were electric or hybrid.",
    targetDefinition: "The future commitment is all-electric purchases, so it is not directly equivalent to the current electric-or-hybrid measure.",
    sourceTitle: "Transportation & Mobility — JHU Climate & Sustainability",
    sourceUrl: sourceMobility,
  },
  {
    id: "electric-buses",
    category: "Mobility",
    label: "Electric buses purchased",
    shortLabel: "Electric buses",
    currentValue: 5,
    currentDisplay: "5 buses",
    unit: "buses",
    comparison: "context",
    definition: "Five electric buses, estimated to avoid up to 550 metric tons CO₂e annually in aggregate.",
    sourceTitle: "Transportation & Mobility — JHU Climate & Sustainability",
    sourceUrl: sourceMobility,
  },
  {
    id: "patents",
    category: "Research",
    label: "Climate or energy patents issued",
    shortLabel: "Climate & energy patents",
    currentValue: 13,
    currentDisplay: "13 new patents",
    unit: "patents",
    comparison: "context",
    definition: "New climate or energy patents issued in the reporting period.",
    sourceTitle: "Research, Teaching, & Scholarship — JHU Climate & Sustainability",
    sourceUrl: sourceResearch,
  },
  {
    id: "programs",
    category: "Research",
    label: "Sustainability-focused degrees and certificates",
    shortLabel: "Sustainability programs",
    currentValue: 43,
    currentDisplay: "43 programs",
    unit: "programs",
    comparison: "context",
    definition: "Sustainability-focused degree and certificate programs.",
    sourceTitle: "Research, Teaching, & Scholarship — JHU Climate & Sustainability",
    sourceUrl: sourceResearch,
  },
];

const categories: Array<"All" | Category> = ["All", "Climate", "Materials", "Food", "Built & nature", "Mobility", "Research"];

function MetricBadge({ comparison }: { comparison: Metric["comparison"] }) {
  const copy = comparison === "comparable" ? "Comparable" : comparison === "partial" ? "Partial comparison" : "Context only";
  return <span className={`badge badge-${comparison}`}>{comparison === "partial" ? "≠" : comparison === "context" ? "i" : "✓"} {copy}</span>;
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span><span>{children}</span></div>;
}

function Header({ mode, onModeChange }: { mode: "story" | "explore"; onModeChange: (mode: "story" | "explore") => void }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="The Distance Remaining, back to top"><span>JHU</span> / INDEPENDENT STUDENT VISUALIZATION / JHU PUBLIC DATA</a>
      <nav className="mode-switch" aria-label="View mode">
        <button className={mode === "story" ? "active" : ""} aria-pressed={mode === "story"} onClick={() => onModeChange("story")}>Story</button>
        <button className={mode === "explore" ? "active" : ""} aria-pressed={mode === "explore"} onClick={() => onModeChange("explore")}>Explore data</button>
      </nav>
    </header>
  );
}

function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="hero" id="top">
      <div className="hero-contour" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="hero-copy">
        <p className="eyebrow">2024 SNAPSHOT <span>→</span> 2030 / 2040 COMMITMENTS</p>
        <h1>Progress is measurable.<br /><em>So is the distance remaining.</em></h1>
        <p className="hero-deck">A public-data reading of Johns Hopkins’ sustainability targets — where the university stands, what can be compared, and what the numbers do not yet say.</p>
        <div className="hero-actions"><a className="text-link" href="#ledger">Begin the story <span>↓</span></a><button className="outline-button" onClick={onExplore}>Explore all data <span>↗</span></button></div>
      </div>
      <HorizonVisualization />
      <p className="disclaimer">Independent student visualization concept using publicly available Johns Hopkins data. Not an official university report.</p>
    </section>
  );
}

function Ledger({ onSelect }: { onSelect: (id: string) => void }) {
  const rows = ["ghg-reduction", "waste-diversion", "food-spend", "local-food", "tree-canopy"];
  return (
    <section className="section ledger-section" id="ledger">
      <div className="section-intro"><SectionLabel number="01">The commitment ledger</SectionLabel><h2>One university.<br /><em>Five systems.</em></h2><p>The report is organized around systems that touch daily life: climate, materials, food, the built environment, and mobility. Each row is a claim with a destination.</p></div>
      <div className="ledger" role="list" aria-label="Selected sustainability measures">
        {rows.map((id) => {
          const metric = metrics.find((item) => item.id === id)!;
          const gap = metric.target && metric.targetDisplay && metric.currentValue < 100 ? metric.id === "waste-diversion" ? "13 pp gap" : metric.id === "local-food" ? "10 pp gap" : metric.id === "food-spend" ? "15 pp gap" : "" : "";
          return <button className="ledger-row" key={metric.id} onClick={() => onSelect(metric.id)} role="listitem"><span className="ledger-category">{metric.category}</span><span className="ledger-label">{metric.label}</span><strong>{metric.currentDisplay}</strong><span className="ledger-target">{metric.targetDisplay ? `${metric.targetDisplay}, ${metric.targetYear ?? ""}` : "No numeric target"}</span><span className="ledger-gap">{gap || "↗ read"}</span></button>;
        })}
      </div>
      <p className="figure-caption">The ledger shows a destination, not a prediction. A gap is reported in percentage points when a published baseline does not justify a normalized progress score.</p>
    </section>
  );
}

function ClimateVisual() {
  return (
    <div className="visual-frame climate-frame">
      <div className="visual-topline"><span>INDEXED SCOPE 1 + 2 EMISSIONS</span><span>2022 = 100</span></div>
      <ClimateD3 />
    </div>
  );
}

function WasteVisual() {
  return (
    <div className="visual-frame waste-frame">
      <div className="visual-topline"><span>100 UNITS OF WASTE</span><span>2024 → 2030</span></div>
      <WasteD3 />
    </div>
  );
}

function FoodVisual() {
  return (
    <div className="visual-frame food-frame">
      <div className="visual-topline"><span>SOURCING RADIUS</span><span>ORIGIN: HOMEWOOD</span></div>
      <FoodD3 />
    </div>
  );
}

function BuiltVisual() {
  return <div className="visual-frame built-frame"><BuiltEnvironment3D /></div>;
}

function MobilityVisual() {
  return <div className="visual-frame mobility-frame"><div className="visual-topline"><span>THE ROUTE</span><span>2024 MOBILITY SIGNALS</span></div><MobilityD3 /></div>;
}

function Story({ onExplore, onSelect }: { onExplore: () => void; onSelect: (id: string) => void }) {
  return <main className="story"><Hero onExplore={onExplore} /><Ledger onSelect={onSelect} /><section className="section story-section split-section" id="climate"><div className="section-intro"><SectionLabel number="02">Climate</SectionLabel><h2>A carbon descent,<br /><em>with a dashed future.</em></h2><p>Scope 1 and 2 emissions were 21% below the updated 2022 baseline in 2024. The next part of the line is a commitment — not an observed trajectory.</p><MetricBadge comparison="partial" /></div><ClimateVisual /></section><section className="section story-section split-section" id="materials"><div className="section-intro"><SectionLabel number="03">Materials</SectionLabel><h2>The split is<br /><em>the story.</em></h2><p>37% of waste was diverted in 2024. The 2030 commitment is 50%, leaving a gap of 13 percentage points. That is the visible distance; no zero baseline is implied.</p><MetricBadge comparison="comparable" /></div><WasteVisual /></section><section className="section story-section split-section" id="food"><div className="section-intro"><SectionLabel number="04">Food</SectionLabel><h2>Distance on<br /><em>the plate.</em></h2><p>Local sourcing is a geography: 30% of Hopkins Dining food came from within 250 miles, including 8% from within 25 miles.</p><MetricBadge comparison="comparable" /></div><FoodVisual /></section><section className="section story-section" id="built"><div className="section-intro wide-intro"><SectionLabel number="05">Buildings + nature</SectionLabel><h2>Constructed systems.<br /><em>Living systems.</em></h2><p>19 LEED-certified buildings sit alongside a 39% tree-canopy measure. Neither has a universitywide numeric target in the cited progress report, so both are presented as context rather than progress scores.</p></div><BuiltVisual /></section><section className="section story-section split-section" id="mobility"><div className="section-intro"><SectionLabel number="06">Mobility</SectionLabel><h2>A route through<br /><em>the transition.</em></h2><p>These signals connect the campus movement system, but their definitions are not interchangeable. The ≠ badge is part of the data.</p><MetricBadge comparison="partial" /></div><MobilityVisual /></section><section className="section research-section" id="research"><div className="research-copy"><SectionLabel number="07">Research + education</SectionLabel><h2>The evidence<br /><em>keeps moving.</em></h2><p>Aggregate counts are useful here precisely because they stay aggregate. The next version could show individual programs and patents once those public records are available.</p></div><div className="research-numbers"><div><b>13</b><span>new climate or energy patents</span></div><div><b>43</b><span>sustainability-focused degrees and certificates</span></div></div></section><WhatRemains onExplore={onExplore} /></main>;
}

function WhatRemains({ onExplore }: { onExplore: () => void }) {
  return <section className="section remains-section" id="remains"><div className="section-intro wide-intro"><SectionLabel number="08">What remains</SectionLabel><h2>Progress is a record.<br /><em>Distance is a question.</em></h2><p>With one primary measurement year, this snapshot can show current values, targets, and definitions. It cannot establish whether the university is on schedule. Use Explore data to inspect the evidence yourself.</p><button className="solid-button" onClick={onExplore}>Open Explore data <span>→</span></button></div><div className="methodology"><div><span className="method-number">01</span><h3>Comparable</h3><p>Current and target use the same or directly compatible definition. A gap can be stated plainly.</p></div><div><span className="method-number">02</span><h3>Partial comparison</h3><p>Definitions overlap, but the current measure and future commitment should not be collapsed into one score.</p></div><div><span className="method-number">03</span><h3>Context only</h3><p>No universitywide numeric target is published in the cited material. The value remains important context.</p></div></div><div className="sources"><span>DATA + METHODOLOGY</span><a href={sourceProgress} target="_blank" rel="noreferrer">2025 Progress Report ↗</a><a href="https://brand.jhu.edu/visual-identity/typography/" target="_blank" rel="noreferrer">JHU brand typography ↗</a><a href="https://brand.jhu.edu/visual-identity/colors/" target="_blank" rel="noreferrer">JHU brand colors ↗</a></div></section>;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Explore() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [view, setView] = useState<"absolute" | "normalized">("absolute");
  const filtered = useMemo(() => category === "All" ? metrics : metrics.filter((metric) => metric.category === category), [category]);
  const csv = ["id,category,label,current_value,current_display,target,target_year,comparison,source_url", ...metrics.map((metric) => [metric.id, metric.category, `"${metric.label}"`, metric.currentValue, `"${metric.currentDisplay}"`, `"${metric.targetDisplay ?? ""}"`, metric.targetYear ?? "", metric.comparison, metric.sourceUrl].join(","))].join("\n");
  return <main className="explore" id="explore"><div className="explore-heading"><div><p className="eyebrow">PUBLIC DATASET / 2024 SNAPSHOT</p><h1>Explore the<br /><em>distance remaining.</em></h1><p>Filter the measures, switch the lens, and open the definition behind every number.</p></div><div className="download-actions"><button className="outline-button" onClick={() => downloadFile("jhu-sustainability-2024.json", JSON.stringify(metrics, null, 2), "application/json")}>JSON ↓</button><button className="outline-button" onClick={() => downloadFile("jhu-sustainability-2024.csv", csv, "text/csv")}>CSV ↓</button></div></div><div className="explore-controls"><div className="filter-group" aria-label="Filter by topic">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="view-toggle" aria-label="Value view"><button className={view === "absolute" ? "active" : ""} aria-pressed={view === "absolute"} onClick={() => setView("absolute")}>Absolute values</button><button className={view === "normalized" ? "active" : ""} aria-pressed={view === "normalized"} onClick={() => setView("normalized")}>Normalized progress</button></div></div><div className="table-wrap"><table><caption className="sr-only">JHU sustainability metrics, current values, targets, and methodology</caption><thead><tr><th scope="col">Topic / measure</th><th scope="col">2024 current</th><th scope="col">Target</th><th scope="col">Reading</th><th scope="col">Source</th></tr></thead><tbody>{filtered.map((metric) => <tr key={metric.id}><th scope="row"><span>{metric.category}</span>{metric.label}<small>{metric.definition}</small></th><td>{view === "normalized" ? metric.normalizedProgress !== undefined ? <><b>{metric.normalizedProgress}%</b><small>of defined path</small></> : <><b>{metric.id === "ghg-reduction" ? "Not calculated" : "—"}</b><small>{metric.normalizedNote ?? "not meaningful here"}</small></> : <><b>{metric.currentDisplay}</b><small>{metric.baseline ?? "2024 measurement"}</small></>}</td><td>{metric.targetDisplay ? <><b>{metric.targetDisplay}</b><small>{metric.targetYear ? `by ${metric.targetYear}` : "stated target"}</small></> : <><b>—</b><small>No numeric target</small></>}</td><td><MetricBadge comparison={metric.comparison} /><small>{metric.targetDefinition ?? "Context measure; no target comparison claimed."}</small></td><td><a href={metric.sourceUrl} target="_blank" rel="noreferrer">Read source ↗</a><small>{metric.sourceTitle}</small></td></tr>)}</tbody></table></div><div className="explore-note"><span>NOTE</span><p>Normalized progress is shown only where a published baseline makes the calculation meaningful. A ratio such as 37 ÷ 50 would falsely imply that zero diversion was the starting point.</p></div></main>;
}

export default function Home() {
  const [mode, setMode] = useState<"story" | "explore">("story");
  const selectMetric = (id: string) => {
    setMode("story");
    window.setTimeout(() => document.getElementById(id === "ghg-reduction" ? "climate" : id === "waste-diversion" ? "materials" : id === "food-spend" || id === "local-food" ? "food" : id === "tree-canopy" ? "built" : "mobility")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header mode={mode} onModeChange={setMode} /><div id="main-content">{mode === "story" ? <Story onExplore={() => setMode("explore")} onSelect={selectMetric} /> : <Explore />}</div><footer className="site-footer"><span>THE DISTANCE REMAINING</span><span>2024 JHU SUSTAINABILITY TARGET TRACKER</span><a href="#top">Back to top ↑</a></footer></>;
}
