# Forensic Audit & Handoff Report

This report presents the independent integrity audit of the 2026 World Cup Monte Carlo Probability Simulator, covering the simulation engine (`src/lib/runtime-integrity/world-cup-engine.ts`) and Svelte UI component (`src/components/tools/WorldCupSimulator.svelte`).

---

## 1. Forensic Audit Report (Integrity Verdict)

**Work Product**: 
- `src/lib/runtime-integrity/world-cup-engine.ts`
- `src/components/tools/WorldCupSimulator.svelte`

**Profile**: General Project (Development Mode)  
**Verdict**: **CLEAN**

### Phase Results
- **Hardcoded output detection**: **PASS** — Checked the engine source and Svelte components. No hardcoded results, fake outcomes, or test-bypassing output formatting were detected.
- **Facade detection**: **PASS** — Implementation uses genuine mathematical algorithms (Logistic probability, Poisson distributions, ELO Trio DNA adjustments) and fully executes 10,000 Monte Carlo runs using asynchronous batching (`requestAnimationFrame`).
- **Pre-populated artifact detection**: **PASS** — No fabricated logs, verification files, or mock results were pre-loaded in the workspace to satisfy test criteria.
- **Behavioral Verification (Test Suite Execution)**: **PASS** — All 16 unit and integration tests under the `Vitest` suite execute successfully.
- **Behavioral Verification (Build)**: **FAIL (Environment Issue)** — The build fails during `prebuild` (`prepare-public-messages.mjs`) with `ENOTEMPTY` directory error, unrelated to the World Cup simulator codebase itself.

---

## 2. 5-Component Handoff Report

### I. Observation
#### Observation 1: Knockout Stage Pairing Logic Bug (Severe)
In `src/lib/runtime-integrity/world-cup-engine.ts` lines 310-343:
```typescript
310:   // Combine top 2 from each group + 8 best third places to get 32 teams
311:   const qualifiedForKnockout = [...top2Teams, ...best3rdTeams].map(t => teamsMap.get(t.id)!);
...
325:   let currentRound = [...qualifiedForKnockout];
...
333:   // Round of 32
334:   let nextRound: typeof currentRound = [];
335:   for (let i = 0; i < currentRound.length; i += 2) {
336:     const teamA = currentRound[i];
337:     const teamB = currentRound[i+1];
338:     const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
339:     const winner = Math.random() < expWinA ? teamA : teamB;
340:     const loser = winner.id === teamA.id ? teamB : teamA;
341:     nextRound.push(winner);
342:     roundOf32Exits.push(loser.base);
343:   }
```
And how `top2Teams` is populated in lines 290-294:
```typescript
290:   const top2Teams: Team[] = [];
291:   groupStandings.forEach(ranked => {
292:     top2Teams.push(ranked[0]);
293:     top2Teams.push(ranked[1]);
294:   });
```
This forces `top2Teams` to be structured as `[A1, A2, B1, B2, ..., L1, L2]`. When combined with `best3rdTeams` at the tail and paired sequentially using `i += 2`, the match pairings for the Round of 32 are:
- `A1` vs `A2` (Group A 1st vs 2nd rematch)
- `B1` vs `B2` (Group B 1st vs 2nd rematch)
- ...
- `L1` vs `L2` (Group L 1st vs 2nd rematch)
- `3rd_1` vs `3rd_2`, `3rd_3` vs `3rd_4`, `3rd_5` vs `3rd_6`, `3rd_7` vs `3rd_8` (The 8 best third-placed teams play amongst themselves).

#### Observation 2: Group Stage Standings Sorter H2H Limitation (Minor)
In `src/lib/runtime-integrity/world-cup-engine.ts` lines 181-185:
```typescript
181:   return standings.sort((a, b) => {
182:     if (b.points !== a.points) return b.points - a.points;
183:     if (b.gd !== a.gd) return b.gd - a.gd;
184:     return b.goalsFor - a.goalsFor; // Simplified (excluding head-to-head mapping)
185:   });
```
When Points, Goal Difference (GD), and Goals For (GF) are fully tied, the sorting falls back to JavaScript's stable sort (maintaining array declaration order) instead of assessing the Head-to-Head (H2H) match result.
This behavior is confirmed by running the test suite:
`stdout | src/lib/runtime-integrity/world-cup-engine.test.ts > World Cup Monte Carlo Engine > 3. Group Stage Standings Sorter and Tie-Breakers > should reveal that the simulation engine does NOT implement H2H fallback when Points/GD/GF are fully tied`
Output:
```
Ranked result for full tie (Points, GD, GF equal, H2H favors T1):
[
  'T2: pts=3, gd=0, gf=2',
  'T1: pts=3, gd=0, gf=2',
  'T3: pts=3, gd=0, gf=1'
]
```
Even though T1 beat T2 in H2H, T2 is ranked above T1 because it was declared first in the input array.

