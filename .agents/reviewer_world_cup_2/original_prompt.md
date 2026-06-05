## 2026-06-04T08:20:51Z
You are teamwork_preview_reviewer. Your working directory is `/Users/kaka/Dev/u2tool/.agents/reviewer_world_cup_2`.
Your task is to review the code correctness, completeness, and robustness of the 2026 World Cup Monte Carlo Probability Simulator.
Please examine:
- The mathematical simulation engine at `src/lib/runtime-integrity/world-cup-engine.ts`.
- The Svelte component UI at `src/components/tools/WorldCupSimulator.svelte` and `src/components/tools/EChartsWrapper.svelte`.
- The translation locales at `src/messages/[locale]/tools/world-cup-simulator.json` and base translations.
- Verify that the requirements in `/Users/kaka/Dev/u2tool/ORIGINAL_REQUEST.md` (R1, R2, R3, R4) are met.
- Run any build/test commands as needed (like `npx vitest run src/components/tools/WorldCupSimulator.test.ts`, `npm run qa:theme-parity`, `npm run qa:tool-locales`, `npm run qa:production`).
Write a comprehensive handoff report at `/Users/kaka/Dev/u2tool/.agents/reviewer_world_cup_2/handoff.md` detailing your findings. Run the tests and document the results. Use send_message to report back when done.
