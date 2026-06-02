# 2026 World Cup Monte Carlo Probability Simulator Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate a premium 2026 FIFA World Cup Monte Carlo Probability Simulator (slug: `world-cup-simulator`, component: `WorldCupSimulator.svelte`) with 10-locale SEO-governed translations, Swiss matte gold aesthetic, and ECharts dynamic odds visualization.

**Architecture:** A Svelte 5 interactive widget featuring dynamic Elo-tuning sliders, non-blocking asynchronous Monte Carlo simulation (10,000 runs) employing Poisson-like goals generators for tie-breakers, official 2026 knockout bracket pathing, and an interactive gold-themed ECharts dashboard.

**Tech Stack:** Astro 5, Svelte 5 (Runes), ECharts, TypeScript, Vitest.

---

## Chunk 1: Locale Translations and Tool Metadata Registration

### Task 1: Create 10 Localized Translation Files
**Files:**
- Create: `src/messages/zh/tools/world-cup-simulator.json`
- Create: `src/messages/en/tools/world-cup-simulator.json`
- Create: `src/messages/es/tools/world-cup-simulator.json`
- Create: `src/messages/pt/tools/world-cup-simulator.json`
- Create: `src/messages/fr/tools/world-cup-simulator.json`
- Create: `src/messages/de/tools/world-cup-simulator.json`
- Create: `src/messages/ru/tools/world-cup-simulator.json`
- Create: `src/messages/ja/tools/world-cup-simulator.json`
- Create: `src/messages/ko/tools/world-cup-simulator.json`
- Create: `src/messages/ar/tools/world-cup-simulator.json`

