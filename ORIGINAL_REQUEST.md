# Original User Request

## Initial Request — 2026-06-04T15:19:16+08:00

Build and integrate the 2026 World Cup Monte Carlo Probability Simulator (slug: `world-cup-simulator`, component: `WorldCupSimulator.svelte`) with 10-locale translations, Svelte 5 reactivity, and interactive ECharts visualization.

Working directory: /Users/kaka/Dev/u2tool
Integrity mode: development

## Requirements

### R1. Mathematical Simulation Engine
Implement `src/lib/runtime-integrity/world-cup-engine.ts` with:
- Group stage baseline of 48 teams in 12 groups (A-L).
- Trio DNA Elo adjustment: `Elo = Elo_base + (Home / 10 * 150 * Host_Indicator) + (Heritage / 10 * 140 * Heritage_Indicator)`.
- Win-draw-loss probability calculator with `Wildcard Chaos` thermodynamic temperature scaling and a base draw probability of 26% centered on ELO delta.
- Goals generator using independent Poisson distributions adjusted to align with match outcomes.
- Group stage sorter matching official FIFA rules (Points, GD, Goals).
- Top 8 third-placed teams selection and official 32-team elimination bracket pathing.

### R2. Localized Translations & Route Configuration
- Create 10 localization files at `src/messages/[locale]/tools/world-cup-simulator.json` containing detailed description, usage steps, examples, and FAQs matching CJK (70-100 chars) and phonetic (120-160 chars) SEO rules.
- Add `world-cup-simulator` key to `src/messages/[locale]/base.json` under `"tools"`.
- Register slug in `src/config/tools/fun.ts` and run dynamic import generator to update `ToolImportMap.ts`.

### R3. Svelte 5 UI Component & ECharts Dashboard
- Build `src/components/tools/WorldCupSimulator.svelte`.
- Strict Dark Mode container styled with dark titanium-gold themes (independent of global theme).
- Outfit font for headers/KPIs, Inter font for data grids.
- 10,000 runs batching queue using requestAnimationFrame/setTimeout (non-blocking 60fps).
- Pulse SVG gold trophy skeleton overlay during simulation runs.
- Champion win-odds bar chart with gold-gradient palette and comparative head-to-head radar chart.

### R4. Automated Testing
- Implement `src/components/tools/WorldCupSimulator.test.ts` verifying ELO boosts, draw/win partitions, Poisson alignment, group ranking tie-breakers, 3rd place selection, and knockout simulations.

## Acceptance Criteria

### Technical SEO & Localization compliance
- [ ] `npm run qa:seo-governance` completes with 0 errors.
- [ ] Translation keys match all 10 locales with correct character limits.

### Build and Compilation
- [ ] `npm run check` completes with 0 errors/warnings.
- [ ] `npm run build` completes successfully.

### Runtime Simulation & Odds Integrity
- [ ] Group stage ranking matches expected tie-breakers.
- [ ] Champions distribution of 10,000 runs completes smoothly without blocking UI thread.
- [ ] Moving Home Advantage slider to 10 significantly increases win probability of USA, Mexico, and Canada on ECharts visualizer.
