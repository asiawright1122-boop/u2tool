## 2026-06-04T07:20:19Z
You are teamwork_preview_explorer. Your working directory is `/Users/kaka/Dev/u2tool/.agents/explorer_initial_planning`.
Your task is to explore the codebase and draft a comprehensive technical analysis and decomposition plan for the 2026 World Cup Monte Carlo Probability Simulator (slug: `world-cup-simulator`, component: `WorldCupSimulator.svelte`).

Specifically, you need to:
1. Research existing tools using Svelte 5 and ECharts. Look at `src/components/tools/` for examples of:
   - Svelte 5 reactivity (runes: $state, $derived, $effect).
   - ECharts integration (especially responsive charts, dark mode themes).
   - Strict Dark Mode container styled with dark titanium-gold themes (how styling is scoped, color tokens used).
2. Examine the localization setup:
   - Check existing tools under `src/messages/[locale]/tools/` to see their structure.
   - Investigate the 10 locales currently supported in the system.
   - Verify the CJK (70-100 chars) and phonetic (120-160 chars) SEO rules for descriptions/examples/FAQs.
   - Verify how base.json is structured under "tools".
3. Check the tool registration and import map:
   - Look at `src/config/tools/fun.ts` and `src/components/tools/ToolImportMap.ts`.
   - See how `scripts/generate-tool-import-map.ts` is invoked.
4. Examine the testing patterns:
   - Look at existing tests under `src/components/tools/*.test.ts` or similar files.
   - Check vitest config.
5. Create a detailed analysis and draft the global `PROJECT.md` plan. The project plan must include:
   - Architecture details (how the simulation engine interacts with the UI, where Elo formulas and goals generators reside, shared interfaces).
   - A proposed decomposition into 4 milestones:
     - M1: Simulation Engine (Elo, Win/Draw/Loss probability with Wildcard Chaos scaling, Poisson goal generator, FIFA group stage sorter, 3rd place selection, 32-team elimination bracket).
     - M2: Svelte 5 Component & ECharts UI (requestAnimationFrame/setTimeout queue for 10k runs, strict dark titanium-gold theme, Outfit/Inter fonts, SVG trophy overlay, bar and radar charts).
     - M3: Localization, Registration & Route Configuration (10 locales base.json & tool-specific JSONs, ToolImportMap generation).
     - M4: Automated Testing & Verification (Vitest suite for M1/M2/M3 requirements).
   - Interface contracts (methods, signatures, data types, inputs/outputs for the engine and ECharts data format).
   - Code layout.

Write your findings and draft `PROJECT.md` content in `.agents/explorer_initial_planning/analysis.md`. Note that as a read-only explorer, you should document the findings and the proposed files perfectly. Let us know if you need any other tools or actions.
