#!/usr/bin/env node

/**
 * submit-indexnow.js
 *
 * Re-submits high-value routes to IndexNow using a root-level key file.
 * Defaults to a recover-traffic mode that pushes priority pages instead of
 * incorrectly sending the sitemap URL itself as a changed page.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');

const DEFAULT_SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.u2tool.com';
const DEFAULT_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const CATEGORY_SLUGS = ['text', 'encoding', 'generators', 'converters', 'development', 'security', 'network', 'image', 'math', 'charts', 'office', 'lifestyle', 'finance', 'fun'];
const COMPARISON_SLUGS = [
  'choose-text-tool',
  'choose-jwt-tool',
  'choose-chart-type',
  'choose-json-tool',
  'choose-image-tool',
  'meta-tags-vs-open-graph-vs-twitter-cards',
];
const AI_TOPIC_SLUGS = [
  'prompt-tools',
  'rag-tools',
  'ai-crawler-tools',
];
const PRIORITY_TOOL_SLUGS = [
  'json-formatter',
  'base64',
  'url-encoder',
  'xml-formatter',
  'uuid-generator',
  'password-generator',
  'hash-generator',
  'qr-generator',
  'word-counter',
  'regex-tester',
  'sql-formatter',
  'json-to-typescript',
  'markdown-to-html',
  'image-compressor',
  'image-converter',
  'favicon-generator',
  'gitignore-generator',
  'meta-tag-generator',
  'robots-txt-generator',
  'sitemap-generator',
  'ssl-checker',
  'cidr-calculator',
  'timezone-converter',
  'ai-token-calculator',
  'ai-prompt-generator',
  'ai-prompt-optimizer',
  'ai-prompt-template-generator',
  'json-to-prompt',
  'rag-chunk-size-calculator',
  'ai-text-humanizer',
  'ai-robots-txt-generator',
  'llms-txt-generator',
  'llms-txt-validator',
  'midjourney-prompt-generator',
  'stable-diffusion-prompt-generator',
];
const SEARCH_ENGINES = [
  { name: 'Bing', endpoint: 'https://www.bing.com/indexnow' },
  { name: 'Yandex', endpoint: 'https://yandex.com/indexnow' },
];
const MAX_URLS_PER_REQUEST = 10000;
const DEFAULT_LIMIT = 1000;

function parseArgs(argv) {
  const args = {
    dryRun: false,
    limit: DEFAULT_LIMIT,
    selectedLocales: DEFAULT_LOCALES,
    siteUrl: DEFAULT_SITE_URL,
    urlsFile: '',
    explicitUrls: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const rawArg = argv[index];
    if (rawArg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (rawArg.startsWith('--limit=')) {
      const limit = Number.parseInt(rawArg.slice('--limit='.length), 10);
      if (Number.isFinite(limit) && limit > 0) {
        args.limit = limit;
      }
      continue;
    }

    if (rawArg.startsWith('--locales=')) {
      const locales = rawArg
        .slice('--locales='.length)
        .split(',')
        .map((locale) => locale.trim())
        .filter(Boolean);

      if (locales.length > 0) {
        args.selectedLocales = locales;
      }
      continue;
    }

    if (rawArg.startsWith('--site-url=')) {
      const siteUrl = rawArg.slice('--site-url='.length).trim().replace(/\/+$/, '');
      if (siteUrl) {
        args.siteUrl = siteUrl;
      }
      continue;
    }

    if (rawArg.startsWith('--urls-file=')) {
      args.urlsFile = rawArg.slice('--urls-file='.length).trim();
      continue;
    }

    if (rawArg === '--urls-file') {
      const urlsFile = argv[index + 1] || '';
      if (!urlsFile || urlsFile.startsWith('-')) {
        throw new Error('Use --urls-file=path/to/urls.txt or --urls-file path/to/urls.txt');
      }
      args.urlsFile = urlsFile;
      index += 1;
      continue;
    }

    if (rawArg.startsWith('--url=')) {
      const url = rawArg.slice('--url='.length).trim();
      if (url) {
        args.explicitUrls.push(url);
      }
      continue;
    }

    if (rawArg === '--url') {
      const url = (argv[index + 1] || '').trim();
      if (!url || url.startsWith('-')) {
        throw new Error('Use --url=https://example.com/page/ or --url https://example.com/page/');
      }
      if (url) {
        args.explicitUrls.push(url);
      }
      index += 1;
    }
  }

  return args;
}

function isValidIndexNowKey(key) {
  return /^[A-Za-z0-9-]{8,128}$/.test(key);
}

function resolveIndexNowKey(siteUrl) {
  const envKey = process.env.INDEXNOW_KEY?.trim();
  const envKeyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim();

  if (envKey) {
    if (!isValidIndexNowKey(envKey)) {
      throw new Error(`INDEXNOW_KEY is present but invalid: ${envKey}`);
    }

    const keyLocation = envKeyLocation || `${siteUrl}/${envKey}.txt`;
    return { key: envKey, keyLocation };
  }

  if (!fs.existsSync(publicDir)) {
    throw new Error(`Public directory not found: ${publicDir}`);
  }

  const txtFiles = fs.readdirSync(publicDir).filter((fileName) => fileName.endsWith('.txt'));
  const candidates = [];

  for (const fileName of txtFiles) {
    const filePath = path.join(publicDir, fileName);
    const content = fs.readFileSync(filePath, 'utf8').trim();
    const baseName = fileName.slice(0, -4);

    if (!content || !isValidIndexNowKey(content)) {
      continue;
    }

    const score = Number(content === baseName) * 10 + Number(fileName === 'key.txt');
    candidates.push({
      fileName,
      key: content,
      keyLocation: `${siteUrl}/${fileName}`,
      score,
    });
  }

  candidates.sort((left, right) => {
    if (left.score !== right.score) {
      return right.score - left.score;
    }

    return left.fileName.localeCompare(right.fileName);
  });

  const candidate = candidates[0];
  if (!candidate) {
    throw new Error('No valid IndexNow key file found in public/. Add INDEXNOW_KEY or a root-level *.txt key file.');
  }

  return candidate;
}

/**
 * Reads the generated (locale, slug) index-suppression keys.
 *
 * This script runs under plain node, so it cannot import the TypeScript map.
 * The generated file has a stable `'locale/slug': true,` shape, so it is parsed
 * textually. An empty parse is treated as a hard error: silently falling back
 * to "nothing suppressed" would resubmit every noindex page.
 */
