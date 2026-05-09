import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { onRequest } from './middleware';

const originalCaches = globalThis.caches;

type MockCache = {
  match: Mock<(request: Request) => Promise<Response | undefined>>;
  put: Mock<(request: Request, response: Response) => Promise<void>>;
};

function installHtmlCache() {
  const store = new Map<string, Response>();
  const cache: MockCache = {
    match: vi.fn(async (request: Request) => store.get(request.url)?.clone()),
    put: vi.fn(async (request: Request, response: Response) => {
      store.set(request.url, response.clone());
    }),
  };

  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: {
      default: cache,
    },
  });

  return cache;
}

function restoreCaches() {
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: originalCaches,
  });
}

async function runMiddleware(
  request: Request,
  next = vi.fn(async () => new Response('<html>ok</html>', {
  headers: {
    'content-type': 'text/html; charset=utf-8',
  },
  })),
  locals: Record<string, unknown> = {}
) {
  const response = await onRequest(
    {
      locals,
      request,
    } as never,
    next as never
  ) as Response;

  return {
    next,
    response,
    text: await response.text(),
  };
}

afterEach(() => {
  restoreCaches();
});

describe('html edge cache middleware', () => {
  it('applies security headers to canonical redirects before route handling', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/en/tools/json-formatter'),
      next
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('/en/tools/json-formatter/');
    expect(response.headers.get('content-security-policy')).toBe("frame-ancestors 'none'");
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects no-slash localized HTML routes before route handling', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/en/tools/json-formatter'),
      next
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('/en/tools/json-formatter/');
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects legacy unlocalized site info pages before invalid-locale home matching', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/privacy/'),
      next
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('/en/privacy/');
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects known legacy GSC URL patterns without wildcarding unknown content', async () => {
    const next = vi.fn(async () => new Response('should not run'));

    const blog = await runMiddleware(
      new Request('https://www.u2tool.com/de/blog/qr-code-complete-guide'),
      next
    );
    const compare = await runMiddleware(
      new Request('https://www.u2tool.com/zh/compare/url-parser/dns-lookup'),
      next
    );
    const unknownBlog = await runMiddleware(
      new Request('https://www.u2tool.com/en/blog/unknown-post'),
      next
    );

    expect(blog.response.status).toBe(301);
    expect(blog.response.headers.get('location')).toBe('/de/tools/qr-generator/');
    expect(compare.response.status).toBe(301);
    expect(compare.response.headers.get('location')).toBe('/zh/tools/url-parser/');
    expect(unknownBlog.response.status).toBe(301);
    expect(unknownBlog.response.headers.get('location')).toBe('/en/blog/unknown-post/');
  });

  it('redirects localized site info pages and ranking pages to canonical routes', async () => {
    const next = vi.fn(async () => new Response('should not run'));

    const contact = await runMiddleware(
      new Request('https://www.u2tool.com/pt/contact'),
      next
    );
    const ranking = await runMiddleware(
      new Request('https://www.u2tool.com/ar/tools/ranking/popular'),
      next
    );

    expect(contact.response.status).toBe(301);
    expect(contact.response.headers.get('location')).toBe('/pt/contact/');
    expect(ranking.response.status).toBe(301);
    expect(ranking.response.headers.get('location')).toBe('/ar/tools/');
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects stale favicon ico requests to the canonical SVG asset', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/favicon.ico'),
      next
    );

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('/favicon.svg');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns gone for stale Next.js build assets before route handling', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response, text } = await runMiddleware(
      new Request('https://www.u2tool.com/_next/static/chunks/8182cba999306f4b.js?dpl=old'),
      next
    );

    expect(response.status).toBe(410);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(response.headers.get('cache-control')).toContain('max-age=86400');
    expect(response.headers.get('content-type')).toContain('text/plain');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(text).toBe('Gone');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns an empty gone response for HEAD requests to stale build assets', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response, text } = await runMiddleware(
      new Request('https://www.u2tool.com/dist/', { method: 'HEAD' }),
      next
    );

    expect(response.status).toBe(410);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(text).toBe('');
    expect(next).not.toHaveBeenCalled();
  });

  it('caches GET HTML responses and serves later requests from cache', async () => {
    const cache = installHtmlCache();
    const url = 'https://www.u2tool.com/ru/tools/json-formatter/';

    const first = await runMiddleware(new Request(url));
    expect(first.response.headers.get('x-u2tool-html-cache')).toBe('MISS');
    expect(first.response.headers.get('cache-control')).toContain('s-maxage=86400');
    expect(cache.put).toHaveBeenCalledTimes(1);
    expect(cache.put.mock.calls[0][0].url).toContain('__u2tool_html_cache=dev');

    const second = await runMiddleware(new Request(url));
    expect(second.response.headers.get('x-u2tool-html-cache')).toBe('HIT');
    expect(second.response.headers.get('content-security-policy')).toBe("frame-ancestors 'none'");
    expect(second.text).toBe('<html>ok</html>');
    expect(second.next).not.toHaveBeenCalled();
  });

  it('does not let a HEAD miss populate the shared GET cache', async () => {
    const cache = installHtmlCache();
    const url = 'https://www.u2tool.com/de/tools/sql-formatter/';

    const head = await runMiddleware(new Request(url, { method: 'HEAD' }));
    expect(head.response.headers.get('x-u2tool-html-cache')).toBe('MISS');
    expect(head.text).toBe('');
    expect(cache.put).not.toHaveBeenCalled();

    const get = await runMiddleware(new Request(url));
    expect(get.response.headers.get('x-u2tool-html-cache')).toBe('MISS');
    expect(get.text).toBe('<html>ok</html>');
  });

  it('bypasses cache storage for query-string pages', async () => {
    const cache = installHtmlCache();
    const { response } = await runMiddleware(new Request('https://www.u2tool.com/en/tools/?q=json'));

    expect(response.headers.get('x-u2tool-html-cache')).toBe('BYPASS');
    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });

  it('bypasses persistent cache storage for local preview requests', async () => {
    const cache = installHtmlCache();
    const { response } = await runMiddleware(new Request('http://127.0.0.1:4321/en/tools/'));

    expect(response.headers.get('x-u2tool-html-cache')).toBe('BYPASS');
    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });

  it('uses Astro v6 Cloudflare cfContext.waitUntil for background cache writes', async () => {
    const cache = installHtmlCache();
    const waitUntil = vi.fn((promise: Promise<unknown>) => {
      void promise;
    });

    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/en/tools/json-formatter/'),
      undefined,
      { cfContext: { waitUntil } }
    );

    expect(response.headers.get('x-u2tool-html-cache')).toBe('MISS');
    expect(cache.put).toHaveBeenCalledTimes(1);
    expect(waitUntil).toHaveBeenCalledTimes(1);
  });

  it('applies security headers to non-html responses without enabling html cache', async () => {
    const next = vi.fn(async () => new Response('{"ok":true}', {
      headers: { 'content-type': 'application/json' },
    }));

    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/api/ai-discovery/search?q=json'),
      next
    );

    expect(response.headers.get('content-security-policy')).toBe("frame-ancestors 'none'");
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('x-u2tool-html-cache')).toBeNull();
  });
});
