#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import puppeteer, { type Browser, type ConsoleMessage, type HTTPResponse, type Page } from 'puppeteer';

import { tools } from '../../src/config/tools';
import type { ToolCategory } from '../../src/config/tools';
import { isValidLocale, locales, type Locale } from '../../src/lib/i18n';

type RuntimeScope = 'smoke' | 'popular' | 'all';

interface RuntimeLoadingOptions {
  baseUrl: string;
  category?: ToolCategory;
  concurrency: number;
  failOnConsoleError: boolean;
  failOnWeakLoad: boolean;
  hydrationTimeoutMs: number;
  jsonOut?: string;
  locales: Locale[];
  minControls: number;
  retryDelayMs: number;
  retryFailedAttempts: number;
  scope: RuntimeScope;
  slugs?: string[];
}

interface ToolRuntimeAttempt {
  attempt: number;
  badNetworkResponses: string[];
  consoleErrors: string[];
  controls: number;
  failed: boolean;
  failureReasons: string[];
  hasFailedToolText: boolean;
  hasStuckLoadingText: boolean;
  httpStatus: number;
  islandText: string;
  pageErrors: string[];
  parentRect: { bottom: number; height: number; top: number } | null;
  url: string;
  weakLoad: boolean;
}

interface ToolRuntimeResult {
  attempts: ToolRuntimeAttempt[];
  badNetworkResponses: string[];
  buttonCount: number;
  canvasCount: number;
  consoleErrors: string[];
  controls: number;
  failed: boolean;
  failureReasons: string[];
  hasFailedToolText: boolean;
  hasStuckLoadingText: boolean;
  httpStatus: number;
  inputCount: number;
  islandText: string;
  locale: Locale;
  pageErrors: string[];
  parentRect: { bottom: number; height: number; top: number } | null;
  path: string;
  recoveredAfterRetry: boolean;
  selectCount: number;
  slug: string;
  url: string;
  weakLoad: boolean;
}

interface ToolRuntimeReport {
  baseUrl: string;
  checked: number;
  failureCount: number;
  failures: ToolRuntimeResult[];
  generatedAt: string;
  options: {
    category?: ToolCategory;
    concurrency: number;
    failOnConsoleError: boolean;
    failOnWeakLoad: boolean;
    hydrationTimeoutMs: number;
    locales: Locale[];
    minControls: number;
    retryDelayMs: number;
    retryFailedAttempts: number;
    scope: RuntimeScope;
    slugs: string[];
  };
  results: ToolRuntimeResult[];
  weakLoadCount: number;
  weakLoads: ToolRuntimeResult[];
}

const DEFAULT_BASE_URL = process.env.PROD_BASE_URL || process.env.BASE_URL || 'http://127.0.0.1:4321';
const DEFAULT_HYDRATION_TIMEOUT_MS = 12_000;
const DEFAULT_MIN_CONTROLS = 1;
const DEFAULT_RETRY_DELAY_MS = 2_000;
const DEFAULT_RETRY_FAILED_ATTEMPTS = 1;
const TOOL_WRAPPER_SELECTOR = 'astro-island[component-url*="ToolWrapper"]';
const TOOL_CONTROL_SELECTOR = 'input, textarea, select, button, canvas, svg, [contenteditable="true"]';
const TOOL_FAILURE_TEXT_PATTERN = /Failed to load tool|Tool not found/i;
const TOOL_LOADING_TEXT_PATTERN = /Initialising Engine/i;

const SMOKE_SLUGS = [
  'ai-token-calculator',
  'ai-text-humanizer',
  'ai-robots-txt-generator',
  'calendar-heatmap-generator',
  'regex-generator',
  'json-formatter',
  'word-counter',
  'metric-imperial-converter',
];

