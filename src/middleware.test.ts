import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { MEMORY_CACHE } from './lib/gsc-recovery-redirects';

vi.mock('cloudflare:workers', () => ({
  env: {},
}));

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
    expect(unknownBlog.response.headers.get('location')).toBe('/en/tools/');
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
    expect(response.headers.get('cache-control')).toBe('public, max-age=86400, s-maxage=86400');
    expect(response.headers.get('content-type')).toContain('text/plain');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(text).toBe('Gone');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns gone for stale Next.js build assets with locale prefix before route handling', async () => {
    const next = vi.fn(async () => new Response('should not run'));
    const { response, text } = await runMiddleware(
      new Request('https://www.u2tool.com/zh/_next/static/chunks/8182cba999306f4b.js?dpl=old'),
      next
    );

    expect(response.status).toBe(410);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
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

  it('bypasses persistent cache storage while Astro prerenders static routes', async () => {
    const cache = installHtmlCache();
    const response = await onRequest(
      {
        isPrerendered: true,
        locals: {},
        request: new Request('https://www.u2tool.com/en/categories/encoding/'),
      } as never,
      vi.fn(async () => new Response('<html>fresh prerender</html>', {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      })) as never
    ) as Response;

    expect(response.headers.get('x-u2tool-html-cache')).toBe('BYPASS');
    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
    expect(await response.text()).toBe('<html>fresh prerender</html>');
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

  it('does not redirect API routes through localized canonical handling', async () => {
    const next = vi.fn(async () => new Response('{"ok":true}', {
      headers: { 'content-type': 'application/json' },
    }));

    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/api/ai-discovery/events/?limit=10'),
      next
    );

    expect(response.status).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.headers.get('location')).toBeNull();
  });

  it('redirects tools requests containing category search param to canonical category path', async () => {
    const next = vi.fn(async () => new Response('should not run'));

    // 1. Unlocalized path with category
    const { response: res1 } = await runMiddleware(
      new Request('https://www.u2tool.com/tools/?category=math'),
      next
    );
    expect(res1.status).toBe(301);
    expect(res1.headers.get('location')).toBe('/en/categories/math/');

    // 2. Localized path with category (zh)
    const { response: res2 } = await runMiddleware(
      new Request('https://www.u2tool.com/zh/tools?category=encoding'),
      next
    );
    expect(res2.status).toBe(301);
    expect(res2.headers.get('location')).toBe('/zh/categories/encoding/');

    // 3. Localized path with category and other params
    const { response: res3 } = await runMiddleware(
      new Request('https://www.u2tool.com/en/tools/?category=math&q=word'),
      next
    );
    expect(res3.status).toBe(301);
    expect(res3.headers.get('location')).toBe('/en/categories/math/?q=word');

    expect(next).not.toHaveBeenCalled();
  });

  it('excludes static translation bundles (/messages/*) from trailing slash redirection', async () => {
    const next = vi.fn(async () => new Response('{"welcome":"Welcome"}', {
      headers: { 'content-type': 'application/json' }
    }));

    const { response } = await runMiddleware(
      new Request('https://www.u2tool.com/messages/en.json'),
      next
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it('redirects unmapped legacy blog posts to tools root page', async () => {
    const next = vi.fn(async () => new Response('should not run'));

    const unlocalized = await runMiddleware(
      new Request('https://www.u2tool.com/blog/unmapped-post'),
      next
    );
    const localized = await runMiddleware(
      new Request('https://www.u2tool.com/zh/blog/unmapped-post'),
      next
    );

    expect(unlocalized.response.status).toBe(301);
    expect(unlocalized.response.headers.get('location')).toBe('/en/tools/');

    expect(localized.response.status).toBe(301);
    expect(localized.response.headers.get('location')).toBe('/zh/tools/');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns gone (410) with noindex for decommissioned compare and category routes', async () => {
    const next = vi.fn(async () => new Response('should not run'));

    const compareUnloc = await runMiddleware(
      new Request('https://www.u2tool.com/tools/compare/url-parser/dns-lookup'),
      next
    );
    const compareLoc = await runMiddleware(
      new Request('https://www.u2tool.com/en/tools/compare/url-parser/dns-lookup'),
      next
    );
    const categoryUnloc = await runMiddleware(
      new Request('https://www.u2tool.com/tools/categories/encoding'),
      next
    );
    const categoryLoc = await runMiddleware(
      new Request('https://www.u2tool.com/en/tools/categories/encoding'),
      next
    );

    for (const res of [compareUnloc, compareLoc, categoryUnloc, categoryLoc]) {
      expect(res.response.status).toBe(410);
      expect(res.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
      expect(res.response.headers.get('cache-control')).toBe('public, max-age=86400, s-maxage=86400');
      expect(res.next).not.toHaveBeenCalled();
    }
  });

  describe('root route redirection and loopback guard', () => {
    it('redirects bare root requests to default locale prefix', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/'),
        next
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/');
      expect(next).not.toHaveBeenCalled();
    });

    it('preserves query parameters on root redirect', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/?utm_source=newsletter&utm_medium=email'),
        next
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/?utm_source=newsletter&utm_medium=email');
      expect(next).not.toHaveBeenCalled();
    });

    it('redirects root requests on localhost under local preview conditions', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const { response } = await runMiddleware(
        new Request('http://localhost:4321/'),
        next
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/');
      expect(next).not.toHaveBeenCalled();
    });

    it('bypasses root redirect if cf-worker header is present', async () => {
      const next = vi.fn(async () => new Response('<html>ok</html>'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/', {
          headers: { 'cf-worker': 'true' },
        }),
        next
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('bypasses root redirect if x-worker-loopback header is present', async () => {
      const next = vi.fn(async () => new Response('<html>ok</html>'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/', {
          headers: { 'x-worker-loopback': 'true' },
        }),
        next
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('bypasses root redirect if loopback User-Agent is present', async () => {
      const next = vi.fn(async () => new Response('<html>ok</html>'));

      const useragents = ['Cloudflare-Workers', 'u2tool-loopback', 'astro-engine'];
      for (const ua of useragents) {
        const { response } = await runMiddleware(
          new Request('https://www.u2tool.com/', {
            headers: { 'user-agent': `Mozilla/5.0 (${ua})` },
          }),
          next
        );
        expect(response.status).toBe(200);
        expect(response.headers.get('location')).toBeNull();
      }
      expect(next).toHaveBeenCalledTimes(useragents.length);
    });

    it('does not redirect non-GET/HEAD requests to root', async () => {
      const next = vi.fn(async () => new Response('<html>ok</html>'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/', { method: 'POST' }),
        next
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('GSC recovery redirects', () => {
    beforeEach(() => {
      MEMORY_CACHE.clear();
    });

    it('redirects GSC excluded URLs to their new routes with 301 status', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/typing-test'),
        next
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/tools/typing-speed-test/');
      expect(next).not.toHaveBeenCalled();
    });

    it('preserves locale in GSC recovery redirects', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/zh/calculator/calorie'),
        next
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/zh/tools/calorie-calculator/');
      expect(next).not.toHaveBeenCalled();
    });

    it('preserves query parameters on recovery redirect', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/calculator/mortgage?ref=gsc&utm_medium=organic'),
        next
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/tools/mortgage-calculator/?ref=gsc&utm_medium=organic');
      expect(next).not.toHaveBeenCalled();
    });

    it('bypasses redirect if target route is identical to current route to prevent loops', async () => {
      const next = vi.fn(async () => new Response('<html>ok</html>'));
      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/en/tools/typing-speed-test/'),
        next
      );

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('redirects via Cloudflare KV when matching key exists', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const mockKv = {
        get: vi.fn(async (key: string) => {
          if (key === 'gsc-recovery-rules') {
            return JSON.stringify({
              '/dynamic-old-path': '/tools/dynamic-new-target',
            });
          }
          return null;
        }),
      };

      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/dynamic-old-path'),
        next,
        {
          runtime: {
            env: {
              GSC_REDIRECTS: mockKv,
            },
          },
        }
      );

      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/tools/dynamic-new-target/');
      expect(mockKv.get).toHaveBeenCalledWith('gsc-recovery-rules');
    });

    it('utilizes in-memory cache to prevent redundant KV lookups', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const mockKv = {
        get: vi.fn(async () => JSON.stringify({
          '/cache-test-path': '/tools/cached-target',
        })),
      };

      // First request (hits KV)
      const res1 = await runMiddleware(
        new Request('https://www.u2tool.com/cache-test-path'),
        next,
        {
          runtime: {
            env: {
              GSC_REDIRECTS: mockKv,
            },
          },
        }
      );
      expect(res1.response.status).toBe(301);
      expect(res1.response.headers.get('location')).toBe('/en/tools/cached-target/');

      // Second request (should hit memory cache instead of KV)
      const res2 = await runMiddleware(
        new Request('https://www.u2tool.com/cache-test-path'),
        next,
        {
          runtime: {
            env: {
              GSC_REDIRECTS: mockKv,
            },
          },
        }
      );
      expect(res2.response.status).toBe(301);
      expect(res2.response.headers.get('location')).toBe('/en/tools/cached-target/');
      
      // KV get should only be called once
      expect(mockKv.get).toHaveBeenCalledTimes(1);
    });

    it('falls back gracefully to static JSON redirects on KV error', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const mockKv = {
        get: vi.fn(async () => {
          throw new Error('KV storage failure');
        }),
      };

      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/typing-test'),
        next,
        {
          runtime: {
            env: {
              GSC_REDIRECTS: mockKv,
            },
          },
        }
      );

      // Should fall back to static mapping in gsc-redirects.json
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/tools/typing-speed-test/');
      expect(mockKv.get).toHaveBeenCalledWith('gsc-recovery-rules');
    });

    it('falls back gracefully to static JSON redirects on JSON parse error', async () => {
      const next = vi.fn(async () => new Response('should not run'));
      const mockKv = {
        get: vi.fn(async () => 'invalid-json-string{]'),
      };

      const { response } = await runMiddleware(
        new Request('https://www.u2tool.com/typing-test'),
        next,
        {
          runtime: {
            env: {
              GSC_REDIRECTS: mockKv,
            },
          },
        }
      );

      // Should fall back to static mapping in gsc-redirects.json
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('/en/tools/typing-speed-test/');
      expect(mockKv.get).toHaveBeenCalledWith('gsc-recovery-rules');
    });
  });
});

