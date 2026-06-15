import { describe, expect, it } from 'vitest';
import {
  createLegacyBuildAssetGoneResponse,
  isLegacyBuildAssetPath,
  isLegacyBuildAssetRequest,
} from './legacy-build-assets';

describe('legacy build asset responses', () => {
  it('detects old build asset prefixes only', () => {
    expect(isLegacyBuildAssetPath('/_next/static/chunks/old.js')).toBe(true);
    expect(isLegacyBuildAssetPath('/zh/_next/static/chunks/old.js')).toBe(true);
    expect(isLegacyBuildAssetPath('/dist/old.js')).toBe(true);
    expect(isLegacyBuildAssetPath('/de/dist/old.js')).toBe(true);
    expect(isLegacyBuildAssetPath('/_astro/current.css')).toBe(false);
  });

  it('limits middleware interception to safe crawl methods', () => {
    expect(isLegacyBuildAssetRequest(new Request('https://www.u2tool.com/_next/static/old.js'))).toBe(true);
    expect(isLegacyBuildAssetRequest(new Request('https://www.u2tool.com/_next/static/old.js', {
      method: 'POST',
    }))).toBe(false);
  });

  it('returns a cacheable noindex gone response with an empty HEAD body', async () => {
    const getResponse = createLegacyBuildAssetGoneResponse('GET');
    const headResponse = createLegacyBuildAssetGoneResponse('HEAD');

    expect(getResponse.status).toBe(410);
    expect(getResponse.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(getResponse.headers.get('x-frame-options')).toBe('DENY');
    expect(getResponse.headers.get('cache-control')).toContain('max-age=86400');
    expect(await getResponse.text()).toBe('Gone');
    expect(await headResponse.text()).toBe('');
  });

  it('covers file-like legacy asset URLs before Astro route matching', async () => {
    expect(isLegacyBuildAssetRequest(new Request('https://www.u2tool.com/_next/static/chunks/old.js'))).toBe(true);
    expect(isLegacyBuildAssetRequest(new Request('https://www.u2tool.com/dist/old.js'))).toBe(true);
  });
});