function loadSuppressedKeys() {
  const generatedPath = path.join(repoRoot, 'src/config/index-suppression.generated.ts');
  const source = fs.readFileSync(generatedPath, 'utf8');
  const keys = new Set();
  for (const match of source.matchAll(/'([^']+)':\s*true/g)) {
    keys.add(match[1]);
  }

  if (keys.size === 0) {
    throw new Error(
      `Parsed zero suppression keys from ${generatedPath}. Refusing to submit ` +
        'unfiltered URLs — check whether the generated file shape changed.'
    );
  }

  return keys;
}

function buildPriorityUrls(siteUrl, selectedLocales, limit) {
  const urls = new Set();
  const suppressedKeys = loadSuppressedKeys();
  const addPath = (path) => {
    urls.add(`${siteUrl}${path.endsWith('/') ? path : `${path}/`}`);
  };

  for (const locale of selectedLocales) {
    addPath(`/${locale}`);
    addPath(`/${locale}/tools`);
    addPath(`/${locale}/compare`);
    addPath(`/${locale}/ai`);
    for (const slug of AI_TOPIC_SLUGS) {
      addPath(`/${locale}/ai/${slug}`);
    }

    for (const category of CATEGORY_SLUGS) {
      addPath(`/${locale}/categories/${category}`);
    }

    for (const slug of COMPARISON_SLUGS) {
      addPath(`/${locale}/compare/${slug}`);
    }

    for (const slug of PRIORITY_TOOL_SLUGS) {
      // A suppressed page renders robots=noindex. Submitting it spends the
      // per-run quota asking an engine to index a page that then refuses.
      if (suppressedKeys.has(`${locale}/${slug}`)) {
        continue;
      }
      addPath(`/${locale}/tools/${slug}`);
    }
  }

  return Array.from(urls).slice(0, limit);
}

function parseUrlsFile(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(absolutePath, 'utf8').trim();
  if (!content) {
    return [];
  }

  if (content.startsWith('[')) {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error(`URLs file must contain a JSON array or newline-delimited URLs: ${filePath}`);
    }
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  }

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function resolveSubmitUrls(args) {
  const fileUrls = args.urlsFile ? parseUrlsFile(args.urlsFile) : [];
  if (args.urlsFile && fileUrls.length === 0) {
    throw new Error(`URLs file is empty: ${args.urlsFile}`);
  }

  const customUrls = [
    ...fileUrls,
    ...args.explicitUrls,
  ];

  if (customUrls.length === 0) {
    return {
      source: 'priority',
      urls: buildPriorityUrls(args.siteUrl, args.selectedLocales, args.limit),
    };
  }

  const siteHost = new URL(args.siteUrl).host;
  const deduped = [];
  const seen = new Set();
  for (const rawUrl of customUrls) {
    const url = new URL(rawUrl);
    if (url.host !== siteHost) {
      throw new Error(`Custom URL host must match ${siteHost}: ${rawUrl}`);
    }
    const normalized = url.toString();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      deduped.push(normalized);
    }
  }

  return {
    source: args.urlsFile ? `urls-file:${args.urlsFile}` : 'explicit-urls',
    urls: deduped.slice(0, args.limit),
  };
}

