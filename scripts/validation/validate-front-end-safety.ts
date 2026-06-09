import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

interface ForbiddenPattern {
  label: string;
  pattern: RegExp;
}

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

const FORBIDDEN_PATTERNS: ForbiddenPattern[] = [
  { label: 'chain-of-thought', pattern: /\bchain[-\s]?of[-\s]?thought\b/i },
  { label: 'reasoning trace', pattern: /\breasoning\s+trace\b/i },
  { label: 'internal reasoning', pattern: /\binternal\s+reasoning\b/i },
  { label: 'hidden reasoning', pattern: /\bhidden\s+reasoning\b/i },
  { label: 'hidden prompt', pattern: /\bhidden\s+prompt\b/i },
  { label: 'developer message leak', pattern: /\bdeveloper\s+messages?\b/i },
  { label: 'agent handoff leak', pattern: /\bagent\s+handoffs?\b/i },
  { label: 'scratchpad reasoning leak', pattern: /\bscratchpad\b.*\b(reasoning|thought|deliberation)\b/i },
  { label: 'model thinking leak', pattern: /\b(show|display|reveal)\b.*\b(model|assistant|agent)\b.*\bthinking\b/i },
  { label: 'Chinese chain-of-thought', pattern: /思考链|推理链/ },
  { label: 'Chinese internal reasoning', pattern: /内部(?:推理|思考)/ },
  { label: 'Chinese hidden prompt', pattern: /隐藏提示词|系统提示词/ },
];

function shouldScanFile(filePath: string): boolean {
  if (EXCLUDED_SUFFIXES.some((suffix) => filePath.endsWith(suffix))) {
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
