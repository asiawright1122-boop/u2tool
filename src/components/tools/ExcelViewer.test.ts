import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import JSZip from 'jszip';
import puppeteer, { type Browser, type ElementHandle, type Page } from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';

import {
  createExcelWorkbookFixture,
  createExcelWorkbookMetadataFixture,
  createExcelWorkbookSpanFixture,
} from '../../lib/excel-data-viewer.fixture';
import { EXCEL_MAX_ROWS_PER_SHEET } from '../../lib/excel-data-viewer';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const fixtureRoot = path.join(
  repoRoot,
  'src/components/tools/test-fixtures/excel-viewer',
);
const astroBin = path.join(repoRoot, 'node_modules/.bin/astro');
const tenMiB = 10 * 1024 * 1024;

let tempRoot = '';
let outDir = '';
let server: Server | undefined;
let browser: Browser | undefined;
let baseUrl = '';
let workbookPath = '';
let legacyWorkbookPath = '';
let metadataWorkbookPath = '';
let exactLimitWorkbookPath = '';
let oversizedWorkbookPath = '';
let invalidWorkbookPath = '';
let largeWorkbookPath = '';
let limitWorkbookPath = '';

beforeAll(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'u2tool-excel-viewer-'));
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

  workbookPath = path.join(tempRoot, 'people.xlsx');
  writeFileSync(workbookPath, createExcelWorkbookFixture());

  const legacyWorkbook = XLSX.read(createExcelWorkbookFixture(), {
    type: 'array',
    cellFormula: true,
    cellDates: true,
  });
  legacyWorkbookPath = path.join(tempRoot, 'people.xls');
  writeFileSync(
    legacyWorkbookPath,
    XLSX.write(legacyWorkbook, { type: 'buffer', bookType: 'xls' }),
  );

  metadataWorkbookPath = path.join(tempRoot, 'metadata.xlsm');
  writeFileSync(metadataWorkbookPath, await createExcelWorkbookMetadataFixture());

  exactLimitWorkbookPath = path.join(tempRoot, 'exact-10-mib.xlsx');
  writeFileSync(
    exactLimitWorkbookPath,
    await padWorkbookZip(createExcelWorkbookFixture(), tenMiB),
  );
  oversizedWorkbookPath = path.join(tempRoot, 'too-large.xlsx');
  writeFileSync(
    oversizedWorkbookPath,
    await padWorkbookZip(createExcelWorkbookFixture(), tenMiB + 1),
  );
  invalidWorkbookPath = path.join(tempRoot, 'broken.xlsx');
  writeFileSync(invalidWorkbookPath, new TextEncoder().encode('not a workbook'));

  const largeWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(largeWorkbook, XLSX.utils.aoa_to_sheet([
    ['Index', 'Label'],
    ...Array.from({ length: 205 }, (_, index) => [index + 1, `Row ${index + 1}`]),
  ]), 'Large');
  XLSX.utils.book_append_sheet(largeWorkbook, XLSX.utils.aoa_to_sheet([
    ['Status'],
    ['Ready'],
  ]), 'Other');
  largeWorkbookPath = path.join(tempRoot, 'large.xlsx');
  writeFileSync(
    largeWorkbookPath,
    XLSX.write(largeWorkbook, { type: 'buffer', bookType: 'xlsx' }),
  );

  limitWorkbookPath = path.join(tempRoot, 'row-limit.xlsx');
  writeFileSync(
    limitWorkbookPath,
    createExcelWorkbookSpanFixture({ r: EXCEL_MAX_ROWS_PER_SHEET, c: 0 }),
  );

  execFileSync(astroBin, ['build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      EXCEL_VIEWER_FIXTURE_OUT_DIR: outDir,
      EXCEL_VIEWER_FIXTURE_CACHE_DIR: cacheDir,
      EXCEL_VIEWER_FIXTURE_REPO_ROOT: repoRoot,
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
    throw new Error('Excel Viewer fixture server did not bind to a TCP port');
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

describe('ExcelViewer public UI', () => {
  it('opens a local two-sheet workbook with addresses, cached values, formulas, merges, and no network request [capability:excel-viewer:profile:release-readiness] [capability:excel-viewer:mode:local-workbook-viewing] [capability:excel-viewer:accepted-input:xlsx-workbook] [capability:excel-viewer:produced-output:worksheet-data-view] [capability:excel-viewer:browser-feature:cell-addresses] [capability:excel-viewer:browser-feature:formula-toggle] [capability:excel-viewer:browser-feature:merged-ranges] [capability:excel-viewer:limit:local-files-only] [capability:excel-viewer:limit:no-formula-recalculation] [capability:excel-viewer:engine:language-support]', async () => {
    const page = await openFixturePage();
    try {
      expect(
        await page.$eval('[data-excel-local-notice]', (node) => node.textContent?.trim()),
      ).toMatch(/stays in your browser|never uploaded/i);

      let requestsAfterUpload = 0;
      page.on('request', () => {
        requestsAfterUpload += 1;
      });
      await uploadFile(page, workbookPath);
      await page.waitForSelector('[data-excel-sheet-tab="People"]');

      expect(requestsAfterUpload).toBe(0);
      expect(
        await page.$eval('[data-excel-file-name]', (node) => node.textContent?.trim()),
      ).toContain('people.xlsx');
      expect(
        await page.$$eval('[data-excel-sheet-tab]', (tabs) => tabs.map((tab) => ({
          text: tab.textContent?.trim(),
          selected: tab.getAttribute('aria-selected'),
          role: tab.getAttribute('role'),
        }))),
      ).toEqual([
        { text: 'People', selected: 'true', role: 'tab' },
        { text: 'Inventory', selected: 'false', role: 'tab' },
      ]);
      expect(
        await page.$eval('[data-excel-cell="F2"]', (cell) => ({
          address: cell.querySelector('[data-excel-cell-address]')?.textContent?.trim(),
          value: cell.querySelector('[data-excel-cell-content]')?.textContent?.trim(),
        })),
      ).toEqual({ address: 'F2', value: '999' });
      expect(
        await page.$eval('[data-excel-merges]', (node) => node.textContent?.trim()),
      ).toContain('A5:B5');
      expect(
        await page.$$eval('[data-excel-warning]', (nodes) => nodes.map((node) => node.textContent?.trim())),
      ).toContain("Formulas are displayed but not recalculated; values are the workbook's cached results.");

      await clickElement(page, '[data-excel-display-formulas]');
      expect(
        await page.$eval('[data-excel-cell="F2"] [data-excel-cell-content]', (node) => node.textContent?.trim()),
      ).toBe('=B2*2');
      await clickElement(page, '[data-excel-sheet-tab="Inventory"]');
      expect(await page.$$eval('[data-excel-cell="A2"]', (nodes) => nodes.length)).toBe(1);
      expect(
        await page.$eval('[data-excel-cell="A2"] [data-excel-cell-content]', (node) => node.textContent?.trim()),
      ).toBe('Pencil');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('sorts and filters one selected column stably and downloads only the selected sheet CSV [capability:excel-viewer:produced-output:selected-sheet-csv] [capability:excel-viewer:browser-feature:single-column-sort] [capability:excel-viewer:browser-feature:single-column-filter] [capability:excel-viewer:browser-feature:csv-download]', async () => {
    const page = await openFixturePage();
    try {
      await page.evaluate(() => {
        const state = { name: '', text: '', revoked: [] as string[] };
        (window as unknown as { __excelDownload: typeof state }).__excelDownload = state;
        URL.createObjectURL = (blob: Blob) => {
          void blob.text().then((text) => {
            state.text = text;
          });
          return 'blob:excel-viewer-test';
        };
        URL.revokeObjectURL = (url) => {
          state.revoked.push(url);
        };
        HTMLAnchorElement.prototype.click = function click() {
          state.name = this.download;
        };
      });
      await uploadFile(page, workbookPath);
      await page.waitForSelector('[data-excel-sort-column="1"]');

      await clickElement(page, '[data-excel-sort-column="1"]');
      expect(await visibleFirstColumn(page)).toEqual(['Bob', 'Alice', 'Cara', 'Summary']);
      await clickElement(page, '[data-excel-sort-column="1"]');
      expect(await visibleFirstColumn(page)).toEqual(['Alice', 'Cara', 'Bob', 'Summary']);

      await page.select('[data-excel-filter-column]', '0');
      await page.$eval('[data-excel-filter-query]', (input) => {
        const field = input as HTMLInputElement;
        field.value = 'a';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      expect(await visibleFirstColumn(page)).toEqual(['Alice', 'Cara', 'Summary']);

      await clickElement(page, '[data-excel-sheet-tab="Inventory"]');
      const synchronousRevokes = await page.$eval('[data-excel-download-csv]', (element) => {
        (element as HTMLElement).click();
        return (window as unknown as { __excelDownload: { revoked: string[] } }).__excelDownload.revoked;
      });
      expect(synchronousRevokes).toEqual([]);
      await page.waitForFunction(
        () => {
          const state = (window as unknown as {
            __excelDownload: { text: string; revoked: string[] };
          }).__excelDownload;
          return state.text.length > 0 && state.revoked.length === 1;
        },
      );
      expect(
        await page.evaluate(
          () => (window as unknown as { __excelDownload: { name: string; text: string } }).__excelDownload,
        ),
      ).toEqual({
        name: 'people-Inventory.csv',
        text: 'Item,Quantity\r\nPencil,3\r\nNotebook,1',
        revoked: ['blob:excel-viewer-test'],
      });
    } finally {
      await page.close();
    }
  }, 15_000);

  it('accepts an exact 10 MiB workbook and rejects 10 MiB plus one byte before parsing [capability:excel-viewer:limit:ten-mib-files]', async () => {
    const page = await openFixturePage();
    try {
      await uploadFile(page, exactLimitWorkbookPath);
      await page.waitForSelector('[data-excel-file-name]');
      expect(
        await page.$eval('[data-excel-file-name]', (node) => node.textContent?.trim()),
      ).toContain('exact-10-mib.xlsx');
      expect(await page.$$eval('[data-excel-error]', (nodes) => nodes.length)).toBe(0);

      await uploadFile(page, oversizedWorkbookPath);
      await page.waitForSelector('[data-excel-error]');
      expect(
        await page.$eval('[data-excel-error]', (node) => node.textContent?.trim()),
      ).toBe('This file is larger than the 10 MiB browser limit.');
      expect(await page.$$eval('[data-excel-file-name]', (nodes) => nodes.length)).toBe(0);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('paginates accepted rows while sort, filter, and sheet changes reset to the first page and CSV remains complete [capability:excel-viewer:browser-feature:row-pagination]', async () => {
    const page = await openFixturePage();
    try {
      await page.evaluate(() => {
        const state = { text: '' };
        (window as unknown as { __excelPaginationDownload: typeof state }).__excelPaginationDownload = state;
        URL.createObjectURL = (blob: Blob) => {
          void blob.text().then((text) => {
            state.text = text;
          });
          return 'blob:excel-pagination-test';
        };
        URL.revokeObjectURL = () => {};
        HTMLAnchorElement.prototype.click = () => {};
      });
      await uploadFile(page, largeWorkbookPath);
      await page.waitForSelector('[data-excel-page-summary]');

      expect(await page.$$eval('[data-excel-row]', (rows) => rows.length)).toBe(100);
      expect(
        await page.$eval('[data-excel-page-summary]', (node) => node.textContent?.trim()),
      ).toBe('Page 1 of 3');
      expect(
        await page.$eval('[data-excel-row-count]', (node) => node.textContent?.trim()),
      ).toBe('Rows 1–100 of 205 matching rows (205 total)');

      await clickElement(page, '[data-excel-next-page]');
      expect(
        await page.$eval('[data-excel-row] [data-excel-cell-column="0"] [data-excel-cell-content]', (node) => node.textContent?.trim()),
      ).toBe('101');
      await clickElement(page, '[data-excel-sort-column="0"]');
      expect(
        await page.$eval('[data-excel-page-summary]', (node) => node.textContent?.trim()),
      ).toBe('Page 1 of 3');

      await clickElement(page, '[data-excel-next-page]');
      await page.select('[data-excel-filter-column]', '0');
      await page.$eval('[data-excel-filter-query]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '205';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      expect(
        await page.$eval('[data-excel-page-summary]', (node) => node.textContent?.trim()),
      ).toBe('Page 1 of 1');
      expect(await page.$$eval('[data-excel-row]', (rows) => rows.length)).toBe(1);

      await page.select('[data-excel-filter-column]', '-1');
      await page.$eval('[data-excel-filter-query]', (input) => {
        const field = input as HTMLInputElement;
        field.value = '';
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await clickElement(page, '[data-excel-next-page]');
      await clickElement(page, '[data-excel-sheet-tab="Other"]');
      expect(
        await page.$eval('[data-excel-page-summary]', (node) => node.textContent?.trim()),
      ).toBe('Page 1 of 1');

      await clickElement(page, '[data-excel-sheet-tab="Large"]');
      await clickElement(page, '[data-excel-download-csv]');
      await page.waitForFunction(
        () => (window as unknown as { __excelPaginationDownload: { text: string } }).__excelPaginationDownload.text.length > 0,
      );
      const csv = await page.evaluate(
        () => (window as unknown as { __excelPaginationDownload: { text: string } }).__excelPaginationDownload.text,
      );
      expect(csv.split('\r\n')).toHaveLength(206);
      expect(csv).toContain('205,Row 205');
    } finally {
      await page.close();
    }
  }, 15_000);

  it('shows a localized worksheet-data limit error without rendering a dense table', async () => {
    const page = await openFixturePage();
    try {
      await uploadFile(page, limitWorkbookPath);
      await page.waitForSelector('[data-excel-error]');

      expect(
        await page.$eval('[data-excel-error]', (node) => node.textContent?.trim()),
      ).toBe('A worksheet exceeds the viewer limit of 10,000 rows, 256 columns, or 250,000 cells.');
      expect(await page.$$eval('[data-excel-row]', (rows) => rows.length)).toBe(0);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('keeps the newest selected workbook when an aborted older FileReader completes late', async () => {
    const page = await openFixturePage();
    try {
      const firstBytes = Array.from(readFileSync(workbookPath));
      const secondBytes = Array.from(readFileSync(metadataWorkbookPath));
      await page.evaluate((first, second) => {
        type ControlledReader = {
          aborted: boolean;
          readyState: number;
          result: ArrayBuffer | null;
          onload: ((event: ProgressEvent<FileReader>) => unknown) | null;
          onerror: ((event: ProgressEvent<FileReader>) => unknown) | null;
          onabort: ((event: ProgressEvent<FileReader>) => unknown) | null;
          readAsArrayBuffer(file: Blob): void;
          abort(): void;
        };
        const readers: ControlledReader[] = [];
        class ControlledFileReader implements ControlledReader {
          aborted = false;
          readyState = 0;
          result: ArrayBuffer | null = null;
          onload: ControlledReader['onload'] = null;
          onerror: ControlledReader['onerror'] = null;
          onabort: ControlledReader['onabort'] = null;
          readAsArrayBuffer(): void {
            this.readyState = 1;
            readers.push(this);
          }
          abort(): void {
            this.aborted = true;
            this.readyState = 2;
            this.onabort?.(new ProgressEvent('abort') as ProgressEvent<FileReader>);
          }
        }
        Object.defineProperty(window, 'FileReader', {
          configurable: true,
          value: ControlledFileReader,
        });
        (window as unknown as { __excelControlledReaders: ControlledReader[] }).__excelControlledReaders = readers;

        const input = document.querySelector('[data-excel-file-input]') as HTMLInputElement;
        const select = (name: string, bytes: number[]) => {
          const transfer = new DataTransfer();
          transfer.items.add(new File([new Uint8Array(bytes)], name));
          input.files = transfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        };
        select('older.xlsx', first);
        select('newest.xlsm', second);
      }, firstBytes, secondBytes);

      expect(
        await page.evaluate(
          () => (window as unknown as { __excelControlledReaders: Array<{ aborted: boolean }> }).__excelControlledReaders.map((reader) => reader.aborted),
        ),
      ).toEqual([true, false]);

      await page.evaluate(async (bytes) => {
        const reader = (window as unknown as {
          __excelControlledReaders: Array<{
            readyState: number;
            result: ArrayBuffer | null;
            onload: ((event: ProgressEvent<FileReader>) => unknown) | null;
          }>;
        }).__excelControlledReaders[1];
        reader.result = new Uint8Array(bytes).buffer;
        reader.readyState = 2;
        await reader.onload?.(new ProgressEvent('load') as ProgressEvent<FileReader>);
      }, secondBytes);
      await page.waitForSelector('[data-excel-file-name]');
      expect(
        await page.$eval('[data-excel-file-name]', (node) => node.textContent?.trim()),
      ).toContain('newest.xlsm');

      await page.evaluate(async (bytes) => {
        const reader = (window as unknown as {
          __excelControlledReaders: Array<{
            readyState: number;
            result: ArrayBuffer | null;
            onload: ((event: ProgressEvent<FileReader>) => unknown) | null;
            onerror: ((event: ProgressEvent<FileReader>) => unknown) | null;
          }>;
        }).__excelControlledReaders[0];
        reader.result = new Uint8Array(bytes).buffer;
        reader.readyState = 2;
        await reader.onload?.(new ProgressEvent('load') as ProgressEvent<FileReader>);
        await reader.onerror?.(new ProgressEvent('error') as ProgressEvent<FileReader>);
      }, firstBytes);

      expect(
        await page.$eval('[data-excel-file-name]', (node) => node.textContent?.trim()),
      ).toContain('newest.xlsm');
      expect(await page.$$eval('[data-excel-error]', (nodes) => nodes.length)).toBe(0);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('supports a focus-visible file picker and roving locale-aware sheet tabs [capability:excel-viewer:browser-feature:sheet-tabs]', async () => {
    const page = await openFixturePage();
    try {
      expect(
        await page.$eval('[data-excel-file-input]', (input) => ({
          label: input.closest('label')?.tagName,
          focusRing: input.closest('label')?.className.includes('focus-within:ring-2'),
        })),
      ).toEqual({ label: 'LABEL', focusRing: true });

      await uploadFile(page, workbookPath);
      await page.waitForSelector('[data-excel-sheet-tab="People"]');
      expect(
        await page.$$eval('[data-excel-sheet-tab]', (tabs) => tabs.map((tab) => ({
          text: tab.textContent?.trim(),
          tabIndex: (tab as HTMLButtonElement).tabIndex,
        }))),
      ).toEqual([
        { text: 'People', tabIndex: 0 },
        { text: 'Inventory', tabIndex: -1 },
      ]);

      await page.$eval('[data-excel-sheet-tab="People"]', (tab) => {
        (tab as HTMLElement).focus();
        tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      });
      await page.waitForFunction(
        () => document.activeElement?.textContent?.trim() === 'Inventory',
      );
      expect(
        await page.$eval('[data-excel-sheet-tab="Inventory"]', (tab) => tab.getAttribute('aria-selected')),
      ).toBe('true');

      await page.$eval('[data-excel-sheet-tab="Inventory"]', (tab) => {
        tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      });
      await page.waitForFunction(
        () => document.activeElement?.textContent?.trim() === 'People',
      );
      await page.$eval('[data-excel-sheet-tab="People"]', (tab) => {
        tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      });
      await page.waitForFunction(
        () => document.activeElement?.textContent?.trim() === 'Inventory',
      );
    } finally {
      await page.close();
    }

    const rtlPage = await openFixturePage('/ar/');
    try {
      await uploadFile(rtlPage, workbookPath);
      await rtlPage.waitForSelector('[data-excel-sheet-tab="People"]');
      await rtlPage.$eval('[data-excel-sheet-tab="People"]', (tab) => {
        (tab as HTMLElement).focus();
        tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      });
      await rtlPage.waitForFunction(
        () => document.activeElement?.textContent?.trim() === 'Inventory',
      );
      expect(
        await rtlPage.$eval('[data-excel-sheet-tab="Inventory"]', (tab) => tab.getAttribute('aria-selected')),
      ).toBe('true');
    } finally {
      await rtlPage.close();
    }
  }, 15_000);

  it('opens XLS and macro-enabled XLSM files while warning that macros, charts, and complex formatting are not executed or reproduced [capability:excel-viewer:accepted-input:xls-workbook] [capability:excel-viewer:accepted-input:xlsm-workbook] [capability:excel-viewer:limit:no-macro-execution] [capability:excel-viewer:limit:no-chart-rendering] [capability:excel-viewer:limit:limited-formatting-fidelity]', async () => {
    const page = await openFixturePage();
    try {
      await uploadFile(page, legacyWorkbookPath);
      await page.waitForSelector('[data-excel-file-name]');
      expect(
        await page.$eval('[data-excel-file-name]', (node) => node.textContent?.trim()),
      ).toContain('people.xls');

      await uploadFile(page, metadataWorkbookPath);
      await page.waitForFunction(
        () => document.querySelectorAll('[data-excel-warning]').length === 3,
      );
      expect(
        await page.$$eval('[data-excel-warning]', (nodes) => nodes.map((node) => node.textContent?.trim())),
      ).toEqual([
        'Macros are present but are not executed.',
        'Charts are present but are not reproduced.',
        'Complex formatting may not be fully reproduced.',
      ]);
    } finally {
      await page.close();
    }
  }, 15_000);

  it('shows localized type, parse, and CSV download errors without retaining stale workbook data', async () => {
    const page = await openFixturePage();
    try {
      await uploadFile(page, workbookPath);
      await page.waitForSelector('[data-excel-file-name]');

      await page.$eval('[data-excel-file-input]', (input) => {
        const transfer = new DataTransfer();
        transfer.items.add(new File(['plain text'], 'notes.txt', { type: 'text/plain' }));
        const field = input as HTMLInputElement;
        field.files = transfer.files;
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForSelector('[data-excel-error]');
      expect(
        await page.$eval('[data-excel-error]', (node) => node.textContent?.trim()),
      ).toBe('Choose an XLS, XLSX, or XLSM workbook.');
      expect(await page.$$eval('[data-excel-file-name]', (nodes) => nodes.length)).toBe(0);

      await uploadFile(page, invalidWorkbookPath);
      await page.waitForFunction(
        () => document.querySelector('[data-excel-error]')?.textContent?.includes('could not be read') ?? false,
      );
      expect(
        await page.$eval('[data-excel-error]', (node) => node.textContent?.trim()),
      ).toBe('This workbook could not be read. Check the file and try again.');

      await uploadFile(page, workbookPath);
      await page.waitForSelector('[data-excel-download-csv]');
      await page.evaluate(() => {
        URL.createObjectURL = () => {
          throw new Error('download blocked');
        };
      });
      await clickElement(page, '[data-excel-download-csv]');
      expect(
        await page.$eval('[data-excel-download-error]', (node) => ({
          role: node.getAttribute('role'),
          live: node.getAttribute('aria-live'),
          text: node.textContent?.trim(),
        })),
      ).toEqual({
        role: 'alert',
        live: 'assertive',
        text: 'CSV download failed. Try again.',
      });
    } finally {
      await page.close();
    }
  }, 15_000);
});

async function padWorkbookZip(bytes: Uint8Array, targetSize: number): Promise<Uint8Array> {
  const archive = await JSZip.loadAsync(bytes);
  const emptyArchive = await archive.generateAsync({
    type: 'uint8array',
    compression: 'STORE',
  });
  const paddingName = 'u2tool-padding.bin';
  const zipEntryOverhead = 30 + paddingName.length + 46 + paddingName.length;
  const paddingLength = targetSize - emptyArchive.length - zipEntryOverhead;
  if (paddingLength < 0) {
    throw new Error('Workbook fixture is larger than its target size');
  }
  archive.file(paddingName, new Uint8Array(paddingLength), {
    binary: true,
    compression: 'STORE',
  });
  const output = await archive.generateAsync({
    type: 'uint8array',
    compression: 'STORE',
  });
  if (output.length !== targetSize) {
    throw new Error(`Expected ${targetSize} bytes, received ${output.length}`);
  }
  return output;
}

async function openFixturePage(pathname = '/'): Promise<Page> {
  const page = await browser!.newPage();
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-excel-file-input]');
  return page;
}

async function uploadFile(page: Page, filePath: string): Promise<void> {
  const input = await page.$('[data-excel-file-input]') as ElementHandle<HTMLInputElement> | null;
  if (!input) {
    throw new Error('Excel file input did not render');
  }
  await input.uploadFile(filePath);
}

async function clickElement(page: Page, selector: string): Promise<void> {
  await page.$eval(selector, (element) => (element as HTMLElement).click());
}

async function visibleFirstColumn(page: Page): Promise<string[]> {
  return page.$$eval(
    '[data-excel-row] [data-excel-cell-column="0"] [data-excel-cell-content]',
    (nodes) => nodes.map((node) => node.textContent?.trim() ?? ''),
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