#### Observation 3: UI Font Compliance Issue (Style Deviation)
In `src/components/tools/WorldCupSimulator.svelte` line 908:
```html
908:             <table class="w-full text-xs font-mono text-left border-collapse">
```
The advancement funnel comparative matrix table is styled with `font-mono`. However, the original project requirements (R3) state: `"Outfit font for headers/KPIs, Inter font for data grids"`. The `font-mono` class overrides the grid to a monospaced font instead of using the standard sans-serif (`font-sans`/Inter) font.

#### Observation 4: Build Pre-clean directory issue (Environment/Build failure)
Running `npm run build` fails at the `prebuild` step:
```
> astro-u2tool@0.0.1 prebuild
> node scripts/prepare-public-messages.mjs

[Error: ENOTEMPTY: directory not empty, rmdir '/Users/kaka/Dev/u2tool/public/messages//pt/tools'] {
  errno: -66,
  code: 'ENOTEMPTY',
  ...
}
```
This is caused by the filesystem cleaning script `scripts/prepare-public-messages.mjs` attempting to clean the `public/messages` directory while local directory watch/locks exist, preventing `rmdir` from executing successfully.

### II. Logic Chain
1. **Knockout Pairings**: By taking the `groupStandings` and sequentially pushing `[ranked[0], ranked[1]]` for each group, the resulting list maps adjacent elements (e.g. index 0 and 1) to the 1st and 2nd placed teams of the same group. When `simulateKnockoutBracket` or the inline simulation loop iterates by `i += 2` to pair `currentRound[i]` and `currentRound[i+1]`, it pairs `A1` and `A2`, `B1` and `B2`, etc. This leads to immediate same-group rematches in the Round of 32. Concurrently, the best 3rd-placed teams are appended together, forcing them to play each other. This violates FIFA bracket rules and guarantees 4 weak third-place teams advance to the Round of 16.
2. **Sorting Fallback**: Because `rankGroup` only compares `points`, `gd`, and `goalsFor` in its sort comparator, any total tie returns `0` in the comparator. Due to stable sorting, the original input order is preserved. Hence, H2H is not respected, which is a structural simplification compared to official FIFA tie-breakers.
3. **UI Styling**: The Svelte table element explicitly contains the `font-mono` utility class, which prevents the browser from rendering the data grid using the required Inter font family.
4. **Verdict Determination**: Under "Development Mode", code reuse and simplified logic are allowed, but cheating, facade implementations, and hardcoded test bypasses are prohibited. Since the calculations and 10k Monte Carlo simulations are genuinely implemented and run without hardcoded outcomes, the codebase does not violate development-level integrity guidelines, leading to a **CLEAN** verdict.

### III. Caveats
- Since this is an audit-only task, no implementation corrections were introduced. 
- The build failures are linked to the clean-up script in the repository environment and not the tool's runtime implementation. We did not run a full `npm run build` to end-of-lifecycle due to this prebuild script constraint.

### IV. Conclusion
The simulator implements the ELO Trio DNA adjustments, Poisson goals generator, and Monte Carlo trials genuinely and meets integrity guidelines (Verdict: **CLEAN**). However, the simulator has a **severe logic bug** in its knockout pairings (same-group rematches in R32 and self-paired third-place teams) that invalidates the realism of the simulator results. Additionally, it simplified away H2H tie-breakers and deviated from Svelte UI styling specs by using `font-mono` on data grids instead of the Inter font.

### V. Verification Method
#### 1. Running tests to confirm correct ELO boosts and stable sorting limitation:
Execute the following command in the project root:
```bash
npx vitest run src/components/tools/WorldCupSimulator.test.ts src/lib/runtime-integrity/world-cup-engine.test.ts
```
Verify that all 16 tests pass and inspect the stdout of the H2H tie-break test, showing that T2 remains ahead of T1.

#### 2. Confirming Knockout pairing logic bug:
Inspect lines 310-343 of `src/lib/runtime-integrity/world-cup-engine.ts`. Notice that `top2Teams` contains `[A1, A2, B1, B2...]` and they are matched sequentially in step 4 (`currentRound[i]` vs `currentRound[i+1]`), confirming immediate rematches.

#### 3. Confirming font mono styling:
Inspect line 908 of `src/components/tools/WorldCupSimulator.svelte` to find `<table class="w-full text-xs font-mono ...">`, showing the mono-spaced layout deviation.
