import { describe, expect, it, vi } from 'vitest';
import {
  buildDiscoveryEvent,
  isValidDiscoveryEvent,
  sendDiscoveryEvents,
} from './telemetry';

describe('ai discovery telemetry', () => {
  it('builds a valid query_submitted event', () => {
    const event = buildDiscoveryEvent({
      name: 'query_submitted',
      locale: 'en',
      query: 'convert json to csv',
      action: 'direct',
    });

    expect(event).not.toBeNull();
    expect(event?.name).toBe('query_submitted');
    expect(event?.query).toBe('convert json to csv');
    expect(event?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(isValidDiscoveryEvent(event)).toBe(true);
  });

  it('rejects invalid result_clicked payload', () => {
    const event = buildDiscoveryEvent({
      name: 'result_clicked',
      locale: 'en',
      query: 'cron',
      action: 'suggest',
    });

    expect(event).toBeNull();
  });

  it('rejects unknown event names', () => {
    const event = buildDiscoveryEvent({
      name: 'anything_else' as never,
      locale: 'en',
    });
    expect(event).toBeNull();
  });

  it('rejects malformed telemetry fields before they reach the API', () => {
    expect(buildDiscoveryEvent({
      name: 'query_submitted',
      locale: 'xx',
    })).toBeNull();

    expect(isValidDiscoveryEvent({
      name: 'query_submitted',
      locale: 'en',
      timestamp: 'not-a-date',
    })).toBe(false);

    expect(isValidDiscoveryEvent({
      name: 'query_submitted',
      locale: 'en',
      timestamp: new Date().toISOString(),
      query: 'x'.repeat(301),
    })).toBe(false);

    expect(isValidDiscoveryEvent({
      name: 'result_clicked',
      locale: 'en',
      timestamp: new Date().toISOString(),
      toolSlug: 'javascript:alert(1)',
    })).toBe(false);

    expect(isValidDiscoveryEvent({
      name: 'query_submitted',
      locale: 'en',
      timestamp: new Date().toISOString(),
      confidence: 2,
    })).toBe(false);
  });

  it('posts telemetry to the canonical trailing-slash endpoint', async () => {
    const previousFlag = process.env.PUBLIC_AI_DISCOVERY_ENABLED;
    process.env.PUBLIC_AI_DISCOVERY_ENABLED = 'true';
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('navigator', {});

    const ok = await sendDiscoveryEvents([
      {
        name: 'query_submitted',
        locale: 'en',
        timestamp: new Date().toISOString(),
        query: 'json',
      },
    ]);

    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/ai-discovery/events/',
      expect.objectContaining({ method: 'POST' })
    );

    if (previousFlag === undefined) {
      delete process.env.PUBLIC_AI_DISCOVERY_ENABLED;
    } else {
      process.env.PUBLIC_AI_DISCOVERY_ENABLED = previousFlag;
    }
    vi.unstubAllGlobals();
  });
});