- [ ] **Step 1: Write localized translation files**
  Include exact localized translations matching character/length restrictions. Populate each locale with appropriate language-specific text structures:
  
  *Example (en/tools/world-cup-simulator.json):*
  ```json
  {
    "detailed_description": "Free 2026 World Cup simulator. Run 10k Monte Carlo simulations with Elo ratings, custom host/heritage sliders, and sleek gold ECharts. 100% offline.",
    "usage_steps": [
      "Adjust the Host, Heritage, and Chaos sliders to modify ratings",
      "Select your two favorite teams to focus on their face-off odds",
      "Click the Simulating button to execute 10,000 Monte Carlo runs",
      "Review the Champion Probability ECharts and comparison stats"
    ],
    "usage_examples": [
      "Simulate the impact of high chaos on dark horse underdogs",
      "Forecast USA/Mexico advancement with maxed out Home Advantage",
      "Compare Argentina vs Brazil potential final showdown odds"
    ],
    "faqs": [
      {
        "question": "How does the simulation model matches?",
        "answer": "Matches are simulated using Elo rating equations, adding draw probabilities (26% base) and a Poisson goals generator to support sychronized goal-difference tie-breakers."
      },
      {
        "question": "Is my prediction data uploaded to servers?",
        "answer": "No. The entire Monte Carlo engine runs locally inside your browser, providing 100% data privacy."
      }
    ]
  }
  ```

  For each language, apply the exact translations provided in Section 5 of [world-cup-simulator-design.md](file:///Users/kaka/Dev/u2tool/docs/superpowers/specs/2026-06-02-world-cup-simulator-design.md).
- [ ] **Step 2: Commit translation bundles**
  Run:
  ```bash
  git add src/messages/*/tools/world-cup-simulator.json
  git commit -m "chore(i18n): create localized translation JSON files for 2026 world cup simulator"
  ```

---

### Task 2: Register Tool Metadata inside Base Locale Translation Modules
**Files:**
- Modify: `src/messages/zh/base.json` (Register `world-cup-simulator` namespace and metadata)
- Modify: `src/messages/en/base.json`
- Modify: `src/messages/es/base.json`
- Modify: `src/messages/pt/base.json`
- Modify: `src/messages/fr/base.json`
- Modify: `src/messages/de/base.json`
- Modify: `src/messages/ru/base.json`
- Modify: `src/messages/ja/base.json`
- Modify: `src/messages/ko/base.json`
- Modify: `src/messages/ar/base.json`

- [ ] **Step 1: Modify base locale files**
  Populate the `world-cup-simulator` key under the `"tools"` object block using the exact, certified translations:
  - **zh/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "2026世界杯夺冠概率模拟器",
      "description": "免费2026美加墨世界杯模拟器。采用蒙特卡洛算法与Elo等级分，支持东道主优势与豪门底蕴三维加成调节，一键跑分十万次对决，瑞士私银暗金大屏，纯前端精算，保护隐私安全。"
    }
    ```
  - **en/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "2026 World Cup Monte Carlo Simulator",
      "description": "Free 2026 World Cup simulator. Run 10k Monte Carlo simulations with Elo ratings, custom host/heritage sliders, and sleek gold ECharts. 100% offline."
    }
    ```
  - **es/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "Simulador de Probabilidades del Mundial 2026",
      "description": "Simulador del Mundial 2026 gratis. Dirige 10k simulaciones de Montecarlo con Elo, deslizadores de local/herencia y gráficos oro mate de ECharts. 100% local."
    }
    ```
  - **pt/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "Simulador da Copa do Mundo 2026",
      "description": "Simulador da Copa do Mundo 2026 grátis. Execute 10k simulações de Monte Carlo com Elo, controles de anfitrião/tradição e gráficos ouro fosco no cliente."
    }
    ```
  - **ja/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "2026W杯モンテカルロシミュレーター",
      "description": "無料2026W杯シミュレーター。モンテカルロ法とEloレーティングを用い、ホスト国や伝統国の補正スライダーとマットゴールド of ECharts搭載。ブラウザ実行で完全保護。"
    }
    ```
  - **ko/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "2026 월드컵 몬테카를로 시뮬레이터",
      "description": "무료 2026 월드컵 시뮬레이터. 몬테카를로 알고리즘과 Elo 레이팅을 사용하며, 개최국 및 전통 강호 슬라이더 조절과 매트 골드 ECharts 차트를 지원합니다."
    }
    ```
  - **fr/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "Simulateur de la Coupe du Monde 2026",
      "description": "Simulateur gratuit de la Coupe du Monde 2026. Lancez 10k simulations de Monte Carlo avec Elo, curseurs hôte/tradition et graphiques ECharts or mat. 100% local."
    }
    ```
  - **de/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "WM 2026 Monte-Carlo-Simulator",
      "description": "Kostenloser WM 2026 Simulator. Führen Sie 10k Monte-Carlo-Simulationen mit Elo-Klassen, Gastgeber/Tradition-Reglern und edlen ECharts aus. 100% offline."
    }
    ```
  - **ru/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "Симулятор Чемпионата Мира по футболу 2026",
      "description": "Бесплатный симулятор ЧМ-2026. Запуск 10к симуляций Монте-Карло с рейтингом Elo, настройкой хозяев/традиций и золотыми графиками ECharts. 100% на клиенте."
    }
    ```
  - **ar/base.json**:
    ```json
    "world-cup-simulator": {
      "name": "محاكي كأس العالم 2026 مونت كارلو",
      "description": "محاكي كأس العالم 2026 المجاني. تشغيل 10 آلاف محاكاة مونت كارلو مع تصنيف Elo، وتعديلات المضيف/التقاليد، ومخططات ECharts الذهبية الأنيقة. محلي 100%."
    }
    ```
- [ ] **Step 2: Commit metadata registrations**
  Run:
  ```bash
  git add src/messages/*/base.json
  git commit -m "chore(i18n): register base.json metadata namespaces for world-cup-simulator"
  ```

---

### Task 3: Register Tool Route Configuration
**Files:**
- Modify: `src/config/tools/fun.ts` (Add `world-cup-simulator` config block)

- [ ] **Step 1: Inject tool registration**
  Add the following object to the end of the config array inside [fun.ts](file:///Users/kaka/Dev/u2tool/src/config/tools/fun.ts):
  ```typescript
  {
    slug: 'world-cup-simulator',
    category: 'fun',
    icon: 'gamepad-2',
    component: 'WorldCupSimulator'
  }
  ```
- [ ] **Step 2: Generate dynamic Svelte compilation loader mapping**
  Run:
  ```bash
  npx tsx scripts/tools/generate-import-map.ts
  ```
- [ ] **Step 3: Commit config registration**
  Run:
  ```bash
  git add src/config/tools/fun.ts src/components/tools/ToolImportMap.ts
  git commit -m "feat(config): register world-cup-simulator config and refresh import loaders map"
  ```

---

## Chunk 2: Mathematical Simulation Engine Implementation & Svelte 5 Component

### Task 4: Write the Mathematical Simulation Logic & Unit Tests (TDD)
**Files:**
- Create: `src/components/tools/WorldCupSimulator.test.ts`
- Create: `src/lib/runtime-integrity/world-cup-engine.ts`

- [ ] **Step 1: Write comprehensive failing Vitest unit tests**
  Draft `src/components/tools/WorldCupSimulator.test.ts` to fully test Elo calculations, Poisson goals simulation, Group rankings, and Knockout rules:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { 
    adjustEloForTrioDNA, 
    calculateMatchProbability, 
    simulateMatchGoals,
    rankGroup,
    selectBestThirdPlaces,
    simulateKnockoutBracket,
    type Team,
    type MatchResult
  } from '../../lib/runtime-integrity/world-cup-engine';

  describe('World Cup Simulator TDD Suite', () => {
    it('should adjust Elo based on Home Advantage and Heritage DNA boosts', () => {
      // France (2040) is Heritage but not Host
      const eloFranceAdjusted = adjustEloForTrioDNA(2040, false, true, 5, 10); // max Heritage (140)
      expect(eloFranceAdjusted).toBe(2040 + 140);

      // Mexico (1710) is Host but not Heritage
      const eloMexicoAdjusted = adjustEloForTrioDNA(1710, true, false, 8, 5); // 0.8 * 150 = 120 Host boost
      expect(eloMexicoAdjusted).toBe(1710 + 120);
    });

    it('should calculate win-draw-loss probability partitions', () => {
      const { probA, probB, probDraw } = calculateMatchProbability(1800, 1800, 0); // equal rating, 0 chaos
      expect(probDraw).toBeCloseTo(0.26, 2);
      expect(probA).toBeCloseTo(0.37, 2);
      expect(probB).toBeCloseTo(0.37, 2);
      expect(probA + probB + probDraw).toBeCloseTo(1.0, 5);
    });

    it('should generate Poisson goals and resolve win/loss contradictions', () => {
      // If Team A has significantly higher Elo and wins the probability partition
      const result = simulateMatchGoals(2000, 1500, 'win'); // Team A wins
      expect(result.goalsA).toBeGreaterThanOrEqual(result.goalsB);
      
      // If result contradicts, engine must adjust it by 1 goal
      const resultDraw = simulateMatchGoals(1800, 1800, 'draw');
      expect(resultDraw.goalsA).toBe(resultDraw.goalsB);
    });

    it('should correctly rank groups using FIFA tie-breakers (Points, GD, Goals, H2H)', () => {
      const teams: Team[] = [
        { id: 'USA', name: 'United States', elo: 1780, points: 0, gd: 0, goalsFor: 0 },
        { id: 'SUI', name: 'Switzerland', elo: 1820, points: 0, gd: 0, goalsFor: 0 },
        { id: 'CMR', name: 'Cameroon', elo: 1610, points: 0, gd: 0, goalsFor: 0 },
        { id: 'IRQ', name: 'Iraq', elo: 1550, points: 0, gd: 0, goalsFor: 0 }
      ];

      const matches: MatchResult[] = [
        { teamA: 'USA', teamB: 'SUI', goalsA: 2, goalsB: 1 }, // USA: 3pts, +1GD
        { teamA: 'CMR', teamB: 'IRQ', goalsA: 1, goalsB: 1 }, // CMR: 1pt, 0GD. IRQ: 1pt, 0GD
        { teamA: 'USA', teamB: 'CMR', goalsA: 3, goalsB: 0 }, // USA: 6pts, +4GD
        { teamA: 'SUI', teamB: 'IRQ', goalsA: 2, goalsB: 0 }, // SUI: 3pts, +1GD
        { teamA: 'USA', teamB: 'IRQ', goalsA: 1, goalsB: 1 }, // USA: 7pts, +4GD
        { teamA: 'SUI', teamB: 'CMR', goalsA: 1, goalsB: 0 }  // SUI: 6pts, +2GD
      ];

      const ranked = rankGroup(teams, matches);
      expect(ranked[0].id).toBe('USA');
      expect(ranked[1].id).toBe('SUI');
    });

    it('should select top 8 third-placed teams from 12 groups', () => {
      const thirdPlaceTeams: Team[] = Array.from({ length: 12 }, (_, i) => ({
        id: `T${i}`,
        name: `Team ${i}`,
        elo: 1600,
        points: i % 3 === 0 ? 4 : (i % 3 === 1 ? 3 : 2), // Some have 4pts, 3pts, 2pts
        gd: i - 6, // ranges from -6 to +5
        goalsFor: i
      }));

      const advanced = selectBestThirdPlaces(thirdPlaceTeams);
      expect(advanced.length).toBe(8);
      // Team with 4pts should rank higher than team with 2pts
      expect(advanced[0].points).toBeGreaterThanOrEqual(advanced[7].points);
    });

    it('should run a knockout bracket to produce a champion', () => {
      const qualified = Array.from({ length: 32 }, (_, i) => ({
        id: `Q${i}`,
        name: `Qualified ${i}`,
        elo: 1700 + i * 10
      }));

      const champion = simulateKnockoutBracket(qualified);
      expect(champion).toBeDefined();
      expect(champion.elo).toBeGreaterThan(1600);
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx vitest run src/components/tools/WorldCupSimulator.test.ts`
  Expected: FAIL (modules and exports not defined)
- [ ] **Step 3: Implement the 2026 World Cup simulator mathematical engine**
  Write full logic inside `src/lib/runtime-integrity/world-cup-engine.ts` including the baseline 48-team groups database, Poisson generator, group-tiebreaker matrix, 3rd place filter, and knockout bracket:
  ```typescript
  export interface Team {
    id: string;
    name: string;
    elo: number;
    points: number;
    gd: number;
    goalsFor: number;
  }

  export interface MatchResult {
    teamA: string;
    teamB: string;
    goalsA: number;
    goalsB: number;
  }

  // 1. Trio DNA Strength Adjustment Formula
  export function adjustEloForTrioDNA(
    baseElo: number, 
    isHost: boolean, 
    isHeritage: boolean, 
    homeSlider: number, 
    heritageSlider: number
  ): number {
    const hostBoost = isHost ? (homeSlider / 10) * 150 : 0;
    const heritageBoost = isHeritage ? (heritageSlider / 10) * 140 : 0;
    return baseElo + hostBoost + heritageBoost;
  }

  // 2. Win-Draw-Loss Probability Calculator (using Chaos Thermodynamic scale)
  export function calculateMatchProbability(eloA: number, eloB: number, chaos: number) {
    const chaosScale = 1 + (chaos / 10) * 1.5;
    const expWinA = 1 / (1 + Math.pow(10, (eloB - eloA) / (400 * chaosScale)));
    const probDraw = 0.26 * Math.exp(-Math.pow((eloA - eloB) / 300, 2));
    const probA = expWinA * (1 - probDraw);
    const probB = (1 - expWinA) * (1 - probDraw);
    return { probA, probB, probDraw };
  }

  // Helper for generating Poisson random number
  function poissonRandom(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  }

  // 3. Poisson Goals Generator with Outcome Alignment
  export function simulateMatchGoals(eloA: number, eloB: number, outcome: 'win' | 'loss' | 'draw'): { goalsA: number, goalsB: number } {
    const lambdaA = Math.max(0.2, 1.3 + (eloA - eloB) / 400);
    const lambdaB = Math.max(0.2, 1.3 + (eloB - eloA) / 400);
    
    let goalsA = poissonRandom(lambdaA);
    let goalsB = poissonRandom(lambdaB);

    // Resolve Poisson contradiction with outcome space
    if (outcome === 'win' && goalsA <= goalsB) {
      goalsA = goalsB + 1;
    } else if (outcome === 'loss' && goalsB <= goalsA) {
      goalsB = goalsA + 1;
    } else if (outcome === 'draw' && goalsA !== goalsB) {
      const avg = Math.round((goalsA + goalsB) / 2);
      goalsA = avg;
      goalsB = avg;
    }

    return { goalsA, goalsB };
  }

  // 4. FIFA Group Stage Standings Sorter
  export function rankGroup(teams: Team[], matches: MatchResult[]): Team[] {
    const standings = teams.map(t => ({ ...t, points: 0, gd: 0, goalsFor: 0 }));
    
    matches.forEach(m => {
      const tA = standings.find(t => t.id === m.teamA)!;
      const tB = standings.find(t => t.id === m.teamB)!;
      
      tA.goalsFor += m.goalsA;
      tB.goalsFor += m.goalsB;
      tA.gd += (m.goalsA - m.goalsB);
      tB.gd += (m.goalsB - m.goalsA);

      if (m.goalsA > m.goalsB) {
        tA.points += 3;
      } else if (m.goalsA < m.goalsB) {
        tB.points += 3;
      } else {
        tA.points += 1;
        tB.points += 1;
      }
    });

    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.goalsFor - a.goalsFor; // Simplified (excluding head-to-head mapping)
    });
  }

  // 5. 2026 Best 3rd-Places filtering
  export function selectBestThirdPlaces(thirdPlaces: Team[]): Team[] {
    return [...thirdPlaces].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.goalsFor - a.goalsFor;
    }).slice(0, 8);
  }

  // 6. 32-Team Elimination Bracket
  export function simulateKnockoutBracket(teams: { id: string, name: string, elo: number }[]): { id: string, name: string, elo: number } {
    let currentRound = [...teams];
    while (currentRound.length > 1) {
      const nextRound: typeof currentRound = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        const teamA = currentRound[i];
        const teamB = currentRound[i+1];
        // Calculate standard probability to determine winner
        const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
        const winner = Math.random() < expWinA ? teamA : teamB;
        nextRound.push(winner);
      }
      currentRound = nextRound;
    }
    return currentRound[0];
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run src/components/tools/WorldCupSimulator.test.ts`
  Expected: PASS
- [ ] **Step 5: Commit math engine**
  Run:
  ```bash
  git add src/lib/runtime-integrity/world-cup-engine.ts src/components/tools/WorldCupSimulator.test.ts
  git commit -m "test(math): implement and verify world cup match probability partition model with Poisson goals and 3rd place selection"
  ```

---

### Task 5: Build Svelte 5 Obsidian Matte Gold User Interface
**Files:**
- Create: `src/components/tools/WorldCupSimulator.svelte`

- [ ] **Step 1: Write Svelte 5 UI structure with Trio DNA controls**
  * Layout requirements: Use a strict dark titanium-gold wrapper to enforce Matte Gold visual standards irrespective of global theme:
    ```svelte
    <div class="dark bg-stone-950 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-2xl font-sans leading-relaxed selection:bg-amber-500/30">
      <!-- Title utilizing 'Outfit' typography -->
      <h1 class="font-outfit text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 bg-clip-text text-transparent">...</h1>
    </div>
    ```
  * Incorporate 3 custom sliders representing the Trio Tuning factors: Home Advantage, Heritage Boost, and Wildcard Chaos.
  * Integrate non-blocking batch execution for the 10,000 Monte Carlo runs to protect page performance:
    ```typescript
    let simProgress = $state(0);
    let isSimulating = $state(false);

    function triggerSimulation() {
      isSimulating = true;
      let iteration = 0;
      const batchSize = 250;
      
      function executeBatch() {
        if (iteration >= 10000) {
          isSimulating = false;
          return;
        }
        for (let b = 0; b < batchSize; b++) {
          runSingleWorldCupSimulation();
          iteration++;
        }
        simProgress = (iteration / 10000) * 100;
        requestAnimationFrame(executeBatch); // non-blocking main loop
      }
      executeBatch();
    }
    ```
  * Design a high-fidelity glassmorphic overlay containing a pulsing 3D Gold Trophy SVG element when `isSimulating` resolves to `true`.
- [ ] **Step 2: Bind ECharts interactive dashboard**
  * Integrate ECharts to draw a horizontal Champion Win Probability bar chart.
  * Apply a luxury gold-gradient palette:
    ```javascript
    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: '#D4AF37' }, // Matte Gold
      { offset: 1, color: '#B8860B' }  // Dark Goldenrod
    ])
    ```
  * Setup a comparative radar chart showing selected head-to-head teams.
- [ ] **Step 3: Verify Astro 6 build compilation**
  Run: `npm run build`
  Expected: Success, no compilation noise.
- [ ] **Step 4: Commit Svelte component**
  Run:
  ```bash
  git add src/components/tools/WorldCupSimulator.svelte
  git commit -m "feat(fun): implement WorldCupSimulator Svelte 5 component with ECharts and non-blocking calculations"
  ```

---

## Chunk 3: Final Production Gates Verification

### Task 6: Run Local QA Gates and Verify Sitemap/SEO Parity
**Files:**
- None (Test runs only)

- [ ] **Step 1: Temporarily modify wrangler.jsonc to run local routes validation**
  Comment out `"remote": true` inside the `AI_DISCOVERY_TELEMETRY` binding in `wrangler.jsonc` to bypass Cloudflare network API checks.
- [ ] **Step 2: Run all SEO and i18n validator suites**
  Run: `npm run qa:seo-governance`
  Expected: 183+ tests pass, including the 10-locale length constraints.
- [ ] **Step 3: Run runtime-integrity tests**
  Run: `npm run qa:runtime-integrity`
  Expected: 44 tests pass.
- [ ] **Step 4: Re-enable remote: true in wrangler.jsonc**
  Restore the `"remote": true` flag in `wrangler.jsonc` exactly as it was.
- [ ] **Step 5: Manually Validate Core Interactive Scenarios**
  * Launch development server: `npm run dev` and navigate to `/world-cup-simulator`.
  * Validate East Coast Host Bias: Slide the Home Advantage tuning factor to `10` and confirm that host nations (`USA`, `Mexico`, `Canada`) experience a substantial boost, rising dynamically on ECharts win-odds.
  * Validate UI Flow: Run the 10,000-match simulation and ensure the SVG gold trophy glows/pulses and progress slider functions at a steady 60fps without any lag or frame stuttering.
  * Validate Strict Dark Theme: Check contrast of gold text elements to ensure they conform with WCAG Contrast guidelines on the dark-titanium background.
- [ ] **Step 6: Commit final check status**
  Run:
  ```bash
  git commit -am "chore(release): complete World Cup Monte Carlo simulator and close release gates"
  ```
