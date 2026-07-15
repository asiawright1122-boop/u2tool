import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  symlinkSync,
} from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer, { type Browser } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const fixtureRoot = path.join(
  repoRoot,
  'src/components/tools/test-fixtures/typing-speed-test',
);
const astroBin = path.join(repoRoot, 'node_modules/.bin/astro');

let tempRoot = '';
let outDir = '';
let server: Server | undefined;
let browser: Browser | undefined;
let baseUrl = '';

beforeAll(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'u2tool-typing-speed-test-'));
  outDir = path.join(tempRoot, 'dist');
  const cacheDir = path.join(tempRoot, 'cache');
  mkdirSync(cacheDir, { recursive: true });
  copyFileSync(
    path.join(fixtureRoot, 'astro.config.mjs'),
    path.join(tempRoot, 'astro.config.mjs'),
  );
  symlinkSync(
    path.join(repoRoot, 'node_modules'),
    path.join(tempRoot, 'node_modules'),
    'dir',
  );

  execFileSync(astroBin, ['build'], {
    cwd: tempRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      TYPING_FIXTURE_OUT_DIR: outDir,
      TYPING_FIXTURE_CACHE_DIR: cacheDir,
      TYPING_FIXTURE_REPO_ROOT: repoRoot,
      TYPING_FIXTURE_SRC_DIR: path.join(fixtureRoot, 'src'),
    },
    timeout: 60_000,
  });

  server = createServer((request, response) => {
    const requestPath = decodeURIComponent(
      new URL(request.url ?? '/', 'http://localhost').pathname,
    );
    const requestedFile = requestPath.endsWith('/')
      ? `${requestPath}index.html`
      : requestPath;
    const filePath = path.join(outDir, requestedFile);

    if (!filePath.startsWith(outDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.statusCode = 404;
      response.end('Not found');
      return;
    }
    response.setHeader('content-type', contentType(filePath));
    createReadStream(filePath).pipe(response);
  });
  await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Typing fixture server did not bind to a TCP port');
  }
  baseUrl = `http://127.0.0.1:${address.port}`;

  browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}, 60_000);

