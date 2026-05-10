#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

type RuntimePlaceholderRegressionRule =
  | 'missing-runtime-import'
  | 'missing-runtime-export'
  | 'missing-runtime-delegation'
  | 'placeholder-fallback'
  | 'missing-smoke-coverage';

interface RuntimePlaceholderRegressionIssue {
  file: string;
  helper: string;
  rule: RuntimePlaceholderRegressionRule;
  message: string;
  code: string;
}

interface ProtectedRuntimeHelper {
  exportName: string;
  aliasName: string;
  modulePath: string;
}

const TOOL_STUBS_PATH = path.join('src', 'lib', 'tool-stubs.ts');
const SMOKE_TEST_PATH = path.join('src', 'lib', 'tool-stubs-runtime.test.ts');
const PROTECTED_RUNTIME_HELPERS: ProtectedRuntimeHelper[] = [
  { exportName: 'base64UrlEncode', aliasName: 'runtimeBase64UrlEncode', modulePath: './runtime-integrity/token' },
  { exportName: 'decodeJwt', aliasName: 'runtimeDecodeJwt', modulePath: './runtime-integrity/token' },
  { exportName: 'generateSecret', aliasName: 'runtimeGenerateSecret', modulePath: './runtime-integrity/token' },
  { exportName: 'generateTotp', aliasName: 'runtimeGenerateTotp', modulePath: './runtime-integrity/token' },
  { exportName: 'formatJson', aliasName: 'runtimeFormatJson', modulePath: './runtime-integrity/object' },
  { exportName: 'parseResponse', aliasName: 'runtimeParseResponse', modulePath: './runtime-integrity/object' },
  { exportName: 'sortObject', aliasName: 'runtimeSortObject', modulePath: './runtime-integrity/object' },
  { exportName: 'calculateBreakEven', aliasName: 'runtimeCalculateBreakEven', modulePath: './runtime-integrity/calculators' },
  { exportName: 'calculateCapacity', aliasName: 'runtimeCalculateCapacity', modulePath: './runtime-integrity/calculators' },
  { exportName: 'calculateStats', aliasName: 'runtimeCalculateStats', modulePath: './runtime-integrity/calculators' },
  { exportName: 'getContrastRatio', aliasName: 'runtimeGetContrastRatio', modulePath: './runtime-integrity/calculators' },
  { exportName: 'getWCAGLevel', aliasName: 'runtimeGetWCAGLevel', modulePath: './runtime-integrity/calculators' },
  { exportName: 'generateGo', aliasName: 'runtimeGenerateGo', modulePath: './runtime-integrity/curl' },
  { exportName: 'generateJava', aliasName: 'runtimeGenerateJava', modulePath: './runtime-integrity/curl' },
  { exportName: 'generateJavaScript', aliasName: 'runtimeGenerateJavaScript', modulePath: './runtime-integrity/curl' },
  { exportName: 'generatePhp', aliasName: 'runtimeGeneratePhp', modulePath: './runtime-integrity/curl' },
  { exportName: 'generatePython', aliasName: 'runtimeGeneratePython', modulePath: './runtime-integrity/curl' },
  { exportName: 'generateRuby', aliasName: 'runtimeGenerateRuby', modulePath: './runtime-integrity/curl' },
  { exportName: 'parseCurlCommand', aliasName: 'runtimeParseCurlCommand', modulePath: './runtime-integrity/curl' },
  { exportName: 'formatSql', aliasName: 'runtimeFormatSql', modulePath: './runtime-integrity/sql' },
  { exportName: 'minifySql', aliasName: 'runtimeMinifySql', modulePath: './runtime-integrity/sql' },
  { exportName: 'convertTime', aliasName: 'runtimeConvertTime', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'findAvailableSlots', aliasName: 'runtimeFindAvailableSlots', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'formatHour', aliasName: 'runtimeFormatHour', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'formatMinutesToTime', aliasName: 'runtimeFormatMinutesToTime', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'mergeBusySlots', aliasName: 'runtimeMergeBusySlots', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'parseConflicts', aliasName: 'runtimeParseConflicts', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'parseTimeToMinutes', aliasName: 'runtimeParseTimeToMinutes', modulePath: './runtime-integrity/scheduling' },
  { exportName: 'analyzeComplexity', aliasName: 'runtimeAnalyzeComplexity', modulePath: './runtime-integrity/code-analysis' },
  { exportName: 'analyzeDeadCode', aliasName: 'runtimeAnalyzeDeadCode', modulePath: './runtime-integrity/code-analysis' },
  { exportName: 'analyzePerformance', aliasName: 'runtimeAnalyzePerformance', modulePath: './runtime-integrity/code-analysis' },
];
const PLACEHOLDER_RETURN_PATTERNS = [
  /return\s+null\b/,
  /return\s+['"`]\s*['"`]\s*;/,
  /return\s+\[\s*\]\s*;/,
  /return\s+\{\s*\}\s*;/,
  /return\s+0\s*;/,
  /return\s+\{\s*score\s*:\s*0\s*,\s*issues\s*:\s*\[\s*\]\s*\}\s*;/,
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractFunctionSource(source: string, exportName: string): string | null {
  const startPattern = new RegExp(`export\\s+(?:async\\s+)?function\\s+${escapeRegex(exportName)}\\b`);
  const startMatch = startPattern.exec(source);
  if (!startMatch || startMatch.index === undefined) return null;

  const startIndex = startMatch.index;
  const parameterListStart = source.indexOf('(', startIndex);
  if (parameterListStart === -1) return null;

  let parameterDepth = 0;
  let braceIndex = -1;
  for (let index = parameterListStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '(') parameterDepth += 1;
    if (char === ')') {
      parameterDepth -= 1;
      if (parameterDepth === 0) {
        braceIndex = source.indexOf('{', index + 1);
        break;
      }
    }
  }
  if (braceIndex === -1) return null;

  let depth = 0;
  for (let index = braceIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(startIndex, index + 1);
    }
  }

  return null;
}

