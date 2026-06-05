# Project Roadmap: 2026 World Cup Monte Carlo Probability Simulator

This roadmap outlines the design, implementation, and verification steps for the **2026 World Cup Monte Carlo Probability Simulator** (`world-cup-simulator`).

---

## 1. Project Overview
A web-based analytical tool allowing users to simulate the 48-team 2026 FIFA World Cup. It calculates team advancement odds through 10,000 Monte Carlo simulations using FIFA/Elo ratings, custom home/heritage DNA sliders, and a wildcard chaos parameter.

- **Component**: `src/components/tools/WorldCupSimulator.svelte`
- **Engine**: `src/lib/runtime-integrity/world-cup-engine.ts`
- **Visualizations**: ECharts (Championship Probability bar, H2H Comparison radar)
- **Theme**: Strict Dark Obsidian Minimalist Swiss Gold Theme
- **Locales**: 10 languages (`ar`, `de`, `en`, `es`, `fr`, `ja`, `ko`, `pt`, `ru`, `zh`)

---

## 2. Project Plan & Milestones

```
+-----------------------------------------------------------------------------------+
|                                 ROADMAP & MILESTONES                              |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  MILESTONE 1             MILESTONE 2             MILESTONE 3             MILESTONE 4|
|  [Math & Engine] ------> [UI & ECharts] -------> [Locales & SEO] ------> [QA & Tests]
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Milestone 1: Math Engine Integrity & Test Verifications
- **Objective**: Ensure the Elo adjustment, Logistic win-draw-loss probability calculations, Poisson goal simulation, group standings sorting, best 3rd-places extraction, and knockout bracket tree are mathematically sound and performant.
- **Contract Input / Output**:
  - `adjustEloForTrioDNA`: Inputs (`baseElo`, `isHost`, `isHeritage`, `homeSlider`, `heritageSlider`) $\rightarrow$ Output `adjustedElo`
  - `calculateMatchProbability`: Inputs (`eloA`, `eloB`, `chaos`) $\rightarrow$ Output `{ probA, probB, probDraw }`
  - `simulateFullTournament`: Inputs (`homeSlider`, `heritageSlider`, `chaosSlider`) $\rightarrow$ Output comprehensive tournament stats
- **Files**:
  - `src/lib/runtime-integrity/world-cup-engine.ts`
  - `src/components/tools/WorldCupSimulator.test.ts`
- **Verification**:
  - Run Vitest suite:
    ```bash
    npx vitest run src/components/tools/WorldCupSimulator.test.ts
    ```

### Milestone 2: UI Presentation & ECharts Lifecycle Verification
- **Objective**: Verify that the Svelte 5 component implements non-blocking batch calculations (using `requestAnimationFrame`) and ECharts Wrapper manages lifecycle, theme synchronization, and responsive resize events.
- **Contract Input / Output**:
  - `EChartsWrapper` instantiation with reactive options (`championChartOption`, `radarChartOption`).
  - Dark mode MutationObserver handles color updates to gold-champagne (`#c5a059`), gold-bronze (`#8a6623`), and background (`#0a0a0a`) tokens.
- **Files**:
  - `src/components/tools/WorldCupSimulator.svelte`
  - `src/components/tools/EChartsWrapper.svelte`
  - `src/hooks/useChartTheme.ts`
- **Verification**:
  - Run theme parity checks:
    ```bash
    npm run qa:theme-parity
    ```

### Milestone 3: Multilingual Compliance & SEO Constraints Audit
- **Objective**: Verify translation consistency, keyword integrity, and strict CJK vs. phonetic SEO description length limits.
- **Contract Input / Output**:
  - CJK locales (`zh`, `ja`, `ko`) description length $\in [70, 140]$ characters.
  - Latin/Phonetic locales (`en`, `es`, `fr`, `pt`, `de`, `ru`, `ar`) description length $\in [120, 160]$ characters.
  - All JSON files follow `{ detailed_description, usage_steps, usage_examples, faqs }` structure.
- **Files**:
  - `src/messages/[locale]/tools/world-cup-simulator.json` (10 folders)
- **Verification**:
  - Run localization lint checks:
    ```bash
    npm run qa:tool-locales
    ```

### Milestone 4: Comprehensive QA & Production Smoke Tests
- **Objective**: Confirm standard system routing, module lazy-loading maps, type safety, and production build readiness.
- **Files**:
  - `src/config/tools/fun.ts`
  - `src/components/tools/ToolImportMap.ts`
- **Verification**:
  - Run production checks:
    ```bash
    npm run qa:production
    ```
