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
  path.join('dist', 'client'),
];

const FILE_EXTENSIONS = new Set([
  '.html',
  '.xml',
  '.json',
]);

const FORBIDDEN_PATTERNS: ForbiddenPattern[] = [
  { label: 'internal reasoning tag', pattern: /<!--\s*reasoning\s*-->/i },
  { label: 'thinking process leak', pattern: /\bThinking\s+Process:/i },
  { label: 'unresolved BASE_URL', pattern: /\$\{BASE_URL\}/ },
  { label: 'TODO placeholder', pattern: /\bTODO:/ },
  { label: 'MISSING placeholder', pattern: /\[MISSING\]/i },
  { label: 'PLACEHOLDER placeholder', pattern: /\[PLACEHOLDER\]/i },
];

function shouldScanFile(filePath: string): boolean {
  return FILE_EXTENSIONS.has(path.extname(filePath));
}

async function listFiles(root: string): Promise<string[]> {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const entryPath = path.join(root, entry.name);
      if (entry.isDirectory()) {
        return listFiles(entryPath);
      }
      return shouldScanFile(entryPath) ? [entryPath] : [];
    }));
    return files.flat();
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return []; // Return empty if directory doesn't exist yet
    }
    throw err;
  }
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

export async function validatePrerenderSafety(): Promise<SafetyIssue[]> {
  const files = (await Promise.all(ROOTS_TO_SCAN.map(listFiles))).flat();
  const issues: SafetyIssue[] = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    issues.push(...scanText(file, source));
  }

  return issues;
}

async function main(): Promise<void> {
  console.log('🏁 Starting prerender safety deep scan...');
  const issues = await validatePrerenderSafety();
  
  if (issues.length > 0) {
    console.error('❌ Prerender safety validation failed! Forbidden traces found in output:');
    for (const issue of issues) {
      console.error(`  - ${issue.file}:${issue.line} [${issue.label}] ${issue.text}`);
    }
    process.exit(1);
  }

  console.log('✅ Prerender safety validation passed: No internal reasoning or placeholder traces leaked into dist/client.');
}

main().catch((error) => {
  console.error('❌ Unexpected error during prerender safety scan:', error);
  process.exit(1);
});
