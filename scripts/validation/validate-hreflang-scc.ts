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

function urlToLocalPath(href: string): string | null {
  if (!href.startsWith(CANONICAL_BASE_URL)) {
    return null;
  }
  try {
    const parsed = new URL(href);
    let pathname = parsed.pathname;
    
    if (pathname.startsWith('/')) {
        pathname = pathname.slice(1);
    }

    if (pathname === '') {
        pathname = 'index.html';
    } else if (pathname.endsWith('/')) {
      pathname += 'index.html';
    } else if (!pathname.endsWith('.html')) {
      pathname += '/index.html';
    }
    
    return path.join(distDir, pathname);
  } catch {
    return null;
  }
}

async function main() {
  console.log('=== Running Hreflang Symmetrical Validation ===\n');

  if (!fs.existsSync(distDir)) {
    console.error(`Error: build output directory dist/client does not exist at ${distDir}. Run npm run build first.`);
    process.exit(1);
  }

  const htmlFiles = await glob('**/*.html', { cwd: distDir });
  console.log(`Found ${htmlFiles.length} HTML files to scan in ${distDir}.\n`);

  const edgeMap: Record<string, Set<string>> = {};

  for (const relativePath of htmlFiles) {
    const fullPath = path.join(distDir, relativePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const $ = cheerio.load(content);

    const targets = new Set<string>();
    
    $('link[rel="alternate"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const localTarget = urlToLocalPath(href);
        if (localTarget) {
          targets.add(localTarget);
        }
      }
    });

    edgeMap[fullPath] = targets;
  }

  let violations = 0;

  for (const source of Object.keys(edgeMap)) {
    const targets = edgeMap[source];
    
    for (const target of targets) {
      if (!fs.existsSync(target)) {
        console.error(`❌ Missing file: ${source} points to ${target} which does not exist.`);
        violations++;
        continue;
      }
      
      const targetEdges = edgeMap[target];
      if (!targetEdges || !targetEdges.has(source)) {
        console.error(`❌ Asymmetrical link: ${source} points to ${target}, but ${target} does NOT point back to ${source}.`);
        violations++;
      }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Hreflang validation failed with ${violations} violations.`);
    process.exit(1);
  }

  console.log('✅ Hreflang graphs are perfectly symmetrical strongly connected components!');
}

main().catch(err => {
  console.error('Unexpected hreflang validation error:', err);
  process.exit(1);
});
