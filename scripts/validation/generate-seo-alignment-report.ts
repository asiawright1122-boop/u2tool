import { writeFileSync } from 'node:fs';

const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const OUTPUT_PATH = process.env.SEO_ALIGNMENT_REPORT || '/tmp/U2TOOL_SEO_ALIGNMENT_REPORT.md';

const paths = [
  '/en/',
  '/en/tools/',
  '/en/tools/json-formatter/',
  '/en/tools/jwt-decoder/',
  '/en/compare/choose-json-tool/',
  '/en/compare/choose-jwt-tool/',
];

function extract(html: string, pattern: RegExp): string {
  return html.match(pattern)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

async function fetchWithRetry(url: string, init: RequestInit = {}, attempts = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw lastError;
}

async function inspectPath(path: string): Promise<string> {
  const response = await fetchWithRetry(`${BASE_URL}${path}`, { redirect: 'follow' });
  const html = await response.text();
  const title = extract(html, /<title>(.*?)<\/title>/is);
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0] || '';
  const description = descriptionTag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.replace(/\s+/g, ' ').trim() || '';
  const canonical = extract(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const h1 = extract(html, /<h1[^>]*>(.*?)<\/h1>/is).replace(/<[^>]+>/g, ' ');
  const hasComparisonLink = /\/en\/compare\//.test(html);
  const staleJwtDebuggerCopy = html.includes('The JWT Debugger is a specialized tool');

  return [
    `### ${path}`,
    `- Status: ${response.status}`,
    `- Title: ${title}`,
    `- Description: ${description}`,
    `- Canonical: ${canonical}`,
    `- H1: ${h1}`,
    `- Comparison Link Present: ${hasComparisonLink ? 'yes' : 'no'}`,
    `- Stale JWT Debugger Copy: ${staleJwtDebuggerCopy ? 'yes' : 'no'}`,
  ].join('\n');
}

async function main(): Promise<void> {
  const sections = await Promise.all(paths.map((path) => inspectPath(path)));
  const report = [
    '# U2Tool SEO Alignment Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${BASE_URL}`,
    '',
    ...sections,
    '',
  ].join('\n');

  writeFileSync(OUTPUT_PATH, report, 'utf8');
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('SEO alignment report failed:', error);
  process.exitCode = 1;
});