function chunkUrls(urls, chunkSize = MAX_URLS_PER_REQUEST) {
  const chunks = [];
  for (let index = 0; index < urls.length; index += chunkSize) {
    chunks.push(urls.slice(index, index + chunkSize));
  }
  return chunks;
}

function toApexSiteUrl(siteUrl) {
  const url = new URL(siteUrl);
  if (!url.hostname.startsWith('www.')) {
    return siteUrl;
  }

  url.hostname = url.hostname.slice(4);
  return url.toString().replace(/\/$/, '');
}

function shouldRetryWithApex(engine, host, result) {
  return engine.name === 'Bing'
    && host.startsWith('www.')
    && result.body.includes('SiteVerificationNotCompleted');
}

function submitUrlBatch(engine, keyConfig, host, urls) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      host,
      key: keyConfig.key,
      keyLocation: keyConfig.keyLocation,
      urlList: urls,
    });

    const endpoint = new URL(engine.endpoint);
    const request = https.request(
      {
        hostname: endpoint.hostname,
        path: `${endpoint.pathname}${endpoint.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 15000,
      },
      (response) => {
        let responseBody = '';
        response.on('data', (chunk) => {
          responseBody += chunk;
        });
        response.on('end', () => {
          resolve({
            engine: engine.name,
            ok: response.statusCode === 200 || response.statusCode === 202,
            status: response.statusCode ?? 0,
            body: responseBody.trim(),
          });
        });
      }
    );

    request.on('error', (error) => {
      resolve({
        engine: engine.name,
        ok: false,
        status: 0,
        body: error.message,
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        engine: engine.name,
        ok: false,
        status: 0,
        body: 'Request timed out',
      });
    });

    request.write(body);
    request.end();
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const keyConfig = resolveIndexNowKey(args.siteUrl);
  const submitUrls = resolveSubmitUrls(args);
  const urls = submitUrls.urls;
  const host = new URL(args.siteUrl).host;

  console.log('=== IndexNow Recovery Submit ===\n');
  console.log(`Site URL: ${args.siteUrl}`);
  console.log(`Key location: ${keyConfig.keyLocation}`);
  console.log(`Locales: ${args.selectedLocales.join(', ')}`);
  console.log(`URL source: ${submitUrls.source}`);
  console.log(`URLs prepared: ${urls.length}`);
  console.log(`Mode: ${args.dryRun ? 'dry-run' : 'submit'}\n`);

  if (args.dryRun) {
    for (const url of urls) {
      console.log(url);
    }
    return;
  }

  const batches = chunkUrls(urls);

  for (const engine of SEARCH_ENGINES) {
    console.log(`Submitting to ${engine.name} (${batches.length} batch${batches.length === 1 ? '' : 'es'})...`);

    for (const [index, batch] of batches.entries()) {
      let result = await submitUrlBatch(engine, keyConfig, host, batch);
      const suffix = batches.length > 1 ? ` batch ${index + 1}/${batches.length}` : '';

      if (shouldRetryWithApex(engine, host, result)) {
        const apexSiteUrl = toApexSiteUrl(args.siteUrl);
        const apexHost = new URL(apexSiteUrl).host;
        const apexKeyConfig = resolveIndexNowKey(apexSiteUrl);
        const apexBatch = batch.map((url) => url.replace(args.siteUrl, apexSiteUrl));
        console.log(`  ${engine.name}${suffix}: verification pending for ${host}, retrying with ${apexHost}...`);
        result = await submitUrlBatch(engine, apexKeyConfig, apexHost, apexBatch);
      }

      if (result.ok) {
        console.log(`  ${engine.name}${suffix}: OK (${result.status})`);
      } else {
        console.log(`  ${engine.name}${suffix}: FAIL (${result.status}) ${result.body}`);
      }
    }
  }
}

main().catch((error) => {
  console.error(`IndexNow submit failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
