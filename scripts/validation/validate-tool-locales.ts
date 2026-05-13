#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import puppeteer, { type Browser, type Page } from 'puppeteer';
import { tools } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type ProbeSection = 'actions' | 'fields' | 'options' | 'results';

type ToolProbe = Partial<Record<ProbeSection, string[]>>;

type ValidationArgs = {
  baseUrl: string;
  selectedLocales: Locale[];
  slugs: string[];
  timeoutMs: number;
};

type ValidationFailure = {
  slug: string;
  locale: Locale;
  url: string;
  reason: string;
  details?: unknown;
};

const POPULAR_UTILITY_PROBES: Record<string, ToolProbe> = {
  'stock-profit-calculator': {
    fields: ['shares', 'buyPrice'],
    results: ['totalCost', 'profitLoss'],
  },
  'dividend-yield-calculator': {
    fields: ['sharePrice', 'annualDividend'],
    results: ['dividendYield', 'annualIncome'],
  },
  'market-cap-calculator': {
    fields: ['sharePrice', 'sharesOutstanding'],
    results: ['marketCap', 'compact'],
  },
  'cagr-calculator': {
    fields: ['startValue', 'endValue'],
    results: ['totalReturn', 'growthMultiple'],
  },
  'position-size-calculator': {
    fields: ['accountSize', 'riskPercent'],
    results: ['riskAmount', 'positionSize'],
  },
  'savings-goal-calculator': {
    fields: ['targetAmount', 'monthlyContribution'],
    results: ['projectedSavings', 'monthsToGoal'],
  },
  'macro-calculator': {
    fields: ['weight', 'goal'],
    results: ['calories', 'protein'],
  },
  'debt-snowball-calculator': {
    fields: ['debts', 'extraPayment'],
    results: ['payoffMonths', 'totalInterest'],
  },
  'calorie-deficit-calculator': {
    fields: ['maintenanceCalories', 'dailyCalories'],
    results: ['dailyDeficit', 'estimatedChange'],
  },
  'cover-letter-generator': {
    fields: ['jobTitle', 'company'],
    actions: ['copy'],
  },
  'one-rep-max-calculator': {
    fields: ['weight', 'reps'],
    results: ['averageOneRepMax', 'epley'],
  },
  'passport-photo-maker': {
    fields: ['preset', 'dpi'],
    results: ['pixelSize', 'printSize'],
  },
  'paypal-fee-calculator': {
    fields: ['amount', 'feePercent'],
    results: ['fee', 'netReceived'],
  },
  'security-headers-checker': {
    fields: ['headers'],
    results: ['score', 'missing'],
  },
  'csp-header-generator': {
    fields: ['defaultSrc', 'scriptSrc'],
    results: ['cspHeader', 'directives'],
  },
  'csv-to-vcard-converter': {
    fields: ['csv', 'delimiter'],
    results: ['contacts', 'vcardVersion'],
  },
  'youtube-thumbnail-generator': {
    fields: ['youtubeVideo'],
    results: ['maxResolution', 'highQuality'],
  },
  'ics-file-generator': {
    fields: ['startDate', 'timezone'],
    results: ['eventDate', 'duration'],
  },
  'ai-prompt-generator': {
    fields: ['task', 'topic'],
    options: ['writing', 'professional'],
    actions: ['copy'],
  },
  'title-capitalization-tool': {
    fields: ['title', 'style'],
    options: ['titleCase', 'sentenceCase'],
    actions: ['copy'],
  },
  'meta-description-generator': {
    fields: ['page', 'keyword'],
    results: ['option'],
  },
  'midjourney-prompt-generator': {
    fields: ['subject', 'aspectRatio'],
    results: ['promptVariants', 'option'],
  },
  'stable-diffusion-prompt-generator': {
    fields: ['subject', 'negativePrompt'],
    results: ['positivePrompt', 'settingNotes'],
  },
  'youtube-title-generator': {
    fields: ['topic', 'keyword'],
    actions: ['copy'],
  },
  'instagram-bio-generator': {
    fields: ['topic', 'cta'],
    options: ['friendly', 'playful'],
    actions: ['copy'],
  },
  'youtube-description-generator': {
    fields: ['title', 'links'],
    actions: ['copy'],
  },
  'youtube-tags-generator': {
    fields: ['topic', 'keyword'],
    actions: ['copy'],
  },
  'tiktok-hashtag-generator': {
    fields: ['topic', 'keyword'],
    options: ['playful', 'bold'],
    actions: ['copy'],
  },
  'instagram-caption-generator': {
    fields: ['topic', 'cta'],
    options: ['friendly', 'playful'],
    actions: ['copy'],
  },
  'linkedin-post-generator': {
    fields: ['topic', 'benefit'],
    options: ['professional', 'concise'],
    actions: ['copy'],
  },
  'blog-title-generator': {
    fields: ['topic', 'keyword'],
    options: ['professional', 'concise'],
    actions: ['copy'],
  },
  'product-description-generator': {
    fields: ['page', 'benefit'],
    options: ['persuasive', 'concise'],
    actions: ['copy'],
  },
  'email-preview-text-generator': {
    fields: ['topic', 'benefit'],
    options: ['persuasive', 'playful'],
    actions: ['copy'],
  },
  'faq-generator': {
    fields: ['topic', 'benefit'],
    actions: ['copy'],
  },
  'seo-title-generator': {
    fields: ['page', 'keyword'],
    results: ['option'],
  },
  'tweet-generator': {
    fields: ['topic', 'cta'],
    options: ['concise', 'bold'],
    actions: ['copy'],
  },
  'linkedin-headline-generator': {
    fields: ['jobTitle', 'skills'],
    actions: ['copy'],
  },
  'linkedin-summary-generator': {
    fields: ['jobTitle', 'experience'],
    actions: ['copy'],
  },
  'email-subject-line-generator': {
    fields: ['topic', 'benefit'],
    actions: ['copy'],
  },
  'etsy-fee-calculator': {
    fields: ['salePrice', 'transactionPercent'],
    results: ['totalFees', 'profitMargin'],
  },
  'freelance-rate-calculator': {
    fields: ['targetIncome', 'billableHours'],
    results: ['hourlyRate', 'yearlyRevenue'],
  },
  'vcard-to-csv-converter': {
    fields: ['vcard', 'delimiter'],
    results: ['contacts', 'csvRows'],
  },
  'docker-run-to-docker-compose-converter': {
    fields: ['dockerRun'],
    results: ['service', 'ports'],
  },
  'llms-txt-generator': {
    fields: ['siteName', 'priorityPages'],
    results: ['pages'],
  },
  'wifi-qr-code-generator': {
    fields: ['ssid', 'encryption'],
    results: ['encryption', 'hidden'],
  },
};

