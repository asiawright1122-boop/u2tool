const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');

interface RenderedSeoCheck {
  name: string;
  path: string;
  canonicalPath?: string;
  titleIncludes: string;
  descriptionIncludes: string;
  h1Includes?: string;
  schemaTypes: string[];
  bodyMustInclude?: string[];
  bodyMustNotInclude?: string[];
}

const requiredSocialMeta = [
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:image'],
  ['property', 'og:url'],
  ['property', 'og:site_name'],
  ['name', 'twitter:card'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
] as const;

const checks: RenderedSeoCheck[] = [
  {
    name: 'English homepage',
    path: '/en/',
    titleIncludes: 'U2Tool',
    descriptionIncludes: 'online tools',
    h1Includes: 'Free Online Tools',
    schemaTypes: ['Organization', 'WebSite'],
    bodyMustInclude: ['JSON Formatter', 'Text Tools'],
  },
  {
    name: 'English tools index',
    path: '/en/tools/',
    titleIncludes: 'Tools',
    descriptionIncludes: 'tools',
    h1Includes: 'Free Online Tools',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage'],
    bodyMustInclude: ['JSON Formatter', 'Choose the Right'],
  },
  {
    name: 'English tools search results',
    path: '/en/tools/?q=json',
    canonicalPath: '/en/tools/',
    titleIncludes: 'Tools',
    descriptionIncludes: 'tools',
    h1Includes: 'Free Online Tools',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage'],
    bodyMustInclude: ['data-search-results', 'JSON Formatter', 'https://www.u2tool.com/en/tools/json-formatter/'],
  },
  {
    name: 'JSON Formatter tool page',
    path: '/en/tools/json-formatter/',
    titleIncludes: 'JSON Formatter',
    descriptionIncludes: 'JSON',
    h1Includes: 'JSON Formatter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['Choose the Right JSON Tool', '/en/compare/choose-json-tool/'],
  },
  {
    name: 'JWT Decoder tool page',
    path: '/en/tools/jwt-decoder/',
    titleIncludes: 'JWT Decoder',
    descriptionIncludes: 'JWT',
    h1Includes: 'JWT Decoder',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The JWT Decoder helps developers inspect', '/en/compare/choose-jwt-tool/'],
    bodyMustNotInclude: [
      'The JWT Debugger is a specialized tool',
      'Signature Verification',
      "validate the token's signature",
    ],
  },
  {
    name: 'Word Counter refreshed support content',
    path: '/en/tools/word-counter/',
    titleIncludes: 'Word Counter',
    descriptionIncludes: 'word',
    h1Includes: 'Word Counter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Word Counter tool gives writers'],
    bodyMustNotInclude: [
      'finite-state automata',
      'Web Workers implementation',
      'Punkt algorithm',
      'Export Data',
    ],
  },
  {
    name: 'Regex Tester refreshed support content',
    path: '/en/tools/regex-tester/',
    titleIncludes: 'Regex Tester',
    descriptionIncludes: 'regex',
    h1Includes: 'Regex Tester',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Regex Tester lets developers try JavaScript regular expressions'],
    bodyMustNotInclude: ['PCRE2', 'replacement preview mode'],
  },
  {
    name: 'Timestamp Converter refreshed support content',
    path: '/en/tools/timestamp-converter/',
    titleIncludes: 'Timestamp Converter',
    descriptionIncludes: 'timestamp',
    h1Includes: 'Timestamp Converter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Timestamp Converter helps you move between Unix timestamp seconds'],
    bodyMustNotInclude: ['WebAssembly-based conversion engine', 'Timezone Offset Picker'],
  },
  {
    name: 'Image to Base64 refreshed support content',
    path: '/en/tools/image-to-base64/',
    titleIncludes: 'Image to Base64',
    descriptionIncludes: 'Base64',
    h1Includes: 'Image to Base64',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Image to Base64 tool converts a local image file'],
    bodyMustNotInclude: ['Preserve Transparency', 'target encoding format'],
  },
  {
    name: 'Password Generator refreshed support content',
    path: '/en/tools/password-generator/',
    titleIncludes: 'Password Generator',
    descriptionIncludes: 'password',
    h1Includes: 'Password Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Password Generator creates random passwords in the browser'],
    bodyMustNotInclude: ['WebAssembly-compiled cryptographic primitives', 'Entropy Visualizer', 'BIP-39 mnemonic phrases'],
  },
  {
    name: 'QR Generator refreshed support content',
    path: '/en/tools/qr-generator/',
    titleIncludes: 'QR',
    descriptionIncludes: 'QR',
    h1Includes: 'QR',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The QR Generator creates a PNG QR code from text or a URL'],
    bodyMustNotInclude: ['CMYK offset printing', 'alpha transparency support', 'JIS X 0510'],
  },
  {
    name: 'Image Compressor refreshed support content',
    path: '/en/tools/image-compressor/',
    titleIncludes: 'Image Compressor',
    descriptionIncludes: 'image',
    h1Includes: 'Image Compressor',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Image Compressor loads a local image in the browser'],
    bodyMustNotInclude: ['discrete cosine transform', 'lossless compression algorithms'],
  },
  {
    name: 'Hash Generator refreshed support content',
    path: '/en/tools/hash-generator/',
    titleIncludes: 'Hash Generator',
    descriptionIncludes: 'hash',
    h1Includes: 'Hash Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Hash Generator creates browser-based digest values'],
    bodyMustNotInclude: ['MD5, SHA-1, and SHA-256', 'fixed-length, seemingly random'],
  },
  {
    name: 'Markdown Preview refreshed support content',
    path: '/en/tools/markdown-preview/',
    titleIncludes: 'Markdown',
    descriptionIncludes: 'Markdown',
    h1Includes: 'Markdown Preview',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Markdown Preview tool lets you edit Markdown'],
    bodyMustNotInclude: ['lexical analy', 'CommonMark specification'],
  },
  {
    name: 'CIDR Calculator refreshed support content',
    path: '/en/tools/cidr-calculator/',
    titleIncludes: 'CIDR',
    descriptionIncludes: 'CIDR',
    h1Includes: 'CIDR',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The CIDR Calculator analyzes an IPv4 address'],
    bodyMustNotInclude: ['decomposes them into actionable'],
  },
  {
    name: 'Gitignore Generator refreshed support content',
    path: '/en/tools/gitignore-generator/',
    titleIncludes: 'gitignore',
    descriptionIncludes: 'gitignore',
    h1Includes: 'gitignore',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The .gitignore Generator helps build a .gitignore file'],
  },
  {
    name: 'IP Lookup refreshed support content',
    path: '/en/tools/ip-lookup/',
    titleIncludes: 'IP',
    descriptionIncludes: 'IP',
    h1Includes: 'IP',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The IP Lookup tool queries ip-api.com'],
    bodyMustNotInclude: ['multi-source API aggregation', 'BGP routing tables', 'DNSBL integration'],
  },
  {
    name: 'Favicon Generator refreshed support content',
    path: '/en/tools/favicon-generator/',
    titleIncludes: 'Favicon',
    descriptionIncludes: 'favicon',
    h1Includes: 'Favicon',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Favicon Generator creates PNG favicon images'],
    bodyMustNotInclude: ['multi-resolution favicon assets', 'standardized di'],
  },
  {
    name: 'Image Converter refreshed support content',
    path: '/en/tools/image-converter/',
    titleIncludes: 'Image Format Converter',
    descriptionIncludes: 'image',
    h1Includes: 'Image Format Converter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Image Converter changes a local image into PNG, JPEG, or WebP'],
    bodyMustNotInclude: ['without leaving the browser. Upload a file'],
  },
  {
    name: 'Comparison guides index',
    path: '/en/compare/',
    titleIncludes: 'Choose the right',
    descriptionIncludes: 'tool',
    h1Includes: 'Choose the right',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList'],
    bodyMustInclude: ['JSON', 'JWT'],
  },
  {
    name: 'JWT comparison guide',
    path: '/en/compare/choose-jwt-tool/',
    titleIncludes: 'JWT',
    descriptionIncludes: 'JWT',
    h1Includes: 'Choose the Right JWT Tool',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
    bodyMustInclude: ['JWT Decoder', 'JWT Generator'],
  },
];

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

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function getTagContent(html: string, selector: 'title' | 'description' | 'canonical' | 'robots'): string {
  if (selector === 'title') {
    return html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim() || '';
  }

  if (selector === 'description') {
    const tag = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0] || '';
    return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
  }

  if (selector === 'canonical') {
    const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || '';
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1]?.trim() || '';
  }

  const tag = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

