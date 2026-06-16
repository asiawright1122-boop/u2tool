import puppeteer from 'puppeteer';
import http from 'node:http';
import { spawn, type ChildProcess } from 'node:child_process';

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

function checkServerActive(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, { timeout: 1500 }, (res) => {
      resolve(true);
      res.resume();
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

interface TestPageSpec {
  path: string;
  name: string;
  expectedSelectors: string[];
}

const PAGES_TO_TEST: TestPageSpec[] = [
  {
    path: '/zh/',
    name: 'Chinese Home Page',
    expectedSelectors: ['.main-content-with-sidebar', 'header'],
  },
  {
    path: '/zh/tools/json-formatter/',
    name: 'JSON Formatter Tool Page',
    expectedSelectors: ['.main-content-with-sidebar', 'header', '#json-formatter-container, .tool-wrapper, .svelte-island, svelte-island, astro-island'],
  },
  {
    path: '/llms.txt',
    name: 'LLM Discovery Endpoint',
    expectedSelectors: [], // LLM text file has no HTML selectors, we will audit text instead
  },
];

async function waitForServer(port: number, maxAttempts = 15, delay = 1000): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const active = await checkServerActive(port);
    if (active) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return false;
}

async function main(): Promise<void> {
  console.log('🏁 Starting E2E Puppeteer client-side smoke tests...');

  let serverProcess: ChildProcess | null = null;
  let isTempServer = false;

  // 1. Check if the local Astro server is active
  const isServerActive = await checkServerActive(PORT);
  if (!isServerActive) {
    console.log(`📡 Local Astro server is not running on port ${PORT}. Spawning a temporary server...`);
    
    // Launch preview server directly using npx to prevent nested npm process wrappers
    serverProcess = spawn('npx', ['astro', 'preview'], {
      stdio: 'ignore',
    });
    isTempServer = true;

    // Wait for the server to spin up and bind the port
    const ready = await waitForServer(PORT);
    if (!ready) {
      console.error(`❌ Failed to start temporary Astro preview server on port ${PORT} within timeout.`);
      if (serverProcess) {
        serverProcess.kill('SIGTERM');
      }
      process.exitCode = 1;
      return;
    }
    console.log(`📡 Temporary Astro preview server successfully launched on ${BASE_URL}.`);
  } else {
    console.log(`📡 Existing local server detected active at ${BASE_URL}. Reusing it.`);
  }

  console.log(`📡 Launching Headless Chromium for smoke testing...`);

  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  let hasFatalErrors = false;
  const fatalErrors: string[] = [];

  // 3. Listen to page-level JavaScript runtime crashes
  page.on('pageerror', (err) => {
    hasFatalErrors = true;
    fatalErrors.push(`[Page Runtime Crash]: ${err.message}\n${err.stack}`);
  });

  // 4. Listen to console errors (excluding minor third-party warnings if any)
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore favicon or non-fatal network assets errors if any
      if (text.includes('favicon.ico') || text.includes('chrome-extension')) {
        return;
      }
      hasFatalErrors = true;
      fatalErrors.push(`[Browser Console Error]: ${text}`);
    }
  });

  try {
    for (const spec of PAGES_TO_TEST) {
      const targetUrl = `${BASE_URL}${spec.path}`;
      console.log(`🔍 Inspecting ${spec.name} at: ${targetUrl}`);

      // Open target URL
      const response = await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });

      const status = response?.status() ?? 0;
      if (status !== 200) {
        throw new Error(`Expected HTTP 200, got ${status} on page ${spec.name}`);
      }

      // Special content assertion for LLMs.txt
      if (spec.path === '/llms.txt') {
        const textContent = await page.evaluate(() => document.body.innerText);
        if (!textContent.includes('# U2Tool') || !textContent.includes('U2Tool - Free Online Tools Catalog')) {
          throw new Error('LLM discovery page did not render the expected catalog content.');
        }
        console.log('✅ LLM Discovery Endpoint compiled and verified successfully in browser.');
        continue;
      }

      // Assert expected elements are loaded (Hydration did not break the structure)
      for (const selector of spec.expectedSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
        } catch {
          throw new Error(`Failed to locate critical layout element "${selector}" on ${spec.name}. Page may have crashed or failed to render.`);
        }
      }

      console.log(`✅ ${spec.name} rendered cleanly with all critical selectors present.`);
    }

    // E2E Check: Bare root route redirection to /en/
    console.log('🔍 E2E Check: Bare root route redirection to /en/');
    const rootPage = await browser.newPage();
    const response = await rootPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    const chain = response.request().redirectChain();
    
    if (chain.length === 0) {
      throw new Error('Expected root route to redirect, but no redirect chain was found.');
    }
    const initialRedirectStatus = chain[0].response()?.status();
    const finalUrl = rootPage.url();
    await rootPage.close();

    if (initialRedirectStatus !== 301) {
      throw new Error(`Expected root redirect status 301, got ${initialRedirectStatus}`);
    }
    if (finalUrl !== `${BASE_URL}/en/`) {
      throw new Error(`Expected final destination URL to be ${BASE_URL}/en/, got ${finalUrl}`);
    }
    console.log('✅ E2E Check: Root route redirects to /en/ with 301 successfully.');

    // E2E Check: Root route preserves query parameters on redirect
    console.log('🔍 E2E Check: Root route preserves query parameters on redirect');
    const queryPage = await browser.newPage();
    const qResponse = await queryPage.goto(`${BASE_URL}/?utm_source=newsletter&utm_medium=email`, { waitUntil: 'domcontentloaded' });
    const qChain = qResponse.request().redirectChain();
    
    if (qChain.length === 0) {
      throw new Error('Expected query param request to redirect, but no chain was found.');
    }
    const qRedirectStatus = qChain[0].response()?.status();
    const qFinalUrl = queryPage.url();
    await queryPage.close();

    if (qRedirectStatus !== 301) {
      throw new Error(`Expected query redirect status 301, got ${qRedirectStatus}`);
    }
    if (qFinalUrl !== `${BASE_URL}/en/?utm_source=newsletter&utm_medium=email`) {
      throw new Error(`Expected preserved query params in URL, got ${qFinalUrl}`);
    }
    console.log('✅ E2E Check: Query parameters preserved successfully.');

    // E2E Check: Loopback safety guard bypass behavior
    console.log('🔍 E2E Check: Loopback safety guard bypass behavior');
    const loopbackPage = await browser.newPage();
    await loopbackPage.setCacheEnabled(false);
    await loopbackPage.setExtraHTTPHeaders({ 'x-worker-loopback': 'true' });
    
    const loopbackResponse = await loopbackPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    const loopbackChain = loopbackResponse.request().redirectChain();
    
    if (loopbackChain.length === 0) {
      throw new Error('Expected loopback request to fallback redirect, but no redirect chain was found.');
    }
    const loopbackRedirectStatus = loopbackChain[0].response()?.status();
    const loopbackFinalUrl = loopbackPage.url();
    await loopbackPage.close();

    if (loopbackRedirectStatus === 301) {
      throw new Error('Expected loopback request NOT to undergo 301 canonical redirection, but got 301.');
    }
    if (![302, 307, 308].includes(loopbackRedirectStatus || 0)) {
      throw new Error(`Expected loopback fallback redirect status 302/307/308, got ${loopbackRedirectStatus}`);
    }
    if (loopbackFinalUrl !== `${BASE_URL}/en/`) {
      throw new Error(`Expected final destination to be /en/, got ${loopbackFinalUrl}`);
    }
    console.log('✅ E2E Check: Loopback safety guard successfully bypassed 301 middleware redirect.');

    // E2E Check: Trailing slash redirect and parameter preservation
    console.log('🔍 E2E Check: Trailing slash redirection and query parameter preservation');
    const slashPage = await browser.newPage();
    const slashResponse = await slashPage.goto(`${BASE_URL}/en/tools/json-formatter`, { waitUntil: 'domcontentloaded' });
    const slashChain = slashResponse.request().redirectChain();
    if (slashChain.length === 0) {
      throw new Error('Expected trailing slash request to redirect, but no redirect chain was found.');
    }
    const slashRedirectStatus = slashChain[0].response()?.status();
    const slashFinalUrl = slashPage.url();
    await slashPage.close();

    if (slashRedirectStatus !== 301) {
      throw new Error(`Expected trailing slash redirect status 301, got ${slashRedirectStatus}`);
    }
    if (slashFinalUrl !== `${BASE_URL}/en/tools/json-formatter/`) {
      throw new Error(`Expected final URL to be trailing-slash normalized /en/tools/json-formatter/, got ${slashFinalUrl}`);
    }

    const slashParamPage = await browser.newPage();
    const slashParamResponse = await slashParamPage.goto(`${BASE_URL}/en/tools/json-formatter?utm_source=twitter`, { waitUntil: 'domcontentloaded' });
    const slashParamChain = slashParamResponse.request().redirectChain();
    if (slashParamChain.length === 0) {
      throw new Error('Expected trailing slash request with params to redirect, but no redirect chain was found.');
    }
    const slashParamRedirectStatus = slashParamChain[0].response()?.status();
    const slashParamFinalUrl = slashParamPage.url();
    await slashParamPage.close();

    if (slashParamRedirectStatus !== 301) {
      throw new Error(`Expected trailing slash redirect status 301 with params, got ${slashParamRedirectStatus}`);
    }
    if (slashParamFinalUrl !== `${BASE_URL}/en/tools/json-formatter/?utm_source=twitter`) {
      throw new Error(`Expected final URL to preserve params on trailing slash redirect, got ${slashParamFinalUrl}`);
    }
    console.log('✅ E2E Check: Trailing slash redirection and query parameter preservation successfully verified.');

    // E2E Check: Decommissioned blog redirects
    console.log('🔍 E2E Check: Decommissioned blog redirects');
    const blogPage = await browser.newPage();
    const blogResponse = await blogPage.goto(`${BASE_URL}/zh/blog/some-obsolete-blog-post`, { waitUntil: 'domcontentloaded' });
    const blogChain = blogResponse.request().redirectChain();
    if (blogChain.length === 0) {
      throw new Error('Expected blog request to redirect, but no redirect chain was found.');
    }
    const blogRedirectStatus = blogChain[0].response()?.status();
    const blogFinalUrl = blogPage.url();
    await blogPage.close();

    if (blogRedirectStatus !== 301) {
      throw new Error(`Expected blog redirect status 301, got ${blogRedirectStatus}`);
    }
    if (blogFinalUrl !== `${BASE_URL}/zh/tools/`) {
      throw new Error(`Expected final URL to redirect to localized tools root, got ${blogFinalUrl}`);
    }
    console.log('✅ E2E Check: Decommissioned blog redirect successfully verified.');

    // E2E Check: Gone (410) routes
    console.log('🔍 E2E Check: Decommissioned routes return 410');
    const gonePage1 = await browser.newPage();
    const response410_1 = await gonePage1.goto(`${BASE_URL}/en/tools/compare/url-parser/dns-lookup`, { waitUntil: 'domcontentloaded' });
    const status410_1 = response410_1?.status();
    const robots410_1 = response410_1?.headers()['x-robots-tag'];
    const cache410_1 = response410_1?.headers()['cache-control'];
    await gonePage1.close();

    if (status410_1 !== 410) {
      throw new Error(`Expected HTTP 410 on decommissioned compare guide, got ${status410_1}`);
    }
    if (robots410_1 !== 'noindex, nofollow') {
      throw new Error(`Expected robots tag 'noindex, nofollow' on 410 page, got '${robots410_1}'`);
    }
    if (cache410_1 !== 'public, max-age=86400, s-maxage=86400') {
      throw new Error(`Expected cache control public, max-age=86400, s-maxage=86400 on 410 page, got '${cache410_1}'`);
    }

    const gonePage2 = await browser.newPage();
    const response410_2 = await gonePage2.goto(`${BASE_URL}/_next/static/chunks/main.js`, { waitUntil: 'domcontentloaded' });
    const status410_2 = response410_2?.status();
    const robots410_2 = response410_2?.headers()['x-robots-tag'];
    const cache410_2 = response410_2?.headers()['cache-control'];
    await gonePage2.close();

    if (status410_2 !== 410) {
      throw new Error(`Expected HTTP 410 on stale asset request, got ${status410_2}`);
    }
    if (robots410_2 !== 'noindex, nofollow') {
      throw new Error(`Expected robots tag 'noindex, nofollow' on 410 stale asset, got '${robots410_2}'`);
    }
    if (cache410_2 !== 'public, max-age=86400, s-maxage=86400') {
      throw new Error(`Expected cache control public, max-age=86400, s-maxage=86400 on 410 stale asset, got '${cache410_2}'`);
    }
    console.log('✅ E2E Check: Decommissioned routes return 410 with correct headers successfully verified.');

    if (hasFatalErrors) {
      throw new Error(`Fatal browser errors were captured during smoke tests:\n${fatalErrors.join('\n')}`);
    }

    console.log('🎉 All Puppeteer client-side E2E smoke tests passed cleanly! No Hydration crashes or Runtime console errors detected!');
  } catch (error) {
    console.error(`❌ E2E Smoke Test FAILED: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
    console.log('🚪 Headless Chromium closed.');

    // Cleanup temporary server if it was spawned by this run
    if (isTempServer && serverProcess) {
      console.log('🛑 Terminating temporary Astro preview server...');
      serverProcess.kill('SIGTERM');
      
      // Wait for process release
      let attempts = 0;
      while (await checkServerActive(PORT) && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }
      
      // Guarantee process kill in Unix systems via lsof double check
      try {
        const { execSync } = await import('node:child_process');
        const pid = execSync(`lsof -t -i :${PORT}`).toString().trim();
        if (pid) {
          console.log(`⚠️ Port ${PORT} still active (PID: ${pid}). Forcing shutdown...`);
          execSync(`kill -9 ${pid}`);
        }
      } catch {
        // Ignore errors (no process found or syntax fail)
      }
      
      console.log('✅ Temporary server stopped successfully.');
    }
  }
}

main().catch((error) => {
  console.error(`E2E Runner failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