function parseArgs(argv: string[]): ValidationArgs {
  const args: ValidationArgs = {
    baseUrl: 'http://127.0.0.1:4321',
    selectedLocales: [...locales],
    slugs: [],
    timeoutMs: 25000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base-url') {
      args.baseUrl = argv[index + 1] || args.baseUrl;
      index += 1;
      continue;
    }
    if (arg.startsWith('--base-url=')) {
      args.baseUrl = arg.slice('--base-url='.length);
      continue;
    }
    if (arg === '--locales') {
      args.selectedLocales = parseLocales(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (arg.startsWith('--locales=')) {
      args.selectedLocales = parseLocales(arg.slice('--locales='.length));
      continue;
    }
    if (arg === '--timeout-ms') {
      args.timeoutMs = Number.parseInt(argv[index + 1] || '', 10) || args.timeoutMs;
      index += 1;
      continue;
    }
    if (arg.startsWith('--timeout-ms=')) {
      args.timeoutMs = Number.parseInt(arg.slice('--timeout-ms='.length), 10) || args.timeoutMs;
      continue;
    }
    if (arg.startsWith('-')) {
      throw new Error(`Unknown argument: ${arg}`);
    }
    args.slugs.push(arg);
  }

  if (args.slugs.length === 0) {
    args.slugs = tools
      .filter((tool) => tool.component === 'PopularUtilityTool')
      .map((tool) => tool.slug);
  }

  return args;
}

function parseLocales(raw: string): Locale[] {
  const selected = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const invalid = selected.filter((locale) => !(locales as readonly string[]).includes(locale));
  if (invalid.length > 0) {
    throw new Error(`Unsupported locale(s): ${invalid.join(', ')}`);
  }

  return selected as Locale[];
}

function readJson(filePath: string): JsonObject {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getBaseMessages(locale: Locale): JsonObject {
  const filePath = locale === 'en'
    ? path.join(process.cwd(), 'src/messages/en/base.json')
    : path.join(process.cwd(), `src/messages/${locale}/base.json`);
  return readJson(filePath);
}

function getRequiredString(record: unknown, keyPath: string): string {
  const parts = keyPath.split('.');
  let current: unknown = record;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (!isRecord(current) || !(part in current)) {
      throw new Error(`Missing translation key: ${keyPath}`);
    }

    current = current[part];
  }

  if (typeof current !== 'string') {
    throw new Error(`Missing translation key: ${keyPath}`);
  }

  return current;
}

function getPopularUtilityProbeTexts(messages: JsonObject, slug: string): string[] {
  const probe = POPULAR_UTILITY_PROBES[slug];
  if (!probe) {
    throw new Error(`Missing PopularUtilityTool probe for ${slug}`);
  }

  const texts = new Set<string>();
  texts.add(getRequiredString(messages, 'tools.popularUtility.actions.copy'));

  for (const section of ['actions', 'fields', 'options', 'results'] as ProbeSection[]) {
    for (const key of probe[section] || []) {
      texts.add(getRequiredString(messages, `tools.popularUtility.${section}.${key}`));
    }
  }

  return [...texts];
}

function getExpectedTexts(locale: Locale, slug: string) {
  const messages = getBaseMessages(locale);
  const tool = tools.find((candidate) => candidate.slug === slug);
  if (!tool) {
    throw new Error(`Unknown tool slug: ${slug}`);
  }

  const name = getRequiredString(messages, `tools.${slug}.name`);
  const seoTitle = getRequiredString(messages, `tools.${slug}.seo_title`);
  const bodyTexts = [name];

  if (tool.component === 'PopularUtilityTool') {
    bodyTexts.push(...getPopularUtilityProbeTexts(messages, slug));
  }

  return {
    name,
    seoTitle,
    bodyTexts,
  };
}

function foldForComparison(value: string) {
  return value.toLocaleLowerCase().replace(/ß/g, 'ss');
}

function findChromeExecutable() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean) as string[];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function launchBrowser(): Promise<Browser> {
  const executablePath = findChromeExecutable();
  const options = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(executablePath ? { executablePath } : {}),
  };

  return puppeteer.launch(options);
}

