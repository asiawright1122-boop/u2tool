import { describe, expect, it } from 'vitest';

import { buildLlmsContentFromMessages } from './llms-content-builder';

describe('llms content builder', () => {
  it.each(['en', 'zh'] as const)('keeps %s compact discovery short while linking the full catalog', (locale) => {
    const content = buildLlmsContentFromMessages(locale, {}, { isFull: false });
    expect(content.split('\n').length).toBeLessThan(350);
    expect(content).toContain('/llms-full.txt');
  });
  it('describes the current Cloudflare SSR delivery model', () => {
    const content = buildLlmsContentFromMessages('en', {});

    expect(content).toContain('Cloudflare SSR Astro site');
    expect(content).toContain('Cloudflare SSR with client-side interactive islands');
    expect(content).not.toContain('Static Astro site');
  });
});