function printUsage(): void {
  console.log(`Tool runtime loading validator

Usage:
  npm run validate:tool-runtime-loading -- [options]

Options:
  --base-url <url>             Site root. Default: ${DEFAULT_BASE_URL}
  --locale <locale>            Locale to test. Repeatable. Default: zh
  --locales <a,b>              Comma-separated locales.
  --all-locales                Test all supported locales.
  --scope <smoke|popular|all>  Tool selection when no slugs are provided. Default: smoke
  --slug <slug>                Tool slug to test. Repeatable.
  --slugs <a,b>                Comma-separated tool slugs.
  --category <category>        Limit selected tools to one tool category.
  --concurrency <n>            Number of pages to test at once. Default: 1
  --timeout-ms <n>             Tool hydration wait timeout. Default: ${DEFAULT_HYDRATION_TIMEOUT_MS}
  --min-controls <n>           Controls below this are reported as weak loads. Default: ${DEFAULT_MIN_CONTROLS}
  --retry-failed-attempts <n>  Retry failed pages this many times. Default: ${DEFAULT_RETRY_FAILED_ATTEMPTS}
  --retry-delay-ms <n>         Delay before each failed-page retry. Default: ${DEFAULT_RETRY_DELAY_MS}
  --no-retry                   Disable failed-page retries.
  --fail-on-weak-load          Exit non-zero for weak loads.
  --fail-on-console-error      Exit non-zero for browser console errors.
  --json-out <path>            Write the full report to JSON.
  --help                       Show this help.

Examples:
  npm run validate:tool-runtime-loading -- --base-url http://127.0.0.1:4323 --slug regex-generator
  npm run validate:tool-runtime-loading:prod -- --locales zh,en --scope popular
  npm run validate:tool-runtime-loading:prod -- --locale zh --scope all --json-out exports/tool-runtime-zh.json
`);
}