function runtimeModuleFile(modulePath: string): string {
  return path.join('src', 'lib', `${modulePath.replace(/^\.\//, '')}.ts`);
}

function addIssue(
  issues: RuntimePlaceholderRegressionIssue[],
  helper: ProtectedRuntimeHelper,
  file: string,
  rule: RuntimePlaceholderRegressionRule,
  message: string,
  code: string
): void {
  issues.push({ file, helper: helper.exportName, rule, message, code });
}

export async function validateRuntimePlaceholderRegressions(): Promise<RuntimePlaceholderRegressionIssue[]> {
  const toolStubsSource = await readFile(TOOL_STUBS_PATH, 'utf8');
  const smokeTestSource = await readFile(SMOKE_TEST_PATH, 'utf8');
  const issues: RuntimePlaceholderRegressionIssue[] = [];

  for (const helper of PROTECTED_RUNTIME_HELPERS) {
    const importPattern = new RegExp(
      `import\\s*\\{[\\s\\S]*?\\b${escapeRegex(helper.exportName)}\\s+as\\s+${escapeRegex(helper.aliasName)}\\b[\\s\\S]*?\\}\\s*from\\s*['"]${escapeRegex(helper.modulePath)}['"]`,
      'm'
    );
    if (!importPattern.test(toolStubsSource)) {
      addIssue(
        issues,
        helper,
        TOOL_STUBS_PATH,
        'missing-runtime-import',
        `Protected helper is no longer imported from ${helper.modulePath}.`,
        helper.aliasName
      );
      continue;
    }

    const functionSource = extractFunctionSource(toolStubsSource, helper.exportName);
    if (!functionSource) {
      addIssue(
        issues,
        helper,
        TOOL_STUBS_PATH,
        'missing-runtime-delegation',
        'Protected helper no longer has an exported wrapper in tool-stubs.ts.',
        helper.exportName
      );
    } else {
      if (!functionSource.includes(`${helper.aliasName}(`)) {
        addIssue(
          issues,
          helper,
          TOOL_STUBS_PATH,
          'missing-runtime-delegation',
          `Protected helper is no longer delegated to ${helper.aliasName}.`,
          functionSource.split(/\r?\n/, 1)[0] || helper.exportName
        );
      }

      if (PLACEHOLDER_RETURN_PATTERNS.some((pattern) => pattern.test(functionSource))) {
        addIssue(
          issues,
          helper,
          TOOL_STUBS_PATH,
          'placeholder-fallback',
          'Protected helper appears to have fallen back to a placeholder return value.',
          functionSource.split(/\r?\n/).slice(0, 4).join(' ').trim()
        );
      }
    }

    const runtimePath = runtimeModuleFile(helper.modulePath);
    const runtimeSource = await readFile(runtimePath, 'utf8');
    const runtimeExportPattern = new RegExp(
      `export\\s+(?:async\\s+)?function\\s+${escapeRegex(helper.exportName)}\\b`
    );
    if (!runtimeExportPattern.test(runtimeSource)) {
      addIssue(
        issues,
        helper,
        runtimePath,
        'missing-runtime-export',
        'Runtime integrity module no longer exports the protected helper.',
        helper.exportName
      );
    }

    if (!new RegExp(`\\b${escapeRegex(helper.exportName)}\\b`).test(smokeTestSource)) {
      addIssue(
        issues,
        helper,
        SMOKE_TEST_PATH,
        'missing-smoke-coverage',
        'Runtime smoke coverage no longer references the protected helper.',
        helper.exportName
      );
    }
  }

  return issues;
}

export function printRuntimePlaceholderRegressionIssues(
  issues: RuntimePlaceholderRegressionIssue[]
): void {
  console.log(`Runtime placeholder regression audit finished. ${issues.length} issue(s).\n`);

  for (const issue of issues.slice(0, 80)) {
    console.log(`[ERROR] ${issue.file} :: ${issue.helper} :: ${issue.rule} :: ${issue.message}`);
    console.log(`        ${issue.code}`);
  }

  if (issues.length > 80) {
    console.log(`\n... ${issues.length - 80} more issue(s) omitted.`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateRuntimePlaceholderRegressions()
    .then((issues) => {
      printRuntimePlaceholderRegressionIssues(issues);
      process.exit(issues.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Runtime placeholder regression audit failed to run.');
      console.error(error);
      process.exit(1);
    });
}
