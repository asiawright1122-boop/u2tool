import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

function isFileLikePath(pathname: string): boolean {
  const lastSegment = pathname.split('/').filter(Boolean).at(-1) || '';
  return /\.[a-z0-9]+$/i.test(lastSegment);
}

function isSkippableHref(href: string): boolean {
  const trimmed = href.trim();
  return (
    trimmed === '' ||
    trimmed === '/' ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//')
  );
}

interface HrefFailure {
  file: string;
  line: number;
  href: string;
  reason: string;
}

function auditHtmlFile(file: string, failures: HrefFailure[]): void {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    // Regex matching href="..." or href='...'
    const matches = line.matchAll(/href=(["'])(.*?)\1/g);

    for (const match of matches) {
      const rawHref = match[2];

      if (isSkippableHref(rawHref)) {
        continue;
      }

      // Extract pathname (strip search parameters and hash)
      const pathname = rawHref.split(/[?#]/)[0];

      // Ensure it is a site-internal path starting with /
      if (!pathname.startsWith('/')) {
        continue;
      }

      // Exclude static resources and file-like paths
      if (isFileLikePath(pathname)) {
        continue;
      }

      // Allow /api paths to bypass slash check if they exist
      if (pathname.startsWith('/api/')) {
        continue;
      }

      // If it doesn't end with slash, it is a failure
      if (!pathname.endsWith('/')) {
        failures.push({
          file,
          line: lineNumber,
          href: rawHref,
          reason: `internal link "${rawHref}" does not end with a trailing slash`,
        });
      }
    }
  });
}

function main(): void {
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist/ directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Find all HTML files in dist/
  const htmlFiles = glob.sync('dist/**/*.html');
  console.log(`Auditing ${htmlFiles.length} HTML files in dist/ for trailing-slash compliance...`);

  const failures: HrefFailure[] = [];
  for (const file of htmlFiles) {
    auditHtmlFile(file, failures);
  }

  if (failures.length > 0) {
    console.error(`\nFAIL: Found ${failures.length} non-canonical trailing slash link issues:\n`);
    failures.slice(0, 50).forEach((f) => {
      console.error(`  [FAIL] ${f.file}:${f.line} -> ${f.href} (${f.reason})`);
    });

    if (failures.length > 50) {
      console.error(`  ... and ${failures.length - 50} more issues.`);
    }

    process.exitCode = 1;
    return;
  }

  console.log(`\nOK: All HTML internal links are trailing-slash compliant.`);
}

main();
