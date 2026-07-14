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
  'src/components/tools/test-fixtures/sql-query-optimizer',
);
const astroBin = path.join(repoRoot, 'node_modules/.bin/astro');

let tempRoot = '';
let outDir = '';
let server: Server | undefined;
let browser: Browser | undefined;
let baseUrl = '';

beforeAll(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'u2tool-sql-optimizer-'));
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
      SQL_OPTIMIZER_FIXTURE_OUT_DIR: outDir,
      SQL_OPTIMIZER_FIXTURE_CACHE_DIR: cacheDir,
      SQL_OPTIMIZER_FIXTURE_REPO_ROOT: repoRoot,
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
    throw new Error('SQL optimizer fixture server did not bind to a TCP port');
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

describe('SqlQueryOptimizer public UI', () => {
  it('analyzes the selected dialect and renders score, formatted SQL, evidence, index candidates, and limitations without a network request [capability:sql-query-optimizer:profile:release-readiness] [capability:sql-query-optimizer:mode:local-static-analysis] [capability:sql-query-optimizer:accepted-input:sql-text] [capability:sql-query-optimizer:accepted-input:sql-dialect] [capability:sql-query-optimizer:produced-output:analysis-score] [capability:sql-query-optimizer:produced-output:formatted-sql] [capability:sql-query-optimizer:produced-output:diagnostic-findings] [capability:sql-query-optimizer:produced-output:index-candidates] [capability:sql-query-optimizer:browser-feature:dialect-selector] [capability:sql-query-optimizer:browser-feature:static-heuristics] [capability:sql-query-optimizer:browser-feature:sql-formatting] [capability:sql-query-optimizer:browser-feature:composite-index-candidates] [capability:sql-query-optimizer:limit:no-database-connection] [capability:sql-query-optimizer:limit:no-query-execution] [capability:sql-query-optimizer:limit:no-automatic-rewrite] [capability:sql-query-optimizer:limit:unverified-indexes] [capability:sql-query-optimizer:limit:no-speed-guarantee]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-sql-dialect]');

      expect(
        await page.$$eval('[data-sql-dialect] option', (options) =>
          options.map((option) => ({
            value: (option as HTMLOptionElement).value,
            text: option.textContent?.trim(),
          })),
        ),
      ).toEqual([
        { value: 'generic', text: 'Generic SQL' },
        { value: 'postgresql', text: 'PostgreSQL' },
        { value: 'mysql', text: 'MySQL' },
        { value: 'sqlite', text: 'SQLite' },
        { value: 'sql-server', text: 'SQL Server' },
      ]);
      expect(await page.$$eval('[data-sql-analysis]', (nodes) => nodes.length)).toBe(0);

      const sql = `SELECT *
FROM orders
WHERE customer_id = 7 AND status = 'open'
ORDER BY created_at DESC
LIMIT 50;`;
      await page.select('[data-sql-dialect]', 'postgresql');
      await page.$eval('[data-sql-input]', (textarea, value) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }, sql);

      let requestsAfterAnalyze = 0;
      page.on('request', () => {
        requestsAfterAnalyze += 1;
      });
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-analysis]');

      expect(requestsAfterAnalyze).toBe(0);
      expect(await page.$eval('[data-sql-input]', (node) => (node as HTMLTextAreaElement).value)).toBe(sql);
      expect(await page.$eval('[data-sql-analyze]', (node) => node.textContent?.trim())).toBe('Analyze locally');
      expect(await page.$eval('[data-sql-score]', (node) => node.textContent?.trim())).toMatch(/^\d+\/100$/);
      expect(await page.$eval('[data-sql-formatted]', (node) => node.textContent)).toContain('\nFROM orders');
      expect(await page.$eval('[data-sql-finding="select-star"] [data-sql-evidence]', (node) => node.textContent)).toContain('SELECT *');
      expect(await page.$eval('[data-sql-index-candidate]', (node) => node.textContent?.trim())).toBe(
        'orders (customer_id, status, created_at)',
      );
      expect(
        await page.$$eval('[data-sql-limitation]', (nodes) =>
          nodes.map((node) => node.textContent?.trim()),
        ),
      ).toEqual(expect.arrayContaining([
        expect.stringMatching(/no database connection or query execution/i),
        expect.stringMatching(/not rewrite SQL|does not rewrite SQL/i),
        expect.stringMatching(/not verified against a schema/i),
        expect.stringMatching(/do not guarantee faster queries/i),
      ]));
    } finally {
      await page.close();
    }
  }, 15_000);

  it('analyzes optional pasted EXPLAIN text for the selected dialect [capability:sql-query-optimizer:mode:pasted-explain-analysis] [capability:sql-query-optimizer:accepted-input:explain-text] [capability:sql-query-optimizer:produced-output:explain-findings] [capability:sql-query-optimizer:browser-feature:explain-token-analysis]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await page.select('[data-sql-dialect]', 'mysql');
      await page.$eval('[data-sql-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'SELECT id FROM orders WHERE status = 1;';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.$eval('[data-sql-explain-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'table: orders\ntype: ALL\nrows: 10000';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-explain-finding="mysql-full-scan"]');

      expect(
        await page.$eval(
          '[data-sql-explain-finding="mysql-full-scan"] [data-sql-evidence]',
          (node) => node.textContent,
        ),
      ).toContain('type: ALL');
      expect(await page.$$eval('[data-sql-ai-assist], [data-sql-server-assist]', (nodes) => nodes.length)).toBe(0);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('copies formatted SQL and the visible findings [capability:sql-query-optimizer:browser-feature:copy-controls]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        const writes: string[] = [];
        (window as unknown as { __sqlCopies: string[] }).__sqlCopies = writes;
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (value: string) => {
              writes.push(value);
            },
          },
        });
      });
      await page.$eval('[data-sql-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'SELECT * FROM users;';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-copy-formatted]');
      await page.click('[data-sql-copy-formatted]');
      await page.click('[data-sql-copy-findings]');

      const copies = await page.evaluate(
        () => (window as unknown as { __sqlCopies: string[] }).__sqlCopies,
      );
      expect(copies).toHaveLength(2);
      expect(copies[0]).toContain('SELECT');
      expect(copies[0]).toContain('FROM users');
      expect(copies[1]).toContain('SELECT * may read columns');
      expect(copies[1]).toContain('Evidence: SELECT * FROM users;');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('clears analyzed findings whenever SQL, dialect, or pasted EXPLAIN changes', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
      await page.select('[data-sql-dialect]', 'postgresql');
      await page.$eval('[data-sql-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'SELECT * FROM users;';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.$eval('[data-sql-explain-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'Seq Scan on users  (cost=0.00..1.00 rows=1 width=4)';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-finding="select-star"]');
      await page.waitForSelector('[data-sql-explain-finding="postgresql-sequential-scan"]');

      await page.$eval('[data-sql-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'SELECT id FROM users LIMIT 1;';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForFunction(
        () => !document.querySelector('[data-sql-analysis]'),
      );
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-analysis]');
      expect(
        await page.$$eval('[data-sql-finding="select-star"]', (nodes) => nodes.length),
      ).toBe(0);

      await page.select('[data-sql-dialect]', 'mysql');
      await page.waitForFunction(
        () => !document.querySelector('[data-sql-analysis]'),
      );
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-analysis]');
      expect(
        await page.$$eval('[data-sql-explain-finding]', (nodes) => nodes.length),
      ).toBe(0);

      await page.$eval('[data-sql-explain-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'type: ALL';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForFunction(
        () => !document.querySelector('[data-sql-analysis]'),
      );
    } finally {
      await page.close();
    }
  }, 15_000);

  it('announces a localized accessible error when clipboard access is rejected or unavailable', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/ru/`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async () => {
              throw new Error('permission denied');
            },
          },
        });
      });
      await page.$eval('[data-sql-input]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'SELECT * FROM users;';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-sql-analyze]');
      await page.waitForSelector('[data-sql-copy-formatted]');
      await page.click('[data-sql-copy-formatted]');
      await page.waitForSelector('[data-sql-copy-error]');
      expect(
        await page.$eval('[data-sql-copy-error]', (node) => ({
          role: node.getAttribute('role'),
          live: node.getAttribute('aria-live'),
          text: node.textContent?.trim(),
        })),
      ).toEqual({
        role: 'alert',
        live: 'assertive',
        text: 'Не удалось скопировать. Проверьте разрешение буфера обмена и попробуйте снова.',
      });

      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: undefined,
        });
      });
      await page.click('[data-sql-copy-findings]');
      expect(
        await page.$eval('[data-sql-copy-error]', (node) => node.textContent?.trim()),
      ).toBe('Не удалось скопировать. Проверьте разрешение буфера обмена и попробуйте снова.');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('discloses English local diagnostics on a non-English page [capability:sql-query-optimizer:limit:english-diagnostics]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(`${baseUrl}/ru/`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-sql-diagnostics-language]');

      expect(
        await page.$eval('[data-sql-optimizer]', (node) => ({
          locale: node.getAttribute('data-locale'),
          notice: node.querySelector('[data-sql-diagnostics-language]')?.textContent?.trim(),
        })),
      ).toEqual({
        locale: 'ru',
        notice: 'Интерфейс локализован, но локальные диагностические объяснения отображаются на английском языке.',
      });
    } finally {
      await page.close();
    }
  }, 15_000);
});

function contentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
    return 'text/javascript; charset=utf-8';
  }
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'application/octet-stream';
}
