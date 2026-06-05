## 2026-06-04T07:24:22Z
You are teamwork_preview_worker. Your working directory is `/Users/kaka/Dev/u2tool/.agents/worker_verification`.
Your task is to run the verification suite and build command for the 2026 World Cup Monte Carlo Probability Simulator to verify that everything is integrated and passing.

You must run:
1. Engine unit tests:
   ```bash
   npx vitest run src/components/tools/WorldCupSimulator.test.ts
   ```
2. Chart theme parity tests:
   ```bash
   npm run qa:theme-parity
   ```
3. Translation compliance tests:
   ```bash
   npm run qa:tool-locales
   ```
4. Full production build verification:
   ```bash
   npm run qa:production
   ```

Write a detailed handoff report in `.agents/worker_verification/handoff.md` detailing the commands run and their exact outcomes/logs.

MANDATORY INTEGRITY WARNING:
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.
