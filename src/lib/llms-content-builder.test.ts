import { describe, expect, it } from 'vitest';

import { aiRecoveryRoutes } from '../config/ai-recovery-routes';
import { isIndexSuppressed } from './index-suppression';
import { buildLlmsContentFromMessages } from './llms-content-builder';

describe('llms content builder', () => {
  it('lists only currently indexable AI recovery routes', () => {
    // A configured route that later becomes noindex would silently vanish from
    // /llms-full.txt while still being advertised in the curated list. Fail
    // here instead so the route is retired in src/config/ai-recovery-routes.ts
    // with the evidence that shelved it.
    const suppressed = aiRecoveryRoutes.filter((route) =>
      isIndexSuppressed(route.locale, route.slug)
    );
    expect(suppressed).toEqual([]);
    expect(aiRecoveryRoutes.length).toBeGreaterThan(0);
  });
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
