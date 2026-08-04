import { describe, expect, it } from 'vitest';
import { getGuide, getGuidesForLocale } from './guides';
import { guideSlugsForLocale } from './guides';
import { getToolBySlug } from '@/config/tools';
import { isIndexSuppressed } from './index-suppression';

const LATIN_DESC_MIN = 50;
const LATIN_DESC_MAX = 180;
const CJK_DESC_MIN = 40;
const CJK_DESC_MAX = 120;

describe('guides catalog', () => {
  it('exposes hand-written guides for supported locales', () => {
    expect(getGuidesForLocale('en').length).toBeGreaterThanOrEqual(2);
    expect(getGuidesForLocale('es').length).toBeGreaterThanOrEqual(2);
    expect(getGuidesForLocale('de').length).toBeGreaterThanOrEqual(2);
    expect(getGuidesForLocale('ru').length).toBeGreaterThanOrEqual(2);
    expect(getGuidesForLocale('ja').length).toBeGreaterThanOrEqual(2);
  });

  it('keeps slugs unique per locale and resolves lookups', () => {
    for (const locale of ['en', 'es', 'de', 'ru', 'ja'] as const) {
      const slugs = guideSlugsForLocale(locale);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) {
        expect(getGuide(slug, locale)).toBeDefined();
      }
      expect(getGuide('no-such-guide', locale)).toBeUndefined();
    }
  });

  it('publishes complete, TDK-safe copy per guide', () => {
    for (const locale of ['en', 'es', 'de', 'ru', 'ja'] as const) {
      const cjk = locale === 'ja';
      for (const guide of getGuidesForLocale(locale)) {
        expect(guide.title.length).toBeGreaterThan(8);
        const descriptionLength = guide.description.length;
        if (cjk) {
          expect(descriptionLength).toBeGreaterThanOrEqual(CJK_DESC_MIN);
          expect(descriptionLength).toBeLessThanOrEqual(CJK_DESC_MAX);
        } else {
          expect(descriptionLength).toBeGreaterThanOrEqual(LATIN_DESC_MIN);
          expect(descriptionLength).toBeLessThanOrEqual(LATIN_DESC_MAX);
        }
        expect(guide.sections.length).toBeGreaterThanOrEqual(2);
        for (const section of guide.sections) {
          expect(section.title.length).toBeGreaterThan(0);
          expect(section.paragraphs.length).toBeGreaterThan(0);
        }
        expect(guide.faqs.length).toBeGreaterThanOrEqual(2);
        for (const faq of guide.faqs) {
          expect(faq.question.length).toBeGreaterThan(0);
          expect(faq.answer.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('links only existing, indexable tool pages', () => {
    for (const locale of ['en', 'es', 'de', 'ru', 'ja'] as const) {
      for (const guide of getGuidesForLocale(locale)) {
        expect(guide.relatedTools.length).toBeGreaterThanOrEqual(2);
        for (const toolSlug of guide.relatedTools) {
          const tool = getToolBySlug(toolSlug);
          expect(tool, `related tool ${toolSlug} should exist`).toBeDefined();
          expect(
            isIndexSuppressed(locale, toolSlug),
            `related tool ${toolSlug} must be indexable in ${locale}`,
          ).toBe(false);
        }
      }
    }
  });
});
