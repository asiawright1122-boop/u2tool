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
  encoding: 'Encoding',
  finance: 'Finance',
  fun: 'Fun',
  math: 'Math',
  network: 'Network',
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
  'compound-interest-calculator': 'Compound Interest Calculator',
  'database-connection-tester': 'Database Connection Tester',
  'csv-to-vcard-converter': 'CSV to vCard Converter',
  'document-word-counter': 'Document Word Counter',
  'gantt-chart-generator': 'Gantt Chart Generator',
  'hex-editor': 'Hex Editor',
  'iban-validator': 'IBAN Validator',
  'love-calculator': 'Love Calculator',
  'passport-photo-maker': 'Passport Photo Maker',
  'world-clock': 'World Clock',
} satisfies Record<string, string>;

const toolDescriptions = Object.fromEntries(
  Object.entries(toolNames).map(([slug, name]) => [slug, `${name} description`])
);

describe('discovery surface governance', () => {
  it('builds the recovery-aware category spotlight order with localized links', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions);

    expect(spotlights.slice(0, 7).map((spotlight) => spotlight.category)).toEqual([
      'text',
      'converters',
      'charts',
      'development',
      'encoding',
      'image',
      'network',
    ]);

    for (const spotlight of spotlights) {
      expect(spotlight.href).toBe(`/en/categories/${spotlight.category}/`);
    }
  });

  it('only exposes representative tools from the intended category', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions);

    for (const spotlight of spotlights) {
      for (const tool of spotlight.tools) {
        expect(getToolBySlug(tool.slug)?.category).toBe(spotlight.category);
        expect(tool.href).toBe(`/en/tools/${tool.slug}/`);
      }
    }
  });

  it('surfaces GSC recovery cohort tools in the default category discovery set', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions);
    const slugsByCategory = new Map(
      spotlights.map((spotlight) => [spotlight.category, spotlight.tools.map((tool) => tool.slug)])
    );

    expect(spotlights.map((spotlight) => spotlight.category)).toEqual([
      'text',
      'converters',
      'charts',
      'development',
      'encoding',
      'image',
      'network',
      'finance',
      'math',
      'office',
      'fun',
      'security',
    ]);
    expect(slugsByCategory.get('text')).toContain('document-word-counter');
    expect(slugsByCategory.get('converters')).toContain('csv-to-vcard-converter');
    expect(slugsByCategory.get('charts')).toContain('gantt-chart-generator');
    expect(slugsByCategory.get('charts')).toContain('venn-diagram-generator');
    expect(slugsByCategory.get('development')).toContain('html-preview');
    expect(slugsByCategory.get('development')).toContain('merge-conflict-resolver');
    expect(slugsByCategory.get('development')).toContain('go-formatter');
    expect(slugsByCategory.get('encoding')).toContain('hex-editor');
    expect(slugsByCategory.get('image')).toContain('passport-photo-maker');
    expect(slugsByCategory.get('image')).toContain('image-resizer');
    expect(slugsByCategory.get('image')).toContain('image-cropper');
    expect(slugsByCategory.get('image')).toContain('gif-maker');
    expect(slugsByCategory.get('network')).toContain('database-connection-tester');
    expect(slugsByCategory.get('finance')).toContain('iban-validator');
    expect(slugsByCategory.get('math')).toContain('compound-interest-calculator');
    expect(slugsByCategory.get('math')).toContain('tile-calculator');
    expect(slugsByCategory.get('office')).toContain('world-clock');
    expect(slugsByCategory.get('fun')).toContain('love-calculator');
  });

  it('builds machine-readable item list data from the spotlight set', () => {
    const spotlights = buildCategoryDiscoverySpotlights('en', categoryNames, toolNames, toolDescriptions, 3);
    const itemList = buildCategoryDiscoveryItemList('https://u2tool.com', spotlights);
    const elements = itemList.itemListElement as Array<Record<string, unknown>>;

    expect(itemList.numberOfItems).toBe(3);
    expect(elements[0]?.position).toBe(1);
    expect(elements[0]?.url).toBe('https://u2tool.com/en/categories/text/');
  });
});
