import { describe, expect, it } from 'vitest';
import {
  resolveLegacyBlogRedirect,
  resolveLegacyComparePairRedirect,
  resolveLegacyUnlocalizedBlogRedirect,
  resolveLegacyUnlocalizedComparePairRedirect,
  resolveUnlocalizedSiteInfoRedirect,
} from './legacy-redirects';

describe('legacy redirects', () => {
  it('maps known localized blog slugs to canonical pages', () => {
    expect(resolveLegacyBlogRedirect('ru', 'regex-complete-guide')).toBe('/ru/tools/regex-tester/');
    expect(resolveLegacyBlogRedirect('ja', 'jwt-tokens-explained')).toBe('/ja/compare/choose-jwt-tool/');
    expect(resolveLegacyBlogRedirect('xx', 'regex-complete-guide')).toBeNull();
    expect(resolveLegacyBlogRedirect('en', 'unknown-post')).toBeNull();
  });

  it('maps old unlocalized blog slugs to English canonical pages', () => {
    expect(resolveLegacyUnlocalizedBlogRedirect('base64-encoding-explained')).toBe('/en/tools/base64/');
  });

  it('maps old compare pair URLs without redirecting arbitrary pairs', () => {
    expect(resolveLegacyComparePairRedirect('zh', 'image-border', 'image-splitter')).toBe('/zh/compare/choose-image-tool/');
    expect(resolveLegacyComparePairRedirect('en', 'css-animation-generator', 'uuid-generator')).toBe('/en/tools/css-animation-generator/');
    expect(resolveLegacyComparePairRedirect('en', 'json-formatter', 'uuid-generator')).toBeNull();
  });

  it('maps old unlocalized compare pairs to English canonical pages', () => {
    expect(resolveLegacyUnlocalizedComparePairRedirect('grouped-bar-chart-generator', 'area-chart-generator')).toBe('/en/compare/choose-chart-type/');
  });

  it('redirects legacy unlocalized site info pages only', () => {
    expect(resolveUnlocalizedSiteInfoRedirect('privacy')).toBe('/en/privacy/');
    expect(resolveUnlocalizedSiteInfoRedirect('contact')).toBe('/en/contact/');
    expect(resolveUnlocalizedSiteInfoRedirect('pricing')).toBeNull();
  });
});
