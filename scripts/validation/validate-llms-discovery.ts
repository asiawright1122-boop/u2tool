const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');

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

async function main(): Promise<void> {
  const response = await fetchWithRetry(`${BASE_URL}/llms.txt`, { redirect: 'follow' });
  assert(response.status === 200, `llms.txt expected HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/plain'), `llms.txt unexpected content-type "${response.headers.get('content-type') || ''}"`);

  const text = await response.text();
  const requiredSnippets = [
    '# U2Tool - Free Online Tools Catalog',
    '## Priority Discovery Routes',
    '## Preferred Canonical Routes',
    '## Catalog by Category',
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/en/tools/json-formatter/`,
    `${BASE_URL}/en/compare/choose-json-tool/`,
    `${BASE_URL}/en/categories/development/`,
  ];

  for (const snippet of requiredSnippets) {
    assert(text.includes(snippet), `llms.txt missing "${snippet}"`);
  }

  const nonCanonicalUrl = new RegExp(`${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/[a-z]{2}\\/(?:tools|categories|compare)\\/[^\\s)]+(?<!\\/)`, 'g');
  const matches = text.match(nonCanonicalUrl) || [];
  assert(matches.length === 0, `llms.txt contains non-canonical URLs without trailing slash: ${matches.slice(0, 5).join(', ')}`);
  assert(!text.includes('${BASE_URL}'), 'llms.txt contains an unresolved BASE_URL placeholder');
  assert(!text.includes('MISSING:'), 'llms.txt contains missing translation placeholders');

  console.log(`All llms discovery checks passed. BASE_URL=${BASE_URL}`);
}

main().catch((error) => {
  console.error(`LLMS discovery validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
