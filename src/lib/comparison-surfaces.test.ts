import { describe, expect, it } from 'vitest';
import {
  buildComparisonDiscoveryIndex,
  buildComparisonGuides,
  getComparisonGuide,
  getComparisonUiCopy,
} from './comparison-surfaces';

const categoryNames = {
  text: 'Text',
  development: 'Development',
  encoding: 'Encoding',
  converters: 'Converters',
  image: 'Image',
  generators: 'Generators',
  charts: 'Charts',
  security: 'Security',
} as const;

const toolNames = {
  'word-counter': 'Word Counter',
  'line-counter': 'Line Counter',
  'text-statistics': 'Text Statistics',
  'document-word-counter': 'Document Word Counter',
  'case-converter': 'Case Converter',
  'text-cleaner': 'Text Cleaner',
  'text-deduplicator': 'Text Deduplicator',
  'text-sorter': 'Text Sorter',
  'diff-checker': 'Diff Checker',
  'text-compare': 'Text Compare',
  'text-diff-patch': 'Text Diff Patch',
  'markdown-preview': 'Markdown Preview',
  'text-to-slug': 'Text to Slug',
  'reading-time-calculator': 'Reading Time Calculator',
  'json-formatter': 'JSON Formatter',
  'json-viewer': 'JSON Viewer',
  'json-sorter': 'JSON Sorter',
  'json-minifier': 'JSON Minifier',
  'json-schema-validator': 'JSON Schema Validator',
  'json-path-tester': 'JSONPath Tester',
  'json-path-finder': 'JSONPath Finder',
  'json-diff': 'JSON Diff',
  'json-merger': 'JSON Merger',
  'json-flattener': 'JSON Flattener',
  'json-to-csv': 'JSON to CSV',
  'json-to-yaml': 'JSON to YAML',
  'json-to-xml': 'JSON to XML',
  'json-to-typescript': 'JSON to TypeScript',
  'image-compressor': 'Image Compressor',
  'svg-optimizer': 'SVG Optimizer',
  'image-to-webp': 'Image to WebP',
  'image-converter': 'Image Converter',
  'svg-to-image': 'SVG to Image',
  'image-to-base64': 'Image to Base64',
  'image-resizer': 'Image Resizer',
  'image-cropper': 'Image Cropper',
  'placeholder-image': 'Placeholder Image',
  'favicon-generator': 'Favicon Generator',
  'image-watermark': 'Image Watermark',
  'qr-generator': 'QR Generator',
  'meta-tag-generator': 'Meta Tag Generator',
  'robots-txt-generator': 'Robots.txt Generator',
  'sitemap-generator': 'Sitemap Generator',
  'open-graph-generator': 'Open Graph Generator',
  'twitter-card-generator': 'Twitter Card Generator',
  'opengraph-preview': 'Open Graph Preview',
  'jwt-decoder': 'JWT Decoder',
  'jwt-payload-decoder': 'JWT Payload Decoder',
  'jwt-debugger': 'JWT Debugger',
  'jwt-generator': 'JWT Generator',
  'hmac-generator': 'HMAC Generator',
  'password-generator': 'Password Generator',
  'hash-generator': 'Hash Generator',
  'checksum-verifier': 'Checksum Verifier',
  'text-hash-comparator': 'Text Hash Comparator',
  'bar-chart-generator': 'Bar Chart Generator',
  'line-chart-generator': 'Line Chart Generator',
  'area-chart-generator': 'Area Chart Generator',
  'waterfall-chart-generator': 'Waterfall Chart Generator',
  'pie-chart-generator': 'Pie Chart Generator',
  'doughnut-chart-generator': 'Doughnut Chart Generator',
  'radar-chart-generator': 'Radar Chart Generator',
  'scatter-chart-generator': 'Scatter Chart Generator',
  'bubble-chart-generator': 'Bubble Chart Generator',
  'heatmap-chart-generator': 'Heatmap Chart Generator',
  'boxplot-chart-generator': 'Boxplot Chart Generator',
  'sankey-chart-generator': 'Sankey Chart Generator',
  'treemap-chart-generator': 'Treemap Chart Generator',
  'gantt-chart-generator': 'Gantt Chart Generator',
  'timeline-chart-generator': 'Timeline Chart Generator',
} as const;

const toolDescriptions = Object.fromEntries(
  Object.keys(toolNames).map((slug) => [slug, `${toolNames[slug as keyof typeof toolNames]} description`])
) as Record<string, string>;

describe('comparison surfaces', () => {
  it('builds localized guides with stable compare hrefs', () => {
    const guides = buildComparisonGuides('en', categoryNames, toolNames, toolDescriptions);

    expect(guides).toHaveLength(6);
    expect(guides[0]?.slug).toBe('choose-text-tool');
    expect(guides[1]?.slug).toBe('choose-jwt-tool');
    expect(guides[0]?.href).toMatch(/^\/en\/compare\//);
    expect(guides[0]?.representativeTools.length).toBeGreaterThan(0);
    expect(guides.some((guide) => guide.slug === 'choose-text-tool')).toBe(true);
    expect(guides.some((guide) => guide.slug === 'choose-jwt-tool')).toBe(true);
    expect(guides.some((guide) => guide.slug === 'choose-chart-type')).toBe(true);
  });

  it('returns a single guide by slug', () => {
    const guide = getComparisonGuide('en', 'choose-json-tool', categoryNames, toolNames, toolDescriptions);

    expect(guide?.slug).toBe('choose-json-tool');
    expect(guide?.workflows.some((workflow) => workflow.tools.some((tool) => tool.slug === 'json-formatter'))).toBe(true);
  });

  it('exposes compare guides to discovery candidates with href routing', () => {
    const candidates = buildComparisonDiscoveryIndex('en', categoryNames, toolNames, toolDescriptions);

    expect(candidates[0]).toMatchObject({
      slug: 'choose-text-tool',
      kind: 'comparison',
      href: expect.stringMatching(/^\/en\/compare\//),
      categoryName: getComparisonUiCopy('en').comparisonLabel,
    });
  });
});
