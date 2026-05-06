import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  createTranslator,
  loadBaseMessages,
  loadBaseUiMessages,
  loadToolMessages,
  loadToolPageMessages,
} from './translations';

function readSplitToolMessages(slug: string): Record<string, unknown> {
  return JSON.parse(readFileSync(new URL(`../messages/en/tools/${slug}.json`, import.meta.url), 'utf-8'));
}

function readAggregateToolMessages(slug: string): Record<string, unknown> {
  const aggregate = JSON.parse(readFileSync(new URL('../messages/en.json', import.meta.url), 'utf-8'));
  return aggregate.tools[slug] as Record<string, unknown>;
}

const splitSupportKeys = ['detailed_description', 'usage_steps', 'usage_examples', 'faqs'];
const toolDetailPageSource = readFileSync(
  fileURLToPath(new URL('../pages/[locale]/tools/[slug].astro', import.meta.url)),
  'utf-8'
);
const homePageSource = readFileSync(
  fileURLToPath(new URL('../pages/[locale]/index.astro', import.meta.url)),
  'utf-8'
);
const toolsPageSource = readFileSync(
  fileURLToPath(new URL('../pages/[locale]/tools.astro', import.meta.url)),
  'utf-8'
);
const llmsPageSource = readFileSync(
  fileURLToPath(new URL('../pages/llms.txt.ts', import.meta.url)),
  'utf-8'
);

