# BRIEFING — 2026-06-04T16:20:51+08:00

## Mission
Empirically verify the correctness and performance of the 2026 World Cup Monte Carlo Probability Simulator.

## 🔒 My Identity
- Archetype: Empirical Challenger
- Roles: critic, specialist
- Working directory: /Users/kaka/Dev/u2tool/.agents/challenger_world_cup_2
- Original parent: 8919b044-e026-464a-8df6-006f7fa31bd7
- Milestone: Verification of World Cup Monte Carlo Simulator
- Instance: 1 of 1

## 🔒 Key Constraints
- Review-only — do NOT modify implementation code (our task is to design/execute tests and check correctness, but do not touch the main implementation code, though we can write test files/benchmarks to run verification)
- Default Chinese replies (默认中文回复)
- Do not trust unverified claims. Must run verification code ourselves.

## Current Parent
- Conversation ID: 8919b044-e026-464a-8df6-006f7fa31bd7
- Updated: 2026-06-04T16:21:40+08:00

## Review Scope
- **Files to review**: Simulation engine, group stage ranking logic, tournament simulations, performance and UI non-blocking behavior.
- **Interface contracts**: /Users/kaka/Dev/u2tool/PROJECT.md
- **Review criteria**: Correctness under stress, execution of 10,000 simulations, edge cases (home advantage impact), FIFA tie-breaker correctness.

## Key Decisions Made
- Created test file `/Users/kaka/Dev/u2tool/src/lib/runtime-integrity/world-cup-simulator-challenger.test.ts` to execute verification and benchmarks.
- Benchmarked 10k simulations (took ~967ms).
- Verified host boost (ELO +150, odds rise e.g. USA to reach knockout rises from 84.0% to 92.6%, and champion odds from 0.3% to 2.2%).
- Confirmed tie-breaker discrepancy: interactive calculator uses UEFA H2H-first rules, whereas simulation engine uses FIFA overall-GD-first rules.

## Artifact Index
- `/Users/kaka/Dev/u2tool/.agents/challenger_world_cup_2/handoff.md` — Verification handoff report.
- `/Users/kaka/Dev/u2tool/.agents/challenger_world_cup_2/original_prompt.md` — Copy of original instruction prompt.
- `/Users/kaka/Dev/u2tool/.agents/challenger_world_cup_2/progress.md` — Heartbeat tracking file.
- `/Users/kaka/Dev/u2tool/src/lib/runtime-integrity/world-cup-simulator-challenger.test.ts` — The challenger verification unit tests and benchmarks.

## Attack Surface
- **Hypotheses tested**: Host country odds boost, 10k performance limit, FIFA tie-breaker alignment.
- **Vulnerabilities found**: `computeGroupStandings` in `world-cup-calculator-engine.ts` implements UEFA-style tie-breakers rather than FIFA-style tie-breakers. This is a functional correctness bug for a World Cup application.
- **Untested angles**: Draw of lots fallback or other group size variants.

## Loaded Skills
- None loaded yet.
