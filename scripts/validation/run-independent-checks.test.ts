import { expect, it } from 'vitest';
import { runChecks } from './run-independent-checks.mjs';

it('reports downstream checks even when an earlier check fails', async () => {
  const results = await runChecks([
    { name: 'fails', command: process.execPath, args: ['-e', 'process.exit(3)'] },
    { name: 'still-runs', command: process.execPath, args: ['-e', 'process.exit(0)'] },
  ]);
  expect(results.map(r => [r.name, r.exitCode])).toEqual([['fails', 3], ['still-runs', 0]]);
});
