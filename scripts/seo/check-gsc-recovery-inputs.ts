import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface Args {
  inputDir?: string;
  coverageDir?: string;
  performanceDir?: string;
}

interface FileProbe {
  path: string;
  rows: number;
  urlRows: number;
  headers: string[];
}

const COVERAGE_GROUPS = [
  {
    key: 'crawled-not-indexed',
    label: '已抓取 - 尚未编入索引',
    patterns: [/已抓取.*尚未编入索引/, /crawled.*not.*indexed/i],
  },
  {
    key: 'google-selected-canonical',
    label: '重复网页，Google 选择的规范网页与用户指定的不同',
    patterns: [/Google.*选择.*规范/, /google.*selected.*canonical/i],
  },
  {
    key: 'noindex',
    label: '被“noindex”标记排除了',
    patterns: [/noindex/i, /标记.*排除/],
  },
  {
    key: 'blocked-4xx',
    label: '由于遇到其他 4xx 问题而被屏蔽了',
    patterns: [/4xx/i],
  },
  {
    key: 'not-found-404',
    label: '未找到 (404)',
    patterns: [/404/, /未找到/, /not.*found/i],
  },
];

const PERFORMANCE_FILES = [
  {
    key: 'pages-current',
    label: 'Pages current 28d',
    patterns: [/pages?[-_\s]?current/i, /网页.*当前/, /页面.*当前/],
  },
  {
    key: 'pages-previous',
    label: 'Pages previous 28d',
    patterns: [/pages?[-_\s]?previous/i, /网页.*previous/i, /网页.*过去/, /页面.*过去/],
  },
  {
    key: 'queries-current',
    label: 'Queries current 28d',
    patterns: [/queries?[-_\s]?current/i, /query[-_\s]?current/i, /查询.*当前/],
  },
  {
    key: 'queries-previous',
    label: 'Queries previous 28d',
    patterns: [/queries?[-_\s]?previous/i, /query[-_\s]?previous/i, /查询.*过去/],
  },
];

function parseArgs(argv: string[]): Args {
  const args: Args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (!current.startsWith('--')) {
      continue;
    }

    const key = current.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase()) as keyof Args;
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    }
  }

  return args;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function readCsvPreview(filePath: string): string[][] {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
  if (!text) {
    return [];
  }

  return text.split(/\r?\n/).slice(0, 101).map(parseCsvLine);
}

function isSpreadsheet(filePath: string): boolean {
  return /\.(csv|tsv|xlsx)$/i.test(filePath);
}

function listSpreadsheetFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dirPath, entry.name))
    .filter(isSpreadsheet)
    .sort();
}

function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith('/');
}

function probeFile(filePath: string): FileProbe {
  if (/\.xlsx$/i.test(filePath)) {
    return { path: filePath, rows: 0, urlRows: 0, headers: ['xlsx preview skipped'] };
  }

  const rows = readCsvPreview(filePath);
  const [headers = [], ...bodyRows] = rows;
  const urlRows = bodyRows.filter((row) => row.some((value) => looksLikeUrl(value))).length;
  return { path: filePath, rows: bodyRows.length, urlRows, headers };
}

function findMatch(files: string[], patterns: RegExp[]): string | undefined {
  return files.find((filePath) => {
    const name = path.basename(filePath);
    return patterns.some((pattern) => pattern.test(name));
  });
}

function formatRelative(filePath: string, cwd: string): string {
  return path.relative(cwd, filePath) || filePath;
}

function main(): void {
  const cwd = process.cwd();
  const args = parseArgs(process.argv.slice(2));
  const inputDir = path.resolve(args.inputDir || 'exports/gsc');
  const coverageDir = path.resolve(args.coverageDir || path.join(inputDir, 'coverage-drilldowns'));
  const performanceDir = path.resolve(args.performanceDir || inputDir);

  const coverageFiles = listSpreadsheetFiles(coverageDir);
  const performanceFiles = listSpreadsheetFiles(performanceDir);
  const missing: string[] = [];

  console.log('=== GSC Recovery Input Check ===');
  console.log(`Coverage drilldown dir: ${coverageDir}`);
  console.log(`Performance dir: ${performanceDir}`);
  console.log('');

  console.log('Coverage drilldown files:');
  if (coverageFiles.length === 0) {
    console.log('  none found');
  }

  for (const filePath of coverageFiles) {
    const probe = probeFile(filePath);
    console.log(
      `  ${formatRelative(filePath, cwd)} | previewRows=${probe.rows} | urlRows=${probe.urlRows} | headers=${probe.headers.join(' / ')}`
    );
  }

  for (const group of COVERAGE_GROUPS) {
    const filePath = findMatch(coverageFiles, group.patterns);
    if (!filePath) {
      missing.push(`Coverage drilldown: ${group.label}`);
      continue;
    }

    const probe = probeFile(filePath);
    if (!/\.xlsx$/i.test(filePath) && probe.urlRows === 0) {
      missing.push(`Coverage drilldown has no URL rows in preview: ${group.label}`);
    }
  }

  console.log('');
  console.log('Performance files:');
  if (performanceFiles.length === 0) {
    console.log('  none found');
  }

  for (const filePath of performanceFiles) {
    if (filePath.startsWith(coverageDir)) {
      continue;
    }

    const probe = probeFile(filePath);
    console.log(
      `  ${formatRelative(filePath, cwd)} | previewRows=${probe.rows} | urlRows=${probe.urlRows} | headers=${probe.headers.join(' / ')}`
    );
  }

  for (const required of PERFORMANCE_FILES) {
    const filePath = findMatch(performanceFiles, required.patterns);
    if (!filePath) {
      missing.push(`Performance export: ${required.label}`);
    }
  }

  console.log('');

  if (missing.length > 0) {
    console.log('Missing or incomplete inputs:');
    for (const item of missing) {
      console.log(`  - ${item}`);
    }
    console.log('');
    console.log('Next action: export the missing CSV/XLSX files from GSC, then rerun this command.');
    process.exitCode = 1;
    return;
  }

  console.log('All required GSC recovery inputs are present.');
}

main();
