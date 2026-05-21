#!/usr/bin/env tsx

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { tools } from '../../src/config/tools/index';
import type { ToolCategory } from '../../src/config/tools/types';
import { locales, type Locale } from '../../src/lib/i18n';

type LocaleSeedCopy = {
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  primary_keyword?: string;
};

type LaunchToolSpec = {
  slug: string;
  category: ToolCategory;
  icon: string;
  component?: string;
  popular?: boolean;
  search_intent?: string;
  aliases?: string[];
  locales: Partial<Record<Locale, LocaleSeedCopy>>;
};

type QaMode = 'none' | 'light' | 'full';

type Args = {
  inputPath: string;
  outDir: string;
  siteUrl: string;
  dryRun: boolean;
  skipImportMap: boolean;
  allowExisting: boolean;
  strictLocalize: boolean;
  qaMode: QaMode;
};

type ReportInput = {
  inputPath: string;
  runDir: string;
  localizedDir: string;
  indexNowPath: string;
  slugs: string[];
  urls: string[];
  qaMode: QaMode;
  dryRun: boolean;
  skipImportMap: boolean;
};

const DEFAULT_SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.u2tool.com';
const CATEGORY_NAMES: ToolCategory[] = [
  'text',
  'encoding',
  'generators',
  'converters',
  'development',
  'security',
  'network',
  'image',
  'math',
  'charts',
  'office',
  'lifestyle',
  'finance',
  'fun',
];

