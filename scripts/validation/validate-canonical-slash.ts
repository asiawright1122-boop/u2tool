import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const distDir = path.join(repoRoot, 'dist', 'client');

const CANONICAL_BASE_URL = (
  process.env.CANONICAL_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.u2tool.com'
).replace(/\/+$/, '');

function isSkippableHref(rawHref: string): boolean {
  const href = rawHref.trim();
  return (
    href === '' ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  );
}

function isSkippablePath(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/cdn-cgi/') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.pdf') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css')
  );
}

function isInternalUrl(urlStr: string): boolean {
  if (urlStr.startsWith('/') && !urlStr.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(urlStr);
    return (
      parsed.origin === CANONICAL_BASE_URL ||
      parsed.hostname === 'www.u2tool.com' ||
      parsed.hostname === 'u2tool.com' ||
      parsed.hostname === 'localhost'
    );
  } catch {
    return false;
  }
}

interface Violation {
  file: string;
  type: 'canonical' | 'anchor';
  tag: string;
  value: string;
  reason: string;
}

async function main() {
  console.log('=== Running Trailing-Slash Canonical and Internal Link Validator ===\n');

  if (!fs.existsSync(distDir)) {
    console.error(`Error: build output directory dist/client does not exist at ${distDir}. Run npm run build first.`);
    process.exit(1);
  }

  const htmlFiles = await glob('**/*.html', { cwd: distDir });
  console.log(`Found ${htmlFiles.length} HTML files to scan in ${distDir}.\n`);

  const violations: Violation[] = [];

  for (const relativePath of htmlFiles) {
    const fullPath = path.join(distDir, relativePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const $ = cheerio.load(content);

    // 1. Validate Canonical URL
    const canonicalLink = $('link[rel="canonical"]');
    if (canonicalLink.length > 0) {
      const href = canonicalLink.attr('href')?.trim() || '';
      if (!href) {
        violations.push({
          file: relativePath,
          type: 'canonical',
          tag: '<link rel="canonical" href="" />',
          value: '',
          reason: 'canonical tag exists but has empty href attribute',
        });
      } else {
        // Assert it starts with CANONICAL_BASE_URL
        if (!href.startsWith(CANONICAL_BASE_URL)) {
          violations.push({
            file: relativePath,
            type: 'canonical',
            tag: $.html(canonicalLink.first()),
            value: href,
            reason: `canonical URL does not start with expected base "${CANONICAL_BASE_URL}"`,
          });
        }

        try {
          const parsed = new URL(href);
          const pathname = parsed.pathname;
          if (pathname !== '/' && !pathname.endsWith('/') && !isSkippablePath(pathname)) {
            violations.push({
              file: relativePath,
              type: 'canonical',
              tag: $.html(canonicalLink.first()),
              value: href,
              reason: 'canonical URL path is missing trailing slash',
            });
          }
        } catch {
          violations.push({
            file: relativePath,
            type: 'canonical',
            tag: $.html(canonicalLink.first()),
            value: href,
            reason: 'invalid URL syntax in canonical href',
          });
        }
      }
    } else {
      violations.push({
        file: relativePath,
        type: 'canonical',
        tag: 'None',
        value: '',
        reason: 'missing <link rel="canonical"> tag',
      });
    }

    // 2. Validate all internal <a> anchor links
    $('a[href]').each((_, element) => {
      const aTag = $(element);
      const rawHref = aTag.attr('href') || '';
      const cleanHref = rawHref.trim();

      if (isSkippableHref(cleanHref)) {
        return;
      }

      if (!isInternalUrl(cleanHref)) {
        // External link, skip trailing-slash validation
        return;
      }

      try {
        // Parse with a dummy base URL to extract pathname easily for relative links
        const parsed = new URL(cleanHref, CANONICAL_BASE_URL);
        const pathname = parsed.pathname;

        if (pathname !== '/' && !pathname.endsWith('/') && !isSkippablePath(pathname)) {
          violations.push({
            file: relativePath,
            type: 'anchor',
            tag: $.html(aTag),
            value: rawHref,
            reason: 'internal page link path is missing trailing slash',
          });
        }
      } catch {
        violations.push({
          file: relativePath,
          type: 'anchor',
          tag: $.html(aTag),
          value: rawHref,
          reason: 'invalid URL syntax in href',
        });
      }
    });
  }

  if (violations.length > 0) {
    console.error(`❌ Trailing-Slash Canonical and Internal Link Validation failed. Found ${violations.length} violation(s):\n`);
    violations.forEach((v, idx) => {
      console.error(`[${idx + 1}] File: dist/client/${v.file}`);
      console.error(`    Type: ${v.type.toUpperCase()}`);
      console.error(`    Tag:  ${v.tag}`);
      console.error(`    Value: ${v.value}`);
      console.error(`    Issue: ${v.reason}`);
      console.error('--------------------------------------------------');
    });
    process.exit(1);
  }

  console.log('✅ Trailing-Slash Canonical and Internal Link Validation passed successfully!');
}

main().catch((error) => {
  console.error('Unexpected trailing slash validation error:', error);
  process.exit(1);
});