async function waitForLocalizedTool(page: Page, expectedTexts: string[], timeoutMs: number) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    const body = foldForComparison(bodyText);
    const loaded = !body.includes('initialising engine') && !body.includes('initializing engine');
    const expectedVisible = expectedTexts.every((text) => body.includes(foldForComparison(text)));
    if (loaded && expectedVisible) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for localized tool text after ${timeoutMs}ms`);
}

async function validatePage(page: Page, args: ValidationArgs, slug: string, locale: Locale): Promise<ValidationFailure | null> {
  const expected = getExpectedTexts(locale, slug);
  const url = `${args.baseUrl.replace(/\/$/, '')}/${locale}/tools/${slug}/`;

  try {
    await page.goto(url, { waitUntil: 'load', timeout: args.timeoutMs });
    await waitForLocalizedTool(page, expected.bodyTexts, args.timeoutMs);

    const raw = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      bodyText: document.body?.innerText || '',
      sample: (document.body?.innerText || '').slice(0, 1600),
    }));
    const body = foldForComparison(raw.bodyText);
    const actual = {
      title: raw.title,
      h1: raw.h1,
      h1Ok: raw.h1 === expected.name,
      titleOk: raw.title.includes(expected.seoTitle),
      loadingVisible: body.includes('initialising engine') || body.includes('initializing engine'),
      missingBodyTexts: expected.bodyTexts.filter((text) => !body.includes(foldForComparison(text))),
      toolNotFound: body.includes('tool not found') || body.includes('failed to load tool'),
      sample: raw.sample,
    };

    if (!actual.h1Ok || !actual.titleOk || actual.loadingVisible || actual.missingBodyTexts.length > 0 || actual.toolNotFound) {
      return {
        slug,
        locale,
        url,
        reason: 'localized page assertions failed',
        details: actual,
      };
    }

    return null;
  } catch (error) {
    const diagnostic = await page.evaluate(() => ({
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        bodyText: document.body?.innerText || '',
        sample: (document.body?.innerText || '').slice(0, 1600),
      })).then((raw) => {
        const body = foldForComparison(raw.bodyText);
        return {
          title: raw.title,
          h1: raw.h1,
          expectedBodyTexts: expected.bodyTexts,
          missingBodyTexts: expected.bodyTexts.filter((text) => !body.includes(foldForComparison(text))),
          loadingVisible: body.includes('initialising engine') || body.includes('initializing engine'),
          sample: raw.sample,
        };
      }).catch(() => null);

    return {
      slug,
      locale,
      url,
      reason: error instanceof Error ? error.message : String(error),
      details: diagnostic,
    };
  }
}

export async function runToolLocaleValidation(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const selectedTools = args.slugs.map((slug) => {
    const tool = tools.find((candidate) => candidate.slug === slug);
    if (!tool) {
      throw new Error(`Unknown tool slug: ${slug}`);
    }
    return tool;
  });

  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 5000 });
  page.setDefaultTimeout(args.timeoutMs);

  const failures: ValidationFailure[] = [];
  for (const tool of selectedTools) {
    for (const locale of args.selectedLocales) {
      const failure = await validatePage(page, args, tool.slug, locale);
      if (failure) {
        failures.push(failure);
      } else {
        console.log(`PASS ${locale} ${tool.slug}`);
      }
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.error(`\nTool locale validation failed: ${failures.length} issue(s)`);
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(`\nTool locale validation passed for ${selectedTools.length} tool(s) across ${args.selectedLocales.length} locale(s).`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  runToolLocaleValidation();
}
