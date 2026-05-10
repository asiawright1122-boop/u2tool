#!/usr/bin/env node

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const TOOL_STUBS_PATH = path.join('src', 'lib', 'tool-stubs.ts');
const RUNTIME_PLACEHOLDER_VALIDATOR_PATH = path.join(
  'scripts',
  'validation',
  'validate-runtime-placeholder-regressions.ts'
);
const OUTPUT_PATH = path.join('docs', 'RUNTIME_HELPER_DEBT_INVENTORY.md');
const SCAN_ROOTS = [path.join('src', 'components'), path.join('src', 'lib')];

type ExportKind = 'const' | 'function';
type RiskBand = 'likely-broken' | 'needs-review' | 'false-positive' | 'protected';

interface ExportInfo {
  kind: ExportKind;
  line: number;
  name: string;
  text: string;
}

interface ConsumerImport {
  importedName: string;
  localName: string;
  sourcePath: string;
}

interface InventoryRow extends ExportInfo {
  category: string;
  consumers: string[];
  falsePositiveNotes: string[];
  riskBand: RiskBand;
  score: number;
  signatures: string[];
}

const TEXT_REFERENCE_EXPORTS = new Set([
  'ASCII_FONTS',
  'MORSE_CODE',
  'REVERSE_MORSE',
  'NATO_ALPHABET',
  'smallCapsMap',
  'subscriptMap',
  'superscriptMap',
  'flipMap',
  'mirrorMap',
]);

const VALIDATION_REFERENCE_EXPORTS = new Set([
  'commonPasswords',
  'commonTypos',
  'disposableDomains',
  'freeProviders',
]);

