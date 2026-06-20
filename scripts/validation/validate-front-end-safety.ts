import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { REASONING_TRACE_PATTERNS as FORBIDDEN_PATTERNS } from '../../src/lib/safety-patterns';

interface SafetyIssue {
  file: string;
  line: number;
  label: string;
  text: string;
}

const ROOTS_TO_SCAN = [
  path.join('src', 'components'),
  path.join('src', 'pages'),
  path.join('src', 'messages'),
  path.join('src', 'lib'),
  'public',
];

const FILE_EXTENSIONS = new Set([
  '.astro',
  '.svelte',
  '.ts',
  '.js',
  '.json',
  '.mjs',
  '.cjs',
]);

const EXCLUDED_SUFFIXES = [
  '.test.ts',
  '.test.js',
  '.spec.ts',
  '.spec.js',
  '.d.ts',
];

// 模式定义文件本身包含要检测的短语字面量（如 "思考链|推理链"），
// 扫描它会必然误报。它是 ADR 0002 规则的来源，而非被治理的对象。
const EXCLUDED_FILES = new Set([path.join('src', 'lib', 'safety-patterns.ts')]);

function shouldScanFile(filePath: string): boolean {
  if (EXCLUDED_SUFFIXES.some((suffix) => filePath.endsWith(suffix))) {
    return false;
  }
  if (EXCLUDED_FILES.has(filePath)) {
    return false;
  }

  return FILE_EXTENSIONS.has(path.extname(filePath));
}

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') {
        return [];
      }
      return listFiles(entryPath);
    }
    return shouldScanFile(entryPath) ? [entryPath] : [];
  }));

  return files.flat();
}

function scanText(file: string, source: string): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((lineText, index) => {
    for (const forbidden of FORBIDDEN_PATTERNS) {
      if (forbidden.pattern.test(lineText)) {
        issues.push({
          file,
          line: index + 1,
          label: forbidden.label,
          text: lineText.trim().slice(0, 180),
        });
      }
    }
  });

  return issues;
}

export async function validateFrontEndSafety(): Promise<SafetyIssue[]> {
  const files = (await Promise.all(ROOTS_TO_SCAN.map(listFiles))).flat();
  const issues: SafetyIssue[] = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    issues.push(...scanText(file, source));
  }

  return issues;
}

async function main(): Promise<void> {
  const issues = await validateFrontEndSafety();
  if (issues.length > 0) {
    console.error('Front-end safety validation failed. Internal reasoning traces must not render in user-facing surfaces.');
    for (const issue of issues) {
      console.error(`- ${issue.file}:${issue.line} [${issue.label}] ${issue.text}`);
    }
    process.exit(1);
  }

  console.log('Front-end safety validation passed: no internal reasoning trace leaks found.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
