import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/** Independent diagnostics: retain all results and fail overall if ANY check fails. */
export async function runChecks(checks) {
  const results = [];
  for (const check of checks) {
    const started = Date.now();
    const result = await new Promise(resolve => {
      const child = spawn(check.command, check.args, { stdio: 'inherit', env: process.env });
      child.once('error', error => resolve({ exitCode: 1, error: error.message }));
      child.once('exit', (code, signal) => resolve({ exitCode: code ?? 1, signal }));
    });
    results.push({ name: check.name, ...result, durationMs: Date.now() - started });
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const names = process.argv.slice(2);
  if (!names.length) throw new Error('Provide npm script names to validate.');
  const results = await runChecks(names.map(name => ({ name, command: 'npm', args: ['run', name] })));
  fs.mkdirSync('artifacts/validation', { recursive: true });
  fs.writeFileSync('artifacts/validation/postbuild-results.json', JSON.stringify({
    checkedAt: new Date().toISOString(), revision: process.env.GITHUB_SHA ?? null, results,
  }, null, 2));
  console.log(JSON.stringify(results, null, 2));
  process.exitCode = results.some(result => result.exitCode !== 0) ? 1 : 0;
}