function lineOf(sourceFile: ts.SourceFile, position: number): number {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function hasExportModifier(node: { modifiers?: ts.NodeArray<ts.ModifierLike> }): boolean {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function sourceText(node: ts.Node, sourceFile: ts.SourceFile): string {
  return sourceFile.text.slice(node.getStart(sourceFile), node.end);
}

function collectExports(source: string): Map<string, ExportInfo> {
  const sourceFile = ts.createSourceFile(
    TOOL_STUBS_PATH,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const exports = new Map<string, ExportInfo>();

  for (const node of sourceFile.statements) {
    if (ts.isFunctionDeclaration(node) && hasExportModifier(node) && node.name) {
      exports.set(node.name.text, {
        kind: 'function',
        line: lineOf(sourceFile, node.getStart(sourceFile)),
        name: node.name.text,
        text: sourceText(node, sourceFile),
      });
      continue;
    }

    if (ts.isVariableStatement(node) && hasExportModifier(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        exports.set(declaration.name.text, {
          kind: 'const',
          line: lineOf(sourceFile, node.getStart(sourceFile)),
          name: declaration.name.text,
          text: sourceText(node, sourceFile),
        });
      }
    }
  }

  return exports;
}

async function listSourceFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listSourceFiles(fullPath));
      continue;
    }

    if (/\.(astro|svelte|ts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseImportSpecifiers(rawSpecifiers: string, sourcePath: string): ConsumerImport[] {
  return rawSpecifiers
    .split(',')
    .map((specifier) => specifier.trim())
    .filter(Boolean)
    .map((specifier) => {
      const [importedName, localName] = specifier.split(/\s+as\s+/).map((value) => value.trim());
      return {
        importedName,
        localName: localName || importedName,
        sourcePath,
      };
    });
}

async function collectConsumers(rootDir: string): Promise<Map<string, Set<string>>> {
  const files = (
    await Promise.all(
      SCAN_ROOTS.map(async (scanRoot) => listSourceFiles(path.join(rootDir, scanRoot)))
    )
  ).flat();
  const consumers = new Map<string, Set<string>>();
  const importPattern =
    /import\s*\{([^}]*)\}\s*from\s*['"](?:@\/lib|\$lib|(?:\.\.?\/)+[^'"]*?)\/tool-stubs['"]/g;

  for (const filePath of files) {
    const relativePath = path.relative(rootDir, filePath);
    const content = await readFile(filePath, 'utf8');
    for (const match of content.matchAll(importPattern)) {
      for (const specifier of parseImportSpecifiers(match[1], relativePath)) {
        if (!consumers.has(specifier.importedName)) {
          consumers.set(specifier.importedName, new Set());
        }
        consumers.get(specifier.importedName)?.add(specifier.sourcePath);
      }
    }
  }

  return consumers;
}

function collectProtectedHelpers(validatorSource: string): Set<string> {
  return new Set(
    [...validatorSource.matchAll(/exportName:\s*'([^']+)'/g)].map((match) => match[1])
  );
}

function placeholderSignatures(info: ExportInfo): string[] {
  const signatures: string[] = [];
  const checks: Array<[RegExp, string]> = [
    [/return\s+\[\s*\]\s*;/, 'return-empty-array'],
    [/return\s+\{\s*\}\s*;/, 'return-empty-object'],
    [/return\s+['"`]\s*['"`]\s*;/, 'return-empty-string'],
    [/return\s+null\s*;/, 'return-null'],
    [/return\s+0\s*;/, 'return-zero'],
    [/return\s+false\s*;/, 'return-false'],
    [/=\s*\[\s*\]\s*;/, 'empty-array-const'],
    [/=\s*\{\s*\}\s*;/, 'empty-object-const'],
  ];

  for (const [pattern, label] of checks) {
    if (pattern.test(info.text)) signatures.push(label);
  }

  return signatures;
}

function hasMeaningfulReturn(text: string): boolean {
  return /return\s+(?!\[\s*\]|\{\s*\}|['"`]\s*['"`]|null\b|0\b|false\b)[^;]+;/.test(text);
}

function categorize(name: string): string {
  if (TEXT_REFERENCE_EXPORTS.has(name)) return 'text-reference';
  if (VALIDATION_REFERENCE_EXPORTS.has(name)) return 'validation-reference';
  if (/sql|mongo|query|schema|database/i.test(name)) return 'database-developer';
  if (/date|time|cron|schedule/i.test(name)) return 'time-scheduling';
  if (/color|font|emoji|ascii|morse|nato|text|flip|small/i.test(name)) return 'text-reference';
  if (/password|email|domain|provider|typo|vulnerab|injection/i.test(name)) return 'validation-reference';
  return 'general';
}

function classifyRisk(
  info: ExportInfo,
  consumers: string[],
  signatures: string[],
  protectedHelpers: Set<string>
): { falsePositiveNotes: string[]; riskBand: RiskBand; score: number } {
  const falsePositiveNotes: string[] = [];
  const category = categorize(info.name);
  const isProtected = protectedHelpers.has(info.name) || /runtime[A-Z]\w+\(/.test(info.text);
  const meaningfulReturn = info.kind === 'function' && hasMeaningfulReturn(info.text);
  const hasPlaceholder = signatures.length > 0;

  if (isProtected) {
    falsePositiveNotes.push('covered by runtime-integrity delegation or placeholder validator');
    return { falsePositiveNotes, riskBand: 'protected', score: 0 };
  }

  if (!hasPlaceholder) {
    return {
      falsePositiveNotes,
      riskBand: 'needs-review',
      score: Math.min(20, consumers.length * 4),
    };
  }

  if (meaningfulReturn && /if\s*\(|catch\s*\{|Number\.isNaN|!/.test(info.text)) {
    falsePositiveNotes.push('empty return appears to be guarded invalid-input fallback');
    return {
      falsePositiveNotes,
      riskBand: 'false-positive',
      score: 5 + consumers.length,
    };
  }

  const categoryBoost =
    category === 'text-reference' ? 30 :
      category === 'validation-reference' ? 24 :
        category === 'database-developer' ? 12 :
          0;
  const kindBoost = info.kind === 'const' ? 20 : 14;
  const score = kindBoost + categoryBoost + consumers.length * 6 + signatures.length * 4;

  return {
    falsePositiveNotes,
    riskBand: score >= 32 ? 'likely-broken' : 'needs-review',
    score,
  };
}

function renderTable(rows: InventoryRow[], limit: number): string[] {
  const lines = [
    '| Rank | Export | Category | Score | Signatures | Consumers | Notes |',
    '| --- | --- | --- | ---: | --- | ---: | --- |',
  ];

  rows.slice(0, limit).forEach((row, index) => {
    const notes = row.falsePositiveNotes.length > 0 ? row.falsePositiveNotes.join('; ') : '-';
    lines.push(
      `| ${index + 1} | \`${row.name}\` | ${row.category} | ${row.score} | ${row.signatures.join(', ') || '-'} | ${row.consumers.length} | ${notes} |`
    );
  });

  if (rows.length === 0) {
    lines.push('| - | - | - | 0 | - | 0 | - |');
  }

  return lines;
}

function renderCandidateDetails(rows: InventoryRow[]): string[] {
  const lines: string[] = [];
  for (const row of rows) {
    lines.push(`### ${row.name}`);
    lines.push('');
    lines.push(`- Category: ${row.category}`);
    lines.push(`- Source: \`${TOOL_STUBS_PATH}:${row.line}\``);
    lines.push(`- Signatures: ${row.signatures.length > 0 ? row.signatures.map((signature) => `\`${signature}\``).join(', ') : 'none'}`);
    lines.push(`- Consumers: ${row.consumers.map((consumer) => `\`${consumer}\``).join(', ') || 'none'}`);
    lines.push('');
  }
  return lines;
}

function renderReport(rows: InventoryRow[], generatedAt: string): string {
  const importedRows = rows.filter((row) => row.consumers.length > 0);
  const likelyBroken = importedRows
    .filter((row) => row.riskBand === 'likely-broken')
    .sort((a, b) => b.score - a.score || b.consumers.length - a.consumers.length || a.name.localeCompare(b.name));
  const falsePositives = importedRows
    .filter((row) => row.riskBand === 'false-positive' || row.riskBand === 'protected')
    .sort((a, b) => b.consumers.length - a.consumers.length || a.name.localeCompare(b.name));
  const textWave = likelyBroken.filter((row) => TEXT_REFERENCE_EXPORTS.has(row.name));
  const validationWave = likelyBroken.filter((row) => VALIDATION_REFERENCE_EXPORTS.has(row.name));

  const lines: string[] = [];
  lines.push('# Runtime Helper Debt Inventory');
  lines.push('');
  lines.push(`Generated: ${generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Imported compatibility exports scanned: ${importedRows.length}`);
  lines.push(`- Likely broken imported exports: ${likelyBroken.length}`);
  lines.push(`- Protected or likely false-positive exports: ${falsePositives.length}`);
  lines.push(`- Recommended Phase 29 text/reference candidates: ${textWave.length}`);
  lines.push(`- Recommended Phase 30 validation/reference candidates: ${validationWave.length}`);
  lines.push('');
  lines.push('## Top Repair Candidates');
  lines.push('');
  lines.push(...renderTable(likelyBroken, 40));
  lines.push('');
  lines.push('## Recommended v0.0.9 Waves');
  lines.push('');
  lines.push('### Phase 29 Text Utility Reference Data');
  lines.push('');
  if (textWave.length > 0) {
    lines.push(...renderCandidateDetails(textWave));
  } else {
    lines.push('- No text-reference candidates detected.');
  }
  lines.push('### Phase 30 Validation Reference Data');
  lines.push('');
  if (validationWave.length > 0) {
    lines.push(...renderCandidateDetails(validationWave));
  } else {
    lines.push('- No validation-reference candidates detected.');
  }
  lines.push('## False Positives and Protected Helpers');
  lines.push('');
  lines.push(...renderTable(falsePositives, 30));
  lines.push('');
  lines.push('## Ranking Notes');
  lines.push('');
  lines.push('- Empty maps and arrays used by text transformation tools rank highly because they make the UI produce no useful output while still compiling.');
  lines.push('- Functions with empty invalid-input fallbacks are separated from likely broken helpers when they also contain meaningful returns.');
  lines.push('- Helpers already delegated into `src/lib/runtime-integrity/` are treated as protected and should not be reselected unless their smoke coverage fails.');
  return `${lines.join('\n').trimEnd()}\n`;
}

async function main(): Promise<void> {
  const rootDir = process.cwd();
  const [toolStubsSource, validatorSource, consumers] = await Promise.all([
    readFile(path.join(rootDir, TOOL_STUBS_PATH), 'utf8'),
    readFile(path.join(rootDir, RUNTIME_PLACEHOLDER_VALIDATOR_PATH), 'utf8'),
    collectConsumers(rootDir),
  ]);
  const exports = collectExports(toolStubsSource);
  const protectedHelpers = collectProtectedHelpers(validatorSource);

  const rows: InventoryRow[] = [...exports.values()].map((info) => {
    const consumerPaths = [...(consumers.get(info.name) || [])].sort();
    const signatures = placeholderSignatures(info);
    const classification = classifyRisk(info, consumerPaths, signatures, protectedHelpers);

    return {
      ...info,
      category: categorize(info.name),
      consumers: consumerPaths,
      signatures,
      ...classification,
    };
  });

  const report = renderReport(rows, new Date().toISOString());
  await mkdir(path.dirname(path.join(rootDir, OUTPUT_PATH)), { recursive: true });
  await writeFile(path.join(rootDir, OUTPUT_PATH), report, 'utf8');

  const importedRows = rows.filter((row) => row.consumers.length > 0);
  const likelyBroken = importedRows.filter((row) => row.riskBand === 'likely-broken');
  console.log(
    `Runtime helper debt inventory written to ${OUTPUT_PATH}. imported=${importedRows.length}; likelyBroken=${likelyBroken.length}`
  );
}

main().catch((error) => {
  console.error(`Failed to generate runtime helper debt inventory: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
