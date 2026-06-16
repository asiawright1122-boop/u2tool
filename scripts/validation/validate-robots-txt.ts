import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const distDir = path.join(repoRoot, 'dist', 'client');

// === EXPECTED DATA ===

const EXPECTED_AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'cohere-ai',
  'Bytespider',
  'meta-externalagent',
  'Amazonbot',
] as const;

const EXPECTED_SITEMAPS = [
  'sitemap.xml',
  'sitemap-priority.xml',
  'sitemap-pages.xml',
  'sitemap-tools.xml',
] as const;

interface Violation {
  check: string;
  detail: string;
}

async function main() {
  console.log('=== Running Robots.txt Structure & Completeness Validator ===\n');

  // --- Guard: dist/client must exist ---
  if (!fs.existsSync(distDir)) {
    console.error(`Error: dist/client does not exist at ${distDir}. Run npm run build first.`);
    process.exit(1);
  }

  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    console.error(`Error: robots.txt not found at ${robotsPath}.`);
    process.exit(1);
  }

  const content = fs.readFileSync(robotsPath, 'utf-8');
  const lines = content.split('\n');
  const violations: Violation[] = [];

  // --- Check 1: No unresolved ${BASE_URL} template variable ---
  if (content.includes('${BASE_URL}') || content.includes('${base_url}')) {
    violations.push({
      check: 'template-leak',
      detail: 'robots.txt contains unresolved ${BASE_URL} template variable',
    });
  }

  // --- Check 2: Syntax — every User-agent block has at least one Allow or Disallow ---
  let currentUA: string | null = null;
  let hasDirective = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('User-agent:')) {
      if (currentUA !== null && !hasDirective) {
        violations.push({
          check: 'syntax',
          detail: `User-agent: ${currentUA} has no Allow or Disallow directive`,
        });
      }
      currentUA = trimmed.replace('User-agent:', '').trim();
      hasDirective = false;
    } else if (trimmed.startsWith('Allow:') || trimmed.startsWith('Disallow:')) {
      hasDirective = true;
    }
  }
  if (currentUA !== null && !hasDirective) {
    violations.push({
      check: 'syntax',
      detail: `User-agent: ${currentUA} has no Allow or Disallow directive`,
    });
  }

  // --- Check 3: AI Crawler UA completeness ---
  const foundUAs = new Set<string>();
  for (const line of lines) {
    const match = line.trim().match(/^User-agent:\s*(.+)$/);
    if (match) {
      foundUAs.add(match[1].trim());
    }
  }
  for (const crawler of EXPECTED_AI_CRAWLERS) {
    if (!foundUAs.has(crawler)) {
      violations.push({
        check: 'ai-crawler-missing',
        detail: `Expected AI crawler User-agent "${crawler}" not found in robots.txt`,
      });
    }
  }

  // --- Check 4: Sitemap URL cross-reference ---
  const sitemapLines = lines.filter((l) => l.trim().startsWith('Sitemap:'));
  const declaredSitemaps = sitemapLines.map((l) => {
    const url = l.replace('Sitemap:', '').trim();
    try {
      return new URL(url).pathname.replace(/^\//, '');
    } catch {
      return url;
    }
  });

  for (const expected of EXPECTED_SITEMAPS) {
    if (!declaredSitemaps.includes(expected)) {
      violations.push({
        check: 'sitemap-missing-declaration',
        detail: `Expected Sitemap "${expected}" not declared in robots.txt`,
      });
    }
  }

  // Cross-check: declared sitemaps must exist as physical files
  for (const sitemap of declaredSitemaps) {
    const sitemapPath = path.join(distDir, sitemap);
    if (!fs.existsSync(sitemapPath)) {
      violations.push({
        check: 'sitemap-missing-file',
        detail: `Declared Sitemap "${sitemap}" does not exist at ${sitemapPath}`,
      });
    }
  }

  // --- Check 5: Wildcard block must Disallow /api/, /_next/, /dist/ ---
  const wildcardBlockDisallows: string[] = [];
  let inWildcard = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'User-agent: *') {
      inWildcard = true;
    } else if (trimmed.startsWith('User-agent:') && inWildcard) {
      break;
    } else if (inWildcard && trimmed.startsWith('Disallow:')) {
      wildcardBlockDisallows.push(trimmed.replace('Disallow:', '').trim());
    }
  }
  for (const required of ['/api/', '/_next/', '/dist/']) {
    if (!wildcardBlockDisallows.includes(required)) {
      violations.push({
        check: 'wildcard-disallow',
        detail: `Wildcard User-agent block missing Disallow: ${required}`,
      });
    }
  }

  // --- Report ---
  if (violations.length > 0) {
    console.error(`\n❌ robots.txt validation FAILED with ${violations.length} violation(s):\n`);
    for (const v of violations) {
      console.error(`  [${v.check}] ${v.detail}`);
    }
    console.error('');
    process.exit(1);
  }

  console.log(`✅ robots.txt validation PASSED`);
  console.log(`   - ${foundUAs.size} User-agent blocks found`);
  console.log(`   - ${EXPECTED_AI_CRAWLERS.length}/${EXPECTED_AI_CRAWLERS.length} AI crawlers present`);
  console.log(`   - ${sitemapLines.length} Sitemap declarations verified against physical files`);
  console.log(`   - No template variable leaks detected`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
