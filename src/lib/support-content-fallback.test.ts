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

describe('assessSupportContentTrust', () => {
  it('blocks high-confidence Word Counter implementation overclaims', () => {
    const report = assessSupportContentTrust({
      slug: 'word-counter',
      locale: 'en',
      name: 'Word Counter',
      description: '',
      detailedDescription:
        'The tool backend processes text streams using finite-state automata and a Web Workers implementation.',
      usageSteps: ['Review sentence boundaries identified via Punkt algorithm.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'word-counter-backend-automata',
        'web-workers-claim',
        'punkt-algorithm-claim',
      ])
    );
  });

  it('keeps scoped rules from blocking unrelated tools', () => {
    const report = assessSupportContentTrust({
      slug: 'timezone-converter',
      locale: 'en',
      name: 'Timezone Converter',
      description: '',
      detailedDescription:
        'The tool uses timezone data and exposes dual timezone selectors for quick planning.',
      usageSteps: ['Adjust the quality slider when exporting an image in a different workflow.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(false);
  });
});
