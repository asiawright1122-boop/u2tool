# Review Handoff Report — World Cup Monte Carlo Probability Simulator

## 1. Observation
- **Unit Tests**: Executing `npx vitest run src/components/tools/WorldCupSimulator.test.ts` passed all 6 tests:
  ```
  Test Files  1 passed (1)
        Tests  6 passed (6)
  ```
- **Theme Parity**: Executing `npm run qa:theme-parity` passed all 15 tests:
  ```
  Test Files  3 passed (3)
        Tests  15 passed (15)
  ```
- **SEO Governance**: Executing `npm run qa:seo-governance` passed 187/187 tests:
  ```
  Test Files  16 passed (16)
        Tests  187 passed (187)
  ```
- **Compilation Check**: Executing `npm run check` completed with:
  ```
  Result (255 files): 
  - 0 errors
  - 0 warnings
  - 8 hints
  ```
- **Production Build**: Executing `npm run build` compiled successfully when conflicts with the dev server are avoided:
  ```
  16:29:44 [copy-message-assets] Copied message assets to /Users/kaka/Dev/u2tool/dist/client/messages/
  16:29:44 [build] Server built in 68.01s
  16:29:44 [build] Complete!
  ```
- **Localization Files**: 10 locale translation files are present at `src/messages/[locale]/tools/world-cup-simulator.json` for locales `ar`, `de`, `en`, `es`, `fr`, `ja`, `ko`, `pt`, `ru`, `zh`.
- **Slugs Registration**: Slug `world-cup-simulator` is registered in `src/config/tools/fun.ts`.
- **Missing Translation Keys**: In the base locale files (e.g., `src/messages/en/base.json` lines 16209–16212 and `src/messages/zh/base.json` lines 21934–21937), the `world-cup-simulator` registration block contains only `name` and `description` keys, but lacks the mandatory `seo_title` and `seo_description` keys:
  ```json
  "world-cup-simulator": {
    "name": "2026 World Cup Monte Carlo Simulator",
    "description": "Free 2026 World Cup simulator. Run 10k Monte Carlo simulations with Elo ratings, custom host/heritage sliders, and sleek gold ECharts. 100% offline."
  }
  ```
- **Locale Validation Run**: Executing `npx tsx scripts/validation/validate-tool-locales.ts world-cup-simulator` results in:
  ```
  Error: Missing translation key: tools.world-cup-simulator.seo_title
      at getRequiredString (/Users/kaka/Dev/u2tool/scripts/validation/validate-tool-locales.ts:312:13)
  ```
- **Engine Logic**: Reviewed `src/lib/runtime-integrity/world-cup-engine.ts` and verified the ELO formula:
  - Line 109–110: `const hostBoost = isHost ? (homeSlider / 10) * 150 : 0; const heritageBoost = isHeritage ? (heritageSlider / 10) * 140 : 0;` matching requirements exactly.
  - Line 118: `const probDraw = 0.26 * Math.exp(-Math.pow((eloA - eloB) / 300, 2));` centered correctly on ELO delta.
  - Line 136–156: `simulateMatchGoals` generates independent Poisson values and aligns them with outcome space correctly.
- **UI Reactivity & Non-blocking Simulation**: Verified in `src/components/tools/WorldCupSimulator.svelte` that the Monte Carlo loops run asynchronously in batches of 250 using `setTimeout` and `requestAnimationFrame`, preventing UI freeze. ECharts rendering in `src/components/tools/EChartsWrapper.svelte` dynamically loads chunks using `requestIdleCallback`.

---

## 2. Logic Chain
- **LC-1 (Correctness of Engine)**: Because the mathematical simulator code directly implements the required formulas (Trio DNA rating adjusts using $150 \times \text{slider}/10$ for hosts and $140 \times \text{slider}/10$ for heritage teams; draw probability decays from 26% based on Elo delta; goals resolve using Poisson distributions aligned to output spaces), and all vitest unit tests verify these functions and pass, R1 is mathematically correct.
- **LC-2 (UI Reactivity)**: Because ECharts wrapper loads asynchronously via `requestIdleCallback` and resizes dynamically, and the Svelte component slices 10,000 runs into async batches using `requestAnimationFrame`, the UI meets the R3 requirements without blocking the event loop.
- **LC-3 (Missing SEO Translations)**: Because the tool locales validator at `scripts/validation/validate-tool-locales.ts` asserts that each tool registered in the workspace has `tools.<slug>.seo_title` and `tools.<slug>.seo_description` keys present under `base.json`, and both `src/messages/en/base.json` and other translation files are missing these keys for `world-cup-simulator`, the localized SEO validation script crashes on execution.
- **LC-4 (Verdict)**: Therefore, due to the missing SEO locale keys which are mandatory for technical SEO and build verification compliance (R2), the work product must be rejected.

---

## 3. Caveats
- The Puppeteer page validation check for tool locales (`npx tsx scripts/validation/validate-tool-locales.ts`) will fail to establish a connection if there is no local dev/preview server listening on port 4321. We verified this by running `npm run preview` beforehand to expose the port.
- No other caveats.

---

## 4. Conclusion
- **Verdict**: `REQUEST_CHANGES`
- **Critical Finding**: Missing `seo_title` and `seo_description` translation keys for the `world-cup-simulator` key inside all `src/messages/[locale]/base.json` files (e.g. `en/base.json`, `zh/base.json`). This violates R2 SEO guidelines and breaks the `validate-tool-locales` script.
- **Actionable Fix**: Add `seo_title` and `seo_description` strings to `world-cup-simulator` under `"tools"` in all 10 `base.json` files, e.g. for `en/base.json`:
  ```json
  "world-cup-simulator": {
    "name": "2026 World Cup Monte Carlo Simulator",
    "description": "Free 2026 World Cup simulator. Run 10k Monte Carlo simulations with Elo ratings, custom host/heritage sliders, and sleek gold ECharts. 100% offline.",
    "seo_title": "2026 World Cup Monte Carlo Probability Simulator - Free Online Analytics",
    "seo_description": "Free online 2026 World Cup simulator. Simulate 10,000 matches with Elo ratings, Trio DNA, and Wildcard Chaos. View champion odds on beautiful dark-gold ECharts."
  }
  ```

---

## 5. Verification Method
1. Start the preview server:
   ```bash
   npm run preview
   ```
2. Run the locale validation command specifically for `world-cup-simulator`:
   ```bash
   npx tsx scripts/validation/validate-tool-locales.ts world-cup-simulator
   ```
3. The check will pass successfully once the keys are added in all 10 `base.json` files.
