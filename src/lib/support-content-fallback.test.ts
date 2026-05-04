import { describe, expect, it } from 'vitest';
import { assessSupportContentTrust } from './content-trust.js';
import { buildSafeFallbackSupportContent } from './support-content-fallback';

function buildTrustReport(
  slug: string,
  locale: string,
  name: string
) {
  const fallback = buildSafeFallbackSupportContent(slug, name, locale);
  return assessSupportContentTrust({
    slug,
    locale,
    name,
    description: '',
    detailedDescription: fallback.detailedDescription,
    usageSteps: fallback.usageSteps,
    usageExamples: fallback.usageExamples,
    faqs: [],
  });
}

describe('buildSafeFallbackSupportContent', () => {
  it('returns a safe English fallback for image tools', () => {
    const fallback = buildSafeFallbackSupportContent('image-converter', 'Image Converter', 'en');
    const report = buildTrustReport('image-converter', 'en', 'Image Converter');

    expect(fallback.detailedDescription).toContain('Image Converter');
    expect(fallback.usageSteps.length).toBeGreaterThan(0);
    expect(report.blockSupportContent).toBe(false);
  });

  it('returns a safe localized chart fallback for Japanese chart pages', () => {
    const fallback = buildSafeFallbackSupportContent(
      'parallel-chart-generator',
      'Parallel Chart Generator',
      'ja'
    );
    const report = buildTrustReport('parallel-chart-generator', 'ja', 'Parallel Chart Generator');

    expect(fallback.detailedDescription).toContain('Parallel Chart Generator');
    expect(fallback.detailedDescription).toContain('ブラウザ');
    expect(report.blockSupportContent).toBe(false);
  });

  it('returns a safe localized generic fallback for Chinese non-chart pages', () => {
    const fallback = buildSafeFallbackSupportContent('favicon-generator', 'Favicon Generator', 'zh');
    const report = buildTrustReport('favicon-generator', 'zh', 'Favicon Generator');

    expect(fallback.detailedDescription).toContain('Favicon Generator');
    expect(fallback.detailedDescription).toContain('浏览器');
    expect(report.blockSupportContent).toBe(false);
  });
});