function parseArgs(argv: string[]): Args {
  const args: Args = {
    inputPath: '',
    outDir: '',
    siteUrl: DEFAULT_SITE_URL,
    dryRun: false,
    skipImportMap: false,
    allowExisting: false,
    strictLocalize: false,
    qaMode: 'light',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--input') {
      args.inputPath = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--input=')) {
      args.inputPath = arg.slice('--input='.length);
      continue;
    }
    if (arg === '--out-dir') {
      args.outDir = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--out-dir=')) {
      args.outDir = arg.slice('--out-dir='.length);
      continue;
    }
    if (arg === '--site-url') {
      args.siteUrl = normalizeSiteUrl(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (arg.startsWith('--site-url=')) {
      args.siteUrl = normalizeSiteUrl(arg.slice('--site-url='.length));
      continue;
    }
    if (arg === '--qa') {
      args.qaMode = parseQaMode(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (arg.startsWith('--qa=')) {
      args.qaMode = parseQaMode(arg.slice('--qa='.length));
      continue;
    }
    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (arg === '--skip-import-map') {
      args.skipImportMap = true;
      continue;
    }
    if (arg === '--allow-existing') {
      args.allowExisting = true;
      continue;
    }
    if (arg === '--strict-localize') {
      args.strictLocalize = true;
      continue;
    }
    if (!arg.startsWith('-') && !args.inputPath) {
      args.inputPath = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.inputPath) {
    throw new Error('Usage: npm run tools:launch -- --input path/to/tool-batch.json [--qa=light|full|none] [--dry-run]');
  }

  args.inputPath = path.resolve(process.cwd(), args.inputPath);
  if (!args.outDir) {
    const baseName = path.basename(args.inputPath).replace(/\.[^.]+$/, '');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    args.outDir = path.resolve(process.cwd(), '.tmp', 'tool-launches', `${baseName}-${stamp}`);
  } else {
    args.outDir = path.resolve(process.cwd(), args.outDir);
  }

  return args;
}

function parseQaMode(value: string): QaMode {
  if (value === 'none' || value === 'light' || value === 'full') {
    return value;
  }
  throw new Error(`Unsupported QA mode: ${value || '(empty)'}. Use none, light, or full.`);
}

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) {
    throw new Error('Site URL cannot be empty');
  }
  return trimmed;
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeLaunchInput(value: unknown): LaunchToolSpec[] {
  if (Array.isArray(value)) {
    return value as LaunchToolSpec[];
  }

  if (isRecord(value) && Array.isArray(value.tools)) {
    return value.tools as LaunchToolSpec[];
  }

  if (isRecord(value) && typeof value.slug === 'string') {
    return [value as LaunchToolSpec];
  }

  throw new Error('Launch input must be a tool object, an array of tools, or an object with a tools array.');
}

function validateLaunchSpecs(specs: LaunchToolSpec[], allowExisting: boolean) {
  if (specs.length === 0) {
    throw new Error('Launch input contains no tools.');
  }

  const existingSlugs = new Set(tools.map((tool) => tool.slug));
  const seenSlugs = new Set<string>();
  const errors: string[] = [];

  for (const spec of specs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(spec.slug || '')) {
      errors.push(`${spec.slug || '(missing slug)'}: invalid slug`);
    }
    if (seenSlugs.has(spec.slug)) {
      errors.push(`${spec.slug}: duplicate slug in launch input`);
    }
    seenSlugs.add(spec.slug);

    if (!CATEGORY_NAMES.includes(spec.category)) {
      errors.push(`${spec.slug}: unsupported category ${String(spec.category)}`);
    }
    if (!spec.icon) {
      errors.push(`${spec.slug}: missing icon`);
    }
    if (!isRecord(spec.locales)) {
      errors.push(`${spec.slug}: missing locales object`);
    }
    if (!allowExisting && existingSlugs.has(spec.slug)) {
      errors.push(`${spec.slug}: already exists; use --allow-existing only for intentional copy refreshes`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Launch spec validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  }
}

export function buildToolUrls(slugs: string[], siteUrl = DEFAULT_SITE_URL): string[] {
  const baseUrl = siteUrl.replace(/\/+$/, '');
  return slugs.flatMap((slug) => locales.map((locale) => `${baseUrl}/${locale}/tools/${slug}/`));
}

function runCommand(command: string, args: string[]) {
  console.log(`$ ${[command, ...args].join(' ')}`);
  execFileSync(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function runLocalize(inputPath: string, outputPath: string, briefPath: string, strict: boolean) {
  runCommand('npx', [
    'tsx',
    'scripts/tools/localize-tool-spec.ts',
    '--input',
    inputPath,
    '--output',
    outputPath,
    '--brief',
    briefPath,
    ...(strict ? ['--strict'] : []),
  ]);
}

function runOnboard(specPath: string, dryRun: boolean, skipImportMap: boolean) {
  runCommand('npx', [
    'tsx',
    'scripts/tools/onboard-tool.ts',
    '--spec',
    specPath,
    ...(dryRun ? ['--dry-run'] : []),
    ...(skipImportMap ? ['--skip-import-map'] : []),
  ]);
}

function runQa(qaMode: QaMode, slugs: string[]) {
  if (qaMode === 'none') {
    return;
  }

  runCommand('npm', ['run', 'i18n:check-missing-keys']);
  runCommand('npm', ['run', 'report:content-trust']);
  runCommand('git', ['diff', '--check']);
  runCommand('npm', ['run', 'qa:changed-tool-locales', '--', '--print-only', ...slugs]);

  if (qaMode === 'full') {
    runCommand('npm', ['run', 'check']);
    runCommand('npm', ['run', 'qa:seo-governance']);
    runCommand('npm', ['run', 'qa:runtime-integrity']);
    runCommand('npm', ['run', 'qa:changed-tool-locales', '--', '--timeout-ms=30000', ...slugs]);
    runCommand('npm', ['run', 'build']);
    runCommand('npm', ['run', 'validate:rendered-seo']);
    runCommand('npm', ['run', 'validate:worker-ssr']);
  }
}

function maybeGenerateImportMap(skipImportMap: boolean, dryRun: boolean) {
  if (skipImportMap || dryRun) {
    return;
  }

  runCommand('npx', ['tsx', 'scripts/generate-tool-import-map.ts']);
}

function maybeGenerateAiDiscoveryAliases(inputPath: string, dryRun: boolean) {
  if (dryRun) {
    return;
  }

  runCommand('npx', ['tsx', 'scripts/generate-ai-discovery-aliases.ts', '--input', inputPath]);
}

function relative(filePath: string) {
  return path.relative(process.cwd(), filePath).split(path.sep).join('/');
}

export function renderReport(input: ReportInput): string {
  const commands = [
    `npm run qa:changed-tool-locales -- --timeout-ms=30000 ${input.slugs.join(' ')}`,
    'npm run build',
    'node scripts/deploy/prepare-cloudflare-assets.mjs',
    'npx wrangler deploy',
    `npm run submit:indexnow -- --urls-file ${relative(input.indexNowPath)}`,
  ];

  return `# Tool Launch Batch Report

- input: \`${relative(input.inputPath)}\`
- run dir: \`${relative(input.runDir)}\`
- dry run: ${input.dryRun ? 'yes' : 'no'}
- QA mode: ${input.qaMode}
- import map: ${input.skipImportMap ? 'skipped' : input.dryRun ? 'skipped in dry run' : 'generated'}

## Tools

${input.slugs.map((slug) => `- \`${slug}\` -> \`${relative(path.join(input.localizedDir, `${slug}.json`))}\``).join('\n')}

## IndexNow URLs

Wrote ${input.urls.length} URLs to \`${relative(input.indexNowPath)}\`.

## Release Commands

\`\`\`bash
${commands.join('\n')}
\`\`\`
`;
}

export function runToolLaunchBatch(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const specs = normalizeLaunchInput(readJson(args.inputPath));
  validateLaunchSpecs(specs, args.allowExisting);

  const sourceDir = path.join(args.outDir, 'source');
  const localizedDir = path.join(args.outDir, 'localized');
  const briefDir = path.join(args.outDir, 'briefs');
  const slugs = specs.map((spec) => spec.slug);
  const localizedPaths = new Map<string, string>();
  const localizeFailures: string[] = [];

  fs.mkdirSync(args.outDir, { recursive: true });

  for (const spec of specs) {
    const sourcePath = path.join(sourceDir, `${spec.slug}.draft.json`);
    const localizedPath = path.join(localizedDir, `${spec.slug}.json`);
    const briefPath = path.join(briefDir, `${spec.slug}.ai-brief.md`);
    writeJson(sourcePath, spec);

    try {
      runLocalize(sourcePath, localizedPath, briefPath, args.strictLocalize);
      localizedPaths.set(spec.slug, localizedPath);
    } catch {
      localizeFailures.push(spec.slug);
    }
  }

  if (localizeFailures.length > 0) {
    throw new Error(
      `Stopped before onboarding because ${localizeFailures.length} spec(s) need localization work: ${localizeFailures.join(', ')}.\n` +
      `AI briefs are in ${relative(briefDir)}. Fill the missing locale copy, then rerun this command.`
    );
  }

  const skipPerToolImportMap = true;
  for (const slug of slugs) {
    const localizedPath = localizedPaths.get(slug);
    if (!localizedPath) {
      throw new Error(`Missing localized spec for ${slug}`);
    }
    runOnboard(localizedPath, args.dryRun, skipPerToolImportMap);
  }

  maybeGenerateImportMap(args.skipImportMap, args.dryRun);
  maybeGenerateAiDiscoveryAliases(args.inputPath, args.dryRun);

  const urls = buildToolUrls(slugs, args.siteUrl);
  const indexNowPath = path.join(args.outDir, 'indexnow-urls.txt');
  const reportPath = path.join(args.outDir, 'report.md');
  writeText(indexNowPath, `${urls.join('\n')}\n`);
  writeText(reportPath, renderReport({
    inputPath: args.inputPath,
    runDir: args.outDir,
    localizedDir,
    indexNowPath,
    slugs,
    urls,
    qaMode: args.qaMode,
    dryRun: args.dryRun,
    skipImportMap: args.skipImportMap,
  }));

  runQa(args.dryRun ? 'none' : args.qaMode, slugs);

  console.log(`Tool launch batch complete: ${slugs.join(', ')}`);
  console.log(`Report: ${relative(reportPath)}`);
  console.log(`IndexNow URLs: ${relative(indexNowPath)}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  try {
    runToolLaunchBatch();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
