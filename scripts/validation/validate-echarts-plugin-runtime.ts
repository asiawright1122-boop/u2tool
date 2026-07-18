#!/usr/bin/env node

import puppeteer, { type Browser, type Page } from 'puppeteer';

const DEFAULT_BASE_URL = process.env.PROD_BASE_URL || process.env.BASE_URL || 'http://127.0.0.1:4321';
const DEFAULT_LOCALE = 'en';
const DEFAULT_TIMEOUT_MS = 25_000;
const PLUGIN_TOOLS = ['liquid-fill-chart-generator', 'wordcloud-generator'] as const;
const TOOL_WRAPPER_SELECTOR = 'astro-island[component-url*="ToolWrapper"]';

interface Options {
  baseUrl: string;
  locale: string;
  timeoutMs: number;
}

interface ProbeResult {
  canvasCount: number;
  failures: string[];
  locale: string;
  slug: string;
  visualCanvasCount: number;
}

function readOption(argv: string[], flag: string, fallback: string): string {
  const index = argv.indexOf(flag);
  if (index < 0) return fallback;
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
  return value;
}

function parseOptions(argv = process.argv.slice(2)): Options {
  const timeoutMs = Number.parseInt(readOption(argv, '--timeout-ms', String(DEFAULT_TIMEOUT_MS)), 10);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('--timeout-ms must be a positive integer');
  }

  return {
    baseUrl: readOption(argv, '--base-url', DEFAULT_BASE_URL).replace(/\/+$/, ''),
    locale: readOption(argv, '--locale', DEFAULT_LOCALE),
    timeoutMs,
  };
}

async function waitForRenderedChart(page: Page, timeoutMs: number): Promise<void> {
  await page.evaluate((selector) => {
    document.querySelector(selector)?.parentElement?.scrollIntoView({ block: 'center' });
  }, TOOL_WRAPPER_SELECTOR);

  await page.waitForFunction(
    (selector) => {
      const island = document.querySelector(selector);
      if (!island) return false;
      const text = island.textContent || '';
      if (/Failed to load chart|Failed to load tool|Tool not found/i.test(text)) return false;
      return [...island.querySelectorAll('canvas')].some((canvas) => canvas.width > 0 && canvas.height > 0);
    },
    { timeout: timeoutMs },
    TOOL_WRAPPER_SELECTOR
  );
}

async function probeTool(browser: Browser, options: Options, slug: string): Promise<ProbeResult> {
  const page = await browser.newPage();
  const failures: string[] = [];
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error' && !/favicon|chrome-extension|ResizeObserver loop/i.test(message.text())) {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  try {
    const response = await page.goto(`${options.baseUrl}/${options.locale}/tools/${slug}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    if (response?.status() !== 200) failures.push(`expected HTTP 200, got ${response?.status() ?? 0}`);

    await waitForRenderedChart(page, options.timeoutMs);
    const visual = await page.evaluate((selector) => {
      const island = document.querySelector(selector);
      const canvases = [...(island?.querySelectorAll('canvas') || [])];
      let visualCanvasCount = 0;

      for (const canvas of canvases) {
        const context = canvas.getContext('2d');
        if (!context || canvas.width < 100 || canvas.height < 100) continue;
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let nonNeutralPixels = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          if (alpha > 0 && Math.max(red, green, blue) - Math.min(red, green, blue) > 8) {
            nonNeutralPixels += 1;
          }
        }

        if (nonNeutralPixels >= 1_000) visualCanvasCount += 1;
      }

      return { canvasCount: canvases.length, visualCanvasCount };
    }, TOOL_WRAPPER_SELECTOR);

    if (visual.canvasCount === 0) failures.push('no chart canvas rendered');
    if (visual.visualCanvasCount === 0) failures.push('chart canvas has no visible plugin output');
    if (consoleErrors.length > 0) failures.push(`console error: ${consoleErrors[0]}`);
    if (pageErrors.length > 0) failures.push(`page error: ${pageErrors[0]}`);

    return { ...visual, failures, locale: options.locale, slug };
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
    return { canvasCount: 0, failures, locale: options.locale, slug, visualCanvasCount: 0 };
  } finally {
    await page.close().catch(() => undefined);
  }
}

async function main(): Promise<void> {
  const options = parseOptions();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const results: ProbeResult[] = [];
  try {
    for (const slug of PLUGIN_TOOLS) {
      const result = await probeTool(browser, options, slug);
      results.push(result);
      const status = result.failures.length === 0 ? 'PASS' : 'FAIL';
      console.log(`${status} ${result.locale}/${result.slug} canvases=${result.canvasCount} visual=${result.visualCanvasCount}`);
      for (const failure of result.failures) console.error(`  - ${failure}`);
    }
  } finally {
    await browser.close().catch(() => undefined);
  }

  const failureCount = results.reduce((count, result) => count + result.failures.length, 0);
  const passedCount = results.filter((result) => result.failures.length === 0).length;
  console.log(`\nECharts plugin runtime validation: ${passedCount}/${results.length} probes without failures`);
  if (failureCount > 0) {
    console.error('Known compatibility note: echarts-liquidfill@3.1.0 and echarts-wordcloud@2.1.0 declare peer echarts ^5.0.1.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Unexpected ECharts plugin runtime validation error:', error);
  process.exitCode = 1;
});
