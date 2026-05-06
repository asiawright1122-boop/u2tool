import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ai discovery search api', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('@/lib/ai-discovery/feature-flag');
    vi.doUnmock('@/lib/ai-discovery/search-service');
  });

  it('returns 404 when ai discovery is disabled', async () => {
    const runDiscoverySearch = vi.fn();

    vi.doMock('@/lib/ai-discovery/feature-flag', () => ({
      isAiDiscoveryEnabled: () => false,
    }));
    vi.doMock('@/lib/ai-discovery/search-service', () => ({
      runDiscoverySearch,
    }));

    const { GET } = await import('../../pages/api/ai-discovery/search');
    const response = await GET({
      request: new Request('https://example.com/api/ai-discovery/search?locale=en&q=json'),
    } as never);

    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      error: 'FEATURE_DISABLED',
    });
    expect(runDiscoverySearch).not.toHaveBeenCalled();
  });

  it('runs search normally when ai discovery is enabled', async () => {
    const runDiscoverySearch = vi.fn().mockResolvedValue({
      query: 'json',
      normalizedQuery: 'json',
      matches: [],
      action: 'fallback',
      confidence: 0,
      error: null,
    });

    vi.doMock('@/lib/ai-discovery/feature-flag', () => ({
      isAiDiscoveryEnabled: () => true,
    }));
    vi.doMock('@/lib/ai-discovery/search-service', () => ({
      runDiscoverySearch,
    }));

    const { GET } = await import('../../pages/api/ai-discovery/search');
    const requestUrl = 'https://example.com/api/ai-discovery/search?locale=en&q=json';
    const response = await GET({
      request: new Request(requestUrl),
    } as never);

    expect(response.status).toBe(200);
    expect(runDiscoverySearch).toHaveBeenCalledWith({
      locale: 'en',
      query: 'json',
      maxResults: 8,
      assetBaseUrl: new URL(requestUrl),
    });
  });
});