function extractJsonLdTypes(html: string): string[] {
  const scripts = Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  ).map((match) => match[1].trim());
  const types = new Set<string>();

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script) as unknown;
      const values = Array.isArray(parsed) ? parsed : [parsed];
      for (const value of values) {
        if (value && typeof value === 'object' && '@type' in value) {
          const type = (value as { '@type'?: unknown })['@type'];
          if (typeof type === 'string') {
            types.add(type);
          }
        }
      }
    } catch {
      throw new Error(`Invalid JSON-LD block: ${script.slice(0, 120)}`);
    }
  }

  return Array.from(types);
}

function hasMetaTag(html: string, attributeName: 'name' | 'property', attributeValue: string): boolean {
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attributeName}=["']${escapedValue}["'])(?=[^>]*\\bcontent=["'][^"']+["'])[^>]*>`,
    'i'
  );
  return pattern.test(html);
}

async function validateCheck(check: RenderedSeoCheck): Promise<void> {
  const url = `${BASE_URL}${check.path}`;
  const response = await fetchWithRetry(url, { redirect: 'follow' });
  assert(response.status === 200, `${check.name}: expected HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/html'), `${check.name}: response is not HTML`);

  const html = await response.text();
  const canonicalUrl = `${BASE_URL}${check.canonicalPath ?? check.path}`;
  const title = getTagContent(html, 'title');
  const description = getTagContent(html, 'description');
  const canonical = getTagContent(html, 'canonical');
  const robots = getTagContent(html, 'robots');
  const h1Text = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  const schemaTypes = extractJsonLdTypes(html);

  assert(title.includes(check.titleIncludes), `${check.name}: title missing "${check.titleIncludes}"`);
  assert(description.toLowerCase().includes(check.descriptionIncludes.toLowerCase()), `${check.name}: meta description missing "${check.descriptionIncludes}"`);
  if (check.h1Includes) {
    assert(h1Text.includes(check.h1Includes), `${check.name}: H1 "${h1Text}" missing "${check.h1Includes}"`);
  }
  assert(canonical === canonicalUrl, `${check.name}: canonical "${canonical}" does not match "${canonicalUrl}"`);
  assert(robots.includes('index') && robots.includes('follow') && !robots.includes('noindex'), `${check.name}: robots meta is not indexable`);
  assert((html.match(/rel=["']alternate["']\s+hreflang=/g) || []).length >= 10, `${check.name}: missing hreflang alternates`);

  for (const [attributeName, attributeValue] of requiredSocialMeta) {
    assert(
      hasMetaTag(html, attributeName, attributeValue),
      `${check.name}: missing social meta ${attributeName}="${attributeValue}"`
    );
  }

  for (const schemaType of check.schemaTypes) {
    assert(schemaTypes.includes(schemaType), `${check.name}: missing JSON-LD type ${schemaType}`);
  }

  for (const expected of check.bodyMustInclude || []) {
    assert(html.includes(expected), `${check.name}: body missing "${expected}"`);
  }

  for (const forbidden of check.bodyMustNotInclude || []) {
    assert(!html.includes(forbidden), `${check.name}: body contains forbidden text "${forbidden}"`);
  }
}

async function main(): Promise<void> {
  const failures: string[] = [];

  for (const check of checks) {
    try {
      await validateCheck(check);
      console.log(`OK  ${check.name} ${check.path}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.log(`FAIL ${check.name} ${check.path} -> ${message}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} rendered SEO checks failed. BASE_URL=${BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll rendered SEO checks passed. BASE_URL=${BASE_URL}`);
}

main().catch((error) => {
  console.error('Unexpected rendered SEO validation error:', error);
  process.exitCode = 1;
});
