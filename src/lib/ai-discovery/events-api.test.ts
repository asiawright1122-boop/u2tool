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
