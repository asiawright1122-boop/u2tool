import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
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
  'src/components/tools/test-fixtures/grammar-checker',
);
const astroBin = path.join(repoRoot, 'node_modules/.bin/astro');

let tempRoot = '';
let outDir = '';
let server: Server | undefined;
let browser: Browser | undefined;
let baseUrl = '';

beforeAll(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'u2tool-grammar-checker-'));
  outDir = path.join(tempRoot, 'dist');
  const cacheDir = path.join(tempRoot, 'cache');
  const projectRoot = path.join(tempRoot, 'project');
  mkdirSync(projectRoot, { recursive: true });
  copyFileSync(
    path.join(fixtureRoot, 'astro.config.mjs'),
    path.join(projectRoot, 'astro.config.mjs'),
  );
  cpSync(path.join(fixtureRoot, 'src'), path.join(projectRoot, 'src'), {
    recursive: true,
  });
  symlinkSync(
    path.join(repoRoot, 'node_modules'),
    path.join(projectRoot, 'node_modules'),
    'dir',
  );

  execFileSync(astroBin, ['build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      GRAMMAR_FIXTURE_OUT_DIR: outDir,
      GRAMMAR_FIXTURE_CACHE_DIR: cacheDir,
      GRAMMAR_FIXTURE_REPO_ROOT: repoRoot,
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
    throw new Error('Grammar fixture server did not bind to a TCP port');
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

describe('GrammarChecker public UI', () => {
  it('renders one persistent English-input notice associated with the plain-text field [capability:grammar-checker:mode:local-english-rules] [capability:grammar-checker:accepted-input:plain-text] [capability:grammar-checker:profile:release-readiness]', async () => {
    const page = await browser!.newPage();
    await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('textarea');

    expect(
      await page.$$eval('[data-grammar-language-notice]', (elements) =>
        elements.map((element) => ({
          id: element.id,
          inputLanguage: element.getAttribute('data-input-language'),
          text: element.textContent?.trim(),
        })),
      ),
    ).toEqual([
      {
        id: 'grammar-checker-language-notice',
        inputLanguage: 'en',
        text: 'This local checker is designed for English text.',
      },
    ]);
    expect(
      await page.$eval('textarea', (textarea) => ({
        describedBy: textarea.getAttribute('aria-describedby'),
        lang: textarea.getAttribute('lang'),
      })),
    ).toEqual({
      describedBy: 'grammar-checker-language-notice',
      lang: 'en',
    });

    await page.type('textarea', 'The editor reviews the draft carefully.');
    expect(await page.$$eval('[data-grammar-language-notice]', (elements) => elements.length)).toBe(1);

    await page.close();
  });

  it('renders exact highlighted issue ranges from the visible English preview [capability:grammar-checker:produced-output:highlighted-issues] [capability:grammar-checker:browser-feature:english-local-rules] [capability:grammar-checker:browser-feature:issue-highlights]', async () => {
    const page = await browser!.newPage();
    await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('textarea');
    await page.type('textarea', 'Teh editor reviews reviews the draft.');

    await page.waitForFunction(
      () => document.querySelectorAll('[data-grammar-preview] mark').length === 2,
    );
    expect(
      await page.$eval('[data-grammar-preview]', (preview) => {
        let offset = 0;
        const ranges: Array<{ start: number; end: number; text: string }> = [];
        for (const node of preview.childNodes) {
          const text = node.textContent ?? '';
          if (node instanceof HTMLElement && node.tagName === 'MARK') {
            ranges.push({ start: offset, end: offset + text.length, text });
          }
          offset += text.length;
        }
        return ranges;
      }),
    ).toEqual([
      { start: 0, end: 3, text: 'Teh' },
      { start: 11, end: 26, text: 'reviews reviews' },
    ]);
    expect(await page.$$eval('[data-grammar-language-notice]', (elements) => elements.length)).toBe(1);

    await page.close();
  });

  it('applies an individual visible fix while preserving the remaining issue and notice [capability:grammar-checker:browser-feature:individual-fixes]', async () => {
    const page = await browser!.newPage();
    await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('textarea');
    await page.type('textarea', 'Teh editor reviews reviews the draft.');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-grammar-preview] mark').length === 2,
    );

    await page.$eval('[data-grammar-fix]', (button) =>
      (button as HTMLButtonElement).click(),
    );

    expect(await page.$eval('textarea', (textarea) => textarea.value)).toBe(
      'the editor reviews reviews the draft.',
    );
    expect(
      await page.$$eval('[data-grammar-preview] mark', (marks) =>
        marks.map((mark) => mark.textContent),
      ),
    ).toEqual(['reviews reviews']);
    expect(await page.$$eval('[data-grammar-language-notice]', (elements) => elements.length)).toBe(1);

    await page.close();
  });

  it('applies all visible fixes without position drift and keeps the notice [capability:grammar-checker:produced-output:corrected-text] [capability:grammar-checker:browser-feature:all-fixes]', async () => {
    const page = await browser!.newPage();
    await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('textarea');
    await page.type('textarea', 'Teh editor reviews reviews the draft.');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-grammar-preview] mark').length === 2,
    );

    await page.$eval('[data-grammar-fix-all]', (button) =>
      (button as HTMLButtonElement).click(),
    );

    expect(await page.$eval('textarea', (textarea) => textarea.value)).toBe(
      'the editor reviews the draft.',
    );
    expect(await page.$$eval('[data-grammar-preview] mark', (marks) => marks.length)).toBe(0);
    expect(await page.$$eval('[data-grammar-language-notice]', (elements) => elements.length)).toBe(1);

    await page.close();
  });

  it('presents Cyrillic input as zero supported English-rule matches without a native-language success claim [capability:grammar-checker:limit:english-only-engine]', async () => {
    const page = await browser!.newPage();
    await page.goto(`${baseUrl}/ru/`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('textarea');

    expect(
      await page.$eval('[data-grammar-language-notice]', (notice) => ({
        inputLanguage: notice.getAttribute('data-input-language'),
        text: notice.textContent?.trim(),
      })),
    ).toEqual({
      inputLanguage: 'en',
      text: 'Интерфейс локализован на русский язык, но инструмент проверяет английский текст.',
    });
    await page.type('textarea', 'Она пишет короткий русский текст.');
    await page.waitForSelector('[data-grammar-match-status]');

    expect(
      await page.$eval('[data-grammar-match-status]', (status) =>
        status.textContent?.trim(),
      ),
    ).toBe('Совпадений с поддерживаемыми правилами английского языка не найдено.');
    expect(await page.$$eval('[data-grammar-preview] mark', (marks) => marks.length)).toBe(0);
    expect(
      await page.$eval('[data-grammar-preview]', (preview) => preview.textContent),
    ).toBe('Она пишет короткий русский текст.');
    expect(await page.$$eval('[data-grammar-language-notice]', (elements) => elements.length)).toBe(1);

    await page.close();
  });

  it('leaves the tracked fixture free of generated build artifacts', () => {
    expect(
      ['.astro', 'dist', '.vite', 'node_modules'].filter((entry) =>
        existsSync(path.join(fixtureRoot, entry)),
      ),
    ).toEqual([]);
  });
});

function contentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
    return 'text/javascript; charset=utf-8';
  }
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}
