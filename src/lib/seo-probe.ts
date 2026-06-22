/**
 * Shared SEO/HTML probe helpers.
 *
 * Single source of truth for live-HTML fetching, probe header construction,
 * and `<title>` / `<meta name="description">` / `<link rel="canonical">` /
 * `<meta name="robots">` extraction. Consumed by both
 * `scripts/validation/validate-rendered-seo.ts` and
 * `scripts/validation/validate-tdk-drift.ts` so the two live-probing
 * validators never drift apart (mirrors the Phase 76
 * `safety-patterns.ts` extraction precedent).
 *
 * Extraction is intentionally regex-based (no cheerio / no DOM): the site
 * is SSR'd, the head structure is predictable, and keeping a zero-dependency
 * pure extractor makes the comparator trivially unit-testable.
 */

/**
 * Chrome Desktop User-Agent used by all production probes.
 * Reused across validate-live-redirects, validate-tdk-drift, and any
 * future probe so they share one identity string.
 */
export const CHROME_DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Build HTTP headers for a production probe request.
 * Injects the Chrome Desktop UA and an optional WAF bypass token.
 */
export function buildProbeHeaders(bypassToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': CHROME_DESKTOP_UA,
  };

  if (bypassToken) {
    headers['x-waf-bypass-token'] = bypassToken;
  }

  return headers;
}

/**
 * Fetch a URL and return both the raw Response and the decoded HTML body.
 *
 * Retries on network error with a linear `attempt * 750ms` backoff (up to
 * `attempts` tries). HTTP error statuses are NOT retried here — callers
 * decide whether a non-2xx status is a failure for their use case.
 */
export async function fetchHtmlWithRetry(
  url: string,
  init: RequestInit = {},
  attempts = 4
): Promise<{ html: string; response: Response }> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, init);
      const html = await response.text();
      return { response, html };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw lastError;
}

/**
 * Extract the inner text/content of a head tag from raw HTML.
 *
 * Returns an empty string when the tag is absent — never throws. The
 * `description` / `canonical` / `robots` selectors parse the matched tag's
 * `content` / `href` attribute respectively.
 */
export function getTagContent(
  html: string,
  selector: 'title' | 'description' | 'canonical' | 'robots'
): string {
  if (selector === 'title') {
    return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
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

// ---------------------------------------------------------------------------
// Phase 81: OG / Twitter / Keywords / JSON-LD extractors
// ---------------------------------------------------------------------------

/**
 * Extract `<meta property="og:title" content="...">` from raw HTML.
 *
 * Returns empty string when absent. Regex-based, zero-dependency.
 */
export function getOgTitle(html: string): string {
  const tag = html.match(/<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

/**
 * Extract `<meta name="twitter:title" content="...">` from raw HTML.
 *
 * Returns empty string when absent. Regex-based, zero-dependency.
 */
export function getTwitterTitle(html: string): string {
  const tag = html.match(/<meta\b(?=[^>]*\bname=["']twitter:title["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

/**
 * Extract `<meta name="keywords" content="...">` from raw HTML.
 *
 * Returns empty string when absent. Regex-based, zero-dependency.
 */
export function getKeywords(html: string): string {
  const tag = html.match(/<meta\b(?=[^>]*\bname=["']keywords["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

/**
 * Extract all JSON-LD blocks from raw HTML and parse them as JSON.
 *
 * Matches `<script type="application/ld+json">...</script>` tags.
 * Returns an array of parsed objects (empty when none found). Malformed
 * JSON blocks are silently skipped.
 *
 * Regex-based extraction, `JSON.parse` for deserialization — no DOM dependency.
 */
export function extractJsonLdBlocks(html: string): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  const re = /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed && typeof parsed === 'object') {
        blocks.push(parsed as Record<string, unknown>);
      }
    } catch {
      // Silently skip malformed JSON-LD blocks
    }
  }
  return blocks;
}
