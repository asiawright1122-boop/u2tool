#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

interface SvgRenderingIssue {
  file: string;
  line: number;
  rule: 'escaped-svg-expression' | 'visible-text-svg';
  message: string;
  code: string;
}

const TOOL_COMPONENTS_DIR = path.join('src', 'components', 'tools');
const VISIBLE_TEXT_PROPERTY_PATTERN =
  /\b(?:text|label|name|title|desc|description|message|example|content)\s*:\s*['"`][^\n]*<svg\b/i;

function isActualSvgMarkup(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^<svg\b/i.test(trimmed) ||
    /^><svg\b/i.test(trimmed) ||
    /^<\/?[a-z][^>]*>\s*<svg\b/i.test(trimmed) ||
    /^<[^>]+<svg\b/i.test(trimmed)
  );
}

function isKnownSvgSourceString(line: string): boolean {
  return /(?:\bicon\s*:|svgCode|defaultSvg|data:image\/svg|XMLSerializer|outerHTML|innerHTML|querySelector\(['"]svg|set:html)/i.test(
    line
  );
}

function isInsideHtmlDirective(lines: string[], lineIndex: number): boolean {
  const windowStart = Math.max(0, lineIndex - 4);
  return lines.slice(windowStart, lineIndex + 1).some((line) => line.includes('{@html'));
}

function containsEscapedSvgExpression(lines: string[], lineIndex: number): boolean {
  const line = lines[lineIndex];
  const svgIndex = line.indexOf('<svg');
  if (svgIndex === -1) return false;
  if (line.includes('{@html') || isInsideHtmlDirective(lines, lineIndex)) return false;
  if (isActualSvgMarkup(line) || isKnownSvgSourceString(line)) return false;

  const openingExpressionIndex = line.lastIndexOf('{', svgIndex);
  if (openingExpressionIndex === -1) return false;

  const closingExpressionIndex = line.lastIndexOf('}', svgIndex);
  if (closingExpressionIndex > openingExpressionIndex) return false;

  return true;
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

export async function validateToolSvgRendering(): Promise<SvgRenderingIssue[]> {
  const files = await collectSvelteFiles(TOOL_COMPONENTS_DIR);
  const issues: SvgRenderingIssue[] = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const lines = source.split(/\r?\n/);

    for (const [lineIndex, line] of lines.entries()) {
      if (!line.includes('<svg')) continue;

      if (VISIBLE_TEXT_PROPERTY_PATTERN.test(line) && !isKnownSvgSourceString(line)) {
        issues.push({
          file,
          line: lineIndex + 1,
          rule: 'visible-text-svg',
          message: 'Visible text-like data contains raw SVG markup.',
          code: line.trim(),
        });
        continue;
      }

      if (containsEscapedSvgExpression(lines, lineIndex)) {
        issues.push({
          file,
          line: lineIndex + 1,
          rule: 'escaped-svg-expression',
          message: 'Raw SVG appears inside a Svelte expression and will render as escaped text. Use SVG markup or {@html} for trusted static icons.',
          code: line.trim(),
        });
      }
    }
  }

  return issues;
}

export function printToolSvgRenderingIssues(issues: SvgRenderingIssue[]): void {
  if (issues.length === 0) {
    console.log('✅ Tool SVG rendering validation passed');
    return;
  }

  console.error(`❌ Found ${issues.length} potential raw SVG rendering issue(s):`);
  for (const issue of issues) {
    console.error(`\n${issue.file}:${issue.line} [${issue.rule}]`);
    console.error(issue.message);
    console.error(`  ${issue.code}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const issues = await validateToolSvgRendering();
  printToolSvgRenderingIssues(issues);
  process.exit(issues.length === 0 ? 0 : 1);
}
