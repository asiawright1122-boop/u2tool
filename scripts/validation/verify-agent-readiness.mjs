import * as cheerio from 'cheerio';

const baseUrl = process.env.U2TOOL_PREVIEW_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:4327';

console.log(`\n========================================`);
console.log(`Verifying Agent Readiness on ${baseUrl}`);
console.log(`========================================\n`);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function verifyAll() {
  // ----------------------------------------------------
  // Fix 1: Agent-friendly 404s
  // ----------------------------------------------------
  console.log(`[Check 1] Agent-friendly 404s (Accept: text/markdown)`);
  {
    const res = await fetch(`${baseUrl}/some-path-that-does-not-exist`, {
      headers: { Accept: 'text/markdown' },
      redirect: 'follow',
    });
    assert(res.status === 404, `Status is 404 (got ${res.status})`);
    const ctype = res.headers.get('content-type') || '';
    assert(ctype.includes('text/markdown'), `Content-Type is text/markdown (got '${ctype}')`);
    const vary = res.headers.get('vary') || '';
    assert(vary.toLowerCase().includes('accept'), `Vary header includes Accept (got '${vary}')`);
    const body = await res.text();
    assert(body.length >= 20, `Markdown body has >= 20 characters (got ${body.length})`);
    assert(body.includes('404') && body.includes('Not Found'), 'Markdown body explains 404 error');
    assert(body.includes('llms.txt') || body.includes('sitemap.xml'), 'Markdown body points to llms.txt or sitemap');
  }

  // ----------------------------------------------------
  // Fix 2: Content without JavaScript & Sequential Headings
  // ----------------------------------------------------
  console.log(`\n[Check 2] Content available without JavaScript & Sequential Headings`);
  {
    const res = await fetch(`${baseUrl}/en/`, {
      headers: { Accept: 'text/html' },
      redirect: 'follow',
    });
    assert(res.status === 200, `Homepage status is 200 (got ${res.status})`);
    const html = await res.text();
    assert(html.length >= 500, `Raw HTML content length >= 500 chars (got ${html.length})`);

    const $ = cheerio.load(html);
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const tag = el.tagName.toLowerCase();
      headings.push({
        tag,
        level: parseInt(tag.slice(1), 10),
        text: $(el).text().trim().replace(/\s+/g, ' ').slice(0, 40),
      });
    });

    assert(headings.length > 0 && headings[0].level === 1, `First heading is H1 (got ${headings[0]?.tag})`);

    let headingSkipFound = false;
    let skipDetail = '';
    for (let i = 0; i < headings.length - 1; i++) {
      const curr = headings[i];
      const next = headings[i + 1];
      if (next.level > curr.level + 1) {
        headingSkipFound = true;
        skipDetail = `${curr.tag} ("${curr.text}") -> ${next.tag} ("${next.text}")`;
        break;
      }
    }
    assert(!headingSkipFound, `Heading hierarchy is strictly sequential without skips (detail: ${skipDetail || 'all sequential'})`);
  }

  // ----------------------------------------------------
  // Fix 3: OpenAPI Spec Published
  // ----------------------------------------------------
  console.log(`\n[Check 3] OpenAPI Spec Published`);
  {
    const resJson = await fetch(`${baseUrl}/openapi.json`, { redirect: 'follow' });
    assert(resJson.status === 200, `/openapi.json returns HTTP 200 (got ${resJson.status})`);
    const jsonCtype = resJson.headers.get('content-type') || '';
    assert(jsonCtype.includes('application/json'), `Content-Type is application/json (got '${jsonCtype}')`);
    const spec = await resJson.json();
    assert(spec.openapi?.startsWith('3.1'), `OpenAPI version is 3.1.x (got '${spec.openapi}')`);
    assert(spec.paths?.['/api/ai-discovery/search'], 'Spec contains /api/ai-discovery/search path');
    assert(spec.paths?.['/{locale}/tools-index.json'], 'Spec contains /{locale}/tools-index.json path');
    assert(spec.components?.schemas?.ErrorResponse, 'Spec defines ErrorResponse schema');

    const resYaml = await fetch(`${baseUrl}/api/openapi.yaml`, { redirect: 'follow' });
    assert(resYaml.status === 200, `/api/openapi.yaml returns HTTP 200 (got ${resYaml.status})`);
    const yamlCtype = resYaml.headers.get('content-type') || '';
    assert(yamlCtype.includes('yaml'), `Content-Type is application/yaml (got '${yamlCtype}')`);
  }

  // ----------------------------------------------------
  // Fix 4: JSON Error Responses
  // ----------------------------------------------------
  console.log(`\n[Check 4] JSON Error Responses`);
  {
    const resApi404 = await fetch(`${baseUrl}/api/nonexistent-route`, {
      headers: { Accept: 'application/json' },
      redirect: 'follow',
    });
    assert(resApi404.status === 404, `Unknown API route returns 404 (got ${resApi404.status})`);
    const ctype404 = resApi404.headers.get('content-type') || '';
    assert(ctype404.includes('application/json'), `Content-Type is application/json (got '${ctype404}')`);
    const errJson = await resApi404.json();
    assert(Boolean(errJson.error), `Error response contains error code (got '${errJson.error}')`);
    assert(Boolean(errJson.message), `Error response contains message (got '${errJson.message}')`);
    assert(Boolean(errJson.resolution), `Error response contains resolution hint (got '${errJson.resolution}')`);

    const resSearch = await fetch(`${baseUrl}/api/ai-discovery/search?locale=invalid_code&q=test`, {
      redirect: 'follow',
    });
    const searchJson = await resSearch.json();
    assert(Boolean(searchJson.error), `Search error response contains error code (got '${searchJson.error}')`);
    assert(Boolean(searchJson.resolution), `Search error response contains resolution hint (got '${searchJson.resolution}')`);
  }

  // ----------------------------------------------------
  // Fix 5: Markdown Content Negotiation (acceptmarkdown.com)
  // ----------------------------------------------------
  console.log(`\n[Check 5] Markdown Content Negotiation (acceptmarkdown.com)`);
  {
    // Scanned homepage with Accept: text/markdown
    const resMd = await fetch(`${baseUrl}/`, {
      headers: { Accept: 'text/markdown' },
      redirect: 'follow',
    });
    assert(resMd.status === 200, `Homepage with Accept: text/markdown returns 200 (got ${resMd.status})`);
    const mdCtype = resMd.headers.get('content-type') || '';
    assert(mdCtype.includes('text/markdown'), `Content-Type is text/markdown (got '${mdCtype}')`);
    const mdVary = resMd.headers.get('vary') || '';
    assert(mdVary.toLowerCase().includes('accept'), `Vary header includes Accept (got '${mdVary}')`);
    const mdBody = await resMd.text();
    assert(mdBody.length > 100, `Markdown body is non-empty (got ${mdBody.length} chars)`);

    // Scanned homepage with Accept: text/html
    const resHtml = await fetch(`${baseUrl}/`, {
      headers: { Accept: 'text/html' },
      redirect: 'follow',
    });
    assert(resHtml.status === 200, `Homepage with Accept: text/html returns 200 (got ${resHtml.status})`);
    const htmlCtype = resHtml.headers.get('content-type') || '';
    assert(htmlCtype.includes('text/html'), `Content-Type is text/html (got '${htmlCtype}')`);
    const htmlVary = resHtml.headers.get('vary') || '';
    assert(htmlVary.toLowerCase().includes('accept'), `Vary header includes Accept (got '${htmlVary}')`);
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

verifyAll().catch((err) => {
  console.error('Validation crashed:', err);
  process.exit(1);
});