function readArgValue(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePositiveInteger(value: string, flag: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

function parseNonNegativeInteger(value: string, flag: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${flag} must be a non-negative integer`);
  }
  return parsed;
}

function parseLocaleList(value: string): Locale[] {
  const parsed = value
    .split(',')
    .map((locale) => locale.trim())
    .filter(Boolean);

  const invalid = parsed.filter((locale) => !isValidLocale(locale));
  if (invalid.length > 0) {
    throw new Error(`Unsupported locale(s): ${invalid.join(', ')}. Supported: ${locales.join(', ')}`);
  }

  return parsed as Locale[];
}

function parseRuntimeScope(value: string): RuntimeScope {
  if (value === 'smoke' || value === 'popular' || value === 'all') {
    return value;
  }
  throw new Error(`Unsupported scope "${value}". Use smoke, popular, or all.`);
}

function parseToolCategory(value: string): ToolCategory {
  const categories = new Set(tools.map((tool) => tool.category));
  if (categories.has(value as ToolCategory)) {
    return value as ToolCategory;
  }
  throw new Error(`Unsupported category "${value}". Use one of: ${Array.from(categories).join(', ')}`);
}

function parseOptions(argv = process.argv.slice(2)): RuntimeLoadingOptions {
  const selectedLocales: Locale[] = [];
  const selectedSlugs: string[] = [];
  let baseUrl = DEFAULT_BASE_URL;
  let category: ToolCategory | undefined;
  let concurrency = 1;
  let failOnConsoleError = false;
  let failOnWeakLoad = false;
  let hydrationTimeoutMs = DEFAULT_HYDRATION_TIMEOUT_MS;
  let jsonOut: string | undefined;
  let minControls = DEFAULT_MIN_CONTROLS;
  let retryDelayMs = DEFAULT_RETRY_DELAY_MS;
  let retryFailedAttempts = DEFAULT_RETRY_FAILED_ATTEMPTS;
  let scope: RuntimeScope = 'smoke';
  let useAllLocales = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }

    if (arg === '--base-url') {
      baseUrl = readArgValue(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === '--locale') {
      selectedLocales.push(...parseLocaleList(readArgValue(argv, index, arg)));
      index += 1;
      continue;
    }

    if (arg === '--locales') {
      selectedLocales.push(...parseLocaleList(readArgValue(argv, index, arg)));
      index += 1;
      continue;
    }

    if (arg === '--all-locales') {
      useAllLocales = true;
      continue;
    }

    if (arg === '--scope') {
      scope = parseRuntimeScope(readArgValue(argv, index, arg));
      index += 1;
      continue;
    }

    if (arg === '--slug') {
      selectedSlugs.push(readArgValue(argv, index, arg));
      index += 1;
      continue;
    }

    if (arg === '--slugs') {
      selectedSlugs.push(
        ...readArgValue(argv, index, arg)
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean)
      );
      index += 1;
      continue;
    }

    if (arg === '--category') {
      category = parseToolCategory(readArgValue(argv, index, arg));
      index += 1;
      continue;
    }

    if (arg === '--concurrency') {
      concurrency = parsePositiveInteger(readArgValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === '--timeout-ms') {
      hydrationTimeoutMs = parsePositiveInteger(readArgValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === '--min-controls') {
      minControls = parsePositiveInteger(readArgValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === '--retry-failed-attempts') {
      retryFailedAttempts = parseNonNegativeInteger(readArgValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === '--retry-delay-ms') {
      retryDelayMs = parseNonNegativeInteger(readArgValue(argv, index, arg), arg);
      index += 1;
      continue;
    }

    if (arg === '--no-retry') {
      retryFailedAttempts = 0;
      continue;
    }

    if (arg === '--fail-on-weak-load') {
      failOnWeakLoad = true;
      continue;
    }

    if (arg === '--fail-on-console-error') {
      failOnConsoleError = true;
      continue;
    }

    if (arg === '--json-out') {
      jsonOut = readArgValue(argv, index, arg);
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    category,
    concurrency,
    failOnConsoleError,
    failOnWeakLoad,
    hydrationTimeoutMs,
    jsonOut,
    locales: useAllLocales ? [...locales] : dedupe(selectedLocales.length > 0 ? selectedLocales : (['zh'] satisfies Locale[])),
    minControls,
    retryDelayMs,
    retryFailedAttempts,
    scope,
    slugs: selectedSlugs.length > 0 ? dedupe(selectedSlugs) : undefined,
  };
}

function dedupe<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function getSelectedSlugs(options: RuntimeLoadingOptions): string[] {
  const knownToolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

  if (options.slugs && options.slugs.length > 0) {
    const unknown = options.slugs.filter((slug) => !knownToolsBySlug.has(slug));
    if (unknown.length > 0) {
      throw new Error(`Unknown tool slug(s): ${unknown.join(', ')}`);
    }

    return options.category
      ? options.slugs.filter((slug) => knownToolsBySlug.get(slug)?.category === options.category)
      : options.slugs;
  }

  const scopedTools = tools.filter((tool) => {
    if (options.category && tool.category !== options.category) return false;
    if (options.scope === 'popular') return tool.popular === true;
    if (options.scope === 'smoke') return SMOKE_SLUGS.includes(tool.slug);
    return true;
  });

  return dedupe(scopedTools.map((tool) => tool.slug));
}

function buildToolUrl(baseUrl: string, locale: Locale, slug: string, attempt: number): string {
  const url = new URL(`/${locale}/tools/${slug}/`, baseUrl);
  url.searchParams.set('__u2tool_runtime_probe', `${Date.now()}-${attempt}`);
  return url.toString();
}

function collectConsoleError(message: ConsoleMessage): string | null {
  if (message.type() !== 'error') return null;
  const text = message.text();
  if (/favicon|chrome-extension|ResizeObserver loop/i.test(text)) return null;
  return text;
}

function collectBadNetworkResponse(response: HTTPResponse): string | null {
  const status = response.status();
  if (status < 400) return null;

  const request = response.request();
  const resourceType = request.resourceType();
  if (resourceType !== 'document' && resourceType !== 'script') return null;

  return `${status} ${resourceType} ${response.url()}`;
}

async function scrollToolWrapperIntoView(page: Page): Promise<void> {
  await page.bringToFront();
  await page.evaluate((selector) => {
    const island = document.querySelector(selector);
    const target = island?.parentElement || island;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const offset = Math.min(220, Math.round(window.innerHeight * 0.25));
    window.scrollTo(0, Math.max(0, rect.top + window.scrollY - offset));
  }, TOOL_WRAPPER_SELECTOR);
}

async function waitForToolWrapper(page: Page, timeoutMs: number): Promise<void> {
  try {
    await page.waitForFunction(
      (selector, loadingPatternSource, failurePatternSource, controlSelector) => {
        const island = document.querySelector(selector);
        const text = island?.textContent || '';
        const loadingPattern = new RegExp(loadingPatternSource, 'i');
        const failurePattern = new RegExp(failurePatternSource, 'i');
        const controlCount = island?.querySelectorAll(controlSelector).length ?? 0;

        return failurePattern.test(text) || !loadingPattern.test(text) || controlCount > 0;
      },
      { timeout: timeoutMs },
      TOOL_WRAPPER_SELECTOR,
      TOOL_LOADING_TEXT_PATTERN.source,
      TOOL_FAILURE_TEXT_PATTERN.source,
      TOOL_CONTROL_SELECTOR
    );
  } catch {
    // The final DOM snapshot decides whether this is a real stuck loader.
  }
}

async function readToolWrapperMetrics(page: Page) {
  return page.evaluate(
    (selector, loadingPatternSource, failurePatternSource, controlSelector) => {
      const island = document.querySelector(selector);
      const target = island?.parentElement || island;
      const text = island?.textContent || '';
      const rect = target?.getBoundingClientRect();
      const loadingPattern = new RegExp(loadingPatternSource, 'i');
      const failurePattern = new RegExp(failurePatternSource, 'i');

      return {
        buttonCount: island?.querySelectorAll('button').length ?? 0,
        canvasCount: island?.querySelectorAll('canvas').length ?? 0,
        controls: island?.querySelectorAll(controlSelector).length ?? 0,
        hasFailedToolText: failurePattern.test(text),
        hasStuckLoadingText: loadingPattern.test(text),
        inputCount: island?.querySelectorAll('input, textarea, [contenteditable="true"]').length ?? 0,
        islandMissing: !island,
        islandText: text.replace(/\s+/g, ' ').trim().slice(0, 600),
        parentRect: rect
          ? {
              bottom: Math.round(rect.bottom),
              height: Math.round(rect.height),
              top: Math.round(rect.top),
            }
          : null,
        selectCount: island?.querySelectorAll('select').length ?? 0,
      };
    },
    TOOL_WRAPPER_SELECTOR,
    TOOL_LOADING_TEXT_PATTERN.source,
    TOOL_FAILURE_TEXT_PATTERN.source,
    TOOL_CONTROL_SELECTOR
  );
}

async function inspectTool(
  browser: Browser,
  options: RuntimeLoadingOptions,
  locale: Locale,
  slug: string,
  attempt = 1
): Promise<ToolRuntimeResult> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 900 });
  await page.setCacheEnabled(false);

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const badNetworkResponses: string[] = [];
  const url = buildToolUrl(options.baseUrl, locale, slug, attempt);
  const pathName = `/${locale}/tools/${slug}/`;
  let httpStatus = 0;

  page.on('console', (message) => {
    const error = collectConsoleError(message);
    if (error) consoleErrors.push(error);
  });
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('response', (response) => {
    const badResponse = collectBadNetworkResponse(response);
    if (badResponse) badNetworkResponses.push(badResponse);
  });

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    httpStatus = response?.status() ?? 0;

    await scrollToolWrapperIntoView(page);
    await waitForToolWrapper(page, options.hydrationTimeoutMs);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const metrics = await readToolWrapperMetrics(page);
    const weakLoad = !metrics.islandMissing && !metrics.hasStuckLoadingText && metrics.controls < options.minControls;
    const failureReasons = [
      httpStatus !== 200 ? `expected HTTP 200, got ${httpStatus}` : '',
      metrics.islandMissing ? 'missing ToolWrapper island' : '',
      metrics.hasFailedToolText ? 'visible failed-tool message' : '',
      metrics.hasStuckLoadingText ? 'tool stayed on Initialising Engine' : '',
      pageErrors.length > 0 ? `page error: ${pageErrors[0]}` : '',
      badNetworkResponses.length > 0 ? `bad document/script response: ${badNetworkResponses[0]}` : '',
      options.failOnConsoleError && consoleErrors.length > 0 ? `console error: ${consoleErrors[0]}` : '',
      options.failOnWeakLoad && weakLoad ? `weak load: controls ${metrics.controls} < ${options.minControls}` : '',
    ].filter(Boolean);

    return {
      attempts: [],
      badNetworkResponses,
      buttonCount: metrics.buttonCount,
      canvasCount: metrics.canvasCount,
      consoleErrors,
      controls: metrics.controls,
      failed: failureReasons.length > 0,
      failureReasons,
      hasFailedToolText: metrics.hasFailedToolText,
      hasStuckLoadingText: metrics.hasStuckLoadingText,
      httpStatus,
      inputCount: metrics.inputCount,
      islandText: metrics.islandText,
      locale,
      pageErrors,
      parentRect: metrics.parentRect,
      path: pathName,
      recoveredAfterRetry: false,
      selectCount: metrics.selectCount,
      slug,
      url,
      weakLoad,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      attempts: [],
      badNetworkResponses,
      buttonCount: 0,
      canvasCount: 0,
      consoleErrors,
      controls: 0,
      failed: true,
      failureReasons: [`exception: ${message}`],
      hasFailedToolText: false,
      hasStuckLoadingText: false,
      httpStatus,
      inputCount: 0,
      islandText: '',
      locale,
      pageErrors,
      parentRect: null,
      path: pathName,
      recoveredAfterRetry: false,
      selectCount: 0,
      slug,
      url,
      weakLoad: false,
    };
  } finally {
    await page.close().catch(() => undefined);
  }
}

function toAttempt(result: ToolRuntimeResult, attempt: number): ToolRuntimeAttempt {
  return {
    attempt,
    badNetworkResponses: result.badNetworkResponses,
    consoleErrors: result.consoleErrors,
    controls: result.controls,
    failed: result.failed,
    failureReasons: result.failureReasons,
    hasFailedToolText: result.hasFailedToolText,
    hasStuckLoadingText: result.hasStuckLoadingText,
    httpStatus: result.httpStatus,
    islandText: result.islandText,
    pageErrors: result.pageErrors,
    parentRect: result.parentRect,
    url: result.url,
    weakLoad: result.weakLoad,
  };
}

async function sleep(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function inspectToolWithRetry(
  browser: Browser,
  options: RuntimeLoadingOptions,
  locale: Locale,
  slug: string
): Promise<ToolRuntimeResult> {
  const attempts: ToolRuntimeAttempt[] = [];
  let result = await inspectTool(browser, options, locale, slug, 1);
  attempts.push(toAttempt(result, 1));

  for (let retryIndex = 1; result.failed && retryIndex <= options.retryFailedAttempts; retryIndex += 1) {
    await sleep(options.retryDelayMs);
    result = await inspectTool(browser, options, locale, slug, retryIndex + 1);
    attempts.push(toAttempt(result, retryIndex + 1));
  }

  return {
    ...result,
    attempts,
    recoveredAfterRetry: attempts.length > 1 && !result.failed,
  };
}

async function runQueue<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  let cursor = 0;
  const workerCount = Math.max(1, concurrency);

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        await worker(items[index], index);
      }
    })
  );
}

export async function runToolRuntimeLoadingValidation(
  options = parseOptions()
): Promise<ToolRuntimeReport> {
  const selectedSlugs = getSelectedSlugs(options);
  const probes = options.locales.flatMap((locale) => selectedSlugs.map((slug) => ({ locale, slug })));
  const results: ToolRuntimeResult[] = [];
  let completed = 0;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    await runQueue(probes, options.concurrency, async (probe) => {
      const result = await inspectToolWithRetry(browser, options, probe.locale, probe.slug);
      results.push(result);
      completed += 1;

      const status = result.failed ? 'FAIL' : result.recoveredAfterRetry ? 'OK_AFTER_RETRY' : result.weakLoad ? 'WEAK' : 'OK';
      console.log(
        `${status.padEnd(14)} ${result.locale}/${result.slug} controls=${result.controls} status=${result.httpStatus} attempts=${result.attempts.length}`
      );

      if (completed % 25 === 0 || completed === probes.length) {
        const failures = results.filter((item) => item.failed).length;
        const weakLoads = results.filter((item) => item.weakLoad).length;
        console.log(`progress ${completed}/${probes.length} failures=${failures} weak=${weakLoads}`);
      }
    });
  } finally {
    await browser.close().catch(() => undefined);
  }

  results.sort((a, b) => `${a.locale}/${a.slug}`.localeCompare(`${b.locale}/${b.slug}`));
  const failures = results.filter((result) => result.failed);
  const weakLoads = results.filter((result) => result.weakLoad);

  return {
    baseUrl: options.baseUrl,
    checked: results.length,
    failureCount: failures.length,
    failures,
    generatedAt: new Date().toISOString(),
    options: {
      category: options.category,
      concurrency: options.concurrency,
      failOnConsoleError: options.failOnConsoleError,
      failOnWeakLoad: options.failOnWeakLoad,
      hydrationTimeoutMs: options.hydrationTimeoutMs,
      locales: options.locales,
      minControls: options.minControls,
      retryDelayMs: options.retryDelayMs,
      retryFailedAttempts: options.retryFailedAttempts,
      scope: options.scope,
      slugs: selectedSlugs,
    },
    results,
    weakLoadCount: weakLoads.length,
    weakLoads,
  };
}

async function writeJsonReport(report: ToolRuntimeReport, jsonOut: string): Promise<void> {
  await mkdir(path.dirname(jsonOut), { recursive: true });
  await writeFile(jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

function printSummary(report: ToolRuntimeReport): void {
  console.log('\nTool runtime loading validation');
  console.log(`  Base URL: ${report.baseUrl}`);
  console.log(`  Checked:  ${report.checked}`);
  console.log(`  Failed:   ${report.failureCount}`);
  console.log(`  Weak:     ${report.weakLoadCount}`);

  for (const failure of report.failures) {
    console.error(`\nFAIL ${failure.locale}/${failure.slug}`);
    for (const reason of failure.failureReasons) {
      console.error(`  - ${reason}`);
    }
    if (failure.islandText) {
      console.error(`  text: ${failure.islandText.slice(0, 220)}`);
    }
  }

  if (report.weakLoads.length > 0) {
    console.log('\nWeak loads (reported, not failed unless --fail-on-weak-load is set):');
    for (const weakLoad of report.weakLoads.slice(0, 20)) {
      console.log(`  - ${weakLoad.locale}/${weakLoad.slug}: controls=${weakLoad.controls}`);
    }
    if (report.weakLoads.length > 20) {
      console.log(`  ... ${report.weakLoads.length - 20} more`);
    }
  }
}

async function main(): Promise<void> {
  const options = parseOptions();
  if (options.concurrency > 1) {
    console.warn('Warning: concurrency > 1 can make client:visible timing noisier. Use concurrency=1 for final verification.');
  }

  const report = await runToolRuntimeLoadingValidation(options);
  if (options.jsonOut) {
    await writeJsonReport(report, options.jsonOut);
    console.log(`\nJSON report written to ${options.jsonOut}`);
  }

  printSummary(report);
  process.exitCode = report.failureCount === 0 ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unexpected tool runtime loading validation error:', error);
    process.exitCode = 1;
  });
}
