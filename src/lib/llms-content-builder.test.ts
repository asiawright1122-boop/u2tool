import { describe, expect, it } from 'vitest';

import { buildLlmsContentFromMessages } from './llms-content-builder';

describe('llms content builder', () => {
  it('describes the current Cloudflare SSR delivery model', () => {
    const content = buildLlmsContentFromMessages('en', {});

    expect(content).toContain('Cloudflare SSR Astro site');
    expect(content).toContain('Cloudflare SSR with client-side interactive islands');
    expect(content).not.toContain('Static Astro site');
  });
});
