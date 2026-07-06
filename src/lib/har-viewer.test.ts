import { describe, expect, it } from 'vitest';
import { formatBytes, parseHarSummary } from './har-viewer';

describe('har viewer helper', () => {
  it('summarizes HAR entries by request, status, domain, bytes, and timing', () => {
    const result = parseHarSummary(JSON.stringify({
      log: {
        entries: [
          { request: { method: 'GET', url: 'https://example.com/app.js' }, response: { status: 200, content: { size: 1200 } }, time: 50 },
          { request: { method: 'POST', url: 'https://api.example.com/items' }, response: { status: 201, bodySize: 300 }, time: 220 },
          { request: { method: 'GET', url: 'https://example.com/missing' }, response: { status: 404, content: { size: 50 } }, time: 75 },
        ],
      },
    }));

    expect(result.valid).toBe(true);
    expect(result.summary).toMatchObject({
      requestCount: 3,
      totalBytes: 1550,
      totalTime: 345,
    });
    expect(result.summary?.statusGroups).toEqual({ '2xx': 2, '4xx': 1 });
    expect(result.summary?.domains).toEqual([
      { domain: 'example.com', count: 2, bytes: 1250 },
      { domain: 'api.example.com', count: 1, bytes: 300 },
    ]);
    expect(result.summary?.slowest[0].url).toBe('https://api.example.com/items');
  });

  it('rejects non-HAR JSON with a clear error', () => {
    const result = parseHarSummary('{"log":{"pages":[]}}');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('HAR log.entries must be an array.');
  });

  it('formats bytes compactly', () => {
    expect(formatBytes(950)).toBe('950 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
  });
});
