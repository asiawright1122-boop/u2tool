import fs from 'fs';
const fsDirect = fs;
import path from 'path';
import { fileURLToPath } from 'url';
import { tools } from '../../src/config/tools/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const KNOWN_COMPARE_SLUGS = [
  'choose-text-tool',
  'choose-chart-type',
  'choose-image-tool',
  'choose-json-tool',
  'choose-jwt-tool',
  'meta-tags-vs-open-graph-vs-twitter-cards'
];
const KNOWN_CATEGORIES = [
  'text', 'encoding', 'generators', 'converters', 'development',
  'security', 'network', 'image', 'math', 'charts',
  'office', 'lifestyle', 'finance', 'fun'
];
const STATIC_SLUGS = ['privacy', 'terms', 'contact', 'ai', 'compare'];

// Help algorithms
function levenshtein(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[m][n];
}

function getBigrams(str: string): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.add(str.substring(i, i + 2));
  }
  return bigrams;
}

export function diceCoefficient(s1: string, s2: string): number {
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0.0;
  const bigrams1 = getBigrams(s1);
  const bigrams2 = getBigrams(s2);
  let intersection = 0;
  for (const b of bigrams1) {
    if (bigrams2.has(b)) {
      intersection++;
    }
  }
  return (2 * intersection) / (bigrams1.size + bigrams2.size);
}

// Generate all canonical routes in the system (relative core paths without locale)
export function getSystemCoreRoutes(): string[] {
  const routes = new Set<string>();
  routes.add('/');
  
  // Tools
  for (const t of tools) {
    routes.add(`/tools/${t.slug}/`);
  }
  
  // Categories
  for (const c of KNOWN_CATEGORIES) {
    routes.add(`/categories/${c}/`);
  }
  
  // Compare guides
  routes.add('/compare/');
  for (const g of KNOWN_COMPARE_SLUGS) {
    routes.add(`/compare/${g}/`);
  }
  
  // Static pages
  for (const s of STATIC_SLUGS) {
    routes.add(`/${s}/`);
  }
  
  return Array.from(routes);
}

// Extract locale and unlocalized core path
export function parseUrlPath(urlPath: string): { locale: string; corePath: string } {
  // Remove query string or hash if present
  let cleanPath = urlPath.split('?')[0].split('#')[0];
  // Ensure starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    const locale = segments[0];
    const corePath = '/' + segments.slice(1).join('/') + (cleanPath.endsWith('/') && segments.length > 1 ? '/' : '');
    return { locale, corePath };
  }
  
  return { locale: 'en', corePath: cleanPath };
}

// Score a candidate core path against system canonical core path
export function calculateMatchScore(sourceCore: string, targetCore: string): number {
  const cleanSrc = sourceCore.replace(/^\/+|\/+$/g, '').toLowerCase();
  const cleanTgt = targetCore.replace(/^\/+|\/+$/g, '').toLowerCase();
  
  if (cleanSrc === cleanTgt) return 10.0;
  
  const srcSegs = cleanSrc.split('/');
  const tgtSegs = cleanTgt.split('/');
  
  // Normalize categories / tools synonyms
  const normalize = (w: string) => {
    if (w === 'categories') return 'category';
    if (w === 'tools') return 'tool';
    return w;
  };
  
  const srcWords = cleanSrc.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean).map(normalize);
  const tgtWords = cleanTgt.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean).map(normalize);
  
  const srcSet = new Set(srcWords);
  const tgtSet = new Set(tgtWords);
  
  let overlap = 0;
  for (const w of srcSet) {
    if (tgtSet.has(w)) overlap++;
  }
  
  const jaccard = overlap / (srcSet.size + tgtSet.size - overlap) || 0;
  const dice = diceCoefficient(cleanSrc, cleanTgt);
  const maxLen = Math.max(cleanSrc.length, cleanTgt.length);
  const levSim = maxLen > 0 ? 1 - levenshtein(cleanSrc, cleanTgt) / maxLen : 0;
  
  let bonus = 0;
  // Special handling: old category paths like /tools/category/math -> /categories/math/
  const isSrcCat = srcSegs.includes('category') || srcSegs.includes('categories');
  const isTgtCat = tgtSegs.includes('categories');
  if (isSrcCat && isTgtCat) {
    const srcCatVal = srcSegs.find(s => s !== 'tools' && s !== 'category' && s !== 'categories');
    const tgtCatVal = tgtSegs.find(s => s !== 'categories');
    if (srcCatVal && tgtCatVal && srcCatVal === tgtCatVal) {
      bonus += 5.0; // match same category name
    }
  }
  
  return jaccard * 4.0 + dice * 3.0 + levSim * 3.0 + bonus;
}

