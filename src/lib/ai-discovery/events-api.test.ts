import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ai discovery events api', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('@/lib/ai-discovery/feature-flag');
  });

  async function loadPostRoute() {
    vi.doMock('@/lib/ai-discovery/feature-flag', () => ({
      isAiDiscoveryEnabled: () => true,
    }));

    const route = await import('../../pages/api/ai-discovery/events');
    return route.POST;
  }

  async function loadGetRoute() {
    vi.doMock('@/lib/ai-discovery/feature-flag', () => ({
      isAiDiscoveryEnabled: () => true,
    }));

    const route = await import('../../pages/api/ai-discovery/events');
    return route.GET;
  }

  function createMemoryStore() {
    const entries = new Map<string, string>();

    return {
      entries,
      store: {
        async list({ prefix = '' } = {}) {
          return {
            keys: Array.from(entries.keys())
              .filter((name) => name.startsWith(prefix))
              .sort()
              .map((name) => ({ name })),
            list_complete: true,
          };
        },
        async get(key: string) {
          return entries.get(key) ?? null;
        },
        async put(key: string, value: string) {
          entries.set(key, value);
        },
      },
    };
  }

  it('accepts a valid bounded telemetry payload', async () => {
    const POST = await loadPostRoute();
    const response = await POST({
      request: new Request('https://example.com/api/ai-discovery/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [
            {
              name: 'query_submitted',
              locale: 'en',
              timestamp: new Date().toISOString(),
              query: 'convert json to csv',
              action: 'direct',
              confidence: 0.9,
            },
          ],
        }),
      }),
    } as never);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: 1 });
  });

  it('persists valid telemetry payloads when a store binding exists', async () => {
    const POST = await loadPostRoute();
    const { entries, store } = createMemoryStore();
    const waitUntil = vi.fn((promise: Promise<unknown>) => promise);
    const response = await POST({
      locals: {
        runtime: {
          env: {
            AI_DISCOVERY_TELEMETRY: store,
          },
          ctx: {
            waitUntil,
          },
        },
      },
      request: new Request('https://example.com/api/ai-discovery/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [
            {
              name: 'fallback_viewed',
              locale: 'en',
              timestamp: '2026-05-21T00:00:00.000Z',
              query: 'unknown converter',
              action: 'fallback',
              confidence: 0.1,
            },
          ],
        }),
      }),
    } as never);

    expect(response.status).toBe(202);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0][0];
    expect(Array.from(entries.values()).join('')).toContain('fallback_viewed');
  });

  it('exports persisted telemetry as token-protected NDJSON', async () => {
    const GET = await loadGetRoute();
    const { store } = createMemoryStore();
    await store.put(
      'ai-discovery/events/2026-05-21/example.ndjson',
      `${JSON.stringify({
        name: 'query_submitted',
        locale: 'en',
        timestamp: '2026-05-21T00:00:00.000Z',
        query: 'json csv',
      })}\n`
    );

    const response = await GET({
      locals: {
        runtime: {
          env: {
            AI_DISCOVERY_TELEMETRY: store,
            AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN: 'secret',
          },
        },
      },
      request: new Request('https://example.com/api/ai-discovery/events?date=2026-05-21&limit=10', {
        headers: {
          'x-ai-discovery-export-token': 'secret',
        },
      }),
    } as never);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/x-ndjson');
    expect(response.headers.get('x-ai-discovery-event-count')).toBe('1');
    expect(await response.text()).toContain('query_submitted');
  });

  it('rejects telemetry export without the configured token', async () => {
    const GET = await loadGetRoute();
    const { store } = createMemoryStore();
    const response = await GET({
      locals: {
        runtime: {
          env: {
            AI_DISCOVERY_TELEMETRY: store,
            AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN: 'secret',
          },
        },
      },
      request: new Request('https://example.com/api/ai-discovery/events'),
    } as never);

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      error: 'UNAUTHORIZED',
    });
  });

  it('rejects oversized telemetry payloads before parsing JSON', async () => {
    const POST = await loadPostRoute();
    const response = await POST({
      request: new Request('https://example.com/api/ai-discovery/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [
            {
              name: 'query_submitted',
              locale: 'en',
              timestamp: new Date().toISOString(),
              query: 'x'.repeat(20_000),
            },
          ],
        }),
      }),
    } as never);

    expect(response.status).toBe(413);
    expect(await response.json()).toMatchObject({
      error: 'PAYLOAD_TOO_LARGE',
    });
  });

  it('rejects payloads with no valid telemetry events', async () => {
    const POST = await loadPostRoute();
    const response = await POST({
      request: new Request('https://example.com/api/ai-discovery/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [
            {
              name: 'result_clicked',
              locale: 'xx',
              timestamp: 'nope',
              toolSlug: 'javascript:alert(1)',
            },
          ],
        }),
      }),
    } as never);

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'NO_VALID_EVENTS',
    });
  });
});
