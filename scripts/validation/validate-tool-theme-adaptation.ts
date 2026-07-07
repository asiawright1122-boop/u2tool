#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

type ThemeAdaptationIssueKind =
  | 'unadapted-dark-utility'
  | 'unadapted-hard-dark-background';

interface ThemeAdaptationIssue {
  file: string;
  line: number;
  kind: ThemeAdaptationIssueKind;
  token: string;
  code: string;
}

interface ThemeAdaptationSummary {
  scannedFiles: number;
  codeOutputCovered: number;
  explicitLightDarkPair: number;
  hardCssDarkAware: number;
  intentionalVisualSurface: number;
  themeBridgeCovered: number;
}

const TOOL_COMPONENTS_DIR = path.join('src', 'components', 'tools');
const DARK_BACKGROUND_TOKEN =
  /^(?:(?:bg|from|to|via)-black(?:\/[0-9]+)?|(?:bg|from|to|via)-(?:slate|gray|stone|zinc|neutral)-(?:800|850|900|950)(?:\/[0-9]+)?)$/;
const DARK_ARBITRARY_BACKGROUND =
  /^bg-\[#(?:000000|0c0a09|121212|0b0b0c|09090b|020617|0f172a|111827|18181b|1f2937)\](?:\/[0-9]+)?$/i;
const CLASS_ATTRIBUTE_PATTERN =
  /class\s*=\s*(?:(("[^"]*")|('[^']*'))|\{`([\s\S]*?)`\}|\{([^}]*)\})/g;
const HARD_DARK_BACKGROUND_PATTERN =
  /(?:background(?:-color)?\s*:\s*|backgroundColor\s*:\s*['"])(#(?:0c0a09|121212|0b0b0c|09090b|020617|0f172a|111827|18181b|1f2937))/gi;

const INTENTIONAL_VISUAL_CANVAS = new Map<string, Set<string>>([
  [path.join('src', 'components', 'tools', 'VennDiagramGenerator.svelte'), new Set(['bg-[#1f2937]'])],
]);

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split('\n').length;
}

function normalizeClassAttribute(rawValue: string): string {
  return rawValue.replace(/^['"]|['"]$/g, '');
}

function tokenBase(token: string): string {
  return token.split(':').pop() || token;
}

function tokenVariants(token: string): string[] {
  const parts = token.split(':');
  return parts.length > 1 ? parts.slice(0, -1) : [];
}

function hasThemeBridge(source: string): boolean {
  return /tool-theme-(?:shell|workspace)/.test(source);
}

function hasCodeOutputSurface(source: string): boolean {
  return /<(?:pre|textarea)\b|<code\b|tool-result|:has\(code\)/.test(source);
}

function isDarkToken(token: string): boolean {
  return DARK_BACKGROUND_TOKEN.test(token) || DARK_ARBITRARY_BACKGROUND.test(token);
}

function isExplicitLightDarkPair(rawClassValue: string): boolean {
  return (
    /dark:(?:bg|from|to|via)-/.test(rawClassValue) &&
    /(?:bg|from|to|via)-(?:white|slate-50|gray-50|amber-50|orange-50|neutral-50)/.test(rawClassValue)
  );
}

function isCodeOutputCovered(baseToken: string, source: string): boolean {
  return /^(?:bg-gray-9|bg-slate-950)/.test(baseToken) && hasCodeOutputSurface(source);
}

function isIntentionalVisualCanvas(file: string, baseToken: string): boolean {
  return INTENTIONAL_VISUAL_CANVAS.get(file)?.has(baseToken) || false;
}

function isIntentionalVisualSurface(rawClassValue: string, baseToken: string): boolean {
  if (!baseToken.startsWith('bg-black')) return false;
  return (
    /(?:^|\s)(?:absolute|fixed)(?:\s|$)/.test(rawClassValue) &&
    /(?:^|\s)(?:inset-0|top-0|right-0|bottom-0|left-0)(?:\s|$)/.test(rawClassValue) &&
    /(?:bg-black\/[0-9]+|bg-opacity-[0-9]+|opacity-[0-9]+)/.test(rawClassValue)
  );
}

function isHardDarkBackgroundAware(context: string): boolean {
  return /isDark|dark\)|:global\(\.dark\)|documentElement\.classList\.contains\('dark'\)|:global\(\.dark\) \.obsidian-theme/.test(
    context
  );
}

function addIssue(
  issues: ThemeAdaptationIssue[],
  file: string,
  source: string,
  index: number,
  kind: ThemeAdaptationIssueKind,
  token: string,
  code: string
): void {
  issues.push({
    file,
    line: lineNumberAt(source, index),
    kind,
    token,
    code: code.replace(/\s+/g, ' ').trim().slice(0, 220),
  });
}

async function collectSvelteFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectSvelteFiles(entryPath);
      if (entry.isFile() && entry.name.endsWith('.svelte')) return [entryPath];
      return [];
    })
  );
  return files.flat();
}

export async function validateToolThemeAdaptation(): Promise<{
  issues: ThemeAdaptationIssue[];
  summary: ThemeAdaptationSummary;
}> {
  const files = await collectSvelteFiles(TOOL_COMPONENTS_DIR);
  const issues: ThemeAdaptationIssue[] = [];
  const summary: ThemeAdaptationSummary = {
    scannedFiles: files.length,
    codeOutputCovered: 0,
    explicitLightDarkPair: 0,
    hardCssDarkAware: 0,
    intentionalVisualSurface: 0,
    themeBridgeCovered: 0,
  };

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const fileUsesThemeBridge = hasThemeBridge(source);
    let classMatch: RegExpExecArray | null;

    while ((classMatch = CLASS_ATTRIBUTE_PATTERN.exec(source))) {
      const rawClassValue = normalizeClassAttribute(classMatch[2] || classMatch[3] || classMatch[4] || classMatch[5] || '');
      const tokens = rawClassValue
        .split(/\s+/)
        .map((token) => token.replace(/["'`;{}()]/g, ''))
        .filter(Boolean);

      for (const token of tokens) {
        const baseToken = tokenBase(token);
        if (!isDarkToken(baseToken)) continue;
        if (tokenVariants(token).includes('dark')) continue;

        if (isIntentionalVisualCanvas(file, baseToken) || isIntentionalVisualSurface(rawClassValue, baseToken)) {
          summary.intentionalVisualSurface += 1;
          continue;
        }

        if (fileUsesThemeBridge) {
          summary.themeBridgeCovered += 1;
          continue;
        }

        if (isCodeOutputCovered(baseToken, source)) {
          summary.codeOutputCovered += 1;
          continue;
        }

        if (isExplicitLightDarkPair(rawClassValue)) {
          summary.explicitLightDarkPair += 1;
          continue;
        }

        addIssue(
          issues,
          file,
          source,
          classMatch.index,
          'unadapted-dark-utility',
          baseToken,
          rawClassValue
        );
      }
    }

    let hardBackgroundMatch: RegExpExecArray | null;
    while ((hardBackgroundMatch = HARD_DARK_BACKGROUND_PATTERN.exec(source))) {
      const context = source.slice(
        Math.max(0, hardBackgroundMatch.index - 160),
        Math.min(source.length, hardBackgroundMatch.index + 240)
      );

      if (isHardDarkBackgroundAware(context)) {
        summary.hardCssDarkAware += 1;
        continue;
      }

      addIssue(
        issues,
        file,
        source,
        hardBackgroundMatch.index,
        'unadapted-hard-dark-background',
        hardBackgroundMatch[1],
        context
      );
    }
  }

  return { issues, summary };
}

function printSummary(summary: ThemeAdaptationSummary): void {
  console.log('Tool theme adaptation validation summary:');
  console.log(`- scanned Svelte tool files: ${summary.scannedFiles}`);
  console.log(`- covered by tool theme bridge: ${summary.themeBridgeCovered}`);
  console.log(`- covered code output surfaces: ${summary.codeOutputCovered}`);
  console.log(`- explicit light/dark pairs: ${summary.explicitLightDarkPair}`);
  console.log(`- dark-aware hard CSS backgrounds: ${summary.hardCssDarkAware}`);
  console.log(`- intentional visual surface exceptions: ${summary.intentionalVisualSurface}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { issues, summary } = await validateToolThemeAdaptation();
  printSummary(summary);

  if (issues.length > 0) {
    console.error(`\nFound ${issues.length} unadapted dark theme surface issue(s):`);
    for (const issue of issues) {
      console.error(`\n${issue.file}:${issue.line} [${issue.kind}] ${issue.token}`);
      console.error(`  ${issue.code}`);
    }
    process.exit(1);
  }

  console.log('\nTool theme adaptation validation passed.');
}
