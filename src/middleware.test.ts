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

async function runMiddleware(request: Request, next = vi.fn(async () => new Response('<html>ok</html>', {
  headers: {
    'content-type': 'text/html; charset=utf-8',
  },
}))) {
  const response = await onRequest(
    {
      locals: {},
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
  it('caches GET HTML responses and serves later requests from cache', async () => {
    const cache = installHtmlCache();
    const url = 'https://www.u2tool.com/ru/tools/json-formatter/';

    const first = await runMiddleware(new Request(url));
    expect(first.response.headers.get('x-u2tool-html-cache')).toBe('MISS');
    expect(first.response.headers.get('cache-control')).toContain('s-maxage=86400');
    expect(cache.put).toHaveBeenCalledTimes(1);

    const second = await runMiddleware(new Request(url));
    expect(second.response.headers.get('x-u2tool-html-cache')).toBe('HIT');
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
});