describe('translations module', () => {
  describe('createTranslator', () => {
    const translations = {
      name: 'JSON Formatter',
      description: 'Format and beautify JSON data',
      seo_title: 'Free JSON Formatter Online',
      nested: {
        key: 'nested value',
        deep: {
          value: 'deep nested value',
        },
      },
      usage_steps: ['Step 1', 'Step 2', 'Step 3'],
    };

    const t = createTranslator(translations);

    it('should resolve top-level keys', () => {
      expect(t('name')).toBe('JSON Formatter');
      expect(t('description')).toBe('Format and beautify JSON data');
    });

    it('should resolve dot-notation nested keys', () => {
      expect(t('nested.key')).toBe('nested value');
      expect(t('nested.deep.value')).toBe('deep nested value');
    });

    it('should return MISSING message for non-existent keys', () => {
      expect(t('nonexistent')).toBe('MISSING: nonexistent');
      expect(t('nested.nonexistent')).toBe('MISSING: nested.nonexistent');
    });

    it('should return fallback for non-existent keys when provided', () => {
      expect(t('nonexistent', 'Default')).toBe('Default');
      expect(t('nested.missing', 'Fallback')).toBe('Fallback');
    });

    it('should return MISSING for array values without fallback', () => {
      expect(t('usage_steps')).toBe('MISSING: usage_steps');
    });

    it('should return fallback for array values when provided', () => {
      expect(t('usage_steps', 'Steps')).toBe('Steps');
    });

    it('should handle empty translations object', () => {
      const emptyT = createTranslator({});
      expect(emptyT('anything')).toBe('MISSING: anything');
      expect(emptyT('anything', 'fallback')).toBe('fallback');
    });
  });

  describe('message loading', () => {
    it('loads localized base messages instead of falling back to English', async () => {
      const zhMessages = await loadBaseMessages('zh');

      expect((zhMessages.nav as Record<string, string>).home).toBe('首页');
      expect((zhMessages.search as Record<string, string>).placeholder).toBe('搜索工具...');
      expect((zhMessages.home as Record<string, unknown>).popular).toBe('热门工具');
    });

    it('loads localized tool messages with locale-specific SEO copy', async () => {
      const zhToolMessages = await loadToolMessages('zh', 'json-formatter');

      expect(zhToolMessages.name).not.toBe('JSON Formatter');
      expect(typeof zhToolMessages.seo_title).toBe('string');
    });

    it('loads lightweight base UI messages without losing shared labels', async () => {
      const ruMessages = await loadBaseUiMessages('ru');

      expect((ruMessages.nav as Record<string, string>).home).toBe('Главная');
      expect((ruMessages.categories as Record<string, string>).development).toBeTruthy();
      expect((ruMessages.tools as Record<string, Record<string, string>>)['json-formatter']?.name)
        .toContain('JSON');
    });

    it('loads tool page messages from compact metadata plus split support copy', async () => {
      const splitJsonFormatter = JSON.parse(
        readFileSync(new URL('../messages/ru/tools/json-formatter.json', import.meta.url), 'utf-8')
      ) as Record<string, unknown>;
      const jsonFormatterMessages = await loadToolPageMessages('ru', 'json-formatter');

      expect(jsonFormatterMessages.name).not.toBe('JSON Formatter');
      expect(typeof jsonFormatterMessages.seo_title).toBe('string');
      expect(jsonFormatterMessages.detailed_description).toBe(splitJsonFormatter.detailed_description);
      expect(jsonFormatterMessages.usage_steps).toEqual(splitJsonFormatter.usage_steps);
    });

    it('deep merges base and root locale namespaces so seo defaults do not disappear', async () => {
      const jaMessages = await loadBaseMessages('ja');
      const categoriesSeo = jaMessages.categories_seo as Record<string, Record<string, string>>;

      expect(categoriesSeo.converters.seo_title.toLowerCase()).toContain('pdf');
      expect(categoriesSeo.security.seo_title.toLowerCase()).toContain('jwt');
    });

    it('fills missing locale keys with English fallback to prevent runtime MISSING labels', async () => {
      const jaMessages = await loadBaseMessages('ja');
      const search = jaMessages.search as Record<string, string>;
      const tools = jaMessages.tools as Record<string, Record<string, string>>;

      expect(search.placeholder).toBe('Search tools...');
      expect(search.noResults).toBe('No tools found');
      expect(tools['bar-chart-generator']?.addCategory).toBe('Add Category');
    });

    it('fills missing locale tool-detail keys with English fallback', async () => {
      const jaToolMessages = await loadToolMessages('ja', 'venn-diagram-generator');

      expect(jaToolMessages.setCount).toBe('Number of Sets');
      expect(jaToolMessages.chartTitle).toBe('Chart Title');
    });

    it('restores JWT decoder/debugger base metadata from the legacy tool index before alias fallback', async () => {
      const enMessages = await loadBaseMessages('en');
      const tools = enMessages.tools as Record<string, Record<string, string>>;

      expect(tools['jwt-decoder']?.name).toBe('JWT Decoder');
      expect(tools['jwt-decoder']?.seo_description).toContain('without verification');
      expect(tools['jwt-debugger']?.name).toBe('JWT Debugger');
      expect(tools['jwt-debugger']?.seo_description).toContain('does not verify token authenticity');
    });

    it('prefers split tool support copy over stale aggregate locale content', async () => {
      const aggregateBase64 = readAggregateToolMessages('base64');
      const splitBase64 = readSplitToolMessages('base64');
      const base64Messages = await loadToolMessages('en', 'base64');

      expect(base64Messages.name).toBe(aggregateBase64.name);
      for (const key of splitSupportKeys) {
        if (splitBase64[key] !== undefined) {
          expect(base64Messages[key]).toEqual(splitBase64[key]);
        }
      }
    });

    it('keeps JWT decoder support copy aligned to decoder intent instead of debugger copy', async () => {
      const splitJwtDecoder = readSplitToolMessages('jwt-decoder');
      const jwtDecoderMessages = await loadToolMessages('en', 'jwt-decoder');

      expect(jwtDecoderMessages.name).toBe('JWT Decoder');
      expect(jwtDecoderMessages.detailed_description).toBe(splitJwtDecoder.detailed_description);
      expect(String(jwtDecoderMessages.detailed_description)).toContain('JWT Decoder');
      expect(String(jwtDecoderMessages.detailed_description)).not.toContain('JWT Debugger');
    });

    it('keeps crawler-heavy tool detail pages on lightweight translation loaders', () => {
      expect(toolDetailPageSource).toContain('loadBaseUiMessages');
      expect(toolDetailPageSource).toContain('loadToolPageMessages');
      expect(toolDetailPageSource).not.toContain('loadBaseMessages');
      expect(toolDetailPageSource).not.toContain('loadToolMessages');
    });

    it('loads SSR translation assets from the current request origin', () => {
      expect(homePageSource).toContain('loadBaseMessages(locale, Astro.url)');
      expect(toolsPageSource).toContain('loadBaseMessages(locale, Astro.url)');
      expect(toolDetailPageSource).toContain('loadToolPageMessages(locale, tool.slug, Astro.url)');
      expect(toolDetailPageSource).toContain('loadBaseUiMessages(locale, Astro.url)');
      expect(llmsPageSource).toContain("buildLlmsContent('en', new URL(request.url))");
    });
  });
});
