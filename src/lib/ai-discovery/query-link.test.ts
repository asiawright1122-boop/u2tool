import { describe, expect, it } from 'vitest';
import { buildAiDiscoveryLink } from './query-link';

describe('buildAiDiscoveryLink', () => {
  it('builds localized ai link with query', () => {
    expect(buildAiDiscoveryLink('en', 'convert json to csv')).toBe('/en/ai?q=convert%20json%20to%20csv');
  });

  it('trims whitespace safely', () => {
    expect(buildAiDiscoveryLink('zh', '  cron expression  ')).toBe('/zh/ai?q=cron%20expression');
  });

  it('encodes symbols correctly', () => {
    expect(buildAiDiscoveryLink('ja', 'json & yaml')).toBe('/ja/ai?q=json%20%26%20yaml');
  });

  it('returns base ai path for empty query', () => {
    expect(buildAiDiscoveryLink('en', '   ')).toBe('/en/ai');
  });
});
