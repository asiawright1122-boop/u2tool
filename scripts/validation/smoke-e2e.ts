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
