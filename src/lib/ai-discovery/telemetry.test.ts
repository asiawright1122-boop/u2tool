import { describe, expect, it } from 'vitest';
import {
  buildDiscoveryEvent,
  isValidDiscoveryEvent,
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
});
