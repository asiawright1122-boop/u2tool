#!/usr/bin/env tsx

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { tools } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';
import { runToolLocaleValidation } from './validate-tool-locales';

type Args = {
  baseUrl?: string;
  selectedLocales?: Locale[];
  timeoutMs?: number;
  printOnly: boolean;
  explicitSlugs: string[];
};

const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
const slugsByComponent = new Map<string, string[]>();
for (const tool of tools) {
  const slugs = slugsByComponent.get(tool.component) || [];
  slugs.push(tool.slug);
  slugsByComponent.set(tool.component, slugs);
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    printOnly: false,
    explicitSlugs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base-url') {
      args.baseUrl = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--base-url=')) {
      args.baseUrl = arg.slice('--base-url='.length);
      continue;
    }
    if (arg === '--locales') {
      args.selectedLocales = parseLocales(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (arg.startsWith('--locales=')) {
      args.selectedLocales = parseLocales(arg.slice('--locales='.length));
      continue;
    }
    if (arg === '--timeout-ms') {
      args.timeoutMs = Number.parseInt(argv[index + 1] || '', 10);
      index += 1;
      continue;
    }
    if (arg.startsWith('--timeout-ms=')) {
      args.timeoutMs = Number.parseInt(arg.slice('--timeout-ms='.length), 10);
      continue;
    }
    if (arg === '--print-only') {
      args.printOnly = true;
      continue;
    }
    if (arg.startsWith('-')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    args.explicitSlugs.push(arg);
  }

  return args;
}

function parseLocales(raw: string): Locale[] {
  const selected = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const invalid = selected.filter((locale) => !(locales as readonly string[]).includes(locale));
  if (invalid.length > 0) {
    throw new Error(`Unsupported locale(s): ${invalid.join(', ')}`);
  }
  return selected as Locale[];
}

function runGit(args: string[]) {
  try {
    return execFileSync('git', args, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function collectChangedFiles() {
  const files = new Set<string>();
  for (const output of [
    runGit(['diff', '--name-only', '--diff-filter=ACMRTD', 'HEAD', '--']),
    runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMRTD', '--']),
    runGit(['ls-files', '--others', '--exclude-standard']),
  ]) {
    for (const line of output.split('\n')) {
      const file = line.trim();
      if (file) {
        files.add(file);
      }
    }
  }
  return [...files].sort();
}

function collectDiffForFile(filePath: string) {
  const diffText = [
    runGit(['diff', '--unified=0', '--', filePath]),
    runGit(['diff', '--cached', '--unified=0', '--', filePath]),
  ].join('\n');
  if (diffText.trim()) {
    return diffText;
  }

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .map((line) => `+${line}`)
      .join('\n');
  }

  return '';
}

function addIfToolSlug(slugs: Set<string>, value: string | undefined) {
  if (value && toolBySlug.has(value)) {
    slugs.add(value);
  }
}

function extractSlugsFromDiff(diffText: string) {
  const slugs = new Set<string>();
  for (const line of diffText.split('\n')) {
    if (!line.startsWith('+') || line.startsWith('+++')) {
      continue;
    }

    addIfToolSlug(slugs, line.match(/slug:\s*['"]([^'"]+)['"]/)?.[1]);
    addIfToolSlug(slugs, line.match(/^\+\s*"([^"]+)":\s*\{/)?.[1]);
    addIfToolSlug(slugs, line.match(/^\+\s*'([^']+)':\s*\(\)\s*=>/)?.[1]);
  }
  return slugs;
}

function detectSlugsFromFilePath(filePath: string) {
  const slugs = new Set<string>();
  const normalized = filePath.split(path.sep).join('/');

  const splitMessageMatch = normalized.match(/^src\/messages\/(?:en|zh|ja|ko|es|pt|fr|de|ru|ar)\/tools\/([^/]+)\.json$/);
  addIfToolSlug(slugs, splitMessageMatch?.[1]);

  const componentMatch = normalized.match(/^src\/components\/tools\/([^/]+)\.svelte$/);
  const componentName = componentMatch?.[1];
  if (componentName) {
    for (const slug of slugsByComponent.get(componentName) || []) {
      slugs.add(slug);
    }
  }

  return slugs;
}

function detectChangedToolSlugs(explicitSlugs: string[]) {
  const slugs = new Set<string>();
  const changedFiles = collectChangedFiles();

  for (const slug of explicitSlugs) {
    if (!toolBySlug.has(slug)) {
      throw new Error(`Unknown tool slug: ${slug}`);
    }
    slugs.add(slug);
  }

  for (const filePath of changedFiles) {
    for (const slug of detectSlugsFromFilePath(filePath)) {
      slugs.add(slug);
    }

    if (
      filePath.startsWith('src/config/tools/') ||
      filePath.match(/^src\/messages\/(?:en|zh|ja|ko|es|pt|fr|de|ru|ar)\/base\.json$/) ||
      filePath === 'src/components/tools/ToolImportMap.ts'
    ) {
      for (const slug of extractSlugsFromDiff(collectDiffForFile(filePath))) {
        slugs.add(slug);
      }
    }
  }

  return [...slugs].sort((a, b) => a.localeCompare(b));
}

export async function runChangedToolLocaleValidation(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const slugs = detectChangedToolSlugs(args.explicitSlugs);

  if (slugs.length === 0) {
    console.log('No changed tool slugs detected. Nothing to validate.');
    return;
  }

  console.log(`Detected ${slugs.length} changed tool slug(s): ${slugs.join(', ')}`);
  if (args.printOnly) {
    return;
  }

  const forwardedArgs = [
    ...(args.baseUrl ? [`--base-url=${args.baseUrl}`] : []),
    ...(args.selectedLocales ? [`--locales=${args.selectedLocales.join(',')}`] : []),
    ...(args.timeoutMs ? [`--timeout-ms=${args.timeoutMs}`] : []),
    ...slugs,
  ];

  await runToolLocaleValidation(forwardedArgs);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  runChangedToolLocaleValidation().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
