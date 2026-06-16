import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const distDir = path.join(repoRoot, 'dist', 'client');

const CANONICAL_BASE_URL = (
  process.env.CANONICAL_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.u2tool.com'
).replace(/\/+$/, '');

const FETCH_BASE_URL = (
  process.env.PROD_BASE_URL ||
  'http://localhost:8787'
).replace(/\/+$/, '');

const CONCURRENCY = Number(process.env.SITEMAP_URL_HEALTH_CONCURRENCY || 12);
const MAX_TOOLS_SAMPLED_PER_LOCALE = Number(process.env.SITEMAP_URL_HEALTH_MAX_TOOLS_PER_LOCALE || 50);

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function extractLocs(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1].trim());
}

function getLocaleFromUrl(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments[0] && LOCALES.includes(segments[0])) {
      return segments[0];
    }
    return 'en'; // default if no locale segment
  } catch {
    return 'en';
  }
}

function selectEvenly<T>(items: T[], maxItems: number): T[] {
  if (items.length <= maxItems) {
    return items;
  }
  if (maxItems <= 0) {
    return [];
  }
  const selected: T[] = [];
  const step = (items.length - 1) / Math.max(1, maxItems - 1);
  for (let index = 0; index < maxItems; index += 1) {
    selected.push(items[Math.round(index * step)]);
  }
  return Array.from(new Set(selected));
}

async function fetchWithRetry(url: string, init: RequestInit = {}, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
  throw lastError;
}

async function fetchTextWithRetry(
  url: string,
  init: RequestInit = {},
  attempts = 3
): Promise<{ response: Response; text: string }> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      const text = await response.text();
      return { response, text };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
  throw lastError;
}

// Convert absolute canonical URL to local physical path in dist/client/
function getLocalFilePath(urlStr: string): string {
  const parsed = new URL(urlStr);
  const pathname = parsed.pathname;

  // If ends in a file-like extension (e.g. .xml, .txt), map directly
  if (pathname.endsWith('.xml') || pathname.endsWith('.txt') || pathname.endsWith('.json')) {
    return path.join(distDir, pathname);
  }

  // Otherwise, maps to index.html within that directory
  return path.join(distDir, pathname, 'index.html');
}

// Check if page path is statically prerendered or dynamic SSR-routed
function shouldExistLocally(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const pathname = parsed.pathname;

    // Static files (sitemaps, etc.) must exist locally
    if (pathname.endsWith('.xml') || pathname.endsWith('.txt') || pathname.endsWith('.json')) {
      return true;
    }

    // Comparison pages are statically prerendered and must exist on disk
    if (pathname.includes('/compare/')) {
      return true;
    }

    // Tools pages (/tools/*), category pages, and localized homepages are dynamic SSR pages.
    // They are handled by Cloudflare workers and do not have local index.html.
    return false;
  } catch {
    return false;
  }
}

async function mapWithConcurrency<T, R>(items: T[], mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
  return results;
}

