const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');

interface AlignmentCheck {
  path: string;
  expectedTerms: string[];
  forbiddenTerms?: string[];
}

const checks: AlignmentCheck[] = [
  {
    path: '/en/',
    expectedTerms: ['free online tools', 'developer', 'json'],
  },
  {
    path: '/en/tools/',
    expectedTerms: ['tools', 'json', 'converter'],
  },
  {
    path: '/en/tools/json-formatter/',
    expectedTerms: ['json', 'formatter', 'validator'],
  },
  {
    path: '/en/tools/jwt-decoder/',
    expectedTerms: ['jwt', 'decoder', 'token'],
    forbiddenTerms: ['jwt debugger is a specialized tool'],
  },
  {
    path: '/en/compare/choose-json-tool/',
    expectedTerms: ['json', 'tool', 'compare'],
  },
];

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
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

function textFromHead(html: string): string {
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1] || '';
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0] || '';
  const description = descriptionTag.match(/\bcontent=(["'])(.*?)\1/i)?.[2] || '';
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]+>/g, ' ') || '';
  return `${title} ${description} ${h1}`.replace(/\s+/g, ' ').toLowerCase();
}

async function validateCheck(check: AlignmentCheck): Promise<void> {
  const response = await fetchWithRetry(`${BASE_URL}${check.path}`, { redirect: 'follow' });
  assert(response.status === 200, `${check.path}: expected HTTP 200, got ${response.status}`);
  const html = await response.text();
  const text = textFromHead(html);

  for (const term of check.expectedTerms) {
    assert(text.includes(term), `${check.path}: title/meta/H1 missing intent term "${term}"`);
  }

  for (const term of check.forbiddenTerms || []) {
    assert(!html.toLowerCase().includes(term), `${check.path}: contains forbidden stale term "${term}"`);
  }
}

async function main(): Promise<void> {
  const failures: string[] = [];

  for (const check of checks) {
    try {
      await validateCheck(check);
      console.log(`OK  ${check.path}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.log(`FAIL ${check.path} -> ${message}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} SEO alignment checks failed. BASE_URL=${BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll SEO alignment checks passed. BASE_URL=${BASE_URL}`);
}

main().catch((error) => {
  console.error('Unexpected SEO alignment validation error:', error);
  process.exitCode = 1;
});
