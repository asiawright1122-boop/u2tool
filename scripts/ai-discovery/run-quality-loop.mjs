#!/usr/bin/env node

import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_SUMMARY_OUT = 'docs/ai-discovery-telemetry-summary.md';
const DEFAULT_GENERATED_OUT = 'docs/ai-discovery-regression-cases.generated.json';
const DEFAULT_BASE_CASES = 'docs/ai-discovery-regression-cases.json';

function parseArgs(argv) {
  const args = {
    input: '',
    locale: 'all',
    top: 20,
    limit: 20,
    summaryOut: DEFAULT_SUMMARY_OUT,
    generatedOut: DEFAULT_GENERATED_OUT,
    baseCases: DEFAULT_BASE_CASES,
    apply: false,
    runRegression: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === '--input' || current === '-i') {
      args.input = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (current === '--locale' || current === '-l') {
      args.locale = argv[i + 1] ?? 'all';
      i += 1;
      continue;
    }
    if (current === '--top') {
      const value = Number.parseInt(argv[i + 1] ?? '', 10);
      if (!Number.isNaN(value) && value > 0) {
        args.top = value;
      }
      i += 1;
      continue;
    }
    if (current === '--limit') {
      const value = Number.parseInt(argv[i + 1] ?? '', 10);
      if (!Number.isNaN(value) && value > 0) {
        args.limit = value;
      }
      i += 1;
      continue;
    }
    if (current === '--summary-out') {
      args.summaryOut = argv[i + 1] ?? DEFAULT_SUMMARY_OUT;
      i += 1;
      continue;
    }
    if (current === '--generated-out') {
      args.generatedOut = argv[i + 1] ?? DEFAULT_GENERATED_OUT;
      i += 1;
      continue;
    }
    if (current === '--base-cases') {
      args.baseCases = argv[i + 1] ?? DEFAULT_BASE_CASES;
      i += 1;
      continue;
    }
    if (current === '--apply') {
      args.apply = true;
      continue;
    }
    if (current === '--run-regression') {
      args.runRegression = true;
    }
  }

  return args;
}

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/ai-discovery/run-quality-loop.mjs --input <events.json|events.ndjson> [--locale all] [--top 20] [--limit 20] [--apply] [--run-regression]');
  console.log('');
  console.log('Flags:');
  console.log('  --apply          Merge generated cases into base regression cases.');
  console.log('  --run-regression Run regression tests after merge (requires --apply).');
}

function runNodeScript(scriptPath, args) {
  const absoluteScript = path.resolve(process.cwd(), scriptPath);
  const result = spawnSync(process.execPath, [absoluteScript, ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: node ${scriptPath} ${args.join(' ')}`);
  }
}

function runNpmScript(scriptName) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCommand, ['run', scriptName], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: npm run ${scriptName}`);
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const args = parseArgs(argv);
  if (!args.input) {
    printUsage();
    process.exit(1);
  }

  runNodeScript('scripts/ai-discovery/analyze-telemetry.mjs', [
    '--input',
    args.input,
    '--locale',
    args.locale,
    '--top',
    String(args.top),
    '--out',
    args.summaryOut,
  ]);

  runNodeScript('scripts/ai-discovery/generate-regression-cases.mjs', [
    '--input',
    args.input,
    '--locale',
    args.locale,
    '--limit',
    String(args.limit),
    '--out',
    args.generatedOut,
  ]);

  if (args.apply) {
    runNodeScript('scripts/ai-discovery/merge-regression-cases.mjs', [
      '--base',
      args.baseCases,
      '--incoming',
      args.generatedOut,
      '--out',
      args.baseCases,
    ]);
  }

  if (args.runRegression) {
    if (!args.apply) {
      throw new Error('--run-regression requires --apply to avoid testing stale baseline.');
    }
    runNpmScript('qa:ai-discovery:regression');
  }

  console.log('\nQuality loop completed.');
  console.log(`- Summary: ${path.resolve(process.cwd(), args.summaryOut)}`);
  console.log(`- Generated cases: ${path.resolve(process.cwd(), args.generatedOut)}`);
  if (args.apply) {
    console.log(`- Updated baseline: ${path.resolve(process.cwd(), args.baseCases)}`);
  }
}

try {
  main();
} catch (error) {
  console.error('[ai-discovery] quality loop failed:', error.message);
  process.exit(1);
}
