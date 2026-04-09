import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/config/tools';
import { buildCategoryDiscoveryItemList, buildCategoryDiscoverySpotlights } from './discovery-surface';

const categoryNames = {
  text: 'Text',
  security: 'Security',
  charts: 'Charts',
  development: 'Development',
  image: 'Image',
  office: 'Office',
  converters: 'Converters',
} satisfies Record<string, string>;

const toolNames = {
  'word-counter': 'Word Counter',
  'text-statistics': 'Text Statistics',
  'password-generator': 'Password Generator',
  'jwt-debugger': 'JWT Debugger',
  'bar-chart-generator': 'Bar Chart Generator',
  'line-chart-generator': 'Line Chart Generator',
  'pdf-merger': 'PDF Merger',
  'resume-builder': 'Resume Builder',
  'image-compressor': 'Image Compressor',
  'qr-generator': 'QR Generator',
  'regex-tester': 'Regex Tester',
  'html-preview': 'HTML Preview',
  'json-schema-validator': 'JSON Schema Validator',
  'json-to-csv': 'JSON to CSV',
} satisfies Record<string, string>;

const toolDescriptions = Object.fromEntries(
  Object.entries(toolNames).map(([slug, name]) => [slug, `${name} description`])
);

describe('discovery surface governance', () => {
  it('builds the Phase 12 category spotlight order with localized links', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions);

    expect(spotlights.slice(0, 6).map((spotlight) => spotlight.category)).toEqual([
      'text',
      'security',
      'charts',
      'development',
      'image',
      'office',
    ]);

    for (const spotlight of spotlights) {
      expect(spotlight.href).toBe(`/en/categories/${spotlight.category}`);
    }
  });

  it('only exposes representative tools from the intended category', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions);

    for (const spotlight of spotlights) {
      for (const tool of spotlight.tools) {
        expect(getToolBySlug(tool.slug)?.category).toBe(spotlight.category);
        expect(tool.href).toBe(`/en/tools/${tool.slug}`);
      }
    }
  });

  it('builds machine-readable item list data from the spotlight set', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions, 3);
    const itemList = buildCategoryDiscoveryItemList('https://u2tool.com', spotlights);
    const elements = itemList.itemListElement as Array<Record<string, unknown>>;

    expect(itemList.numberOfItems).toBe(3);
    expect(elements[0]?.position).toBe(1);
    expect(elements[0]?.url).toBe('https://u2tool.com/en/categories/text');
  });
});