afterAll(async () => {
  await browser?.close();
  await new Promise<void>((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((error) => (error ? reject(error) : resolve()));
  });
  if (tempRoot) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

describe('TypingSpeedTest public UI', () => {
  it('runs every selectable timed mode through a local result and history [capability:typing-speed-test:mode:duration-15] [capability:typing-speed-test:mode:duration-30] [capability:typing-speed-test:mode:duration-60] [capability:typing-speed-test:mode:duration-120] [capability:typing-speed-test:accepted-input:prompt-keystrokes] [capability:typing-speed-test:browser-feature:selectable-timed-modes] [capability:typing-speed-test:browser-feature:automatic-finish] [capability:typing-speed-test:browser-feature:character-errors] [capability:typing-speed-test:browser-feature:local-history]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-typing-duration="15"]');
      await page.evaluate(() => window.localStorage.clear());
      await page.reload({ waitUntil: 'networkidle0' });

      expect(
        await page.$eval('[data-typing-input]', (node) =>
          (node as HTMLTextAreaElement).maxLength,
        ),
      ).toBe(3_000);
      expect(
        await page.$eval('[data-typing-input]', (node) => {
          const input = node as HTMLTextAreaElement;
          input.value = `${'😀'.repeat(3_000)}猫`;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          return Array.from(input.value).length;
        }),
      ).toBe(3_000);
      expect(await page.$$eval('[data-typing-prompt] span', (nodes) => nodes.length))
        .toBe(3_000);

      expect(
        await page.$$eval('[data-typing-duration]', (buttons) =>
          buttons.map((button) => button.getAttribute('data-typing-duration')),
        ),
      ).toEqual(['15', '30', '60', '120']);

      for (const [index, selectedDuration] of [15, 30, 60, 120].entries()) {
        await page.$eval(
          `[data-typing-duration="${selectedDuration}"]`,
          (button) => (button as HTMLButtonElement).click(),
        );
        await page.waitForFunction(() => !document.querySelector('[data-typing-result]'));

        const visiblePrompt = await page.$eval(
          '[data-typing-prompt]',
          (node) => node.textContent ?? '',
        );
        const typedValue = index === 0
          ? `X${visiblePrompt.slice(1)}`
          : 'X';
        await page.$eval('[data-typing-input]', (node, value) => {
          const input = node as HTMLTextAreaElement;
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }, typedValue);

        if (index === 0) {
          const extendedPrompt = await page.$eval(
            '[data-typing-prompt]',
            (node) => node.textContent ?? '',
          );
          expect(Array.from(visiblePrompt).length).toBeGreaterThanOrEqual(600);
          expect(extendedPrompt.startsWith(visiblePrompt)).toBe(true);
          expect(Array.from(extendedPrompt).length)
            .toBeGreaterThan(Array.from(visiblePrompt).length);
        }

        await page.evaluate(async (durationSeconds) => {
          const realNow = Date.now;
          const delayedNow = realNow() + (durationSeconds + 30) * 1000;
          Date.now = () => delayedNow;
          await new Promise((resolve) => setTimeout(resolve, 1_100));
          Date.now = realNow;
        }, selectedDuration);
        await page.waitForSelector('[data-typing-result]', { timeout: 5_000 });

        expect(await page.$eval('[data-typing-countdown]', (node) => node.textContent?.trim()))
          .toContain('0');
        expect(
          await page.$eval('[data-typing-elapsed]', (node) =>
            node.textContent?.replace(/\s+/g, ' ').trim(),
          ),
        ).toContain(`${selectedDuration}.0s`);
        expect(await page.$$eval('[data-typing-history-entry]', (nodes) => nodes.length))
          .toBe(index + 1);

        if (index === 0) {
          expect(
            await page.$eval('[data-typing-error]', (node) =>
              node.textContent?.replace(/\s+/g, ' ').trim(),
            ),
          ).toContain('X');
        }
      }

      expect(
        await page.$$eval('[data-typing-metric]', (nodes) =>
          Object.fromEntries(nodes.map((node) => [
            node.getAttribute('data-typing-metric'),
            node.textContent?.replace(/\s+/g, ' ').trim(),
          ])),
        ),
      ).toMatchObject({
        wpm: expect.stringContaining('WPM'),
        cpm: expect.stringContaining('CPM'),
        accuracy: expect.stringContaining('Accuracy'),
        consistency: expect.stringContaining('Consistency'),
      });

      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-typing-history-entry]');
      expect(await page.$$eval('[data-typing-history-entry]', (nodes) => nodes.length)).toBe(4);
    } finally {
      await page.close();
    }
  }, 30_000);

  it('rejects input dispatched after the deadline before the interval callback runs', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-typing-input]');
      await page.evaluate(() => window.localStorage.clear());
      await page.reload({ waitUntil: 'networkidle0' });
      await page.$eval('[data-typing-duration="15"]', (button) =>
        (button as HTMLButtonElement).click(),
      );

      const promptPrefix = await page.$eval(
        '[data-typing-prompt]',
        (node) => Array.from(node.textContent ?? '')[0],
      );
      await page.$eval('[data-typing-input]', (node, value) => {
        const input = node as HTMLTextAreaElement;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, promptPrefix);

      const retainedValue = await page.$eval('[data-typing-input]', (node) => {
        const input = node as HTMLTextAreaElement;
        const realNow = Date.now;
        const afterDeadline = realNow() + 16_000;
        Date.now = () => afterDeadline;
        input.value = `${input.value}LATE`;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const valueAfterLateInput = input.value;
        Date.now = realNow;
        return valueAfterLateInput;
      });

      expect(retainedValue).toBe(promptPrefix);
      await page.waitForSelector('[data-typing-result]');
      expect(
        await page.$eval('[data-typing-input]', (node) =>
          (node as HTMLTextAreaElement).value,
        ),
      ).toBe(promptPrefix);
      expect(
        await page.$eval('[data-typing-result]', (node) =>
          node.textContent?.replace(/\s+/g, ' ').trim(),
        ),
      ).toContain('1');
      expect(
        await page.evaluate(() => {
          const rawHistory = window.localStorage.getItem(
            'u2tool:typing-speed-test:history',
          );
          const [entry] = JSON.parse(rawHistory ?? '[]') as Array<{
            correctChars: number;
            incorrectChars: number;
          }>;
          return entry && {
            correctChars: entry.correctChars,
            incorrectChars: entry.incorrectChars,
          };
        }),
      ).toEqual({ correctChars: 1, incorrectChars: 0 });
    } finally {
      await page.close();
    }
  }, 15_000);

  it('clears the active interval on restart and Svelte destruction [capability:typing-speed-test:browser-feature:timer-lifecycle]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await installBrowserInstrumentation(page);
      await page.type('[data-typing-input]', 'X');
      const beforeRestart = await clearIntervalCount(page);
      await page.$eval('[data-typing-restart]', (button) =>
        (button as HTMLButtonElement).click(),
      );
      expect(await clearIntervalCount(page)).toBeGreaterThan(beforeRestart);

      await page.type('[data-typing-input]', 'Y');
      const beforeDestroy = await clearIntervalCount(page);
      await page.$eval('[data-typing-fixture-toggle]', (button) =>
        (button as HTMLButtonElement).click(),
      );
      expect(await clearIntervalCount(page)).toBeGreaterThan(beforeDestroy);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('completes locally without network navigation download account ranking certificate or cloud-history side effects [capability:typing-speed-test:limit:no-account] [capability:typing-speed-test:limit:no-ranking] [capability:typing-speed-test:limit:no-certificate] [capability:typing-speed-test:limit:no-cloud-history]', async () => {
    const page = await browser!.newPage();
    const client = await page.createCDPSession();
    const postLoadRequests: Array<{ type: string; url: string }> = [];
    const webSocketUrls: string[] = [];
    const navigationUrls: string[] = [];
    const downloadUrls: string[] = [];
    const storageWrites: Array<{ area: 'local' | 'session'; key: string }> = [];
    let observeSideEffects = false;
    let allowedFixtureDocumentRequests = 0;
    let allowedFixtureNavigations = 0;
    const testedFlowUrl = `${baseUrl}/en/`;

    client.on('Network.requestWillBeSent', ({ request, type }) => {
      if (!observeSideEffects) return;
      const requestType = type ?? 'Other';
      if (
        requestType === 'Document'
        && allowedFixtureDocumentRequests > 0
        && request.url === testedFlowUrl
      ) {
        allowedFixtureDocumentRequests -= 1;
        return;
      }
      if (['Document', 'Fetch', 'XHR', 'Ping'].includes(requestType)) {
        postLoadRequests.push({ type: requestType, url: request.url });
      }
    });
    client.on('Network.webSocketCreated', ({ url }) => {
      if (observeSideEffects) webSocketUrls.push(url);
    });
    client.on('Page.downloadWillBegin', ({ url }) => {
      if (observeSideEffects) downloadUrls.push(url);
    });
    client.on('Page.navigatedWithinDocument', ({ url }) => {
      if (observeSideEffects) navigationUrls.push(url);
    });
    client.on('DOMStorage.domStorageItemAdded', ({ storageId, key }) => {
      if (observeSideEffects) {
        storageWrites.push({
          area: storageId.isLocalStorage ? 'local' : 'session',
          key,
        });
      }
    });
    client.on('DOMStorage.domStorageItemUpdated', ({ storageId, key }) => {
      if (observeSideEffects) {
        storageWrites.push({
          area: storageId.isLocalStorage ? 'local' : 'session',
          key,
        });
      }
    });
    page.on('framenavigated', (frame) => {
      if (!observeSideEffects || frame !== page.mainFrame()) return;
      if (
        allowedFixtureNavigations > 0
        && frame.url() === testedFlowUrl
      ) {
        allowedFixtureNavigations -= 1;
        return;
      }
      navigationUrls.push(frame.url());
    });

    try {
      await client.send('Network.enable');
      await client.send('Page.enable');
      await client.send('DOMStorage.enable');
      await page.goto(testedFlowUrl, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-typing-input]');
      await page.waitForFunction(() =>
        document.querySelectorAll('[data-typing-prompt] span').length > 0,
      );
      await page.evaluate(() => window.localStorage.clear());
      const loadedUrl = page.url();
      allowedFixtureDocumentRequests = 1;
      allowedFixtureNavigations = 1;
      observeSideEffects = true;
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForFunction(() =>
        document.querySelectorAll('[data-typing-prompt] span').length > 0,
      );
      expect(allowedFixtureDocumentRequests).toBe(0);
      expect(allowedFixtureNavigations).toBe(0);
      await page.$eval('[data-typing-duration="15"]', (button) =>
        (button as HTMLButtonElement).click(),
      );

      const promptPrefix = await page.$eval(
        '[data-typing-prompt]',
        (node) => Array.from(node.textContent ?? '')[0],
      );
      await page.$eval('[data-typing-input]', (node, value) => {
        const input = node as HTMLTextAreaElement;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, promptPrefix);
      await page.$eval('[data-typing-input]', (node) => {
        const input = node as HTMLTextAreaElement;
        const realNow = Date.now;
        const afterDeadline = realNow() + 16_000;
        Date.now = () => afterDeadline;
        input.value = `${input.value}LATE`;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        Date.now = realNow;
      });
      await page.waitForSelector('[data-typing-result]');
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(postLoadRequests).toEqual([]);
      expect(webSocketUrls).toEqual([]);
      expect(navigationUrls).toEqual([]);
      expect(page.url()).toBe(loadedUrl);
      expect(downloadUrls).toEqual([]);
      expect(
        await page.evaluate(() => {
          const interactiveText = Array.from(
            document.querySelectorAll('a, button, input, select, textarea'),
          ).map((node) => (
            node.getAttribute('aria-label')
            ?? node.textContent
            ?? (node as HTMLInputElement).value
            ?? ''
          )).join(' ');
          const visibleText = document.body.innerText;
          return {
            accountUi: document.querySelectorAll([
              'input[type="email"]',
              'input[type="password"]',
              '[autocomplete="username"]',
              '[autocomplete="current-password"]',
              'form[action*="login" i]',
              'form[action*="account" i]',
              'form[action*="auth" i]',
            ].join(',')).length
              + Number(/\b(?:sign in|log in|sign up|register|create account|user profile)\b/i.test(interactiveText)),
            rankingUi: Number(/\b(?:leaderboard|global rank(?:ing)?|ranked results?)\b/i.test(visibleText)),
            certificateUi: Number(/\b(?:typing |completion )?certificates?\b/i.test(visibleText)),
            downloadUi: document.querySelectorAll([
              'a[download]',
              'a[href^="blob:"]',
              'a[href^="data:"]',
            ].join(',')).length
              + Number(/\b(?:download|export)\b/i.test(interactiveText)),
            storageKeys: Object.keys(window.localStorage).sort(),
            sessionStorageKeys: Object.keys(window.sessionStorage).sort(),
          };
        }),
      ).toEqual({
        accountUi: 0,
        rankingUi: 0,
        certificateUi: 0,
        downloadUi: 0,
        storageKeys: ['u2tool:typing-speed-test:history'],
        sessionStorageKeys: [],
      });
      expect(storageWrites).toEqual([{
        area: 'local',
        key: 'u2tool:typing-speed-test:history',
      }]);
    } finally {
      observeSideEffects = false;
      await client.detach();
      await page.close();
    }
  }, 15_000);
});

async function installBrowserInstrumentation(page: import('puppeteer').Page): Promise<void> {
  await page.evaluate(() => {
    const nativeClearInterval = window.clearInterval.bind(window);
    Object.defineProperty(window, '__typingClearIntervalCount', { value: 0, writable: true });
    window.clearInterval = ((id?: number) => {
      (window as typeof window & { __typingClearIntervalCount: number }).__typingClearIntervalCount += 1;
      nativeClearInterval(id);
    }) as typeof window.clearInterval;
  });
}

async function clearIntervalCount(page: import('puppeteer').Page): Promise<number> {
  return page.evaluate(() =>
    (window as typeof window & { __typingClearIntervalCount: number }).__typingClearIntervalCount,
  );
}

function contentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'application/octet-stream';
}
