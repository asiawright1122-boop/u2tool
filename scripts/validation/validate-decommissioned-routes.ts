import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const distDir = path.join(repoRoot, 'dist', 'client');

// === KNOWN DECOMMISSIONED ROUTE FAMILIES ===
// These routes MUST return 410 Gone via edge middleware.
// Source of truth: src/lib/legacy-build-assets.ts (LEGACY_BUILD_ASSET_PREFIXES)
//                  src/lib/legacy-redirects.ts (isDecommissionedLegacyRoute)

const DECOMMISSIONED_ROUTE_FAMILIES = [
  { pattern: '/_next/', source: 'legacy-build-assets.ts', description: 'Legacy Next.js build assets' },
  { pattern: '/dist/', source: 'legacy-build-assets.ts', description: 'Legacy dist assets' },
  { pattern: '/tools/compare/', source: 'legacy-redirects.ts', description: 'Decommissioned compare pages' },
  { pattern: '/tools/categories/', source: 'legacy-redirects.ts', description: 'Decommissioned category pages' },
] as const;

// Routes that are intercepted by middleware for REDIRECT (301), not 410.
// These are NOT decommissioned — they are legitimate redirect rules.
const KNOWN_REDIRECT_ROUTES = [
  '/',               // Root → /en/ redirect
  '/tools/category/*',  // → /en/categories/*/
  '/tools/ranking/*',   // → /en/tools/
] as const;

// Routes that correspond to real prerendered pages or API endpoints
const KNOWN_REAL_ROUTES = [
  '/api/ai-discovery/*',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-pages.xml',
  '/sitemap-tools.xml',
  '/llms.txt',
] as const;

// Locale prefixes for SSR dynamic tool pages and site info pages
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'] as const;

interface Violation {
  check: string;
  detail: string;
}

interface Warning {
  check: string;
  detail: string;
}

async function main() {
  console.log('=== Running Decommissioned Routes & Orphan Route Validator ===\n');

  const violations: Violation[] = [];
  const warnings: Warning[] = [];

  // --- Check 1: _routes.json exists and is parseable ---
  const routesPath = path.join(repoRoot, 'public', '_routes.json');
  if (!fs.existsSync(routesPath)) {
    console.error(`Error: _routes.json not found at ${routesPath}.`);
    process.exit(1);
  }

  const routesConfig = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
  const includeRules: string[] = routesConfig.include || [];

  // --- Check 2: All decommissioned families are covered by _routes.json include rules ---
  for (const family of DECOMMISSIONED_ROUTE_FAMILIES) {
    const covered = includeRules.some((rule) => {
      // Match if rule starts with the family pattern (e.g., "/_next/*" starts with "/_next/")
      return rule.startsWith(family.pattern);
    });
    if (!covered) {
      violations.push({
        check: 'missing-route-intercept',
        detail: `Decommissioned route family "${family.pattern}" (from ${family.source}) is NOT covered by any _routes.json include rule. Edge middleware cannot intercept these requests.`,
      });
    }
  }

  // --- Check 3: Orphan route discovery ---
  // Compare _routes.json includes against physical dist/client files and known handlers
  if (fs.existsSync(distDir)) {
    for (const rule of includeRules) {
      // Skip known legitimate routes
      const isKnownRedirect = KNOWN_REDIRECT_ROUTES.some((r) => rule === r);
      const isKnownReal = KNOWN_REAL_ROUTES.some((r) => rule === r);
      const isDecommissioned = DECOMMISSIONED_ROUTE_FAMILIES.some((f) => rule.startsWith(f.pattern));
      const isLocalizedRoute = LOCALES.some((l) => rule.startsWith(`/${l}/`));

      if (isKnownRedirect || isKnownReal || isDecommissioned || isLocalizedRoute) {
        continue; // Skip known routes
      }

      // For remaining rules, check if a physical file or directory exists
      const cleanRule = rule.replace(/\*$/, '').replace(/\/$/, '');
      const physicalPath = path.join(distDir, cleanRule);
      const physicalPathIndex = path.join(distDir, cleanRule, 'index.html');

      if (
        !fs.existsSync(physicalPath) &&
        !fs.existsSync(physicalPathIndex) &&
        !fs.existsSync(physicalPath + '.html')
      ) {
        warnings.push({
          check: 'orphan-route',
          detail: `_routes.json include rule "${rule}" has no physical file in dist/client/ and is not a known middleware handler. Verify it is intentionally handled by edge middleware.`,
        });
      }
    }
  }

  // --- Check 4: Source file consistency ---
  // Verify that the source files still export the expected patterns
  const legacyBuildAssetsPath = path.join(repoRoot, 'src', 'lib', 'legacy-build-assets.ts');
  if (fs.existsSync(legacyBuildAssetsPath)) {
    const source = fs.readFileSync(legacyBuildAssetsPath, 'utf-8');
    for (const prefix of ['/_next/', '/dist/']) {
      if (!source.includes(`'${prefix}'`)) {
        violations.push({
          check: 'source-drift',
          detail: `Expected prefix "${prefix}" not found in legacy-build-assets.ts LEGACY_BUILD_ASSET_PREFIXES`,
        });
      }
    }
  } else {
    violations.push({
      check: 'source-missing',
      detail: 'src/lib/legacy-build-assets.ts not found — cannot verify 410 prefix patterns',
    });
  }

  const legacyRedirectsPath = path.join(repoRoot, 'src', 'lib', 'legacy-redirects.ts');
  if (fs.existsSync(legacyRedirectsPath)) {
    const source = fs.readFileSync(legacyRedirectsPath, 'utf-8');
    if (!source.includes('isDecommissionedLegacyRoute')) {
      violations.push({
        check: 'source-drift',
        detail: 'isDecommissionedLegacyRoute function not found in legacy-redirects.ts',
      });
    }
    // Verify compare and categories are checked
    for (const segment of ['compare', 'categories']) {
      if (!source.includes(`'${segment}'`)) {
        violations.push({
          check: 'source-drift',
          detail: `Expected segment "${segment}" not found in isDecommissionedLegacyRoute logic in legacy-redirects.ts`,
        });
      }
    }
  } else {
    violations.push({
      check: 'source-missing',
      detail: 'src/lib/legacy-redirects.ts not found — cannot verify decommissioned route patterns',
    });
  }

  // --- Report ---
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):\n`);
    for (const w of warnings) {
      console.log(`  [${w.check}] ${w.detail}`);
    }
  }

  if (violations.length > 0) {
    console.error(`\n❌ Decommissioned routes validation FAILED with ${violations.length} violation(s):\n`);
    for (const v of violations) {
      console.error(`  [${v.check}] ${v.detail}`);
    }
    console.error('');
    process.exit(1);
  }

  console.log(`\n✅ Decommissioned routes validation PASSED`);
  console.log(`   - ${DECOMMISSIONED_ROUTE_FAMILIES.length} decommissioned route families verified in _routes.json`);
  console.log(`   - Source file consistency checks passed`);
  console.log(`   - ${includeRules.length} _routes.json include rules analyzed`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
