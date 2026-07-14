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
  writeFileSync,
} from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer, { type Browser, type ElementHandle } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const fixtureRoot = path.join(
  repoRoot,
  'src/components/tools/test-fixtures/hex-editor',
);
const astroBin = path.join(repoRoot, 'node_modules/.bin/astro');

let tempRoot = '';
let outDir = '';
let server: Server | undefined;
let browser: Browser | undefined;
let baseUrl = '';

beforeAll(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'u2tool-hex-editor-'));
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
      HEX_EDITOR_FIXTURE_OUT_DIR: outDir,
      HEX_EDITOR_FIXTURE_CACHE_DIR: cacheDir,
      HEX_EDITOR_FIXTURE_REPO_ROOT: repoRoot,
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
    throw new Error('Hex Editor fixture server did not bind to a TCP port');
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

describe('HexEditor public UI', () => {
  it('links tabs to panels and supports arrow-key tab navigation', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });

      expect(
        await page.$$eval('[data-hex-mode-tab]', (tabs) => tabs.map((tab) => ({
          id: tab.id,
          controls: tab.getAttribute('aria-controls'),
          selected: tab.getAttribute('aria-selected'),
          tabIndex: (tab as HTMLButtonElement).tabIndex,
        }))),
      ).toEqual([
        {
          id: 'hex-file-editor-tab',
          controls: 'hex-file-editor-panel',
          selected: 'true',
          tabIndex: 0,
        },
        {
          id: 'hex-text-converter-tab',
          controls: 'hex-text-converter-panel',
          selected: 'false',
          tabIndex: -1,
        },
      ]);
      expect(
        await page.$eval('[data-hex-file-editor]', (panel) => ({
          id: panel.id,
          labelledBy: panel.getAttribute('aria-labelledby'),
        })),
      ).toEqual({
        id: 'hex-file-editor-panel',
        labelledBy: 'hex-file-editor-tab',
      });

      await page.focus('[data-hex-mode-tab="file-editor"]');
      await page.keyboard.press('ArrowRight');
      await page.waitForSelector('[data-hex-text-converter]');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('hex-text-converter-tab');
      expect(
        await page.$eval('[data-hex-text-converter]', (panel) => ({
          id: panel.id,
          labelledBy: panel.getAttribute('aria-labelledby'),
        })),
      ).toEqual({
        id: 'hex-text-converter-panel',
        labelledBy: 'hex-text-converter-tab',
      });

      await page.keyboard.press('ArrowLeft');
      await page.waitForSelector('[data-hex-file-editor]');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('hex-file-editor-tab');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('opens a local binary file into zero-padded 16-byte rows without a network request [capability:hex-editor:mode:file-editor] [capability:hex-editor:accepted-input:local-binary-file] [capability:hex-editor:browser-feature:editable-byte-grid] [capability:hex-editor:limit:local-files-only]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-hex-file-input]');

      expect(
        await page.$$eval('[data-hex-mode-tab]', (tabs) =>
          tabs.map((tab) => tab.textContent?.trim()),
        ),
      ).toEqual(['File Editor', 'Text Converter']);

      const filePath = path.join(tempRoot, 'sample.bin');
      writeFileSync(filePath, Uint8Array.from([
        0x41, 0x00, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47,
        0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f,
        0x50,
      ]));
      let requestsAfterSelection = 0;
      page.on('request', () => {
        requestsAfterSelection += 1;
      });

      const input = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await input!.uploadFile(filePath);
      await page.waitForSelector('[data-hex-row="1"]');

      expect(requestsAfterSelection).toBe(0);
      expect(
        await page.$$eval('[data-hex-offset]', (offsets) =>
          offsets.map((offset) => offset.textContent?.trim()),
        ),
      ).toEqual(['00000000', '00000010']);
      expect(await page.$$eval('[data-hex-row="0"] [data-hex-byte]', (cells) => cells.length)).toBe(16);
      expect(await page.$$eval('[data-hex-row="1"] [data-hex-byte]', (cells) => cells.length)).toBe(1);
      expect(
        await page.$eval('[data-hex-row="0"] [data-hex-ascii]', (preview) =>
          preview.textContent,
        ),
      ).toBe('A.BCDEFGHIJKLMNO');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('keeps non-printable ASCII placeholders read-only and changes only the intended hex byte [capability:hex-editor:browser-feature:byte-editing]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'non-printable.bin');
      writeFileSync(filePath, Uint8Array.from([0x00, 0x1f, 0x7f]));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-byte-offset="2"]');

      expect(
        await page.$eval('[data-hex-ascii]', (preview) => ({
          tagName: preview.tagName,
          text: preview.textContent,
          editable: preview.matches('input, textarea, [contenteditable="true"]'),
        })),
      ).toEqual({ tagName: 'CODE', text: '...', editable: false });

      await page.$eval('[data-byte-offset="1"]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '20';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(await page.$eval('[data-hex-ascii]', (preview) => preview.textContent)).toBe('. .');

      await page.evaluate(() => {
        const capture = { blob: null as Blob | null };
        (window as unknown as { __hexDownload: typeof capture }).__hexDownload = capture;
        URL.createObjectURL = (blob: Blob) => {
          capture.blob = blob;
          return 'blob:hex-editor-test';
        };
        URL.revokeObjectURL = () => {};
        HTMLAnchorElement.prototype.click = () => {};
      });
      await page.click('[data-hex-download]');

      expect(
        await page.evaluate(async () => {
          const capture = (window as unknown as {
            __hexDownload: { blob: Blob };
          }).__hexDownload;
          return Array.from(new Uint8Array(await capture.blob.arrayBuffer()));
        }),
      ).toEqual([0x00, 0x20, 0x7f]);
      expect(await page.$eval('[data-hex-modified-count]', (node) => node.textContent?.trim())).toBe('1 modified bytes');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('marks an invalid byte cell and exposes a localized error until the value is corrected', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'invalid-byte.bin');
      writeFileSync(filePath, Uint8Array.from([0x41]));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-byte-offset="0"]');

      await page.$eval('[data-byte-offset="0"]', (input) => {
        const field = input as HTMLInputElement;
        field.value = 'G1';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });

      expect(
        await page.$eval('[data-byte-offset="0"]', (input) => ({
          value: (input as HTMLInputElement).value,
          invalid: input.getAttribute('aria-invalid'),
          describedBy: input.getAttribute('aria-describedby'),
        })),
      ).toEqual({
        value: 'G1',
        invalid: 'true',
        describedBy: 'hex-byte-error-0',
      });
      expect(await page.$eval('[data-hex-byte-error]', (node) => node.textContent?.trim())).toBe(
        'Enter exactly two hexadecimal digits.',
      );

      await page.$eval('[data-byte-offset="0"]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '42';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(await page.$eval('[data-byte-offset="0"]', (input) => input.getAttribute('aria-invalid'))).toBe('false');
      expect(await page.$$eval('[data-hex-byte-error]', (nodes) => nodes.length)).toBe(0);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('navigates hex and ASCII matches and resets hex byte changes [capability:hex-editor:browser-feature:hex-ascii-search] [capability:hex-editor:browser-feature:reset-changes]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'overlap.bin');
      writeFileSync(filePath, Uint8Array.from([0x41, 0x42, 0x41, 0x42, 0x41]));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-byte-offset="4"]');

      await page.$eval('[data-byte-offset="0"]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '43';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(
        await page.$eval('[data-hex-ascii]', (preview) => preview.textContent),
      ).toBe('CBABA');

      await page.$eval('[data-byte-offset="2"]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '58';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(
        await page.$$eval('[data-hex-byte]', (inputs) =>
          inputs.map((input) => (input as HTMLInputElement).value),
        ),
      ).toEqual(['43', '42', '58', '42', '41']);
      expect(await page.$eval('[data-hex-modified-count]', (node) => node.textContent?.trim())).toBe('2 modified bytes');

      await page.$eval('[data-hex-search]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '42';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      expect(await page.$eval('[data-hex-search-status]', (node) => node.textContent?.trim())).toBe('Search ready');
      await page.click('[data-search-next]');
      expect(await activeMatchOffsets(page)).toEqual(['1']);
      await page.click('[data-search-next]');
      expect(await activeMatchOffsets(page)).toEqual(['3']);
      await page.click('[data-search-previous]');
      expect(await activeMatchOffsets(page)).toEqual(['1']);

      await page.$eval('[data-ascii-search]', (input) => {
        const field = input as HTMLInputElement;
        field.value = 'BX';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-search-next]');
      expect(await activeMatchOffsets(page)).toEqual(['1', '2']);

      await page.click('[data-hex-reset]');
      expect(
        await page.$$eval('[data-hex-byte]', (inputs) =>
          inputs.map((input) => (input as HTMLInputElement).value),
        ),
      ).toEqual(['41', '42', '41', '42', '41']);
      expect(await page.$eval('[data-hex-modified-count]', (node) => node.textContent?.trim())).toBe('0 modified bytes');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('keeps one-byte search input responsive and navigates one match at a time in a 2 MiB high-match file', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'high-match.bin');
      writeFileSync(filePath, new Uint8Array(2 * 1024 * 1024).fill(0x41));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-byte-offset="0"]');

      const inputElapsedMs = await page.$eval('[data-hex-search]', (input) => {
        const field = input as HTMLInputElement;
        const startedAt = performance.now();
        field.value = '41';
        field.dispatchEvent(new Event('input', { bubbles: true }));
        return performance.now() - startedAt;
      });

      expect(inputElapsedMs).toBeLessThan(250);
      expect(await page.$eval('[data-hex-search-status]', (node) => node.textContent?.trim())).toBe('Search ready');
      await page.click('[data-search-next]');
      expect(await activeMatchOffsets(page)).toEqual(['0']);
      expect(await page.$eval('[data-hex-search-status]', (node) => node.textContent?.trim())).toBe(
        'Match at offset 00000000',
      );
      await page.click('[data-search-next]');
      expect(await activeMatchOffsets(page)).toEqual(['1']);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('rejects non-ASCII search text and announces search state changes', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'ascii-search.bin');
      writeFileSync(filePath, Uint8Array.from([0xc3, 0xa9, 0x41]));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-byte-offset="2"]');

      await page.$eval('[data-ascii-search]', (input) => {
        const field = input as HTMLInputElement;
        field.value = 'é';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      expect(
        await page.$eval('[data-hex-search-status]', (node) => ({
          text: node.textContent?.trim(),
          live: node.getAttribute('aria-live'),
        })),
      ).toEqual({
        text: 'ASCII search accepts only ASCII characters.',
        live: 'polite',
      });
      expect(await page.$eval('[data-search-next]', (button) => (button as HTMLButtonElement).disabled)).toBe(true);

      await page.$eval('[data-ascii-search]', (input) => {
        const field = input as HTMLInputElement;
        field.value = 'A';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-search-next]');
      expect(await activeMatchOffsets(page)).toEqual(['2']);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('downloads the edited bytes with .modified before the original extension [capability:hex-editor:produced-output:modified-binary-file] [capability:hex-editor:browser-feature:download]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'firmware.bin');
      writeFileSync(filePath, Uint8Array.from([0x01, 0x02, 0x03]));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-byte-offset="2"]');
      await page.$eval('[data-byte-offset="1"]', (input) => {
        const field = input as HTMLInputElement;
        field.value = 'FF';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });

      await page.evaluate(() => {
        const capture = {
          blob: null as Blob | null,
          download: '',
          href: '',
        };
        (window as unknown as { __hexDownload: typeof capture }).__hexDownload = capture;
        URL.createObjectURL = (blob: Blob) => {
          capture.blob = blob;
          return 'blob:hex-editor-test';
        };
        URL.revokeObjectURL = () => {};
        HTMLAnchorElement.prototype.click = function click() {
          capture.download = this.download;
          capture.href = this.href;
        };
      });

      await page.click('[data-hex-download]');
      expect(
        await page.evaluate(async () => {
          const capture = (window as unknown as {
            __hexDownload: { blob: Blob; download: string; href: string };
          }).__hexDownload;
          return {
            bytes: Array.from(new Uint8Array(await capture.blob.arrayBuffer())),
            download: capture.download,
            href: capture.href,
          };
        }),
      ).toEqual({
        bytes: [0x01, 0xff, 0x03],
        download: 'firmware.modified.bin',
        href: 'blob:hex-editor-test',
      });
    } finally {
      await page.close();
    }
  }, 15_000);

  it('accepts exactly 2 MiB and rejects 2 MiB plus one byte with the visible pilot-limit message [capability:hex-editor:limit:two-mib-files]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const exactLimitPath = path.join(tempRoot, 'exact-limit.bin');
      writeFileSync(exactLimitPath, new Uint8Array(2 * 1024 * 1024));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(exactLimitPath);
      await page.waitForSelector('[data-byte-offset="255"]');
      expect(await page.$eval('[data-hex-filename]', (node) => node.textContent?.trim())).toBe(
        'exact-limit.bin',
      );
      expect(await page.$$eval('[data-hex-row]', (rows) => rows.length)).toBe(16);
      expect(await page.$$eval('[data-hex-file-error]', (errors) => errors.length)).toBe(0);

      const tooLargePath = path.join(tempRoot, 'too-large.bin');
      writeFileSync(tooLargePath, new Uint8Array((2 * 1024 * 1024) + 1));
      await fileInput!.uploadFile(tooLargePath);
      await page.waitForSelector('[data-hex-file-error]');

      expect(await page.$eval('[data-hex-file-error]', (node) => node.textContent?.trim())).toBe(
        'This file is larger than the 2 MiB browser limit.',
      );
      expect(await page.$$eval('[data-hex-row]', (rows) => rows.length)).toBe(0);
      expect(await page.$$eval('[data-hex-filename]', (names) => names.length)).toBe(0);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('converts visible text and hexadecimal fields as UTF-8 and reports incomplete bytes [capability:hex-editor:mode:text-converter] [capability:hex-editor:accepted-input:text] [capability:hex-editor:accepted-input:utf8-hex] [capability:hex-editor:produced-output:utf8-hex] [capability:hex-editor:produced-output:decoded-text] [capability:hex-editor:browser-feature:text-conversion] [capability:hex-editor:limit:utf8-text-converter]', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await page.click('[data-hex-mode-tab="text-converter"]');
      await page.waitForSelector('[data-hex-text-converter]');

      await page.$eval('[data-hex-text]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = 'Hello 猫';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-text-to-hex]');
      expect(
        await page.$eval('[data-hex-text-output]', (textarea) =>
          (textarea as HTMLTextAreaElement).value,
        ),
      ).toBe('48 65 6C 6C 6F 20 E7 8C AB');

      await page.$eval('[data-hex-text-output]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = '43 61 66 C3 A9';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-hex-to-text]');
      expect(
        await page.$eval('[data-hex-text]', (textarea) =>
          (textarea as HTMLTextAreaElement).value,
        ),
      ).toBe('Café');

      await page.$eval('[data-hex-text-output]', (textarea) => {
        const field = textarea as HTMLTextAreaElement;
        field.value = '4';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.click('[data-hex-to-text]');
      expect(await page.$eval('[data-hex-conversion-error]', (node) => node.textContent?.trim())).toBe(
        'Enter complete hexadecimal byte pairs.',
      );

      for (const malformedUtf8 of ['FF', 'C3', 'E2 82']) {
        await page.$eval('[data-hex-text-output]', (textarea, value) => {
          const field = textarea as HTMLTextAreaElement;
          field.value = value;
          field.dispatchEvent(new Event('input', { bubbles: true }));
        }, malformedUtf8);
        await page.click('[data-hex-to-text]');
        expect(await page.$eval('[data-hex-conversion-error]', (node) => node.textContent?.trim())).toBe(
          'The hexadecimal bytes are not valid UTF-8.',
        );
      }
    } finally {
      await page.close();
    }
  }, 15_000);

  it('pages the byte grid while keeping absolute offsets for files larger than one view', async () => {
    const page = await browser!.newPage();
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      const filePath = path.join(tempRoot, 'paged.bin');
      writeFileSync(filePath, new Uint8Array(257));
      const fileInput = await page.$('[data-hex-file-input]') as ElementHandle<HTMLInputElement> | null;
      await fileInput!.uploadFile(filePath);
      await page.waitForSelector('[data-hex-row="15"]');

      expect(await page.$$eval('[data-hex-row]', (rows) => rows.length)).toBe(16);
      expect(await page.$eval('[data-hex-page-status]', (node) => node.textContent?.trim())).toBe(
        'Bytes 1–256 of 257',
      );
      await page.click('[data-hex-next-page]');
      expect(await page.$$eval('[data-hex-row]', (rows) => rows.length)).toBe(1);
      expect(await page.$eval('[data-hex-offset]', (node) => node.textContent?.trim())).toBe('00000100');
    } finally {
      await page.close();
    }
  }, 15_000);
});

async function activeMatchOffsets(page: import('puppeteer').Page): Promise<string[]> {
  return page.$$eval('[data-hex-byte][data-active-match="true"]', (inputs) =>
    inputs.map((input) => input.getAttribute('data-byte-offset') ?? ''),
  );
}

function contentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
    return 'text/javascript; charset=utf-8';
  }
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'application/octet-stream';
}
