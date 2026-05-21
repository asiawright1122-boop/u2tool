import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  handleDiscoveryEventsExport,
  handleDiscoveryEventsSubmit,
} from './lib/ai-discovery/events-handler';

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

describe('worker-compatible AI Discovery events handlers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.PUBLIC_AI_DISCOVERY_ENABLED;
  });

  it('accepts telemetry POST requests without relying on Astro route matching', async () => {
    process.env.PUBLIC_AI_DISCOVERY_ENABLED = 'true';
    const { entries, store } = createMemoryStore();
    const waitUntil = vi.fn((promise: Promise<unknown>) => promise);

    const response = await handleDiscoveryEventsSubmit(
      new Request('https://www.u2tool.com/api/ai-discovery/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [
            {
              name: 'query_submitted',
              locale: 'en',
              timestamp: '2026-05-21T00:00:00.000Z',
              query: 'json csv',
              action: 'fallback',
              confidence: 0.1,
            },
          ],
        }),
      }),
      { store, waitUntil }
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: 1 });
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0][0];
    expect(Array.from(entries.values()).join('')).toContain('query_submitted');
  });

  it('exports telemetry through the Worker-compatible handler', async () => {
    process.env.PUBLIC_AI_DISCOVERY_ENABLED = 'true';
    const { store } = createMemoryStore();
    await store.put(
      'ai-discovery/events/2026-05-21/example.ndjson',
      `${JSON.stringify({
        name: 'fallback_viewed',
        locale: 'en',
        timestamp: '2026-05-21T00:00:00.000Z',
        query: 'missing tool',
        action: 'fallback',
      })}\n`
    );

    const response = await handleDiscoveryEventsExport(
      new Request('https://www.u2tool.com/api/ai-discovery/events/?limit=10', {
        headers: { 'x-ai-discovery-export-token': 'secret' },
      }),
      { store, exportToken: 'secret' }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/x-ndjson');
    expect(await response.text()).toContain('fallback_viewed');
  });
});