async function main() {
  const isOnline = process.argv.includes('--online');
  console.log('=== Running Dual-Stage Sitemap Validator ===');
  console.log(`Mode: ${isOnline ? 'OFFLINE + ONLINE (crawling)' : 'OFFLINE ONLY'}\n`);

  if (!fs.existsSync(distDir)) {
    console.error(`Error: build output directory dist/client does not exist at ${distDir}. Run npm run build first.`);
    process.exit(1);
  }

  const sitemapIndexLocalPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapIndexLocalPath)) {
    console.error(`Error: sitemap.xml index not found at ${sitemapIndexLocalPath}`);
    process.exit(1);
  }

  // Step 1: Read local sitemap index and extract child sitemap URLs
  const sitemapIndexXml = fs.readFileSync(sitemapIndexLocalPath, 'utf8');
  const childSitemapUrls = extractLocs(sitemapIndexXml);
  console.log(`Loaded sitemap.xml index. Found ${childSitemapUrls.length} child sitemaps:`);
  childSitemapUrls.forEach(url => console.log(`  - ${url}`));
  console.log('');

  const allUrlsMap = new Map<string, { sitemap: string; url: string }>();

  // Step 2: Load and parse child sitemaps from local files
  for (const childUrl of childSitemapUrls) {
    const parsedUrl = new URL(childUrl);
    const filename = path.basename(parsedUrl.pathname);
    const localSitemapPath = path.join(distDir, filename);

    if (!fs.existsSync(localSitemapPath)) {
      console.error(`❌ Error: Child sitemap file missing locally: dist/client/${filename}`);
      process.exit(1);
    }

    const xml = fs.readFileSync(localSitemapPath, 'utf8');
    const urls = extractLocs(xml);
    console.log(`Loaded dist/client/${filename} containing ${urls.length} URLs.`);

    for (const url of urls) {
      // Basic shape validation
      assert(url.startsWith(CANONICAL_BASE_URL), `Sitemap URL "${url}" in ${filename} does not start with expected base "${CANONICAL_BASE_URL}"`);
      
      const parsedUrl = new URL(url);
      if (parsedUrl.pathname !== '/' && !parsedUrl.pathname.endsWith('/') && !parsedUrl.pathname.endsWith('.xml') && !parsedUrl.pathname.endsWith('.txt')) {
        throw new Error(`Sitemap URL "${url}" in ${filename} is missing trailing slash`);
      }

      allUrlsMap.set(url, { sitemap: filename, url });
    }
  }

  const allUrls = Array.from(allUrlsMap.values());
  console.log(`\nTotal unique URLs extracted from all sitemaps: ${allUrls.length}`);

  // STAGE 1: Offline Physical Existence Check (Only for Prerendered Pages)
  console.log('\n--- Stage 1: Physical File Existence Check ---');
  let missingFilesCount = 0;
  let skippedSsrCount = 0;
  for (const item of allUrls) {
    if (!shouldExistLocally(item.url)) {
      skippedSsrCount += 1;
      continue;
    }

    const localFile = getLocalFilePath(item.url);
    if (!fs.existsSync(localFile)) {
      console.error(`❌ Missing physical file for sitemap URL:`);
      console.error(`   Sitemap:  ${item.sitemap}`);
      console.error(`   URL:      ${item.url}`);
      console.error(`   Expected: dist/client${localFile.substring(distDir.length)}`);
      console.error('--------------------------------------------------');
      missingFilesCount += 1;
    }
  }

  console.log(`Prerender check: validated physical existence. Skipped ${skippedSsrCount} dynamic SSR URLs.`);

  if (missingFilesCount > 0) {
    console.error(`❌ Offline Physical check failed: ${missingFilesCount} statically prerendered page(s) declared in sitemap do not exist in build output.`);
    process.exit(1);
  }
  console.log('✅ Offline physical existence check passed! All static URLs exist on disk.');

  // STAGE 2: Online Crawl Check (if --online is passed)
  if (isOnline) {
    console.log('\n--- Stage 2: Online HTTP Response Check ---');
    console.log(`Simulated Server Base URL: ${FETCH_BASE_URL}`);

    // Sample URLs for online check to avoid overloading simulated worker limits
    const priorityUrls = allUrls.filter(item => item.sitemap === 'sitemap-priority.xml' || item.sitemap === 'sitemap-pages.xml');
    const toolsUrls = allUrls.filter(item => item.sitemap === 'sitemap-tools.xml');

    // Group tools by locale
    const toolsByLocale: Record<string, typeof toolsUrls> = {};
    for (const locale of LOCALES) {
      toolsByLocale[locale] = [];
    }

    for (const item of toolsUrls) {
      const locale = getLocaleFromUrl(item.url);
      if (toolsByLocale[locale]) {
        toolsByLocale[locale].push(item);
      }
    }

    const sampledToolsUrls: typeof toolsUrls = [];
    for (const locale of LOCALES) {
      const localeTools = toolsByLocale[locale] || [];
      const sampled = selectEvenly(localeTools, MAX_TOOLS_SAMPLED_PER_LOCALE);
      sampledToolsUrls.push(...sampled);
      console.log(`Locale [${locale}]: sampled ${sampled.length} of ${localeTools.length} tools URLs.`);
    }

    const onlineCheckList = [...priorityUrls, ...sampledToolsUrls];
    console.log(`\nTotal URLs selected for online check: ${onlineCheckList.length} (Priority/Pages: 100%, Tools: sampled)`);

    let checkFailures = 0;

    const validateOnlineUrl = async (item: typeof onlineCheckList[0]) => {
      // Map canonical host to FETCH_BASE_URL for testing
      const targetUrl = item.url.replace(CANONICAL_BASE_URL, FETCH_BASE_URL);
      try {
        // Fetch HEAD first to check status and check for redirects
        const response = await fetchWithRetry(targetUrl, { method: 'HEAD', redirect: 'manual' });
        
        if (response.status >= 300 && response.status < 400) {
          const loc = response.headers.get('location') || '(missing location)';
          console.error(`❌ HTTP Redirect (${response.status}) on URL: ${item.url} -> Location: ${loc}`);
          checkFailures += 1;
          return;
        }

        if (response.status !== 200) {
          console.error(`❌ HTTP Status (${response.status}) on URL: ${item.url}`);
          checkFailures += 1;
          return;
        }

        // Fetch GET to scan body for placeholders
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          const { response: getResponse, text: html } = await fetchTextWithRetry(targetUrl, { redirect: 'manual' });
          if (getResponse.status !== 200) {
            console.error(`❌ HTTP GET Status (${getResponse.status}) on URL: ${item.url}`);
            checkFailures += 1;
            return;
          }

          if (html.includes('MISSING:') || html.includes('${BASE_URL}')) {
            console.error(`❌ Placeholder Leaked on URL: ${item.url} (Body contains 'MISSING:' or '\${BASE_URL}')`);
            checkFailures += 1;
          }
        }
      } catch (err) {
        console.error(`❌ Network error fetching ${item.url} (${targetUrl}): ${err instanceof Error ? err.message : String(err)}`);
        checkFailures += 1;
      }
    };

    await mapWithConcurrency(onlineCheckList, validateOnlineUrl);

    if (checkFailures > 0) {
      console.error(`\n❌ Online HTTP check failed. Found ${checkFailures} online check errors.`);
      process.exit(1);
    }
    console.log(`✅ Online health checks passed successfully on all ${onlineCheckList.length} checked URLs!`);
  }

  console.log('\n✅ All sitemap validation gates passed successfully!');
}

main().catch((error) => {
  console.error('Unexpected sitemap validation error:', error);
  process.exit(1);
});