// Find the best recommendation for a given 404 URL path
export function recommendRedirect(urlPath: string, systemCoreRoutes: string[], threshold = 2.5): {
  targetPath: string;
  score: number;
  matchType: 'exact' | 'fuzzy' | 'fallback';
} {
  const { locale, corePath } = parseUrlPath(urlPath);
  
  // 1. Try exact match on core path
  for (const r of systemCoreRoutes) {
    if (corePath.replace(/^\/+|\/+$/g, '') === r.replace(/^\/+|\/+$/g, '')) {
      const targetPath = `/${locale}${r}`;
      return { targetPath, score: 10.0, matchType: 'exact' };
    }
  }
  
  // 2. Try fuzzy match
  let bestRoute = '';
  let maxScore = -1;
  for (const r of systemCoreRoutes) {
    const score = calculateMatchScore(corePath, r);
    if (score > maxScore) {
      maxScore = score;
      bestRoute = r;
    }
  }
  
  if (maxScore >= threshold && bestRoute) {
    const targetPath = `/${locale}${bestRoute}`;
    return { targetPath, score: maxScore, matchType: 'fuzzy' };
  }
  
  // 3. Fallback to homepage
  return { targetPath: `/${locale}/`, score: 0.0, matchType: 'fallback' };
}

// CLI entry point
function runCli() {
  const args = process.argv.slice(2);
  let inputPath = path.join(__dirname, 'urls.txt');
  let outputPath = path.join(__dirname, 'recommended-mappings.json');
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputPath = path.resolve(process.cwd(), args[i + 1]);
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputPath = path.resolve(process.cwd(), args[i + 1]);
      i++;
    }
  }
  
  console.log('=== GSC Recovery Mappings Generator ===');
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}\n`);
  
  if (!fsDirect.existsSync(inputPath)) {
    const templateContent = [
      '# Put GSC Excluded 404 URL paths here, one per line',
      '/typing-test',
      '/zh/tools/typing-test',
      '/ru/tools/toml-json',
      '/es/tools/category/office',
      '/ko/some-random-404-url'
    ].join('\n');
    
    fsDirect.mkdirSync(path.dirname(inputPath), { recursive: true });
    fsDirect.writeFileSync(inputPath, templateContent, 'utf8');
    console.log(`⚠️ Input file not found. Created a template urls.txt at: ${inputPath}`);
    console.log('Please edit the file with actual 404 URLs or run the script pointing to your file using --input.');
    return;
  }
  
  const fileContent = fsDirect.readFileSync(inputPath, 'utf8');
  const urls = fileContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
    
  if (urls.length === 0) {
    console.log('No URLs found to process.');
    return;
  }
  
  const systemCoreRoutes = getSystemCoreRoutes();
  const mappings: Record<string, string> = {};
  
  console.log(`Loaded ${systemCoreRoutes.length} system canonical routes.`);
  console.log(`Processing ${urls.length} URLs...\n`);
  
  console.log(
    `${'Source 404 URL'.padEnd(35)} | ${'Recommended Target'.padEnd(40)} | ${'Score'.padEnd(6)} | ${'Type'}`
  );
  console.log('-'.repeat(95));
  
  for (const url of urls) {
    const recommendation = recommendRedirect(url, systemCoreRoutes);
    mappings[url] = recommendation.targetPath;
    
    const displaySrc = url.length > 33 ? url.substring(0, 30) + '...' : url;
    const displayTgt = recommendation.targetPath.length > 38 ? recommendation.targetPath.substring(0, 35) + '...' : recommendation.targetPath;
    const displayScore = recommendation.score.toFixed(1);
    
    console.log(
      `${displaySrc.padEnd(35)} | ${displayTgt.padEnd(40)} | ${displayScore.padEnd(6)} | ${recommendation.matchType}`
    );
  }
  
  fsDirect.mkdirSync(path.dirname(outputPath), { recursive: true });
  fsDirect.writeFileSync(outputPath, JSON.stringify(mappings, null, 2), 'utf8');
  console.log(`\n✅ Successfully generated ${urls.length} mappings!`);
  console.log(`Results saved to: ${outputPath}`);
}

if (process.argv[1] && (process.argv[1] === __filename || process.argv[1].endsWith('generate-mappings.ts'))) {
  runCli();
}
